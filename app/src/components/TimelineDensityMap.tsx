import { useMemo, useCallback, useState } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { formatYear } from '@/data/types'

interface TimelineDensityMapProps {
  events: HistoricalEvent[]
  onSelectYear: (year: number) => void
}

const BUCKET_WIDTH_YEARS = 50
const MIN_YEAR = -20000
const MAX_YEAR = 2030

interface Bucket {
  startYear: number
  endYear: number
  count: number
  midYear: number
}

export function TimelineDensityMap({ events, onSelectYear }: TimelineDensityMapProps) {
  const [hoveredBucket, setHoveredBucket] = useState<Bucket | null>(null)
  const [tooltipX, setTooltipX] = useState(0)

  const buckets = useMemo(() => {
    const result: Bucket[] = []
    for (let y = MIN_YEAR; y < MAX_YEAR; y += BUCKET_WIDTH_YEARS) {
      result.push({
        startYear: y,
        endYear: y + BUCKET_WIDTH_YEARS,
        midYear: y + BUCKET_WIDTH_YEARS / 2,
        count: 0,
      })
    }
    events.forEach(e => {
      const idx = Math.floor((e.year - MIN_YEAR) / BUCKET_WIDTH_YEARS)
      if (idx >= 0 && idx < result.length) {
        result[idx].count++
      }
    })
    return result
  }, [events])

  const maxCount = useMemo(() => {
    if (buckets.length === 0) return 1
    return Math.max(1, ...buckets.map(b => b.count))
  }, [buckets])

  const handleClick = useCallback((bucket: Bucket) => {
    onSelectYear(bucket.midYear)
  }, [onSelectYear])

  const handleMouseEnter = useCallback((bucket: Bucket, e: React.MouseEvent) => {
    setHoveredBucket(bucket)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const parentRect = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect()
    if (parentRect) {
      setTooltipX(rect.left - parentRect.left + rect.width / 2)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredBucket(null)
  }, [])

  if (events.length === 0) return null

  return (
    <div className="relative px-3 py-1.5 bg-card/30 border-b border-border/30">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[9px] text-muted-foreground/60 font-medium tracking-wider uppercase">
          事件密度
        </span>
        <span className="text-[9px] text-muted-foreground/40">
          {formatYear(MIN_YEAR)} — {formatYear(MAX_YEAR)}
        </span>
      </div>

      <div className="relative flex h-3 rounded-sm overflow-hidden gap-px">
        {buckets.map((bucket, i) => {
          const intensity = bucket.count / maxCount
          const isHovered = hoveredBucket === bucket
          return (
            <div
              key={i}
              className="flex-1 cursor-pointer transition-all duration-150 rounded-[1px]"
              style={{
                backgroundColor: intensity === 0
                  ? 'var(--color-muted-foreground)'
                  : `oklch(from var(--color-primary) l c h / ${0.15 + intensity * 0.85})`,
                opacity: intensity === 0 ? 0.08 : undefined,
                transform: isHovered ? 'scaleY(1.8)' : undefined,
                transformOrigin: 'bottom',
              }}
              onClick={() => handleClick(bucket)}
              onMouseEnter={(e) => handleMouseEnter(bucket, e)}
              onMouseLeave={handleMouseLeave}
              title={`${formatYear(bucket.startYear)}–${formatYear(bucket.endYear)}: ${bucket.count} 条事件`}
            />
          )
        })}
      </div>

      {hoveredBucket && (
        <div
          className="absolute bottom-full mb-1 -translate-x-1/2 px-2 py-1 rounded-md
            bg-popover text-popover-foreground text-[10px] shadow-md border border-border/50
            whitespace-nowrap pointer-events-none z-50"
          style={{ left: `${tooltipX}px` }}
        >
          <span className="font-medium">{formatYear(hoveredBucket.startYear)}</span>
          <span className="text-muted-foreground mx-0.5">–</span>
          <span className="font-medium">{formatYear(hoveredBucket.endYear)}</span>
          <span className="text-muted-foreground ml-1.5">
            {hoveredBucket.count} 条事件
          </span>
        </div>
      )}
    </div>
  )
}
