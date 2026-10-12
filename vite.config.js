import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(process.cwd(), 'src') } },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/storage'],
          'firebase-auth': ['firebase/auth'],
          motion: ['framer-motion', 'swiper', 'lenis'],
        },
      },
    },
  },
});
