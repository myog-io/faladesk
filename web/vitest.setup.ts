import '@testing-library/jest-dom'

vi.mock('react-native', () => ({
  View: () => null,
  Text: () => null,
  Pressable: () => null,
  TextInput: () => null,
  ActivityIndicator: () => null,
  StyleSheet: { create: () => ({}) },
  BackHandler: {},
  Platform: {},
  StatusBar: {},
  Dimensions: { get: () => ({}) },
  I18nManager: {},
  PanResponder: {},
  default: {}
}))

vi.mock('react-native-svg', () => {
  const Stub = () => null
  return {
    Svg: Stub,
    Polygon: Stub,
    Rect: Stub,
    Circle: Stub,
    Ellipse: Stub,
    Line: Stub,
    Polyline: Stub,
    Path: Stub,
    Text: Stub,
    TSpan: Stub,
    TextPath: Stub,
    G: Stub,
    ClipPath: Stub,
    LinearGradient: Stub,
    RadialGradient: Stub,
    default: Stub
  }
})

vi.mock('@gluestack-style/react', () => ({}))

vi.mock('@gluestack-ui/provider', () => ({
  GluestackUIContextProvider: ({ children }: any) => children,
  createProvider: () => ({ children }: any) => children
}))
