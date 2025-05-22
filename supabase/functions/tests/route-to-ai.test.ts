import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts'
import { handleRouteToAI } from '../route-to-ai.ts'
import { createMockClient } from '../test-utils/mockSupabaseClient.ts'

Deno.test('route-to-ai returns AI reply', async () => {
  const mockFetch = (_url: string, _opts: any) =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: 'Sure, I can help!' } }]
        })
    })

  const client = createMockClient({
    conversation: { assigned_user_id: null },
    messages: [{ sender: 'customer', content: 'Hello?' }],
    organization: { metadata: { tone: 'formal' } }
  })

  const res = await handleRouteToAI(
    { conversation_id: '1', message_id: 'm1', organization_id: 'o1' },
    { supabase: client, fetcher: mockFetch as any }
  )

  assertEquals(res.acted, true)
  assertEquals(res.reply, 'Sure, I can help!')
})
