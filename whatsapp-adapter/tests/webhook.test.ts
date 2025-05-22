import request from 'supertest'
import app from '../src/index'

describe('webhook handler', () => {
  test('handles twilio payload', async () => {
    const resp = await request(app)
      .post('/webhook?provider=twilio&organization_id=org1')
      .send({ From: '+1234567890', Body: 'hi', Timestamp: 'now' })
    expect(resp.status).toBe(200)
    expect(resp.body.ok).toBe(true)
  })

  test('handles 360dialog payload', async () => {
    const payload = { messages: [{ from: '123', text: { body: 'hello' }, timestamp: '1' }] }
    const resp = await request(app)
      .post('/webhook?provider=d360&organization_id=org1')
      .send(payload)
    expect(resp.status).toBe(200)
    expect(resp.body.ok).toBe(true)
  })
})
