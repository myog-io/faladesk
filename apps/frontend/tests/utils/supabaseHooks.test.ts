import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useRealtimeMessages } from '../../../web/src/lib/useRealtimeMessages'
import { useAgentPresence } from '../../../web/src/lib/useAgentPresence'

vi.mock('../../../web/src/lib/supabase', () => {
  const fromMock = vi.fn((table: string) => {
    if (table === 'messages') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        })),
        insert: vi.fn()
      }
    }
    if (table === 'users') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { status: 'offline' } }))
          }))
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: {} }))
        }))
      }
    }
    return {}
  })

  return {
    supabase: {
      from: fromMock,
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

describe('useAgentPresence', () => {
  it('fetches and updates status', async () => {
    const { result } = renderHook(() => useAgentPresence('agent1'))

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.status).toBe('offline')

    await act(async () => {
      await result.current.updateStatus('online')
    })

    const { supabase } = await import('../../../web/src/lib/supabase')
    expect((supabase.from as any).mock.calls.some((c: any[]) => c[0] === 'users')).toBe(true)
    expect(supabase.from().update).toHaveBeenCalledWith({ status: 'online' })
  })
})
