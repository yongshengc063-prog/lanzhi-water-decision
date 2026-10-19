import raw from './cases.json'

export type WaterBodyType = '河流' | '湖泊' | '水库' | '湿地' | '景观水体'

export interface CaseRecord {
  id: string
  title: string
  waterType: WaterBodyType
  detailType: string
  region: string
  period: string
  dataNature: string
  evidenceType: string
  summary: string
  content: string
  sources: string[]
}

export const CASES = raw as CaseRecord[]

export const CASE_WATER_TYPES: ('全部' | WaterBodyType)[] = [
  '全部',
  '河流',
  '湖泊',
  '水库',
  '湿地',
  '景观水体',
]

export function getCase(id: string): CaseRecord | undefined {
  return CASES.find((item) => item.id.toUpperCase() === id.toUpperCase())
}
