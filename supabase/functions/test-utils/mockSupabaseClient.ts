export function createMockClient() {
  return {
    from: () => ({
      insert: () => ({ select: () => Promise.resolve({ data: {} }) }),
      select: () => ({ single: () => Promise.resolve({ data: {} }) })
    })
  }
}
