/**
 * 公共资讯代理
 * ------------------------------------------------------------
 * 浏览器只请求本站 /api/news；服务端按优先级调用：
 *   1. GDELT Project API（免费、无需密钥、全球多语言）
 *   2. NewsAPI（可选备用，需 NEWS_API_KEY）
 *   3. Dify 新闻工作流（可选，NEWS_PROVIDER=dify）
 *
 * GDELT 文档：
 * https://api.gdeltproject.org/api/v2/doc/doc?query=water+pollution
 *   &mode=artlist&maxrecords=10&format=json
 *
 * 本站只向浏览器返回标题、摘要、来源、封面与外链；
 * 点击卡片在新标签页打开原文，不在本站转载全文。
 *
 * 环境变量：
 *   NEWS_PROVIDER=gdelt | newsapi | dify   默认 gdelt
 *   NEWS_API_KEY=...                       NewsAPI 备用密钥（可选）
 *   GDELT_BASE_URL=...                     GDELT 地址（可选）
 *   NEWS_DEFAULT_QUERY=...                 默认检索词
 *   DIFY_NEWS_API_KEY=...                  可选 Dify 新闻工作流
 *   DIFY_NEWS_BASE_URL=...
 *   DIFY_NEWS_QUERY_FIELD=query
 *   DIFY_NEWS_LIMIT_FIELD=
 *   DIFY_NEWS_EXTRA_INPUTS={}
 */

const CACHE_TTL_MS = 8 * 60 * 1000
const REQUEST_TIMEOUT_MS = 40_000
const WINDOW_MS = 60_000
const MAX_REQUESTS = 24

const cache = new Map()
const hits = new Map()

const FALLBACK_QUERY =
  'water pollution OR water quality OR river restoration OR wetland restoration'

/**
 * 公共 RSS 备用源：免费、公开、无需密钥。
 * 只读取标题、摘要、来源与外链，点击跳转原媒体，不转载全文。
 */
const DEFAULT_RSS_FEEDS = [
  {
    url: 'https://www.sciencedaily.com/rss/earth_climate/water.xml',
    name: 'ScienceDaily · Water',
  },
  {
    url: 'https://www.theguardian.com/environment/water/rss',
    name: 'The Guardian · Water',
  },
  {
    url: 'https://phys.org/rss-feed/earth-news/environment/',
    name: 'Phys.org · Environment',
  },
  {
    url: 'https://www.circleofblue.org/feed/',
    name: 'Circle of Blue',
  },
]

function env(name, fallback = '') {
  return (process.env[name] || fallback).trim()
}

function parseRssFeeds(raw) {
  if (!raw) return DEFAULT_RSS_FEEDS

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      const feeds = parsed
        .map((item) => {
          if (typeof item === 'string') {
            return { url: item.trim(), name: safeHostname(item) }
          }
          return {
            url: String(item?.url || '').trim(),
            name: String(item?.name || item?.url || '').trim(),
          }
        })
        .filter((feed) => feed.url)
      if (feeds.length > 0) return feeds
    }
  } catch {
    /* fall through to comma-separated list */
  }

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((url) => ({ url, name: safeHostname(url) }))
}

