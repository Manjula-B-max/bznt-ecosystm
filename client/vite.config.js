import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: true,
    fs: { allow: ['..'] },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        crm: resolve(__dirname, 'marketflow-crm.html'),
        feedback: resolve(__dirname, 'feedback.html'),
        admin: resolve(__dirname, 'admin.html'),
        superAdmin: resolve(__dirname, 'super-admin.html'),
        projectflow: resolve(__dirname, 'projectflow-crm.html')
      }
    }
  }
});
