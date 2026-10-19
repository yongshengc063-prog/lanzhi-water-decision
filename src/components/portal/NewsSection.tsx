import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Globe2,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react'
import { useNews } from '../../hooks/useNews'
import { cn } from '../../lib/cn'
import { NewsCard } from './NewsCard'

interface NewsSectionProps {
  query: string
  onSearch: (q: string) => void
}

function updatedAt(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function NewsSection({ query, onSearch }: NewsSectionProps) {
  const [input, setInput] = useState(query)
  const { data, loading, retrying, error, reload } = useNews({ q: query, max: 15 })

  useEffect(() => {
    setInput(query)
  }, [query])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    onSearch(input.trim())
    document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const articles = data?.articles ?? []

  return (
    <section id="news" className="scroll-mt-24 py-14 md:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="portal-eyebrow">
            <span className="h-px w-6 bg-portal-brand/50" />
            Global Water Intelligence
          </div>
          <h2 className="mt-3 font-display text-[30px] font-extrabold leading-tight text-portal-ink md:text-[36px]">
            全球水质资讯
          </h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-portal-body">
            汇聚全球水质、污染治理与生态修复领域的最新报道，记录每一次向清水而行的努力。
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <form onSubmit={submit} className="relative">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="搜索关键词，如 wetland"
              className="portal-input h-10 w-[230px] pr-10 text-[12.5px]"
              aria-label="搜索资讯"
            />
            <button
              type="submit"
              aria-label="搜索资讯"
              className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-portal-muted transition hover:bg-portal-brandSoft hover:text-portal-brand"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-portal-line bg-white px-3.5 text-[12px] font-medium text-portal-body transition hover:border-portal-brand/30 hover:text-portal-brand disabled:opacity-50"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
            刷新
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <span className="flex items-center gap-2 text-[11px] text-portal-muted">
          {data ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-portal-leafSoft px-2.5 py-1 font-medium text-portal-leafDeep">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-portal-leaf" />
                最新资讯 · {data.total} 条
              </span>
              <span>更新于 {updatedAt(data.requestedAt)}</span>
            </>
          ) : error ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4E5] px-2.5 py-1 text-[11px] font-medium text-portal-gold">
              <AlertCircle className="h-3.5 w-3.5" />
              资讯暂时不可用
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-portal-muted">
              <Globe2 className="h-3.5 w-3.5" />
              正在获取最新资讯
            </span>
          )}
        </span>
      </div>

      <div className="mt-7">
        {loading && retrying > 0 && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-portal-line bg-white px-4 py-2.5 text-[11.5px] text-portal-body shadow-portal-sm">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-portal-brand" />
            <span>资讯加载较慢，正在重试…</span>
          </div>
        )}

        {loading && articles.length === 0 && <NewsSkeleton />}

        {!loading && error && (
          <NewsError code={error.code} onRetry={reload} />
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="portal-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-portal-mist text-portal-muted">
              <Search className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-[18px] font-bold text-portal-ink">
              没有检索到相关资讯
            </h3>
            <p className="mt-1.5 max-w-md text-[12.5px] leading-6 text-portal-body">
              换个关键词，或浏览其他主题。
            </p>
          </div>
        )}

        {!error && articles.length > 0 && (
          <>
            <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-portal-line bg-portal-mist/60 px-4 py-3 text-[11px] leading-5 text-portal-muted">
              内容版权归原媒体所有 · 点击卡片查看原文
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function NewsSkeleton() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-portal-line bg-white"
        >
          <div className="aspect-[16/10] shrink-0 animate-pulse bg-gradient-to-br from-portal-mist to-portal-soft" />
          <div className="flex flex-1 flex-col space-y-3 p-5">
            <div className="h-3.5 w-full animate-pulse rounded-full bg-portal-soft" />
            <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-portal-soft" />
            <div className="h-2.5 w-full animate-pulse rounded-full bg-portal-mist" />
            <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-portal-mist" />
            <div className="mt-auto h-2.5 w-28 animate-pulse rounded-full bg-portal-soft" />
          </div>
        </div>
      ))}
    </div>
  )
}

function NewsError({
  code,
  onRetry,
}: {
  code?: string
  onRetry: () => void
}) {
  const queryInvalid = code === 'QUERY_INVALID'

  return (
    <div className="overflow-hidden rounded-2xl border border-portal-line bg-white shadow-portal-sm">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:p-8">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FFF4E5] text-portal-gold">
          <AlertCircle className="h-6 w-6" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[18px] font-bold text-portal-ink">
            {queryInvalid ? '请输入更完整的关键词' : '资讯暂时无法加载'}
          </h3>
          <p className="mt-2 text-[12.5px] leading-6 text-portal-body">
            {queryInvalid
              ? '检索词至少需要 5 个字符，请补充后再试。'
              : '网络开了个小差，请稍后重试。'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-portal-brand px-4 text-[12px] font-semibold text-white transition hover:bg-portal-brandDeep"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              重新加载
            </button>
            <a
              href="#technology"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-portal-line px-4 text-[12px] font-medium text-portal-body transition hover:border-portal-brand/30 hover:text-portal-brand"
            >
              <Sparkles className="h-3.5 w-3.5" />
              浏览治理技术
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
