import { render, screen, fireEvent } from '@testing-library/react'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: [
          { id: '1', customer_name: 'Alice' },
          { id: '2', customer_name: 'Bob' }
        ] }))
      }))
    }))
  }
}))

vi.mock('../lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({
    messages: [
      { id: 'm1', sender: 'customer', content: 'Hi', created_at: '' },
      { id: 'm2', sender: 'agent', content: 'Hello Alice', created_at: '' }
    ],
    sendMessage: vi.fn()
  })
}))

describe('ChatDashboard routing', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('shows placeholder on root path', async () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    expect(screen.getByText('Select a chat')).toBeInTheDocument()
    await screen.findByText('Alice')
  })

  it('navigates to chat when clicking conversation', async () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    fireEvent.click(await screen.findByText('Alice'))
    expect(screen.queryByText('Select a chat')).not.toBeInTheDocument()
    expect(screen.getByText('Hello Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
