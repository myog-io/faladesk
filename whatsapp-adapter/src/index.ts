import express from 'express'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

// simple logger
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

interface NormalizedMessage {
  organization_id: string
  phone_number: string
  message_body: string
  timestamp: string
}

function normalizeTwilio(body: any): NormalizedMessage {
  return {
    organization_id: body.organization_id,
    phone_number: body.From,
    message_body: body.Body,
    timestamp: body.Timestamp || new Date().toISOString()
  }
}

function normalizeD360(body: any): NormalizedMessage {
  const msg = body.messages?.[0] || {}
  return {
    organization_id: body.organization_id,
    phone_number: msg.from,
    message_body: msg.text?.body || '',
    timestamp: msg.timestamp
      ? new Date(Number(msg.timestamp) * 1000).toISOString()
      : new Date().toISOString()
  }
}

async function handleMessage(msg: NormalizedMessage) {
  const { organization_id, phone_number, message_body, timestamp } = msg
  // find open conversation
  let { data: conversation } = await supabase
    .from('conversations')
    .select('id, assigned_user_id')
    .eq('organization_id', organization_id)
    .eq('customer_name', phone_number)
    .in('status', ['open', 'pending'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!conversation) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        organization_id,
        customer_name: phone_number,
        channel: 'whatsapp'
      })
      .select()
      .single()
    if (error) throw error
    conversation = data
  }

  const { error: msgErr, data: msgData } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation.id,
      sender: 'customer',
      content: message_body,
      metadata: { timestamp }
    })
    .select()
    .single()
  if (msgErr) throw msgErr

  if (conversation.assigned_user_id) {
    try {
      await fetch(`${process.env.SUPABASE_URL}/functions/v1/route-to-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          message_id: msgData.id,
          organization_id
        })
      })
    } catch (e) {
      console.error('route-to-ai error', e)
    }
  }
}

app.post('/webhook', async (req, res) => {
  try {
    const provider = (req.query.provider as string) || 'twilio'
    const orgId = (req.query.organization_id as string) || req.body.organization_id
    if (!orgId) {
      return res.status(400).json({ error: 'missing organization_id' })
    }
    let payload: NormalizedMessage
    if (provider === 'twilio') {
      payload = normalizeTwilio({ ...req.body, organization_id: orgId })
    } else {
      payload = normalizeD360({ ...req.body, organization_id: orgId })
    }
    await handleMessage(payload)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }
})

app.post('/test', async (req, res) => {
  const provider = (req.query.provider as string) || 'twilio'
  req.query.organization_id = req.query.organization_id || 'test-org'
  const resp = await fetch('http://localhost:3000/webhook?provider=' + provider + '&organization_id=' + req.query.organization_id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  }).then(r => r.json()).catch(() => ({ ok: false }))
  res.json(resp)
})

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'server error' })
})

const port = process.env.PORT || 3000
if (require.main === module) {
  app.listen(port, () => {
    console.log('whatsapp adapter listening on ' + port)
  })
}

export default app
