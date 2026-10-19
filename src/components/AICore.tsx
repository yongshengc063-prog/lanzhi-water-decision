import { Waves } from 'lucide-react'
import { cn } from '../lib/cn'

export function AICore({ size = 132, active = false }: { size?: number; active?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className={cn('absolute inset-0 rounded-full bg-tech-cyan/10 blur-2xl', active && 'animate-breathe')} />
      <div className="absolute inset-0 rounded-full border border-tech-cyan/10" />
      <div className="absolute inset-[8%] rounded-full border border-dashed border-tech-cyan/25 animate-spin-slow" />
      <div
        className="absolute inset-[16%] rounded-full border border-tech-cyan/20"
        style={{ animation: active ? 'spinSlow 9s linear infinite reverse' : undefined }}
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tech-cyan shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]" />
      </div>
      <div className="absolute inset-[26%] rounded-full border border-tech-cyan/15" />
      <div className="absolute inset-[34%] grid place-items-center rounded-full bg-gradient-to-br from-tech-cyan-soft via-tech-cyan to-[#0891b2] shadow-[0_0_36px_rgba(34,211,238,0.55)]">
        <Waves className="h-1/2 w-1/2 text-[#04121f]" strokeWidth={2.2} />
      </div>
      <span className="absolute bottom-[3%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-tech-green/80" />
    </div>
  )
}
