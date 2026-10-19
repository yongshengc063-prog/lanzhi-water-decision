import type { WorkflowOutputs } from '../types'

export interface DifyNodeEventData {
  id?: string
  node_id?: string
  node_type?: string
  title?: string
  status?: string
  outputs?: Record<string, unknown>
  error?: string
}

export type DifyEvent =
  | { event: 'node_started'; data: DifyNodeEventData }
  | { event: 'node_finished'; data: DifyNodeEventData }
  | { event: 'workflow_finished'; data: { status?: string; outputs?: Record<string, unknown>; error?: string } }
  | { event: 'error'; data: { message?: string; code?: string; status?: number } }
  | { event: string; data?: unknown }

export interface RunWorkflowArgs {
  inputs: Record<string, unknown>
  onEvent: (event: DifyEvent) => void
  signal?: AbortSignal
}

/**
 * The browser only talks to our own server. The server proxy injects
 * `Authorization: Bearer <DIFY_API_KEY>`, so the key never reaches the client,
 * localStorage, logs or downloadable reports.
 */
const WORKFLOW_ENDPOINT = '/api/dify/v1/workflows/run'

export async function runWorkflow({
  inputs,
  onEvent,
  signal,
}: RunWorkflowArgs): Promise<WorkflowOutputs> {
  const response = await fetch(WORKFLOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputs,
      response_mode: 'streaming',
      user: getUserId(),
    }),
    signal,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(formatHttpError(response.status, detail))
  }
  if (!response.body) throw new Error('当前浏览器不支持流式响应。')

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let outputs: WorkflowOutputs | null = null

  const consume = (chunk: string) => {
    for (const line of chunk.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      let event: DifyEvent
      try {
        event = JSON.parse(payload) as DifyEvent
      } catch {
        continue
      }
      onEvent(event)
      if (event.event === 'workflow_finished') {
        const data = (event as Extract<DifyEvent, { event: 'workflow_finished' }>).data
        if (data.status && data.status !== 'succeeded') {
          throw new Error(
            friendlyDifyError(data.error || `工作流执行失败：${data.status}`),
          )
        }
        outputs = normalizeOutputs(data.outputs ?? {})
      }
      if (event.event === 'error') {
        const data = (event as Extract<DifyEvent, { event: 'error' }>).data
        throw new Error(friendlyDifyError(data?.message || 'Dify 返回错误。'))
      }
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split(/\r?\n\r?\n/)
    buffer = parts.pop() ?? ''
    for (const part of parts) consume(part)
  }
  if (buffer.trim()) consume(buffer)

  if (!outputs) throw new Error('连接已结束，但未收到 workflow_finished 事件。')
  return outputs
}

function normalizeOutputs(raw: Record<string, unknown>): WorkflowOutputs {
  const report = typeof raw.final_report === 'string' ? raw.final_report : String(raw.final_report ?? '')
  const diagnosis = typeof raw.diagnosis === 'string' ? raw.diagnosis : JSON.stringify(raw.diagnosis ?? '')
  const top3 = Array.isArray(raw.top3) ? raw.top3 : []
  return { final_report: report, diagnosis, top3: top3 as WorkflowOutputs['top3'] }
}

/** Dify 上游错误翻译成用户能直接处理的中文提示。 */
function friendlyDifyError(message: string): string {
  const text = String(message || '')

  if (/quota|insufficient_quota|exceeded|余额|额度/i.test(text)) {
    return 'Dify 模型额度不足：请在 Dify 控制台检查模型供应商（如 OpenAI）的配额/余额，或把工作流中的 LLM 节点切换到有额度的模型后重试。'
  }
  if (/401|unauthorized|invalid api key|authentication/i.test(text)) {
    return 'Dify 鉴权失败：请检查服务端 .env 中的 DIFY_API_KEY 是否正确、是否已发布。'
  }
  if (/not published|workflow.*not.*found|404/i.test(text)) {
    return 'Dify 工作流未发布或接口不可用：请在 Dify 中发布工作流后重试。'
  }
  return text || 'Dify 工作流执行失败，请稍后重试。'
}

function formatHttpError(status: number, detail: string): string {
  let message = detail
  try {
    const parsed = JSON.parse(detail) as { message?: string; code?: string }
    message = parsed.message || parsed.code || detail
  } catch {
    /* keep raw text */
  }
  if (status === 401) return `Dify 鉴权失败（401）。请确认服务端已配置 DIFY_API_KEY。${message}`
  if (status === 404) return `接口不存在（404）。请检查服务端 DIFY_BASE_URL 与工作流发布状态。${message}`
  if (status === 429) return `请求过于频繁（429）。${message}`
  if (status === 502) return `代理无法连接 Dify（502）。请检查服务端环境变量与网络。${message}`
  return `Dify 接口返回 ${status}：${message || '未知错误'}`
}

function getUserId(): string {
  const key = 'lanzhi-dify-user'
  let id = localStorage.getItem(key)
  if (!id) {
    id = `lanzhi-web-${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(key, id)
  }
  return id
}
