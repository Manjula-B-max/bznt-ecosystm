import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
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
        hrAdmin: resolve(__dirname, 'hr-admin.html'),
        superAdmin: resolve(__dirname, 'super-admin.html'),
        projectflow: resolve(__dirname, 'projectflow-crm.html'),
        employee: resolve(__dirname, 'employee.html'),
        manager: resolve(__dirname, 'manager.html'),
        onboarding: resolve(__dirname, 'onboarding.html')

      }
    }
  }
});
