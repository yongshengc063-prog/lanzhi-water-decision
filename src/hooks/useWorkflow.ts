import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { INPUT_GROUPS, NODE_META } from '../config'
import { runWorkflow, type DifyEvent } from '../lib/dify'
import { parseDiagnosis, parseTop3 } from '../lib/parse'
import { runMock } from '../lib/mock'
import { PUBLIC_DEMO_ONLY, loadSettings, saveSettings } from '../lib/settings'
import type { ApiSettings, NodeStateMap, RunResult, RunStatus } from '../types'

const DRAFT_KEY = 'lanzhi-input-draft'

// Remove credentials persisted by older builds. The current app never stores a key.
try {
  localStorage.removeItem('aqua-dify-settings')
  localStorage.removeItem('aqua-dify-user')
} catch {
  /* storage may be unavailable */
}

export function loadDraft(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export function saveDraft(values: Record<string, string>) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
  } catch {
    /* storage may be unavailable */
  }
}

export function buildDifyInputs(values: Record<string, string>): Record<string, unknown> {
  const inputs: Record<string, unknown> = {}
  for (const group of INPUT_GROUPS) {
    for (const field of group.fields) {
      const raw = (values[field.key] ?? '').trim()
      if (!raw) continue
      inputs[field.key] = field.type === 'number' ? Number(raw) : raw
    }
  }
  return inputs
}

export function useWorkflow() {
  const [settings, setSettingsState] = useState<ApiSettings>(loadSettings)
  const [status, setStatus] = useState<RunStatus>('idle')
  const [nodeStates, setNodeStates] = useState<NodeStateMap>({})
  const [result, setResult] = useState<RunResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const setSettings = useCallback((next: ApiSettings) => {
    setSettingsState(next)
  }, [])

  const handleEvent = useCallback((event: DifyEvent) => {
    const data = (event as { data?: Record<string, unknown> }).data
    const nodeId = typeof data?.node_id === 'string' ? data.node_id : undefined
    if ((event.event === 'node_started' || event.event === 'node_finished') && nodeId) {
      setNodeStates((prev) => {
        const meta = NODE_META[nodeId]
        const existing = prev[nodeId]
        if (event.event === 'node_started') {
          return {
            ...prev,
            [nodeId]: { status: 'running', title: meta?.title ?? String(data?.title ?? nodeId) },
          }
        }
        const failed = data?.status === 'failed' || data?.status === 'exception'
        return {
          ...prev,
          [nodeId]: {
            status: failed ? 'failed' : 'done',
            title: meta?.title ?? existing?.title ?? String(data?.title ?? nodeId),
            outputs: data?.outputs,
          },
        }
      })
    }
  }, [])

  const run = useCallback(
    async (values: Record<string, string>) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setStatus('running')
      setError(null)
      setResult(null)
      setNodeStates({})

      const inputs = buildDifyInputs(values)
      try {
        let outputs
        // 公开演示版强制走本地样例，绝不向服务端转发 Dify 请求。
        if (settings.demo || PUBLIC_DEMO_ONLY) {
          outputs = await runMock(handleEvent, controller.signal)
        } else {
          outputs = await runWorkflow({
            inputs,
            onEvent: handleEvent,
            signal: controller.signal,
          })
        }
        setNodeStates((prev) => ({
          ...prev,
          start: prev.start ?? { status: 'done', title: NODE_META.start.title },
          end: prev.end ?? { status: 'done', title: NODE_META.end.title },
        }))
        setResult({
          diagnosis: parseDiagnosis(outputs.diagnosis),
          diagnosisRaw: outputs.diagnosis,
          top3: parseTop3(outputs.top3),
          report: outputs.final_report,
        })
        setStatus('succeeded')
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setStatus('idle')
          return
        }
        setError(err instanceof Error ? err.message : '工作流执行失败，请稍后重试。')
        setStatus('failed')
      }
    },
    [handleEvent, settings.demo],
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStatus('idle')
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStatus('idle')
    setNodeStates({})
    setResult(null)
    setError(null)
  }, [])

  const activeNode = useMemo(() => {
    const running = Object.entries(nodeStates).find(([, state]) => state.status === 'running')
    if (running) return running[1].title
    return null
  }, [nodeStates])

  const doneCount = useMemo(
    () => Object.values(nodeStates).filter((state) => state.status === 'done').length,
    [nodeStates],
  )

  return {
    settings,
    setSettings,
    status,
    nodeStates,
    result,
    error,
    activeNode,
    doneCount,
    run,
    stop,
    reset,
  }
}
