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
import CreateCompany from '../components/CreateCompany'
import { vi } from 'vitest'

var orgSingle: any
var orgSelect: any
var orgInsert: any
var userInsert: any

vi.mock('../lib/supabase', () => {
  orgSingle = vi.fn()
  orgSelect = vi.fn(() => ({ single: orgSingle }))
  orgInsert = vi.fn(() => ({ select: orgSelect }))
  userInsert = vi.fn()
  return {
    supabase: {
      from: (table: string) => {
        if (table === 'organizations') {
          return { insert: orgInsert }
        }
        if (table === 'users') {
          return { insert: userInsert }
        }
        return {}
      }
    }
  }
})

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'uid', email: 'u@example.com' } } })
}))

describe('CreateCompany', () => {
  beforeEach(() => {
    orgSingle.mockReset()
    orgSelect.mockClear()
    orgInsert.mockClear()
    userInsert.mockClear()
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/create-company' }
    })
  })

  it('creates organization and user then redirects', async () => {
    orgSingle.mockResolvedValue({ data: { id: '1' }, error: null })
    userInsert.mockResolvedValue({ error: null })

    render(<CreateCompany />)
    fireEvent.input(screen.getByPlaceholderText('Company Name'), { target: { value: 'Acme' } })
    fireEvent.input(screen.getByPlaceholderText('slug'), { target: { value: 'acme' } })
    fireEvent.submit(screen.getByText('Create Company').closest('form') as HTMLFormElement)

    await waitFor(() => {
      expect(orgInsert).toHaveBeenCalledWith({ name: 'Acme', slug: 'acme' })
      expect(userInsert).toHaveBeenCalledWith({
        supabase_uid: 'uid',
        email: 'u@example.com',
        organization_id: '1',
        role: 'admin',
      })
      expect(window.location.pathname).toBe('/dashboard')
    })
  })

  it('shows error when user insert fails', async () => {
    orgSingle.mockResolvedValue({ data: { id: '1' }, error: null })
    userInsert.mockResolvedValue({ error: { message: 'fail' } })

    render(<CreateCompany />)
    fireEvent.input(screen.getByPlaceholderText('Company Name'), { target: { value: 'Acme' } })
    fireEvent.submit(screen.getByText('Create Company').closest('form') as HTMLFormElement)

    await screen.findByText('fail')
    expect(window.location.pathname).toBe('/create-company')
  })
})
