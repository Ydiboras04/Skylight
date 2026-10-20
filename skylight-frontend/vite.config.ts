import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    // Requests to /api/... are forwarded to the Rust backend
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
})
