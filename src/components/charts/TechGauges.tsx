import { useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import type { HealthDimension } from '../../types'
import { EChart } from './EChart'
import {
  AXIS_TEXT,
  FONT_FAMILY,
  GRID_LINE,
  PRIMARY_TEXT,
  TOOLTIP_STYLE,
} from './theme'

/* ------------------------------------------------------------------
 * 健康度仪表盘
 * ------------------------------------------------------------------ */
export function HealthGauge({ value, height = 156 }: { value: number; height?: number }) {
  const option = useMemo<EChartsOption>(() => {
    const safe = Math.max(0, Math.min(100, Math.round(value)))
    return {
      backgroundColor: 'transparent',
      animationDuration: 900,
      series: [
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          radius: '96%',
          center: ['50%', '62%'],
          progress: {
            show: true,
            width: 12,
            roundCap: true,
            itemStyle: {
              color: '#00F0FF',
              shadowBlur: 14,
              shadowColor: 'rgba(0, 240, 255, 0.6)',
            },
          },
          axisLine: {
            lineStyle: { width: 12, color: [[1, 'rgba(255,255,255,0.08)']] },
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          anchor: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, '4%'],
            formatter: '{value}',
            color: PRIMARY_TEXT,
            fontSize: 30,
            fontWeight: 700,
            fontFamily: 'Manrope, Noto Sans SC, sans-serif',
          },
          data: [{ value: safe }],
        },
      ],
    }
  }, [value])

  return <EChart option={option} height={height} ariaLabel={`水体健康指数 ${Math.round(value)} 分`} />
}

/* ------------------------------------------------------------------
 * 环形指标（严重度 / 置信度）
 * ------------------------------------------------------------------ */
export function MetricRing({
  value,
  label,
  color = '#00F0FF',
  suffix = '%',
  height = 132,
}: {
  value: number
  label: string
  color?: string
  suffix?: string
  height?: number
}) {
  const pct = Math.max(0, Math.min(1, value))
  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 900,
      series: [
        {
          type: 'pie',
          radius: ['70%', '86%'],
          center: ['50%', '50%'],
          startAngle: 90,
          silent: true,
          label: { show: false },
          labelLine: { show: false },
          data: [
            {
              value: Math.round(pct * 100),
              itemStyle: {
                color,
                shadowBlur: 12,
                shadowColor: `${color}66`,
                borderRadius: 8,
              },
            },
            {
              value: Math.max(0, 100 - Math.round(pct * 100)),
              itemStyle: { color: 'rgba(255,255,255,0.07)' },
            },
          ],
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '35%',
          style: {
            text: `${Math.round(pct * 100)}${suffix}`,
            fill: PRIMARY_TEXT,
            font: '700 24px Manrope, Noto Sans SC, sans-serif',
            textAlign: 'center',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '58%',
          style: {
            text: label,
            fill: AXIS_TEXT,
            font: '500 10px Inter, Noto Sans SC, sans-serif',
            textAlign: 'center',
          },
        },
      ],
    }),
    [pct, label, color, suffix],
  )

  return (
    <EChart
      option={option}
      height={height}
      ariaLabel={`${label} ${Math.round(pct * 100)}${suffix}`}
    />
  )
}

/* ------------------------------------------------------------------
 * 数据就绪度雷达（按填写比例，不代表诊断结论）
 * ------------------------------------------------------------------ */
export function ReadinessRadar({
  groups,
}: {
  groups: { name: string; filled: number; total: number }[]
}) {
  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 800,
      tooltip: {
        trigger: 'item',
        ...TOOLTIP_STYLE,
        formatter: (params) => {
          const p = params as { value: number[] }
          return groups
            .map(
              (group, index) =>
                `<div style="display:flex;justify-content:space-between;gap:16px;color:${AXIS_TEXT}">` +
                `<span>${group.name}</span><span style="color:${PRIMARY_TEXT};font-weight:600">${p.value[index]}%</span></div>`,
            )
            .join('')
        },
      },
      radar: {
        center: ['50%', '52%'],
        radius: '64%',
        splitNumber: 4,
        indicator: groups.map((group) => ({ name: group.name, max: 100 })),
        axisName: { color: '#C3D6E3', fontSize: 11, fontFamily: FONT_FAMILY },
        axisLine: { lineStyle: { color: 'rgba(0,240,255,0.14)' } },
        splitLine: { lineStyle: { color: 'rgba(0,240,255,0.12)' } },
        splitArea: {
          areaStyle: { color: ['rgba(26,54,93,0.25)', 'rgba(26,54,93,0.5)'] },
        },
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 5,
          data: [
            {
              name: '数据完整度',
              value: groups.map((group) => Math.round((group.filled / Math.max(1, group.total)) * 100)),
              lineStyle: { width: 2, color: '#00F0FF' },
              itemStyle: { color: '#00F0FF', borderColor: '#1A365D', borderWidth: 2 },
              areaStyle: { color: '#00F0FF', opacity: 0.16 },
            },
          ],
        },
      ],
    }),
    [groups],
  )

  return <EChart option={option} height={250} ariaLabel="调查字段数据就绪度雷达图" />
}

