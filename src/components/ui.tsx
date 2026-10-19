import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Panel({
  children,
  className,
  bodyClassName,
}: {
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div className={cn('panel', className)}>
      <span className="corner-mark left-2 top-2 border-l border-t" />
      <span className="corner-mark right-2 top-2 border-r border-t" />
      <span className="corner-mark bottom-2 left-2 border-b border-l" />
      <span className="corner-mark bottom-2 right-2 border-b border-r" />
      <div className={cn('relative', bodyClassName)}>{children}</div>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  hint,
  right,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  hint?: ReactNode
  right?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        {eyebrow && (
          <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-tech-cyan/70">
            <span className="h-px w-4 bg-tech-cyan/50" />
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-[19px] font-semibold leading-tight tracking-wide text-tech-ink">
          {title}
        </h2>
        {hint && <p className="mt-1 max-w-3xl text-[12px] leading-5 text-tech-muted">{hint}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  )
}

type Tone = 'cyan' | 'amber' | 'danger' | 'good' | 'muted' | 'violet'

const toneClasses: Record<Tone, string> = {
  cyan: 'border-tech-cyan/30 bg-tech-cyan/10 text-tech-cyan',
  amber: 'border-tech-amber/30 bg-tech-amber/10 text-tech-amber',
  danger: 'border-tech-red/30 bg-tech-red/10 text-tech-red',
  good: 'border-tech-green/30 bg-tech-green/10 text-tech-green',
  muted: 'border-white/10 bg-white/[0.04] text-tech-muted',
  violet: 'border-tech-violet/30 bg-tech-violet/10 text-tech-violet',
}

export function Badge({
  children,
  tone = 'muted',
  className,
  icon,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  icon?: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

const toneBar: Record<Tone, string> = {
  cyan: 'bg-tech-cyan',
  amber: 'bg-tech-amber',
  danger: 'bg-tech-red',
  good: 'bg-tech-green',
  muted: 'bg-tech-muted/60',
  violet: 'bg-tech-violet',
}

export function Meter({
  value,
  tone = 'cyan',
  className,
  height = 'h-1.5',
}: {
  value: number
  tone?: Tone
  className?: string
  height?: string
}) {
  const pct = Math.max(0, Math.min(100, value * 100))
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-white/[0.07]', height, className)}>
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', toneBar[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function StatTile({
  label,
  value,
  unit,
  hint,
  tone = 'cyan',
}: {
  label: string
  value: ReactNode
  unit?: string
  hint?: string
  tone?: Tone
}) {
  return (
    <div className="panel-inset px-4 py-3.5">
      <div className="metric-label">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span
          className={cn(
            'font-display text-[26px] font-semibold leading-none tracking-wide',
            tone === 'danger' ? 'text-tech-red' : tone === 'amber' ? 'text-tech-amber' : 'text-tech-ink',
          )}
        >
          {value}
        </span>
        {unit && <span className="text-[11px] text-tech-faint">{unit}</span>}
      </div>
      {hint && <div className="mt-1.5 text-[10.5px] leading-4 text-tech-faint">{hint}</div>}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('hairline h-px w-full opacity-40', className)} />
}
