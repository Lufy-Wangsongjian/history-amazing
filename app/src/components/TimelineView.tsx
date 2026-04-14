import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { formatYear, getEra, CATEGORY_CONFIG } from '@/data/types'
import { EventCard } from './EventCard'
import { CausalArcs } from './CausalArcs'
import { EraSidebar } from './EraSidebar'
import { TimelineDensityMap } from './TimelineDensityMap'
import { DanmakuOverlay } from './DanmakuOverlay'
import { ERA_OVERVIEWS } from '@/lib/era-overviews'
import { ChevronUp, ChevronDown, Sparkles, ArrowUpToLine, Zap, Bookmark, ArrowDownUp, BookOpen } from 'lucide-react'

interface TimelineViewProps {
  events: HistoricalEvent[]
  selectedEvent: HistoricalEvent | null
  onSelectEvent: (event: HistoricalEvent) => void
  focusYear: number | null
  /** 收藏 ID 集合 */
  favoriteIds?: Set<string>
  /** 切换收藏 */
  onToggleFavorite?: (eventId: string) => void
}

interface YearGroup {
  year: number
  era: string
  eraColor: string
  events: HistoricalEvent[]
}

/** 时代名称 → 氛围 CSS data-attribute 映射 */
const ERA_MOOD_MAP: Record<string, string> = {
  '远古文明': 'ancient',
  '古典时代': 'classical',
  '轴心时代': 'axial',
  '帝国时代': 'empire',
  '中世纪': 'medieval',
  '文艺复兴前夜': 'prerenaissance',
  '文艺复兴': 'renaissance',
  '科学革命': 'scientific',
  '工业时代': 'industrial',
  '现代': 'modern',
}

