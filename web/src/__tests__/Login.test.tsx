import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import Login from '../components/Login'

vi.mock('@gluestack-ui/themed', () => {
  const React = require('react')
  return {
    VStack: (props: any) => <div {...props} />,
    Input: (props: any) => <div {...props} />,
    InputField: (props: any) => <input {...props} />,
    Button: ({ onPress, ...props }: any) => (
      <button onClick={onPress} {...props} />
    ),
    Text: (props: any) => <span {...props} />,
  }
})

const passwordLoginMock = vi.fn()
const magicLoginMock = vi.fn()
vi.mock('../lib/AuthProvider', () => ({
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
