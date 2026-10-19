import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import type { Kb05Datum } from '../../data/kb05'
import { EVIDENCE_TYPES } from '../../data/evidence'
import { EChart } from './EChart'
import {
  AXIS_TEXT,
  CATEGORICAL_5,
  CHART_COLORS,
  FONT_FAMILY,
  GRID_LINE,
  PRIMARY_TEXT,
  TOOLTIP_STYLE,
} from './theme'

export function WaterTypeBar({ data }: { data: Kb05Datum[] }) {
  const option = useMemo<EChartsOption>(() => {
    const ordered = [...data].sort((a, b) => a.value - b.value)
    return {
      backgroundColor: 'transparent',
      animationDuration: 700,
      grid: { top: 8, right: 46, bottom: 6, left: 4, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(57,151,230,0.06)' } },
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const p = (params as unknown as { name: string; value: number }[])[0]
          return `<b>${p.name}</b><br/><span style="color:${AXIS_TEXT}">指标记录</span> <b>${p.value}</b> 条`
        },
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: GRID_LINE } },
        axisLabel: { color: AXIS_TEXT, fontSize: 10, fontFamily: FONT_FAMILY },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: ordered.map((item) => item.name),
        axisLabel: {
          color: '#C3D6E3',
          fontSize: 10.5,
          fontFamily: FONT_FAMILY,
          width: 122,
          overflow: 'truncate',
        },
        axisLine: { lineStyle: { color: 'rgba(125,211,252,0.14)' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: ordered.map((item) => item.value),
          barWidth: 13,
          showBackground: true,
          backgroundStyle: { color: 'rgba(255,255,255,0.035)', borderRadius: 4 },
          itemStyle: { color: CHART_COLORS[0], borderRadius: [0, 4, 4, 0] },
          label: {
            show: true,
            position: 'right',
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            fontWeight: 600,
          },
        },
      ],
    }
  }, [data])

  return <EChart option={option} height={320} ariaLabel="KB05 按水体类型划分的指标记录数条形图" />
}

export function EvidenceDonut({ data }: { data: Kb05Datum[] }) {
  const option = useMemo<EChartsOption>(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const ordered = EVIDENCE_TYPES.map((definition) => {
      const match = data.find((item) => item.name === definition.code)
      return {
        name: definition.code === '未标注' ? '未标注' : `${definition.code} · ${definition.name}`,
        value: match?.value ?? 0,
        itemStyle: { color: definition.color },
      }
    })
    return {
      backgroundColor: 'transparent',
      animationDuration: 800,
      tooltip: {
        trigger: 'item',
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const p = params as unknown as { name: string; value: number; percent: number }
          const code = p.name.slice(0, 1)
          const definition = EVIDENCE_TYPES.find((item) => item.code === code)
          return [
            `<b>${p.name}</b>`,
            `<div style="color:${AXIS_TEXT};margin-top:3px">${p.value} 条 · ${p.percent}%</div>`,
            definition ? `<div style="max-width:240px;color:${AXIS_TEXT};font-size:10.5px;margin-top:5px;line-height:1.6">${definition.boundary}</div>` : '',
          ].join('')
        },
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: AXIS_TEXT, fontSize: 10, fontFamily: FONT_FAMILY },
        pageTextStyle: { color: AXIS_TEXT },
      },
      series: [
        {
          type: 'pie',
          radius: ['48%', '72%'],
          center: ['50%', '43%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: '#1A365D', borderWidth: 2 },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            color: '#C3D6E3',
            fontSize: 10,
            lineHeight: 15,
            fontFamily: FONT_FAMILY,
          },
          labelLine: { length: 8, length2: 8, lineStyle: { color: 'rgba(125,211,252,0.25)' } },
          data: ordered,
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '36%',
          style: {
            text: `${total}`,
            fill: PRIMARY_TEXT,
            fontSize: 24,
            fontWeight: 700,
            fontFamily: 'Manrope, Inter, sans-serif',
            textAlign: 'center',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '44%',
          style: {
            text: '条指标记录',
            fill: AXIS_TEXT,
            fontSize: 9.5,
            fontFamily: FONT_FAMILY,
            textAlign: 'center',
          },
        },
      ],
    }
  }, [data])

  return <EChart option={option} height={320} ariaLabel="KB05 证据类型构成环形图" />
}

export function SourceTypeBar({ data }: { data: Kb05Datum[] }) {
  const option = useMemo<EChartsOption>(() => {
    const ordered = [...data].sort((a, b) => a.value - b.value)
    return {
      backgroundColor: 'transparent',
      animationDuration: 700,
      grid: { top: 8, right: 40, bottom: 6, left: 4, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(54,200,185,0.06)' } },
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const p = (params as unknown as { name: string; value: number }[])[0]
          return `<b>${p.name}</b><br/><span style="color:${AXIS_TEXT}">指标记录</span> <b>${p.value}</b> 条`
        },
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: GRID_LINE } },
        axisLabel: { color: AXIS_TEXT, fontSize: 10, fontFamily: FONT_FAMILY },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: ordered.map((item) => item.name),
        axisLabel: { color: '#C3D6E3', fontSize: 11, fontFamily: FONT_FAMILY },
        axisLine: { lineStyle: { color: 'rgba(125,211,252,0.14)' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: ordered.map((item) => item.value),
          barWidth: 14,
          showBackground: true,
          backgroundStyle: { color: 'rgba(255,255,255,0.035)', borderRadius: 4 },
          itemStyle: { color: CHART_COLORS[1], borderRadius: [0, 4, 4, 0] },
          label: {
            show: true,
            position: 'right',
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            fontWeight: 600,
          },
        },
      ],
    }
  }, [data])

  return <EChart option={option} height={250} ariaLabel="KB05 资料来源类型水平柱状图" />
}

export function IndicatorBar({ data }: { data: Kb05Datum[] }) {
  const option = useMemo<EChartsOption>(() => {
    const ordered = [...data].slice(0, 10).sort((a, b) => a.value - b.value)
    return {
      backgroundColor: 'transparent',
      animationDuration: 700,
      grid: { top: 8, right: 40, bottom: 6, left: 4, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(201,133,0,0.06)' } },
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const p = (params as unknown as { name: string; value: number }[])[0]
          return `<b>${p.name}</b><br/><span style="color:${AXIS_TEXT}">出现记录</span> <b>${p.value}</b> 条`
        },
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: GRID_LINE } },
        axisLabel: { color: AXIS_TEXT, fontSize: 10, fontFamily: FONT_FAMILY },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: ordered.map((item) => item.name),
        axisLabel: {
          color: '#C3D6E3',
          fontSize: 10.5,
          fontFamily: FONT_FAMILY,
          width: 112,
          overflow: 'truncate',
        },
        axisLine: { lineStyle: { color: 'rgba(125,211,252,0.14)' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: ordered.map((item) => item.value),
          barWidth: 12,
          showBackground: true,
          backgroundStyle: { color: 'rgba(255,255,255,0.035)', borderRadius: 4 },
          itemStyle: { color: CATEGORICAL_5[3], borderRadius: [0, 4, 4, 0] },
          label: {
            show: true,
            position: 'right',
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY,
            fontSize: 11,
            fontWeight: 600,
          },
        },
      ],
    }
  }, [data])

  return <EChart option={option} height={330} ariaLabel="KB05 高频监测指标 Top 10 条形图" />
}
