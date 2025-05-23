import { render, screen } from '@testing-library/react'
import Login from '../components/Login'
import { I18nProvider } from '../i18n'
import { vi } from 'vitest'

vi.mock('@gluestack-ui/themed', () => {
  const React = require('react')
  return {
    VStack: (p: any) => <div {...p} />,
    Input: (p: any) => <div {...p} />,
    InputField: (p: any) => <input {...p} />,
    Button: ({ onPress, ...p }: any) => <button onClick={onPress} {...p} />,
    Text: (p: any) => <span {...p} />,
  }
})

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({ signInWithMagicLink: vi.fn(), signInWithPassword: vi.fn() })
}))

describe('Login translations', () => {
  it('renders portuguese text', () => {
    render(
      <I18nProvider initialLang="pt-BR">
        <Login />
      </I18nProvider>
    )
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })
})
