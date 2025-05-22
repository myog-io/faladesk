// Example Edge Function to receive webhook events from messaging channels
// and store incoming messages as part of conversations.
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const body = await req.json()
  const { conversation_id, content, channel } = body

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)

  // ensure conversation exists
  let convId = conversation_id
  if (!convId) {
    const { data } = await supabase.from('conversations').insert({ channel }).select().single()
    convId = data.id
  }

  await supabase.from('messages').insert({ conversation_id: convId, sender: 'customer', content })

  return new Response(JSON.stringify({ ok: true, conversation_id: convId }), { headers: { 'Content-Type': 'application/json' } })
})

