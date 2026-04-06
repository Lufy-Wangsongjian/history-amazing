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

  // 计算密度波形的 SVG path — 每个时代一个点，用平滑曲线连接
  const densityPath = useMemo(() => {
    const points = ERAS.map((era, i) => {
      const stat = eraStats.get(era.name)!
      const x = (i / (ERAS.length - 1)) * 100
      const y = 100 - (stat.count / maxCount) * 80 // 留 20% 底部空间
      return { x, y }
    })
    if (points.length < 2) return ''

    // 生成平滑曲线
    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx = (prev.x + curr.x) / 2
      path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
    }
    return path
  }, [eraStats, maxCount])

  // 填充区域路径
  const areaPath = useMemo(() => {
    if (!densityPath) return ''
    return densityPath + ' L 100 100 L 0 100 Z'
  }, [densityPath])

  // 里程碑位置标记
  const milestoneMarkers = useMemo(() => {
    const MIN_YEAR = -4000
    const MAX_YEAR = 2030
    const totalRange = MAX_YEAR - MIN_YEAR
    return events
      .filter(e => e.significance === 3)
      .map(e => ({
        x: ((e.year - MIN_YEAR) / totalRange) * 100,
        title: e.title,
        year: e.year,
      }))
  }, [events])

  return (
    <div className="h-16 flex-shrink-0 bg-card/40 backdrop-blur-md border-t border-border/50 px-3 md:px-4 flex items-end gap-0.5 pb-1 relative">
      {/* SVG 密度波形叠加层 */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="era-density-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* 填充区域 */}
        {areaPath && (
          <path d={areaPath} fill="url(#era-density-fill)" />
        )}
        {/* 曲线 */}
        {densityPath && (
          <path
            d={densityPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            strokeOpacity="0.4"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {/* 里程碑三角标记 */}
        {milestoneMarkers.map((m, i) => (
          <polygon
            key={i}
            points={`${m.x - 0.5},100 ${m.x + 0.5},100 ${m.x},96`}
            fill="rgb(245, 158, 11)"
            opacity="0.5"
          />
        ))}
      </svg>

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
                  className="flex-1 h-12 rounded-md transition-all duration-200 hover:scale-y-110 relative overflow-hidden group z-[1]"
                  style={{ backgroundColor: `${era.color}08` }}
                >
                  {/* 密度填充条 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-md"
                    style={{
                      height: `${Math.max(ratio * 100, 10)}%`,
                      background: `linear-gradient(to top, ${era.color}40, ${era.color}15)`,
                    }}
                  />
                  {/* 时代名称 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[7px] md:text-[8px] font-medium text-foreground/60 group-hover:text-foreground transition-colors truncate px-0.5 leading-tight">
                      {era.name}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[7px] text-muted-foreground/50 font-mono">
                        {stat.count}
                      </span>
                      {hasMilestones && (
                        <span className="text-[7px] text-amber-500 flex items-center gap-0.5">
                          <Star size={5} fill="currentColor" />
                          {stat.milestones}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px]">
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
