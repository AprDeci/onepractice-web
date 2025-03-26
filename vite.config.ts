import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      dts: true,
      resolvers: [
      ]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
  }
})
