import { useMemo, useState } from 'react'
import type { HistoricalEvent, Region } from '@/data/types'
import { CATEGORY_CONFIG, formatYear, getEra } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RegionFlag } from './RegionFlag'
import { getEraInsight, buildResonanceNarrative } from '@/lib/compare-narratives'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

interface CompareViewProps {
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

// 东方地区（东亚 + 东南亚 + 南亚 + 中亚西亚部分）
const EAST_REGIONS: Set<Region> = new Set([
  'china', 'japan', 'korea', 'mongolia',
  'vietnam', 'thailand', 'cambodia', 'myanmar', 'indonesia', 'philippines', 'malaysia', 'singapore',
  'india', 'pakistan', 'sri-lanka', 'nepal',
  'iran', 'iraq', 'turkey', 'israel', 'saudi-arabia', 'syria', 'uzbekistan', 'afghanistan',
])

// 西方地区（欧洲 + 美洲 + 大洋洲）
const WEST_REGIONS: Set<Region> = new Set([
  'uk', 'france', 'germany', 'italy', 'spain', 'portugal', 'greece', 'russia',
  'netherlands', 'poland', 'austria', 'sweden', 'switzerland', 'belgium', 'czech',
  'norway', 'denmark', 'ireland', 'romania', 'hungary', 'ukraine', 'finland', 'serbia',
  'usa', 'mexico', 'brazil', 'argentina', 'peru', 'colombia', 'canada', 'chile', 'cuba',
  'venezuela', 'bolivia',
  'australia', 'new-zealand',
])

interface EraCompareRow {
  year: number
  era: string
  eraColor: string
  eastEvents: HistoricalEvent[]
  westEvents: HistoricalEvent[]
}

export function CompareView({ events, onSelectEvent }: CompareViewProps) {
  const [expandedResonances, setExpandedResonances] = useState<Set<number>>(new Set())
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set())

  // 将事件分为东方/西方，按时代+年份分组
  const compareData = useMemo(() => {
    const yearMap = new Map<number, { east: HistoricalEvent[]; west: HistoricalEvent[] }>()

    events.forEach(event => {
      const isEast = EAST_REGIONS.has(event.region)
      const isWest = WEST_REGIONS.has(event.region)
      if (!isEast && !isWest) return

      if (!yearMap.has(event.year)) {
        yearMap.set(event.year, { east: [], west: [] })
      }
      const bucket = yearMap.get(event.year)!
      if (isEast) bucket.east.push(event)
      if (isWest) bucket.west.push(event)
    })

    const rows: EraCompareRow[] = Array.from(yearMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, { east, west }]) => {
        const era = getEra(year)
        return {
          year,
          era: era?.name || '',
          eraColor: era?.color || '#666',
          eastEvents: east.sort((a, b) => b.significance - a.significance),
          westEvents: west.sort((a, b) => b.significance - a.significance),
        }
      })
      .filter(r => r.eastEvents.length > 0 || r.westEvents.length > 0)

