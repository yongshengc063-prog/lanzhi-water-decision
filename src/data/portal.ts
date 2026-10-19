import { Bird, Droplets, Leaf, Waves, type LucideIcon } from 'lucide-react'

export interface PortalNavItem {
  label: string
  href: string
  /** 首页锚点 */
  hash?: string
}

export const PORTAL_NAV: PortalNavItem[] = [
  { label: '首页', href: '/' },
  { label: '全球水质', href: '/#news', hash: 'news' },
  { label: '治理技术', href: '/#technology', hash: 'technology' },
  { label: '系统介绍', href: '/#about', hash: 'about' },
]

export interface TechCard {
  icon: LucideIcon
  title: string
  en: string
  desc: string
  tags: string[]
  accent: 'water' | 'leaf' | 'cyan' | 'gold'
}

export const TECH_CARDS: TechCard[] = [
  {
    icon: Leaf,
    title: '水生植物群落重建',
    en: 'Aquatic Vegetation',
    desc: '沉水、挺水与浮叶植物协同配置，恢复水体自净能力与生境结构。',
    tags: ['富营养化', '生境修复', '低运维'],
    accent: 'leaf',
  },
  {
    icon: Droplets,
    title: '底泥内源污染控制',
    en: 'Sediment Control',
    desc: '环保清淤、原位覆盖与钝化，切断缺氧条件下的内源磷释放。',
    tags: ['内源负荷', '底泥治理', '工程措施'],
    accent: 'water',
  },
  {
    icon: Waves,
    title: '水动力与连通性改善',
    en: 'Hydrodynamics',
    desc: '闸泵调度、河道形态优化与生态流量保障，提升水体交换效率。',
    tags: ['水动力', '连通性', '生态流量'],
    accent: 'cyan',
  },
  {
    icon: Bird,
    title: '河岸带与缓冲带修复',
    en: 'Riparian Buffer',
    desc: '拆硬还绿、生态护岸与缓冲带植被，重建水陆交错带生态功能。',
    tags: ['岸线硬化', '面源拦截', '生物多样性'],
    accent: 'gold',
  },
]
