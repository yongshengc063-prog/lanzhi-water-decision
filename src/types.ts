export type FieldType = 'text' | 'number' | 'select' | 'textarea'

export interface InputField {
  key: string
  label: string
  type: FieldType
  unit?: string
  options?: string[]
  placeholder?: string
  required?: boolean
}

export interface InputGroup {
  key: string
  title: string
  hint: string
  fields: InputField[]
}

export interface DiagnosisProblem {
  problem_name: string
  severity: number
  confidence: number
  evidence: string[]
  evidence_type: string
  possible_mechanism: string
}

export interface HealthDimension {
  /** 维度名：水质、底泥、水动力、生境、生物多样性等 */
  dimension: string
  /** 0–100，越高越健康 */
  score: number
  note?: string
}

export interface DiagnosisResult {
  status: 'ready' | 'needs_more_data' | string
  water_health_grade: string
  problems: DiagnosisProblem[]
  limiting_factors: string[]
  missing_indicators: string[]
  /** 可选的健康度维度评分；有值时优先用健康雷达展示。 */
  health_dimensions?: HealthDimension[]
}

export interface TechnologyScore {
  technology: string
  total_score: number
  problem_match: number
  environment_match: number
  effect_score: number
  feasibility_score: number
  economic_score: number
  maintenance_score: number
  risk_score: number
  confidence: number
  cost_basis: string
  reason: string
}

export interface WorkflowOutputs {
  final_report: string
  diagnosis: string
  top3: TechnologyScore[]
}

export interface QualityReport {
  passed?: boolean
  errors?: string[]
  warnings?: string[]
}

export type RunStatus = 'idle' | 'running' | 'succeeded' | 'failed'
export type NodeStatus = 'pending' | 'running' | 'done' | 'failed'

export interface NodeState {
  status: NodeStatus
  title: string
  outputs?: unknown
}

export type NodeStateMap = Record<string, NodeState>

export interface ApiSettings {
  demo: boolean
}

export interface RunResult {
  diagnosis: DiagnosisResult | null
  diagnosisRaw: string
  top3: TechnologyScore[]
  report: string
}
