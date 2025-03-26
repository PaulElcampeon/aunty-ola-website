import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to your Spring Boot backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Optional: rewrite the path if your backend expects a different route
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
