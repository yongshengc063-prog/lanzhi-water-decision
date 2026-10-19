import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, X } from 'lucide-react'
import { ReportView } from './ReportView'

export function ReportDrawer({
  open,
  onClose,
  report,
  demo,
  projectName,
  revealed,
  onRevealed,
}: {
  open: boolean
  onClose: () => void
  report: string
  demo: boolean
  projectName: string
  revealed: boolean
  onRevealed: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-[#050D1B]/72 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="生态修复决策报告"
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-[960px] flex-col border-l border-tech-cyan/20 bg-[linear-gradient(160deg,#102544_0%,#1A365D_52%,#0B192C_100%)] shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.8)]"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-tech-cyan/45 to-transparent" />

            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-tech-cyan/30 bg-tech-cyan/10 text-tech-cyan">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-display text-[15px] font-bold tracking-wide text-tech-ink">
                      生态修复决策报告
                    </h2>
                    {demo && (
                      <span className="rounded-full border border-tech-amber/35 bg-tech-amber/10 px-2 py-0.5 text-[9px] font-semibold text-tech-amber">
                        演示样例
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[10.5px] text-tech-faint">
                    {projectName || '未命名项目'} · 17 章 · 打字机流式展示
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="关闭报告"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-tech-muted transition hover:border-tech-cyan/40 hover:text-tech-cyan"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-4">
              <ReportView
                report={report}
                revealed={revealed}
                demo={demo}
                projectName={projectName}
                onRevealed={onRevealed}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