/* ------------------------------------------------------------------
 * 健康度维度雷达
 * 数据来源：Dify diagnosis.health_dimensions（0–100，越高越健康）
 * 缺失时 DiagnosisView 会回退到问题严重度雷达。
 * ------------------------------------------------------------------ */
export function HealthRadar({ dimensions }: { dimensions: HealthDimension[] }) {
  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 850,
      tooltip: {
        trigger: 'item',
        ...TOOLTIP_STYLE,
        formatter: () => {
          return dimensions
            .map(
              (item) =>
                `<div style="display:flex;justify-content:space-between;gap:18px;color:${AXIS_TEXT}">` +
                `<span>${item.dimension}</span>` +
                `<span style="color:${PRIMARY_TEXT};font-weight:600">${Math.round(item.score)}</span></div>`,
            )
            .join('')
        },
      },
      radar: {
        center: ['50%', '54%'],
        radius: '64%',
        splitNumber: 4,
        indicator: dimensions.map((item) => ({ name: item.dimension, max: 100 })),
        axisName: { color: '#C3D6E3', fontSize: 11, fontFamily: FONT_FAMILY },
        axisLine: { lineStyle: { color: 'rgba(0,240,255,0.15)' } },
        splitLine: { lineStyle: { color: 'rgba(0,240,255,0.12)' } },
        splitArea: {
          areaStyle: { color: ['rgba(26,54,93,0.22)', 'rgba(26,54,93,0.48)'] },
        },
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 5,
          data: [
            {
              name: '水体健康度',
              value: dimensions.map((item) => Math.round(item.score)),
              lineStyle: { width: 2, color: '#00F0FF', shadowBlur: 12, shadowColor: 'rgba(0,240,255,0.45)' },
              itemStyle: { color: '#00F0FF', borderColor: '#1A365D', borderWidth: 2 },
              areaStyle: {
                color: '#00F0FF',
                opacity: 0.16,
              },
            },
          ],
        },
      ],
    }),
    [dimensions],
  )

  return <EChart option={option} height={330} ariaLabel="水体健康度维度雷达图" />
}

/* ------------------------------------------------------------------
 * 顶部迷你仪表盘
 * ------------------------------------------------------------------ */
export function MiniGauge({
  label,
  value,
  min = 0,
  max = 100,
  unit = '',
  decimals = 1,
  color = '#00F0FF',
  height = 128,
}: {
  label: string
  value: number | null
  min?: number
  max?: number
  unit?: string
  decimals?: number
  color?: string
  height?: number
}) {
  const option = useMemo<EChartsOption>(() => {
    const safe = value === null ? min : Math.max(min, Math.min(max, value))
    const text = value === null ? '—' : `${value.toFixed(decimals)}${unit}`
    return {
      backgroundColor: 'transparent',
      animationDuration: 900,
      series: [
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min,
          max,
          radius: '100%',
          center: ['50%', '58%'],
          progress: {
            show: true,
            width: 8,
            roundCap: true,
            itemStyle: {
              color,
              shadowBlur: 12,
              shadowColor: `${color}80`,
            },
          },
          axisLine: {
            lineStyle: { width: 8, color: [[1, 'rgba(255,255,255,0.08)']] },
          },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          anchor: { show: false },
          title: {
            offsetCenter: [0, '34%'],
            color: AXIS_TEXT,
            fontSize: 10,
            fontFamily: FONT_FAMILY,
          },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, '-2%'],
            formatter: () => text,
            color: PRIMARY_TEXT,
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'Manrope, Noto Sans SC, sans-serif',
          },
          data: [{ value: safe, name: label }],
        },
      ],
    }
  }, [label, value, min, max, unit, decimals, color])

  return <EChart option={option} height={height} ariaLabel={`${label} ${value ?? '未填写'}`} />
}

/* ------------------------------------------------------------------
 * 近期趋势
 * 说明：知识库不提供具体水体的历史时序，因此这里以“本次录入值”
 * 为终点，按典型变化幅度生成交互示意，并在界面上明确标注非实测。
 * ------------------------------------------------------------------ */
const LABELS = ['T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', '本次']

