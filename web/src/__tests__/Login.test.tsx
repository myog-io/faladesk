vi.mock('react-native', () => ({
  View: () => null,
  Text: () => null,
  StyleSheet: { create: () => ({}) },
  BackHandler: {},
  Platform: {},
  StatusBar: {},
  Dimensions: { get: () => ({}) },
  I18nManager: {},
  PanResponder: {},
  default: {}
}))
vi.mock('react-native-svg', () => ({ Svg: () => null, default: () => null }))
vi.mock('@gluestack-style/react', () => ({ styled: () => () => null }))
vi.mock('@gluestack-ui/provider', () => ({
  GluestackUIContextProvider: ({ children }: any) => children,
  createProvider: () => ({ children }: any) => children,
}))

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../components/Login'
import { vi } from 'vitest'

var signIn: any
vi.mock('../lib/AuthProvider', () => {
  signIn = vi.fn()
  return {
    useAuth: () => ({ signIn })
  }
})

describe('Login', () => {
  it('calls signIn with entered email', async () => {
    render(<Login />)
    const input = screen.getByPlaceholderText('you@example.com')
    fireEvent.input(input, { target: { value: 'user@example.com' } })
    fireEvent.submit(input.closest('form') as HTMLFormElement)
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('user@example.com')
    })
  })
})
