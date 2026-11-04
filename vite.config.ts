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
    // 绑定到 127.0.0.1（IPv4），保证浏览器访问 localhost 时不被拒绝连接。
    // 注意：不能绑定 localhost 字符串，否则 Vite 会监听 IPv6 的 ::1，导致 IPv4 客户端连接被拒。
    host: '127.0.0.1',
    open: true,
  },
})
