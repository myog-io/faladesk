import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import ChatDashboard from '../../../web/src/components/ChatDashboard'

const sendMock = vi.fn()

vi.mock('../../../web/src/lib/useRealtimeMessages', () => ({
  useRealtimeMessages: (id: string | null) => ({
    messages: id ? [{ id: 'm1', sender: 'customer', content: 'hi', created_at: '' }] : [],
    sendMessage: sendMock
  })
}))

vi.mock('../../../web/src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({ select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [{ id: 'c1', customer_name: 'Alice' }], error: null })) })) }))
  }
}))

describe('Conversation flow', () => {
  it('open conversation and reply', async () => {
    render(<ChatDashboard />)
    fireEvent.click(await screen.findByText('Alice'))
    const msg = await screen.findByText('hi')
    expect(msg).toBeInTheDocument()

    const input = await screen.findByTestId('reply-box')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)
    expect(sendMock).toHaveBeenCalledWith('hello')
  })
})