function safeHostname(url) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function config() {
  const provider = (env('NEWS_PROVIDER', 'gdelt') || 'gdelt').toLowerCase()
  const newsApiKey = env('NEWS_API_KEY')
  const difyKey = env('DIFY_NEWS_API_KEY') || env('DIFY_API_KEY')
  const difyBase = (env('DIFY_NEWS_BASE_URL') || env('DIFY_BASE_URL') || 'https://api.dify.ai')
    .replace(/\/+$/, '')
    .replace(/\/v\d+$/i, '')

  let extraInputs = {}
  const rawExtra = env('DIFY_NEWS_EXTRA_INPUTS')
  if (rawExtra) {
    try {
      const parsed = JSON.parse(rawExtra)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) extraInputs = parsed
    } catch {
      console.warn('[news-proxy] DIFY_NEWS_EXTRA_INPUTS 不是合法 JSON，已忽略。')
    }
  }

  return {
    provider,
    newsApiKey,
    difyKey,
    difyBase,
    difyQueryField: env('DIFY_NEWS_QUERY_FIELD', 'query'),
    difyLimitField: env('DIFY_NEWS_LIMIT_FIELD'),
    difyExtraInputs: extraInputs,
    gdeltBase: env('GDELT_BASE_URL', 'https://api.gdeltproject.org/api/v2/doc/doc'),
    newsApiBase: env('NEWSAPI_BASE_URL', 'https://newsapi.org/v2'),
    rssEnabled: env('NEWS_RSS_ENABLED', 'true').toLowerCase() !== 'false',
    rssFeeds: parseRssFeeds(env('NEWS_RSS_FEEDS')),
  }
}

function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

function redact(value, keys) {
  let text = String(value || '')
  for (const key of keys) {
    if (key) text = text.split(key).join('[redacted]')
  }
  return text
}

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

function pickQuery(searchParams) {
  const q = (searchParams.get('q') || '').trim()
  return q || env('NEWS_DEFAULT_QUERY') || FALLBACK_QUERY
}

function pickLimit(searchParams) {
  const raw = Number(searchParams.get('max') || 12)
  if (!Number.isFinite(raw)) return 12
  return Math.max(1, Math.min(24, Math.round(raw)))
}

