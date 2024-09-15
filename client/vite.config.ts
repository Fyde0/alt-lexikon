import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import analyze from "rollup-plugin-analyzer"
import pkgJSON from "./package.json"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "__APP_VERSION__": JSON.stringify(pkgJSON.version)
  },
  build: {
    rollupOptions: {
      plugins: [analyze()]
    },
  }
})
