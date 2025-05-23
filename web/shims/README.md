# Shims

The web frontend relies on several packages that are designed for React Native. These libraries are
required by `@gluestack-ui/themed`, but they do not work in a browser environment. To allow the
Vite build and tests to run, lightweight shims are provided in this folder.

## Available Shims

- **react-native** – Stubs common React Native components and utilities. Basic
  keyboard event methods like `addListener` and `dismiss` are no-ops.
- **react-native-svg** – Provides empty SVG components used by icon wrappers.
- **@gluestack-style/react** – Minimal implementation exposing `AsForwarder` and `styled` along
  with no-op helpers.
- **@gluestack-ui/provider** – Simple provider that just renders its children.
- **react-router-dom** – A tiny router used only for development and tests.

Each shim exports just enough functionality for the app to render in the browser. They are not
feature complete and should be replaced with the real libraries if native support is required.
