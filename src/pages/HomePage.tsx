import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  Globe2,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react'
import { PortalHeader } from '../components/portal/PortalHeader'
import { PortalFooter } from '../components/portal/PortalFooter'
import { HeroScene } from '../components/portal/HeroScene'
import { NewsSection } from '../components/portal/NewsSection'
import { WaterSprite } from '../components/mascot/WaterSprite'
import { TECH_CARDS, type TechCard } from '../data/portal'
import { cn } from '../lib/cn'

const QUICK_SEARCHES = ['river restoration', 'water quality', 'wetland', 'algae bloom']

const STEPS = [
  { index: '01', title: '调查输入', desc: '水质、生境与工程约束结构化录入' },
  { index: '02', title: '知识检索', desc: 'KB01–KB06 证据召回与质量门校验' },
  { index: '03', title: '生态诊断', desc: '问题识别、严重度与置信度评估' },
  { index: '04', title: '技术比选', desc: '七维评分筛选 Top 3 修复方案' },
  { index: '05', title: '方案评分', desc: '组合推荐与工程约束校核' },
  { index: '06', title: '报告生成', desc: '17 章可追溯报告与导出' },
]

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [heroInput, setHeroInput] = useState(query)

  useEffect(() => {
    setHeroInput(query)
  }, [query])

  const runSearch = (value: string) => {
    const next = new URLSearchParams(searchParams)
    const trimmed = value.trim()
    if (trimmed) next.set('q', trimmed)
    else next.delete('q')
    setSearchParams(next, { replace: false })
    window.requestAnimationFrame(() => {
      document.getElementById('news')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const submitHero = (event: React.FormEvent) => {
    event.preventDefault()
    runSearch(heroInput)
  }

  return (
    <div className="portal-shell min-h-screen">
      <PortalHeader />

      {/* ================= Hero ================= */}
      <section className="relative pt-5 md:pt-7">
        <div className="portal-container">
          <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[#E7F6FB] shadow-portal-lg">
            <HeroScene className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(247,252,254,0.985)_0%,rgba(247,252,254,0.94)_28%,rgba(247,252,254,0.44)_48%,rgba(247,252,254,0.08)_64%,rgba(247,252,254,0)_80%)]" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-portal-leaf/10 blur-3xl" />

            <div className="relative z-10 flex min-h-[500px] max-w-[660px] flex-col justify-center px-6 py-12 md:min-h-[540px] md:px-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-portal-brand/20 bg-white/75 px-3.5 py-1.5 text-[11px] font-semibold text-portal-brandDeep shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-portal-leaf opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-portal-leaf" />
                </span>
                水域生态修复智能决策系统
              </div>

              <h1 className="mt-5 font-serif text-[44px] font-bold leading-[1.18] tracking-[-0.02em] text-portal-ink sm:text-[56px] md:text-[64px]">
                守护每一滴
                <span className="relative ml-1 inline-block text-portal-brand">
                  碧水
                  <svg
                    viewBox="0 0 120 12"
                    className="absolute -bottom-1 left-0 h-2.5 w-full text-portal-leaf/60"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8 C24 2 42 10 60 6 C80 2 100 8 118 4"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-5 max-w-[520px] text-[13.5px] leading-7 text-portal-body md:text-[14.5px]">
                聚合全球水质资讯与水域生态知识，从调查指标、证据检索到生态诊断与技术比选，
                为每一条河流生成可追溯、可解释的修复决策。
              </p>

              <form onSubmit={submitHero} className="mt-7 w-full max-w-[560px]">
                <div className="flex items-center rounded-full border border-white/80 bg-white/95 p-1.5 shadow-portal backdrop-blur">
                  <Search className="ml-3 h-4 w-4 shrink-0 text-portal-muted" />
                  <input
                    value={heroInput}
                    onChange={(event) => setHeroInput(event.target.value)}
                    placeholder="搜索全球水质资讯、修复案例或治理技术…"
                    aria-label="搜索全球水质资讯"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[13px] text-portal-ink outline-none placeholder:text-portal-muted"
                  />
                  <button
                    type="submit"
                    className="hidden h-9 shrink-0 items-center gap-1.5 rounded-full bg-portal-brand px-4 text-[12.5px] font-semibold text-white transition hover:bg-portal-brandDeep sm:flex"
                  >
                    检索资讯
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="submit"
                    aria-label="检索资讯"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-portal-brand text-white sm:hidden"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-portal-muted">热门检索</span>
                {QUICK_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setHeroInput(item)
                      runSearch(item)
                    }}
                    className="rounded-full border border-white/90 bg-white/65 px-2.5 py-1 text-[11px] text-portal-body backdrop-blur transition hover:border-portal-brand/35 hover:text-portal-brand"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] text-portal-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-portal-brand" />
                  全球水质资讯
                </span>
                <span className="h-3 w-px bg-portal-line" />
                <span className="inline-flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-portal-leaf" />
                  知识增强诊断
                </span>
                <span className="h-3 w-px bg-portal-line" />
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-portal-brand" />
                  专业资讯 · 持续更新
                </span>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 z-10 hidden w-[250px] rounded-2xl border border-white/70 bg-white/85 p-4 shadow-portal backdrop-blur-xl lg:block">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-portal-muted">
                <Sparkles className="h-3.5 w-3.5 text-portal-brand" />
                小澜 · AI 决策入口
              </div>
              <div className="mt-2 font-display text-[15px] font-bold leading-6 text-portal-ink">
                从一条资讯，
                <br />
                走向一份修复决策。
              </div>
              <Link
                to="/workspace"
                className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-portal-brand transition hover:gap-2"
              >
                打开工作仓
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-portal-muted">
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-portal-brand" />
              全球水质资讯 · 每日更新
            </span>
            <span className="hidden h-3 w-px bg-portal-line sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <Library className="h-3.5 w-3.5 text-portal-leaf" />
              治理技术与真实案例可追溯
            </span>
            <span className="hidden h-3 w-px bg-portal-line sm:block" />
            <span>辅助决策 · 不替代工程设计</span>
          </div>
        </div>
      </section>

      {/* ================= 资讯 ================= */}
      <div className="portal-container">
        <NewsSection query={query} onSearch={runSearch} />
      </div>

      {/* ================= 治理技术 ================= */}
      <section id="technology" className="scroll-mt-24 py-8 md:py-10">
        <div className="portal-container">
          <div className="relative overflow-hidden rounded-[30px] border border-portal-line bg-[linear-gradient(135deg,#F8FCFE_0%,#EAF7FB_46%,#ECF9F2_100%)] px-6 py-9 shadow-portal md:px-10 md:py-11">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-portal-leaf/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="portal-eyebrow">
                  <span className="h-px w-6 bg-portal-leaf/60" />
                  Restoration Technologies
                </div>
                <h2 className="mt-3 font-display text-[30px] font-extrabold leading-tight text-portal-ink md:text-[36px]">
                  治理技术
                </h2>
                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-portal-body">
                  围绕水质净化、生境重建、底泥治理与水动力改善，知识库沉淀了可检索的技术族、
                  适用条件、工程参数与真实案例证据。
                </p>
              </div>
              <Link
                to="/workspace"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-portal-brand px-4 text-[12.5px] font-semibold text-white shadow-portal transition hover:-translate-y-0.5 hover:bg-portal-brandDeep"
              >
                让系统为我比选技术
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="relative mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {TECH_CARDS.map((card) => (
                <TechCardView key={card.title} card={card} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 系统介绍 ================= */}
      <section id="about" className="scroll-mt-24 py-8 md:py-10">
        <div className="portal-container">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#075E86] via-[#0B7EA8] to-[#1793B5] px-6 py-10 text-white shadow-portal-lg md:px-12 md:py-12">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/15" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_220px_at_88%_8%,rgba(255,255,255,0.18),transparent_70%)]" />

            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                  About LanZhi
                </div>
                <h2 className="mt-3 font-display text-[30px] font-extrabold leading-tight text-white md:text-[36px]">
                  从全球资讯，到一条河的决策
                </h2>
                <p className="mt-3 text-[13px] leading-7 text-white/80">
                  澜知不是又一个水质监测大屏。我们把公开资讯、水生态知识与结构化流程放在同一条链路上：
                  先理解全球正在发生什么，再回到具体水体的调查数据，形成可追溯的诊断与修复建议。
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    ['全球资讯', '汇聚全球公开报道，点击卡片前往原媒体阅读。'],
                    ['证据边界', '事实、知识库证据与模型推断分别标注，不把推断写成实测。'],
                    ['辅助决策', '输出不替代工程设计、环评与政府监测结论。'],
                  ].map(([title, desc]) => (
                    <li key={title} className="flex gap-3">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/15 text-white">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <div className="text-[12.5px] font-semibold text-white">{title}</div>
                        <div className="mt-0.5 text-[11.5px] leading-5 text-white/70">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl md:p-6">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
                    Decision Pipeline
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] text-white/75">
                    决策流程
                  </span>
                </div>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {STEPS.map((step) => (
                    <div
                      key={step.index}
                      className="group flex gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 transition hover:border-white/35 hover:bg-white/[0.12]"
                    >
                      <span className="font-mono text-[10.5px] font-semibold text-white/55">
                        {step.index}
                      </span>
                      <div>
                        <div className="text-[12px] font-semibold text-white">{step.title}</div>
                        <div className="mt-0.5 text-[10.5px] leading-4 text-white/65">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-[12.5px] font-semibold text-white">已经有调查数据？</div>
                    <div className="mt-0.5 text-[11px] text-white/75">在小澜工作仓运行完整诊断流程。</div>
                  </div>
                  <Link
                    to="/workspace"
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-[12px] font-bold text-portal-brandDeep transition hover:bg-portal-brandSoft"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    进入工作仓
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-8 md:py-10">
        <div className="portal-container">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0B7EA8] via-[#0E8FA8] to-[#1FA971] px-7 py-12 text-white shadow-portal-lg md:px-14 md:py-16">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(440px_220px_at_88%_10%,rgba(255,255,255,0.35),transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/20" />
            <div className="pointer-events-none absolute -bottom-32 -left-6 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                  Water Ecology Decision Intelligence
                </div>
                <h2 className="mt-3 font-serif text-[30px] font-bold leading-tight md:text-[40px]">
                  让每一次修复，都有证据可循。
                </h2>
                <p className="mt-3 max-w-2xl text-[13px] leading-7 text-white/85">
                  录入水质、生境与工程约束，小澜会完成数据校验、知识检索、生态诊断、技术比选，
                  并生成带证据边界的 17 章决策报告。
                </p>
              </div>
              <Link
                to="/workspace"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-[13.5px] font-bold text-portal-brandDeep shadow-lg transition hover:-translate-y-0.5 hover:bg-portal-brandSoft"
              >
                <Waves className="h-4 w-4" />
                打开智能决策工作仓
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PortalFooter />
      <WaterSprite />
    </div>
  )
}

function TechCardView({ card }: { card: TechCard }) {
  const Icon = card.icon
  const accents: Record<TechCard['accent'], { icon: string; bar: string; soft: string }> = {
    water: { icon: 'text-portal-water', bar: 'from-portal-water/70', soft: 'bg-[#E7F6FB]' },
    leaf: { icon: 'text-portal-leafDeep', bar: 'from-portal-leaf/70', soft: 'bg-portal-leafSoft' },
    cyan: { icon: 'text-[#1389A8]', bar: 'from-[#3BBFD8]/70', soft: 'bg-[#E6F8FB]' },
    gold: { icon: 'text-portal-gold', bar: 'from-portal-gold/60', soft: 'bg-[#FAF3E6]' },
  }
  const accent = accents[card.accent]

  return (
    <Link
      to="/knowledge"
      aria-label={`前往工作仓知识库：${card.title}`}
      className="portal-card portal-card-hover group relative flex h-full flex-col overflow-hidden p-5"
    >
      <span className={cn('grid h-11 w-11 place-items-center rounded-xl', accent.soft, accent.icon)}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-portal-muted">
        {card.en}
      </div>
      <h3 className="mt-1 font-display text-[15.5px] font-bold text-portal-ink">{card.title}</h3>
      <p className="mt-2 flex-1 text-[12px] leading-6 text-portal-body">{card.desc}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-portal-mist px-2 py-0.5 text-[10px] text-portal-body">
            {tag}
          </span>
        ))}
      </div>
      <div className={cn('mt-4 h-0.5 w-full rounded-full bg-gradient-to-r to-transparent', accent.bar)} />
    </Link>
  )
}
