export const BackHandler = {}
export const Platform = {}
export const StatusBar = {}
export const View = () => null
export const Text = () => null
export const ActivityIndicator = () => null
export const Animated = {
  View: View,
  createAnimatedComponent: (Comp) => Comp,
  Value: function (v) {
    this.value = v
  },
  timing: () => ({ start: () => {} })
}
export const StyleSheet = { create: () => ({}) }
export const Dimensions = { get: () => ({}) }
export const Pressable = () => null
export const TextInput = () => null
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
  ActivityIndicator,
  Animated,
  StyleSheet,
  Dimensions,
  I18nManager,
  PanResponder,
  AccessibilityInfo
}
