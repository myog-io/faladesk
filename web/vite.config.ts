import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // Exposes the dev server externally (e.g. in Docker)
    port: 3000,           // Optional: match your Docker port
    strictPort: true,     // Fail if port is taken
    watch: {
      usePolling: true,   // Fixes file change detection in volume mounts
    },
  }
})