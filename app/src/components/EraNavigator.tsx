import { ERAS, formatYear } from '@/data/types'
import type { HistoricalEvent } from '@/data/types'
import { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Star } from 'lucide-react'

interface EraNavigatorProps {
  events: HistoricalEvent[]
  onSelectYear: (year: number) => void
}

export function EraNavigator({ events, onSelectYear }: EraNavigatorProps) {
  // 统计每个时代的事件数和里程碑
  const eraStats = useMemo(() => {
    const stats = new Map<string, { count: number; milestones: number; topEvents: string[] }>()
    ERAS.forEach(era => stats.set(era.name, { count: 0, milestones: 0, topEvents: [] }))
    events.forEach(e => {
      const era = ERAS.find(er => e.year >= er.startYear && e.year < er.endYear)
      if (era) {
        const s = stats.get(era.name)!
        s.count += 1
        if (e.significance === 3) {
          s.milestones += 1
          if (s.topEvents.length < 3) {
            s.topEvents.push(e.title)
          }
        }
      }
    })
    return stats
  }, [events])

  const maxCount = Math.max(...Array.from(eraStats.values()).map(s => s.count), 1)

  return (
    <div className="h-14 flex-shrink-0 bg-card/40 backdrop-blur-md border-t border-border/50 px-3 md:px-4 flex items-end gap-0.5 pb-1">
      <TooltipProvider delayDuration={100}>
        {ERAS.map(era => {
          const stat = eraStats.get(era.name)!
          const ratio = stat.count / maxCount
          const hasMilestones = stat.milestones > 0
          return (
            <Tooltip key={era.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelectYear(Math.round((era.startYear + era.endYear) / 2))}
                  className="flex-1 h-11 rounded-md transition-all duration-200 hover:scale-y-110 relative overflow-hidden group"
                  style={{ backgroundColor: `${era.color}10` }}
                >
                  {/* 密度填充条 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-md"
                    style={{
                      height: `${Math.max(ratio * 100, 10)}%`,
                      background: `linear-gradient(to top, ${era.color}50, ${era.color}20)`,
                    }}
                  />
                  {/* 里程碑三角标记 */}
                  {hasMilestones && (
                    <div className="absolute top-0.5 left-1/2 -translate-x-1/2">
                      <div
                        className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent"
                        style={{ borderTopColor: era.color }}
                      />
                    </div>
                  )}
                  {/* 时代名称 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[7px] md:text-[8px] font-medium text-foreground/60 group-hover:text-foreground transition-colors truncate px-0.5 leading-tight">
                      {era.name}
                    </span>
                    {hasMilestones && (
                      <span className="text-[7px] text-amber-500 flex items-center gap-0.5 mt-0.5">
                        <Star size={6} fill="currentColor" />
                        {stat.milestones}
                      </span>
                    )}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <div className="text-xs">
                  <p className="font-semibold" style={{ color: era.color }}>{era.name}</p>
                  <p className="text-muted-foreground">
                    {formatYear(era.startYear)} — {formatYear(era.endYear)}
                  </p>
                  <p className="text-muted-foreground">{stat.count} 条事件 · {stat.milestones} 个里程碑</p>
                  {stat.topEvents.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-border/50">
                      <p className="text-[10px] text-muted-foreground/70 mb-1">代表事件：</p>
                      {stat.topEvents.map((t, i) => (
                        <p key={i} className="text-[10px] text-foreground/80 truncate">★ {t}</p>
                      ))}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
