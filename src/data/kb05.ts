import raw from './kb05.json'

export interface Kb05Datum {
  name: string
  value: number
}

export interface Kb05Summary {
  metadata: {
    source: string
    record_count: number
    distinct_case_ids: number
    documented_case_files: number
    note: string
  }
  waterTypes: Kb05Datum[]
  evidenceTypes: Kb05Datum[]
  sourceTypes: Kb05Datum[]
  topIndicators: Kb05Datum[]
}

export const KB05 = raw as Kb05Summary

export const KB05_KPIS = [
  {
    value: KB05.metadata.record_count.toLocaleString('zh-CN'),
    label: 'KB05 指标记录',
    caption: '一行 = 一个案例的一条指标记录，不等于独立工程',
  },
  {
    value: KB05.metadata.distinct_case_ids.toLocaleString('zh-CN'),
    label: '去重 case_id',
    caption: '同一案例的多条指标记录共用一个 case_id',
  },
  {
    value: KB05.metadata.documented_case_files.toLocaleString('zh-CN'),
    label: 'KB04 案例文档',
    caption: '河流 / 湖泊 / 水库 / 湿地 / 景观水体',
  },
  {
    value: '6',
    label: '知识库主题组',
    caption: 'KB01–KB06；不代表 Dify 侧绑定状态',
  },
]

export const KB05_CAVEAT =
  '数据源：KB05 合并总表；统计单位为“指标记录”。不同证据类型不可混合推断，去除率不能反算为浓度。'
