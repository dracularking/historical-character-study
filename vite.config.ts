import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 相对路径，保证部署到 GitHub Pages 项目子路径（/historical-character-study/）下资源可用；
  // 配合 HashRouter，站点也可从任意子路径或 file:// 打开。
  base: './',
  plugins: [react()],
  server: { port: 5173, open: true },
})
