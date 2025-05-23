import { render, screen, fireEvent } from '@testing-library/react'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'agent1' } }, loading: false })
}))

vi.mock('../lib/useAgentPresence', () => ({
  useAgentPresence: () => ({ status: 'online', updateStatus: vi.fn() })
}))

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) })) }
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
