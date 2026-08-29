import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // three.js is the largest dependency and is only needed once the
          // lattice mounts — keep it in its own chunk so it can load lazily.
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
        },
      },
    },
  },
})
