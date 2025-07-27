import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Increase the chunk size warning limit
    chunkSizeWarningLimit: 1000, // Increase the limit to 1 MB (default is 500 KB)
    
    rollupOptions: {
      output: {
        // Manually split chunks, for example, vendor libraries in a separate chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Bundle all dependencies into a single vendor chunk
          }
        }
      }
    }
  }
});

