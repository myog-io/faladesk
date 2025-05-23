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

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ maybeSingle: vi.fn(() => ({ data: null, error: null })) }))
    }))
  }
}))

vi.mock('../lib/useUserOrganization', () => ({
  useUserOrganization: () => ({ user: { id: 'u1', organization_id: 'org1', language: 'en' }, loading: false, updateLanguage: vi.fn() })
}))

describe('Settings modal', () => {
  it('opens and closes properly', () => {
    render(
      <BrowserRouter>
        <I18nProvider initialLang="en">
          <ChatDashboard />
        </I18nProvider>
      </BrowserRouter>
    )
    fireEvent.click(screen.getByText('Settings'))
    expect(screen.getByText('Agent Settings')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Agent Settings')).not.toBeInTheDocument()
  })
})
