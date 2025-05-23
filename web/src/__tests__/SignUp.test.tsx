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
import SignUp from '../components/SignUp'
import { vi } from 'vitest'

var signInWithOtp: any
vi.mock('../lib/supabase', () => {
  signInWithOtp = vi.fn()
  return {
    supabase: {
      auth: { signInWithOtp }
    }
  }
})

describe('SignUp', () => {
  beforeEach(() => {
    signInWithOtp.mockReset()
  })

  it('shows success message on successful signup', async () => {
    signInWithOtp.mockResolvedValue({ error: null })
    const pushSpy = vi.spyOn(window.history, 'pushState')
    render(<SignUp />)
    fireEvent.input(screen.getByPlaceholderText('you@example.com'), { target: { value: 'u@example.com' } })
    fireEvent.submit(screen.getByText('Send Magic Link').closest('form') as HTMLFormElement)
    await screen.findByText('Check your inbox for a magic link.')
    expect(signInWithOtp).toHaveBeenCalledWith({ email: 'u@example.com' })
    expect(pushSpy).toHaveBeenCalledWith(null, '', '/magic-link')
    pushSpy.mockRestore()
  })

  it('displays error when signup fails', async () => {
    signInWithOtp.mockResolvedValue({ error: { message: 'fail' } })
    render(<SignUp />)
    fireEvent.input(screen.getByPlaceholderText('you@example.com'), { target: { value: 'u@example.com' } })
    fireEvent.submit(screen.getByText('Send Magic Link').closest('form') as HTMLFormElement)
    await screen.findByText('fail')
  })
})
