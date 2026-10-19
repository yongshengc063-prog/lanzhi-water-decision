import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Sparkles, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type SpriteState = 'idle' | 'thinking' | 'success' | 'error'

const BUBBLE_KEY = 'lanzhi-sprite-bubble-dismissed'

export function WaterSprite({
  state = 'idle',
  showBubble = true,
}: {
  state?: SpriteState
  showBubble?: boolean
}) {
  const navigate = useNavigate()
  const [opening, setOpening] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(BUBBLE_KEY) === '1')
    } catch {
      /* ignore */
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      // 防止转场途中组件卸载后页面仍被锁定滚动。
      try {
        document.body.style.overflow = ''
      } catch {
        /* ignore */
      }
    }
  }, [])

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(BUBBLE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const enter = () => {
    if (opening) return
    setOpening(true)
    try {
      document.body.style.overflow = 'hidden'
    } catch {
      /* ignore */
    }
    timerRef.current = window.setTimeout(() => {
      navigate('/workspace')
      setOpening(false)
      try {
        document.body.style.overflow = ''
        window.scrollTo({ top: 0, behavior: 'auto' })
      } catch {
        /* ignore */
      }
    }, 680)
  }

  return (
    <>
      <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-7 sm:right-7">
        {showBubble && !dismissed && !opening && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.42, ease: 'easeOut' }}
            className="relative hidden max-w-[250px] rounded-2xl border border-portal-line bg-white/96 px-4 py-3.5 shadow-portal backdrop-blur-xl sm:block"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="不再显示提示"
              className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full text-portal-muted transition hover:bg-portal-mist hover:text-portal-ink"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-start gap-2.5 pr-4">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-portal-brandSoft text-portal-brand">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div>
                <div className="text-[12px] font-semibold leading-5 text-portal-ink">
                  需要一份生态修复决策报告吗？
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10.5px] text-portal-muted">
                  点我进入小澜工作仓
                  <ArrowRight className="h-3 w-3 text-portal-brand" />
                </div>
              </div>
            </div>
            <span className="absolute -bottom-1.5 right-9 h-3 w-3 rotate-45 border-b border-r border-portal-line bg-white" />
          </motion.div>
        )}

        <div className="relative">
          <span className="pointer-events-none absolute inset-0 animate-ripple rounded-full bg-portal-water/20" />
          <span
            className="pointer-events-none absolute inset-0 animate-ripple rounded-full bg-portal-leaf/20"
            style={{ animationDelay: '1.2s' }}
          />
          <motion.button
            type="button"
            onClick={enter}
            whileHover={{ scale: 1.07, y: -3 }}
            whileTap={{ scale: 0.94 }}
            animate={opening ? { scale: 1.2, y: -14 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              'group relative grid h-[62px] w-[62px] place-items-center rounded-full border border-white/90 bg-white/92 shadow-[0_18px_45px_-16px_rgba(11,126,168,0.55)] backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-portal-bg sm:h-[86px] sm:w-[86px]',
              state === 'error' && 'border-portal-gold/50',
            )}
            aria-label="小澜：进入知识工作仓"
          >
            <span className="absolute -top-1 right-0 rounded-full bg-portal-brand px-2 py-0.5 text-[8.5px] font-bold tracking-wider text-white shadow-sm">
              小澜
            </span>
            <span className={cn('animate-pet-float', opening && 'animate-none')}>
              <WaterDrop className="h-[46px] w-[46px] sm:h-[64px] sm:w-[64px]" />
            </span>
            {state === 'thinking' && (
              <span className="absolute -bottom-0.5 -left-0.5 grid h-5 w-5 place-items-center rounded-full border border-white bg-white text-portal-brand shadow-sm">
                <span className="h-2.5 w-2.5 animate-spin rounded-full border border-portal-brand/30 border-t-portal-brand" />
              </span>
            )}
            {state === 'success' && (
              <span className="absolute -bottom-0.5 -left-0.5 grid h-5 w-5 place-items-center rounded-full bg-portal-leaf text-white shadow-sm">
                <Check className="h-3 w-3" />
              </span>
            )}
            {state === 'error' && (
              <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-white bg-portal-gold" />
            )}
            <span className="absolute bottom-1.5 right-2 h-2 w-2 rounded-full border-2 border-white bg-portal-leaf" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {opening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.34 }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
            role="status"
            aria-live="polite"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B192C] via-[#102544] to-[#1A365D]" />
            <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(600px_420px_at_50%_46%,rgba(0,240,255,0.22),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="relative grid h-24 w-24 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-tech-cyan/10" />
                <WaterDrop className="h-20 w-20 drop-shadow-[0_0_28px_rgba(0,240,255,0.5)]" />
              </span>
              <div className="mt-6 font-display text-[19px] font-bold tracking-wide text-white">
                正在进入小澜工作仓
              </div>
              <div className="mt-2 text-[11.5px] tracking-[0.18em] text-tech-cyan/80">
                WORKSPACE HUB · 载入知识资产
              </div>
              <div className="mt-6 h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.05, repeat: Infinity, ease: 'easeInOut' }}
                  className="block h-full w-1/2 rounded-full bg-gradient-to-r from-tech-cyan to-tech-green"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function SpriteStatus({ state, label }: { state: SpriteState; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-tech-muted">
      <span className="relative grid h-6 w-6 place-items-center">
        <WaterDrop className="h-6 w-6" />
        {state === 'thinking' && (
          <span className="absolute inset-0 animate-spin rounded-full border border-tech-cyan/40 border-t-transparent" />
        )}
        {state === 'success' && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-tech-green" />
        )}
        {state === 'error' && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-tech-red" />
        )}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </span>
  )
}

function WaterDrop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lanzhi-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DEBFF" />
          <stop offset="46%" stopColor="#119BD1" />
          <stop offset="100%" stopColor="#1FA971" />
        </linearGradient>
        <linearGradient id="lanzhi-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M32 4.5C32 4.5 12.5 26.5 12.5 39C12.5 49.5 21.2 58 32 58C42.8 58 51.5 49.5 51.5 39C51.5 26.5 32 4.5 32 4.5Z"
        fill="url(#lanzhi-drop)"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="0.8"
      />
      <ellipse cx="23.5" cy="31" rx="3.6" ry="6.6" fill="url(#lanzhi-shine)" transform="rotate(-20 23.5 31)" />
      <path d="M42 9.5C46 6.8 51.5 9 53.2 14C49 15.7 43.6 14.1 42 9.5Z" fill="#1FA971" />
      <path d="M42.4 12.8C44.8 15.2 47.4 16.1 50.3 15.6" stroke="#137A51" strokeWidth="1" strokeLinecap="round" />
      <g className="animate-blink" style={{ transformOrigin: '32px 43px' }}>
        <circle cx="26" cy="43" r="1.9" fill="#062B3A" />
        <circle cx="38" cy="43" r="1.9" fill="#062B3A" />
        <circle cx="26.6" cy="42.4" r="0.6" fill="#FFFFFF" />
        <circle cx="38.6" cy="42.4" r="0.6" fill="#FFFFFF" />
      </g>
      <path d="M27.8 49C30.2 50.9 33.8 50.9 36.2 49" stroke="#062B3A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M18 36C14 31 14.5 24 18.5 20" stroke="#BDF4FF" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" fill="none" />
    </svg>
  )
}
