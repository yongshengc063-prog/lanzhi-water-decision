import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, FolderOpen, Search, ShieldCheck } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Badge, Panel } from '../components/ui'
import { CASES, CASE_WATER_TYPES, type WaterBodyType } from '../data/cases'
import { EVIDENCE_TYPES } from '../data/evidence'
import { cn } from '../lib/cn'

export function CasesPage() {
  const [waterType, setWaterType] = useState<'全部' | WaterBodyType>('全部')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CASES.filter((item) => {
      if (waterType !== '全部' && item.waterType !== waterType) return false
      if (!q) return true
      return [item.id, item.title, item.region, item.summary, item.detailType]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [waterType, query])

  return (
    <AppShell title="修复案例" subtitle="KB04 · 26 篇可溯源案例与解释边界">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="section-kicker">Case Library</div>
          <h2 className="mt-1.5 font-display text-[26px] font-extrabold tracking-tight text-tech-ink">
            真实案例，而不是效果承诺
          </h2>
          <p className="mt-1.5 max-w-[640px] text-[12px] leading-5 text-tech-muted">
            每篇案例都标注证据类型与适用边界。案例摘要中的去除率、类别或对照比例不能被当作可直接迁移的工程保证值。
          </p>
        </div>
        <Badge tone="good" icon={<ShieldCheck className="h-3 w-3" />}>
          26 篇 · 五类水体
        </Badge>
      </div>

      <Panel bodyClassName="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative mr-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-tech-faint" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索案例编号、标题或区域"
              className="h-9 w-full min-w-[240px] rounded-full border border-white/10 bg-[#102544] pl-9 pr-3 text-[11.5px] text-tech-ink outline-none transition placeholder:text-tech-faint/70 focus:border-tech-green/40 focus:ring-4 focus:ring-aqua/[0.08] sm:w-[300px]"
            />
          </div>
          {CASE_WATER_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setWaterType(type)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[10.5px] font-medium transition',
                waterType === type
                  ? 'border-tech-green/40 bg-tech-green/15 text-tech-green'
                  : 'border-white/10 bg-white/[0.02] text-tech-muted hover:border-tech-green/25 hover:text-tech-ink',
              )}
            >
              {type}
              <span className="ml-1.5 font-mono text-[8.5px] opacity-60">
                {type === '全部' ? CASES.length : CASES.filter((item) => item.waterType === type).length}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid gap-3.5 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const definition = EVIDENCE_TYPES.find((entry) => entry.code === item.evidenceType)
          return (
            <Link
              key={item.id}
              to={`/cases/${item.id}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-[#1A365D]/60 p-4 transition hover:-translate-y-0.5 hover:border-tech-green/25 hover:bg-[#1A365D]/60 hover:shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[8.5px] text-tech-faint">
                    {item.id}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[8.5px] text-tech-muted">
                    {item.waterType}
                  </span>
                  {definition && (
                    <span
                      className="rounded-full border px-2 py-0.5 text-[8.5px]"
                      style={{
                        color: definition.color,
                        borderColor: `${definition.color}55`,
                        backgroundColor: `${definition.color}12`,
                      }}
                    >
                      {definition.code} · {definition.name}
                    </span>
                  )}
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-tech-faint transition group-hover:text-tech-green" />
              </div>
              <h3 className="mt-3 line-clamp-2 text-[13px] font-semibold leading-5 text-tech-ink transition group-hover:text-tech-green">
                {item.title.replace(/^CASE-\d+\s*/, '')}
              </h3>
              <div className="mt-1 text-[9.5px] text-tech-faint">
                {item.region || '区域未披露'}
                {item.period ? ` · ${item.period}` : ''}
              </div>
              <p className="mt-2 line-clamp-3 text-[10px] leading-4 text-tech-muted">
                {item.summary || item.dataNature}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-2.5 mt-3 text-[9px] text-tech-faint">
                <span className="inline-flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" />
                  KB04 · Markdown
                </span>
                <span>{item.sources.length} 条来源链接</span>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Panel className="mt-4" bodyClassName="grid min-h-[180px] place-items-center p-8 text-center">
          <div>
            <Search className="mx-auto h-7 w-7 text-tech-faint" />
            <div className="mt-2 text-[12px] text-tech-muted">没有匹配的案例</div>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setWaterType('全部')
              }}
              className="mt-3 rounded-full border border-white/10 px-3 py-1.5 text-[10.5px] text-tech-ink"
            >
              清除筛选
            </button>
          </div>
        </Panel>
      )}

      <Panel className="mt-4" bodyClassName="p-4">
        <div className="flex items-start gap-2.5 text-[10px] leading-5 text-tech-faint">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tech-green/70" />
          <span>
            案例库说明：26 篇文档不等于 26 个可直接复制的工程模板。天然湿地进出水、长期监测和多措施同期治理
            不能解释为单项工程因果；缺少对照或原文端点的记录只保留可核实的描述。
          </span>
        </div>
      </Panel>
    </AppShell>
  )
}
