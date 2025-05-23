import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ChatDashboard from '../../../web/src/components/ChatDashboard'

vi.mock('../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({
    messages: [
      { id: '1', sender: 'customer', content: 'hi', created_at: '' },
      { id: '2', sender: 'agent', content: 'hello', created_at: '' }
    ],
    sendMessage: vi.fn()
  })
}))

vi.mock('../../../web/src/lib/supabase', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) })) }
}))

describe('MessageBubble', () => {
  it('differentiates sender roles', async () => {
    render(<ChatDashboard />)
    const rows = await screen.findAllByTestId('message-row')
    expect(rows[0].style.justifyContent).toBe('flex-start')
    expect(rows[1].style.justifyContent).toBe('flex-end')
  })
})
