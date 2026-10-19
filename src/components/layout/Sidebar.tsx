import { NavLink } from 'react-router-dom'
import {
  Database,
  FolderOpen,
  Info,
  LayoutDashboard,
  Sparkles,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/cn'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '总览', icon: LayoutDashboard, end: true },
  { to: '/assistant', label: '智能决策', icon: Sparkles },
  { to: '/knowledge', label: '知识资产', icon: Database },
  { to: '/cases', label: '修复案例', icon: FolderOpen },
  { to: '/about', label: '项目介绍', icon: Info },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col items-center border-r border-white/10 bg-[#0B192C]/92 px-2 py-4 backdrop-blur-xl lg:flex">
      <NavLink
        to="/"
        aria-label="澜知首页"
        className="group relative grid h-11 w-11 place-items-center rounded-2xl border border-tech-green/25 bg-gradient-to-br from-tech-cyan/25 via-[#0B3B55] to-transparent text-tech-green shadow-neon-cyan"
      >
        <Waves className="h-5 w-5" strokeWidth={2.1} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#0B192C] bg-tech-green" />
      </NavLink>

      <div className="mt-6 flex w-full flex-col items-center gap-1.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'group relative grid h-11 w-11 place-items-center rounded-xl border border-transparent text-tech-faint transition hover:border-white/10 hover:bg-white/[0.04] hover:text-tech-ink',
                isActive && 'sidebar-active',
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

      <div className="mt-auto flex flex-col items-center gap-3">
        <span className="h-px w-8 bg-white/10" />
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-tech-faint/70">V1.0</span>
        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-[9px] text-tech-faint">
          澜
        </span>
      </div>
    </aside>
  )
}

export function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="grid gap-1 p-2">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-tech-muted transition hover:bg-white/[0.04] hover:text-tech-ink',
              isActive && 'sidebar-active text-tech-green',
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
