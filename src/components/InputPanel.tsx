import { useMemo, useState } from 'react'
import {
  ChevronDown,
  CircleStop,
  FlaskConical,
  Gauge,
  MapPin,
  Play,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  Waves,
} from 'lucide-react'
import { DEMO_INPUTS, INPUT_GROUPS } from '../config'
import { cn } from '../lib/cn'
import type { InputField } from '../types'
import { Meter, Panel } from './ui'

interface InputPanelProps {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onBulkChange: (values: Record<string, string>) => void
  onRun: () => void
  onStop: () => void
  running: boolean
  demo: boolean
  submitError: string | null
}

const GROUP_ICONS = [MapPin, Gauge, Waves, SlidersHorizontal]
const CORE_KEYS = ['TN', 'TP', 'DO', 'COD', 'Chla'] as const
const STEP_LABELS = ['项目', '水质', '生境', '约束', '执行']
const STEP_GROUP: Record<string, string> = {
  项目: 'project',
  水质: 'water',
  生境: 'habitat',
  约束: 'constraint',
}

export function InputPanel({
  values,
  onChange,
  onBulkChange,
  onRun,
  onStop,
  running,
  demo,
  submitError,
}: InputPanelProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    project: true,
    water: true,
    habitat: false,
    constraint: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filled = useMemo(
    () => INPUT_GROUPS.flatMap((group) => group.fields).filter((field) => values[field.key]?.trim()).length,
    [values],
  )
  const total = useMemo(
    () => INPUT_GROUPS.reduce((sum, group) => sum + group.fields.length, 0),
    [],
  )
  const coreFilled = useMemo(
    () => CORE_KEYS.filter((key) => values[key]?.trim()).length,
    [values],
  )

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!values.water_type?.trim()) next.water_type = '水体类型为必填项'
    for (const group of INPUT_GROUPS) {
      for (const field of group.fields) {
        const raw = values[field.key]?.trim()
        if (!raw || field.type !== 'number') continue
        const num = Number(raw)
        if (!Number.isFinite(num)) {
          next[field.key] = '请输入有效数字'
          continue
        }
        if (num < 0) next[field.key] = '数值不能为负'
        if (field.key === 'pH' && (num < 0 || num > 14)) next[field.key] = 'pH 应在 0–14 之间'
        if (['shoreline_hardening', 'aquatic_plant_coverage'].includes(field.key) && num > 100) {
          next[field.key] = '百分比不能超过 100'
        }
      }
    }
    if (coreFilled < 3) {
      next.core = `核心五项至少填写 3 项；当前 ${coreFilled} 项，还需 ${3 - coreFilled} 项（TN / TP / DO / COD / Chla）`
    }
    setErrors(next)
    if (Object.keys(next).length) {
      setOpen((prev) => ({ ...prev, project: true, water: true, habitat: true, constraint: true }))
      return false
    }
    return true
  }

  const submit = () => {
    if (running) return
    if (validate()) onRun()
  }

  const toggle = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <Panel bodyClassName="flex flex-col xl:max-h-[calc(100vh-150px)]">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-tech-cyan/75">
            <span className="h-px w-4 bg-tech-cyan/55" />
            Input Vector
          </div>
          <h2 className="font-display text-[20px] font-semibold tracking-wide text-tech-ink">前期指标输入</h2>
          <p className="mt-1 text-[11.5px] leading-5 text-tech-muted">
            未知指标请留空，系统将标记为“未知”而非默认值。
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-[22px] font-semibold leading-none text-tech-cyan">
            {filled}
            <span className="text-[12px] text-tech-faint">/{total}</span>
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-tech-faint">已填写</div>
        </div>
      </div>

      <div className="px-5 pt-3">
        <Meter value={filled / total} tone="cyan" height="h-1" />
      </div>

      <div className="flex items-center gap-1 px-5 pt-3">
        {STEP_LABELS.map((label, index) => {
          const groupKey = STEP_GROUP[label]
          const isDone = groupKey
            ? open[groupKey] && INPUT_GROUPS.find((group) => group.key === groupKey)?.fields.every((field) => values[field.key]?.trim())
            : coreFilled >= 3
          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === '执行') {
                  document.getElementById('run-decision')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  return
                }
                const key = STEP_GROUP[label]
                setOpen((prev) => ({ ...prev, [key]: true }))
              }}
              className={cn(
                'group flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[9.5px] transition',
                isDone
                  ? 'border-tech-green/25 bg-tech-green/[0.07] text-tech-green'
                  : 'border-white/10 bg-white/[0.02] text-tech-faint hover:border-tech-cyan/30 hover:text-tech-ink',
              )}
            >
              <span
                className={cn(
                  'grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[7.5px] font-semibold',
                  isDone ? 'border-tech-green/40 bg-tech-green/15' : 'border-white/15',
                )}
              >
                {index + 1}
              </span>
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </div>

      <div className="max-h-none flex-1 overflow-visible px-5 py-3 xl:min-h-0 xl:overflow-y-auto">
        {INPUT_GROUPS.map((group, index) => {
          const Icon = GROUP_ICONS[index] ?? Gauge
          const groupFilled = group.fields.filter((field) => values[field.key]?.trim()).length
          const isOpen = open[group.key]
          return (
            <div key={group.key} className="border-b border-white/[0.08] py-1.5 last:border-0">
              <button
                type="button"
                onClick={() => toggle(group.key)}
                className="group flex w-full items-center justify-between gap-2 py-2 text-left"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-md border transition',
                      isOpen
                        ? 'border-tech-cyan/35 bg-tech-cyan/10 text-tech-cyan'
                        : 'border-white/10 bg-white/[0.04] text-tech-faint group-hover:text-tech-muted',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-medium text-tech-ink">
                      {group.title}
                      {group.key === 'water' && (
                        <span className={cn('ml-2 rounded-full border px-1.5 py-0.5 text-[8.5px]', coreFilled >= 3 ? 'border-tech-green/25 text-tech-green' : 'border-tech-amber/30 text-tech-amber')}>
                          核心 {coreFilled}/5
                        </span>
                      )}
                    </span>
                    <span className="block text-[10px] tracking-wide text-tech-faint">{group.hint}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-tech-faint">
                    {groupFilled}/{group.fields.length}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-tech-faint transition-transform',
                      isOpen && 'rotate-180 text-tech-cyan/75',
                    )}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-3 pb-3 pt-1">
                  {group.fields.map((field) => (
                    <FieldControl
                      key={field.key}
                      field={field}
                      value={values[field.key] ?? ''}
                      error={errors[field.key]}
                      onChange={(value) => {
                        onChange(field.key, value)
                        if (errors[field.key] || (errors.core && CORE_KEYS.includes(field.key as (typeof CORE_KEYS)[number]))) {
                          setErrors((prev) => {
                            const next = { ...prev }
                            delete next[field.key]
                            if (CORE_KEYS.includes(field.key as (typeof CORE_KEYS)[number])) delete next.core
                            return next
                          })
                        }
                      }}
                      wide={field.type === 'textarea'}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="border-t border-white/10 bg-[#102544]/85 px-5 py-4">
        {errors.core && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-tech-amber/25 bg-tech-amber/[0.06] px-3 py-2 text-[10.5px] leading-5 text-tech-amber">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{errors.core}</span>
          </div>
        )}
        {submitError && (
          <div className="mb-3 flex items-start gap-2 rounded-md border border-tech-red/25 bg-tech-red/[0.07] px-3 py-2 text-[11.5px] leading-5 text-tech-red">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onBulkChange(DEMO_INPUTS)
              setErrors({})
              setOpen({ project: true, water: true, habitat: true, constraint: true })
            }}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-white/10 px-3 text-[12px] text-tech-muted transition hover:border-tech-amber/35 hover:text-tech-ink"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            载入样例
          </button>

          {running ? (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-tech-red/40 bg-tech-red/10 text-[13px] font-medium text-tech-red transition hover:bg-tech-red/15"
            >
              <CircleStop className="h-4 w-4" />
              终止运行
            </button>
          ) : (
            <button
              id="run-decision"
              type="button"
              onClick={submit}
              className="group relative inline-flex h-10 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl border border-tech-green/35 bg-gradient-to-r from-tech-cyan/20 via-tech-green/10 to-transparent text-[13px] font-semibold tracking-wide text-tech-green transition hover:border-tech-green/60 hover:from-tech-green/20 hover:shadow-neon-cyan"
            >
              <Sparkles className="h-4 w-4" />
              启动生态诊断
              <Play className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-tech-faint">
          <span className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', demo ? 'bg-tech-amber' : 'bg-tech-green')} />
            {demo ? '演示模式：使用内置样例结果' : '直连 Dify 工作流实时计算'}
          </span>
          <span>17 节点 · 6 知识库</span>
        </div>
      </div>
    </Panel>
  )
}

function FieldControl({
  field,
  value,
  error,
  onChange,
  wide,
}: {
  field: InputField
  value: string
  error?: string
  onChange: (value: string) => void
  wide?: boolean
}) {
  return (
    <label className={cn('block', wide ? 'col-span-2' : 'col-span-1')}>
      <span className="field-label">
        <span>
          {field.label}
          {field.required && <span className="ml-1 text-tech-cyan">*</span>}
        </span>
        {field.unit && <span className="font-mono text-[9.5px] text-tech-faint">{field.unit}</span>}
      </span>

      {field.type === 'select' ? (
        <div className="relative">
          <select
            className={cn('field-input appearance-none pr-8', error && 'field-input-invalid')}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">{field.placeholder ?? '请选择'}</option>
            {field.options?.map((option) => (
              <option key={option} value={option} className="bg-[#102544]">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-tech-faint" />
        </div>
      ) : field.type === 'textarea' ? (
        <textarea
          className={cn('field-input min-h-[64px] resize-y', error && 'field-input-invalid')}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <div className="relative">
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            step="any"
            inputMode={field.type === 'number' ? 'decimal' : undefined}
            className={cn('field-input', field.unit && 'pr-12', error && 'field-input-invalid')}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
          {field.unit && (
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9.5px] text-tech-faint">
              {field.unit}
            </span>
          )}
        </div>
      )}

      {error && <span className="mt-1 block text-[10.5px] text-tech-red">{error}</span>}
    </label>
  )
}
