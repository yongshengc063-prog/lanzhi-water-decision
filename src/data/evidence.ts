export interface EvidenceDefinition {
  code: 'A' | 'B' | 'C' | 'D' | '未标注'
  name: string
  meaning: string
  boundary: string
  color: string
}

export const EVIDENCE_TYPES: EvidenceDefinition[] = [
  {
    code: 'A',
    name: '前后成对',
    meaning: '同一地点修复前后的成对观测值。',
    boundary: '可比较修复前—后变化，但仍需核对采样时间、点位和统计口径。',
    color: '#3987E5',
  },
  {
    code: 'B',
    name: '空间对照',
    meaning: '修复区与对照区的空间比较。',
    boundary: '是空间对照，不是同一地点修复前后的时间对照。',
    color: '#D95926',
  },
  {
    code: 'C',
    name: '长期趋势',
    meaning: '长期监测序列或阶段均值。',
    boundary: '可能叠加多项治理措施与气候波动，不可归因于单项工程。',
    color: '#199E70',
  },
  {
    code: 'D',
    name: '去除率 / 类别 / 单组统计',
    meaning: '只报告去除率、水质类别、单组统计或定性描述。',
    boundary: '不能当作工程前后浓度端点，也不能反算绝对浓度。',
    color: '#C98500',
  },
  {
    code: '未标注',
    name: '证据类型缺失',
    meaning: '原表没有可用的数值证据类型标注。',
    boundary: '只能作为案例线索，不能用于效果比较。',
    color: '#D55181',
  },
]

export const INFORMATION_CLASSES = [
  { label: '事实', desc: '用户提供的观测指标' },
  { label: '知识库证据', desc: '来自 KB01–KB06 的条文与案例' },
  { label: '模型预测', desc: '来自预测模型的数值，非实测' },
  { label: '专家推断', desc: '基于经验的推理判断' },
]
