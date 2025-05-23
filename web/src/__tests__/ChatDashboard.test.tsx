import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({
    messages: [
      { id: 'm1', sender: 'customer', content: 'Hi', created_at: '' },
      { id: 'm2', sender: 'agent', content: 'Hello Alice', created_at: '' }
    ],
    sendMessage: vi.fn()
  })
}))

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({
            data: [
              { id: '1', customer_name: 'Alice' },
              { id: '2', customer_name: 'Bob' }
            ],
            error: null
          })
        )
      }))
    }))
  }
}))

describe('ChatDashboard routing', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('shows placeholder on root path', () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    expect(screen.getByText('Select a chat')).toBeInTheDocument()
  })

  it('navigates to chat when clicking conversation', async () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    const convo = await screen.findByText('Alice')
    fireEvent.click(convo)
    expect(screen.queryByText('Select a chat')).not.toBeInTheDocument()
    expect(await screen.findByText('Hello Alice')).toBeInTheDocument()
    // left column still shows other conversation
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
