import { ChevronRight, Database, FileText, Gauge, Layers3, ScanSearch } from 'lucide-react'
import { NODE_META, TOTAL_NODES } from '../config'
import { cn } from '../lib/cn'
import { AICore } from './AICore'
import { Badge, Panel } from './ui'
import type { NodeStateMap } from '../types'

const CAPABILITIES = [
  { icon: Layers3, label: '6 大知识库', hint: '理论 / 诊断 / 技术 / 案例 / 效果 / 规范' },
  { icon: ScanSearch, label: '17 节点工作流', hint: '检索增强 + 结构化推理' },
  { icon: Gauge, label: '7 维技术评分', hint: '100 分制加权比选' },
  { icon: FileText, label: '17 章决策报告', hint: '可追溯证据链与风险边界' },
]

export function EmptyState() {
  return (
    <Panel bodyClassName="relative overflow-hidden px-6 py-10 md:px-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(600px_260px_at_50%_0%,rgba(34,211,238,0.18),transparent_70%)]" />
      <div className="relative flex flex-col items-center text-center">
        <AICore size={140} />
        <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-tech-cyan/70">
          <span className="h-px w-6 bg-tech-cyan/40" />
          Ready to diagnose
          <span className="h-px w-6 bg-tech-cyan/40" />
        </div>
        <h2 className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-wide text-tech-ink md:text-[30px]">
          从前期指标到可执行的修复决策
        </h2>
        <p className="mt-2 max-w-xl text-[12.5px] leading-6 text-tech-muted">
          在左侧录入水质、水动力、生境与工程约束。系统将自动完成数据校验、知识库检索、生态诊断、
          七维技术评分，并生成带证据边界的 17 章决策报告。
        </p>

        <div className="mt-7 grid w-full max-w-3xl gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map(({ icon: Icon, label, hint }) => (
            <div
              key={label}
              className="panel-inset flex items-start gap-2.5 px-3.5 py-3 text-left transition hover:border-tech-cyan/25"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-tech-cyan/20 bg-tech-cyan/[0.07] text-tech-cyan/80">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-medium text-tech-ink">{label}</span>
                <span className="mt-0.5 block text-[10px] leading-4 text-tech-faint">{hint}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-[11px] text-tech-faint">
          <Badge tone="cyan">输入水质指标</Badge>
          <ChevronRight className="h-3 w-3" />
          <Badge tone="muted">知识增强诊断</Badge>
          <ChevronRight className="h-3 w-3" />
          <Badge tone="muted">技术比选</Badge>
          <ChevronRight className="h-3 w-3" />
          <Badge tone="muted">决策报告</Badge>
        </div>
        <div className="mt-3 text-[10.5px] text-tech-faint">
          提示：点击左下角「示例数据」可一键填充演示指标。
        </div>
      </div>
    </Panel>
  )
}

export function ProcessingPanel({
  nodeStates,
  activeNode,
  doneCount,
}: {
  nodeStates: NodeStateMap
  activeNode: string | null
  doneCount: number
}) {
  const ordered = Object.keys(NODE_META)
  const log = ordered
    .map((id) => ({ id, ...nodeStates[id] }))
    .filter((entry) => entry.status === 'running' || entry.status === 'done')
    .slice(-7)

  return (
    <Panel bodyClassName="relative min-h-[430px] overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(520px_240px_at_50%_10%,rgba(34,211,238,0.16),transparent_72%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-transparent via-tech-cyan/[0.06] to-transparent" />

      <div className="relative flex flex-col items-center text-center">
        <AICore size={150} active />
        <div className="mt-6 text-[10px] uppercase tracking-[0.28em] text-tech-cyan/70">
          {doneCount >= TOTAL_NODES ? 'Finalizing' : 'Workflow running'}
        </div>
        <h2 className="mt-2 font-display text-[24px] font-semibold tracking-wide text-tech-ink">
          {activeNode ?? '正在调度工作流节点'}
        </h2>
        <p className="mt-1.5 text-[11.5px] text-tech-muted">
          已调度 {doneCount} / {TOTAL_NODES} 个节点 · 请勿关闭页面
        </p>
      </div>

      <div className="relative mx-auto mt-7 w-full max-w-xl">
        <div className="mb-2 flex items-center justify-between text-[9.5px] uppercase tracking-[0.16em] text-tech-faint">
          <span>Execution Log</span>
          <span className="font-mono">streaming</span>
        </div>
        <div className="panel-inset min-h-[128px] px-3.5 py-3 font-mono text-[10.5px] leading-6">
          {log.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2">
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  entry.status === 'done' ? 'bg-tech-green/80' : 'animate-pulse bg-tech-cyan',
                )}
              />
              <span className="text-tech-faint">
                {entry.status === 'done' ? 'DONE' : 'RUN '}
              </span>
              <span className={cn('truncate', entry.status === 'done' ? 'text-tech-muted' : 'text-tech-cyan')}>
                {entry.title}
              </span>
              <span className="ml-auto shrink-0 text-[9px] text-tech-faint/70">{entry.id}</span>
            </div>
          ))}
          {log.length === 0 && <div className="text-tech-faint">初始化运行环境 …</div>}
        </div>
      </div>

      <div className="relative mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[10.5px] text-tech-faint">
        <Database className="h-3.5 w-3.5 shrink-0 text-tech-cyan/60" />
        知识检索节点会并行召回 KB01–KB04；节点完成后才进入诊断与评分。
      </div>
    </Panel>
  )
}

export function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Panel bodyClassName="p-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tech-red/30 bg-tech-red/10">
          <span className="font-display text-xl font-bold text-tech-red">!</span>
        </div>
        <h2 className="mt-4 font-display text-[20px] font-semibold tracking-wide text-tech-ink">
          工作流执行失败
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-[12px] leading-6 text-tech-muted">{message}</p>
        <div className="mt-4 rounded-md border border-white/10 bg-[#0B192C] px-4 py-3 text-left text-[10.5px] leading-5 text-tech-faint">
          排查建议：模型额度不足时，请在 Dify 控制台检查模型供应商的配额/余额，或把 LLM 节点切换到可用模型；
          同时确认工作流已发布为 Workflow API，服务端 .env 中的 DIFY_API_KEY 与 DIFY_BASE_URL 正确。
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-tech-cyan/40 bg-tech-cyan/10 px-4 py-2 text-[12px] font-medium text-tech-cyan transition hover:bg-tech-cyan/15"
        >
          重新运行
        </button>
      </div>
    </Panel>
  )
}
