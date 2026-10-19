import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, FolderOpen, ShieldCheck } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Markdown } from '../components/Markdown'
import { getCase } from '../data/cases'
import { EVIDENCE_TYPES } from '../data/evidence'
import { Badge, Panel } from '../components/ui'

export function CaseDetailPage() {
  const { caseId } = useParams()
  const item = caseId ? getCase(caseId) : undefined

  if (!item) {
    return (
      <AppShell title="案例未找到" subtitle="KB04 · 修复案例">
        <Panel bodyClassName="grid min-h-[260px] place-items-center p-8 text-center">
          <div>
            <FolderOpen className="mx-auto h-8 w-8 text-tech-faint" />
            <h2 className="mt-3 font-display text-[18px] font-bold text-tech-ink">没有找到这个案例</h2>
            <p className="mt-1 text-[11px] text-tech-muted">请从案例目录重新进入。</p>
            <Link
              to="/cases"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-tech-green/30 bg-tech-green/10 px-4 py-2 text-[11px] text-tech-green"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回案例目录
            </Link>
          </div>
        </Panel>
      </AppShell>
    )
  }

  const definition = EVIDENCE_TYPES.find((entry) => entry.code === item.evidenceType)
  const body = item.content
    .replace(/^#\s.*\n/, '')
    .replace(/^>\s*数据性质[：:].*$/m, '')
    .trim()

  return (
    <AppShell title={item.id} subtitle="KB04 · 案例详情与解释边界">
      <div className="mb-4">
        <Link
          to="/cases"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10.5px] text-tech-muted transition hover:border-tech-green/30 hover:text-tech-ink"
        >
          <ArrowLeft className="h-3 w-3" />
          返回案例目录
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <Panel bodyClassName="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-tech-faint">
                {item.id}
              </span>
              <Badge tone="cyan">{item.waterType}</Badge>
              {definition && (
                <span
                  className="rounded-full border px-2 py-0.5 text-[9.5px]"
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
            <h2 className="mt-3 text-balance font-display text-[23px] font-extrabold leading-snug tracking-tight text-tech-ink">
              {item.title.replace(/^CASE-\d+\s*/, '')}
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-tech-faint">
              <span>区域：{item.region || '原文未披露'}</span>
              <span>类型：{item.detailType || item.waterType}</span>
              {item.period && <span>时段：{item.period}</span>}
            </div>
            {item.summary && (
              <p className="mt-3 border-l-2 border-tech-green/40 pl-3 text-[11px] leading-5 text-tech-muted">
                {item.summary}
              </p>
            )}
          </Panel>

          {item.dataNature && (
            <div className="flex items-start gap-2.5 rounded-xl border border-tech-amber/20 bg-tech-amber/[0.05] px-4 py-3 text-[10.5px] leading-5 text-tech-amber/90">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <b className="font-semibold">数据性质：</b>
                {item.dataNature}
              </span>
            </div>
          )}

          <Panel bodyClassName="p-5">
            <Markdown>{body}</Markdown>
          </Panel>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[92px] xl:self-start">
          <Panel bodyClassName="p-4">
            <div className="text-[10px] uppercase tracking-[0.16em] text-tech-faint">Case Metadata</div>
            <dl className="mt-3 space-y-2.5 text-[10.5px]">
              <div className="flex justify-between gap-3">
                <dt className="text-tech-faint">水体类型</dt>
                <dd className="text-right text-tech-ink">{item.waterType}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-tech-faint">细分类型</dt>
                <dd className="max-w-[170px] text-right text-tech-ink">{item.detailType || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-tech-faint">证据类型</dt>
                <dd className="text-right text-tech-ink">{definition ? `${definition.code} · ${definition.name}` : '未标注'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-tech-faint">来源链接</dt>
                <dd className="text-right text-tech-ink">{item.sources.length}</dd>
              </div>
            </dl>
            {definition && (
              <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-[9.5px] leading-4 text-tech-faint">
                {definition.boundary}
              </div>
            )}
          </Panel>

          {item.sources.length > 0 && (
            <Panel bodyClassName="p-4">
              <div className="text-[10px] uppercase tracking-[0.16em] text-tech-faint">参考来源</div>
              <div className="mt-3 space-y-2">
                {item.sources.map((source, index) => (
                  <a
                    key={source}
                    href={source}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2 text-[9.5px] leading-4 text-tech-muted transition hover:text-tech-green"
                  >
                    <span className="font-mono text-[8.5px] text-tech-faint">{String(index + 1).padStart(2, '0')}</span>
                    <span className="line-clamp-2 break-all">{source}</span>
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-50 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </Panel>
          )}

          <div className="rounded-xl border border-dashed border-white/10 px-4 py-3 text-[9.5px] leading-4 text-tech-faint">
            案例仅用于证据参考。报告中的推荐与效果仍以 Dify Workflow 实际返回为准，不把本页数据直接当作工程保证值。
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
