import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// Helper to resolve local shim modules
const shim = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// Temporary aliases for native-only modules used by @gluestack-ui/themed
// This allows the web build to proceed until native dependencies are removed

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
  optimizeDeps: {
    exclude: [
      'react-native',
      'react-native-svg',
      '@gluestack-style/react'
    ]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      namedExports: {
        '@gluestack-ui/provider': ['GluestackUIContextProvider']
      }
    },
    rollupOptions: {
      external: [
        'react-native',
        'react-native-svg',
        '@gluestack-style/react'
      ]
    }
  },
  server: {
    host: '0.0.0.0',     // Exposes the dev server externally (e.g. in Docker)
    port: 3000,           // Optional: match your Docker port
    strictPort: true,     // Fail if port is taken
    watch: {
      usePolling: true,   // Fixes file change detection in volume mounts
    },
  }
})
