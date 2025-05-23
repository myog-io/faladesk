import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../lib/useConversations', () => ({
  useConversations: () => ({
    conversations: [
      { id: '1', customer_name: 'Alice', unread: 0 },
      { id: '2', customer_name: 'Bob', unread: 0 }
    ],
    clearUnread: vi.fn(),
  })
}))

vi.mock('../lib/useRealtimeMessages', () => ({
  useRealtimeMessages: (id: string | null) => ({
    messages: id ? [{ id: '1', sender: 'agent', content: id === '1' ? 'Hello Alice' : 'Hello Bob', created_at: '' }] : [],
    sendMessage: vi.fn(),
  })
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

  it('navigates to chat when clicking conversation', () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByText('Alice'))
    expect(screen.queryByText('Select a chat')).not.toBeInTheDocument()
    expect(screen.getByText('Hello Alice')).toBeInTheDocument()
    // left column still shows other conversation
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
