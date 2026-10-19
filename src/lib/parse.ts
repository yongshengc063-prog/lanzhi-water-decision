import type { DiagnosisResult, TechnologyScore } from '../types'

/** Strip ```json fences and pull out the first balanced JSON object. */
function extractJson(raw: string): string | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const text = fenced ? fenced[1] : raw
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  return text.slice(start, end + 1)
}

export function parseDiagnosis(raw: unknown): DiagnosisResult | null {
  if (!raw) return null
  try {
    const value = typeof raw === 'string' ? JSON.parse(extractJson(raw) ?? raw) : raw
    if (!value || typeof value !== 'object') return null
    const candidate = value as Partial<DiagnosisResult>
    if (!Array.isArray(candidate.problems)) return null
    return {
      status: candidate.status ?? 'ready',
      water_health_grade: candidate.water_health_grade ?? '未评级',
      problems: candidate.problems
        .filter((p) => p && typeof p === 'object')
        .map((p) => ({
          problem_name: String(p.problem_name ?? '未命名问题'),
          severity: clamp01(Number(p.severity)),
          confidence: clamp01(Number(p.confidence)),
          evidence: Array.isArray(p.evidence) ? p.evidence.map(String) : [],
          evidence_type: String(p.evidence_type ?? '专家推断'),
          possible_mechanism: String(p.possible_mechanism ?? ''),
        })),
      limiting_factors: Array.isArray(candidate.limiting_factors)
        ? candidate.limiting_factors.map(String)
        : [],
      missing_indicators: Array.isArray(candidate.missing_indicators)
        ? candidate.missing_indicators.map(String)
        : [],
      health_dimensions: Array.isArray(candidate.health_dimensions)
        ? candidate.health_dimensions
            .filter((d) => d && typeof d === 'object')
            .map((d) => {
              const item = d as unknown as Record<string, unknown>
              return {
                dimension: String(item.dimension ?? item.name ?? item['维度'] ?? '维度'),
                score: clamp100(Number(item.score ?? item.value ?? item['得分'])),
                note: item.note ? String(item.note) : undefined,
              }
            })
            .filter((d) => d.dimension && Number.isFinite(d.score))
        : undefined,
    }
  } catch {
    return null
  }
}

export function parseTop3(raw: unknown): TechnologyScore[] {
  let list: unknown = raw
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (list && typeof list === 'object' && !Array.isArray(list)) {
    list = (list as { top3?: unknown; scores?: unknown }).top3 ?? (list as { scores?: unknown }).scores
  }
  if (!Array.isArray(list)) return []
  return list
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({
      technology: String(item.technology ?? '未命名技术'),
      total_score: numberOr(item.total_score, 0),
      problem_match: numberOr(item.problem_match, 0),
      environment_match: numberOr(item.environment_match, 0),
      effect_score: numberOr(item.effect_score, 0),
      feasibility_score: numberOr(item.feasibility_score, 0),
      economic_score: numberOr(item.economic_score, 0),
      maintenance_score: numberOr(item.maintenance_score, 0),
      risk_score: numberOr(item.risk_score, 0),
      confidence: numberOr(item.confidence, 0),
      cost_basis: String(item.cost_basis ?? '待成本库/询价校核'),
      reason: String(item.reason ?? ''),
    }))
    .sort((a, b) => b.total_score - a.total_score)
    .slice(0, 3)
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n > 1 ? n / 100 : n))
}

function clamp100(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(100, Math.max(0, n))
}

function numberOr(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/** Split the report into its Chinese-numeral chapters so each gets its own card + anchor. */
export interface ReportSection {
  id: string
  heading: string
  /** absolute character offsets, used for progressive typewriter reveal */
  start: number
  bodyStart: number
  end: number
}

const CHAPTER_RE = /^\s*(?:#{1,4}\s*)?([一二三四五六七八九十百]+)[、.]\s*(.{1,40})\s*$/

export function splitReport(markdown: string): ReportSection[] {
  const normalized = markdown.replace(/\r\n/g, '\n')
  const lines = normalized.split('\n')
  const lineOffsets: number[] = []
  let offset = 0
  for (const line of lines) {
    lineOffsets.push(offset)
    offset += line.length + 1
  }

  const marks: { line: number; heading: string }[] = []
  lines.forEach((line, index) => {
    const match = line.match(CHAPTER_RE)
    if (match && match[2] && !/[。；;]/.test(match[2])) {
      marks.push({ line: index, heading: `${match[1]}、${match[2].trim()}` })
    }
  })

  if (marks.length < 3) {
    return [
      {
        id: 'section-0',
        heading: '决策报告',
        start: 0,
        bodyStart: 0,
        end: normalized.length,
      },
    ]
  }

  return marks.map((mark, i) => {
    const nextMark = marks[i + 1]
    return {
      id: `section-${i}`,
      heading: mark.heading,
      start: lineOffsets[mark.line],
      bodyStart: lineOffsets[mark.line + 1] ?? normalized.length,
      end: nextMark ? lineOffsets[nextMark.line] : normalized.length,
    }
  })
}
