import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts'
import { handleInviteUser } from '../invite-user.ts'

Deno.test('handleInviteUser stores invite and sends email', async () => {
  let inviteCalled = false
  let inserted: any = null
  const mockSupabase = {
    auth: {
      admin: {
        inviteUserByEmail: (_email: string) => {
          inviteCalled = true
          return Promise.resolve({ data: {}, error: null })
        }
      }
    },
    from(table: string) {
      if (table === 'invites') {
        return {
          insert: (vals: any) => {
            inserted = vals
            return Promise.resolve({ data: vals, error: null })
          }
        }
      }
      return {}
    }
  }

  const res = await handleInviteUser(
    { email: 'test@example.com', organization_id: 'org1' },
    { supabase: mockSupabase }
  )

  assertEquals(res.success, true)
  assertEquals(inviteCalled, true)
  assertEquals(inserted.email, 'test@example.com')
  assertEquals(inserted.organization_id, 'org1')
  assertEquals(inserted.role, 'agent')
})
