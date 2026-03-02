import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  plugins: [
    react({
      jsxRuntime: "automatic"
    }),
    cssInjectedByJsPlugin(),
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    lib: {
      entry: "src/widget.tsx",
      name: "TicketWidget",
      fileName: () => "ticket-widget.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
