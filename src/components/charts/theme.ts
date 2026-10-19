/**
 * 科技大屏图表配色
 * 底板：深蓝渐变 #0B192C → #1A365D
 * 主色：青 #00F0FF / 绿 #00FF88 / 蓝 #3BA9FF
 * 色序固定，避免在同一屏内生成额外色相。
 */
export const CHART_COLORS = ['#00F0FF', '#00FF88', '#3BA9FF'] as const

export const CATEGORICAL_5 = ['#00F0FF', '#FFC24B', '#00FF88', '#3BA9FF', '#FF6B7A'] as const

export const AXIS_TEXT = '#8FB3CE'
export const PRIMARY_TEXT = '#EAF7FF'
export const GRID_LINE = 'rgba(0, 240, 255, 0.1)'
export const SPLIT_AREA = ['rgba(26, 54, 93, 0.24)', 'rgba(26, 54, 93, 0.52)']

export const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(5, 13, 27, 0.96)',
  borderColor: 'rgba(0, 240, 255, 0.3)',
  borderWidth: 1,
  padding: [9, 12] as [number, number],
  textStyle: { color: PRIMARY_TEXT, fontSize: 12, fontFamily: 'Inter, Noto Sans SC, sans-serif' },
  extraCssText: 'box-shadow: 0 18px 44px -22px rgba(0,0,0,.85); border-radius: 10px;',
}

export const FONT_FAMILY = 'Inter, Noto Sans SC, PingFang SC, sans-serif'

export function wrapLabel(name: string, perLine = 6): string {
  const chars = Array.from(name)
  if (chars.length <= perLine) return name
  const lines: string[] = []
  for (let i = 0; i < chars.length; i += perLine) {
    lines.push(chars.slice(i, i + perLine).join(''))
  }
  return lines.join('\n')
}
