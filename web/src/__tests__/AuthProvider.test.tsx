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

import { render } from '@testing-library/react'
import { AuthProvider, useAuth } from '../lib/AuthProvider'
import { vi } from 'vitest'
import { useEffect } from 'react'

var getSession: any
var onAuthStateChange: any
var signInWithOtp: any
var signOutMock: any

vi.mock('../lib/supabase', () => {
  getSession = vi.fn()
  onAuthStateChange = vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
  signInWithOtp = vi.fn()
  signOutMock = vi.fn()
  return { supabase: { auth: { getSession, onAuthStateChange, signInWithOtp, signOut: signOutMock } } }
})

function TestComponent() {
  const { signIn, signOut } = useAuth()
  useEffect(() => {
    signIn('test@example.com')
    signOut()
  }, [signIn, signOut])
  return null
}

describe('AuthProvider', () => {
  it('calls supabase auth methods', async () => {
    getSession.mockResolvedValue({ data: { session: null } })
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(signInWithOtp).toHaveBeenCalledWith({ email: 'test@example.com' })
    expect(signOutMock).toHaveBeenCalled()
  })
})
