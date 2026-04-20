import { useMemo, useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { ERAS, formatYear } from '@/data/types'

interface EraPulseProps {
  events: HistoricalEvent[]
  onDrillDown?: (yearRange: [number, number]) => void
}

interface DecadeBucket {
  startYear: number
  count: number
  eraName: string
  eraColor: string
  topEvent: string | null
}

export function EraPulse({ events, onDrillDown }: EraPulseProps) {
  const [hovered, setHovered] = useState<DecadeBucket | null>(null)
  const [hoveredX, setHoveredX] = useState(0)

  const buckets = useMemo(() => {
    const MIN_YEAR = -4000
    const MAX_YEAR = 2030
    const DECADE = 10
    const result: DecadeBucket[] = []

    for (let y = MIN_YEAR; y < MAX_YEAR; y += DECADE) {
      const era = ERAS.find(e => y >= e.startYear && y < e.endYear)
      const decadeEvents = events.filter(e => e.year >= y && e.year < y + DECADE)
      const topEvent = decadeEvents.length > 0
        ? decadeEvents.reduce((best, e) => e.significance > best.significance ? e : best, decadeEvents[0]).title
        : null
      result.push({
        startYear: y,
        count: decadeEvents.length,
        eraName: era?.name || '',
        eraColor: era?.color || '#888',
        topEvent,
      })
    }
    return result
  }, [events])

  const maxCount = Math.max(...buckets.map(b => b.count), 1)
  const width = 800
  const height = 120
  const padding = { top: 10, bottom: 25, left: 0, right: 0 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const points = buckets.map((b, i) => {
    const x = padding.left + (i / (buckets.length - 1)) * chartWidth
    const y = padding.top + chartHeight - (b.count / maxCount) * chartHeight
    return { x, y, bucket: b }
  })

  // Build SVG path for area chart
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath = linePath + ` L ${(padding.left + chartWidth).toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} L ${padding.left} ${(padding.top + chartHeight).toFixed(1)} Z`

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = e.clientX - rect.left
    const ratio = relX / rect.width
    const idx = Math.round(ratio * (buckets.length - 1))
    const clamped = Math.max(0, Math.min(buckets.length - 1, idx))
    setHovered(buckets[clamped])
    setHoveredX(points[clamped]?.x || 0)
  }, [buckets, points])

  const handleClick = useCallback(() => {
    if (hovered && onDrillDown) {
      onDrillDown([hovered.startYear, hovered.startYear + 10])
    }
  }, [hovered, onDrillDown])

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        onClick={handleClick}
        preserveAspectRatio="none"
      >
        {/* Area fill with gradient */}
        <defs>
          <linearGradient id="pulse-gradient" x1="0" y1="0" x2="1" y2="0">
            {ERAS.map((era, idx) => (
              <stop key={era.name} offset={`${(idx / (ERAS.length - 1)) * 100}%`} stopColor={era.color} stopOpacity="0.3" />
            ))}
          </linearGradient>
          <linearGradient id="pulse-line-gradient" x1="0" y1="0" x2="1" y2="0">
            {ERAS.map((era, idx) => (
              <stop key={era.name} offset={`${(idx / (ERAS.length - 1)) * 100}%`} stopColor={era.color} stopOpacity="0.8" />
            ))}
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#pulse-gradient)" />
        <path d={linePath} fill="none" stroke="url(#pulse-line-gradient)" strokeWidth="1.5" />

        {/* Hover line */}
        {hovered && (
          <line x1={hoveredX} y1={padding.top} x2={hoveredX} y2={padding.top + chartHeight} stroke="currentColor" strokeWidth="0.5" opacity="0.4" strokeDasharray="3,3" />
        )}

        {/* X-axis labels */}
        {[-20000, -10000, -4000, 0, 1000, 2000].map(yr => {
          const idx = buckets.findIndex(b => b.startYear >= yr)
          if (idx < 0) return null
          const x = points[idx]?.x || 0
          return (
            <text key={yr} x={x} y={height - 5} textAnchor="middle" className="text-[8px] fill-muted-foreground">{formatYear(yr)}</text>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-2 py-1 bg-card border border-border rounded-md shadow-sm text-[10px] pointer-events-none whitespace-nowrap z-10">
          <span className="font-semibold">{formatYear(hovered.startYear)}s</span>
          <span className="text-muted-foreground mx-1">·</span>
          <span style={{ color: hovered.eraColor }}>{hovered.eraName}</span>
          <span className="text-muted-foreground mx-1">·</span>
          <span>{hovered.count} 件事件</span>
          {hovered.topEvent && (
            <>
              <br />
              <span className="text-muted-foreground">{hovered.topEvent}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
