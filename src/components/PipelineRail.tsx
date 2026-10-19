import {
  BookOpenCheck,
  Check,
  CircleDashed,
  FileText,
  LoaderCircle,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { STAGES, TOTAL_NODES } from '../config'
import { cn } from '../lib/cn'
import type { NodeStateMap, RunStatus } from '../types'
import { Panel } from './ui'

const STAGE_ICONS: Record<string, LucideIcon> = {
  prepare: SlidersHorizontal,
  retrieve: BookOpenCheck,
  diagnose: ScanSearch,
  score: Sparkles,
  report: FileText,
}

type StageStatus = 'pending' | 'active' | 'done' | 'failed'

export function PipelineRail({
  nodeStates,
  activeNode,
  status,
  doneCount,
}: {
  nodeStates: NodeStateMap
  activeNode: string | null
  status: RunStatus
  doneCount: number
}) {
  const progress = status === 'succeeded' ? 1 : doneCount / TOTAL_NODES

  const stageStatus = (nodeIds: string[]): StageStatus => {
    const states = nodeIds.map((id) => nodeStates[id]?.status ?? 'pending')
    if (states.some((state) => state === 'failed')) return 'failed'
    if (states.every((state) => state === 'done')) return 'done'
    if (states.some((state) => state === 'running' || state === 'done')) return 'active'
    return 'pending'
  }

  return (
    <Panel bodyClassName="px-4 py-3.5 md:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-60',
                status === 'running' ? 'animate-ping bg-tech-cyan' : 'bg-transparent',
              )}
            />
            <span
              className={cn(
                'relative inline-flex h-2 w-2 rounded-full',
                status === 'failed'
                  ? 'bg-tech-red'
                  : status === 'succeeded'
                    ? 'bg-tech-green'
                    : status === 'running'
                      ? 'bg-tech-cyan'
                      : 'bg-fainter',
              )}
            />
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-tech-cyan/70">Workflow Pipeline</span>
          <span className="hidden text-[10px] text-tech-faint sm:inline">
            {status === 'running'
              ? activeNode ?? '调度中'
              : status === 'succeeded'
                ? '全部节点已完成'
                : status === 'failed'
                  ? '执行中断'
                  : '等待启动'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-tech-faint">
          <span>{doneCount.toString().padStart(2, '0')}</span>
          <span>/ {TOTAL_NODES} nodes</span>
          <span className="text-tech-cyan">{Math.round(progress * 100)}%</span>
        </div>
      </div>

      <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500 ease-out',
            status === 'failed'
              ? 'bg-tech-red'
              : 'bg-gradient-to-r from-tech-cyan/50 via-tech-cyan to-tech-green bg-[length:200%_100%] animate-shimmer',
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mt-3 flex items-stretch gap-0 overflow-x-auto pb-1">
        {STAGES.map((stage, index) => {
          const stageState = stageStatus(stage.nodeIds)
          const Icon = STAGE_ICONS[stage.key] ?? CircleDashed
          const runningNode = stage.nodeIds
            .map((id) => nodeStates[id])
            .find((state) => state?.status === 'running')

          return (
            <div key={stage.key} className="flex min-w-[148px] flex-1 items-center">
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition',
                    stageState === 'active' &&
                      'border-tech-cyan/40 bg-tech-cyan/[0.07] shadow-[0_0_18px_-8px_rgba(34,211,238,0.6)]',
                    stageState === 'done' && 'border-tech-green/20 bg-tech-green/[0.03]',
                    stageState === 'failed' && 'border-tech-red/30 bg-tech-red/[0.05]',
                    stageState === 'pending' && 'border-white/10 bg-white/[0.02]',
                  )}
                >
                  <span
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded border',
                      stageState === 'active'
                        ? 'border-tech-cyan/35 bg-tech-cyan/10 text-tech-cyan'
                        : stageState === 'done'
                          ? 'border-tech-green/25 bg-tech-green/10 text-tech-green'
                          : stageState === 'failed'
                            ? 'border-tech-red/25 bg-tech-red/10 text-tech-red'
                            : 'border-white/10 bg-white/[0.04] text-tech-faint',
                    )}
                  >
                    {stageState === 'done' ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : stageState === 'active' ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : stageState === 'failed' ? (
                      <TriangleAlert className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={cn(
                        'truncate text-[11.5px] font-medium',
                        stageState === 'pending' ? 'text-tech-faint' : 'text-tech-ink',
                      )}
                    >
                      {stage.label}
                    </div>
                    <div className="truncate text-[9px] tracking-wide text-tech-faint">
                      {runningNode?.title ?? stage.caption}
                    </div>
                  </div>
                </div>
              </div>
              {index < STAGES.length - 1 && (
                <div className="relative mx-1 h-px w-4 shrink-0 bg-white/10 md:w-6">
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 transition-all duration-500',
                      stageState === 'done' ? 'w-full bg-tech-cyan/60' : 'w-0',
                    )}
                  />
                  {status === 'running' && stageState !== 'pending' && (
                    <span className="absolute -top-[2px] h-[5px] w-[5px] animate-flow-dot rounded-full bg-tech-cyan shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
