import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Droplets, Gauge, Waves } from 'lucide-react'
import { MiniGauge, SparkLine } from '../charts/TechGauges'
import { gradeIndex } from '../../lib/health'
import { cn } from '../../lib/cn'
import type { DiagnosisResult } from '../../types'

function numeric(value: string | undefined): number | null {
  if (!value?.trim()) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function useAnimatedNumber(value: number | null, duration = 850) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (value === null) {
      setDisplay(0)
      return
    }
    let frame = 0
    const started = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return display
}

function FlipNumber({
  label,
  value,
  unit,
  decimals = 1,
  tone = 'text-tech-ink',
}: {
  label: string
  value: number | null
  unit?: string
  decimals?: number
  tone?: string
}) {
  const animated = useAnimatedNumber(value)
  const text = value === null ? '—' : animated.toFixed(decimals)

  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#050D1B]/45 px-2.5 py-2">
      <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-tech-faint">{label}</div>
      <div className="mt-1.5 flex items-end gap-1">
        <div className={cn('flex items-baseline gap-[2px] font-mono text-[21px] font-bold leading-none', tone)}>
          {Array.from(text).map((char, index) =>
            char === '.' ? (
              <span key={`dot-${index}`} className="text-[13px] text-tech-muted">
                .
              </span>
            ) : char === '—' ? (
              <span key="empty" className="text-tech-faint">
                —
              </span>
            ) : (
              <span
                key={`${char}-${index}`}
                className="relative grid h-7 min-w-[15px] place-items-center rounded-[3px] border border-white/[0.08] bg-white/[0.035] px-[2px]"
              >
                {char}
                <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/25" />
              </span>
            ),
          )}
        </div>
        {unit && <span className="mb-0.5 text-[9px] text-tech-faint">{unit}</span>}
      </div>
    </div>
  )
}

export function TopDashboard({
  values,
  result,
}: {
  values: Record<string, string>
  result: DiagnosisResult | null
}) {
  const ph = numeric(values.pH)
  const cod = numeric(values.COD)
  const dissolvedOxygen = numeric(values.DO)
  const depth = numeric(values.water_depth)
  const health = result ? gradeIndex(result.water_health_grade) : null

  const phColor = ph === null || (ph >= 6.5 && ph <= 8.5) ? '#00F0FF' : '#FFC24B'
  const doColor =
    dissolvedOxygen === null || dissolvedOxygen >= 5
      ? '#00FF88'
      : dissolvedOxygen >= 3
        ? '#FFC24B'
        : '#FF6B7A'
  const codTone =
    cod === null || cod <= 30 ? 'text-tech-cyan' : cod <= 40 ? 'text-tech-amber' : 'text-tech-red'
  const healthTone =
    health === null ? 'text-tech-ink' : health >= 75 ? 'text-tech-green' : health >= 50 ? 'text-tech-amber' : 'text-tech-red'

  return (
    <section className="grid gap-3 xl:grid-cols-[1.05fr_1.08fr_1.12fr]">
      {/* 仪表盘 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass glass-highlight relative overflow-hidden p-4"
      >
        <span className="corner-bracket left-2 top-2 border-l border-t" />
        <span className="corner-bracket bottom-2 right-2 border-b border-r" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-medium text-tech-muted">
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-tech-cyan">
              <Gauge className="h-3.5 w-3.5" />
            </span>
            水质仪表
          </span>
          <span className="font-mono text-[8.5px] tracking-[0.14em] text-tech-faint">GAUGE</span>
        </div>

        <div className="mt-1 grid grid-cols-2">
          <MiniGauge label="pH" value={ph} min={0} max={14} decimals={1} color={phColor} height={126} />
          <MiniGauge
            label="溶解氧 mg/L"
            value={dissolvedOxygen}
            min={0}
            max={12}
            decimals={1}
            color={doColor}
            height={126}
          />
        </div>

        <div className="flex items-center justify-between text-[9.5px] text-tech-faint">
          <span>参考 pH 6.5–8.5</span>
          <span>参考 III 类 DO ≥5</span>
        </div>
      </motion.div>

      {/* 数字翻牌器 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="glass glass-highlight relative overflow-hidden p-4"
      >
        <span className="corner-bracket left-2 top-2 border-l border-t" />
        <span className="corner-bracket bottom-2 right-2 border-b border-r" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-medium text-tech-muted">
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-tech-cyan">
              <Activity className="h-3.5 w-3.5" />
            </span>
            关键指标
          </span>
          <span className="font-mono text-[8.5px] tracking-[0.14em] text-tech-faint">SPLIT FLAP</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <FlipNumber label="pH" value={ph} decimals={1} tone={ph === null || (ph >= 6.5 && ph <= 8.5) ? 'text-tech-ink' : 'text-tech-amber'} />
          <FlipNumber label="COD" value={cod} unit="mg/L" decimals={0} tone={codTone} />
          <FlipNumber label="水深" value={depth} unit="m" decimals={1} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-2">
            <Droplets className="h-3.5 w-3.5 text-tech-cyan" />
            <span className="text-[9.5px] text-tech-faint">水体健康指数</span>
            <span className={cn('ml-auto font-display text-[16px] font-bold', healthTone)}>
              {health ?? '—'}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-2">
            <Waves className="h-3.5 w-3.5 text-tech-green" />
            <span className="text-[9.5px] text-tech-faint">数据来源</span>
            <span className="ml-auto text-[9.5px] font-medium text-tech-muted">本次调查输入</span>
          </div>
        </div>
      </motion.div>

      {/* 缩略趋势 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass glass-highlight relative overflow-hidden p-4"
      >
        <span className="corner-bracket left-2 top-2 border-l border-t" />
        <span className="corner-bracket bottom-2 right-2 border-b border-r" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-medium text-tech-muted">
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-tech-cyan">
              <Activity className="h-3.5 w-3.5" />
            </span>
            水质趋势
          </span>
          <span className="rounded-full border border-tech-amber/25 bg-tech-amber/[0.07] px-2 py-0.5 text-[9px] text-tech-amber">
            示意 · 非实测
          </span>
        </div>
        <div className="mt-2">
          <SparkLine values={values} height={116} />
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[9px] text-tech-faint">
          <span className="text-[9px] text-tech-faint">T-6 → 本次调查时点</span>
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-tech-blue" />
              COD
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-tech-green" />
              DO
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-tech-amber" />
              氨氮
            </span>
          </span>
        </div>
      </motion.div>
    </section>
  )
}
