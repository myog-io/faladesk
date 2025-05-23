import { render, screen, within } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ChatDashboard from '../../../../web/src/components/ChatDashboard'

vi.mock('../../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({ messages: [], sendMessage: vi.fn() })
}))

vi.mock('../../../../web/src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({
            data: [
              {
                id: '2',
                customer_name: 'Bob',
                messages: [
                  { content: 'yo', sender: 'agent', created_at: '2023-01-03T00:00:00Z' }
                ]
              },
              {
                id: '1',
                customer_name: 'Alice',
                messages: [
                  { content: 'hello', sender: 'customer', created_at: '2023-01-02T00:00:00Z' }
                ]
              }
            ],
            error: null
          }))
          }))
      }))
    }))
  }
}))

describe('Conversation list', () => {
  it('renders conversation details sorted by recent activity', async () => {
    render(<ChatDashboard />)

    const rows = await screen.findAllByTestId('conversation-row')
    // Bob is most recent
    expect(within(rows[0]).getByText('Bob')).toBeInTheDocument()
    expect(within(rows[0]).getByText('yo')).toBeInTheDocument()
    expect(within(rows[0]).queryByTestId('unread-indicator')).toBeNull()

    expect(within(rows[1]).getByText('Alice')).toBeInTheDocument()
    expect(within(rows[1]).getByText('hello')).toBeInTheDocument()
    expect(within(rows[1]).getByTestId('unread-indicator')).toBeInTheDocument()
  })
})
