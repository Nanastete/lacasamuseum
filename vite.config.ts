import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Augmenter la limite pour éviter les warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les grosses dépendances
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'cms-vendor': ['decap-cms-app'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'gray-matter'],
        }
      }
    }
  },
  resolve: {
    alias: {
      // Corrige l'import problématique de ajv-keywords
      'ajv-keywords/dist/keywords': 'ajv-keywords/keywords',
      // Pas besoin d'alias pour ajv-errors car il importe directement depuis la racine
    }
  }
});