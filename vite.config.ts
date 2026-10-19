import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { newsHandler } from './server/news.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // 把 .env 变量注入 process.env，供 server/news.mjs 读取。
  for (const [key, value] of Object.entries(env)) {
    if (value && process.env[key] === undefined) process.env[key] = value
  }

  const difyOrigin = (env.DIFY_BASE_URL || 'https://api.dify.ai')
    .replace(/\/+$/, '')
    .replace(/\/v\d+$/i, '')
  const difyKey = env.DIFY_API_KEY || ''

  return {
    plugins: [
      react(),
      {
        name: 'lanzhi-news-proxy',
        configureServer(server) {
          // 开发模式下与 Express 生产服务使用同一套新闻代理逻辑。
          server.middlewares.use('/api/news', (req, res) => newsHandler(req, res))
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            echarts: ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers'],
            markdown: ['react-markdown', 'remark-gfm'],
            motion: ['framer-motion'],
            router: ['react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 5173,
      proxy: {
        // Browser -> /api/dify/v1/workflows/run -> Dify, with the key injected
        // server-side by Vite. In production the Express server does the same.
        '/api/dify': {
          target: difyOrigin,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/dify/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (difyKey && !req.headers.authorization) {
                proxyReq.setHeader('Authorization', `Bearer ${difyKey}`)
              }
            })
          },
        },
      },
    },
  }
})
