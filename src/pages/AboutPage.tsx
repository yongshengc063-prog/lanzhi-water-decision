import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  KeyRound,
  ShieldCheck,
  Waves,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { METHOD_STEPS } from '../data/knowledge'
import { INFORMATION_CLASSES } from '../data/evidence'
import { Badge, Panel, SectionHeading } from '../components/ui'

const ARCHITECTURE = [
  { title: 'React SPA', desc: '结构化表单、流程状态、诊断/评分/报告视图', icon: Waves },
  { title: '服务端代理', desc: '注入 Dify Key、限制频率、转发 SSE；密钥不进入浏览器', icon: ShieldCheck },
  { title: 'Dify Workflow', desc: '17 节点：校验 → 检索 → 诊断 → 评分 → 报告', icon: GitBranch },
  { title: '输出契约', desc: 'final_report / diagnosis / top3，严格按字段渲染', icon: FileText },
]

const REFERENCES = [
  { name: 'Dify Workflow App API', url: 'https://docs.dify.ai/en/api-reference/guides/workflow', note: '服务端调用与流式事件' },
  { name: 'Apache ECharts', url: 'https://echarts.apache.org/', note: '真实 KB05 统计图表' },
  { name: 'EcoGrid Insights', url: 'https://github.com/dev5str/ecogrid-insights', note: '驾驶舱卡片结构参考' },
  { name: 'react-live-avatar', url: 'https://github.com/progarin/react-live-avatar', note: '小澜的 SVG 状态交互参考' },
  { name: 'TerriaJS', url: 'https://github.com/TerriaJS/terriajs', note: 'GIS 图层交互参考，本期只做示意' },
  { name: 'Kepler.gl', url: 'https://github.com/keplergl/kepler.gl', note: '空间数据视觉参考，不伪造坐标' },
]

export function AboutPage() {
  return (
    <AppShell title="项目介绍" subtitle="方法、数据规则与研究边界">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1A365D]/60 p-6 md:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-tech-green/10 blur-3xl" />
        <div className="relative max-w-[760px]">
          <div className="section-kicker">About Lanzhi</div>
          <h2 className="mt-2 text-balance font-display text-[28px] font-extrabold leading-tight tracking-tight text-tech-ink md:text-[36px]">
            澜知不是一个聊天机器人，<br />
            而是一条可核验的决策链路。
          </h2>
          <p className="mt-3 text-[12.5px] leading-6 text-tech-muted">
            平台把已有的 Dify Workflow 包装成结构化调查表单、真实节点进度、诊断/评分可视化和 17 章报告。
            智能体逻辑仍在 Dify 维护；本站不重做水质预测或生态修复算法，也不把推断写成实测。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="cyan">25 项 DSL 输入</Badge>
            <Badge tone="good">真实 KB05 统计</Badge>
            <Badge tone="muted">17 章报告</Badge>
            <Badge tone="muted">服务端 Dify 代理</Badge>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-tech-cyan to-tech-green px-4 py-2 text-[11.5px] font-semibold text-[#04121F]"
            >
              进入智能决策
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] text-tech-ink"
            >
              <Database className="h-3.5 w-3.5 text-tech-green" />
              查看知识资产
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel bodyClassName="p-5">
          <SectionHeading eyebrow="Method" title="从调查到报告" hint="工作流节点在 Dify 中维护；前端只展示可确认的状态。" />
          <div className="mt-4 space-y-0">
            {METHOD_STEPS.map((step, index) => (
              <div key={step.index} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-tech-green/20 bg-tech-green/[0.06] font-mono text-[9.5px] text-tech-green">
                    {step.index}
                  </span>
                  {index < METHOD_STEPS.length - 1 && <span className="my-1 h-full w-px flex-1 bg-white/10" />}
                </div>
                <div className="pb-4">
                  <div className="text-[11.5px] font-semibold text-tech-ink">{step.title}</div>
                  <div className="mt-0.5 text-[10px] leading-4 text-tech-faint">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel bodyClassName="p-5">
          <SectionHeading eyebrow="Architecture" title="调用链与安全边界" hint="API Key 仅保存在服务器环境变量中。" />
          <div className="mt-4 space-y-2">
            {ARCHITECTURE.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-tech-green">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[11px] font-semibold text-tech-ink">{item.title}</div>
                    <div className="mt-0.5 text-[9.5px] leading-4 text-tech-faint">{item.desc}</div>
                  </div>
                  {index < ARCHITECTURE.length - 1 && <span className="ml-auto text-tech-faint">→</span>}
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-tech-green/20 bg-tech-green/[0.05] px-3.5 py-2.5 text-[9.5px] leading-4 text-tech-muted">
            <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tech-green/80" />
            浏览器只请求本站 `/api/dify`；Key 由服务端注入。未配置 Key 时进入明确标注的演示模式。
          </div>
        </Panel>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel bodyClassName="p-5">
          <SectionHeading eyebrow="Evidence" title="四类信息，不混写" hint="报告中必须区分事实、知识库证据、模型预测与专家推断。" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {INFORMATION_CLASSES.map((item, index) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-tech-green/70">0{index + 1}</span>
                  <span className="text-[11px] font-semibold text-tech-ink">{item.label}</span>
                </div>
                <div className="mt-1 text-[9.5px] leading-4 text-tech-faint">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-tech-amber/20 bg-tech-amber/[0.05] px-3.5 py-2.5 text-[9.5px] leading-4 text-tech-amber/90">
            未接入成本库时不得虚构总投资；未接入 ML 效果模型时不得展示“预计去除率 xx%”。
          </div>
        </Panel>

        <Panel bodyClassName="p-5">
          <SectionHeading eyebrow="References" title="方法与实现参考" hint="仅借鉴交互与工程模式，不复制受限资产。" />
          <div className="mt-4 divide-y divide-white/10">
            {REFERENCES.map((reference) => (
              <a
                key={reference.name}
                href={reference.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 py-2.5"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-tech-green/70" />
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-medium text-tech-ink transition group-hover:text-tech-green">
                    {reference.name}
                  </span>
                  <span className="block text-[9px] text-tech-faint">{reference.note}</span>
                </span>
                <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-tech-faint transition group-hover:text-tech-green" />
              </a>
            ))}
          </div>
        </Panel>
      </section>

      <Panel className="mt-4" bodyClassName="p-5">
        <SectionHeading eyebrow="Boundaries" title="研究边界与待联调项" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              title: '知识库绑定',
              text: 'DSL 中检索节点的 dataset_ids 为空，需在 Dify 重新绑定 KB01–KB06 并发布后再实测。',
            },
            {
              title: '真实样例',
              text: '尚未提供已发布 App 的 Key、真实执行记录和脱敏输出；联调前不能宣称线上流程已验证。',
            },
            {
              title: '案例可迁移性',
              text: '案例的证据类型、年份与统计口径不同；不得把案例去除率当作通用成本或工程保证值。',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5">
              <div className="text-[11px] font-semibold text-tech-ink">{item.title}</div>
              <div className="mt-1 text-[9.5px] leading-4 text-tech-faint">{item.text}</div>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  )
}
