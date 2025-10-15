import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://flymallu.com/api',
        //target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false, // <-- ignore TLS cert issues locally
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    logLevel: 'debug' // optional, helps debug proxy requests
  }
})
