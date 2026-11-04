import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 相对路径，保证部署到 GitHub Pages 项目子路径（/historical-character-study/）下资源可用；
  // 配合 HashRouter，站点也可从任意子路径或 file:// 打开。
  base: './',
  plugins: [react()],
  server: {
    // 使用专用端口，避免与其他项目默认的 5173 冲突；若被占用则自动顺延到下一个空闲端口
    port: 4180,
    strictPort: false,
    open: true,
  },
})
