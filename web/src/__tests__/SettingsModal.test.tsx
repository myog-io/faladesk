import { render, screen, fireEvent } from '@testing-library/react'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// ChatDashboard imports ChatView which in turn pulls in AuthProvider and
// Supabase. We mock ChatView here to avoid those modules executing and
// requiring environment variables during this test.
vi.mock('../components/ChatView', () => ({
  default: () => null
}))

describe('Settings modal', () => {
  it('opens and closes properly', () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByText('Settings'))
    expect(screen.getByText('Agent Settings')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Agent Settings')).not.toBeInTheDocument()
  })
})
