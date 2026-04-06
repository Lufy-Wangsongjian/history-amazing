import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { ERAS } from '@/data/types'
import { CONTINENT_GROUPS } from '@/data/regions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface RegionEraHeatmapProps {
  events: HistoricalEvent[]
}

export function RegionEraHeatmap({ events }: RegionEraHeatmapProps) {
  // 按大洲 × 时代分桶
  const { matrix, maxCount } = useMemo(() => {
    const m: Record<string, Record<string, number>> = {}
    let max = 1

    CONTINENT_GROUPS.forEach(group => {
      m[group.name] = {}
      ERAS.forEach(era => { m[group.name][era.name] = 0 })
    })

    events.forEach(e => {
      const era = ERAS.find(er => e.year >= er.startYear && e.year < er.endYear)
      if (!era) return
      const continent = CONTINENT_GROUPS.find(g => g.regions.includes(e.region))
      if (!continent) return
      m[continent.name][era.name] += 1
      if (m[continent.name][era.name] > max) max = m[continent.name][era.name]
    })

    return { matrix: m, maxCount: max }
  }, [events])

  return (
    <div className="overflow-x-auto">
      <TooltipProvider delayDuration={100}>
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="p-1.5 text-left w-16">
                <span className="text-[8px] text-muted-foreground uppercase">地区＼时代</span>
              </th>
              {ERAS.map(era => (
                <th key={era.name} className="p-1 text-center">
                  <span className="text-[8px] font-medium" style={{ color: era.color }}>
                    {era.name.length > 3 ? era.name.slice(0, 2) : era.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONTINENT_GROUPS.map(group => (
              <tr key={group.name} className="border-t border-border/10">
                <td className="p-1.5 text-[9px] font-medium text-muted-foreground">{group.name}</td>
                {ERAS.map(era => {
                  const count = matrix[group.name]?.[era.name] || 0
                  const intensity = count / maxCount
                  return (
                    <td key={era.name} className="p-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="w-full h-6 rounded-sm flex items-center justify-center transition-all hover:scale-110 hover:z-10"
                            style={{
                              backgroundColor: count > 0
                                ? `rgba(245, 158, 11, ${Math.max(intensity * 0.7, 0.05)})`
                                : 'rgba(128,128,128,0.03)',
                            }}
                          >
                            {count > 0 && (
                              <span className="text-[8px] font-bold" style={{ color: intensity > 0.4 ? '#fff' : 'rgba(245,158,11,0.8)' }}>
                                {count}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-semibold">{group.name} · <span style={{ color: era.color }}>{era.name}</span></p>
                          <p className="text-muted-foreground">{count} 条事件</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </TooltipProvider>
    </div>
  )
}
