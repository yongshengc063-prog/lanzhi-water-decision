/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ============================================================
         * 前台 · 全球水质资讯门户（Light Mode）
         * 参考高校官网：明亮、清新、留白，水蓝 + 生态绿 + 纯白
         * ============================================================ */
        portal: {
          bg: '#F4F9FC',
          surface: '#FFFFFF',
          soft: '#EAF4F9',
          mist: '#F0F7FA',
          line: '#DCEAF1',
          ink: '#0D2B3E',
          body: '#486273',
          muted: '#7A93A3',
          brand: '#0B7EA8',
          brandDeep: '#075E86',
          brandSoft: '#E3F4FB',
          water: '#119BD1',
          leaf: '#1FA971',
          leafDeep: '#137A51',
          leafSoft: '#E8F8F1',
          gold: '#C98A2E',
        },

        /* ============================================================
         * 后台 · 专业智能决策大屏（深蓝科技，不使用纯黑）
         * 底色 #0B192C → #1A365D；点缀青 #00F0FF / 绿 #00FF88
         * ============================================================ */
        deepsea: {
          950: '#050D1B',
          900: '#0B192C',
          800: '#102544',
          700: '#1A365D',
          600: '#23477A',
          line: 'rgba(0,240,255,0.16)',
        },
        /* 大屏专用霓虹色：tailwind 别名保证 bg-neon-cyan 等可用 */
        neon: {
          cyan: '#00F0FF',
          green: '#00FF88',
        },
        tech: {
          cyan: '#00F0FF',
          green: '#00FF88',
          blue: '#3BA9FF',
          violet: '#8B7BFF',
          amber: '#FFC24B',
          red: '#FF6B7A',
          ink: '#EAF7FF',
          muted: '#8FB3CE',
          faint: '#5F83A6',
        },

        /* -------- 兼容旧 token（后台遗留组件继续可用） -------- */
        abyss: '#0B192C',
        deep: '#0B2031',
        panel: '#10283B',
        line: '#214052',
        ink: '#E8F4FA',
        muted: '#93B0C2',
        fainter: '#6F8FA5',
        cyan: {
          DEFAULT: '#00C8E8',
          soft: '#7DEBFF',
          deep: '#0099BE',
        },
        aqua: '#00D9A6',
        leaf: '#2FD79B',
        good: '#00D9A6',
        amber: '#F3B34C',
        danger: '#EC7067',
        sky: '#3BA9FF',
      },

      fontFamily: {
        display: [
          'Manrope',
          'Noto Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          'Inter',
          'Noto Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif',
        ],
        serif: ['Noto Serif SC', 'Songti SC', 'SimSun', 'serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },

      boxShadow: {
        /* 前台：柔和、有通透感 */
        'portal-sm': '0 2px 10px -4px rgba(13, 43, 62, 0.10)',
        'portal': '0 18px 45px -28px rgba(13, 43, 62, 0.28)',
        'portal-lg': '0 36px 80px -46px rgba(9, 60, 86, 0.42)',
        'portal-hover': '0 30px 60px -32px rgba(11, 126, 168, 0.36)',
        /* 后台：霓虹光晕 */
        'neon-cyan': '0 0 0 1px rgba(0,240,255,0.22), 0 0 32px -6px rgba(0,240,255,0.45)',
        'neon-green': '0 0 0 1px rgba(0,255,136,0.2), 0 0 28px -8px rgba(0,255,136,0.42)',
        /* 兼容旧 token */
        glow: '0 0 0 1px rgba(0, 217, 166, 0.14), 0 18px 46px -24px rgba(0, 217, 166, 0.38)',
        panel: '0 28px 80px -44px rgba(0, 0, 0, 0.85)',
        card: '0 18px 50px -32px rgba(0, 0, 0, 0.75)',
        pet: '0 24px 55px -18px rgba(0, 240, 255, 0.45)',
        float: '0 18px 42px -22px rgba(0, 0, 0, 0.7)',
      },

      backgroundImage: {
        'grid-fade':
          'linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)',
        'tech-panel':
          'linear-gradient(145deg, rgba(35,71,122,0.55) 0%, rgba(9,26,58,0.62) 55%, rgba(26,54,93,0.48) 100%)',
        'portal-hero':
          'linear-gradient(100deg, rgba(232,247,252,0.96) 0%, rgba(232,247,252,0.82) 38%, rgba(232,247,252,0.18) 72%, rgba(232,247,252,0.04) 100%)',
      },

      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.96)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        petFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1.5deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1.5deg)' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '95%, 97%': { transform: 'scaleY(0.08)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.85)', opacity: '0.55' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flow: {
          to: { strokeDashoffset: '-240' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(14px)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.86)', opacity: '0.55' },
          '70%': { transform: 'scale(1.35)', opacity: '0' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        borderFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        caret: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        flowDot: {
          '0%': { left: '0%', opacity: '0' },
          '18%': { opacity: '1' },
          '82%': { opacity: '1' },
          '100%': { left: '100%', opacity: '0' },
        },
      },

      animation: {
        breathe: 'breathe 3.2s ease-in-out infinite',
        'spin-slow': 'spinSlow 16s linear infinite',
        scan: 'scan 4.5s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'pet-float': 'petFloat 4.6s ease-in-out infinite',
        blink: 'blink 6s ease-in-out infinite',
        ripple: 'ripple 2.8s ease-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out both',
        flow: 'flow 9s linear infinite',
        drift: 'drift 9s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.6s cubic-bezier(0.25, 0.8, 0.4, 1) infinite',
        'border-flow': 'borderFlow 6s ease infinite',
        caret: 'caret 1s step-end infinite',
        'flow-dot': 'flowDot 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
