/**
 * 公共资讯客户端
 * ------------------------------------------------------------
 * 浏览器只请求本站 /api/news；服务端再调用 GDELT / NewsAPI / Dify。
 *
 * 前端增强：
 *  - AbortController 超时控制（默认 25s，GDELT 实测可能 18–21s）
 *  - 指数退避重试（最多 2 次）
 *  - 关键词长度校验（GDELT 要求 ≥ 5 字符）
 *  - 友好错误文案，不向用户暴露裸的 Failed to fetch
 */

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string
  source: string
  author: string
  publishedAt: string
  urlToImage: string
  /** GDELT 返回的语种，可选 */
  language?: string
}

export interface NewsResponse {
  provider: string
  query: string
  requestedAt: string
  elapsedMs?: number
  total: number
  articles: NewsArticle[]
  cached?: boolean
  fallback?: boolean
}

export interface NewsQuery {
  q?: string
  max?: number
}

export interface FetchNewsOptions {
  /** 第 attempt 次重试前触发（attempt 从 1 开始） */
  onRetry?: (attempt: number, error: Error) => void
}

export class NewsApiError extends Error {
  code?: string
  status?: number
  provider?: string

  constructor(
    message: string,
    options: { code?: string; status?: number; provider?: string } = {},
  ) {
    super(message)
    this.name = 'NewsApiError'
    this.code = options.code
    this.status = options.status
    this.provider = options.provider
  }
}

const ENDPOINT = (import.meta.env.VITE_NEWS_ENDPOINT as string | undefined) || '/api/news'
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_NEWS_TIMEOUT_MS || 25_000)
const MAX_RETRIES = 2
const BACKOFF_BASE_MS = 900

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const timer = window.setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

function isRetryableStatus(status?: number) {
  return (
    status === 408 ||
    status === 425 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  )
}

function friendlyError(error: unknown, timedOut: boolean): NewsApiError {
  if (error instanceof NewsApiError) return error

  if (timedOut) {
    return new NewsApiError(
      '资讯加载超时：GDELT 接口响应较慢，正在重试后仍失败，请稍后重试。',
      { code: 'NEWS_TIMEOUT' },
    )
  }

  if (error instanceof TypeError) {
    return new NewsApiError(
      '资讯加载暂时失败：无法连接资讯服务，请检查网络或稍后重试。',
      { code: 'NETWORK_ERROR' },
    )
  }

  return new NewsApiError(
    '资讯加载暂时失败，GDELT 接口响应较慢或网络不可用，请稍后重试。',
    { code: 'NEWS_ERROR' },
  )
}

export async function fetchNews(
  { q = '', max = 12 }: NewsQuery,
  signal?: AbortSignal,
  options: FetchNewsOptions = {},
): Promise<NewsResponse> {
  const query = q.trim()

  // GDELT 对过短查询会返回 InvalidParameter。
  if (query && query.length < 5) {
    throw new NewsApiError('检索词至少需要 5 个字符（GDELT 查询要求）。', {
      code: 'QUERY_INVALID',
    })
  }

  const params = new URLSearchParams()
  if (query) params.set('q', query)
  params.set('max', String(max))
  const url = `${ENDPOINT}?${params.toString()}`

  let lastError: NewsApiError | null = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    const controller = new AbortController()
    let timedOut = false
    const timer = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    const onExternalAbort = () => controller.abort()
    signal?.addEventListener('abort', onExternalAbort, { once: true })

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })

      type NewsPayload = Partial<NewsResponse> & {
        message?: string
        code?: string
        provider?: string
      }

      let payload: NewsPayload | null = null
      try {
        payload = (await response.json()) as NewsPayload
      } catch {
        /* non-JSON error body */
      }

      if (!response.ok) {
        throw new NewsApiError(payload?.message || `资讯服务返回 ${response.status}`, {
          code: payload?.code,
          status: response.status,
          provider: payload?.provider,
        })
      }

      const articles = Array.isArray(payload?.articles) ? payload!.articles : []
      return {
        provider: payload?.provider || 'gdelt',
        query: payload?.query || query,
        requestedAt: payload?.requestedAt || new Date().toISOString(),
        elapsedMs: payload?.elapsedMs,
        total: payload?.total ?? articles.length,
        articles,
        cached: payload?.cached,
        fallback: payload?.fallback,
      }
    } catch (error) {
      // 用户主动取消 / 组件卸载：不重试，交给 useNews 忽略。
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

      const retryable =
        timedOut ||
        error instanceof TypeError ||
        (error instanceof NewsApiError && isRetryableStatus(error.status))

      lastError = friendlyError(error, timedOut)

      if (attempt < MAX_RETRIES && retryable) {
        options.onRetry?.(attempt + 1, lastError)
        await sleep(BACKOFF_BASE_MS * 2 ** attempt, signal)
        continue
      }

      throw lastError
    } finally {
      window.clearTimeout(timer)
      signal?.removeEventListener('abort', onExternalAbort)
    }
  }

  throw lastError ?? new NewsApiError('资讯加载失败，请稍后重试。')
}

export function formatNewsDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '日期未知'
  const now = Date.now()
  const diff = now - date.getTime()
  if (diff >= 0 && diff < 60 * 60 * 1000) {
    return `${Math.max(1, Math.round(diff / 60000))} 分钟前`
  }
  if (diff >= 0 && diff < 24 * 60 * 60 * 1000) {
    return `${Math.round(diff / 3600000)} 小时前`
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function estimateReadMinutes(article: NewsArticle): number {
  const chars = (article.description || article.title || '').length
  return Math.max(1, Math.round(chars / 380))
}
