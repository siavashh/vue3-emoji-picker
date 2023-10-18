const path = require('path')
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  resolve: {
    alias: {
      '@bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/export.ts'),
      name: 'EmojiPicker',
      fileName: (format) => `emoji-picker.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
