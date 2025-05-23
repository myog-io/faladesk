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

import { render, waitFor } from '@testing-library/react'
import DashboardRedirect from '../components/DashboardRedirect'
import { vi } from 'vitest'

var useUserOrganization: any
vi.mock('../lib/useUserOrganization', () => {
  useUserOrganization = vi.fn()
  return { useUserOrganization }
})

describe('DashboardRedirect', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/' }
    })
  })

  it('redirects to create-company when no user', async () => {
    useUserOrganization.mockReturnValue({ loading: false, user: null })
    render(<DashboardRedirect />)
    await waitFor(() => {
      expect(window.location.pathname).toBe('/create-company')
    })
  })

  it('redirects to dashboard when user exists', async () => {
    useUserOrganization.mockReturnValue({ loading: false, user: {} })
    render(<DashboardRedirect />)
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })
})
