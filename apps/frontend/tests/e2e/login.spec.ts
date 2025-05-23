import { render, screen, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, jest } from '@jest/globals'
import Login from '../../../web/src/components/Login'

const passwordLoginMock = jest.fn()
const magicLoginMock = jest.fn()
jest.mock('../../../web/src/lib/AuthProvider', () => ({
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
    fireEvent.changeText(emailInput, 'user@example.com')
    fireEvent.changeText(passInput, 'secret')
    fireEvent.press(screen.getByTestId('login-form'))
    expect(passwordLoginMock).toHaveBeenCalledWith('user@example.com', 'secret')
  })

  it('user can request magic link', async () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText('you@example.com')
    fireEvent.changeText(emailInput, 'user@example.com')
    fireEvent.press(screen.getByText('Send Magic Link'))
    expect(magicLoginMock).toHaveBeenCalledWith('user@example.com')
  })
})
