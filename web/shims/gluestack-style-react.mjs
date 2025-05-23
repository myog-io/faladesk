// Shim for `@gluestack-style/react`. Provides the minimal APIs required by
// `@gluestack-ui/themed` so the project can run in a browser environment.
import React from 'react'

// Simple forwarder component used by gluestack UI
export const AsForwarder = React.forwardRef(({ as: Comp = 'div', ...props }, ref) =>
  React.createElement(Comp, { ref, ...props })
)

// Extremely light "styled" implementation that simply returns the base component
export const styled = (Component) =>
  React.forwardRef((props, ref) => React.createElement(Component, { ref, ...props }))

// No-op provider and helpers; StyledProvider simply returns its children
export const StyledProvider = ({ children }) => children
export const useStyled = () => ({})
export const flush = () => {}
export const createConfig = () => ({})
export const Theme = {}
export const useTheme = () => ({})

export default {
  AsForwarder,
  styled,
  StyledProvider,
  useStyled,
  flush,
  createConfig,
  Theme,
  useTheme,
}
