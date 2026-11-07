import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // 相對路徑，這樣不管部署在 GitHub Pages 的子路徑（/repo名稱/）或自訂網域都能正常讀到檔案
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.svg'],
      manifest: {
        name: '布丁記帳 Pudding Ledger',
        short_name: '布丁記帳',
        description: '可愛的布丁狗配色記帳軟體',
        theme_color: '#F2C94C',
        background_color: '#FFF6DE',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
          { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      }
    })
  ]
})
