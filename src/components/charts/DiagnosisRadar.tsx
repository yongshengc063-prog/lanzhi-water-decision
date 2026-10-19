import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import type { DiagnosisProblem } from '../../types'
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

export function DiagnosisRadar({ problems }: { problems: DiagnosisProblem[] }) {
  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 700,
      tooltip: {
        trigger: 'item',
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const p = params as { name: string; value: number[] }
          return [
            `<div style="font-weight:600;margin-bottom:4px">${p.name}</div>`,
            ...p.value.map(
              (value, index) =>
                `<div style="display:flex;justify-content:space-between;gap:18px;color:${AXIS_TEXT}">` +
                `<span>${index === 0 ? '严重度' : '置信度'}</span>` +
                `<span style="color:${PRIMARY_TEXT};font-weight:600">${Math.round(value * 100)}%</span></div>`,
            ),
          ].join('')
        },
      },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: AXIS_TEXT, fontSize: 11, fontFamily: FONT_FAMILY },
        data: ['严重度', '置信度'],
      },
      radar: {
        center: ['50%', '55%'],
        radius: '65%',
        splitNumber: 4,
        indicator: problems.map((problem) => ({ name: problem.problem_name, max: 1 })),
        axisName: {
          color: '#C3D6E3',
          fontSize: 11,
          fontFamily: FONT_FAMILY,
          formatter: (name?: string) => wrapLabel(name ?? '', 6),
        },
        axisLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.14)' } },
        splitLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.12)' } },
        splitArea: { areaStyle: { color: SPLIT_AREA } },
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 6,
          data: [
            {
              name: '严重度',
              value: problems.map((problem) => problem.severity),
              lineStyle: { width: 2, color: CHART_COLORS[0] },
              itemStyle: { color: CHART_COLORS[0], borderColor: '#1A365D', borderWidth: 2 },
              areaStyle: { color: CHART_COLORS[0], opacity: 0.16 },
            },
            {
              name: '置信度',
              value: problems.map((problem) => problem.confidence),
              lineStyle: { width: 2, color: CHART_COLORS[1], type: 'dashed' },
              itemStyle: { color: CHART_COLORS[1], borderColor: '#1A365D', borderWidth: 2 },
              areaStyle: { color: CHART_COLORS[1], opacity: 0.06 },
            },
          ],
        },
      ],
    }),
    [problems],
  )

  return <EChart option={option} height={330} ariaLabel="生态问题严重度与置信度雷达图" />
}
