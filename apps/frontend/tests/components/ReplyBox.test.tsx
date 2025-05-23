import { render, screen, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, jest } from '@jest/globals'
import ChatDashboard from '../../../web/src/components/ChatDashboard'

const sendMock = jest.fn()

jest.mock('../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({ messages: [], sendMessage: sendMock })
}))

jest.mock('../../../web/src/lib/supabase', () => ({
  supabase: { from: jest.fn(() => ({ select: jest.fn(() => ({ order: jest.fn(() => Promise.resolve({ data: [], error: null })) })) })) }
}))

describe('ReplyBox', () => {
  it('calls sendMessage function and clears input', async () => {
    render(<ChatDashboard />)
    const input = await screen.findByTestId('reply-box')
    fireEvent.changeText(input, 'hello')
    fireEvent(input, 'submitEditing')
    expect(sendMock).toHaveBeenCalledWith('hello')
    expect(input.props.value).toBe('')
  })
})
