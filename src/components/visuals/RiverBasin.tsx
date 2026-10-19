/**
 * Abstract river-basin schematic. Deliberately has no monitoring stations and
 * no coordinates: the design brief forbids presenting invented locations as
 * live water-quality data. It is a visual metaphor for the workflow.
 */
export function RiverBasin() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#081B2B]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_260px_at_55%_40%,rgba(54,200,185,0.12),transparent_70%)]" />
      <svg
        viewBox="0 0 760 430"
        className="relative h-full w-full"
        role="img"
        aria-label="抽象流域河网示意图，非实时监测地图"
      >
        <defs>
          <linearGradient id="river-main" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3997E6" stopOpacity="0.5" />
            <stop offset="48%" stopColor="#36C8B9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="river-trib" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3997E6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#36C8B9" stopOpacity="0.55" />
          </linearGradient>
          <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <g opacity="0.55" stroke="#3997E6" fill="none">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <path
              key={index}
              d={`M-20 ${78 + index * 46} C 120 ${32 + index * 44}, 210 ${132 + index * 40}, 330 ${
                102 + index * 44
              } S 560 ${46 + index * 48}, 790 ${102 + index * 44}`}
              strokeWidth="0.55"
              opacity={0.24 - index * 0.018}
            />
          ))}
        </g>

        <g opacity="0.45" fill="none" stroke="#36C8B9">
          <path d="M80 330 C 180 260, 240 300, 330 238 S 520 190, 690 118" strokeWidth="0.7" />
          <path d="M120 380 C 220 320, 300 340, 380 286 S 540 236, 720 170" strokeWidth="0.55" />
        </g>

        <path
          d="M40 92 C 148 108, 186 170, 262 186 C 342 202, 372 150, 450 174 C 540 202, 568 280, 660 292 C 700 298, 720 316, 736 336"
          fill="none"
          stroke="#36C8B9"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.18"
          filter="url(#soft-glow)"
        />
        <path
          d="M40 92 C 148 108, 186 170, 262 186 C 342 202, 372 150, 450 174 C 540 202, 568 280, 660 292 C 700 298, 720 316, 736 336"
          fill="none"
          stroke="url(#river-main)"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeDasharray="16 10"
          className="animate-flow"
        />

        <g fill="none" strokeLinecap="round">
          <path
            d="M196 58 C 224 104, 222 144, 262 186"
            stroke="url(#river-trib)"
            strokeWidth="1.7"
            strokeDasharray="8 9"
            className="animate-flow"
            style={{ animationDuration: '12s' }}
          />
          <path
            d="M560 60 C 520 96, 496 132, 450 174"
            stroke="url(#river-trib)"
            strokeWidth="1.5"
            strokeDasharray="7 9"
            className="animate-flow"
            style={{ animationDuration: '14s' }}
          />
          <path
            d="M618 392 C 604 344, 620 316, 660 292"
            stroke="url(#river-trib)"
            strokeWidth="1.4"
            strokeDasharray="7 8"
            className="animate-flow"
            style={{ animationDuration: '11s' }}
          />
          <path
            d="M320 356 C 360 306, 410 252, 450 174"
            stroke="url(#river-trib)"
            strokeWidth="1.2"
            strokeDasharray="6 9"
            className="animate-flow"
            style={{ animationDuration: '15s' }}
          />
        </g>

        <g fill="#C3D6E3" fontFamily="Inter, Noto Sans SC, sans-serif" fontSize="10">
          <text x="56" y="78" opacity="0.7">上游 · 控源</text>
          <text x="318" y="132" opacity="0.7">中游 · 净化</text>
          <text x="636" y="366" opacity="0.7">下游 · 稳定</text>
        </g>
        <g fill="#36C8B9" fontFamily="Inter, Noto Sans SC, sans-serif" fontSize="9" opacity="0.78">
          <text x="172" y="212">河滨缓冲带</text>
          <text x="476" y="238">水文连通</text>
          <text x="562" y="314">生境斑块</text>
        </g>

        <g opacity="0.5">
          <circle cx="262" cy="186" r="4" fill="none" stroke="#36C8B9" strokeWidth="1" />
          <circle cx="262" cy="186" r="1.6" fill="#36C8B9" />
          <circle cx="450" cy="174" r="4" fill="none" stroke="#3997E6" strokeWidth="1" />
          <circle cx="450" cy="174" r="1.6" fill="#3997E6" />
        </g>
      </svg>

      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span className="rounded-full border border-tech-green/25 bg-tech-green/10 px-2.5 py-1 text-[9.5px] font-medium text-tech-green">
          流域示意
        </span>
        <span className="rounded-full border border-white/10 bg-[#0B192C]/70 px-2.5 py-1 text-[9.5px] text-tech-faint">
          非实时监测 · 无虚构站点
        </span>
      </div>
      <div className="absolute bottom-3 right-4 text-[9px] tracking-wide text-tech-faint/70">
        SCHEMATIC BASIN · NOT A LIVE MAP
      </div>
    </div>
  )
}
