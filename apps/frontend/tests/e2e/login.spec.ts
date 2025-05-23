import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import Login from '../../../web/src/components/Login'

const passwordLoginMock = vi.fn()
const magicLoginMock = vi.fn()
vi.mock('../../../web/src/lib/AuthProvider', () => ({
  useAuth: () => ({
    signInWithPassword: passwordLoginMock,
    signInWithMagicLink: magicLoginMock
  })
}))

describe('Login flow', () => {
  it('user can login with password', async () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passInput = screen.getByPlaceholderText('Password')
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.change(passInput, { target: { value: 'secret' } })
    fireEvent.submit(screen.getByTestId('login-form'))
    expect(passwordLoginMock).toHaveBeenCalledWith('user@example.com', 'secret')
  })

  it('user can request magic link', async () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
    fireEvent.click(screen.getByText('Send Magic Link'))
    expect(magicLoginMock).toHaveBeenCalledWith('user@example.com')
  })
})
