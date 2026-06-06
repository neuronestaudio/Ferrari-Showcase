import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The Seed of Life runs on its own fixed port so it never collides with
  // the Camera Deconstruction (5173) or Cave Exploration (5175) sites.
  server: { port: 5177, strictPort: true },
  preview: { port: 5177, strictPort: true },
})
