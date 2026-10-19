import express from 'express'
import { Readable } from 'node:stream'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { newsHandler } from './news.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')

/**
 * 极简 .env 加载：项目不额外依赖 dotenv，生产环境也可直接注入系统变量。
 * 已存在的环境变量优先，不会被 .env 覆盖。
 */
function loadDotEnv() {
  const file = path.join(root, '.env')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}
loadDotEnv()

const port = Number(process.env.PORT || 8787)
const rawOrigin = (process.env.DIFY_BASE_URL || 'https://api.dify.ai').replace(/\/+$/, '')
// The browser path already includes /v1, so strip any version suffix from the base.
const difyBase = rawOrigin.replace(/\/v\d+$/i, '')
const difyKey = process.env.DIFY_API_KEY || ''
// 公开演示版：即使误配了 DIFY_API_KEY，也拒绝一切实时工作流调用。
const publicDemoOnly = process.env.PUBLIC_DEMO_ONLY === 'true'

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '512kb' }))

// Very small in-memory limiter. A deployment behind multiple instances should
// use a shared store (Redis) instead; this is intentionally conservative.
const hits = new Map()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 20

function limited(ip) {
  const now = Date.now()
  const entry = hits.get(ip) ?? { count: 0, reset: now + WINDOW_MS }
  if (now > entry.reset) {
    entry.count = 0
    entry.reset = now + WINDOW_MS
  }
  entry.count += 1
  hits.set(ip, entry)
  return entry.count > MAX_REQUESTS
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    server: 'lanzhi',
    hasKey: Boolean(difyKey) && !publicDemoOnly,
    demoOnly: publicDemoOnly,
    news: {
      provider: process.env.NEWS_PROVIDER || 'gdelt',
      configured:
        (process.env.NEWS_PROVIDER || 'gdelt') === 'gdelt'
          ? true
          : (process.env.NEWS_PROVIDER || 'gdelt') === 'newsapi'
            ? Boolean(process.env.NEWS_API_KEY)
            : Boolean(process.env.DIFY_NEWS_API_KEY || process.env.DIFY_API_KEY),
      note: 'GDELT needs no key; NewsAPI / Dify fallbacks stay server-side.',
    },
    note: 'Keys are held server-side and are never returned to the browser.',
  })
})

// 公共资讯代理：GDELT 优先，NewsAPI / Dify 可选；Key 只在服务端。
app.all('/api/news', newsHandler)
app.all('/api/news/*', newsHandler)

app.post('/api/dify/*', async (req, res) => {
  if (publicDemoOnly) {
    res.status(403).json({
      message: '当前为公开演示版，实时诊断未开放。',
      code: 'PUBLIC_DEMO_ONLY',
    })
    return
  }

  if (!difyKey) {
    res.status(503).json({
      message: 'DIFY_API_KEY 未配置。请在服务端 .env 中设置后再使用实时模式。',
      code: 'MISSING_DIFY_KEY',
    })
    return
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (limited(ip)) {
    res.status(429).json({ message: '请求过于频繁，请稍后再试。', code: 'RATE_LIMITED' })
    return
  }

  const suffix = req.originalUrl.replace(/^\/api\/dify/, '')
  const upstreamUrl = `${difyBase}${suffix}`
  const controller = new AbortController()
  res.on('close', () => {
    // Abort only when the client actually disconnects; a normal response close
    // after piping must not cancel the upstream stream.
    if (!res.writableEnded) controller.abort()
  })

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${difyKey}`,
      },
      body: JSON.stringify(req.body ?? {}),
      signal: controller.signal,
    })

    res.status(upstream.status)
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('X-Accel-Buffering', 'no')
    const contentType = upstream.headers.get('content-type')
    if (contentType) res.setHeader('Content-Type', contentType)

    if (upstream.body) {
      Readable.fromWeb(upstream.body).pipe(res)
    } else {
      res.end(await upstream.text())
    }
  } catch (error) {
    if (controller.signal.aborted) return
    console.error('[dify-proxy] upstream request failed:', error?.message || 'unknown')
    if (!res.headersSent) {
      res.status(502).json({
        message: '无法连接 Dify 服务，请检查 DIFY_BASE_URL 与网络。',
        code: 'UPSTREAM_ERROR',
      })
    } else {
      res.end()
    }
  }
})

if (existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: '1h' }))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
    res.sendFile(path.join(dist, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`[lanzhi] server listening on http://localhost:${port}`)
  console.log(`[lanzhi] Dify proxy: ${difyBase} · key ${difyKey ? 'configured' : 'NOT configured'}`)
  if (!existsSync(dist)) {
    console.log('[lanzhi] dist/ not found — run `npm run build` for production, or use `npm run dev` for development.')
  }
})
