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
import Landing from '../components/Landing'

describe('Landing', () => {
  it('renders heading and tagline', () => {
    render(<Landing />)
    expect(screen.getByText('Faladesk')).toBeInTheDocument()
    expect(screen.getByText('Multi-tenant customer support platform')).toBeInTheDocument()
  })
})
