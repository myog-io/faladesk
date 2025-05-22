import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.{test,spec}.tsx'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts'
  }
})
