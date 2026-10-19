import { Link } from 'react-router-dom'
import { ArrowLeft, FlaskConical, RotateCcw, Settings2, Waves } from 'lucide-react'
import type { ApiSettings, RunStatus } from '../types'
import { cn } from '../lib/cn'
import { PUBLIC_DEMO_ONLY } from '../lib/settings'
import { Badge } from './ui'
import { SpriteStatus, type SpriteState } from './mascot/WaterSprite'

interface TopBarProps {
  status: RunStatus
  settings: ApiSettings
  onOpenSettings: () => void
  onToggleMode: () => void
  onReset: () => void
  hasResult: boolean
}

const SPRITE_MAP: Record<RunStatus, { state: SpriteState; label: string }> = {
  idle: { state: 'idle', label: '小澜待命' },
  running: { state: 'thinking', label: '小澜分析中' },
  succeeded: { state: 'success', label: '分析完成' },
  failed: { state: 'error', label: '需要检查' },
}

export function TopBar({
  status,
  settings,
  onOpenSettings,
  onToggleMode,
  onReset,
  hasResult,
}: TopBarProps) {
  const sprite = SPRITE_MAP[status]

  return (
    <header className="sticky top-0 z-40 border-b border-tech-cyan/15 bg-[#0B192C]/82 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-tech-cyan/45 to-transparent" />
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/workspace"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-tech-muted transition hover:border-tech-cyan/35 hover:text-tech-ink lg:flex"
          >
            <ArrowLeft className="h-3 w-3" />
            返回工作仓
          </Link>

          <Link to="/workspace" className="flex min-w-0 items-center gap-3">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-tech-cyan/30 bg-gradient-to-br from-tech-cyan/25 via-[#0C3B62] to-transparent text-tech-cyan shadow-neon-cyan">
              <Waves className="h-5 w-5" strokeWidth={2} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#0B192C] bg-tech-green" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-[18px] font-extrabold leading-none tracking-[0.04em] text-tech-ink">
                  澜知<span className="text-tech-cyan">·</span>LANZHI
                </h1>
                <span className="hidden rounded-md border border-tech-cyan/20 bg-tech-cyan/[0.06] px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-tech-cyan/80 sm:inline">
                  COCKPIT
                </span>
              </div>
              <p className="mt-1 truncate text-[10.5px] tracking-[0.08em] text-tech-muted">
                决策控制台 · 辅助决策不等于工程设计
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="mr-1 hidden items-center gap-2 xl:flex">
            <SpriteStatus state={sprite.state} label={sprite.label} />
            <Badge
              tone={settings.demo ? 'amber' : 'good'}
              icon={<span className="h-1.5 w-1.5 rounded-full bg-current" />}
            >
              {settings.demo ? '演示样例 · 仅演示' : '实时模式 · 服务端代理'}
            </Badge>
            {status === 'running' && (
              <Badge tone="cyan" icon={<FlaskConical className="h-3 w-3 animate-pulse" />}>
                工作流运行中
              </Badge>
            )}
            {status === 'succeeded' && <Badge tone="good">决策完成</Badge>}
            {status === 'failed' && <Badge tone="danger">执行失败</Badge>}
          </div>

          {PUBLIC_DEMO_ONLY ? (
            <span className="hidden items-center gap-2 rounded-full border border-tech-amber/30 bg-tech-amber/[0.08] px-2.5 py-1.5 text-[10.5px] font-medium text-tech-amber md:flex">
              公开演示版
            </span>
          ) : (
            <button
              type="button"
              role="switch"
              aria-checked={!settings.demo}
              onClick={onToggleMode}
              aria-label={settings.demo ? '切换到运行模式' : '切换到演示模式'}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10.5px] text-tech-muted transition hover:border-tech-cyan/35 md:flex"
            >
              <span className={cn('font-medium', settings.demo ? 'text-tech-amber' : 'text-tech-green')}>
                {settings.demo ? '演示模式' : '运行模式'}
              </span>
              <span
                className={cn(
                  'relative h-4 w-8 rounded-full border transition',
                  settings.demo
                    ? 'border-tech-amber/40 bg-tech-amber/20'
                    : 'border-tech-green/40 bg-tech-green/20',
                )}
              >
                <span
                  className={cn(
                    'absolute top-[2px] h-3 w-3 rounded-full transition-all',
                    settings.demo ? 'left-[2px] bg-tech-amber' : 'left-[16px] bg-tech-green',
                  )}
                />
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            aria-label="新建决策"
            disabled={!hasResult && status === 'idle'}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-tech-muted transition hover:border-tech-cyan/35 hover:text-tech-ink disabled:cursor-not-allowed disabled:opacity-35"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">新建决策</span>
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="运行模式"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-tech-muted transition hover:border-tech-cyan/35 hover:text-tech-ink"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">运行模式</span>
          </button>
        </div>
      </div>
    </header>
  )
}
