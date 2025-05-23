import { render, screen } from '@testing-library/react-native'
import { describe, it, expect, jest } from '@jest/globals'
import ChatDashboard from '../../../web/src/components/ChatDashboard'

jest.mock('../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({ messages: [], sendMessage: jest.fn() })
}))

jest.mock('../../../web/src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [
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

    expect(await screen.findByText('Alice')).toBeTruthy()
    expect(await screen.findByText('Bob')).toBeTruthy()
  })
})
