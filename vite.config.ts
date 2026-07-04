import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mockApiPlugin } from './mock-api-plugin'

// ── Mode flags ────────────────────────────────────────────────────────────────
// VITE_USE_MOCK=true   → all /api/* requests handled locally; no backend needed
// VITE_API_BASE=<url>  → proxy /api/* to that URL (ngrok, local .NET, prod)
//
// Values are read from .env.local (or .env) via loadEnv so the config file
// picks them up without needing them in the shell environment.

export default defineConfig(({ mode }) => {
  // loadEnv reads .env, .env.local, .env.[mode], .env.[mode].local
  // The third argument '' means "load ALL variables" (not just VITE_ prefixed ones)
  const env = loadEnv(mode, process.cwd(), '')

  const USE_MOCK = env.VITE_USE_MOCK === 'true'
  const API_BASE =
    env.VITE_API_BASE ||
    'https://yoko-unresourceful-coretta.ngrok-free.dev'

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Only register the mock middleware when offline mode is requested
      ...(USE_MOCK ? [mockApiPlugin()] : []),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      // Proxy is skipped when mock mode is active (middleware intercepts first)
      proxy: USE_MOCK ? undefined : {
        '/api': {
          target: API_BASE,
          changeOrigin: true,
          secure: true,
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      },
    },
  }
})
