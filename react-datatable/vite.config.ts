import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'ReactDataTableLibrary',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // externalize peer deps
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  }
})