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
import ChatDashboard from '../components/ChatDashboard'

describe('ChatDashboard', () => {
  it('renders chat list and messages', () => {
    const { getAllByText } = render(<ChatDashboard />)
    expect(getAllByText('Maria Silva').length).toBeGreaterThan(0)
    expect(screen.getByText('João Santos')).toBeInTheDocument()
    expect(screen.getByText('Olá, tudo bem?')).toBeInTheDocument()
    expect(screen.getByText('Posso ajudar?')).toBeInTheDocument()
  })
})
