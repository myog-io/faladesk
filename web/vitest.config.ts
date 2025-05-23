import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

const shim = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': shim('./shims/react-native.mjs'),
      'react-native-svg': shim('./shims/react-native-svg.mjs'),
      '@gluestack-style/react': shim('./shims/gluestack-style-react.mjs'),
      '@gluestack-ui/provider': shim('./shims/gluestack-ui-provider.mjs'),
    }
  },
  server: {
    fs: {
      // allow accessing test files outside the web directory
      allow: ['..']
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.tsx', '../apps/frontend/tests/**/*.ts*'],
    deps: {
      // ensure external tests resolve dependencies from this package
      moduleDirectories: [fileURLToPath(new URL('node_modules', import.meta.url))]
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts'
  }
})
