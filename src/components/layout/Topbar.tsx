import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Menu, ShieldCheck, Waves, X } from 'lucide-react'
import { MobileNav } from './Sidebar'

export function Topbar({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle: string
  actions?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B192C]/85 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="flex items-center gap-2 lg:hidden" aria-label="澜知首页">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-tech-cyan to-tech-green text-[#04121F]">
              <Waves className="h-4 w-4" />
            </span>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-display text-[17px] font-bold tracking-wide text-tech-ink">{title}</h1>
              <span className="hidden rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[8.5px] tracking-wider text-tech-faint sm:inline">
                LANZHI
              </span>
            </div>
            <p className="mt-0.5 truncate text-[10.5px] tracking-[0.08em] text-tech-faint">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-tech-green/20 bg-tech-green/[0.06] px-2.5 py-1 text-[10px] text-tech-green xl:inline-flex">
            <ShieldCheck className="h-3 w-3" />
            辅助决策 · 非实时监测
          </span>
          {actions}
          <Link
            to="/assistant"
            className="hidden h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-tech-cyan to-tech-green px-4 text-[11.5px] font-semibold text-[#04121F] transition hover:-translate-y-0.5 hover:shadow-neon-cyan sm:flex"
          >
            开启智能决策
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-tech-muted lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0B192C] p-2 lg:hidden">
          <MobileNav onNavigate={() => setOpen(false)} />
        </div>
      )}
    </header>
  )
}
