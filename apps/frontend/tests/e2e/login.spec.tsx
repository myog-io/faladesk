import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import Login from '../../../../web/src/components/Login'

const signInMock = vi.fn()
vi.mock('../../../../web/src/lib/AuthProvider', () => ({
  useAuth: () => ({ signIn: signInMock })
}))

describe('Login flow', () => {
  it('user can login and view inbox', async () => {
    render(<Login />)
    const input = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(input, { target: { value: 'user@example.com' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)
    expect(signInMock).toHaveBeenCalledWith('user@example.com')
  })
})
