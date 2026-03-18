import { useMemo } from 'react'
import type { HistoricalEvent, Category } from '@/data/types'
import { CATEGORY_CONFIG, ERAS, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface MatrixViewProps {
  events: HistoricalEvent[]
  selectedEvent: HistoricalEvent | null
  onSelectEvent: (event: HistoricalEvent) => void
}

export function MatrixView({ events, selectedEvent, onSelectEvent }: MatrixViewProps) {
  const categories = Object.keys(CATEGORY_CONFIG) as Category[]

  // Group events by era x category
  const matrix = useMemo(() => {
    const result: Record<string, Record<Category, HistoricalEvent[]>> = {}
    ERAS.forEach(era => {
      result[era.name] = {} as Record<Category, HistoricalEvent[]>
      categories.forEach(cat => {
        result[era.name][cat] = []
      })
    })
    events.forEach(event => {
      const era = ERAS.find(e => event.year >= e.startYear && event.year < e.endYear)
      if (era) {
        result[era.name][event.category].push(event)
      }
    })
    return result
  }, [events])

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6">
          {/* Header description */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-1">文明矩阵</h2>
            <p className="text-xs text-muted-foreground">横轴为类目维度，纵轴为时间维度 — 一览人类文明的交织</p>
          </div>

          {/* Single TooltipProvider wrapping the entire table */}
          <TooltipProvider delayDuration={200}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-background p-2 w-[140px]">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">时代</span>
                    </th>
                    {categories.map(cat => {
                      const cfg = CATEGORY_CONFIG[cat]
                      return (
                        <th key={cat} className="p-2 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]"
                              style={{ backgroundColor: cfg.color }}
                            >
                              {cfg.label[0]}
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground">{cfg.label}</span>
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ERAS.map(era => (
                    <tr key={era.name} className="border-t border-border/30">
                      <td className="sticky left-0 z-10 bg-background p-2 align-top">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1 h-8 rounded-full flex-shrink-0"
                            style={{ backgroundColor: era.color }}
                          />
                          <div>
                            <div className="text-xs font-semibold" style={{ color: era.color }}>
                              {era.name}
                            </div>
                            <div className="text-[9px] text-muted-foreground mt-0.5">
                              {formatYear(era.startYear)}
                            </div>
                          </div>
                        </div>
                      </td>
                      {categories.map(cat => {
                        const cellEvents = matrix[era.name]?.[cat] || []
                        const catCfg = CATEGORY_CONFIG[cat]
                        return (
                          <td key={cat} className="p-1.5 align-top">
                            <div className="flex flex-wrap gap-1">
                              {cellEvents.length === 0 && (
                                <div className="w-full h-8 flex items-center justify-center">
                                  <div className="w-1 h-1 rounded-full bg-border/50" />
                                </div>
                              )}
                              {cellEvents.map(event => (
                                <Tooltip key={event.id}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => onSelectEvent(event)}
                                      className={`
                                        px-2 py-1 rounded-md text-[10px] font-medium
                                        border transition-all duration-200
                                        hover:shadow-md hover:scale-105
                                        ${selectedEvent?.id === event.id
                                          ? 'ring-2 ring-primary shadow-md'
                                          : ''
                                        }
                                      `}
                                      style={{
                                        backgroundColor: catCfg.color + '12',
                                        borderColor: catCfg.color + '30',
                                        color: catCfg.color,
                                        opacity: event.significance === 3 ? 1 : event.significance === 2 ? 0.8 : 0.6,
                                      }}
                                    >
                                      <div className="flex items-center gap-1">
                                        {event.significance === 3 && (
                                          <span className="text-amber-500">★</span>
                                        )}
                                        <span className="truncate max-w-[80px]">{event.title}</span>
                                      </div>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-[260px]">
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold">{event.title}</p>
                                      <p className="text-[10px] text-muted-foreground">{formatYear(event.year)}</p>
                                      <p className="text-[10px]">{event.description}</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  )
}
