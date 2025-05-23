import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useRealtimeMessages } from '../../../web/src/lib/useRealtimeMessages'

vi.mock('../../../web/src/lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        })),
        insert: vi.fn()
      }),
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis()
      })),
      removeChannel: vi.fn()
    }
  }
})

describe('useRealtimeMessages', () => {
  it('fetches messages and sends new ones', async () => {
    const { result } = renderHook(() => useRealtimeMessages('conv1'))

    await act(async () => {
      await result.current.sendMessage('hello')
    })

    const { supabase } = await import('../../../web/src/lib/supabase')
    expect((supabase.from as any).mock.calls[0][0]).toBe('messages')
    expect((supabase.from as any).mock.calls[0][1]).toBeUndefined()
    expect((supabase.from as any).mock.lastCall[0]).toBe('messages')
    expect(supabase.from().insert).toHaveBeenCalledWith({
      conversation_id: 'conv1',
      sender: 'agent',
      content: 'hello'
    })
  })
})
