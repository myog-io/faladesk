import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ChatDashboard from '../../../web/src/components/ChatDashboard'

vi.mock('../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({ messages: [], sendMessage: vi.fn() })
}))

vi.mock('../../../web/src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [
          { id: '1', customer_name: 'Alice' },
          { id: '2', customer_name: 'Bob' }
        ], error: null }))
      }))
    })
  }
}))

describe('Conversation list', () => {
  it('renders conversations from supabase', async () => {
    render(<ChatDashboard />)

    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(await screen.findByText('Bob')).toBeInTheDocument()
  })
})
