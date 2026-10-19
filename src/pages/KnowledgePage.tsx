import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Database,
  FolderOpen,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { EvidenceDonut, WaterTypeBar } from '../components/charts/Kb05Charts'
import { Badge, Panel, SectionHeading } from '../components/ui'
import { WorkspaceShell } from '../components/workspace/WorkspaceShell'
import { KB05, KB05_CAVEAT, KB05_KPIS } from '../data/kb05'
import { CASES, CASE_WATER_TYPES, type WaterBodyType } from '../data/cases'
import { cn } from '../lib/cn'

type Filter = '全部' | WaterBodyType

export function KnowledgePage() {
  const [filter, setFilter] = useState<Filter>('全部')
  const [query, setQuery] = useState('')

  const cases = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return CASES.filter((item) => {
      const typeMatch = filter === '全部' || item.waterType === filter
      const textMatch =
        !keyword ||
        `${item.title} ${item.region} ${item.summary} ${item.evidenceType}`
          .toLowerCase()
          .includes(keyword)
      return typeMatch && textMatch
    })
  }, [filter, query])

  return (
    <WorkspaceShell>
      <main className="mx-auto w-full max-w-[1700px] px-4 pb-14 pt-6 md:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-tech-cyan/75">
              <span className="h-px w-6 bg-tech-cyan/50" />
              Knowledge Base · KB01–KB06
            </div>
            <h1 className="mt-2 font-display text-[28px] font-extrabold leading-tight tracking-wide text-tech-ink md:text-[34px]">
              知识库
            </h1>
            <p className="mt-2 max-w-2xl text-[12px] leading-6 text-tech-muted">
              知识资产统计与真实修复案例。统计来自本地知识库文件，不是实时环境监测；
              1005 条指标记录不等于 1005 个独立工程。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan" icon={<Database className="h-3 w-3" />}>
              KB05 合并总表
            </Badge>
            <Badge tone="good" icon={<ShieldCheck className="h-3 w-3" />}>
              非实时监测
            </Badge>
          </div>
        </div>

        {/* 指标卡片 */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {KB05_KPIS.map((kpi) => (
            <div key={kpi.label} className="glass glass-highlight relative overflow-hidden p-4">
              <span className="corner-bracket left-2 top-2 border-l border-t" />
              <div className="font-display text-[32px] font-extrabold leading-none text-tech-ink">
                {kpi.value}
              </div>
              <div className="mt-2 text-[12px] font-semibold text-tech-ink/90">{kpi.label}</div>
              <div className="mt-1 text-[10px] leading-4 text-tech-faint">{kpi.caption}</div>
            </div>
          ))}
        </section>

        {/* 环形图 + 柱状图 */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <Panel bodyClassName="p-5">
            <SectionHeading
              eyebrow="Distribution"
              title="按水体类型的指标记录"
              hint="保持原始水体类型名称，不自动归并。"
              right={<Badge tone="muted">指标记录</Badge>}
            />
            <div className="mt-2">
              <WaterTypeBar data={KB05.waterTypes} />
            </div>
          </Panel>

          <Panel bodyClassName="p-5">
            <SectionHeading
              eyebrow="Evidence"
              title="证据类型构成"
              hint="A 前后成对、B 空间对照、C 长期趋势、D 去除率/单组统计不可混用。"
              right={<Badge tone="cyan">A/B/C/D</Badge>}
            />
            <EvidenceDonut data={KB05.evidenceTypes} />
          </Panel>
        </section>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-[10px] leading-5 text-tech-faint">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tech-green/70" />
          <span>{KB05_CAVEAT}</span>
        </div>

        {/* 修复案例列表 */}
        <Panel className="mt-4" bodyClassName="p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Restoration Cases"
              title="修复案例"
              hint="来自 KB04 的真实案例文档；详情页保留原文、证据类型与适用边界。"
              right={<Badge tone="muted">{cases.length} / {CASES.length} 篇</Badge>}
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-tech-faint" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索案例、区域或证据类型"
                  className="tech-input h-9 w-[230px] pl-8 text-[11.5px]"
                  aria-label="搜索修复案例"
                />
              </div>
              <Link
                to="/cases"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-[11.5px] text-tech-muted transition hover:border-tech-cyan/35 hover:text-tech-ink"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                全部案例
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {CASE_WATER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] transition',
                  filter === type
                    ? 'border-tech-cyan/40 bg-tech-cyan/10 text-tech-cyan'
                    : 'border-white/10 text-tech-muted hover:border-tech-cyan/25 hover:text-tech-ink',
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {cases.length === 0 ? (
            <div className="mt-5 grid min-h-[160px] place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-[12px] text-tech-faint">
              没有匹配的案例，请调整筛选或关键词。
            </div>
          ) : (
            <div className="mt-4 grid auto-rows-fr gap-2.5 lg:grid-cols-2">
              {cases.map((item) => (
                <Link
                  key={item.id}
                  to={`/cases/${item.id}`}
                  className="group flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5 transition hover:border-tech-cyan/25 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[8.5px] text-tech-faint">
                        {item.id}
                      </span>
                      <h3 className="line-clamp-2 text-[12.5px] font-semibold leading-5 text-tech-ink transition group-hover:text-tech-cyan">
                        {item.title.replace(/^CASE-\d+\s*/, '')}
                      </h3>
                    </div>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tech-faint transition group-hover:text-tech-cyan" />
                  </div>

                  <p className="mt-2 line-clamp-2 flex-1 text-[10.5px] leading-5 text-tech-muted">
                    {item.summary}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-2 text-[9px] text-tech-faint">
                    <span className="rounded bg-tech-cyan/10 px-1.5 py-0.5 text-tech-cyan/90">
                      {item.waterType}
                    </span>
                    <span>{item.region || '区域未披露'}</span>
                    <span className="h-2.5 w-px bg-white/15" />
                    <span>{item.evidenceType}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.08] pt-4 text-[10px] text-tech-faint sm:flex-row">
          <span>澜知 · 工作仓知识库 · KB01–KB06 · 非实时环境监测</span>
          <Link to="/assistant" className="inline-flex items-center gap-1 transition hover:text-tech-cyan">
            进入智能决策
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </footer>
      </main>
    </WorkspaceShell>
  )
}