    return rows
  }, [events])

  // 按时代分组
  const eraGroups = useMemo(() => {
    const groups: { era: string; color: string; rows: EraCompareRow[] }[] = []
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

  // 统计
  const eastTotal = compareData.reduce((sum, r) => sum + r.eastEvents.length, 0)
  const westTotal = compareData.reduce((sum, r) => sum + r.westEvents.length, 0)
  const excludedTotal = Math.max(0, events.length - eastTotal - westTotal)
  const resonanceCount = compareData.filter(r => r.eastEvents.length > 0 && r.westEvents.length > 0).length

  const toggleResonance = (year: number) => {
    setExpandedResonances(prev => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  const toggleInsight = (era: string) => {
    setExpandedInsights(prev => {
      const next = new Set(prev)
      if (next.has(era)) next.delete(era)
      else next.add(era)
      return next
    })
  }

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-1">东西方对照</h2>
            <p className="text-xs text-muted-foreground">
              同一时间节点，东方与西方各自发生了什么？点击共振行展开解读。
            </p>
            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <span className="text-xs text-muted-foreground">东方 ({eastTotal})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500/60" />
                <span className="text-xs text-muted-foreground">西方 ({westTotal})</span>
              </div>
              {resonanceCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 border-t border-dashed border-amber-500/60" />
                  <span className="text-xs text-muted-foreground">共振 ({resonanceCount})</span>
                </div>
              )}
            </div>
            {excludedTotal > 0 && (
              <p className="mt-3 text-[11px] text-muted-foreground">
                另有 {excludedTotal} 条非东西方事件未纳入本视图，请切换到时间线或矩阵视图查看。
              </p>
            )}
          </div>

          {/* Compare Timeline */}
          <div className="max-w-5xl mx-auto">
            {compareData.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/50 px-6 py-12 text-center">
                <p className="text-sm font-medium text-foreground">当前筛选条件下没有可对照的东西方事件</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  试着放宽地区筛选，或切换到时间线 / 矩阵视图查看全球与非洲等事件。
                </p>
              </div>
            ) : (
              eraGroups.map((group, groupIdx) => {
                const insight = getEraInsight(group.era)
                const isInsightOpen = expandedInsights.has(group.era)

                return (
                  <div key={groupIdx} className="mb-8">
                    {/* Era header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-px" style={{ backgroundColor: group.color + '30' }} />
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ color: group.color, backgroundColor: group.color + '12' }}
                      >
                        {group.era}
                      </span>
                      <div className="flex-1 h-px" style={{ backgroundColor: group.color + '30' }} />
                    </div>

                    {/* 时代对比洞察卡片 */}
                    {insight && (
                      <div className="mb-4">
                        <button
                          onClick={() => toggleInsight(group.era)}
                          className="w-full flex items-center justify-center gap-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Sparkles size={12} className="text-amber-500" />
                          <span>{isInsightOpen ? '收起时代洞察' : '展开时代洞察'}</span>
                          {isInsightOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        {isInsightOpen && (
                          <div
                            className="rounded-xl border p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300"
                            style={{ borderColor: group.color + '25', backgroundColor: group.color + '06' }}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="rounded-lg bg-rose-500/5 border border-rose-500/15 p-3">
                                <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider mb-1.5">东方</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{insight.east}</p>
                              </div>
                              <div className="rounded-lg bg-blue-500/5 border border-blue-500/15 p-3">
                                <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1.5">西方</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{insight.west}</p>
                              </div>
                            </div>
                            <div
                              className="rounded-lg border p-3"
                              style={{ borderColor: group.color + '20', backgroundColor: group.color + '04' }}
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: group.color }}>
                                对比洞察
                              </p>
                              <p className="text-xs text-foreground/80 leading-relaxed italic">
                                {insight.contrast}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      {group.rows.map(row => {
                        const hasBothSides = row.eastEvents.length > 0 && row.westEvents.length > 0
                        const isResonanceOpen = expandedResonances.has(row.year)
                        const resonanceText = hasBothSides
                          ? buildResonanceNarrative(row.year, row.eastEvents, row.westEvents)
                          : null

                        return (
                          <div key={row.year}>
                            <div className="flex gap-2 items-stretch min-h-[40px] relative">
                              {/* East side */}
                              <div className="flex-1 flex flex-col gap-1 items-end">
                                {row.eastEvents.map(event => (
                                  <CompareEventChip
                                    key={event.id}
                                    event={event}
                                    side="east"
                                    onClick={() => onSelectEvent(event)}
                                  />
                                ))}
                              </div>

                              {/* Center year + 共振连线 */}
                              <div className="w-[80px] md:w-[100px] flex-shrink-0 flex flex-col items-center justify-center relative">
                                {hasBothSides && (
                                  <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    preserveAspectRatio="none"
                                  >
                                    <line
                                      x1="0" y1="50%"
                                      x2="100%" y2="50%"
                                      stroke={row.eraColor}
                                      strokeWidth="1"
                                      strokeOpacity="0.35"
                                      strokeDasharray="3 3"
                                    />
                                    <circle
                                      cx="50%" cy="50%"
                                      r="3"
                                      fill={row.eraColor}
                                      opacity="0.5"
                                    >
                                      <animate
                                        attributeName="opacity"
                                        values="0.3;0.7;0.3"
                                        dur="2s"
                                        repeatCount="indefinite"
                                      />
                                    </circle>
                                  </svg>
                                )}
                                <div
                                  className={`w-2 h-2 rounded-full z-[1] ${hasBothSides ? 'ring-2 ring-offset-1 ring-offset-background' : ''}`}
                                  style={{
                                    backgroundColor: row.eraColor,
                                    ...(hasBothSides ? { ringColor: `${row.eraColor}40` } : {}),
                                  }}
                                />
                                <span className="text-[9px] font-mono text-muted-foreground mt-0.5 text-center leading-tight z-[1]">
                                  {formatYear(row.year)}
                                </span>
                                {/* 共振标签（可点击展开解读） */}
                                {hasBothSides && (
                                  <button
                                    onClick={() => toggleResonance(row.year)}
                                    className="text-[7px] text-amber-500/70 hover:text-amber-500 mt-0.5 z-[1] transition-colors flex items-center gap-0.5"
                                    title="展开共振解读"
                                  >
                                    共振
                                    {isResonanceOpen ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
                                  </button>
                                )}
                              </div>

                              {/* West side */}
                              <div className="flex-1 flex flex-col gap-1 items-start">
                                {row.westEvents.map(event => (
                                  <CompareEventChip
                                    key={event.id}
                                    event={event}
                                    side="west"
                                    onClick={() => onSelectEvent(event)}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* 共振解读 */}
                            {isResonanceOpen && resonanceText && (
                              <div className="mx-auto max-w-lg mt-1 mb-2 px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <p className="text-[11px] text-muted-foreground leading-relaxed italic">{resonanceText}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function CompareEventChip({
  event,
  side,
  onClick,
}: {
  event: HistoricalEvent
  side: 'east' | 'west'
  onClick: () => void
}) {
  const catCfg = CATEGORY_CONFIG[event.category]
  const sideColor = side === 'east' ? 'rgba(244,63,94,' : 'rgba(59,130,246,'

  return (
    <button
      onClick={onClick}
      className={`
        max-w-full px-2.5 py-1.5 rounded-lg border text-left
        hover:shadow-md hover:scale-[1.02] transition-all duration-200
        ${side === 'east' ? 'text-right' : 'text-left'}
      `}
      style={{
        backgroundColor: `${sideColor}0.06)`,
        borderColor: `${sideColor}0.15)`,
      }}
    >
      <div className={`flex items-center gap-1.5 ${side === 'east' ? 'flex-row-reverse' : 'flex-row'}`}>
        <RegionFlag region={event.region} size={14} className="flex-shrink-0" />
        <span
          className="text-[10px] font-semibold truncate max-w-[160px] md:max-w-[220px]"
          style={{ color: catCfg.color }}
        >
          {event.title}
        </span>
        {event.significance === 3 && (
          <span className="text-amber-500 text-[9px] flex-shrink-0">★</span>
        )}
      </div>
      {/* 增强：显示 description 摘要 */}
      <p className={`text-[9px] text-muted-foreground/70 mt-0.5 line-clamp-1 ${side === 'east' ? 'text-right' : 'text-left'}`}>
        {event.description}
      </p>
      {event.figure && (
        <p className={`text-[9px] text-muted-foreground mt-0.5 truncate ${side === 'east' ? 'text-right' : 'text-left'}`}>
          {event.figure}
        </p>
      )}
    </button>
  )
}
