// vite.config.ts (KODE DIPERBARUI)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // --- PERBAIKAN DI SINI ---
    
    // 1. Memberi tahu Vite untuk mendengarkan di semua alamat
    host: true, 
    
    // 2. Memberi tahu Vite untuk MENGIZINKAN host ngrok
    allowedHosts: [
      '.ngrok-free.app' // Ini akan mengizinkan SEMUA subdomain ngrok Anda
    ],
    // --- AKHIR PERBAIKAN ---

    // Konfigurasi proxy Anda yang sudah ada
    proxy: {
      '/api': {
        target: 'https://photobooth-funday-2025-backend.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://photobooth-funday-2025-backend.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
