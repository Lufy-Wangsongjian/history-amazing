import { ERAS, formatYear } from '@/data/types'
import type { HistoricalEvent } from '@/data/types'
import { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface EraNavigatorProps {
  events: HistoricalEvent[]
  onSelectYear: (year: number) => void
}

export function EraNavigator({ events, onSelectYear }: EraNavigatorProps) {
  // Count events per era
  const eraCounts = useMemo(() => {
    const counts = new Map<string, number>()
    ERAS.forEach(era => counts.set(era.name, 0))
    events.forEach(e => {
      const era = ERAS.find(er => e.year >= er.startYear && e.year < er.endYear)
      if (era) counts.set(era.name, (counts.get(era.name) || 0) + 1)
    })
    return counts
  }, [events])

  const maxCount = Math.max(...Array.from(eraCounts.values()), 1)

  return (
    <div className="h-12 flex-shrink-0 bg-card/30 backdrop-blur-sm border-t border-border/50 px-4 flex items-center gap-0.5">
      <TooltipProvider delayDuration={100}>
        {ERAS.map(era => {
          const count = eraCounts.get(era.name) || 0
          const ratio = count / maxCount
          return (
            <Tooltip key={era.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelectYear(Math.round((era.startYear + era.endYear) / 2))}
                  className="flex-1 h-8 rounded-md transition-all duration-200 hover:scale-y-110 relative overflow-hidden group"
                  style={{ backgroundColor: era.color + '15' }}
                >
                  {/* Fill bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-300 rounded-md"
                    style={{
                      height: `${Math.max(ratio * 100, 8)}%`,
                      backgroundColor: era.color + '40',
                    }}
                  />
                  {/* Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-medium text-foreground/70 group-hover:text-foreground transition-colors truncate px-1">
                      {era.name}
                    </span>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-xs">
                  <p className="font-semibold" style={{ color: era.color }}>{era.name}</p>
                  <p className="text-muted-foreground">{formatYear(era.startYear)} — {formatYear(era.endYear)}</p>
                  <p className="text-muted-foreground">{count} 条事件</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
