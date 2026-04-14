import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
import { Star } from 'lucide-react'

interface MilestoneTickerProps {
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

export function MilestoneTicker({ events, onSelectEvent }: MilestoneTickerProps) {
  const milestones = useMemo(() => {
    return events.filter(e => e.significance === 3).sort((a, b) => a.year - b.year)
  }, [events])

  if (milestones.length < 3) return null

  // Duplicate the list for seamless infinite scroll
  const doubled = [...milestones, ...milestones]

  return (
    <div className="h-7 flex-shrink-0 overflow-hidden bg-card/30 border-b border-border/30 relative group">
      <div
        className="flex items-center gap-6 h-full whitespace-nowrap ticker-scroll"
        style={{
          animationDuration: `${Math.max(milestones.length * 3, 30)}s`,
        }}
      >
        {doubled.map((event, i) => {
          const catCfg = CATEGORY_CONFIG[event.category]
          return (
            <button
              key={`${event.id}-${i}`}
              onClick={() => onSelectEvent(event)}
              className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              title={`${event.title} (${formatYear(event.year)})`}
            >
              <Star size={9} className="text-amber-500 flex-shrink-0" />
              <span className="font-mono text-muted-foreground/60">{formatYear(event.year)}</span>
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: catCfg?.color }}
              />
              <span className="max-w-[180px] truncate">{event.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
