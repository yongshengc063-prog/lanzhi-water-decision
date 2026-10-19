import { useState } from 'react'
import { ExternalLink, ImageOff, Newspaper } from 'lucide-react'
import type { NewsArticle } from '../../lib/news'
import { cn } from '../../lib/cn'

export function NewsThumb({
  article,
  className,
  iconClassName,
}: {
  article: NewsArticle
  className?: string
  iconClassName?: string
}) {
  const [failed, setFailed] = useState(false)
  const src = article.imageUrl || article.urlToImage

  if (!src || failed) {
    return (
      <div
        className={cn(
          'relative grid place-items-center overflow-hidden bg-gradient-to-br from-portal-brandSoft via-[#DDF3FA] to-portal-leafSoft',
          className,
        )}
      >
        <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-portal-water/10 blur-2xl" />
        {failed ? (
          <ImageOff className={cn('relative h-7 w-7 text-portal-brand/40', iconClassName)} />
        ) : (
          <Newspaper className={cn('relative h-8 w-8 text-portal-brand/35', iconClassName)} />
        )}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn(
        'h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]',
        className,
      )}
    />
  )
}

/**
 * 资讯卡片：封面 + 标题（2 行）+ 摘要（3 行）+ 来源。
 * Grid 使用 auto-rows-fr，卡片 h-full，保证等宽等高。
 * 点击由 <a target="_blank"> 打开原媒体，不在站内转载全文。
 */
export function NewsCard({ article }: { article: NewsArticle }) {
  const content = (
    <>
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
        <NewsThumb article={article} className="h-full w-full" />
        <span className="absolute left-3 top-3 max-w-[72%] truncate rounded-full bg-white/92 px-2.5 py-1 text-[10.5px] font-semibold text-portal-brandDeep shadow-sm backdrop-blur">
          {article.source || '来源未标注'}
        </span>
        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-portal-brand opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
          <ExternalLink className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-[16.5px] font-bold leading-[1.55] text-portal-ink transition group-hover:text-portal-brandDeep">
          {article.title}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-[12.5px] leading-6 text-portal-body">
          {article.description || '暂无摘要，点击查看完整报道。'}
        </p>
      </div>
    </>
  )

  if (!article.url) {
    return (
      <div className="flex h-full cursor-default flex-col overflow-hidden rounded-2xl border border-portal-line bg-white shadow-portal-sm">
        {content}
      </div>
    )
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`在新标签页打开原文：${article.title}`}
      className="portal-card portal-card-hover group flex h-full flex-col overflow-hidden"
    >
      {content}
    </a>
  )
}
