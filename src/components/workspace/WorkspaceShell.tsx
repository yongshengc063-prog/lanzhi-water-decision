import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowLeft, Waves } from 'lucide-react'
import { cn } from '../../lib/cn'
import { WORKSPACE_NAV, WorkspaceSidebar } from './WorkspaceSidebar'

/**
 * 工作仓统一外壳：
 *  - 桌面：左侧 76px 导航（总览 / 知识库 / 智能决策 / 设置）
 *  - 移动：顶部 Logo + 横向导航
 */
export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div className="tech-root system-bg min-h-screen">
      <div className="pointer-events-none fixed inset-0 tech-grid opacity-50" aria-hidden="true" />
      <WorkspaceSidebar />

      <div className="relative lg:pl-[76px]">
        {/* 移动端导航 */}
        <header className="border-b border-white/[0.08] bg-[#091426]/75 backdrop-blur-xl lg:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <Link to="/workspace" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-tech-cyan/30 to-tech-blue/20 text-tech-cyan">
                <Waves className="h-4 w-4" />
              </span>
              <span className="font-display text-[15px] font-bold text-tech-ink">澜知工作仓</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-tech-muted"
            >
              <ArrowLeft className="h-3 w-3" />
              返回门户
            </Link>
          </div>

          <nav className="hide-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
            {WORKSPACE_NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] text-tech-muted transition',
                    isActive && 'bg-tech-cyan/10 text-tech-cyan',
                  )
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </div>
  )
}
