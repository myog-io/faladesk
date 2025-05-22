// Edge Function that generates an AI response to the latest message
// in a conversation using OpenAI and stores it back to the database.
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { conversation_id } = await req.json()
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const { data: lastMessage } = await supabase
    .from('messages')
    .select('content')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const prompt = `Reply to the customer:\n${lastMessage.content}`

  const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  }).then(res => res.json())

  const content = aiResp.choices?.[0]?.message?.content ?? ''
  await supabase.from('messages').insert({ conversation_id, sender: 'ai', content })

  return new Response(JSON.stringify({ ok: true, content }), { headers: { 'Content-Type': 'application/json' } })
})

