import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import type { TechnologyScore } from '../../types'
import { EChart } from './EChart'
import {
  AXIS_TEXT,
  CHART_COLORS,
  FONT_FAMILY,
  PRIMARY_TEXT,
  SPLIT_AREA,
  TOOLTIP_STYLE,
  wrapLabel,
} from './theme'

const DIMENSIONS: { key: keyof TechnologyScore; label: string }[] = [
  { key: 'problem_match', label: '问题匹配' },
  { key: 'environment_match', label: '环境适配' },
  { key: 'effect_score', label: '预期效果' },
  { key: 'feasibility_score', label: '可实施性' },
  { key: 'economic_score', label: '经济性' },
  { key: 'maintenance_score', label: '运维友好' },
  { key: 'risk_score', label: '生态风险（反向）' },
]

export function TechRadar({ technologies }: { technologies: TechnologyScore[] }) {
  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 700,
      tooltip: {
        trigger: 'item',
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const p = params as { name: string; value: number[]; color: string }
          return (
            `<div style="font-weight:600;margin-bottom:4px;color:${p.color}">${p.name}</div>` +
            DIMENSIONS.map(
              (dimension, index) =>
                `<div style="display:flex;justify-content:space-between;gap:16px;color:${AXIS_TEXT}">` +
                `<span>${dimension.label}</span>` +
                `<span style="color:${PRIMARY_TEXT};font-weight:600">${p.value[index]}</span></div>`,
            ).join('')
          )
        },
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: AXIS_TEXT, fontSize: 10.5, fontFamily: FONT_FAMILY },
        pageTextStyle: { color: AXIS_TEXT },
      },
      radar: {
        center: ['50%', '46%'],
        radius: '58%',
        splitNumber: 4,
        indicator: DIMENSIONS.map((dimension) => ({ name: dimension.label, max: 100 })),
        axisName: {
          color: '#C3D6E3',
          fontSize: 10.5,
          fontFamily: FONT_FAMILY,
          formatter: (name?: string) => wrapLabel(name ?? '', 5),
        },
        axisLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.14)' } },
        splitLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.12)' } },
        splitArea: { areaStyle: { color: SPLIT_AREA } },
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 5,
          data: technologies.map((technology, index) => ({
            name: technology.technology,
            value: DIMENSIONS.map((dimension) => Number(technology[dimension.key]) || 0),
            lineStyle: { width: 2, color: CHART_COLORS[index] },
            itemStyle: { color: CHART_COLORS[index], borderColor: '#1A365D', borderWidth: 2 },
            areaStyle: { color: CHART_COLORS[index], opacity: 0.07 },
          })),
        },
      ],
    }),
    [technologies],
  )

  return <EChart option={option} height={340} ariaLabel="Top3 修复技术七维能力对比雷达图" />
}
