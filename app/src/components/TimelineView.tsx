import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { formatYear, getEra, CATEGORY_CONFIG } from '@/data/types'
import { EventCard } from './EventCard'
import { EraSidebar } from './EraSidebar'
import { TimelineDensityMap } from './TimelineDensityMap'
import { DanmakuOverlay } from './DanmakuOverlay'
import { ERA_OVERVIEWS } from '@/lib/era-overviews'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'
import { ChevronUp, ChevronDown, Sparkles, ArrowUpToLine, Zap, Bookmark, ArrowDownUp, BookOpen } from 'lucide-react'

interface TimelineViewProps {
  events: HistoricalEvent[]
  selectedEvent: HistoricalEvent | null
  onSelectEvent: (event: HistoricalEvent) => void
  focusYear: number | null
  favoriteIds?: Set<string>
  onToggleFavorite?: (eventId: string) => void
}

interface YearGroup {
  year: number
  era: string
  eraColor: string
  events: HistoricalEvent[]
}

const ERA_MOOD_MAP: Record<string, string> = {
  '远古文明': 'ancient', '古典时代': 'classical', '轴心时代': 'axial',
  '帝国时代': 'empire', '中世纪': 'medieval', '文艺复兴前夜': 'prerenaissance',
  '文艺复兴': 'renaissance', '科学革命': 'scientific', '工业时代': 'industrial', '现代': 'modern',
}

// 扁平化 item 类型
type FlatItem =
  | { type: 'era-header'; era: string; color: string; total: number; milestones: number; turningPoints: HistoricalEvent[] }
  | { type: 'era-spectrum'; era: string; catCounts: [string, number][]; total: number }
  | { type: 'era-overview'; era: string }
  | { type: 'year-group'; yearGroup: YearGroup }
  | { type: 'end-marker' }

