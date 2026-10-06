import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
  // REQUIRED for GitHub Pages (sub-path hosting): emit relative asset URLs (./assets/…)
  // so the app loads from https://USER.github.io/REPO/ instead of domain root.
  base: './',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split heavy vendors out of the critical first-paint bundle.
        // Each chunk is hashed + cached immutably (see vercel.json).
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-three': ['three'],
        },
      },
    },
  },
})
