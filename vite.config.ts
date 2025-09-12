import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import terminal from 'vite-plugin-terminal'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "VITE_")
  return {
    base: '/Count-the-beans/',
    plugins: [
      react(),
      terminal({ console: 'terminal', output: ['terminal', 'console'] })
    ],
  }
})