const POLLUTANT_FACTORS = [1.2, 1.12, 1.16, 1.05, 1.09, 1.02, 1]
const OXYGEN_FACTORS = [0.74, 0.82, 0.79, 0.88, 0.86, 0.94, 1]

function numeric(value: string | undefined): number | null {
  if (!value?.trim()) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export interface TrendSeries {
  name: string
  color: string
  data: number[]
}

export function buildTrendSeries(values: Record<string, string>): TrendSeries[] {
  const list: TrendSeries[] = []
  const cod = numeric(values.COD)
  const doValue = numeric(values.DO)
  const ammonia = numeric(values.NH3_N)

  if (cod !== null) {
    list.push({
      name: 'COD',
      color: '#3BA9FF',
      data: POLLUTANT_FACTORS.map((factor, index) =>
        Number((cod * factor + Math.sin(index * 1.7) * cod * 0.02).toFixed(2)),
      ),
    })
  }
  if (ammonia !== null) {
    list.push({
      name: '氨氮 NH₃-N',
      color: '#FFC24B',
      data: POLLUTANT_FACTORS.map((factor, index) =>
        Number((ammonia * factor + Math.sin(index * 2.1) * ammonia * 0.03).toFixed(3)),
      ),
    })
  }
  if (doValue !== null) {
    list.push({
      name: '溶解氧 DO',
      color: '#00FF88',
      data: OXYGEN_FACTORS.map((factor, index) =>
        Number((doValue * factor + Math.sin(index * 1.3) * doValue * 0.03).toFixed(2)),
      ),
    })
  }
  return list
}

export function SparkLine({
  values,
  height = 128,
}: {
  values: Record<string, string>
  height?: number
}) {
  const series = useMemo(() => buildTrendSeries(values), [values.COD, values.DO, values.NH3_N])

  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 800,
      grid: { top: 12, right: 8, bottom: 8, left: 8 },
      tooltip: {
        trigger: 'axis',
        ...TOOLTIP_STYLE,
        axisPointer: { type: 'line', lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: LABELS,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
      },
      yAxis: { type: 'value', show: false, scale: true },
      series: series.map((item) => ({
        name: item.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: item.data,
        lineStyle: { width: 2, color: item.color, shadowBlur: 8, shadowColor: `${item.color}55` },
        areaStyle: {
          opacity: 1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${item.color}30` },
              { offset: 1, color: `${item.color}00` },
            ],
          },
        },
      })),
    }),
    [series],
  )

  if (series.length === 0) {
    return (
      <div
        className="grid place-items-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-[10.5px] text-tech-faint"
        style={{ height }}
      >
        填写 COD / DO 后生成趋势
      </div>
    )
  }

  return <EChart option={option} height={height} ariaLabel="顶部水质趋势缩略折线图" />
}

export function TrendChart({ values }: { values: Record<string, string> }) {
  const series = useMemo(() => buildTrendSeries(values), [values.COD, values.DO, values.NH3_N])

  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 800,
      grid: { top: 34, right: 16, bottom: 22, left: 44 },
      tooltip: {
        trigger: 'axis',
        ...TOOLTIP_STYLE,
        axisPointer: { type: 'line', lineStyle: { color: 'rgba(0,240,255,0.35)' } },
      },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: AXIS_TEXT, fontSize: 10.5, fontFamily: FONT_FAMILY },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: LABELS,
        axisLine: { lineStyle: { color: 'rgba(0,240,255,0.16)' } },
        axisTick: { show: false },
        axisLabel: { color: AXIS_TEXT, fontSize: 10, fontFamily: FONT_FAMILY },
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: GRID_LINE } },
        axisLabel: { color: AXIS_TEXT, fontSize: 10, fontFamily: FONT_FAMILY },
      },
      series: series.map((item) => ({
        name: item.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: item.data,
        lineStyle: { width: 2, color: item.color, shadowBlur: 10, shadowColor: `${item.color}55` },
        itemStyle: { color: item.color, borderColor: '#1A365D', borderWidth: 2 },
        areaStyle: {
          opacity: 1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${item.color}30` },
              { offset: 1, color: `${item.color}00` },
            ],
          },
        },
      })),
    }),
    [series],
  )

  if (series.length === 0) {
    return (
      <div className="grid h-[240px] place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-5 text-center text-[11.5px] leading-5 text-tech-faint">
        填写 COD、溶解氧或氨氮后，可生成近期变化趋势示意。
        <br />
        <span className="text-[10.5px]">缺失指标不会被自动补 0。</span>
      </div>
    )
  }

  return <EChart option={option} height={240} ariaLabel="近期水质变化趋势示意折线图" />
}
