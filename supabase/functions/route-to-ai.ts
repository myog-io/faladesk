import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { conversation_id, message_id, organization_id } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // check conversation assignment
  const { data: convo } = await supabase
    .from('conversations')
    .select('assigned_user_id')
    .eq('id', conversation_id)
    .single()

  if (!convo) {
    return new Response(
      JSON.stringify({ error: 'conversation not found' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (convo.assigned_user_id) {
    return new Response(
      JSON.stringify({ ok: true, skipped: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  // fetch last messages for context
  const { data: history } = await supabase
    .from('messages')
    .select('sender, content')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: false })
    .limit(10)

  const context = (history ?? []).reverse().map((m) => ({
    role: m.sender === 'customer' ? 'user' : 'assistant',
    content: m.content ?? ''
  }))

  // organization tone if defined
  let systemPrompt = 'You are an AI support agent.'
  if (organization_id) {
    const { data: org } = await supabase
      .from('organizations')
      .select('tone')
      .eq('id', organization_id)
      .single()
    if (org?.tone) {
      systemPrompt = `Respond in a ${org.tone} tone.`
    }
  }

  const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: systemPrompt }, ...context]
    })
  }).then((res) => res.json())

  const content = aiResp.choices?.[0]?.message?.content ?? ''

  const { data: message } = await supabase
    .from('messages')
    .insert({ conversation_id, sender: 'ai', content })
    .select()
    .single()

  return new Response(
    JSON.stringify({ ok: true, message }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
