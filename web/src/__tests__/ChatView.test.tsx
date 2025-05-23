import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import ChatView from '../components/ChatView'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n'
import { vi } from 'vitest'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('../../shims/react-router-dom.tsx')
  return { ...actual, useParams: () => ({ chatId: '1' }) }
})

vi.mock('@gluestack-ui/themed', () => {
  const React = require('react')
  return {
    VStack: (props: any) => <div {...props} />,
    Input: (props: any) => <div {...props} />,
    InputField: (props: any) => <input {...props} />,
    Button: ({ onPress, ...p }: any) => <button onClick={onPress} {...p} />,
    Text: (props: any) => <span {...props} />,
  }
})

vi.mock('../lib/supabase', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn() })) }
}))

vi.mock('../lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({ sendMessage: vi.fn() })
}))

vi.mock('../components/ConversationThread', () => ({
  __esModule: true,
  default: () => <div data-testid="conversation-thread" />
}))

vi.mock('../components/MessageComposer', () => ({
  __esModule: true,
  default: () => <div />
}))

const updateStatus = vi.fn()

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'agent1' } } })
}))

vi.mock('../lib/useAgentPresence', () => ({
  useAgentPresence: () => ({ status: 'online', updateStatus })
}))

vi.mock('../lib/useUserOrganization', () => ({
  useUserOrganization: () => ({ user: { id: 'u1', organization_id: 'org1', language: 'en' }, loading: false })
}))

describe('ChatView', () => {
  beforeEach(() => {
    updateStatus.mockReset()
    window.history.pushState({}, '', '/chat/1')
  })

  it('displays messages for chat and sends new ones', async () => {
    render(
      <BrowserRouter>
        <I18nProvider initialLang="en">
          <ChatView />
        </I18nProvider>
      </BrowserRouter>
    )

    expect(updateStatus).toHaveBeenCalledWith('online')
    await screen.findByText('Hello Alice')

    // ensure the reply box exists
    const input = screen.getByTestId('reply-box') as HTMLInputElement
    expect(input).toBeInTheDocument()
  })
})
