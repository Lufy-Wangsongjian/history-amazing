import { useMemo } from 'react'
import type { HistoricalEvent, Category } from '@/data/types'
import { CATEGORY_CONFIG, ERAS, REGION_CONFIG, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CONTINENT_GROUPS } from '@/data/regions'
import { RegionFlag } from './RegionFlag'
import { EventDensityChart } from './EventDensityChart'
import { FigureWordCloud } from './FigureWordCloud'
import { RegionEraHeatmap } from './RegionEraHeatmap'

interface StatsViewProps {
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
  /** 搜索跳转（用于词云点击） */
  onSearch?: (query: string) => void
  /** 跳转到时间线筛选（用于条形图点击） */
  onDrillDown?: (yearRange: [number, number], category?: Category) => void
}

export function StatsView({ events, onSelectEvent, onSearch, onDrillDown }: StatsViewProps) {
  // 按时代统计
  const eraStats = useMemo(() => {
    const counts = new Map<string, number>()
    ERAS.forEach(era => counts.set(era.name, 0))
    events.forEach(e => {
      const era = ERAS.find(er => e.year >= er.startYear && e.year < er.endYear)
      if (era) counts.set(era.name, (counts.get(era.name) || 0) + 1)
    })
    return ERAS.map(era => ({ ...era, count: counts.get(era.name) || 0 }))
  }, [events])

  // 按类目统计
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {}
    Object.keys(CATEGORY_CONFIG).forEach(k => { counts[k] = 0 })
    events.forEach(e => { counts[e.category] = (counts[e.category] || 0) + 1 })
    return Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => ({
      key: key as Category,
      ...cfg,
      count: counts[key] || 0,
    })).sort((a, b) => b.count - a.count)
  }, [events])

  // 按大洲统计
  const continentStats = useMemo(() => {
    const regionCounts: Record<string, number> = {}
    events.forEach(e => { regionCounts[e.region] = (regionCounts[e.region] || 0) + 1 })
    return CONTINENT_GROUPS.map(group => ({
      name: group.name,
      count: group.regions.reduce((sum, r) => sum + (regionCounts[r] || 0), 0),
      topRegions: group.regions
        .map(r => ({ region: r, count: regionCounts[r] || 0 }))
        .filter(r => r.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    })).sort((a, b) => b.count - a.count)
  }, [events])

  // 里程碑事件
  const milestones = useMemo(() => {
    return events.filter(e => e.significance === 3).sort((a, b) => a.year - b.year)
  }, [events])

  // 最大值
  const maxEra = Math.max(...eraStats.map(e => e.count), 1)
  const maxCat = Math.max(...categoryStats.map(c => c.count), 1)
  const maxCont = Math.max(...continentStats.map(c => c.count), 1)

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Title */}
          <div className="mb-8 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-1">数据全景</h2>
            <p className="text-xs text-muted-foreground">
              当前展示 <strong className="text-foreground">{events.length}</strong> 条历史事件的统计分析
            </p>
          </div>

          {/* 文明活跃度曲线 — 时间密度折线图 */}
          <div className="bg-card/50 rounded-xl border border-border/50 p-5 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-500 to-blue-500" />
              文明活跃度曲线
              <span className="text-[10px] text-muted-foreground font-normal ml-1">
                每百年事件密度分布 · 点击柱段可跳转
              </span>
            </h3>
            <EventDensityChart events={events} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Era Distribution */}
            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-amber-500" />
                时代分布
              </h3>
              <div className="space-y-2.5">
                {eraStats.map(era => (
                  <button
                    key={era.name}
                    className="flex items-center gap-3 group"
                    onClick={() => onDrillDown?.([era.startYear, era.endYear])}
                    title={`点击查看 ${era.name} 的时间线`}
                  >
                    <span className="text-[10px] font-medium w-24 text-right flex-shrink-0 truncate group-hover:underline" style={{ color: era.color }}>
                      {era.name}
                    </span>
                    <div className="flex-1 h-6 bg-muted/30 rounded-md overflow-hidden relative">
                      <div
                        className="h-full rounded-md transition-all duration-500 flex items-center"
                        style={{
                          width: `${Math.max((era.count / maxEra) * 100, 2)}%`,
                          backgroundColor: era.color + '40',
                        }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground">
                        {era.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-teal-500" />
                类目分布
              </h3>
              <div className="space-y-2.5">
                {categoryStats.map(cat => (
                  <div key={cat.key} className="flex items-center gap-3">
                    <span className="text-[10px] font-medium w-12 text-right flex-shrink-0" style={{ color: cat.color }}>
                      {cat.label}
                    </span>
                    <div className="flex-1 h-6 bg-muted/30 rounded-md overflow-hidden relative">
                      <div
                        className="h-full rounded-md transition-all duration-500"
                        style={{
                          width: `${Math.max((cat.count / maxCat) * 100, 2)}%`,
                          backgroundColor: cat.color + '40',
                        }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continent Distribution */}
            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-500" />
                地区分布
              </h3>
              <div className="space-y-3">
                {continentStats.map(cont => (
                  <div key={cont.name}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-medium w-16 text-right flex-shrink-0 text-foreground">
                        {cont.name}
                      </span>
                      <div className="flex-1 h-5 bg-muted/30 rounded-md overflow-hidden relative">
                        <div
                          className="h-full rounded-md transition-all duration-500"
                          style={{
                            width: `${Math.max((cont.count / maxCont) * 100, 2)}%`,
                            backgroundColor: '#4169E140',
                          }}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground">
                          {cont.count}
                        </span>
                      </div>
                    </div>
                    {cont.topRegions.length > 0 && (
                      <div className="ml-20 flex gap-1.5 flex-wrap">
                        {cont.topRegions.map(r => {
                          const cfg = REGION_CONFIG[r.region]
                          return (
                            <span key={r.region} className="text-[9px] text-muted-foreground">
                              {cfg.flag} {cfg.label}({r.count})
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Events */}
            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-amber-400" />
                里程碑事件
                <span className="text-[10px] text-muted-foreground font-normal ml-1">
                  ({milestones.length} 项)
                </span>
              </h3>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {milestones.map(event => {
                  const catCfg = CATEGORY_CONFIG[event.category]
                  return (
                    <button
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground w-24 text-right flex-shrink-0">
                        {formatYear(event.year)}
                      </span>
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: catCfg.color }}
                      />
                      <span className="text-xs flex-1 truncate">{event.title}</span>
                      <RegionFlag region={event.region} size={12} className="flex-shrink-0" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 人物词云 + 地域×时代热力图 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-purple-500" />
                历史人物词云
                <span className="text-[10px] text-muted-foreground font-normal ml-1">点击人物可搜索</span>
              </h3>
              <FigureWordCloud events={events} onSearch={onSearch} />
            </div>

            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-cyan-500" />
                地域 × 时代活跃度
                <span className="text-[10px] text-muted-foreground font-normal ml-1">哪些地区在哪些时代最活跃</span>
              </h3>
              <RegionEraHeatmap events={events} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
