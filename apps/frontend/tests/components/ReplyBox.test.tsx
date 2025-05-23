import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ChatDashboard from '../../../../web/src/components/ChatDashboard'

const sendMock = vi.fn()

vi.mock('../../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({ messages: [], sendMessage: sendMock })
}))

vi.mock('../../../../web/src/lib/supabase', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) })) }
}))

describe('ReplyBox', () => {
  it('calls sendMessage function and clears input', async () => {
    render(<ChatDashboard />)
    const input = await screen.findByTestId('reply-box')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)
    expect(sendMock).toHaveBeenCalledWith('hello')
    expect((input as HTMLInputElement).value).toBe('')
  })
})
