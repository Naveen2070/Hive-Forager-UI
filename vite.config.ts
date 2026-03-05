import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import visualizer from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isProd = mode === 'production'
  const mockAuthEnabled = env.VITE_ENABLE_MOCK_AUTH === 'true'

  console.log('Vite mode:', mode)
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('Mock auth enabled:', mockAuthEnabled)

  if (
    isProd &&
    mockAuthEnabled &&
    process.env.ALLOW_MOCK_AUTH_IN_PROD !== 'true'
  ) {
    throw new Error(`
    ==================================================
    SECURITY BLOCKED
    ==================================================
    
    Production build detected with VITE_ENABLE_MOCK_AUTH=true
    
    This can expose your application to authentication
    bypass vulnerabilities.
    
    Disable mock auth or explicitly set:
    ALLOW_MOCK_AUTH_IN_PROD=true
    `)
  }

  return {
    plugins: [
      visualizer({ open: true }),
      devtools(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      viteReact({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      tailwindcss(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3001,
      allowedHosts: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
