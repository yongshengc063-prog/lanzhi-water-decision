import type { ApiSettings } from '../types'

// v2：切换默认运行模式，避免旧版本持久化的“演示模式”覆盖新配置。
export const SETTINGS_KEY = 'lanzhi-settings-v2'

/**
 * 公开部署只提供演示模式：构建时设置 VITE_PUBLIC_DEMO_ONLY=true。
 * 这样即使访客在浏览器里篡改 localStorage，也不会向服务端发起 Dify 调用。
 * 本地开发 / 私有部署不设置该变量，仍保留运行模式。
 */
export const PUBLIC_DEMO_ONLY = import.meta.env.VITE_PUBLIC_DEMO_ONLY === 'true'

// 已配置真实 Dify 工作流时，默认进入运行模式；未配置 Key 时会给出明确错误，
// 用户仍可在顶部/设置页切换回演示模式。
export const DEFAULT_SETTINGS: ApiSettings = { demo: PUBLIC_DEMO_ONLY }

export function loadSettings(): ApiSettings {
  if (PUBLIC_DEMO_ONLY) return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<ApiSettings>
    return { demo: parsed.demo ?? false }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: ApiSettings) {
  // 公开演示版不持久化模式切换，始终保持 demo=true。
  if (PUBLIC_DEMO_ONLY) return
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* storage may be unavailable */
  }
}
