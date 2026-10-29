import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy auth requests to Flask, but let browser GET HTML requests render React SPA
      '/login': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
            return '/index.html';
          }
        }
      },
      '/register': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
            return '/index.html';
          }
        }
      },
      '/logout': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  }
})

