import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { formatYear, getEra } from '@/data/types'
import { EventCard } from './EventCard'
import { ChevronUp, ChevronDown, Sparkles, ArrowUpToLine } from 'lucide-react'

interface TimelineViewProps {
  events: HistoricalEvent[]
  selectedEvent: HistoricalEvent | null
  onSelectEvent: (event: HistoricalEvent) => void
  focusYear: number | null
}

interface YearGroup {
  year: number
  era: string
  eraColor: string
  events: HistoricalEvent[]
}

export function TimelineView({ events, selectedEvent, onSelectEvent, focusYear }: TimelineViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeEra, setActiveEra] = useState<string>('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
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
          events: groupedEvents,
        }
      })
  }, [events])

  const eraGroups = useMemo(() => {
    const groups: { era: string; color: string; yearGroups: YearGroup[] }[] = []
    let currentEra = ''

    yearGroups.forEach((yearGroup) => {
      if (yearGroup.era !== currentEra) {
        currentEra = yearGroup.era
        groups.push({ era: currentEra, color: yearGroup.eraColor, yearGroups: [] })
      }
      groups[groups.length - 1].yearGroups.push(yearGroup)
    })

    return groups
  }, [yearGroups])

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
            if (eraName) setActiveEra(eraName)
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
    <div className="flex-1 min-h-0 relative">
      {activeEra && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-card/90 backdrop-blur-md rounded-full border border-border/50 shadow-lg">
          <span className="text-xs font-semibold text-foreground">{activeEra}</span>
        </div>
      )}

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
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScrollState}
        className="h-full overflow-y-auto px-4 md:px-6 py-16 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-[100px] md:left-[140px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          {eraGroups.map((eraGroup, eraIndex) => (
            <div key={`${eraGroup.era}-${eraIndex}`} className="relative">
              <div
                ref={element => {
                  if (element) eraHeaderRefs.current.set(eraGroup.era, element)
                }}
                data-era={eraGroup.era}
                className="flex items-center gap-3 mb-6 mt-8 first:mt-0"
              >
                <div className="w-[100px] md:w-[140px] text-right pr-4">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: eraGroup.color }}
                  >
                    {eraGroup.era}
                  </span>
                </div>
                <div
                  className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: eraGroup.color, backgroundColor: `${eraGroup.color}40` }}
                />
                <div className="flex-1 h-px" style={{ backgroundColor: `${eraGroup.color}30` }} />
              </div>

              {eraGroup.yearGroups.map((yearGroup) => (
                <div
                  key={yearGroup.year}
                  ref={element => {
                    if (element) yearRefs.current.set(yearGroup.year, element)
                  }}
                  className="flex gap-3 mb-4 group"
                >
                  <div className="w-[100px] md:w-[140px] text-right pr-4 pt-3 flex-shrink-0">
                    <span className="text-[10px] md:text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
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

                  <div className="flex flex-col items-center flex-shrink-0 pt-4">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2 border-border bg-background group-hover:scale-150 transition-transform"
                      style={{
                        borderColor: yearGroup.eraColor,
                        backgroundColor: yearGroup.events.some(event => event.significance === 3) ? yearGroup.eraColor : undefined,
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

                  <div className="flex-1 flex flex-col gap-2 pb-2">
                    {yearGroup.events.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={onSelectEvent}
                        isSelected={selectedEvent?.id === event.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="flex items-center gap-3 mt-8">
            <div className="w-[100px] md:w-[140px]" />
            <div className="w-3 h-3 rounded-full bg-primary/50" />
            <span className="text-xs text-muted-foreground">时间线尽头...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
