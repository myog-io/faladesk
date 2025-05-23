// Shim for the `react-native` package so the web build doesn't break.
// Each exported component is a simple stub used by Gluestack UI.
export const BackHandler = {}
// Basic implementation of `Platform` used by Gluestack UI. Only the `OS`
// identifier and `select` helper are provided so libraries relying on
// `Platform.select()` do not crash during web development.
export const Platform = {
  OS: 'web',
  select: (spec = {}) => spec.web ?? spec.default,
}
export const StatusBar = {}
export const View = () => null
export const Text = () => null
export const Image = () => null
export const Keyboard = {}
export const KeyboardAvoidingView = () => null
export const Linking = {}
export const Modal = () => null
export const PixelRatio = { get: () => 1 }
export const SafeAreaView = () => null
export const ScrollView = () => null
export const SectionList = () => null
export const Switch = () => null
export const VirtualizedList = () => null
export const findNodeHandle = () => null
export const ActivityIndicator = () => null
export const Animated = {
  View: View,
  createAnimatedComponent: (Comp) => Comp,
  Value: function (v) {
    this.value = v
  },
  timing: () => ({ start: () => {} }),
  Easing: {
    linear: (t) => t,
    ease: (t) => 0.5 * (1 - Math.cos(Math.PI * t)),
    quad: (t) => t * t,
    cubic: (t) => t * t * t,
    poly: (n) => (t) => Math.pow(t, n),
    sin: (t) => 1 - Math.cos((t * Math.PI) / 2),
    circle: (t) => 1 - Math.sqrt(1 - t * t),
    exp: (t) => Math.pow(2, 10 * (t - 1)),
    back: (s = 1.70158) => (t) => t * t * ((s + 1) * t - s),
    bounce: (t) => {
      if (t < 1 / 2.75) return 7.5625 * t * t
      if (t < 2 / 2.75) {
        t -= 1.5 / 2.75
        return 7.5625 * t * t + 0.75
      }
      if (t < 2.5 / 2.75) {
        t -= 2.25 / 2.75
        return 7.5625 * t * t + 0.9375
      }
      t -= 2.625 / 2.75
      return 7.5625 * t * t + 0.984375
    },
    elastic: (b = 1) => (t) =>
      1 - Math.pow(Math.cos((t * Math.PI) / 2), b),
    bezier: (_x1, _y1, _x2, _y2) => (t) => t,
    step0: (t) => (t > 0 ? 1 : 0),
    step1: (t) => (t >= 1 ? 1 : 0),
    in: (easing) => easing,
    out: (easing) => (t) => 1 - easing(1 - t),
    inOut: (easing) => (t) =>
      t < 0.5 ? easing(t * 2) / 2 : 1 - easing((1 - t) * 2) / 2
  }
}
export const Easing = Animated.Easing
export const StyleSheet = { create: () => ({}) }
export const Dimensions = { get: () => ({}) }
export const Pressable = () => null
export const TextInput = () => null
export const FlatList = () => null
export const I18nManager = {}
export const PanResponder = {}
export const AccessibilityInfo = {
  setAccessibilityFocus: () => {}
}
export default {
  BackHandler,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  PixelRatio,
  SafeAreaView,
  ScrollView,
  SectionList,
  Switch,
  VirtualizedList,
  findNodeHandle,
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  I18nManager,
  PanResponder,
  AccessibilityInfo
}
