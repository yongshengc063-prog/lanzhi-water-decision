import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, Sparkles, X } from 'lucide-react'
import { PORTAL_NAV } from '../../data/portal'
import { cn } from '../../lib/cn'

function formatToday() {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date())
}

export function PortalHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const value = query.trim()
    navigate(value ? `/?q=${encodeURIComponent(value)}#news` : '/#news')
    setOpen(false)
  }

  const isHome = location.pathname === '/'

  return (
    <header className="relative z-30">
      {/* 顶部信息条：高校官网式信息层级 */}
      <div className="hidden border-b border-portal-line/80 bg-portal-mist/80 md:block">
        <div className="portal-container flex h-9 items-center justify-between text-[11.5px] text-portal-muted">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-portal-leaf" />
            全球水质资讯 · 知识增强诊断 · 可追溯修复决策
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline">科研演示平台 · 辅助决策不等同于工程设计</span>
            <span className="h-3 w-px bg-portal-line" />
            <span>{formatToday()}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-portal-line/90 bg-portal-surface/92 backdrop-blur-xl">
        <div className="portal-container flex h-[74px] items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="澜知首页">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-portal-brand via-portal-water to-portal-leaf text-white shadow-portal">
              <WaveMark className="h-6 w-6" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-portal-leaf" />
            </span>
            <span className="min-w-0">
              <span className="flex items-baseline gap-2">
                <span className="font-display text-[21px] font-extrabold leading-none tracking-[0.02em] text-portal-ink">
                  澜知
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-portal-muted">
                  LANZHI
                </span>
              </span>
              <span className="mt-1 block truncate text-[10.5px] tracking-[0.06em] text-portal-muted">
                全球水质资讯与水域生态修复智能决策平台
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
            {PORTAL_NAV.map((item) => {
              const active = item.hash
                ? isHome && location.hash === `#${item.hash}`
                : isHome && !location.hash
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition',
                    active
                      ? 'text-portal-brandDeep'
                      : 'text-portal-body hover:bg-portal-brandSoft/70 hover:text-portal-brandDeep',
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-portal-brand" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <form onSubmit={submit} className="relative hidden md:block">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索全球水质资讯"
                aria-label="搜索全球水质资讯"
                className="portal-input h-9 w-[188px] pr-9 text-[12px] lg:w-[220px]"
              />
              <button
                type="submit"
                aria-label="搜索"
                className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-portal-muted transition hover:bg-portal-brandSoft hover:text-portal-brand"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            <Link
              to="/workspace"
              className="hidden h-9 items-center gap-1.5 rounded-full bg-portal-brand px-4 text-[12.5px] font-semibold text-white shadow-portal transition hover:-translate-y-0.5 hover:bg-portal-brandDeep hover:shadow-portal-hover sm:flex"
            >
              <Sparkles className="h-3.5 w-3.5" />
              进入工作仓
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? '关闭菜单' : '打开菜单'}
              className="grid h-9 w-9 place-items-center rounded-full border border-portal-line text-portal-body transition hover:border-portal-brand/30 hover:text-portal-brand lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="overflow-hidden border-t border-portal-line bg-portal-surface lg:hidden"
            >
              <div className="portal-container space-y-1 py-3">
                <form onSubmit={submit} className="relative mb-2 md:hidden">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索全球水质资讯"
                    className="portal-input h-10 pr-10"
                  />
                  <button
                    type="submit"
                    aria-label="搜索"
                    className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-portal-muted"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
                {PORTAL_NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-[14px] font-medium text-portal-body transition hover:bg-portal-brandSoft hover:text-portal-brandDeep"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/workspace"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-portal-brand px-3 py-2.5 text-[13.5px] font-semibold text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  进入工作仓
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function WaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 14.5c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M3 9.5c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M3 19.5c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}
