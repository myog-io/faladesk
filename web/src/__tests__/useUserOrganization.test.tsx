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

import { renderHook, waitFor } from '@testing-library/react'
import { useUserOrganization } from '../lib/useUserOrganization'
import { vi } from 'vitest'

var maybeSingle: any
var eq: any
var select: any
var from: any

vi.mock('../lib/supabase', () => {
  maybeSingle = vi.fn()
  eq = vi.fn(() => ({ maybeSingle }))
  select = vi.fn(() => ({ eq }))
  from = vi.fn(() => ({ select }))
  return { supabase: { from } }
})

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'uid' } } })
}))

describe('useUserOrganization', () => {
  it('fetches user organization', async () => {
    const user = { id: 'u1', email: 'u@example.com' }
    maybeSingle.mockResolvedValue({ data: user, error: null })
    const { result } = renderHook(() => useUserOrganization())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(from).toHaveBeenCalledWith('users')
    expect(result.current.user).toEqual(user)
  })
})
