import { render, screen, fireEvent } from '@testing-library/react'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'

import { I18nProvider } from '../i18n'
import { vi } from 'vitest'

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'agent1' } }, loading: false })
}))

vi.mock('../lib/useAgentPresence', () => ({
  useAgentPresence: () => ({ status: 'online', updateStatus: vi.fn() })
}))

vi.mock('../lib/useUserOrganization', () => ({
  useUserOrganization: () => ({ user: { id: 'u1', organization_id: 'org1', language: 'en' }, loading: false })
}))

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) })) }

}))
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
