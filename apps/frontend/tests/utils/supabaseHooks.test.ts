import { renderHook, act } from '@testing-library/react-native'
import { describe, it, expect, jest } from '@jest/globals'
import { useRealtimeMessages } from '../../../web/src/lib/useRealtimeMessages'
import { useAgentPresence } from '../../../web/src/lib/useAgentPresence'

jest.mock('../../../web/src/lib/supabase', () => {
  const fromMock = jest.fn((table: string) => {
    if (table === 'messages') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        })),
        insert: jest.fn()
      }
    }
    if (table === 'users') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: { status: 'offline' } }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: {} }))
        }))
      }
    }
    return {}
  })

  return {
    supabase: {
      from: fromMock,
      channel: jest.fn(() => ({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockReturnThis()
      })),
      removeChannel: jest.fn()
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
