/** 将工作流返回的健康等级映射为 0–100 的展示指数。 */
const GRADE_INDEX: Record<string, number> = {
  优: 92,
  良好: 84,
  良: 80,
  一般: 64,
  较差: 42,
  差: 22,
}

export function gradeIndex(grade: string | undefined | null): number {
  if (!grade) return 0
  if (GRADE_INDEX[grade] !== undefined) return GRADE_INDEX[grade]
  if (grade.includes('优')) return 92
  if (grade.includes('良好')) return 84
  if (grade.includes('良')) return 80
  if (grade.includes('一般')) return 64
  if (grade.includes('较差')) return 42
  if (grade.includes('差')) return 22
  return 55
}

export function gradeTone(index: number): 'good' | 'amber' | 'danger' {
  if (index >= 75) return 'good'
  if (index >= 50) return 'amber'
  return 'danger'
}
