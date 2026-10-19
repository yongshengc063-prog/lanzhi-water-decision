import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import type { TechnologyScore } from '../../types'
import { EChart } from './EChart'
import { AXIS_TEXT, CHART_COLORS, FONT_FAMILY, GRID_LINE, PRIMARY_TEXT, TOOLTIP_STYLE } from './theme'

export function TechBar({ technologies }: { technologies: TechnologyScore[] }) {
  const option = useMemo<EChartsOption>(() => {
    const ordered = [...technologies].reverse()
    return {
      backgroundColor: 'transparent',
      animationDuration: 700,
      grid: { top: 8, right: 52, bottom: 8, left: 8, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(34, 211, 238, 0.06)' } },
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const first = (params as { dataIndex: number }[])[0]
          const item = ordered[first?.dataIndex ?? 0]
          if (!item) return ''
          return (
            `<div style="font-weight:600;margin-bottom:4px">${item.technology}</div>` +
            `<div style="color:${AXIS_TEXT}">综合评分 <span style="color:${PRIMARY_TEXT};font-weight:600">${item.total_score.toFixed(1)}</span> / 100</div>` +
            `<div style="color:${AXIS_TEXT};margin-top:2px">置信度 ${Math.round(item.confidence * 100)}%</div>`
          )
        },
      },
      xAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: GRID_LINE } },
        axisLabel: { color: AXIS_TEXT, fontSize: 10, fontFamily: FONT_FAMILY },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: ordered.map((item) => item.technology),
        axisLabel: {
          color: '#C3D6E3',
          fontSize: 11,
          fontFamily: FONT_FAMILY,
          width: 132,
          overflow: 'truncate',
        },
        axisLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.14)' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: ordered.map((item) => item.total_score),
          barWidth: 14,
          showBackground: true,
          backgroundStyle: { color: 'rgba(255, 255, 255, 0.035)', borderRadius: 4 },
          itemStyle: { color: CHART_COLORS[0], borderRadius: [0, 4, 4, 0] },
          label: {
            show: true,
            position: 'right',
            color: PRIMARY_TEXT,
            fontFamily: 'Manrope, Noto Sans SC, sans-serif',
            fontWeight: 600,
            fontSize: 14,
            formatter: ({ value }) => Number(value).toFixed(1),
          },
        },
      ],
    }
  }, [technologies])

  return (
    <EChart
      option={option}
      height={Math.max(190, technologies.length * 62 + 40)}
      ariaLabel="修复技术综合评分排名柱状图"
    />
  )
}
