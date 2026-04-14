import { useMemo } from 'react'
import type { HistoricalEvent, Category } from '@/data/types'
import { CATEGORY_CONFIG, ERAS, REGION_CONFIG, formatYear } from '@/data/types'
import { Award, TrendingUp, Link2, Users, Calendar } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CONTINENT_GROUPS } from '@/data/regions'
import { RegionFlag } from './RegionFlag'
import { EventDensityChart } from './EventDensityChart'
import { FigureWordCloud } from './FigureWordCloud'
import { RegionEraHeatmap } from './RegionEraHeatmap'
import { EraPulse } from './EraPulse'

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

  // 历史之最
  const superlatives = useMemo(() => {
    if (events.length === 0) return null

    // 1. 事件最密集的年份
    const yearCounts = new Map<number, number>()
    events.forEach(e => yearCounts.set(e.year, (yearCounts.get(e.year) || 0) + 1))
    const busiestYear = Array.from(yearCounts.entries()).sort((a, b) => b[1] - a[1])[0]

    // 2. 事件最密集的十年
    const decadeCounts = new Map<number, number>()
    events.forEach(e => {
      const decade = Math.floor(e.year / 10) * 10
      decadeCounts.set(decade, (decadeCounts.get(decade) || 0) + 1)
    })
    const busiestDecade = Array.from(decadeCounts.entries()).sort((a, b) => b[1] - a[1])[0]

    // 3. 关联最多的事件
    const mostConnected = events
      .filter(e => e.relatedIds && e.relatedIds.length > 0)
      .sort((a, b) => (b.relatedIds?.length || 0) - (a.relatedIds?.length || 0))[0] || null

    // 4. 出现最多人物的事件
    const mostFigures = events
      .filter(e => e.figure && e.figure.trim().length > 0)
      .sort((a, b) => {
        const aCount = (b.figure || '').split(/[、,，/]/).filter(Boolean).length
        const bCount = (a.figure || '').split(/[、,，/]/).filter(Boolean).length
        return bCount - aCount
      })[0] || null
    const mostFiguresCount = mostFigures ? (mostFigures.figure || '').split(/[、,，/]/).filter(Boolean).length : 0

    // 5. 覆盖人物最多的类目
    const catFigureCounts = new Map<string, number>()
    events.forEach(e => {
      if (e.figure && e.figure.trim().length > 0) {
        const count = e.figure.split(/[、,，/]/).filter(Boolean).length
        catFigureCounts.set(e.category, (catFigureCounts.get(e.category) || 0) + count)
      }
    })
    const topFigureCategory = Array.from(catFigureCounts.entries()).sort((a, b) => b[1] - a[1])[0] || null

    // 6. 最长持续事件
    const longestEvent = events
      .filter(e => e.endYear != null)
      .sort((a, b) => ((b.endYear || b.year) - b.year) - ((a.endYear || a.year) - a.year))[0] || null

    return {
      busiestYear: busiestYear ? { year: busiestYear[0], count: busiestYear[1] } : null,
      busiestDecade: busiestDecade ? { decade: busiestDecade[0], count: busiestDecade[1] } : null,
      mostConnected,
      mostFigures,
      mostFiguresCount,
      topFigureCategory: topFigureCategory ? { category: topFigureCategory[0] as Category, count: topFigureCategory[1] } : null,
      longestEvent,
    }
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

          {/* 文明脉搏心电图 — 十年粒度折线 */}
          <div className="bg-card/50 rounded-xl border border-border/50 p-5 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gradient-to-b from-rose-500 to-violet-500" />
              文明脉搏
              <span className="text-[10px] text-muted-foreground font-normal ml-1">
                十年粒度事件密度 · 点击跳转
              </span>
            </h3>
            <EraPulse events={events} onDrillDown={onDrillDown ? (yr) => onDrillDown(yr) : undefined} />
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
            {/* 历史之最排行榜 */}
            {superlatives && (
            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-rose-500" />
                历史之最
                <span className="text-[10px] text-muted-foreground font-normal ml-1">基于当前数据集</span>
              </h3>
              <div className="space-y-3">
                {superlatives.busiestYear && (
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <Calendar size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-medium text-foreground">最热闹的年份</div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatYear(superlatives.busiestYear.year)} — 同年发生了 <strong className="text-amber-500">{superlatives.busiestYear.count}</strong> 件大事
                      </div>
                    </div>
                  </div>
                )}
                {superlatives.busiestDecade && (
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <TrendingUp size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-medium text-foreground">最密集的十年</div>
                      <div className="text-[10px] text-muted-foreground">
                        {formatYear(superlatives.busiestDecade.decade)}s — 十年间共 <strong className="text-blue-500">{superlatives.busiestDecade.count}</strong> 条事件
                      </div>
                    </div>
                  </div>
                )}
                {superlatives.mostConnected && (
                  <button
                    className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:bg-purple-500/10 transition-colors"
                    onClick={() => onSelectEvent(superlatives.mostConnected!)}
                  >
                    <Link2 size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-medium text-foreground">关联最多的事件</div>
                      <div className="text-[10px] text-muted-foreground">
                        {superlatives.mostConnected.title} — <strong className="text-purple-500">{superlatives.mostConnected.relatedIds?.length}</strong> 个因果关联
                      </div>
                    </div>
                  </button>
                )}
                {superlatives.mostFigures && (
                  <button
                    className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors"
                    onClick={() => onSelectEvent(superlatives.mostFigures!)}
                  >
                    <Users size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-medium text-foreground">人物最多的事件</div>
                      <div className="text-[10px] text-muted-foreground">
                        {superlatives.mostFigures.title} — <strong className="text-emerald-500">{superlatives.mostFiguresCount}</strong> 位历史人物
                      </div>
                    </div>
                  </button>
                )}
                {superlatives.longestEvent && (
                  <button
                    className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors"
                    onClick={() => onSelectEvent(superlatives.longestEvent!)}
                  >
                    <Award size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-medium text-foreground">持续最久的事件</div>
                      <div className="text-[10px] text-muted-foreground">
                        {superlatives.longestEvent.title} — 跨越 <strong className="text-rose-500">{(superlatives.longestEvent.endYear || superlatives.longestEvent.year) - superlatives.longestEvent.year}</strong> 年
                      </div>
                    </div>
                  </button>
                )}
                {superlatives.topFigureCategory && (
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                    <Award size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-medium text-foreground">人物最密集的领域</div>
                      <div className="text-[10px] text-muted-foreground">
                        {CATEGORY_CONFIG[superlatives.topFigureCategory.category]?.label} — 涉及 <strong className="text-indigo-500">{superlatives.topFigureCategory.count}</strong> 人次
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
            {/* 文明深度指数 */}
            <div className="bg-card/50 rounded-xl border border-border/50 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                内容深度指数
                <span className="text-[10px] text-muted-foreground font-normal ml-1">各类目叙事覆盖率</span>
              </h3>
              <div className="space-y-2">
                {(Object.entries(CATEGORY_CONFIG) as Array<[string, typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG]]>).map(([cat, cfg]) => {
                  const catEvents = events.filter(e => e.category === cat)
                  const total = catEvents.length
                  if (total === 0) return null
                  const withDetails = catEvents.filter(e => e.details).length
                  const withRelated = catEvents.filter(e => e.relatedIds && e.relatedIds.length > 0).length
                  const depthScore = Math.round(((withDetails / total) * 0.6 + (withRelated / total) * 0.4) * 100)
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-[10px] w-14 text-right text-muted-foreground truncate">{cfg.label}</span>
                      <div className="flex-1 h-3 rounded-full bg-muted/30 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${depthScore}%`, backgroundColor: cfg.color }}
                        />
                      </div>
                      <span className="text-[10px] w-8 text-muted-foreground">{depthScore}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
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
