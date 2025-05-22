import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Payload {
  conversation_id: string
  message_id?: string
  organization_id?: string
}

interface HandleResult {
  acted: boolean
  reply?: string
}

export async function handleRouteToAI(
  payload: Payload,
  opts: { supabase?: any; fetcher?: typeof fetch } = {}
): Promise<HandleResult> {
  const supabase =
    opts.supabase ??
    createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
  const doFetch = opts.fetcher ?? fetch

  const { conversation_id, organization_id } = payload

  // verify payload
  if (!conversation_id) {
    throw new Error('invalid payload')
  }

  // check conversation assignment
  const { data: convo } = await supabase
    .from('conversations')
    .select('assigned_user_id')
    .eq('id', conversation_id)
    .single()

  if (!convo) {
    throw new Error('conversation not found')
  }

  if (convo.assigned_user_id) {
    const { data: user } = await supabase
      .from('users')
      .select('name')
      .eq('id', convo.assigned_user_id)
      .single()
    const aiName = Deno.env.get('DEFAULT_AGENT_NAME') ?? 'Falabot'
    if (!user || user.name !== aiName) {
      return { acted: false }
    }
  }

  // fetch last messages for context
  const { data: history } = await supabase
    .from('messages')
    .select('sender, content')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: false })
    .limit(10)

  const context = (history ?? [])
    .reverse()
    .map((m: any) => ({
      role: m.sender === 'customer' ? 'user' : 'assistant',
      content: m.content ?? ''
    }))

  // organization tone if defined
  let tone = 'friendly'
  if (organization_id) {
    const { data: org } = await supabase
      .from('organizations')
      .select('metadata')
      .eq('id', organization_id)
      .single()
    if (org?.metadata?.tone) {
      tone = org.metadata.tone
    }
  }
  const aiName = Deno.env.get('DEFAULT_AGENT_NAME') ?? 'Falabot'
  const systemPrompt = `You are ${aiName}, an AI support agent. Respond in a ${tone} tone.`

  const aiResp = await doFetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
    },
    body: JSON.stringify({
      model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4',
      messages: [{ role: 'system', content: systemPrompt }, ...context]
    })
  }).then((res) => res.json())

  const content = aiResp.choices?.[0]?.message?.content?.trim() ?? ''

  const { data: message } = await supabase
    .from('messages')
    .insert({ conversation_id, sender: 'ai', content })
    .select()
    .single()

  try {
    const channel = supabase.channel('ai-replies')
    await channel.send({ type: 'broadcast', event: 'new', payload: message })
    await channel.unsubscribe()
  } catch (_e) {
    console.log('broadcast failed')
  }

  return { acted: true, reply: content }
}

serve(async (req) => {
  try {
    const payload: Payload = await req.json()
    const result = await handleRouteToAI(payload)
    if (!result.acted) {
      return new Response(null, { status: 204 })
    }
    return new Response(
      JSON.stringify({ success: true, reply: result.reply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error(err)
    const status = err.message === 'invalid payload' ? 400 : 500
    return new Response(err.message, { status })
  }
})

