import {
  Activity,
  CircleAlert,
  ClipboardCheck,
  Layers,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react'
import type { DiagnosisResult, QualityReport } from '../types'
import { cn } from '../lib/cn'
import { gradeIndex, gradeTone } from '../lib/health'
import { DiagnosisRadar } from './charts/DiagnosisRadar'
import { HealthGauge, HealthRadar, MetricRing } from './charts/TechGauges'
import { Badge, Meter, Panel, SectionHeading } from './ui'

export function DiagnosisView({
  diagnosis,
  quality,
}: {
  diagnosis: DiagnosisResult
  quality?: QualityReport
}) {
  const problems = diagnosis.problems ?? []
  const worst = problems.reduce((max, problem) => Math.max(max, problem.severity), 0)
  const avgConfidence = problems.length
    ? problems.reduce((sum, problem) => sum + problem.confidence, 0) / problems.length
    : 0
  const index = gradeIndex(diagnosis.water_health_grade)
  const tone = gradeTone(index)
  const warnings = quality?.warnings ?? []
  const needsMore = diagnosis.status === 'needs_more_data'
  const dimensions = diagnosis.health_dimensions ?? []
  const hasDimensions = dimensions.length >= 3

  return (
    <Panel bodyClassName="p-5">
      <SectionHeading
        eyebrow="Ecological Diagnosis"
        title="生态诊断结果"
        hint="基于“规则阈值 + 知识库证据 + 大模型推理”的组合诊断；雷达图为 0–100 健康度维度，数值越高越健康。"
        right={
          <>
            <Badge tone={needsMore ? 'amber' : 'good'} icon={<ClipboardCheck className="h-3 w-3" />}>
              {needsMore ? '需补充数据' : '证据充分'}
            </Badge>
            <Badge tone="cyan">{problems.length} 项问题</Badge>
          </>
        }
      />

      {(needsMore || warnings.length > 0) && (
        <div className="mt-4 space-y-2">
          {needsMore && (
            <div className="flex items-start gap-2 rounded-lg border border-tech-amber/25 bg-tech-amber/[0.07] px-3.5 py-2.5 text-[11.5px] leading-5 text-tech-amber">
              <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              数据质量门未完全通过，诊断结果按“需补充数据”输出，关键结论须谨慎采用。
            </div>
          )}
          {warnings.length > 0 && (
            <div className="rounded-lg border border-tech-amber/20 bg-tech-amber/[0.05] px-3.5 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-tech-amber">
                <TriangleAlert className="h-3.5 w-3.5" />
                数据质量提示
              </div>
              <ul className="mt-1.5 space-y-0.5 text-[11px] leading-5 text-tech-muted">
                {warnings.map((warning) => (
                  <li key={warning} className="flex gap-1.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tech-amber/70" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.45fr_0.8fr_0.8fr]">
        <div className="panel-inset relative overflow-hidden px-4 py-3.5">
          <span className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(260px_120px_at_20%_0%,rgba(0,240,255,0.12),transparent_70%)]" />
          <div className="metric-label">综合健康等级</div>
          <div className="relative mt-1 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div
                className={cn(
                  'font-display text-[40px] font-extrabold leading-none tracking-wide',
                  tone === 'good'
                    ? 'text-tech-green'
                    : tone === 'amber'
                      ? 'text-tech-amber'
                      : 'text-tech-red',
                )}
              >
                {diagnosis.water_health_grade || '未评级'}
              </div>
              <div className="mt-2 flex items-baseline gap-1 text-[11px] text-tech-muted">
                健康指数
                <span className="font-display text-[17px] font-bold text-tech-ink">{index}</span>
                <span className="text-[9.5px] text-tech-faint">/100</span>
              </div>
              <div className="mt-2 text-[9.5px] text-tech-faint">水质 · 生境 · 生物综合判定</div>
            </div>
            <div className="w-[132px] shrink-0">
              <HealthGauge value={index} height={132} />
            </div>
          </div>
        </div>

        <div className="panel-inset p-3">
          <div className="flex items-center justify-between">
            <span className="metric-label">最高严重度</span>
            <span className="text-[9.5px] text-tech-faint">
              {problems.find((problem) => problem.severity === worst)?.problem_name ?? '—'}
            </span>
          </div>
          <MetricRing value={worst} label="SEVERITY" color="#FF6B7A" height={128} />
        </div>

        <div className="panel-inset p-3">
          <div className="flex items-center justify-between">
            <span className="metric-label">平均置信度</span>
            <span className="text-[9.5px] text-tech-faint">缺失指标会拉低</span>
          </div>
          <MetricRing value={avgConfidence} label="CONFIDENCE" color="#00FF88" height={128} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <div className="panel-inset flex flex-col p-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] font-medium text-tech-ink">
              <Activity className="h-3.5 w-3.5 text-tech-cyan/80" />
              {hasDimensions ? '水体健康度维度' : '问题严重度 / 置信度剖面'}
            </div>
            <span className="text-[10px] text-tech-faint">
              {hasDimensions ? '0–100 · 越高越健康' : '0–100%'}
            </span>
          </div>
          {hasDimensions ? (
            <HealthRadar dimensions={dimensions} />
          ) : problems.length >= 3 ? (
            <DiagnosisRadar problems={problems} />
          ) : (
            <SeverityFallback problems={problems} />
          )}
        </div>

        <div className="space-y-2.5">
          {problems.map((problem, index) => (
            <ProblemCard key={`${problem.problem_name}-${index}`} problem={problem} index={index} />
          ))}
          {problems.length === 0 && (
            <div className="panel-inset grid min-h-[120px] place-items-center text-[12px] text-tech-faint">
              未解析出结构化问题，请查看原始诊断输出。
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="panel-inset p-3.5">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-tech-muted">
            <Layers className="h-3.5 w-3.5 text-tech-cyan/70" />
            关键限制因子
          </div>
          <div className="flex flex-wrap gap-1.5">
            {diagnosis.limiting_factors.length ? (
              diagnosis.limiting_factors.map((factor) => (
                <span
                  key={factor}
                  className="chip border-tech-cyan/25 text-tech-cyan"
                >
                  {factor}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-tech-faint">未识别</span>
            )}
          </div>
        </div>
        <div className="panel-inset p-3.5">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-tech-muted">
            <ShieldAlert className="h-3.5 w-3.5 text-tech-amber/80" />
            待补充指标
          </div>
          <div className="flex flex-wrap gap-1.5">
            {diagnosis.missing_indicators.length ? (
              diagnosis.missing_indicators.map((item) => (
                <span key={item} className="chip border-tech-amber/25 text-tech-amber">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-tech-faint">无</span>
            )}
          </div>
        </div>
      </div>
    </Panel>
  )
}

function ProblemCard({
  problem,
  index,
}: {
  problem: DiagnosisResult['problems'][number]
  index: number
}) {
  const inferred = problem.evidence_type.includes('推测')
  return (
    <div className="panel-inset p-3.5 transition hover:border-tech-cyan/25">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-white/10 bg-white/[0.04] font-mono text-[10px] text-tech-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[13.5px] font-semibold text-tech-ink">{problem.problem_name}</h3>
              <Badge tone={inferred ? 'amber' : 'cyan'} className="px-2 py-0 text-[10px]">
                {problem.evidence_type}
              </Badge>
            </div>
            {problem.possible_mechanism && (
              <p className="mt-1 text-[11px] leading-5 text-tech-muted">{problem.possible_mechanism}</p>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-[20px] font-semibold leading-none text-tech-ink">
            {Math.round(problem.severity * 100)}
            <span className="text-[10px] text-tech-faint">%</span>
          </div>
          <div className="mt-0.5 text-[9px] uppercase tracking-wider text-tech-faint">严重度</div>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_88px] items-center gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-11 shrink-0 text-[9.5px] text-tech-faint">严重度</span>
            <Meter value={problem.severity} tone={problem.severity > 0.75 ? 'danger' : 'cyan'} height="h-1" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-11 shrink-0 text-[9.5px] text-tech-faint">置信度</span>
            <Meter value={problem.confidence} tone="amber" height="h-1" />
          </div>
        </div>
        <div className="text-right text-[10px] leading-4 text-tech-faint">
          置信 {Math.round(problem.confidence * 100)}%
        </div>
      </div>

      {problem.evidence.length > 0 && (
        <ul className="mt-2.5 space-y-1 border-t border-white/[0.08] pt-2">
          {problem.evidence.map((evidence, i) => (
            <li key={i} className="flex gap-1.5 text-[10.5px] leading-4 text-[#B7CFE0]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-tech-cyan/60" />
              {evidence}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SeverityFallback({ problems }: { problems: DiagnosisResult['problems'] }) {
  return (
    <div className="mt-4 space-y-4">
      {problems.map((problem) => (
        <div key={problem.problem_name}>
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="text-tech-muted">{problem.problem_name}</span>
            <span className="font-mono text-tech-ink">{Math.round(problem.severity * 100)}%</span>
          </div>
          <Meter value={problem.severity} tone="cyan" height="h-1.5" />
        </div>
      ))}
    </div>
  )
}
