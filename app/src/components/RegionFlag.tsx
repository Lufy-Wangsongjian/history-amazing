import type { Region } from '@/data/types'
import { REGION_CONFIG } from '@/data/types'

interface RegionFlagProps {
  region: Region
  size?: number
  className?: string
}

/**
 * SVG 旗帜组件 —— 用简化的几何 SVG 替代 emoji 旗帜
 * 对核心国家使用 SVG 渲染以确保跨平台一致性
 * 其余国家 fallback 为 emoji
 */
export function RegionFlag({ region, size = 16, className }: RegionFlagProps) {
  const svgFlag = SVG_FLAGS[region]
  if (svgFlag) {
    return (
      <svg
        width={size}
        height={Math.round(size * 0.7)}
        viewBox="0 0 30 21"
        className={className}
        role="img"
        aria-label={REGION_CONFIG[region].label}
      >
        {svgFlag}
      </svg>
    )
  }

  // Fallback: emoji
  return (
    <span className={className} style={{ fontSize: size * 0.85 }} role="img" aria-label={REGION_CONFIG[region].label}>
      {REGION_CONFIG[region].flag}
    </span>
  )
}

/** 简化 SVG 旗帜 — 只保留核心几何色块 */
const SVG_FLAGS: Partial<Record<Region, React.ReactNode>> = {
  china: (
    <>
      <rect width="30" height="21" fill="#DE2910" rx="2" />
      <polygon points="5,3 6.2,6.5 3,4.8 7,4.8 3.8,6.5" fill="#FFD700" />
      <circle cx="9" cy="3.5" r="0.7" fill="#FFD700" />
      <circle cx="10" cy="5" r="0.7" fill="#FFD700" />
      <circle cx="9" cy="6.5" r="0.7" fill="#FFD700" />
      <circle cx="7.5" cy="7" r="0.7" fill="#FFD700" />
    </>
  ),
  usa: (
    <>
      <rect width="30" height="21" fill="#B22234" rx="2" />
      <rect y="3" width="30" height="3" fill="white" />
      <rect y="9" width="30" height="3" fill="white" />
      <rect y="15" width="30" height="3" fill="white" />
      <rect width="13" height="12" fill="#3C3B6E" />
    </>
  ),
  uk: (
    <>
      <rect width="30" height="21" fill="#012169" rx="2" />
      <line x1="0" y1="0" x2="30" y2="21" stroke="white" strokeWidth="3" />
      <line x1="30" y1="0" x2="0" y2="21" stroke="white" strokeWidth="3" />
      <line x1="0" y1="0" x2="30" y2="21" stroke="#C8102E" strokeWidth="1.5" />
      <line x1="30" y1="0" x2="0" y2="21" stroke="#C8102E" strokeWidth="1.5" />
      <rect x="12" width="6" height="21" fill="white" />
      <rect y="8" width="30" height="5" fill="white" />
      <rect x="13" width="4" height="21" fill="#C8102E" />
      <rect y="9" width="30" height="3" fill="#C8102E" />
    </>
  ),
  france: (
    <>
      <rect width="10" height="21" fill="#002395" rx="2" />
      <rect x="10" width="10" height="21" fill="white" />
      <rect x="20" width="10" height="21" fill="#ED2939" rx="2" />
    </>
  ),
  germany: (
    <>
      <rect width="30" height="7" fill="#000000" rx="2" />
      <rect y="7" width="30" height="7" fill="#DD0000" />
      <rect y="14" width="30" height="7" fill="#FFCC00" rx="2" />
    </>
  ),
  italy: (
    <>
      <rect width="10" height="21" fill="#008C45" rx="2" />
      <rect x="10" width="10" height="21" fill="white" />
      <rect x="20" width="10" height="21" fill="#CE2B37" rx="2" />
    </>
  ),
  japan: (
    <>
      <rect width="30" height="21" fill="white" rx="2" />
      <circle cx="15" cy="10.5" r="5.5" fill="#BC002D" />
    </>
  ),
  india: (
    <>
      <rect width="30" height="7" fill="#FF9933" rx="2" />
      <rect y="7" width="30" height="7" fill="white" />
      <rect y="14" width="30" height="7" fill="#138808" rx="2" />
      <circle cx="15" cy="10.5" r="2.5" fill="none" stroke="#000080" strokeWidth="0.5" />
    </>
  ),
  russia: (
    <>
      <rect width="30" height="7" fill="white" rx="2" />
      <rect y="7" width="30" height="7" fill="#0039A6" />
      <rect y="14" width="30" height="7" fill="#D52B1E" rx="2" />
    </>
  ),
  greece: (
    <>
      <rect width="30" height="21" fill="#0D5EAF" rx="2" />
      <rect y="0" width="30" height="2.33" fill="white" />
      <rect y="4.67" width="30" height="2.33" fill="white" />
      <rect y="9.33" width="30" height="2.33" fill="white" />
      <rect y="14" width="30" height="2.33" fill="white" />
      <rect width="11" height="11.67" fill="#0D5EAF" />
      <rect x="4.5" y="0" width="2" height="11.67" fill="white" />
      <rect x="0" y="4.83" width="11" height="2" fill="white" />
    </>
  ),
  egypt: (
    <>
      <rect width="30" height="7" fill="#CE1126" rx="2" />
      <rect y="7" width="30" height="7" fill="white" />
      <rect y="14" width="30" height="7" fill="#000000" rx="2" />
    </>
  ),
  brazil: (
    <>
      <rect width="30" height="21" fill="#009C3B" rx="2" />
      <polygon points="15,3 27,10.5 15,18 3,10.5" fill="#FFDF00" />
      <circle cx="15" cy="10.5" r="4.5" fill="#002776" />
    </>
  ),
  spain: (
    <>
      <rect width="30" height="5.25" fill="#AA151B" rx="2" />
      <rect y="5.25" width="30" height="10.5" fill="#F1BF00" />
      <rect y="15.75" width="30" height="5.25" fill="#AA151B" rx="2" />
    </>
  ),
  turkey: (
    <>
      <rect width="30" height="21" fill="#E30A17" rx="2" />
      <circle cx="12" cy="10.5" r="5" fill="white" />
      <circle cx="13.5" cy="10.5" r="4" fill="#E30A17" />
      <polygon points="18,10.5 16,9 16.8,11.2 15,12 17.2,11.5" fill="white" />
    </>
  ),
  korea: (
    <>
      <rect width="30" height="21" fill="white" rx="2" />
      <circle cx="15" cy="10.5" r="5" fill="#C60C30" />
      <path d="M15,5.5 Q20,10.5 15,15.5" fill="#003478" />
    </>
  ),
  global: (
    <>
      <rect width="30" height="21" fill="#4B7BEC" rx="2" />
      <circle cx="15" cy="10.5" r="7" fill="none" stroke="white" strokeWidth="0.8" />
      <ellipse cx="15" cy="10.5" rx="3.5" ry="7" fill="none" stroke="white" strokeWidth="0.5" />
      <line x1="8" y1="10.5" x2="22" y2="10.5" stroke="white" strokeWidth="0.5" />
    </>
  ),
}
