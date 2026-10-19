import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, ShieldCheck, Waves } from 'lucide-react'

const COLUMNS = [
  {
    title: '资讯门户',
    links: [
      { label: '全球水质资讯', to: '/#news' },
      { label: '治理技术', to: '/#technology' },
      { label: '系统介绍', to: '/#about' },
    ],
  },
  {
    title: '专业系统',
    links: [
      { label: '知识工作仓', to: '/workspace' },
      { label: '决策控制台', to: '/assistant' },
      { label: '知识资产概览', to: '/knowledge' },
      { label: '真实修复案例', to: '/cases' },
    ],
  },
  {
    title: '方法与边界',
    links: [
      { label: '项目技术介绍', to: '/about' },
      { label: '决策流程', to: '/about' },
      { label: '知识库', to: '/knowledge' },
    ],
  },
]

export function PortalFooter() {
  return (
    <footer className="mt-16 border-t border-portal-line bg-white">
      <div className="portal-container py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,minmax(0,0.7fr))]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-portal-brand to-portal-leaf text-white">
                <Waves className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-[19px] font-extrabold text-portal-ink">
                  澜知 <span className="text-[11px] font-medium tracking-[0.2em] text-portal-muted">LANZHI</span>
                </div>
                <div className="text-[11px] text-portal-muted">守护每一滴碧水</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[12.5px] leading-6 text-portal-body">
              以真实全球水质资讯为入口，连接知识库、生态诊断、技术比选与决策报告。
              平台面向科研演示与辅助决策，不替代工程设计、环评或政府监测结论。
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-portal-line bg-portal-mist px-3.5 py-1.5 text-[11px] text-portal-body">
              <ShieldCheck className="h-3.5 w-3.5 text-portal-leaf" />
              资讯版权归原媒体所有
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-portal-ink">
                {column.title}
              </div>
              <ul className="mt-3.5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-[12.5px] text-portal-body transition hover:text-portal-brand"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-portal-line pt-6 text-[11px] text-portal-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} 澜知 · 水域生态修复智能决策系统 · 科研演示版</span>
          <span className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              科研演示 · 不提供对外服务
            </span>
            <span className="h-3 w-px bg-portal-line" />
            <span>数据仅作辅助决策</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
