import { render, screen, fireEvent } from '@testing-library/react'
import Login from '../components/Login'
import { I18nProvider } from '../i18n'
import { vi } from 'vitest'

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
  supabase: { from: vi.fn(() => ({ insert: vi.fn() })) }
}))

vi.mock('../lib/useUserOrganization', () => ({
  useUserOrganization: () => ({ user: { id: 'u1', organization_id: 'org1', language: 'en' }, loading: false })
}))

const signInWithMagicLink = vi.fn()
const signInWithPassword = vi.fn()

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({
    signInWithMagicLink,
    signInWithPassword,
  })
}))

describe('Login form', () => {
  beforeEach(() => {
    signInWithMagicLink.mockReset()
    signInWithPassword.mockReset()
  })

  it('submits email/password', async () => {
    render(
      <I18nProvider initialLang="en">
        <Login />
      </I18nProvider>
    )

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'agent@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret' }
    })

    fireEvent.submit(screen.getByTestId('login-form'))

    expect(signInWithPassword).toHaveBeenCalledWith('agent@example.com', 'secret')
  })

  it('sends magic link', () => {
    render(
      <I18nProvider initialLang="en">
        <Login />
      </I18nProvider>
    )

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'agent@example.com' }
    })

    fireEvent.click(screen.getByText('Send Magic Link'))

    expect(signInWithMagicLink).toHaveBeenCalledWith('agent@example.com')
  })
})
