import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchNews,
  NewsApiError,
  type NewsQuery,
  type NewsResponse,
} from '../lib/news'

interface UseNewsOptions extends NewsQuery {
  /** 输入防抖，毫秒 */
  debounceMs?: number
  enabled?: boolean
}

interface UseNewsState {
  data: NewsResponse | null
  loading: boolean
  /** 当前正处于第几次重试；0 表示未重试 */
  retrying: number
  error: NewsApiError | null
  reload: () => void
}

export function useNews({
  q = '',
  max = 12,
  debounceMs = 450,
  enabled = true,
}: UseNewsOptions): UseNewsState {
  const [data, setData] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [retrying, setRetrying] = useState(0)
  const [error, setError] = useState<NewsApiError | null>(null)
  const [nonce, setNonce] = useState(0)
  const firstLoad = useRef(true)

  const reload = useCallback(() => setNonce((value) => value + 1), [])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    const delay = firstLoad.current ? 0 : debounceMs
    firstLoad.current = false

    setLoading(true)
    setError(null)
    setRetrying(0)

    const timer = window.setTimeout(() => {
      fetchNews({ q, max }, controller.signal, {
        onRetry: (attempt) => setRetrying(attempt),
      })
        .then((response) => {
          setData(response)
          setLoading(false)
          setRetrying(0)
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return
          setError(
            err instanceof NewsApiError
              ? err
              : new NewsApiError(err instanceof Error ? err.message : '资讯加载失败'),
          )
          setLoading(false)
          setRetrying(0)
        })
    }, delay)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [q, max, debounceMs, enabled, nonce])

  return { data, loading, retrying, error, reload }
}
