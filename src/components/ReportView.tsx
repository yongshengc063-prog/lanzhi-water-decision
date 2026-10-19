import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Check,
  Copy,
  Download,
  FileText,
  ListTree,
  Printer,
  SkipForward,
} from 'lucide-react'
import { cn } from '../lib/cn'
import { splitReport } from '../lib/parse'
import { Markdown } from './Markdown'
import { Badge, Panel, SectionHeading } from './ui'

const CHARS_PER_SECOND = 520
const RENDER_STEP = 14

export function ReportView({
  report,
  revealed = false,
  demo = false,
  projectName = '',
  onRevealed,
}: {
  report: string
  revealed?: boolean
  demo?: boolean
  projectName?: string
  onRevealed?: () => void
}) {
  const sections = useMemo(() => splitReport(report), [report])
  const [visible, setVisible] = useState(0)
  const [done, setDone] = useState(false)
  const [activeSection, setActiveSection] = useState('section-0')
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const revealedRef = useRef(onRevealed)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    revealedRef.current = onRevealed
  }, [onRevealed])

  useEffect(() => {
    setVisible(0)
    setDone(false)
    if (!report) {
      setDone(true)
      return
    }
    if (reduced || revealed) {
      setVisible(report.length)
      setDone(true)
      return
    }

    let frame = 0
    let startedAt = 0
    let lastRendered = 0
    const tick = (now: number) => {
      if (!startedAt) startedAt = now
      const target = Math.min(report.length, Math.floor(((now - startedAt) / 1000) * CHARS_PER_SECOND))
      if (target - lastRendered >= RENDER_STEP || target === report.length) {
        lastRendered = target
        setVisible(target)
      }
      if (target < report.length) {
        frame = requestAnimationFrame(tick)
      } else {
        setVisible(report.length)
        setDone(true)
        revealedRef.current?.()
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // `revealed` is read on mount only; the parent stores completion across tab switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report, reduced])

  const skip = () => {
    setVisible(report.length)
    setDone(true)
    revealedRef.current?.()
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }

  const safeProject = (projectName || '项目').replace(/[\/:*?"<>|\s]+/g, '-').slice(0, 30)
  const date = new Date().toISOString().slice(0, 10)

  const download = () => {
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `水生态修复决策报告_${safeProject}_${date}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPdf = () => {
    window.print()
  }

  useEffect(() => {
    const onScroll = () => {
      if (!contentRef.current) return
      let current = sections[0]?.id ?? 'section-0'
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= 180) current = section.id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sections])

  const chars = report.replace(/\s/g, '').length
  const visibleSections = sections.filter((section) => section.start < visible || visible >= report.length)

  return (
    <Panel bodyClassName="p-5">
      <SectionHeading
        eyebrow="Decision Report"
        title="生态修复决策报告"
        hint="报告由最终决策节点生成，按 17 章组织；打字机效果仅为前端展示，不改变原文。"
        right={
          <>
            {demo && <Badge tone="amber">演示样例 · 非真实决策</Badge>}
            <Badge tone="cyan" icon={<FileText className="h-3 w-3" />}>
              {sections.length} 章 · {chars} 字
            </Badge>
            {!done && report && (
              <button
                type="button"
                onClick={skip}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] text-tech-muted transition hover:border-tech-cyan/30 hover:text-tech-ink"
              >
                <SkipForward className="h-3 w-3" />
                跳过
              </button>
            )}
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] text-tech-muted transition hover:border-tech-cyan/30 hover:text-tech-ink"
            >
              {copied ? <Check className="h-3 w-3 text-tech-green" /> : <Copy className="h-3 w-3" />}
              {copied ? '已复制' : '复制'}
            </button>
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] text-tech-muted transition hover:border-tech-green/30 hover:text-tech-ink"
            >
              <Download className="h-3 w-3" />
              Markdown
            </button>
            <button
              type="button"
              onClick={exportPdf}
              className="inline-flex items-center gap-1 rounded-md border border-tech-green/30 bg-tech-green/[0.07] px-2.5 py-1.5 text-[11px] text-tech-green transition hover:bg-tech-green/10"
            >
              <Printer className="h-3 w-3" />
              导出 PDF
            </button>
          </>
        }
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-lg border border-white/10 bg-[#102544]/90 p-3">
            <div className="mb-2 flex items-center gap-1.5 px-1 text-[10px] uppercase tracking-[0.16em] text-tech-faint">
              <ListTree className="h-3 w-3" />
              章节导航
            </div>
            <nav className="space-y-0.5">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  disabled={section.start >= visible && visible < report.length}
                  className={cn(
                    'flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-[11px] leading-4 transition disabled:cursor-default disabled:opacity-35',
                    activeSection === section.id
                      ? 'bg-tech-cyan/10 text-tech-cyan'
                      : 'text-tech-muted hover:bg-white/[0.04] hover:text-tech-ink',
                  )}
                >
                  <span className="mt-px shrink-0 font-mono text-[9px] text-tech-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="line-clamp-2">{section.heading.replace(/^[一二三四五六七八九十百]+、/, '')}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div ref={contentRef} className="min-w-0 space-y-3">
          {report.length === 0 && (
            <div className="panel-inset grid min-h-[180px] place-items-center text-[12px] text-tech-faint">
              报告为空，请检查工作流输出。
            </div>
          )}

          {visibleSections.map((section, index) => {
            const body = report.slice(section.bodyStart, Math.min(section.end, visible))
            return (
              <article
                key={section.id}
                id={section.id}
                data-report-section={section.heading}
                className="panel-inset scroll-mt-24 px-4 py-3.5"
              >
                <div className="mb-2 flex items-center gap-2.5 border-b border-white/10 pb-2">
                  <span className="font-mono text-[10px] text-tech-cyan/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-[14px] font-semibold tracking-wide text-tech-ink">
                    {section.heading.replace(/^[一二三四五六七八九十百]+、/, '')}
                  </h3>
                </div>
                {body.trim() ? (
                  <Markdown>{body}</Markdown>
                ) : (
                  <span className="text-[11px] text-tech-faint">…</span>
                )}
              </article>
            )
          })}

          {!done && report && (
            <div className="flex items-center gap-2 px-1 py-1 text-[10.5px] text-tech-cyan/70">
              <span className="h-3.5 w-[6px] animate-pulse bg-tech-cyan align-middle" />
              正在生成报告 …
            </div>
          )}
        </div>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <div className="print-report" aria-hidden="true">
            <div className="print-cover">
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: '#2f6d7c', textTransform: 'uppercase' }}>
                澜知 · 水生态修复智能决策平台
              </div>
              <h1>水生态修复决策报告</h1>
              <div className="print-meta">
                项目：{projectName || '未填写项目名称'} · 生成日期：{date}
                {demo
                  ? ' · 演示样例，仅用于界面演示，不代表真实监测或工程结论'
                  : ' · 基于 Dify Workflow 输出'}
              </div>
            </div>
            <div className="print-body">
              {sections.map((section) => (
                <section key={section.id}>
                  <h2>{section.heading}</h2>
                  <Markdown>{report.slice(section.bodyStart, section.end)}</Markdown>
                </section>
              ))}
            </div>
            <div className="print-footer">
              澜知 · 辅助决策，不替代工程设计 · 数据来自本地知识库与工作流输出 · {date}
            </div>
          </div>,
          document.body,
        )}
    </Panel>
  )
}
