import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts'
import { handleReceiveMessage } from '../message-handler.ts'
import { createMockClient } from '../test-utils/mockSupabaseClient.ts'
import { sampleMessage } from '../test-utils/mockMessages.ts'

Deno.test('receive-message saves message and creates conversation', async () => {
  const insertedConvos: any[] = []
  const insertedMsgs: any[] = []

  const base = createMockClient({ conversation: { assigned_user_id: null } })
  const supabase = {
    ...base,
    from(table: string) {
      const tbl = base.from(table)
      if (table === 'conversations') {
        return {
          ...tbl,
          insert(vals: any) {
            insertedConvos.push(vals)
            return {
              select: () => ({
                single: () =>
                  Promise.resolve({ data: { id: 'conv1', ...vals } })
              }),
              single: () => Promise.resolve({ data: { id: 'conv1', ...vals } })
            }
          }
        }
      }
      if (table === 'messages') {
        return {
          ...tbl,
          insert(vals: any) {
            insertedMsgs.push(vals)
            // tbl may have insert method from mock client
            return (tbl as any).insert(vals)
          }
        }
      }
      return tbl
    }
  }

  const res = await handleReceiveMessage(sampleMessage as any, {
    supabase,
    fetcher: async () => ({}) as any
  })

  assertEquals(res.ok, true)
  assertEquals(res.conversation_id, 'conv1')
  assertEquals(insertedConvos.length, 1)
  assertEquals(insertedMsgs.length, 1)
})
