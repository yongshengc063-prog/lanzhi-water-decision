import type { InputGroup } from './types'

export const INPUT_GROUPS: InputGroup[] = [
  {
    key: 'project',
    title: '项目概况',
    hint: '定位与修复目标',
    fields: [
      {
        key: 'water_type',
        label: '水体类型',
        type: 'select',
        options: ['河流', '湖泊', '水库', '湿地', '景观水体'],
        required: true,
        placeholder: '请选择',
      },
      { key: 'project_name', label: '项目名称', type: 'text', placeholder: '如：××河城区段生态修复' },
      { key: 'region', label: '所在区域', type: 'text', placeholder: '如：江苏省南京市' },
      {
        key: 'target_water_class',
        label: '目标水质类别',
        type: 'select',
        options: ['I类', 'II类', 'III类', 'IV类', 'V类'],
        placeholder: '不设默认值',
      },
      { key: 'water_area', label: '水域面积', type: 'number', unit: 'm²', placeholder: '如 120000' },
      { key: 'river_length', label: '治理河段长度', type: 'number', unit: 'm', placeholder: '如 3200' },
      {
        key: 'pollution_source_summary',
        label: '污染源与排口调查',
        type: 'textarea',
        placeholder: '排口数量、雨污分流情况、农业面源、底泥历史等',
      },
    ],
  },
  {
    key: 'water',
    title: '水质指标',
    hint: '现场监测值，未知留空',
    fields: [
      { key: 'TN', label: '总氮 TN', type: 'number', unit: 'mg/L', placeholder: '如 2.9' },
      { key: 'TP', label: '总磷 TP', type: 'number', unit: 'mg/L', placeholder: '如 0.21' },
      { key: 'NH3_N', label: '氨氮 NH₃-N', type: 'number', unit: 'mg/L', placeholder: '如 1.4' },
      { key: 'COD', label: '化学需氧量 COD', type: 'number', unit: 'mg/L', placeholder: '如 38' },
      { key: 'DO', label: '溶解氧 DO', type: 'number', unit: 'mg/L', placeholder: '如 3.6' },
      { key: 'Chla', label: '叶绿素 a', type: 'number', unit: 'μg/L', placeholder: '如 46' },
      { key: 'transparency', label: '透明度', type: 'number', unit: 'cm', placeholder: '如 35' },
      { key: 'pH', label: 'pH', type: 'number', unit: '', placeholder: '如 7.8' },
    ],
  },
  {
    key: 'habitat',
    title: '水动力与生境',
    hint: '物理条件与生物状况',
    fields: [
      { key: 'flow_velocity', label: '流速', type: 'number', unit: 'm/s', placeholder: '如 0.06' },
      { key: 'water_depth', label: '平均水深', type: 'number', unit: 'm', placeholder: '如 2.2' },
      { key: 'sediment_thickness', label: '底泥厚度', type: 'number', unit: 'cm', placeholder: '如 45' },
      { key: 'shoreline_hardening', label: '岸线硬化率', type: 'number', unit: '%', placeholder: '如 68' },
      { key: 'aquatic_plant_coverage', label: '水生植物覆盖率', type: 'number', unit: '%', placeholder: '如 8' },
      { key: 'fish_diversity', label: '鱼类多样性 Shannon', type: 'number', unit: '', placeholder: '如 1.2' },
    ],
  },
  {
    key: 'constraint',
    title: '工程约束',
    hint: '决定技术可实施性',
    fields: [
      { key: 'land_constraint', label: '可用土地面积', type: 'number', unit: 'm²', placeholder: '如 8000' },
      { key: 'budget_level', label: '预算水平', type: 'select', options: ['低', '中', '高'], placeholder: '请选择' },
      {
        key: 'maintenance_level',
        label: '运维强度',
        type: 'select',
        options: ['低', '中', '高'],
        placeholder: '请选择',
      },
      { key: 'restoration_period', label: '期望修复周期', type: 'number', unit: '月', placeholder: '如 24' },
    ],
  },
]

export const FIELD_INDEX: Record<string, { label: string; unit?: string }> = Object.fromEntries(
  INPUT_GROUPS.flatMap((group) =>
    group.fields.map((field) => [field.key, { label: field.label, unit: field.unit }]),
  ),
)

export type StageKey = 'prepare' | 'retrieve' | 'diagnose' | 'score' | 'report'

export interface Stage {
  key: StageKey
  label: string
  caption: string
  nodeIds: string[]
}

export const STAGES: Stage[] = [
  { key: 'prepare', label: '数据校验', caption: '标准化 · 质量门', nodeIds: ['normalize', 'quality_check'] },
  {
    key: 'retrieve',
    label: '知识检索',
    caption: 'KB01–KB04 · 证据召回',
    nodeIds: ['retrieval_query', 'kb01', 'kb02', 'kb03', 'kb04'],
  },
  { key: 'diagnose', label: '生态诊断', caption: '问题识别 · 证据链', nodeIds: ['diagnose'] },
  {
    key: 'score',
    label: '方案评分',
    caption: '候选生成 · 7 维评分 · Top3',
    nodeIds: ['candidate', 'scoring', 'top3'],
  },
  {
    key: 'report',
    label: '报告生成',
    caption: '案例 / 规范检索 · 17 章',
    nodeIds: ['decision_query', 'case_match', 'standard', 'report'],
  },
]

export const NODE_META: Record<string, { title: string; stage: StageKey }> = {
  start: { title: '前期指标输入', stage: 'prepare' },
  normalize: { title: '数据标准化', stage: 'prepare' },
  quality_check: { title: '数据质量检查', stage: 'prepare' },
  retrieval_query: { title: '检索查询构造', stage: 'retrieve' },
  kb01: { title: 'KB01 基础理论检索', stage: 'retrieve' },
  kb02: { title: 'KB02 问题诊断检索', stage: 'retrieve' },
  kb03: { title: 'KB03 修复技术检索', stage: 'retrieve' },
  kb04: { title: 'KB04 修复案例检索', stage: 'retrieve' },
  diagnose: { title: '水生态问题诊断', stage: 'diagnose' },
  candidate: { title: '修复技术候选生成', stage: 'score' },
  scoring: { title: '技术适宜性评分', stage: 'score' },
  top3: { title: 'Top3 筛选', stage: 'score' },
  decision_query: { title: '案例与规范查询构造', stage: 'report' },
  case_match: { title: '案例相似度检索', stage: 'report' },
  standard: { title: '标准规范检索', stage: 'report' },
  report: { title: '最终决策报告', stage: 'report' },
  end: { title: '输出结果', stage: 'report' },
}

export const TOTAL_NODES = Object.keys(NODE_META).length

export const DEMO_INPUTS: Record<string, string> = {
  water_type: '河流',
  project_name: '清河城区段水生态修复示范工程',
  region: '江苏省南京市',
  target_water_class: 'IV类',
  water_area: '120000',
  river_length: '3200',
  pollution_source_summary:
    '沿河 7 个混接排口，雨季溢流；上游农业面源输入；底泥历史淤积明显，岸线硬化率较高。',
  TN: '2.9',
  TP: '0.21',
  NH3_N: '1.4',
  COD: '38',
  DO: '3.6',
  Chla: '46',
  transparency: '35',
  pH: '7.8',
  flow_velocity: '0.06',
  water_depth: '2.2',
  sediment_thickness: '45',
  shoreline_hardening: '68',
  aquatic_plant_coverage: '8',
  fish_diversity: '1.2',
  land_constraint: '8000',
  budget_level: '中',
  maintenance_level: '中',
  restoration_period: '24',
}
