import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'cesarpreciado.com',
      'isildevs.cesarpreciado.com'
    ]
  }
});