export function TimelineView({ events, selectedEvent, onSelectEvent, focusYear, favoriteIds, onToggleFavorite }: TimelineViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeEra, setActiveEra] = useState<string>('')
  const [eraMood, setEraMood] = useState<string>('modern')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [danmakuEnabled, setDanmakuEnabled] = useState(() => {
    try { return localStorage.getItem('chrono-atlas-danmaku') === '1' } catch { return false }
  })
  const [reversed, setReversed] = useState(false)
  const [bookmarkYear, setBookmarkYear] = useState<number | null>(() => {
    try {
      const val = localStorage.getItem('chrono-atlas-bookmark-year')
      return val ? Number(val) : null
    } catch { return null }
  })
  const yearRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const eraHeaderRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const yearGroups = useMemo<YearGroup[]>(() => {
    const map = new Map<number, HistoricalEvent[]>()
    events.forEach(event => {
      const bucket = map.get(event.year) || []
      bucket.push(event)
      map.set(event.year, bucket)
    })

    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, groupedEvents]) => {
        const era = getEra(year)
        return {
          year,
          era: era?.name || '',
          eraColor: era?.color || '#666',
          events: groupedEvents.sort((a, b) => b.significance - a.significance),
        }
      })
  }, [events])

  const eraGroups = useMemo(() => {
    const groups: { era: string; color: string; yearGroups: YearGroup[] }[] = []
    let currentEra: string | null = null

    yearGroups.forEach((yearGroup) => {
      if (yearGroup.era !== currentEra) {
        currentEra = yearGroup.era
        groups.push({ era: currentEra, color: yearGroup.eraColor, yearGroups: [] })
      }
      groups[groups.length - 1].yearGroups.push(yearGroup)
    })

    return groups
  }, [yearGroups])

  // 统计每个时代的里程碑数量（用于时代标题）
  const eraMilestoneStats = useMemo(() => {
    const stats = new Map<string, { total: number; milestones: number }>()
    eraGroups.forEach(g => {
      let milestones = 0
      let total = 0
      g.yearGroups.forEach(yg => {
        total += yg.events.length
        milestones += yg.events.filter(e => e.significance === 3).length
      })
      stats.set(g.era, { total, milestones })
    })
    return stats
  }, [eraGroups])

  // 转折点检测：每个时代末尾±50年内的里程碑
  const turningPoints = useMemo(() => {
    const result = new Map<string, HistoricalEvent[]>()
    eraGroups.forEach((g, i) => {
      if (i >= eraGroups.length - 1) return
      const nextGroup = eraGroups[i + 1]
      const boundaryYear = nextGroup.yearGroups[0]?.year ?? Infinity
      const tps = g.yearGroups
        .flatMap(yg => yg.events)
        .filter(e => e.significance === 3 && Math.abs(e.year - boundaryYear) <= 50)
      if (tps.length > 0) result.set(g.era, tps)
    })
    return result
  }, [eraGroups])

  // 可用于渲染的时代组（支持倒叙）
  const displayEraGroups = useMemo(() => {
    if (!reversed) return eraGroups
    return [...eraGroups].reverse().map(g => ({
      ...g,
      yearGroups: [...g.yearGroups].reverse(),
    }))
  }, [eraGroups, reversed])

  // 书签保存
  const saveBookmark = useCallback(() => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const containerRect = container.getBoundingClientRect()
    let closestYear: number | null = null
    let closestDist = Infinity
    yearRefs.current.forEach((el, year) => {
      const rect = el.getBoundingClientRect()
      const dist = Math.abs(rect.top - containerRect.top - 60)
      if (dist < closestDist) { closestDist = dist; closestYear = year }
    })
    if (closestYear !== null) {
      setBookmarkYear(closestYear)
      try { localStorage.setItem('chrono-atlas-bookmark-year', String(closestYear)) } catch {}
    }
  }, [])

  // 跳到书签
  const jumpToBookmark = useCallback(() => {
    if (bookmarkYear === null) return
    const el = yearRefs.current.get(bookmarkYear)
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    else {
      // 找最近年份
      const target = yearGroups.reduce((closest, yg) =>
        Math.abs(yg.year - bookmarkYear) < Math.abs(closest.year - bookmarkYear) ? yg : closest
      , yearGroups[0])
      if (target) {
        const el2 = yearRefs.current.get(target.year)
        if (el2) el2.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [bookmarkYear, yearGroups])

  useEffect(() => {
    if (focusYear === null) return
    const target = yearRefs.current.get(focusYear)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [focusYear])

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const eraName = entry.target.getAttribute('data-era')
            if (eraName) {
              setActiveEra(eraName)
              setEraMood(ERA_MOOD_MAP[eraName] || 'modern')
            }
          }
        })
      },
      {
        root,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    )

    eraHeaderRefs.current.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [eraGroups])

  const handleScrollState = useCallback(() => {
    if (!scrollRef.current) return

    const element = scrollRef.current
    const maxScroll = Math.max(element.scrollHeight - element.clientHeight, 0)
    const nextProgress = maxScroll === 0 ? 0 : element.scrollTop / maxScroll

    setScrollProgress(nextProgress)
    setShowBackToTop(element.scrollTop > 720)
  }, [])

  const scrollTo = useCallback((direction: 'up' | 'down') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      top: direction === 'up' ? -600 : 600,
      behavior: 'smooth',
    })
  }, [])

  const scrollToTop = useCallback(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // 筛选变化标识 key，变化时让卡片重新挂载以触发入场动画
  const filterKey = useMemo(() => {
    if (events.length === 0) return 'empty'
    return `${events.length}-${events[0]?.id}-${events[events.length - 1]?.id}`
  }, [events])

  // 因果关联 ID 集合（选中事件+其 relatedIds）
  const relatedIdSet = useMemo(() => {
    if (!selectedEvent) return null
    const set = new Set<string>()
    set.add(selectedEvent.id)
    selectedEvent.relatedIds?.forEach(id => set.add(id))
    return set
  }, [selectedEvent])

  const handleDensitySelectYear = useCallback((year: number) => {
    if (yearGroups.length === 0) return
    const target = yearGroups.reduce((closest, yg) =>
      Math.abs(yg.year - year) < Math.abs(closest.year - year) ? yg : closest
    , yearGroups[0])
    if (target) {
      const el = yearRefs.current.get(target.year)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [yearGroups])

  const toggleDanmaku = useCallback(() => {
    setDanmakuEnabled(prev => {
      const next = !prev
      try { localStorage.setItem('chrono-atlas-danmaku', next ? '1' : '0') } catch {}
      return next
    })
  }, [])

  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-sm text-muted-foreground">没有匹配的事件</p>
          <p className="text-xs text-muted-foreground mt-1">尝试调整筛选条件</p>
        </div>
      </div>
    )
  }

  // 全局 stagger 计数器
  let staggerIndex = 0

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <TimelineDensityMap events={events} onSelectYear={handleDensitySelectYear} />
    <div className={`flex-1 min-h-0 relative era-atmosphere ${relatedIdSet ? 'timeline-has-selection' : ''}`} data-era-mood={eraMood}>
      {/* 弹幕层 */}
      <DanmakuOverlay
        events={events}
        enabled={danmakuEnabled}
        onToggle={toggleDanmaku}
      />

      {/* 时代侧边快速跳转条 */}
      <EraSidebar
        events={events}
        activeEra={activeEra}
        onSelectEra={(year) => {
          // 找到最接近的年份组
          const target = yearGroups.reduce((closest, yg) =>
            Math.abs(yg.year - year) < Math.abs(closest.year - year) ? yg : closest
          , yearGroups[0])
          if (target) {
            const el = yearRefs.current.get(target.year)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
      />

      {/* 顶部时代浮动标签 */}
      {activeEra && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-card/90 backdrop-blur-md rounded-full border border-border/50 shadow-lg transition-all duration-500">
          <span className="text-xs font-semibold text-foreground">{activeEra}</span>
          {eraMilestoneStats.get(activeEra)?.milestones ? (
            <span className="text-[10px] text-amber-500 ml-2">
              ★ {eraMilestoneStats.get(activeEra)?.milestones} 个里程碑
            </span>
          ) : null}
        </div>
      )}

      {/* 右侧滚动控制 */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 md:right-4">
        <div className="hidden md:flex h-28 w-2 rounded-full bg-card/75 border border-border/40 overflow-hidden shadow-sm">
          <div
            className="w-full self-end rounded-full bg-primary transition-[height] duration-200"
            style={{ height: `${Math.max(scrollProgress * 100, 8)}%` }}
          />
        </div>
        <button
          onClick={() => scrollTo('up')}
          className="p-2 rounded-full bg-card/85 backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors"
          aria-label="向上滚动"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => scrollTo('down')}
          className="p-2 rounded-full bg-card/85 backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors"
          aria-label="向下滚动"
        >
          <ChevronDown size={16} />
        </button>
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-[11px] font-medium text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <ArrowUpToLine size={13} />
            <span className="hidden md:inline">回到顶部</span>
          </button>
        )}
        <button
          onClick={saveBookmark}
          className={`p-2 rounded-full backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors ${bookmarkYear !== null ? 'bg-amber-500/20 text-amber-500' : 'bg-card/85'}`}
          aria-label="保存书签"
          title={bookmarkYear !== null ? `书签：${formatYear(bookmarkYear)}（点击更新）` : '在此处添加书签'}
        >
          <Bookmark size={16} />
        </button>
        {bookmarkYear !== null && (
          <button
            onClick={jumpToBookmark}
            className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 text-[10px] font-medium text-amber-500 shadow-sm hover:bg-amber-500/30 transition-colors"
            title={`跳转到书签 ${formatYear(bookmarkYear)}`}
          >
            {formatYear(bookmarkYear)}
          </button>
        )}
        <button
          onClick={() => setReversed(prev => !prev)}
          className={`p-2 rounded-full backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors ${reversed ? 'bg-violet-500/20 text-violet-500' : 'bg-card/85'}`}
          aria-label={reversed ? '切换为正序' : '切换为倒叙'}
          title={reversed ? '当前倒叙 · 点击正序' : '切换为倒叙模式'}
        >
          <ArrowDownUp size={16} />
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScrollState}
        className="h-full overflow-y-auto px-4 md:px-6 py-16 scroll-smooth relative z-[1]"
      >
        <div key={filterKey} className="max-w-3xl mx-auto relative filter-enter">
          {/* 因果弧线 SVG 层 */}
          <CausalArcs
            selectedEvent={selectedEvent}
            events={events}
            containerRef={scrollRef}
            yearRefs={yearRefs}
          />

          {/* 时间轴线 */}
          <div className="absolute left-[100px] md:left-[140px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          {displayEraGroups.map((eraGroup, eraIndex) => {
            const stats = eraMilestoneStats.get(eraGroup.era)
            const tps = turningPoints.get(eraGroup.era)
            return (
              <div key={`${eraGroup.era}-${eraIndex}`} className="relative">
                {/* 时代分界标题 */}
                <div
                  ref={element => {
                    if (element) eraHeaderRefs.current.set(eraGroup.era, element)
                  }}
                  data-era={eraGroup.era}
                  className="flex items-center gap-3 mb-6 mt-10 first:mt-0"
                >
                  <div className="w-[100px] md:w-[140px] text-right pr-4">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: eraGroup.color }}
                    >
                      {eraGroup.era}
                    </span>
                    {stats && (
                      <div className="text-[9px] text-muted-foreground mt-0.5">
                        {stats.total} 事件 · {stats.milestones} 里程碑
                      </div>
                    )}
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 shadow-sm"
                    style={{ borderColor: eraGroup.color, backgroundColor: `${eraGroup.color}50` }}
                  />
                  <div className="flex-1 relative">
                    <div className="h-px" style={{ backgroundColor: `${eraGroup.color}30` }} />
                    {/* 世纪涟漪装饰线 */}
                    <div
                      className="absolute top-0 left-0 h-px century-ripple"
                      style={{
                        backgroundColor: eraGroup.color,
                        width: '100%',
                        transformOrigin: 'left center',
                      }}
                    />
                  </div>
                  {/* 转折点高亮标记 */}
                  {tps && tps.length > 0 && (
                    <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                      <Zap size={12} className="text-amber-400 animate-pulse" />
                      <span className="text-[9px] text-amber-400 font-medium hidden md:inline">
                        {tps.length} 个转折点
                      </span>
                    </div>
                  )}
                </div>

                {/* 时代情绪色谱条 */}
                {(() => {
                  const allEvents = eraGroup.yearGroups.flatMap(yg => yg.events)
                  if (allEvents.length < 5) return null
                  const catCounts: Record<string, number> = {}
                  allEvents.forEach(e => { catCounts[e.category] = (catCounts[e.category] || 0) + 1 })
                  const sorted = Object.entries(catCounts).sort(([,a], [,b]) => b - a)
                  const total = allEvents.length
                  return (
                    <div className="ml-[116px] md:ml-[156px] mr-4 mb-4 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full overflow-hidden flex" title="类目分布色谱">
                        {sorted.map(([cat, count]) => {
                          const cfg = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]
                          return (
                            <div
                              key={cat}
                              className="h-full transition-all duration-300"
                              style={{
                                width: `${(count / total) * 100}%`,
                                backgroundColor: cfg?.color || '#888',
                              }}
                              title={`${cfg?.label || cat}: ${count} 条 (${Math.round((count / total) * 100)}%)`}
                            />
                          )
                        })}
                      </div>
                      <span className="text-[8px] text-muted-foreground/40 flex-shrink-0 hidden md:inline">色谱</span>
                    </div>
                  )
                })()}

                {/* 时代概览深度面板 */}
                {(() => {
                  const ov = ERA_OVERVIEWS[eraGroup.era]
                  if (!ov) return null
                  return (
                    <details className="ml-[116px] md:ml-[156px] mr-4 mb-4 group rounded-lg border border-border/40 bg-muted/20">
                      <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors">
                        <BookOpen size={12} />
                        时代概览：{eraGroup.era}
                        <ChevronDown size={11} className="ml-auto transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-3 pb-3 space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                        <div>
                          <span className="font-semibold text-foreground/80">核心主题</span>
                          <p className="mt-0.5">{ov.theme}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground/80">关键转折</span>
                          <p className="mt-0.5">{ov.turning}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground/80">全球视野</span>
                          <p className="mt-0.5">{ov.global}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground/80">遗产总结</span>
                          <p className="mt-0.5">{ov.legacy}</p>
                        </div>
                        {ov.keyData && ov.keyData.length > 0 && (
                          <div className="pt-1.5 border-t border-border/30">
                            <span className="font-semibold text-foreground/80">关键数据</span>
                            <ul className="mt-1 space-y-0.5 list-none">
                              {ov.keyData.map((d, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {ov.oneThingToRemember && (
                          <div className="pt-1.5 border-t border-border/30 bg-primary/5 -mx-3 px-3 pb-2 rounded-b-lg">
                            <span className="font-semibold text-primary/80">如果你只记住一件事</span>
                            <p className="mt-0.5 text-foreground/90 font-medium">{ov.oneThingToRemember}</p>
                          </div>
                        )}
                      </div>
                    </details>
                  )
                })()}

                {eraGroup.yearGroups.map((yearGroup) => {
                  const hasMilestone = yearGroup.events.some(event => event.significance === 3)

                  return (
                    <div
                      key={yearGroup.year}
                      ref={element => {
                        if (element) yearRefs.current.set(yearGroup.year, element)
                      }}
                      className="flex gap-3 mb-4 group"
                    >
                      {/* 年份标签 */}
                      <div className="w-[100px] md:w-[140px] text-right pr-4 pt-3 flex-shrink-0">
                        <span className={`font-mono text-muted-foreground group-hover:text-foreground transition-colors ${
                          hasMilestone ? 'text-xs font-semibold' : 'text-[10px] md:text-xs'
                        }`}>
                          {formatYear(yearGroup.year)}
                        </span>
                        {yearGroup.events.some(event => event.endYear) && (
                          <div className="text-[9px] text-muted-foreground/60 mt-0.5">
                            {yearGroup.events.filter(event => event.endYear).map(event => (
                              <span key={event.id}>→ {formatYear(event.endYear!)}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 时间线节点 — 三级视觉 */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-4">
                        <div
                          className={`rounded-full border-2 transition-transform group-hover:scale-150 ${
                            hasMilestone
                              ? 'w-3.5 h-3.5 milestone-node-pulse'
                              : yearGroup.events.some(e => e.significance === 2)
                                ? 'w-2.5 h-2.5'
                                : 'w-2 h-2'
                          }`}
                          style={{
                            borderColor: yearGroup.eraColor,
                            backgroundColor: hasMilestone
                              ? yearGroup.eraColor
                              : yearGroup.events.some(e => e.significance === 2)
                                ? `${yearGroup.eraColor}80`
                                : undefined,
                            ['--pulse-color' as string]: `${yearGroup.eraColor}50`,
                            ['--pulse-color-end' as string]: `${yearGroup.eraColor}00`,
                          }}
                        />
                        {yearGroup.events.some(event => event.endYear) && (
                          <div
                            className="w-0.5 mt-0.5 rounded-full opacity-40"
                            style={{
                              backgroundColor: yearGroup.eraColor,
                              height: '20px',
                            }}
                          />
                        )}
                      </div>

                      {/* 事件卡片列表 — stagger 入场 */}
                      <div className="flex-1 flex flex-col gap-2 pb-2">
                        {yearGroup.events.map((event) => {
                          const delay = staggerIndex * 40
                          staggerIndex++
                          const causalRole = relatedIdSet
                            ? relatedIdSet.has(event.id) ? 'related' as const : 'unrelated' as const
                            : null
                          return (
                            <EventCard
                              key={event.id}
                              event={event}
                              onClick={onSelectEvent}
                              isSelected={selectedEvent?.id === event.id}
                              animationDelay={delay}
                              causalRole={causalRole}
                              isFavorite={favoriteIds?.has(event.id)}
                              onToggleFavorite={onToggleFavorite}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* 时间线尽头 */}
          <div className="flex items-center gap-3 mt-8">
            <div className="w-[100px] md:w-[140px]" />
            <div className="w-3 h-3 rounded-full bg-primary/50" />
            <span className="text-xs text-muted-foreground">时间线尽头 · 历史仍在书写...</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
