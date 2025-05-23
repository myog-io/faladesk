import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

const shim = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': shim('./shims/react-native.js'),
      'react-native-svg': shim('./shims/react-native-svg.js'),
      '@gluestack-style/react': shim('./shims/gluestack-style-react.js'),
      '@gluestack-ui/provider': shim('./shims/gluestack-ui-provider.js'),
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.tsx'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts'
  }
})
