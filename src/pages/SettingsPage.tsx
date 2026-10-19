import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  CheckCircle2,
  Database,
  FlaskConical,
  Server,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { Badge, Panel } from '../components/ui'
import { WorkspaceShell } from '../components/workspace/WorkspaceShell'
import { PUBLIC_DEMO_ONLY, loadSettings, saveSettings } from '../lib/settings'
import type { ApiSettings } from '../types'
import { cn } from '../lib/cn'

interface HealthPayload {
  ok?: boolean
  hasKey?: boolean
  news?: { provider?: string; configured?: boolean }
}

interface NewsHealthPayload {
  ok?: boolean
  provider?: string
  configured?: boolean
  fallback?: boolean
  rss?: { enabled?: boolean; feeds?: number }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<ApiSettings>(loadSettings)
  const [health, setHealth] = useState<HealthPayload | null>(null)
  const [news, setNews] = useState<NewsHealthPayload | null>(null)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    let alive = true
    fetch('/api/health')
      .then((response) => response.json())
      .then((data: HealthPayload) => {
        if (alive) setHealth(data)
      })
      .catch(() => {
        if (alive) setHealth(null)
      })
    fetch('/api/news/health')
      .then((response) => response.json())
      .then((data: NewsHealthPayload) => {
        if (alive) setNews(data)
      })
      .catch(() => {
        if (alive) setNews(null)
      })
    return () => {
      alive = false
    }
  }, [])

  const difyReady = Boolean(health?.hasKey)
  const newsProvider = news?.provider || health?.news?.provider || 'gdelt'
  const newsReady = Boolean(news?.configured ?? health?.news?.configured)

  return (
    <WorkspaceShell>
      <main className="mx-auto w-full max-w-[1400px] px-4 pb-14 pt-6 md:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-tech-cyan/75">
              <span className="h-px w-6 bg-tech-cyan/50" />
              Workspace Settings
            </div>
            <h1 className="mt-2 font-display text-[28px] font-extrabold leading-tight tracking-wide text-tech-ink md:text-[34px]">
              设置
            </h1>
            <p className="mt-2 max-w-2xl text-[12px] leading-6 text-tech-muted">
              运行模式、资讯源与工作流连接状态。密钥只保存在服务端，浏览器不接触任何 API Key。
            </p>
          </div>
          <Link to="/workspace" className="tech-button">
            返回总览
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Panel bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-tech-ink">
                <FlaskConical className="h-4 w-4 text-tech-cyan" />
                运行模式
              </div>
              {PUBLIC_DEMO_ONLY ? (
                <span className="flex items-center gap-2 rounded-full border border-tech-amber/30 bg-tech-amber/[0.08] px-2.5 py-1.5 text-[10.5px] font-medium text-tech-amber">
                  公开演示版 · 固定
                </span>
              ) : (
                <button
                  type="button"
                  role="switch"
                  aria-checked={!settings.demo}
                  onClick={() => setSettings((prev) => ({ demo: !prev.demo }))}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10.5px] transition hover:border-tech-cyan/35"
                >
                  <span className={cn('font-medium', settings.demo ? 'text-tech-amber' : 'text-tech-green')}>
                    {settings.demo ? '演示模式' : '运行模式'}
                  </span>
                  <span
                    className={cn(
                      'relative h-4 w-8 rounded-full border transition',
                      settings.demo
                        ? 'border-tech-amber/40 bg-tech-amber/20'
                        : 'border-tech-green/40 bg-tech-green/20',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-[2px] h-3 w-3 rounded-full transition-all',
                        settings.demo ? 'left-[2px] bg-tech-amber' : 'left-[16px] bg-tech-green',
                      )}
                    />
                  </span>
                </button>
              )}
            </div>
            <p className="mt-3 text-[11px] leading-6 text-tech-muted">
              {PUBLIC_DEMO_ONLY
                ? '公开演示版固定使用本地样例数据，不会调用 Dify，也不会消耗任何模型额度；界面与报告均标注“演示样例”。'
                : '演示模式使用本地样例结果，并在界面与报告中标注“演示样例”。运行模式会调用服务端代理的 Dify 诊断工作流；未配置 Key 时会返回明确错误。'}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10.5px] text-tech-faint">
              {settings.demo ? (
                <Badge tone="amber">当前：演示样例 · 非真实决策</Badge>
              ) : (
                <Badge tone="good">当前：调用 Dify 工作流</Badge>
              )}
            </div>
          </Panel>

          <Panel bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-tech-ink">
                <Database className="h-4 w-4 text-tech-cyan" />
                资讯源
              </div>
              <Badge tone={newsReady ? 'good' : 'amber'}>{newsReady ? '可用' : '未确认'}</Badge>
            </div>
            <dl className="mt-3 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-tech-faint">当前通道</dt>
                <dd className="font-medium uppercase text-tech-ink">{newsProvider}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-tech-faint">备用源</dt>
                <dd className="text-tech-muted">
                  NewsAPI + 公共 RSS
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-tech-faint">RSS 状态</dt>
                <dd className="text-tech-muted">
                  {news?.rss?.enabled === false
                    ? '已关闭'
                    : `已启用 · ${news?.rss?.feeds ?? 4} 个公共源`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-tech-faint">连接状态</dt>
                <dd className="inline-flex items-center gap-1.5 text-tech-muted">
                  {newsReady ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-tech-green" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-tech-amber" />
                  )}
                  {newsReady ? '代理已就绪' : '请检查 .env 配置'}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-[10.5px] leading-5 text-tech-faint">
              GDELT 无需密钥；官方限流约每 5 秒 1 次。GDELT 失败或返回空结果时，服务端会自动尝试
              NewsAPI（若配置了 NEWS_API_KEY）和公共 RSS 源。
            </p>
          </Panel>

          <Panel bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-tech-ink">
                <Server className="h-4 w-4 text-tech-cyan" />
                Dify 诊断工作流
              </div>
              <Badge tone={difyReady ? 'good' : 'amber'}>
                {difyReady ? '服务端已配置' : '未配置 Key'}
              </Badge>
            </div>
            <p className="mt-3 text-[11px] leading-6 text-tech-muted">
              浏览器只请求 <code className="text-tech-cyan">/api/dify/*</code>，
              由 Vite / Express 服务端注入 <code className="text-tech-cyan">Authorization</code>。
              Key 不会出现在前端源码、localStorage 或网络请求中。
            </p>
            <Link to="/assistant" className="tech-button mt-4">
              进入智能决策
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Panel>

          <Panel bodyClassName="p-5">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-tech-ink">
              <ShieldCheck className="h-4 w-4 text-tech-green" />
              数据边界
            </div>
            <ul className="mt-3 space-y-2 text-[10.5px] leading-5 text-tech-muted">
              <li>· 知识库统计来自本地 KB01–KB06，不是实时环境监测。</li>
              <li>· 1005 条指标记录不等于 1005 个独立工程；451 是去重 case_id。</li>
              <li>· 顶部趋势图与就绪度雷达为界面示意，不是实测时序。</li>
              <li>· 决策结果只作辅助参考，不替代工程设计、环评与政府监测。</li>
            </ul>
          </Panel>
        </div>

        <footer className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[10px] text-tech-faint">
          <span>澜知 · Workspace Settings</span>
          <span className="font-mono">/api/health · /api/news/health</span>
        </footer>
      </main>
    </WorkspaceShell>
  )
}
