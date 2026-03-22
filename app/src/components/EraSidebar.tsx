import { ERAS } from '@/data/types'
import type { HistoricalEvent } from '@/data/types'
import { useMemo } from 'react'

interface EraSidebarProps {
  events: HistoricalEvent[]
  activeEra: string
  onSelectEra: (year: number) => void
}

export function EraSidebar({ events, activeEra, onSelectEra }: EraSidebarProps) {
  const eraStats = useMemo(() => {
    const stats = new Map<string, number>()
    ERAS.forEach(era => stats.set(era.name, 0))
    events.forEach(e => {
      const era = ERAS.find(er => e.year >= er.startYear && e.year < er.endYear)
      if (era) stats.set(era.name, (stats.get(era.name) || 0) + 1)
    })
    return stats
  }, [events])

  const maxCount = Math.max(...Array.from(eraStats.values()), 1)

  return (
    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-0.5 hidden lg:flex">
      {ERAS.map(era => {
        const count = eraStats.get(era.name) || 0
        const ratio = count / maxCount
        const isActive = activeEra === era.name
        // 高度与事件密度成正比
        const height = Math.max(20, ratio * 44)

        return (
          <button
            key={era.name}
            onClick={() => onSelectEra(Math.round((era.startYear + era.endYear) / 2))}
            className="relative group flex items-center"
            title={`${era.name} (${count}条事件)`}
          >
            <div
              className="w-5 rounded-sm transition-all duration-300 flex items-center justify-center overflow-hidden"
              style={{
                height: `${height}px`,
                backgroundColor: isActive ? `${era.color}40` : `${era.color}15`,
                borderLeft: isActive ? `2px solid ${era.color}` : '2px solid transparent',
              }}
            >
              <span
                className="text-[6px] font-bold leading-none writing-vertical select-none transition-colors"
                style={{
                  color: isActive ? era.color : `${era.color}80`,
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                  letterSpacing: '-1px',
                }}
              >
                {era.name.slice(0, 2)}
              </span>
            </div>
            {/* 脉冲 */}
            {isActive && (
              <div
                className="absolute inset-0 rounded-sm animate-pulse"
                style={{ backgroundColor: `${era.color}10` }}
              />
            )}
            {/* Hover tooltip */}
            <div className="absolute left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
              <div className="px-2 py-1 rounded-md bg-popover border border-border shadow-lg text-[10px] text-foreground">
                <span className="font-semibold" style={{ color: era.color }}>{era.name}</span>
                <span className="text-muted-foreground ml-1.5">{count} 条</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
