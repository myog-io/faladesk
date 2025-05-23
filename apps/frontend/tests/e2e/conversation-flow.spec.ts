import { render, screen, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, jest } from '@jest/globals'
import ChatDashboard from '../../../web/src/components/ChatDashboard'

const sendMock = jest.fn()

jest.mock('../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: (id: string | null) => ({
    messages: id ? [{ id: 'm1', sender: 'customer', content: 'hi', created_at: '' }] : [],
    sendMessage: sendMock
  })
}))

jest.mock('../../../web/src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({ select: jest.fn(() => ({ order: jest.fn(() => Promise.resolve({ data: [{ id: 'c1', customer_name: 'Alice' }], error: null })) })) }))
  }
}))

describe('Conversation flow', () => {
  it('open conversation and reply', async () => {
    render(<ChatDashboard />)
    fireEvent.press(await screen.findByText('Alice'))
    const msg = await screen.findByText('hi')
    expect(msg).toBeTruthy()

    const input = await screen.findByTestId('reply-box')
    fireEvent.changeText(input, 'hello')
    fireEvent(input, 'submitEditing')
    expect(sendMock).toHaveBeenCalledWith('hello')
  })
})
