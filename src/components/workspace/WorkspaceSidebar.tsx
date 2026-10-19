import { Link, NavLink } from 'react-router-dom'
import {
  Database,
  Home,
  LayoutDashboard,
  Settings2,
  Sparkles,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/cn'

export interface WorkspaceNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const WORKSPACE_NAV: WorkspaceNavItem[] = [
  { to: '/workspace', label: '总览', icon: LayoutDashboard, end: true },
  { to: '/knowledge', label: '知识库', icon: Database },
  { to: '/assistant', label: '智能决策', icon: Sparkles },
  { to: '/settings', label: '设置', icon: Settings2 },
]

export function WorkspaceSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col items-center border-r border-white/[0.08] bg-[#091426]/80 py-4 backdrop-blur-xl lg:flex">
      <Link
        to="/workspace"
        aria-label="澜知工作仓"
        className="relative grid h-11 w-11 place-items-center rounded-2xl border border-tech-cyan/30 bg-gradient-to-br from-tech-cyan/25 via-[#123A73] to-transparent text-tech-cyan shadow-neon-cyan"
      >
        <Waves className="h-5 w-5" strokeWidth={2.1} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#091426] bg-tech-green" />
      </Link>

      <div className="mt-7 flex w-full flex-col items-center gap-1.5">
        {WORKSPACE_NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'group relative grid h-11 w-11 place-items-center rounded-xl border border-transparent text-tech-faint transition hover:border-white/10 hover:bg-white/[0.04] hover:text-tech-ink',
                isActive && 'border-tech-cyan/20 bg-tech-cyan/10 text-tech-cyan',
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            <span className="pointer-events-none absolute left-[52px] z-50 whitespace-nowrap rounded-md border border-white/10 bg-[#102544] px-2.5 py-1 text-[11px] text-tech-ink opacity-0 shadow-float transition group-hover:opacity-100">
              {label}
            </span>
          </NavLink>
        ))}
      </div>

      <Link
        to="/"
        aria-label="回门户主页"
        className="mt-auto flex w-[54px] flex-col items-center gap-1 rounded-xl border border-white/10 py-2 text-tech-muted transition hover:border-tech-cyan/35 hover:bg-white/[0.04] hover:text-tech-cyan"
      >
        <Home className="h-4 w-4" />
        <span className="text-[9px] leading-none">主页</span>
      </Link>
      <span className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-tech-faint/70">
        V1.0
      </span>
    </aside>
  )
}
