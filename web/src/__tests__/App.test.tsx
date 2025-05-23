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

import { render, screen } from '@testing-library/react'
import App from '../App'
import { vi } from 'vitest'

var useAuth: any
vi.mock('../lib/AuthProvider', () => {
  useAuth = vi.fn()
  return { useAuth }
})

describe('App routing', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', { writable: true, value: { pathname: '/' } })
  })

  it('renders SignUp when not authenticated and path is /signup', () => {
    useAuth.mockReturnValue({ session: null, loading: false })
    window.location.pathname = '/signup'
    render(<App />)
    expect(screen.getByText('Send Magic Link')).toBeInTheDocument()
    expect(screen.queryByText('Faladesk')).not.toBeInTheDocument()
  })

  it('renders ChatDashboard when authenticated and path is /dashboard', () => {
    useAuth.mockReturnValue({ session: {}, loading: false })
    window.location.pathname = '/dashboard'
    render(<App />)
    expect(screen.getByText('Maria Silva')).toBeInTheDocument()
  })

  it('renders CreateCompany when authenticated and path is /create-company', () => {
    useAuth.mockReturnValue({ session: {}, loading: false })
    window.location.pathname = '/create-company'
    render(<App />)
    expect(screen.getByText('Create Company')).toBeInTheDocument()
  })

  it('renders DashboardRedirect when authenticated and other path', () => {
    useAuth.mockReturnValue({ session: {}, loading: false })
    render(<App />)
    // DashboardRedirect renders nothing so expect null
    expect(screen.queryByText('Faladesk')).not.toBeInTheDocument()
  })
})
