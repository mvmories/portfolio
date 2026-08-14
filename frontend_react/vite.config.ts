import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin'
import { fileURLToPath, URL } from 'node:url'

/**
 * Loads .env into process.env for local development.
 *
 * Netlify's emulator only sources environment variables from a linked site, and
 * Vite exposes .env through import.meta.env rather than process.env. Functions
 * read process.env, so without this the contact form is dead locally even
 * though .env is correct. Real environment variables win, and this never runs
 * during a build.
 */
function serverEnv(): Plugin {
  return {
    name: 'server-env',
    apply: 'serve',
    config(_config, { mode }) {
      for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
        process.env[key] ??= value
      }
    },
  }
}

export default defineConfig({
  // The Netlify plugin emulates the production platform inside the dev server —
  // functions, redirects, headers and env vars all behave as they will once
  // deployed. That parity is why it replaced the hand-rolled dev API shim.
  plugins: [serverEnv(), react(), netlify()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Two entry points, not one. `powerbyjs.html` builds to dist/powerbyjs.html,
      // which Netlify serves at /powerbyjs in preference to the catch-all SPA
      // rewrite, because a non-forced redirect cannot shadow a file that exists.
      // This keeps the case study out of the home page bundle entirely.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        powerbyjs: fileURLToPath(new URL('./powerbyjs.html', import.meta.url)),
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          sanity: ['@sanity/client', '@sanity/image-url'],
        },
      },
    },
  },
})
