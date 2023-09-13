import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { feathers } from './vite-plugin-feathers.js'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    plugins: [vue(), feathers({ app: './api_src/app.js', port: 23030 })]
  }
})
