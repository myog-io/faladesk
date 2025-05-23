// Minimal shim for `@gluestack-ui/provider` which simply renders children.
export const GluestackUIContextProvider = ({ children }) => children
export const createProvider = () => ({ children }) => children
export default { GluestackUIContextProvider, createProvider }
