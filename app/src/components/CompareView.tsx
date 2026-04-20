import { useMemo, useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear, getEra } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RegionFlag } from './RegionFlag'
import { CIVILIZATION_CIRCLES, type CivilizationCircle } from '@/data/civilizations'
import { getMultiCivEraInsight, buildMultiCivResonanceNarrative } from '@/lib/compare-narratives'
import { useIsMobile } from '@/hooks/use-mobile'
import { ChevronDown, ChevronUp, Sparkles, Eye, EyeOff } from 'lucide-react'

interface CompareViewProps {
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

interface CivYearBucket {
  civId: string
  events: HistoricalEvent[]
}

interface MultiCivRow {
  year: number
  era: string
  eraColor: string
  buckets: CivYearBucket[]
  activeCivCount: number
}

export function CompareView({ events, onSelectEvent }: CompareViewProps) {
  const isMobile = useIsMobile()
  const [visibleCivIds, setVisibleCivIds] = useState<Set<string>>(() => {
    // 移动端默认只显示前 2 个文明圈，避免列宽过窄
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return new Set(CIVILIZATION_CIRCLES.slice(0, 2).map(c => c.id))
    }
    return new Set(CIVILIZATION_CIRCLES.map(c => c.id))
  })
  const [expandedResonances, setExpandedResonances] = useState<Set<number>>(new Set())
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())
  const [showCivPicker, setShowCivPicker] = useState(false)

  const visibleCivs = useMemo(
    () => CIVILIZATION_CIRCLES.filter(c => visibleCivIds.has(c.id)),
    [visibleCivIds]
  )

  const toggleCiv = useCallback((civId: string) => {
    setVisibleCivIds(prev => {
      const next = new Set(prev)
      if (next.has(civId)) {
        if (next.size <= 2) return prev
        next.delete(civId)
      } else {
        // 移动端限制最多 3 个文明圈
        if (isMobile && next.size >= 3) return prev
        next.add(civId)
      }
      return next
    })
  }, [])

  // 按年份和文明圈分组
  const compareData = useMemo(() => {
    const yearMap = new Map<number, Map<string, HistoricalEvent[]>>()

    events.forEach(event => {
      const civ = CIVILIZATION_CIRCLES.find(c => c.regions.has(event.region))
      if (!civ || !visibleCivIds.has(civ.id)) return

      if (!yearMap.has(event.year)) {
        yearMap.set(event.year, new Map())
      }
      const civMap = yearMap.get(event.year)!
      if (!civMap.has(civ.id)) {
        civMap.set(civ.id, [])
      }
      civMap.get(civ.id)!.push(event)
    })

    const rows: MultiCivRow[] = Array.from(yearMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, civMap]) => {
        const era = getEra(year)
        const buckets: CivYearBucket[] = visibleCivs.map(civ => ({
          civId: civ.id,
          events: (civMap.get(civ.id) || []).sort((a, b) => b.significance - a.significance),
        }))
        const activeCivCount = buckets.filter(b => b.events.length > 0).length
        return { year, era: era?.name || '', eraColor: era?.color || '#666', buckets, activeCivCount }
      })
      .filter(r => r.activeCivCount > 0)

    return rows
  }, [events, visibleCivIds, visibleCivs])

  // 按时代分组
  const eraGroups = useMemo(() => {
    const groups: { era: string; color: string; rows: MultiCivRow[] }[] = []
    let currentEra: string | null = null
    compareData.forEach(row => {
      if (row.era !== currentEra) {
        currentEra = row.era
        groups.push({ era: currentEra, color: row.eraColor, rows: [] })
      }
      groups[groups.length - 1].rows.push(row)
    })
    return groups
  }, [compareData])

  // 统计（当前可见的文明圈）
  const civStats = useMemo(() => {
    const stats = new Map<string, number>()
    compareData.forEach(row => {
      row.buckets.forEach(b => {
        stats.set(b.civId, (stats.get(b.civId) || 0) + b.events.length)
      })
    })
    return stats
  }, [compareData])

  // 全量统计（所有文明圈，不受激活过滤影响 — 用于选择器）
  const allCivStats = useMemo(() => {
    const stats = new Map<string, number>()
    events.forEach(event => {
      const civ = CIVILIZATION_CIRCLES.find(c => c.regions.has(event.region))
      if (civ) {
        stats.set(civ.id, (stats.get(civ.id) || 0) + 1)
      }
    })
    return stats
  }, [events])

  const resonanceCount = compareData.filter(r => r.activeCivCount >= 2).length

  const toggleResonance = useCallback((year: number) => {
    setExpandedResonances(prev => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }, [])

  const toggleInsight = useCallback((era: string) => {
    setExpandedInsights(prev => {
      const next = new Set(prev)
      if (next.has(era)) next.delete(era)
      else next.add(era)
      return next
    })
  }, [])

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
      {/* 固定头部区域 */}
      <div className="flex-shrink-0 px-4 md:px-6 pt-4 pb-2 space-y-3">
        {/* 标题 */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-0.5">文明对比</h2>
          <p className="text-xs text-muted-foreground">
            同一时间节点，不同文明圈各自发生了什么？
            {resonanceCount > 0 && (
              <span className="ml-1.5 text-amber-500">
                {resonanceCount} 个跨文明共振
              </span>
            )}
          </p>
        </div>

        {/* 文明圈选择器 */}
        <div>
          <button
            onClick={() => setShowCivPicker(p => !p)}
            className="mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/80 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            <Eye size={12} />
            <span>选择文明圈 ({visibleCivIds.size}/{CIVILIZATION_CIRCLES.length})</span>
            {showCivPicker ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showCivPicker && (
            <div className="mt-2 max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {CIVILIZATION_CIRCLES.map(civ => {
                const isActive = visibleCivIds.has(civ.id)
                const count = allCivStats.get(civ.id) || 0
                return (
                  <button
                    key={civ.id}
                    onClick={() => toggleCiv(civ.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all duration-200 ${
                      isActive ? 'shadow-sm' : 'opacity-50 hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: isActive ? civ.bgColor : 'transparent',
                      borderColor: isActive ? civ.borderColor : 'rgba(128,128,128,0.2)',
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: civ.color }} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium truncate" style={{ color: isActive ? civ.color : undefined }}>
                        {civ.label}
                      </p>
                      <p className="text-[9px] text-muted-foreground">{count} 条</p>
                    </div>
                    {isActive ? <Eye size={10} className="flex-shrink-0 ml-auto text-muted-foreground" /> : <EyeOff size={10} className="flex-shrink-0 ml-auto text-muted-foreground" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 粘性列头 */}
        <div className="flex gap-px rounded-t-lg overflow-hidden">
          {/* 年份列头 */}
          <div className="w-[72px] md:w-[88px] flex-shrink-0 bg-muted/30 px-1 py-2 text-center">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">年份</span>
          </div>
          {/* 文明圈列头 */}
          {visibleCivs.map(civ => (
            <div
              key={civ.id}
              className="flex-1 min-w-0 px-2 py-2 text-center"
              style={{ backgroundColor: civ.color + '10' }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: civ.color }} />
                <span className="text-[10px] font-bold truncate" style={{ color: civ.color }}>
                  {civ.shortLabel}
                </span>
              </div>
              <p className="text-[8px] text-muted-foreground mt-0.5">
                {civStats.get(civ.id) || 0} 条
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 可滚动的表格内容 */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 md:px-6 pb-6">
          {compareData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 px-6 py-12 text-center mt-4">
              <p className="text-sm font-medium text-foreground">当前筛选条件下没有可对比的文明圈事件</p>
              <p className="mt-2 text-xs text-muted-foreground">
                试着放宽筛选条件，或在上方选择更多文明圈。
              </p>
            </div>
          ) : (
            eraGroups.map((group, groupIdx) => {
              const insight = getMultiCivEraInsight(group.era)
              const isInsightOpen = expandedInsights.has(group.era)

              return (
                <div key={groupIdx} className="mb-2">
                  {/* 时代横幅 — 占满全宽 */}
                  <div className="flex gap-px">
                    <div
                      className="w-full py-2 px-3 flex items-center justify-between"
                      style={{ backgroundColor: group.color + '0C' }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: group.color }} />
                        <span className="text-[11px] font-bold tracking-wide" style={{ color: group.color }}>
                          {group.era}
                        </span>
                      </div>
                      {insight && (
                        <button
                          onClick={() => toggleInsight(group.era)}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Sparkles size={10} className="text-amber-500" />
                          <span>{isInsightOpen ? '收起洞察' : '时代洞察'}</span>
                          {isInsightOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 时代洞察展开 */}
                  {isInsightOpen && insight && (
                    <div
                      className="rounded-b-lg border-x border-b p-3 mb-1 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300"
                      style={{ borderColor: group.color + '20', backgroundColor: group.color + '04' }}
                    >
                      <div
                        className="grid gap-2"
                        style={{ gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(visibleCivs.length, 4)}, 1fr)` }}
                      >
                        {insight.insights
                          .filter(ins => visibleCivIds.has(ins.civId))
                          .map(ins => {
                            const civ = CIVILIZATION_CIRCLES.find(c => c.id === ins.civId)
                            if (!civ) return null
                            return (
                              <div
                                key={ins.civId}
                                className="rounded-lg border p-2.5"
                                style={{ backgroundColor: civ.bgColor, borderColor: civ.borderColor }}
                              >
                                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: civ.color }}>
                                  {civ.shortLabel}
                                </p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">{ins.text}</p>
                              </div>
                            )
                          })}
                      </div>
                      <div className="rounded-lg border p-2.5" style={{ borderColor: group.color + '20', backgroundColor: group.color + '04' }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: group.color }}>跨文明洞察</p>
                        <p className="text-[11px] text-foreground/80 leading-relaxed italic">{insight.contrast}</p>
                      </div>
                    </div>
                  )}

                  {/* 数据行 — 表格化布局 */}
                  <div className="border-x border-border/20 divide-y divide-border/10">
                    {group.rows.map((row, rowIdx) => {
                      const isResonance = row.activeCivCount >= 2
                      const isResonanceOpen = expandedResonances.has(row.year)
                      const prevRow = rowIdx > 0 ? group.rows[rowIdx - 1] : null
                      const yearGap = prevRow ? row.year - prevRow.year : 0

                      return (
                        <div key={row.year}>
                          {/* 时间间隔指示器 */}
                          {prevRow && yearGap > 50 && (
                            <div className="flex gap-px">
                              <div className="w-[72px] md:w-[88px] flex-shrink-0 flex items-center justify-center">
                                <span className="text-[8px] font-mono text-muted-foreground/40 px-1.5 py-0.5 rounded-full bg-muted/20 border border-dashed border-border/20">
                                  ↕ {yearGap >= 1000 ? `${(yearGap / 1000).toFixed(1)}千年` : `${yearGap}年`}
                                </span>
                              </div>
                              <div className="flex-1 border-b border-dashed border-border/10" />
                            </div>
                          )}
                          {/* 事件行 */}
                          <div className="flex gap-px min-h-[44px]">
                            {/* 年份单元格 */}
                            <div className="w-[72px] md:w-[88px] flex-shrink-0 flex flex-col items-center justify-center bg-muted/20 py-1.5 relative">
                              <span className="text-[9px] font-mono font-medium text-muted-foreground text-center leading-tight">
                                {formatYear(row.year)}
                              </span>
                              {isResonance && (
                                <button
                                  onClick={() => toggleResonance(row.year)}
                                  className="mt-0.5 flex items-center gap-0.5 text-[8px] text-amber-500/80 hover:text-amber-500 transition-colors"
                                >
                                  <Sparkles size={8} />
                                  <span>共振</span>
                                  {isResonanceOpen ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
                                </button>
                              )}
                            </div>

                            {/* 各文明圈列 */}
                            {row.buckets.map((bucket, i) => {
                              const civ = visibleCivs[i]
                              if (!civ) return null
                              const hasEvents = bucket.events.length > 0
                              return (
                                <div
                                  key={civ.id}
                                  className="flex-1 min-w-0 py-1.5 px-1.5"
                                  style={{
                                    backgroundColor: hasEvents ? civ.color + '06' : 'transparent',
                                    borderLeft: i > 0 ? `1px solid ${civ.color}10` : undefined,
                                  }}
                                >
                                  {hasEvents ? (
                                    <div className="space-y-1">
                                      {bucket.events.slice(0, 3).map(event => (
                                        <CivEventChip
                                          key={event.id}
                                          event={event}
                                          civ={civ}
                                          onClick={() => onSelectEvent(event)}
                                        />
                                      ))}
                                      {bucket.events.length > 3 && (
                                        <p className="text-[8px] text-muted-foreground text-center">
                                          +{bucket.events.length - 3} 更多
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="h-full flex items-center justify-center">
                                      <div className="w-1 h-1 rounded-full bg-border/30" />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* 共振解读 */}
                          {isResonanceOpen && isResonance && (
                            <ResonanceCard row={row} visibleCivs={visibleCivs} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* 时代底部边框 */}
                  <div className="h-px" style={{ backgroundColor: group.color + '20' }} />
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

/** 文明圈事件卡片 — 紧凑但信息丰富 */
function CivEventChip({
  event,
  civ,
  onClick,
}: {
  event: HistoricalEvent
  civ: CivilizationCircle
  onClick: () => void
}) {
  const catCfg = CATEGORY_CONFIG[event.category]

  return (
    <button
      onClick={onClick}
      className="w-full px-2 py-1.5 rounded-md border text-left hover:shadow-md hover:scale-[1.01] transition-all duration-150 group"
      style={{
        backgroundColor: civ.bgColor,
        borderColor: civ.borderColor,
      }}
    >
      <div className="flex items-center gap-1">
        <RegionFlag region={event.region} size={12} className="flex-shrink-0" />
        <span className="text-[10px] font-semibold truncate" style={{ color: catCfg.color }}>
          {event.title}
        </span>
        {event.significance === 3 && (
          <span className="text-amber-500 text-[8px] flex-shrink-0">★</span>
        )}
      </div>
      <p className="text-[8px] text-muted-foreground/60 mt-0.5 line-clamp-1 group-hover:text-muted-foreground transition-colors">
        {event.description}
      </p>
    </button>
  )
}

/** 共振解读卡片 — 横跨所有列 */
function ResonanceCard({
  row,
  visibleCivs,
}: {
  row: MultiCivRow
  visibleCivs: CivilizationCircle[]
}) {
  const civEvents = row.buckets
    .map((b, i) => ({
      civLabel: visibleCivs[i]?.shortLabel || '',
      events: b.events,
    }))
    .filter(c => c.events.length > 0)

  const narrative = buildMultiCivResonanceNarrative(row.year, civEvents)
  if (!narrative) return null

  return (
    <div className="px-2 py-2 bg-amber-500/[0.03] border-t border-amber-500/10 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-start gap-2 max-w-2xl mx-auto">
        <Sparkles size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-relaxed italic">{narrative}</p>
      </div>
    </div>
  )
}
