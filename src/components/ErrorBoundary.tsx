import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, Waves } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('LANZHI render error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="grid min-h-screen place-items-center bg-[#0B192C] px-5">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#102544] p-8 text-center shadow-panel">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-tech-cyan to-tech-green text-white">
            <Waves className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-[20px] font-bold text-tech-ink">界面加载遇到问题</h1>
          <p className="mt-2 text-[12px] leading-6 text-tech-muted">
            某个可视化组件渲染失败，其他功能不受影响。你可以刷新页面，或返回驾驶舱重新进入。
          </p>
          <pre className="mt-3 max-h-24 overflow-auto rounded-xl bg-[#0B192C] p-3 text-left font-mono text-[10px] leading-5 text-tech-faint">
            {this.state.message}
          </pre>
          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 rounded-full bg-tech-cyan px-4 py-2 text-[12px] font-semibold text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              刷新页面
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="rounded-full border border-white/10 px-4 py-2 text-[12px] font-medium text-tech-ink"
            >
              返回驾驶舱
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
