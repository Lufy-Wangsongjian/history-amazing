import { useMemo, useState } from 'react'
import type { HistoricalEvent, Category } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, ERAS, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface MatrixViewProps {
  events: HistoricalEvent[]
  selectedEvent: HistoricalEvent | null
  onSelectEvent: (event: HistoricalEvent) => void
}

const MATRIX_CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[]

export function MatrixView({ events, selectedEvent, onSelectEvent }: MatrixViewProps) {
  const [activeCell, setActiveCell] = useState<{ era: string; cat: Category } | null>(null)

  // Group events by era x category
  const matrix = useMemo(() => {
    const result: Record<string, Record<Category, HistoricalEvent[]>> = {}
    ERAS.forEach(era => {
      result[era.name] = {} as Record<Category, HistoricalEvent[]>
      MATRIX_CATEGORIES.forEach(cat => {
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

  // 全局最大值用于热力图颜色
  const maxCount = useMemo(() => {
    let max = 1
    ERAS.forEach(era => {
      MATRIX_CATEGORIES.forEach(cat => {
        const count = matrix[era.name]?.[cat]?.length || 0
        if (count > max) max = count
      })
    })
    return max
  }, [matrix])

  // 当前选中 cell 的事件列表
  const activeCellEvents = useMemo(() => {
    if (!activeCell) return []
    return (matrix[activeCell.era]?.[activeCell.cat] || [])
      .sort((a, b) => {
        if (a.significance !== b.significance) return b.significance - a.significance
        return a.year - b.year
      })
  }, [activeCell, matrix])

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 md:p-6">
          {/* Header description */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-1">文明矩阵 · 热力图</h2>
            <p className="text-xs text-muted-foreground">
              颜色越深代表事件越密集 — 点击单元格查看详情
            </p>
            {/* Legend */}
            <div className="flex items-center justify-center gap-1 mt-3">
              <span className="text-[10px] text-muted-foreground mr-1">稀疏</span>
              {[0.1, 0.25, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                <div
                  key={i}
                  className="w-5 h-3 rounded-sm"
                  style={{ backgroundColor: `rgba(245, 158, 11, ${intensity * 0.7})` }}
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">密集</span>
            </div>
          </div>

          <TooltipProvider delayDuration={150}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-background p-2 w-[120px]">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">时代 \ 类目</span>
                    </th>
                    {MATRIX_CATEGORIES.map(cat => {
                      const cfg = CATEGORY_CONFIG[cat]
                      return (
                        <th key={cat} className="p-1.5 text-center min-w-[65px]">
                          <div className="flex flex-col items-center gap-0.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                              style={{ backgroundColor: cfg.color }}
                            >
                              {cfg.label[0]}
                            </div>
                            <span className="text-[9px] font-medium text-muted-foreground">{cfg.label}</span>
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ERAS.map(era => (
                    <tr key={era.name} className="border-t border-border/20">
                      <td className="sticky left-0 z-10 bg-background p-2 align-middle">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-1 h-6 rounded-full flex-shrink-0"
                            style={{ backgroundColor: era.color }}
                          />
                          <div>
                            <div className="text-[10px] font-semibold leading-tight" style={{ color: era.color }}>
                              {era.name}
                            </div>
                            <div className="text-[8px] text-muted-foreground">
                              {formatYear(era.startYear)}
                            </div>
                          </div>
                        </div>
                      </td>
                      {MATRIX_CATEGORIES.map(cat => {
                        const cellEvents = matrix[era.name]?.[cat] || []
                        const count = cellEvents.length
                        const intensity = count / maxCount
                        const catCfg = CATEGORY_CONFIG[cat]
                        const isActive = activeCell?.era === era.name && activeCell?.cat === cat
                        const milestones = cellEvents.filter(e => e.significance === 3).length

                        return (
                          <td key={cat} className="p-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => {
                                    if (count > 0) {
                                      setActiveCell(isActive ? null : { era: era.name, cat })
                                    }
                                  }}
                                  className={`
                                    w-full aspect-square max-h-[52px] rounded-lg transition-all duration-200
                                    flex items-center justify-center relative
                                    ${count > 0 ? 'cursor-pointer hover:scale-110 hover:shadow-lg hover:z-10' : 'cursor-default'}
                                    ${isActive ? 'ring-2 ring-primary shadow-lg scale-110 z-10' : ''}
                                  `}
                                  style={{
                                    backgroundColor: count > 0
                                      ? `${catCfg.color}${Math.round(Math.max(intensity, 0.08) * 200).toString(16).padStart(2, '0')}`
                                      : 'rgba(128,128,128,0.04)',
                                  }}
                                >
                                  {count > 0 && (
                                    <span
                                      className="text-[11px] font-bold"
                                      style={{
                                        color: intensity > 0.5 ? '#fff' : catCfg.color,
                                      }}
                                    >
                                      {count}
                                    </span>
                                  )}
                                  {milestones > 0 && (
                                    <span className="absolute top-0.5 right-0.5 text-[8px] text-amber-500">
                                      {'★'.repeat(Math.min(milestones, 3))}
                                    </span>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[240px]">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold">
                                    <span style={{ color: era.color }}>{era.name}</span>
                                    {' · '}
                                    <span style={{ color: catCfg.color }}>{catCfg.label}</span>
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">{count} 条事件{milestones > 0 ? `（含 ${milestones} 个里程碑）` : ''}</p>
                                  {cellEvents.slice(0, 3).map(e => (
                                    <p key={e.id} className="text-[10px] truncate">
                                      {e.significance === 3 && '★ '}{formatYear(e.year)} {e.title}
                                    </p>
                                  ))}
                                  {count > 3 && (
                                    <p className="text-[10px] text-primary">点击查看全部 {count} 条</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
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

      {/* Active cell detail panel */}
      {activeCell && activeCellEvents.length > 0 && (
        <div className="flex-shrink-0 border-t border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="px-4 py-3 max-h-[200px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">
                <span style={{ color: ERAS.find(e => e.name === activeCell.era)?.color }}>{activeCell.era}</span>
                {' · '}
                <span style={{ color: CATEGORY_CONFIG[activeCell.cat].color }}>{CATEGORY_CONFIG[activeCell.cat].label}</span>
                <span className="text-muted-foreground font-normal ml-2">({activeCellEvents.length} 条)</span>
              </span>
              <button
                onClick={() => setActiveCell(null)}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                关闭
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {activeCellEvents.map(event => {
                const regCfg = REGION_CONFIG[event.region]
                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className={`
                      text-left px-2.5 py-1.5 rounded-lg border border-border/30 hover:border-border
                      hover:bg-accent/50 transition-all duration-200
                      ${selectedEvent?.id === event.id ? 'ring-1 ring-primary bg-primary/5' : ''}
                    `}
                  >
                    <div className="flex items-center gap-1.5">
                      {event.significance === 3 && <span className="text-amber-500 text-[10px]">★</span>}
                      <span className="text-[10px] font-mono text-muted-foreground">{formatYear(event.year)}</span>
                      <span className="text-xs">{regCfg.flag}</span>
                      <span className="text-xs font-medium truncate">{event.title}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
