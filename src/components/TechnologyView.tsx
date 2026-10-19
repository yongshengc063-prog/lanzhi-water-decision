import { Award, BarChart3, CircleHelp, Radar, Route } from 'lucide-react'
import type { TechnologyScore } from '../types'
import { cn } from '../lib/cn'
import { TechBar } from './charts/TechBar'
import { TechRadar } from './charts/TechRadar'
import { Badge, Meter, Panel, SectionHeading } from './ui'

const DIMENSIONS: { key: keyof TechnologyScore; label: string }[] = [
  { key: 'problem_match', label: '问题匹配' },
  { key: 'environment_match', label: '环境适配' },
  { key: 'effect_score', label: '预期效果' },
  { key: 'feasibility_score', label: '可实施性' },
  { key: 'economic_score', label: '经济性' },
  { key: 'maintenance_score', label: '运维友好' },
  { key: 'risk_score', label: '风险（反向）' },
]

export function TechnologyView({ technologies }: { technologies: TechnologyScore[] }) {
  const combo = technologies.map((technology) => technology.technology).join(' + ')

  return (
    <Panel bodyClassName="p-5">
      <SectionHeading
        eyebrow="Technology Screening"
        title="修复技术比选"
        hint="按“问题匹配 30% + 环境适配 20% + 预期效果 20% + 可实施性 10% + 经济性 10% + 运维 5% + 生态风险 5%”加权，满分 100。"
        right={
          <>
            <Badge tone="cyan" icon={<Award className="h-3 w-3" />}>
              Top {technologies.length}
            </Badge>
            <Badge tone="muted">7 维评分</Badge>
          </>
        }
      />

      {technologies.length === 0 ? (
        <div className="panel-inset mt-4 grid min-h-[160px] place-items-center text-[12px] text-tech-faint">
          未解析出技术评分结果，请查看工作流原始输出。
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-2 rounded-lg border border-tech-cyan/25 bg-gradient-to-r from-tech-cyan/[0.12] via-tech-cyan/[0.05] to-transparent px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Route className="mt-0.5 h-4 w-4 shrink-0 text-tech-cyan" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-tech-cyan/70">
                  Recommended Combination
                </div>
                <div className="mt-0.5 text-[13.5px] font-medium text-tech-ink">{combo}</div>
              </div>
            </div>
            <span className="chip shrink-0 border-tech-cyan/25 text-tech-cyan">组合推荐</span>
          </div>

          <div className="mt-4 grid gap-3.5 lg:grid-cols-3">
            {technologies.map((technology, index) => (
              <TechnologyCard key={technology.technology} technology={technology} rank={index + 1} />
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="panel-inset p-4">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-tech-ink">
                <BarChart3 className="h-3.5 w-3.5 text-tech-cyan/80" />
                综合评分排名
                <span className="ml-auto text-[10px] font-normal text-tech-faint">满分 100</span>
              </div>
              <TechBar technologies={technologies} />
            </div>
            <div className="panel-inset p-4">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-medium text-tech-ink">
                <Radar className="h-3.5 w-3.5 text-tech-cyan/80" />
                七维能力对比
                <span className="ml-auto text-[10px] font-normal text-tech-faint">生态风险为反向计分</span>
              </div>
              <TechRadar technologies={technologies} />
            </div>
          </div>

          <div className="mt-3 flex items-start gap-1.5 text-[10.5px] leading-5 text-tech-faint">
            <CircleHelp className="mt-0.5 h-3 w-3 shrink-0" />
            {technologies[0]?.cost_basis ||
              '经济性目前为定性先验，成本库未接入；工程投资须待询价与工程量清单校核。'}
          </div>
        </>
      )}
    </Panel>
  )
}

function TechnologyCard({
  technology,
  rank,
}: {
  technology: TechnologyScore
  rank: number
}) {
  const top = rank === 1
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg border p-4 transition',
        top
          ? 'border-tech-cyan/40 bg-gradient-to-b from-tech-cyan/[0.09] to-[#102544] shadow-neon-cyan'
          : 'border-white/10 bg-[#102544] hover:border-white/10',
      )}
    >
      {top && (
        <span className="absolute right-0 top-0 rounded-bl-lg bg-tech-cyan/15 px-2.5 py-1 font-mono text-[9px] tracking-wider text-tech-cyan">
          TOP 1
        </span>
      )}
      <div className="flex items-start justify-between gap-2 pr-10">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'grid h-6 w-6 place-items-center rounded-md border font-display text-[12px] font-semibold',
              top
                ? 'border-tech-cyan/40 bg-tech-cyan/15 text-tech-cyan'
                : 'border-white/10 bg-white/[0.04] text-tech-muted',
            )}
          >
            {rank}
          </span>
          <h3 className="text-[13.5px] font-semibold leading-5 text-tech-ink">{technology.technology}</h3>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-[36px] font-bold leading-none text-tech-ink">
              {technology.total_score.toFixed(1)}
            </span>
            <span className="text-[10px] text-tech-faint">/100</span>
          </div>
          <div className="mt-1 text-[9.5px] uppercase tracking-[0.16em] text-tech-faint">综合得分</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[15px] font-semibold text-tech-amber">
            {Math.round(technology.confidence * 100)}%
          </div>
          <div className="text-[9px] uppercase tracking-wider text-tech-faint">置信度</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/10 pt-3">
        {DIMENSIONS.map((dimension) => {
          const value = Number(technology[dimension.key]) || 0
          return (
            <div key={dimension.key}>
              <div className="mb-1 flex items-center justify-between text-[9.5px]">
                <span className="text-tech-faint">{dimension.label}</span>
                <span className="font-mono text-[#B7CCDC]">{value}</span>
              </div>
              <Meter value={value / 100} tone="cyan" height="h-[3px]" />
            </div>
          )
        })}
      </div>

      {technology.reason && (
        <p className="mt-3 border-t border-white/10 pt-2.5 text-[10.5px] leading-[1.7] text-tech-muted">
          {technology.reason}
        </p>
      )}
    </div>
  )
}
