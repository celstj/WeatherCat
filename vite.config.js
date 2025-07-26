import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  optimizeDeps: {
    exclude: ['dotenv', 'mongodb']
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000', //req to backend
    }
  },
  base: '/',
});