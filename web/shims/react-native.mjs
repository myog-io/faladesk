// Shim for the `react-native` package so the web build doesn't break.
// Each exported component is a simple stub used by Gluestack UI.
export const BackHandler = {}
export const Platform = {}
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
  timing: () => ({ start: () => {} })
}
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
  StyleSheet,
  Dimensions,
  I18nManager,
  PanResponder,
  AccessibilityInfo
}
