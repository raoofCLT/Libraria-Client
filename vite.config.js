import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,
    // Get rid of the CORS error
    proxy:{
      "/api": {
        target: "https://e-library-server-oizs.onrender.com",
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
