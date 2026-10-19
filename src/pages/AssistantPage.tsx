import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight,
  Database,
  FileText,
  Gauge,
  Radar,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { InputPanel } from '../components/InputPanel'
import { TopDashboard } from '../components/workspace/TopDashboard'
import { PipelineRail } from '../components/PipelineRail'
import { TopBar } from '../components/TopBar'
import { EmptyState, ErrorPanel, ProcessingPanel } from '../components/StatePanels'
import { DiagnosisView } from '../components/DiagnosisView'
import { TechnologyView } from '../components/TechnologyView'
import { ReportDrawer } from '../components/ReportDrawer'
import { SettingsModal } from '../components/SettingsModal'
import { WorkspaceShell } from '../components/workspace/WorkspaceShell'
import { Badge, Panel, SectionHeading } from '../components/ui'
import { ReadinessRadar, TrendChart } from '../components/charts/TechGauges'
import { DEMO_INPUTS, INPUT_GROUPS } from '../config'
import { loadDraft, saveDraft, useWorkflow } from '../hooks/useWorkflow'
import { splitReport } from '../lib/parse'
import { PUBLIC_DEMO_ONLY } from '../lib/settings'
import type { QualityReport } from '../types'

export function AssistantPage() {
  const {
    settings,
    setSettings,
    status,
    nodeStates,
    result,
    error,
    activeNode,
    doneCount,
    run,
    stop,
    reset,
  } = useWorkflow()

  const [searchParams] = useSearchParams()
  const autoran = useRef(false)
  const [values, setValues] = useState<Record<string, string>>(loadDraft)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportRevealed, setReportRevealed] = useState(false)
  const lastRunValues = useRef<Record<string, string>>(values)

  useEffect(() => {
    const timer = window.setTimeout(() => saveDraft(values), 350)
    return () => window.clearTimeout(timer)
  }, [values])

  useEffect(() => {
    if (result) {
      setReportRevealed(false)
      setReportOpen(false)
    }
  }, [result])

  // 演示直达：?autorun=1 仅在演示模式下自动载入样例并运行，便于截图与汇报。
  useEffect(() => {
    if (autoran.current || !settings.demo) return
    if (searchParams.get('autorun') !== '1') return
    autoran.current = true
    const next = { ...DEMO_INPUTS }
    setValues(next)
    void run(next)
  }, [searchParams, settings.demo, run])

  const handleRun = useCallback(() => {
    lastRunValues.current = values
    void run(values)
  }, [run, values])

  const handleReset = useCallback(() => {
    reset()
    setReportOpen(false)
  }, [reset])

  const toggleMode = useCallback(() => {
    setSettings({ demo: !settings.demo })
  }, [setSettings, settings.demo])

  const quality = nodeStates.quality_check?.outputs as QualityReport | undefined
  const problems = result?.diagnosis?.problems.length ?? 0
  const technologies = result?.top3.length ?? 0

  const allFields = useMemo(
    () => INPUT_GROUPS.flatMap((group) => group.fields),
    [],
  )
  const filled = useMemo(
    () => allFields.filter((field) => values[field.key]?.trim()).length,
    [allFields, values],
  )

  const readiness = useMemo(
    () =>
      INPUT_GROUPS.map((group) => ({
        name: group.title,
        filled: group.fields.filter((field) => values[field.key]?.trim()).length,
        total: group.fields.length,
      })),
    [values],
  )

  const reportSections = useMemo(
    () => (result?.report ? splitReport(result.report).length : 0),
    [result?.report],
  )

  return (
    <WorkspaceShell>
      <TopBar
        status={status}
        settings={settings}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleMode={toggleMode}
        onReset={handleReset}
        hasResult={!!result}
      />

      <main className="relative mx-auto max-w-[1800px] px-4 pb-12 pt-4 md:px-6">
        {settings.demo && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-tech-amber/25 bg-tech-amber/[0.07] px-3.5 py-2.5 text-[10.5px] leading-5 text-tech-amber/95">
            <span className="rounded-full border border-tech-amber/35 bg-tech-amber/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
              Demo
            </span>
            <span>
              演示模式：表单、流程状态与报告均使用本地样例，
              <b className="font-semibold">不代表真实监测或工程结论</b>。
              {PUBLIC_DEMO_ONLY
                ? '公开演示版不连接 Dify，也不消耗任何模型额度。'
                : '切换右上角「运行模式」可在服务端配置 Dify 后进入实时模式。'}
            </span>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-tech-cyan/75">
              <span className="h-px w-6 bg-tech-cyan/50" />
              Decision Cockpit
            </div>
            <h1 className="mt-1.5 font-display text-[23px] font-extrabold leading-tight tracking-wide text-tech-ink md:text-[27px]">
              水域生态修复智能决策
            </h1>
            <p className="mt-1 text-[11.5px] leading-5 text-tech-muted">
              调查指标 → 知识检索 → 生态诊断 → 七维评分 → 决策报告
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="muted" icon={<Database className="h-3 w-3" />}>
              6 知识库
            </Badge>
            <Badge tone="muted" icon={<Gauge className="h-3 w-3" />}>
              17 节点
            </Badge>
            <Badge tone="cyan" icon={<Radar className="h-3 w-3" />}>
              7 维评分
            </Badge>
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              disabled={!result?.report}
              className="tech-button disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FileText className="h-3.5 w-3.5" />
              决策报告
              {result?.report && (
                <span className="rounded bg-tech-cyan/15 px-1.5 py-0.5 font-mono text-[9px]">
                  {reportSections} 章
                </span>
              )}
            </button>
          </div>
        </div>

        <TopDashboard values={values} result={result?.diagnosis ?? null} />

        <div className="mt-4 grid gap-4 xl:grid-cols-[392px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-[80px] xl:self-start">
            <InputPanel
              values={values}
              onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
              onBulkChange={(next) => setValues({ ...next })}
              onRun={handleRun}
              onStop={stop}
              running={status === 'running'}
              demo={settings.demo}
              submitError={null}
            />
          </aside>

          <section className="min-w-0 space-y-4">
            <PipelineRail
              nodeStates={nodeStates}
              activeNode={activeNode}
              status={status}
              doneCount={doneCount}
            />

            {status === 'idle' && (
              <>
                <div className="grid gap-4 2xl:grid-cols-[1fr_1fr]">
                  <Panel bodyClassName="p-5">
                    <SectionHeading
                      eyebrow="Readiness"
                      title="数据就绪度"
                      hint="按四组调查字段的填写比例生成，仅反映输入完整度，不代表诊断结论。"
                      right={<Badge tone="cyan">{Math.round((filled / allFields.length) * 100)}%</Badge>}
                    />
                    <ReadinessRadar groups={readiness} />
                  </Panel>

                  <Panel bodyClassName="p-5">
                    <SectionHeading
                      eyebrow="Trend Preview"
                      title="近期水质趋势（示意）"
                      hint="以本次录入值为终点生成交互示意，非实测时序；运行工作流后仍以诊断结果为准。"
                    />
                    <TrendChart values={values} />
                  </Panel>
                </div>

                <EmptyState />
              </>
            )}

            {status === 'running' && (
              <ProcessingPanel nodeStates={nodeStates} activeNode={activeNode} doneCount={doneCount} />
            )}

            {status === 'failed' && (
              <ErrorPanel
                message={error ?? '未知错误'}
                onRetry={() => {
                  lastRunValues.current = values
                  void run(values)
                }}
              />
            )}

            {status === 'succeeded' && result && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-tech-green/20 bg-tech-green/[0.05] px-4 py-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-tech-green">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tech-green" />
                    决策流程已完成 · {doneCount} 个节点 · 结果由本地渲染，非实时监测
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-tech-faint">
                    <span>{problems} 项问题</span>
                    <span className="h-3 w-px bg-white/15" />
                    <span>Top {technologies}</span>
                    <span className="h-3 w-px bg-white/15" />
                    <span>{reportSections} 章报告</span>
                  </div>
                </div>

                {result.diagnosis ? (
                  <DiagnosisView diagnosis={result.diagnosis} quality={quality} />
                ) : (
                  <RawOutputPanel title="诊断原始输出" text={result.diagnosisRaw} />
                )}

                <TechnologyView technologies={result.top3} />

                <div className="grid gap-4 2xl:grid-cols-[1.45fr_1fr]">
                  <Panel bodyClassName="p-5">
                    <SectionHeading
                      eyebrow="Water Trend"
                      title="近期水质变化趋势"
                      hint="以本次录入 COD / DO / 氨氮为终点生成示意曲线；非实测历史时序，不可用于趋势判定。"
                      right={<Badge tone="amber">示意 · 非实测</Badge>}
                    />
                    <TrendChart values={values} />
                  </Panel>

                  <Panel bodyClassName="relative overflow-hidden p-5">
                    <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-tech-cyan/10 blur-3xl" />
                    <SectionHeading
                      eyebrow="Decision Report"
                      title="决策报告已生成"
                      hint="按 17 章组织，保留证据、限制条件与缺失数据说明；支持 Markdown 与 PDF 导出。"
                    />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[
                        { label: '识别问题', value: problems },
                        { label: '推荐技术', value: technologies },
                        { label: '报告章节', value: reportSections },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-center">
                          <div className="font-display text-[22px] font-bold leading-none text-tech-ink">
                            {item.value}
                          </div>
                          <div className="mt-1 text-[9.5px] text-tech-faint">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setReportOpen(true)}
                      className="tech-button-primary mt-4 w-full"
                    >
                      <WandSparkles className="h-4 w-4" />
                      打开完整决策报告
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-5 text-tech-faint">
                      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-tech-cyan/70" />
                      报告以侧边抽屉打开，Markdown 渲染并带打字机流式效果；可随时跳过动画。
                    </p>
                  </Panel>
                </div>
              </>
            )}
          </section>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] pt-4 text-[10px] text-tech-faint sm:flex-row">
          <span>澜知 · 小澜智能决策工作台 · Workflow V3.0 · 17 节点 / 6 知识库</span>
          <span className="font-mono">POST /api/dify/v1/workflows/run · streaming</span>
        </footer>
      </main>

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={setSettings}
      />

      <ReportDrawer
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        report={result?.report ?? ''}
        demo={settings.demo}
        projectName={values.project_name ?? ''}
        revealed={reportRevealed}
        onRevealed={() => setReportRevealed(true)}
      />
    </WorkspaceShell>
  )
}

function RawOutputPanel({ title, text }: { title: string; text: string }) {
  return (
    <Panel bodyClassName="p-5">
      <h2 className="font-display text-[18px] font-semibold tracking-wide text-tech-ink">{title}</h2>
      <p className="mt-1 text-[11.5px] text-tech-muted">未能解析为结构化 JSON，以下为节点原文。</p>
      <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-[#050D1B] p-4 font-mono text-[11px] leading-6 text-[#B7CFE0]">
        {text || '（空）'}
      </pre>
    </Panel>
  )
}
