import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      strategies: 'generateSW',
      manifest: {
        name: 'EduAdapt',
        short_name: 'EduAdapt',
        description: 'Sistem Manajemen Pembelajaran Adaptif Digital',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb', 
        icons: [
          {
            src: 'icons.jpeg', // Menggunakan file SVG yang sudah ada di folder public Anda
            sizes: '192x192 512x512', // Memberitahu browser bahwa file ini scalable untuk semua ukuran
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});