function cleanText(value, max = 600) {
  if (typeof value !== 'string' && typeof value !== 'number') return ''
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function normalizeUrl(value) {
  const raw = cleanText(value, 1200)
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  if (/^\/\//.test(raw)) return `https:${raw}`
  if (/^[\w.-]+\.[a-z]{2,}\//i.test(raw)) return `https://${raw}`
  return ''
}

function hash(text) {
  let h = 5381
  for (let i = 0; i < text.length; i += 1) {
    h = ((h << 5) + h + text.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

/**
 * GDELT 官方限制：每个来源约 5 秒 1 次请求。
 * 在进程内串行排队，避免并发用户触发 429。
 */
let gdeltChain = Promise.resolve()
let lastGdeltAt = 0
const GDELT_MIN_INTERVAL_MS = 5600

function scheduleGdelt(task) {
  const run = gdeltChain.then(async () => {
    const wait = Math.max(0, GDELT_MIN_INTERVAL_MS - (Date.now() - lastGdeltAt))
    if (wait > 0) await sleep(wait)
    try {
      return await task()
    } finally {
      lastGdeltAt = Date.now()
    }
  })
  // 无论成功失败，后续请求都可以继续排队。
  gdeltChain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

function articleId(provider, index, title, url) {
  return `${provider}-${index}-${hash(`${title}|${url}`)}`
}

/* ============================================================
 * GDELT
 * ============================================================ */

function parseGdeltDate(value) {
  const raw = String(value || '').trim()
  const match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(raw)
  if (!match) return new Date().toISOString()
  const [, y, mo, d, h, mi, s] = match
  const date = new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}Z`)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function normalizeGdelt(item, index) {
  if (!item || typeof item !== 'object') return null
  const title = cleanText(item.title, 260)
  const url = normalizeUrl(item.url)
  if (!title || !url) return null
  const imageUrl = normalizeUrl(item.socialimage)
  return {
    id: articleId('gdelt', index, title, url),
    title,
    // GDELT artlist 不提供摘要；前端会显示“未返回摘要”的诚实提示。
    description: '',
    content: '',
    url,
    imageUrl,
    urlToImage: imageUrl,
    source: cleanText(item.domain, 80),
    author: '',
    publishedAt: parseGdeltDate(item.seendate),
    language: cleanText(item.language, 40),
  }
}

async function requestGdelt({ base, query, max, signal }) {
  const url = new URL(base)
  url.searchParams.set('query', query)
  url.searchParams.set('mode', 'artlist')
  url.searchParams.set('maxrecords', String(max))
  url.searchParams.set('format', 'json')
  url.searchParams.set('sort', 'datedesc')

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'lanzhi-water-portal/1.0 (+research demo)',
    },
    signal,
  })
  const text = await response.text()

  if (response.status === 429) {
    const error = new Error(
      'GDELT 限流：请控制请求频率（官方约每 5 秒 1 次），稍后重试。',
    )
    error.code = 'GDELT_RATE_LIMITED'
    throw error
  }
  if (!response.ok) {
    throw new Error(`GDELT ${response.status}: ${text.slice(0, 240)}`)
  }
  if (!text.trim()) return []

  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error('GDELT 返回了非 JSON 响应。')
  }
  if (payload?.error) throw new Error(`GDELT: ${payload.error}`)

  const list = Array.isArray(payload?.articles) ? payload.articles : []
  return list.map(normalizeGdelt).filter(Boolean)
}

async function fetchGdelt({ base, query, max, signal }) {
  // 429 不在这里长时间等待，立即交给 RSS / NewsAPI 备用源，避免前端空等。
  return scheduleGdelt(() => requestGdelt({ base, query, max, signal }))
}

/**
 * GDELT 单次尝试最多 7 秒；超时后立即使用并行准备好的 RSS 备用源。
 * GDELT 有时需要 18–21 秒，但让用户空等 20 秒体验很差。
 */
const GDELT_ATTEMPT_TIMEOUT_MS = 7000

async function fetchGdeltWithin(args) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), GDELT_ATTEMPT_TIMEOUT_MS)
  const onAbort = () => controller.abort()
  args.signal?.addEventListener('abort', onAbort, { once: true })

  try {
    return await fetchGdelt({ ...args, signal: controller.signal })
  } finally {
    clearTimeout(timer)
    args.signal?.removeEventListener('abort', onAbort)
  }
}

/* ============================================================
 * NewsAPI 备用
 * ============================================================ */

function normalizeNewsApi(item, index) {
  if (!item || typeof item !== 'object') return null
  const title = cleanText(item.title, 260)
  const url = normalizeUrl(item.url)
  if (!title || !url) return null
  const imageUrl = normalizeUrl(item.urlToImage)
  return {
    id: articleId('newsapi', index, title, url),
    title,
    description: cleanText(item.description ?? item.content, 520),
    content: cleanText(item.content, 800),
    url,
    imageUrl,
    urlToImage: imageUrl,
    source: cleanText(item.source?.name ?? item.source, 80),
    author: cleanText(item.author, 80),
    publishedAt: cleanText(item.publishedAt, 80) || new Date().toISOString(),
  }
}

async function fetchNewsApi({ base, key, query, max, signal }) {
  if (!key) return []
  const url = new URL(`${base.replace(/\/+$/, '')}/everything`)
  url.searchParams.set('q', query)
  url.searchParams.set('sortBy', 'publishedAt')
  url.searchParams.set('pageSize', String(max))
  url.searchParams.set('page', '1')
  url.searchParams.set('apiKey', key)

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`NewsAPI ${response.status}: ${text.slice(0, 240)}`)
  }

  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error('NewsAPI 返回了非 JSON 响应。')
  }
  if (payload?.status === 'error') throw new Error(`NewsAPI: ${payload.message}`)

  const list = Array.isArray(payload?.articles) ? payload.articles : []
  return list.map(normalizeNewsApi).filter(Boolean)
}

/* ============================================================
 * 公共 RSS 备用源
 * 免费、公开、无需密钥；只读取标题/摘要/外链，不转载全文。
 * ============================================================ */

const RSS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

function decodeXml(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}

function stripHtml(value, max = 520) {
  return decodeXml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function tagText(block, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = block.match(
    new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'),
  )
  return match ? decodeXml(match[1]).trim() : ''
}

function tagAttr(block, tag, attr) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = block.match(
    new RegExp(`<${escapedTag}\\b[^>]*\\b${attr}=["']([^"']+)["'][^>]*>`, 'i'),
  )
  return match ? decodeXml(match[1]).trim() : ''
}

function parseFeedDate(value) {
  const date = new Date(decodeXml(value))
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function parseRss(xml, feed, limit) {
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((m) => m[0])
  const entryBlocks = itemBlocks.length
    ? []
    : [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((m) => m[0])
  const blocks = itemBlocks.length ? itemBlocks : entryBlocks

  return blocks
    .slice(0, Math.max(limit * 2, 12))
    .map((block, index) => {
      const title = stripHtml(tagText(block, 'title'), 240)
      if (!title) return null

      let link = tagText(block, 'link') || tagAttr(block, 'link', 'href')
      link = normalizeUrl(link)
      if (!link) return null

      const rawDescription =
        tagText(block, 'description') ||
        tagText(block, 'summary') ||
        tagText(block, 'content:encoded')
      const description = stripHtml(rawDescription, 520)

      let image =
        tagAttr(block, 'media:content', 'url') ||
        tagAttr(block, 'media:thumbnail', 'url') ||
        tagAttr(block, 'enclosure', 'url')

      if (!image) {
        const img = rawDescription.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)
        if (img) image = decodeXml(img[1])
      }
      image = normalizeUrl(image)

      const dateRaw =
        tagText(block, 'pubDate') ||
        tagText(block, 'dc:date') ||
        tagText(block, 'published') ||
        tagText(block, 'updated')

      return {
        id: articleId('rss', index, title, link),
        title,
        description,
        content: '',
        url: link,
        imageUrl: image,
        urlToImage: image,
        source: cleanText(feed.name || safeHostname(feed.url), 80),
        author: stripHtml(tagText(block, 'dc:creator') || tagText(block, 'author'), 80),
        publishedAt: parseFeedDate(dateRaw),
        language: '',
      }
    })
    .filter(Boolean)
}

async function fetchRssFeeds({ feeds, query, max, signal }) {
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 9000)
      const onAbort = () => controller.abort()
      signal?.addEventListener('abort', onAbort, { once: true })

      try {
        const response = await fetch(feed.url, {
          headers: {
            'User-Agent': RSS_UA,
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
          },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`${feed.name}: HTTP ${response.status}`)
        const xml = await response.text()
        return parseRss(xml, feed, max)
      } finally {
        clearTimeout(timer)
        signal?.removeEventListener('abort', onAbort)
      }
    }),
  )

  const failed = results.filter((item) => item.status === 'rejected')
  if (failed.length > 0) {
    console.warn(
      '[news-rss] failed feeds:',
      failed.map((item) => item.reason?.message?.slice(0, 120)).slice(0, 4),
    )
  }

  let list = dedupe(results.flatMap((item) => (item.status === 'fulfilled' ? item.value : [])))

  // 用查询中的关键词做轻量过滤；匹配过少时保留全部，避免空列表。
  const hasOr = /\bOR\b/i.test(query)
  const tokens = query
    .toLowerCase()
    .replace(/["']/g, '')
    .split(/\bOR\b|\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4)

  if (tokens.length > 0) {
    const matched = list.filter((item) => {
      const text = `${item.title} ${item.description}`.toLowerCase()
      return tokens.some((token) => text.includes(token))
    })
    if (matched.length > 0 && (!hasOr || matched.length >= 3)) {
      list = matched
    }
  }

  return list
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, max)
}

/* ============================================================
 * Dify 新闻工作流（可选）
 * ============================================================ */

function extractArray(node, depth = 0) {
  if (!node || depth > 5) return null
  if (Array.isArray(node)) return node
  if (typeof node === 'string') {
    const text = node
      .replace(/```(?:json)?\s*([\s\S]*?)```/i, '$1')
      .trim()
    try {
      return extractArray(JSON.parse(text), depth + 1)
    } catch {
      const start = text.indexOf('[')
      const end = text.lastIndexOf(']')
      if (start >= 0 && end > start) {
        try {
          return extractArray(JSON.parse(text.slice(start, end + 1)), depth + 1)
        } catch {
          return null
        }
      }
      return null
    }
  }
  if (typeof node === 'object') {
    const keys = [
      'articles', 'news', 'items', 'list', 'results', 'result',
      'data', 'text', 'output', 'content',
    ]
    for (const key of keys) {
      if (key in node) {
        const found = extractArray(node[key], depth + 1)
        if (found) return found
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value) && value.length && typeof value[0] === 'object') {
        return value
      }
    }
  }
  return null
}

function normalizeDify(item, index) {
  if (!item || typeof item !== 'object') return null
  const title = cleanText(
    item.title ?? item.headline ?? item.name ?? item['标题'],
    260,
  )
  const url = normalizeUrl(
    item.url ?? item.link ?? item.href ?? item.webUrl ?? item.source_url ??
      item.original_url ?? item['原文链接'] ?? item['链接'],
  )
  if (!title || !url) return null
  const imageUrl = normalizeUrl(
    item.image ?? item.imageUrl ?? item.cover ?? item.coverUrl ??
      item.thumbnail ?? item['封面图'] ?? item['图片'],
  )
  return {
    id: articleId('dify', index, title, url),
    title,
    description: cleanText(
      item.summary ?? item.description ?? item.desc ?? item.snippet ??
        item.abstract ?? item['摘要'] ?? item['简介'] ?? item.content,
      520,
    ),
    content: '',
    url,
    imageUrl,
    urlToImage: imageUrl,
    source: cleanText(
      item.source ?? item.publisher ?? item.media ?? item.site ??
        item['来源'] ?? item['媒体'],
      80,
    ),
    author: cleanText(item.author ?? item.byline ?? item['作者'], 80),
    publishedAt: cleanText(
      item.publishedAt ?? item.published_at ?? item.pubDate ??
        item.date ?? item['发布时间'] ?? item['日期'],
      80,
    ) || new Date().toISOString(),
  }
}

async function fetchDifyNews({ cfg, query, max, signal }) {
  if (!cfg.difyKey) return []
  const inputs = { ...cfg.difyExtraInputs }
  if (cfg.difyQueryField) inputs[cfg.difyQueryField] = query
  if (cfg.difyLimitField) inputs[cfg.difyLimitField] = max

  const response = await fetch(`${cfg.difyBase}/v1/workflows/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${cfg.difyKey}`,
    },
    body: JSON.stringify({
      inputs,
      response_mode: 'blocking',
      user: 'lanzhi-portal-news',
    }),
    signal,
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`Dify ${response.status}: ${text.slice(0, 240)}`)

  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error('Dify 返回了非 JSON 响应。')
  }

  const run = payload?.data ?? payload
  if (run?.status && run.status !== 'succeeded') {
    throw new Error(run?.error || `Dify 工作流状态：${run.status}`)
  }
  const list = extractArray(run?.outputs ?? payload?.outputs ?? {})
  if (!list) throw new Error('Dify 工作流未返回可解析的 JSON 数组。')
  return list.map(normalizeDify).filter(Boolean)
}

/* ============================================================
 * 路由
 * ============================================================ */

function dedupe(articles) {
  const seen = new Set()
  return articles.filter((item) => {
    const key = `${item.title.slice(0, 90)}|${item.url}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function tryNewsApi({ cfg, query, max, signal }) {
  if (!cfg.newsApiKey) return null
  try {
    const articles = dedupe(
      await fetchNewsApi({
        base: cfg.newsApiBase,
        key: cfg.newsApiKey,
        query,
        max,
        signal,
      }),
    )
    if (articles.length > 0) {
      return { provider: 'newsapi', articles, fallback: true }
    }
  } catch (error) {
    if (signal.aborted) throw error
    console.warn('[news-proxy] NewsAPI fallback failed:', error?.message?.slice(0, 160))
  }
  return null
}

async function tryRss({ cfg, query, max, signal }) {
  if (!cfg.rssEnabled) return null
  try {
    const articles = dedupe(
      await fetchRssFeeds({
        feeds: cfg.rssFeeds,
        query,
        max,
        signal,
      }),
    )
    if (articles.length > 0) {
      return { provider: 'rss', articles, fallback: true }
    }
  } catch (error) {
    if (signal.aborted) throw error
    console.warn('[news-proxy] RSS fallback failed:', error?.message?.slice(0, 160))
  }
  return null
}

async function loadArticles({ cfg, query, max, signal }) {
  const requested = cfg.provider

  if (requested === 'rss') {
    const rss = await tryRss({ cfg, query, max, signal })
    return rss ?? { provider: 'rss', articles: [] }
  }

  if (requested === 'newsapi') {
    if (!cfg.newsApiKey) {
      const error = new Error('NEWS_PROVIDER=newsapi 但未配置 NEWS_API_KEY。')
      error.code = 'NEWS_NOT_CONFIGURED'
      throw error
    }
    const newsapi = await tryNewsApi({ cfg, query, max, signal })
    if (newsapi) return newsapi
    const rss = await tryRss({ cfg, query, max, signal })
    if (rss) return rss
    return { provider: 'newsapi', articles: [] }
  }

  if (requested === 'dify') {
    if (!cfg.difyKey) {
      const error = new Error('NEWS_PROVIDER=dify 但未配置 DIFY_NEWS_API_KEY。')
      error.code = 'NEWS_NOT_CONFIGURED'
      throw error
    }
    try {
      const articles = dedupe(await fetchDifyNews({ cfg, query, max, signal }))
      if (articles.length > 0) return { provider: 'dify', articles }
    } catch (error) {
      if (signal.aborted) throw error
      console.warn('[news-proxy] Dify news failed:', error?.message?.slice(0, 160))
    }
    const rss = await tryRss({ cfg, query, max, signal })
    if (rss) return rss
    return { provider: 'dify', articles: [] }
  }

  // 默认：GDELT 优先，同时并行准备 NewsAPI / 公共 RSS。
  // GDELT 单次最多等 7 秒；超时或 429 时立即使用已准备好的备用源。
  const newsApiPromise = cfg.newsApiKey
    ? tryNewsApi({ cfg, query, max, signal }).catch(() => null)
    : Promise.resolve(null)
  const rssPromise = cfg.rssEnabled
    ? tryRss({ cfg, query, max, signal }).catch(() => null)
    : Promise.resolve(null)

  try {
    const gdelt = dedupe(
      await fetchGdeltWithin({ base: cfg.gdeltBase, query, max, signal }),
    )
    if (gdelt.length > 0) return { provider: 'gdelt', articles: gdelt }
  } catch (error) {
    if (signal.aborted) throw error
    console.warn('[news-proxy] GDELT failed:', error?.message?.slice(0, 160))
  }

  const newsapi = await newsApiPromise
  if (newsapi) return newsapi

  const rss = await rssPromise
  if (rss) return rss

  return { provider: cfg.provider === 'gdelt' ? 'gdelt' : requested, articles: [] }
}

export async function handleNews(req, res) {
  const cfg = config()
  const url = new URL(req.url || '/', 'http://localhost')
  const pathname = url.pathname

  if (pathname === '/health' || pathname === '/api/news/health') {
    const configured =
      cfg.provider === 'gdelt' || cfg.provider === 'rss'
        ? true
        : cfg.provider === 'newsapi'
          ? Boolean(cfg.newsApiKey)
          : Boolean(cfg.difyKey)
    return json(res, 200, {
      ok: true,
      provider: cfg.provider,
      configured,
      fallback:
        cfg.provider === 'gdelt' && (Boolean(cfg.newsApiKey) || cfg.rssEnabled),
      rss: {
        enabled: cfg.rssEnabled,
        feeds: cfg.rssFeeds.length,
      },
      note:
        cfg.provider === 'gdelt'
          ? 'GDELT requires no key. NewsAPI and public RSS are optional fallbacks.'
          : 'Credentials stay server-side.',
    })
  }

  // GDELT 对过短查询返回 InvalidParameter；在代理层提前拦截。
  const rawQuery = (url.searchParams.get('q') || '').trim()
  if (rawQuery && rawQuery.length < 5) {
    return json(res, 400, {
      code: 'QUERY_INVALID',
      provider: cfg.provider,
      message: '检索词至少需要 5 个字符（GDELT 查询要求）。',
    })
  }

  const ip = req.socket?.remoteAddress || 'unknown'
  if (limited(ip)) {
    return json(res, 429, {
      code: 'NEWS_RATE_LIMITED',
      provider: cfg.provider,
      message: '资讯请求过于频繁，请稍后再试。',
    })
  }

  const query = pickQuery(url.searchParams)
  const max = pickLimit(url.searchParams)
  const cacheKey = `${cfg.provider}::${query}::${max}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    res.setHeader('X-News-Cache', 'HIT')
    return json(res, 200, { ...cached.data, cached: true })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const started = Date.now()

  try {
    const { provider, articles, fallback } = await loadArticles({
      cfg,
      query,
      max,
      signal: controller.signal,
    })

    const result = {
      provider,
      query,
      requestedAt: new Date().toISOString(),
      elapsedMs: Date.now() - started,
      total: articles.length,
      articles: articles.slice(0, max),
      cached: false,
      fallback: Boolean(fallback),
    }

    cache.set(cacheKey, { at: Date.now(), data: result })
    res.setHeader('X-News-Cache', 'MISS')
    return json(res, 200, result)
  } catch (error) {
    const aborted = error?.name === 'AbortError'
    const safeMessage = redact(error?.message || error, [cfg.newsApiKey, cfg.difyKey])
    console.error('[news-proxy]', cfg.provider, aborted ? 'timeout' : safeMessage.slice(0, 300))

    if (error?.code === 'NEWS_NOT_CONFIGURED') {
      return json(res, 503, {
        code: 'NEWS_NOT_CONFIGURED',
        provider: cfg.provider,
        message:
          '当前资讯源需要密钥但尚未配置。可切换 NEWS_PROVIDER=gdelt（无需密钥），或配置 NEWS_API_KEY / DIFY_NEWS_API_KEY。',
      })
    }

    return json(res, 502, {
      code: aborted
        ? 'NEWS_UPSTREAM_TIMEOUT'
        : error?.code === 'GDELT_RATE_LIMITED'
          ? 'NEWS_RATE_LIMITED'
          : 'NEWS_UPSTREAM_ERROR',
      provider: cfg.provider,
      message: aborted
        ? '资讯上游响应超时，请稍后重试。'
        : error?.code === 'GDELT_RATE_LIMITED'
          ? 'GDELT 请求过于频繁（官方约每 5 秒 1 次）；公共 RSS 备用源也未取到内容，请稍后重试。'
          : '资讯上游暂时不可用：GDELT、NewsAPI 与公共 RSS 均未返回内容，请稍后重试。',
      detail: aborted ? undefined : safeMessage.slice(0, 300),
    })
  } finally {
    clearTimeout(timer)
  }
}

/** Express / Vite Connect 路由处理器 */
export function newsHandler(req, res) {
  Promise.resolve(handleNews(req, res)).catch((error) => {
    console.error('[news-handler]', error)
    if (!res.headersSent) json(res, 500, { message: '资讯代理内部错误。' })
  })
}
