import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenCheck,
  Database,
  FolderOpen,
  Layers3,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { EvidenceDonut, WaterTypeBar } from '../components/charts/Kb05Charts'
import { PipelineRail } from '../components/PipelineRail'
import { Badge } from '../components/ui'
import { WorkspaceShell } from '../components/workspace/WorkspaceShell'
import { KB05, KB05_CAVEAT, KB05_KPIS } from '../data/kb05'

const KPI_ICONS: LucideIcon[] = [Database, Layers3, FolderOpen, BookOpenCheck]

export function WorkspaceHubPage() {
  return (
    <WorkspaceShell>
      <main className="mx-auto w-full max-w-[1700px] px-4 pb-14 pt-6 md:px-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-tech-cyan/75">
              <span className="h-px w-6 bg-tech-cyan/50" />
              Workspace Hub · Knowledge & Decision
            </div>
            <h1 className="mt-2 font-display text-[28px] font-extrabold leading-tight tracking-wide text-tech-ink md:text-[34px]">
              水生态知识工作仓
            </h1>
            <p className="mt-2 max-w-2xl text-[12px] leading-6 text-tech-muted">
              知识资产、修复案例与决策工作流的统一入口。先理解证据结构，再进入调查输入与智能诊断。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="muted" icon={<Database className="h-3 w-3" />}>
              KB01–KB06
            </Badge>
            <Badge tone="cyan" icon={<Sparkles className="h-3 w-3" />}>
              Dify Workflow · 17 节点
            </Badge>
            <Link to="/assistant" className="tech-button-primary">
              开启智能决策
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {KB05_KPIS.map((kpi, index) => {
            const Icon = KPI_ICONS[index] ?? Database
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass glass-highlight group relative overflow-hidden p-4"
              >
                <span className="corner-bracket left-2 top-2 border-l border-t" />
                <span className="corner-bracket bottom-2 right-2 border-b border-r" />
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-tech-cyan/20 bg-tech-cyan/[0.07] text-tech-cyan">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[9px] text-tech-faint/70">0{index + 1}</span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-[34px] font-extrabold leading-none tracking-tight text-tech-ink md:text-[38px]">
                    {kpi.value}
                  </span>
                </div>
                <div className="mt-1.5 text-[12px] font-semibold text-tech-ink/90">{kpi.label}</div>
                <div className="mt-1 text-[10px] leading-4 text-tech-faint">{kpi.caption}</div>
                <div className="mt-3 h-0.5 w-full rounded-full bg-gradient-to-r from-tech-cyan/70 via-tech-blue/40 to-transparent" />
              </motion.div>
            )
          })}
        </section>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-[10px] leading-5 text-tech-faint">
          <BookOpenCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tech-cyan/70" />
          <span>{KB05_CAVEAT}</span>
        </div>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="glass glass-highlight relative overflow-hidden p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-tech-cyan/70">
                  <span className="h-px w-4 bg-tech-cyan/50" />
                  KB05 Distribution
                </div>
                <h2 className="mt-1.5 font-display text-[19px] font-semibold tracking-wide text-tech-ink">
                  按水体类型的指标记录
                </h2>
                <p className="mt-1 text-[11px] text-tech-muted">
                  保持原始水体类型名称，不自动归并；统计单位为指标记录。
                </p>
              </div>
              <Badge tone="muted">水平条形图</Badge>
            </div>
            <WaterTypeBar data={KB05.waterTypes} />
          </div>

          <div className="glass glass-highlight relative overflow-hidden p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-tech-cyan/70">
                  <span className="h-px w-4 bg-tech-cyan/50" />
                  Evidence Structure
                </div>
                <h2 className="mt-1.5 font-display text-[19px] font-semibold tracking-wide text-tech-ink">
                  证据类型构成
                </h2>
                <p className="mt-1 text-[11px] text-tech-muted">
                  A 前后成对 · B 空间对照 · C 长期趋势 · D 去除率/单组统计。
                </p>
              </div>
              <Badge tone="cyan">环形图</Badge>
            </div>
            <EvidenceDonut data={KB05.evidenceTypes} />
          </div>
        </section>

        <section className="mt-4">
          <PipelineRail nodeStates={{}} activeNode={null} status="idle" doneCount={0} />
        </section>

        <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-tech-cyan/20 bg-gradient-to-r from-tech-cyan/[0.09] via-tech-blue/[0.05] to-transparent px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-tech-cyan/25 bg-tech-cyan/10 text-tech-cyan">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[12.5px] font-semibold text-tech-ink">准备好开始一次修复决策？</div>
              <div className="mt-0.5 text-[10.5px] text-tech-muted">
                录入水质、水动力、生境与工程约束，工作流将依次完成校验、检索、诊断、评分与报告。
              </div>
            </div>
          </div>
          <Link to="/assistant" className="tech-button shrink-0">
            进入决策控制台
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] pt-4 text-[10px] text-tech-faint sm:flex-row">
          <span>澜知 · Workspace Hub · KB01–KB06 · 6 个知识主题组</span>
          <Link to="/" className="inline-flex items-center gap-1 transition hover:text-tech-cyan">
            <ArrowLeft className="h-3 w-3" />
            返回资讯门户
          </Link>
        </footer>
      </main>
    </WorkspaceShell>
  )
}
