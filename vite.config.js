// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Asegurarse de que Vite busca el index.html en la raíz
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
