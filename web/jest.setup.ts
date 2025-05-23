import '@testing-library/jest-native/extend-expect';

jest.mock('react-native', () => ({
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
  default: {},
}));

jest.mock('react-native-svg', () => {
  const Stub = () => null;
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
    default: Stub,
  };
});

jest.mock('@gluestack-style/react', () => ({}));

jest.mock('@gluestack-ui/provider', () => ({
  GluestackUIContextProvider: ({ children }) => children,
  createProvider: () => ({ children }) => children,
}));
