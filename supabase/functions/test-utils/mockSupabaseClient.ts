export function createMockClient(data: {
  conversation?: any
  messages?: any[]
  user?: any
  organization?: any
} = {}) {
  return {
    from(table: string) {
      switch (table) {
        case 'conversations':
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: data.conversation })
              })
            })
          }
        case 'users':
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: data.user })
              })
            })
          }
        case 'messages':
          return {
            select: () => ({
              eq: () => ({
                order: () => ({
                  limit: () => Promise.resolve({ data: data.messages })
                }),
                single: () => Promise.resolve({ data: data.messages?.[0] })
              })
            }),
            insert: (vals: any) => ({
              select: () => ({
                single: () =>
                  Promise.resolve({ data: { id: 'new-id', ...vals } })
              }),
              single: () =>
                Promise.resolve({ data: { id: 'new-id', ...vals } })
            })
          }
        case 'organizations':
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: data.organization })
              })
            })
          }
        case 'invites':
          return {
            insert: (vals: any) => Promise.resolve({ data: vals, error: null })
          }
        default:
          return {
            select: () => ({ single: () => Promise.resolve({ data: {} }) })
          }
      }
    },
    auth: {
      admin: {
        inviteUserByEmail: async (_email: string) => ({ data: {}, error: null })
      }
    },
    channel() {
      return {
        send: async () => {},
        unsubscribe: async () => {}
      }
    }
  }
}
