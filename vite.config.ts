import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-peru': {
        target: 'https://api.apis.net.pe/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-peru/, ''),
      },
    },
  },
})
