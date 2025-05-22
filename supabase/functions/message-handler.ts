// Handle incoming messages from adapters and store them
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const body = await req.json()
  const { customer_name, channel, conversation_id, content } = body

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let convId = conversation_id
  if (!convId) {
    const { data } = await supabase
      .from('conversations')
      .insert({
        channel,
        organization_id: body.adapter?.organization_id
      })
      .select()
      .single()
    convId = data.id
  }

  await supabase.from('messages').insert({
    conversation_id: convId,
    sender: 'customer',
    content,
    metadata: { customer_name, channel }
  })

  const { data: conv } = await supabase
    .from('conversations')
    .select('assigned_user_id')
    .eq('id', convId)
    .single()

  if (!conv.assigned_user_id) {
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({ conversation_id: convId })
    })
  }

  return new Response(
    JSON.stringify({ ok: true, conversation_id: convId }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