export function TimelineView({ events, selectedEvent, onSelectEvent, focusYear, favoriteIds, onToggleFavorite }: TimelineViewProps) {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
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

  // ── 数据分组 ──
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
        return { year, era: era?.name || '', eraColor: era?.color || '#666', events: groupedEvents.sort((a, b) => b.significance - a.significance) }
      })
  }, [events])

  const eraGroups = useMemo(() => {
    const groups: { era: string; color: string; yearGroups: YearGroup[] }[] = []
    let currentEra: string | null = null
    yearGroups.forEach((yg) => {
      if (yg.era !== currentEra) {
        currentEra = yg.era
        groups.push({ era: currentEra, color: yg.eraColor, yearGroups: [] })
      }
      groups[groups.length - 1].yearGroups.push(yg)
    })
    return groups
  }, [yearGroups])

  const eraMilestoneStats = useMemo(() => {
    const stats = new Map<string, { total: number; milestones: number }>()
    eraGroups.forEach(g => {
      let milestones = 0, total = 0
      g.yearGroups.forEach(yg => { total += yg.events.length; milestones += yg.events.filter(e => e.significance === 3).length })
      stats.set(g.era, { total, milestones })
    })
    return stats
  }, [eraGroups])

  const turningPoints = useMemo(() => {
    const result = new Map<string, HistoricalEvent[]>()
    eraGroups.forEach((g, i) => {
      if (i >= eraGroups.length - 1) return
      const boundaryYear = eraGroups[i + 1].yearGroups[0]?.year ?? Infinity
      const tps = g.yearGroups.flatMap(yg => yg.events).filter(e => e.significance === 3 && Math.abs(e.year - boundaryYear) <= 50)
      if (tps.length > 0) result.set(g.era, tps)
    })
    return result
  }, [eraGroups])

  const displayEraGroups = useMemo(() => {
    if (!reversed) return eraGroups
    return [...eraGroups].reverse().map(g => ({ ...g, yearGroups: [...g.yearGroups].reverse() }))
  }, [eraGroups, reversed])

  // ── 扁平化为虚拟列表 items ──
  const { flatItems, yearToIndex } = useMemo(() => {
    const items: FlatItem[] = []
    const yrToIdx = new Map<number, number>()

    for (const eraGroup of displayEraGroups) {
      const stats = eraMilestoneStats.get(eraGroup.era)
      const tps = turningPoints.get(eraGroup.era) ?? []
      items.push({ type: 'era-header', era: eraGroup.era, color: eraGroup.color, total: stats?.total ?? 0, milestones: stats?.milestones ?? 0, turningPoints: tps })

      // 色谱条
      const allEvts = eraGroup.yearGroups.flatMap(yg => yg.events)
      if (allEvts.length >= 5) {
        const catCounts: Record<string, number> = {}
        allEvts.forEach(e => { catCounts[e.category] = (catCounts[e.category] || 0) + 1 })
        items.push({ type: 'era-spectrum', era: eraGroup.era, catCounts: Object.entries(catCounts).sort(([, a], [, b]) => b - a), total: allEvts.length })
      }

      // 时代概览
      if (ERA_OVERVIEWS[eraGroup.era]) {
        items.push({ type: 'era-overview', era: eraGroup.era })
      }

      // 年份行
      for (const yg of eraGroup.yearGroups) {
        yrToIdx.set(yg.year, items.length)
        items.push({ type: 'year-group', yearGroup: yg })
      }
    }
    items.push({ type: 'end-marker' })
    return { flatItems: items, yearToIndex: yrToIdx }
  }, [displayEraGroups, eraMilestoneStats, turningPoints])

  // ── 因果关联 ID 集合 ──
  const relatedIdSet = useMemo(() => {
    if (!selectedEvent) return null
    const set = new Set<string>()
    set.add(selectedEvent.id)
    selectedEvent.relatedIds?.forEach(id => set.add(id))
    return set
  }, [selectedEvent])

  // ── 跳转到年份 ──
  const scrollToYear = useCallback((year: number) => {
    if (yearGroups.length === 0 || !virtuosoRef.current) return
    const target = yearGroups.reduce((c, yg) => Math.abs(yg.year - year) < Math.abs(c.year - year) ? yg : c, yearGroups[0])
    const idx = yearToIndex.get(target.year)
    if (idx !== undefined) virtuosoRef.current.scrollToIndex({ index: idx, align: 'start', behavior: 'smooth' })
  }, [yearGroups, yearToIndex])

  // focusYear 跳转
  useEffect(() => {
    if (focusYear !== null) scrollToYear(focusYear)
  }, [focusYear, scrollToYear])

  // 书签
  const [visibleRange, setVisibleRange] = useState({ startIndex: 0, endIndex: 0 })

  const saveBookmark = useCallback(() => {
    // 找当前可见的第一个 year-group item
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      const item = flatItems[i]
      if (item?.type === 'year-group') {
        setBookmarkYear(item.yearGroup.year)
        try { localStorage.setItem('chrono-atlas-bookmark-year', String(item.yearGroup.year)) } catch {}
        return
      }
    }
  }, [visibleRange, flatItems])

  const jumpToBookmark = useCallback(() => {
    if (bookmarkYear !== null) scrollToYear(bookmarkYear)
  }, [bookmarkYear, scrollToYear])

  // 滚动按钮控制
  const scrollTo = useCallback((direction: 'up' | 'down') => {
    scrollRef.current?.scrollBy({ top: direction === 'up' ? -600 : 600, behavior: 'smooth' })
  }, [])

  const scrollToTop = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({ index: 0, behavior: 'smooth' })
  }, [])

  // 时代检测：基于 visibleRange
  useEffect(() => {
    for (let i = visibleRange.startIndex; i <= Math.min(visibleRange.startIndex + 5, visibleRange.endIndex); i++) {
      const item = flatItems[i]
      if (item?.type === 'era-header') {
        setActiveEra(item.era)
        setEraMood(ERA_MOOD_MAP[item.era] || 'modern')
        return
      }
      if (item?.type === 'year-group') {
        setActiveEra(item.yearGroup.era)
        setEraMood(ERA_MOOD_MAP[item.yearGroup.era] || 'modern')
        return
      }
    }
  }, [visibleRange, flatItems])

  const toggleDanmaku = useCallback(() => {
    setDanmakuEnabled(prev => { const next = !prev; try { localStorage.setItem('chrono-atlas-danmaku', next ? '1' : '0') } catch {} return next })
  }, [])

  const handleDensitySelectYear = useCallback((year: number) => scrollToYear(year), [scrollToYear])

  // ── 渲染单个 item ──
  const renderItem = useCallback((index: number) => {
    const item = flatItems[index]
    if (!item) return null

    if (item.type === 'era-header') {
      return (
        <div className="flex items-center gap-3 mb-6 mt-10 first:mt-0" data-era={item.era}>
          <div className="w-[72px] md:w-[140px] text-right pr-4">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: item.color }}>{item.era}</span>
            <div className="text-[9px] text-muted-foreground mt-0.5">{item.total} 事件 · {item.milestones} 里程碑</div>
          </div>
          <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 shadow-sm" style={{ borderColor: item.color, backgroundColor: `${item.color}50` }} />
          <div className="flex-1 relative">
            <div className="h-px" style={{ backgroundColor: `${item.color}30` }} />
            <div className="absolute top-0 left-0 h-px century-ripple" style={{ backgroundColor: item.color, width: '100%', transformOrigin: 'left center' }} />
          </div>
          {item.turningPoints.length > 0 && (
            <div className="flex items-center gap-1 ml-1 flex-shrink-0">
              <Zap size={12} className="text-amber-400 animate-pulse" />
              <span className="text-[9px] text-amber-400 font-medium hidden md:inline">{item.turningPoints.length} 个转折点</span>
            </div>
          )}
        </div>
      )
    }

    if (item.type === 'era-spectrum') {
      return (
        <div className="ml-[84px] md:ml-[156px] mr-4 mb-4 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full overflow-hidden flex" title="类目分布色谱">
            {item.catCounts.map(([cat, count]) => {
              const cfg = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]
              return <div key={cat} className="h-full transition-all duration-300" style={{ width: `${(count / item.total) * 100}%`, backgroundColor: cfg?.color || '#888' }} title={`${cfg?.label || cat}: ${count} 条 (${Math.round((count / item.total) * 100)}%)`} />
            })}
          </div>
          <span className="text-[8px] text-muted-foreground/40 flex-shrink-0 hidden md:inline">色谱</span>
        </div>
      )
    }

    if (item.type === 'era-overview') {
      const ov = ERA_OVERVIEWS[item.era]
      if (!ov) return null
      return (
        <details className="ml-[84px] md:ml-[156px] mr-4 mb-4 group rounded-lg border border-border/40 bg-muted/20">
          <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors">
            <BookOpen size={12} />时代概览：{item.era}
            <ChevronDown size={11} className="ml-auto transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-3 pb-3 space-y-2.5 text-xs text-muted-foreground leading-relaxed">
            <div><span className="font-semibold text-foreground/80">核心主题</span><p className="mt-0.5">{ov.theme}</p></div>
            <div><span className="font-semibold text-foreground/80">关键转折</span><p className="mt-0.5">{ov.turning}</p></div>
            <div><span className="font-semibold text-foreground/80">全球视野</span><p className="mt-0.5">{ov.global}</p></div>
            <div><span className="font-semibold text-foreground/80">遗产总结</span><p className="mt-0.5">{ov.legacy}</p></div>
            {ov.keyData && ov.keyData.length > 0 && (
              <div className="pt-1.5 border-t border-border/30">
                <span className="font-semibold text-foreground/80">关键数据</span>
                <ul className="mt-1 space-y-0.5 list-none">{ov.keyData.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-amber-500 flex-shrink-0 mt-0.5">•</span><span>{d}</span></li>)}</ul>
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
    }

    if (item.type === 'year-group') {
      const { yearGroup } = item
      const hasMilestone = yearGroup.events.some(e => e.significance === 3)
      return (
        <div className="flex gap-3 mb-4 group">
          <div className="w-[72px] md:w-[140px] text-right pr-4 pt-3 flex-shrink-0">
            <span className={`font-mono text-muted-foreground group-hover:text-foreground transition-colors ${hasMilestone ? 'text-xs font-semibold' : 'text-[10px] md:text-xs'}`}>
              {formatYear(yearGroup.year)}
            </span>
            {yearGroup.events.some(e => e.endYear) && (
              <div className="text-[9px] text-muted-foreground/60 mt-0.5">
                {yearGroup.events.filter(e => e.endYear).map(e => <span key={e.id}>→ {formatYear(e.endYear!)}</span>)}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center flex-shrink-0 pt-4">
            <div
              className={`rounded-full border-2 transition-transform group-hover:scale-150 ${hasMilestone ? 'w-3.5 h-3.5 milestone-node-pulse' : yearGroup.events.some(e => e.significance === 2) ? 'w-2.5 h-2.5' : 'w-2 h-2'}`}
              style={{
                borderColor: yearGroup.eraColor,
                backgroundColor: hasMilestone ? yearGroup.eraColor : yearGroup.events.some(e => e.significance === 2) ? `${yearGroup.eraColor}80` : undefined,
                ['--pulse-color' as string]: `${yearGroup.eraColor}50`,
                ['--pulse-color-end' as string]: `${yearGroup.eraColor}00`,
              }}
            />
            {yearGroup.events.some(e => e.endYear) && <div className="w-0.5 mt-0.5 rounded-full opacity-40" style={{ backgroundColor: yearGroup.eraColor, height: '20px' }} />}
          </div>
          <div className="flex-1 flex flex-col gap-2 pb-2">
            {yearGroup.events.map((event) => {
              const causalRole = relatedIdSet ? (relatedIdSet.has(event.id) ? 'related' as const : 'unrelated' as const) : null
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={onSelectEvent}
                  isSelected={selectedEvent?.id === event.id}
                  animationDelay={0}
                  causalRole={causalRole}
                  isFavorite={favoriteIds?.has(event.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              )
            })}
          </div>
        </div>
      )
    }

    if (item.type === 'end-marker') {
      return (
        <div className="flex items-center gap-3 mt-8 mb-16">
          <div className="w-[72px] md:w-[140px]" />
          <div className="w-3 h-3 rounded-full bg-primary/50" />
          <span className="text-xs text-muted-foreground">时间线尽头 · 历史仍在书写...</span>
        </div>
      )
    }

    return null
  }, [flatItems, relatedIdSet, selectedEvent, onSelectEvent, favoriteIds, onToggleFavorite])

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

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-shrink-0">
        <TimelineDensityMap events={events} onSelectYear={handleDensitySelectYear} />
      </div>
      <div className={`flex-1 min-h-0 relative era-atmosphere ${relatedIdSet ? 'timeline-has-selection' : ''}`} data-era-mood={eraMood}>
        <DanmakuOverlay events={events} enabled={danmakuEnabled} onToggle={toggleDanmaku} />
        <EraSidebar events={events} activeEra={activeEra} onSelectEra={scrollToYear} />

        {activeEra && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-card/90 backdrop-blur-md rounded-full border border-border/50 shadow-lg transition-all duration-500">
            <span className="text-xs font-semibold text-foreground">{activeEra}</span>
            {eraMilestoneStats.get(activeEra)?.milestones ? (
              <span className="text-[10px] text-amber-500 ml-2">★ {eraMilestoneStats.get(activeEra)?.milestones} 个里程碑</span>
            ) : null}
          </div>
        )}

        {/* 右侧滚动控制（移动端只显示回到顶部） */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 md:right-4 pointer-events-none">
          <div className="hidden md:flex h-28 w-2 rounded-full bg-card/75 border border-border/40 overflow-hidden shadow-sm pointer-events-auto">
            <div className="w-full self-end rounded-full bg-primary transition-[height] duration-200" style={{ height: `${Math.max(scrollProgress * 100, 8)}%` }} />
          </div>
          <button onClick={() => scrollTo('up')} className="hidden md:block p-2 rounded-full bg-card/85 backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors pointer-events-auto" aria-label="向上滚动"><ChevronUp size={16} /></button>
          <button onClick={() => scrollTo('down')} className="hidden md:block p-2 rounded-full bg-card/85 backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors pointer-events-auto" aria-label="向下滚动"><ChevronDown size={16} /></button>
          {showBackToTop && (
            <button onClick={scrollToTop} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-[11px] font-medium text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 pointer-events-auto">
              <ArrowUpToLine size={13} /><span className="hidden md:inline">回到顶部</span>
            </button>
          )}
          <button onClick={saveBookmark} className={`p-2 rounded-full backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors ${bookmarkYear !== null ? 'bg-amber-500/20 text-amber-500' : 'bg-card/85'}`} aria-label="保存书签" title={bookmarkYear !== null ? `书签：${formatYear(bookmarkYear)}（点击更新）` : '在此处添加书签'}>
            <Bookmark size={16} />
          </button>
          {bookmarkYear !== null && (
            <button onClick={jumpToBookmark} className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 text-[10px] font-medium text-amber-500 shadow-sm hover:bg-amber-500/30 transition-colors" title={`跳转到书签 ${formatYear(bookmarkYear)}`}>
              {formatYear(bookmarkYear)}
            </button>
          )}
          <button onClick={() => setReversed(prev => !prev)} className={`p-2 rounded-full backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors ${reversed ? 'bg-violet-500/20 text-violet-500' : 'bg-card/85'}`} aria-label={reversed ? '切换为正序' : '切换为倒叙'} title={reversed ? '当前倒叙 · 点击正序' : '切换为倒叙模式'}>
            <ArrowDownUp size={16} />
          </button>
        </div>

        {/* ── 虚拟滚动列表 ── */}
        <Virtuoso
          ref={virtuosoRef}
          totalCount={flatItems.length}
          itemContent={renderItem}
          scrollerRef={(ref) => {
            scrollRef.current = ref as HTMLDivElement
            // 将滚动监听直接绑到 Virtuoso 管理的 scroller 元素上
            if (ref) {
              const el = ref as HTMLDivElement
              el.addEventListener('scroll', () => {
                const maxScroll = Math.max(el.scrollHeight - el.clientHeight, 0)
                setScrollProgress(maxScroll === 0 ? 0 : el.scrollTop / maxScroll)
                setShowBackToTop(el.scrollTop > 720)
              }, { passive: true })
            }
          }}
          rangeChanged={setVisibleRange}
          overscan={600}
          style={{ height: '100%', position: 'absolute', inset: 0 }}
          className="px-4 md:px-6"
          components={{
            List: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ style, children, ...props }, ref) => (
              <div ref={ref} {...props} style={style} className="max-w-3xl mx-auto relative pt-16 pb-8">
                <div className="absolute left-[100px] md:left-[140px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                {children}
              </div>
            )),
          }}
        />
      </div>
    </div>
  )
}
