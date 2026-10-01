import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Sub-path the site is served from, e.g. `/mainpage/` on GitHub Pages. Defaults to the domain root.
const base = `/${(process.env.BASE_PATH ?? '').replace(/^\/|\/$/g, '')}/`.replace('//', '/')

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // Read by scripts/prerender.mjs to link each route's own CSS and JS chunks.
    manifest: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-dom') || id.includes('node_modules/motion-utils')) return 'motion'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler') || id.includes('node_modules/react-router')) return 'react'
        },
      },
    },
  },
})
