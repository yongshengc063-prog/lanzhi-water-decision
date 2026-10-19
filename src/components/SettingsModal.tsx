import { useEffect, useState } from 'react'
import { FlaskConical, KeyRound, Server, ShieldCheck, X } from 'lucide-react'
import { cn } from '../lib/cn'
import { PUBLIC_DEMO_ONLY } from '../lib/settings'
import type { ApiSettings } from '../types'

export function SettingsModal({
  open,
  settings,
  onClose,
  onSave,
}: {
  open: boolean
  settings: ApiSettings
  onClose: () => void
  onSave: (settings: ApiSettings) => void
}) {
  const [draft, setDraft] = useState<ApiSettings>(settings)

  useEffect(() => {
    if (open) setDraft(settings)
  }, [open, settings])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#102544] shadow-panel">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-tech-green/70">Runtime</div>
            <h2 className="mt-0.5 font-display text-[18px] font-semibold tracking-wide text-tech-ink">
              运行模式
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-tech-muted transition hover:border-tech-green/30 hover:text-tech-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="flex gap-2.5">
              <FlaskConical className={cn('mt-0.5 h-4 w-4', draft.demo ? 'text-tech-amber' : 'text-tech-faint')} />
              <div>
                <div className="text-[12.5px] font-medium text-tech-ink">演示模式</div>
                <div className="mt-0.5 text-[10.5px] leading-5 text-tech-faint">
                  使用内置样例数据模拟节点进度与结果。界面与报告会持续标注“样例 · 仅演示”，
                  不代表真实监测或工程结论。
                </div>
              </div>
            </div>
            {PUBLIC_DEMO_ONLY ? (
              <span className="shrink-0 rounded-full border border-tech-amber/30 bg-tech-amber/[0.08] px-2.5 py-1 text-[9.5px] font-medium text-tech-amber">
                公开演示版 · 固定
              </span>
            ) : (
              <button
                type="button"
                role="switch"
                aria-checked={draft.demo}
                aria-label="切换演示模式"
                onClick={() => setDraft((prev) => ({ ...prev, demo: !prev.demo }))}
                className={cn(
                  'relative h-5 w-9 shrink-0 rounded-full border transition',
                  draft.demo ? 'border-tech-amber/50 bg-tech-amber/30' : 'border-white/10 bg-white/[0.06]',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all',
                    draft.demo ? 'left-[18px] bg-tech-amber' : 'left-0.5 bg-fainter',
                  )}
                />
              </button>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-tech-ink">
              <Server className="h-3.5 w-3.5 text-tech-green" />
              实时模式 · 服务端代理
            </div>
            <div className="mt-2 space-y-1.5 text-[10px] leading-5 text-tech-faint">
              <div>
                浏览器请求：<span className="font-mono text-tech-cyan">/api/dify/v1/workflows/run</span>
              </div>
              <div>
                服务端变量：<span className="font-mono text-tech-cyan">DIFY_BASE_URL</span> ·{' '}
                <span className="font-mono text-tech-cyan">DIFY_API_KEY</span>
              </div>
              <div>请在 `.env` 或服务器环境中配置；密钥不会保存到浏览器。</div>
            </div>
            <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-tech-green/15 bg-tech-green/[0.05] px-3 py-2 text-[9.5px] leading-4 text-tech-muted">
              <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tech-green/80" />
              首次联调前，请确认 Dify 中 KB01–KB06 已绑定、工作流已发布，并完成一次真实执行记录核验。
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-white/10 px-3.5 py-2.5 text-[9.5px] leading-4 text-tech-faint">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tech-green/70" />
            报告导出使用浏览器打印视图；报告内容只来自 Dify 返回的 final_report 或明确标注的演示样例。
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 bg-white/[0.02] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3.5 py-2 text-[12px] text-tech-muted transition hover:text-tech-ink"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => {
              onSave({ demo: draft.demo })
              onClose()
            }}
            className="rounded-lg border border-tech-green/40 bg-tech-green/15 px-4 py-2 text-[12px] font-medium text-tech-green transition hover:bg-tech-green/20"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  )
}
