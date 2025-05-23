import { render, screen } from '@testing-library/react-native'
import { describe, it, expect, jest } from '@jest/globals'
import ChatDashboard from '../../../web/src/components/ChatDashboard'

jest.mock('../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({
    messages: [
      { id: '1', sender: 'customer', content: 'hi', created_at: '' },
      { id: '2', sender: 'agent', content: 'hello', created_at: '' }
    ],
    sendMessage: jest.fn()
  })
}))

jest.mock('../../../web/src/lib/supabase', () => ({
  supabase: { from: jest.fn(() => ({ select: jest.fn(() => ({ order: jest.fn(() => Promise.resolve({ data: [], error: null })) })) })) }
}))

describe('MessageBubble', () => {
  it('differentiates sender roles', async () => {
    render(<ChatDashboard />)
    const rows = await screen.findAllByTestId('message-row')
    expect(rows[0]).toHaveStyle({ justifyContent: 'flex-start' })
    expect(rows[1]).toHaveStyle({ justifyContent: 'flex-end' })
  })
})
