// Handle incoming messages from adapters and store them
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Payload {
  customer_name: string
  channel: string
  conversation_id?: string
  content: string
  adapter?: { organization_id?: string }
}

export async function handleReceiveMessage(
  payload: Payload,
  opts: { supabase?: any; fetcher?: typeof fetch } = {}
) {
  const supabase =
    opts.supabase ??
    createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
  const doFetch = opts.fetcher ?? fetch

  const { customer_name, channel, conversation_id, content } = payload

  let convId = conversation_id
  if (!convId) {
    const { data } = await supabase
      .from('conversations')
      .insert({
        channel,
        organization_id: payload.adapter?.organization_id
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
    await doFetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({ conversation_id: convId })
    })
  }

  return { ok: true, conversation_id: convId }
}

serve(async (req) => {
  const payload: Payload = await req.json()
  const result = await handleReceiveMessage(payload)
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
})
