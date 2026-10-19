export interface KnowledgeGroup {
  code: string
  title: string
  desc: string
  items: string[]
  accent: string
}

export const KNOWLEDGE_GROUPS: KnowledgeGroup[] = [
  {
    code: 'KB01',
    title: '水生态基础理论',
    desc: '指标含义、正常范围与生态指示意义。',
    items: ['水环境指标', '水文水动力', '生境指标', '生物指标', '生态系统指标'],
    accent: '#3997E6',
  },
  {
    code: 'KB02',
    title: '水生态问题诊断',
    desc: '水质污染类与生境生态类的诊断框架。',
    items: ['水质与污染类问题', '生境与生态类问题'],
    accent: '#36C8B9',
  },
  {
    code: 'KB03',
    title: '生态修复技术',
    desc: '六大技术族及其适用条件与工程参数。',
    items: ['水质净化', '水生植物', '底泥治理', '河岸修复', '水动力', '综合修复'],
    accent: '#3997E6',
  },
  {
    code: 'KB04',
    title: '真实修复案例',
    desc: '26 篇可溯源案例，标注证据类型与适用边界。',
    items: ['河流 4', '湖泊 17', '水库 1', '湿地 3', '景观水体 1'],
    accent: '#36C8B9',
  },
  {
    code: 'KB05',
    title: '修复效果数据',
    desc: '合并长表 1005 条指标记录，451 个 case_id。',
    items: ['A 前后成对', 'B 空间对照', 'C 长期趋势', 'D 去除率/类别'],
    accent: '#F3B34C',
  },
  {
    code: 'KB06',
    title: '标准规范',
    desc: 'GB 3838、HJ 1272—2022、HJ 1295—2023 等依据。',
    items: ['地表水环境质量标准', '成效评估指南', '水生态监测指南'],
    accent: '#3997E6',
  },
]

export const METHOD_STEPS = [
  { index: '01', title: '调查指标', desc: '水质、水文、生境、生物与工程约束，空缺项保留为未知。' },
  { index: '02', title: '数据校验', desc: '标准化、合理性检查与核心指标完整性判断。' },
  { index: '03', title: '知识检索', desc: '并行召回 KB01–KB04，形成可追溯证据。' },
  { index: '04', title: '问题诊断', desc: '规则阈值 + 知识库 + 大模型，区分事实与推断。' },
  { index: '05', title: '七维评分', desc: '问题匹配、环境适配、效果、可实施性、经济性、运维与风险。' },
  { index: '06', title: '决策报告', desc: '17 章报告，列出目标、措施、风险与待补充调查。' },
]
