import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export interface AppShellProps {
  title: string
  subtitle: string
  actions?: ReactNode
  children: ReactNode
  wide?: boolean
}

export function AppShell({ title, subtitle, actions, children, wide = false }: AppShellProps) {
  return (
    <div className="app-bg min-h-screen">
      <Sidebar />
      <div className="lg:pl-[72px]">
        <Topbar title={title} subtitle={subtitle} actions={actions} />
        <main
          className={
            wide
              ? 'mx-auto w-full max-w-[1800px] px-3 pb-16 pt-5 md:px-5'
              : 'mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 md:px-7'
          }
        >
          {children}
        </main>
        <footer className="border-t border-white/10 px-4 py-5 text-center text-[10px] text-tech-faint lg:px-8">
          澜知 · 水生态修复智能决策平台 · 数据来自本地知识库，非实时环境监测；演示数据不构成工程或投资依据。
        </footer>
      </div>
    </div>
  )
}
