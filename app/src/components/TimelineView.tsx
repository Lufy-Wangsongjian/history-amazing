import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, ERAS, formatYear, getEra } from '@/data/types'
import { EventCard } from './EventCard'
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react'

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
  const yearRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const eraHeaderRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // 按年份分组
  const yearGroups = useMemo<YearGroup[]>(() => {
    const map = new Map<number, HistoricalEvent[]>()
    events.forEach(e => {
      const arr = map.get(e.year) || []
      arr.push(e)
      map.set(e.year, arr)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, evts]) => {
        const era = getEra(year)
        return {
          year,
          era: era?.name || '',
          eraColor: era?.color || '#666',
          events: evts,
        }
      })
  }, [events])

  // 按时代分组
  const eraGroups = useMemo(() => {
    const groups: { era: string; color: string; yearGroups: YearGroup[] }[] = []
    let currentEra = ''
    yearGroups.forEach(yg => {
      if (yg.era !== currentEra) {
        currentEra = yg.era
        groups.push({ era: currentEra, color: yg.eraColor, yearGroups: [] })
      }
      groups[groups.length - 1].yearGroups.push(yg)
    })
    return groups
  }, [yearGroups])

  // scroll to focus year
  useEffect(() => {
    if (focusYear !== null) {
      const el = yearRefs.current.get(focusYear)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [focusYear])

  // IntersectionObserver for era tracking (高性能替代 scroll 遍历)
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
        rootMargin: '-30% 0px -60% 0px', // 视口上方 30% 的位置触发
        threshold: 0,
      }
    )

    eraHeaderRefs.current.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [eraGroups])

  const scrollTo = useCallback((direction: 'up' | 'down') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      top: direction === 'up' ? -600 : 600,
      behavior: 'smooth',
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

  return (
    <div className="flex-1 relative">
      {/* Era indicator */}
      {activeEra && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-card/90 backdrop-blur-md rounded-full border border-border/50 shadow-lg">
          <span className="text-xs font-semibold text-foreground">{activeEra}</span>
        </div>
      )}

      {/* Scroll buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button
          onClick={() => scrollTo('up')}
          className="p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => scrollTo('down')}
          className="p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-md hover:bg-accent transition-colors"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="h-full overflow-y-auto px-4 md:px-6 py-16 scroll-smooth">
        <div className="max-w-3xl mx-auto relative">
          {/* Central line */}
          <div className="absolute left-[100px] md:left-[140px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          {eraGroups.map((eraGroup, eraIdx) => (
            <div key={eraIdx} className="relative">
              {/* Era header — observed by IntersectionObserver */}
              <div
                ref={el => { if (el) eraHeaderRefs.current.set(eraGroup.era, el) }}
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
                  style={{ borderColor: eraGroup.color, backgroundColor: eraGroup.color + '40' }}
                />
                <div className="flex-1 h-px" style={{ backgroundColor: eraGroup.color + '30' }} />
              </div>

              {/* Year groups */}
              {eraGroup.yearGroups.map((yg) => (
                <div
                  key={yg.year}
                  ref={el => { if (el) yearRefs.current.set(yg.year, el) }}
                  className="flex gap-3 mb-4 group"
                >
                  {/* Year label */}
                  <div className="w-[100px] md:w-[140px] text-right pr-4 pt-3 flex-shrink-0">
                    <span className="text-[10px] md:text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {formatYear(yg.year)}
                    </span>
                    {/* endYear indicator for span events */}
                    {yg.events.some(e => e.endYear) && (
                      <div className="text-[9px] text-muted-foreground/60 mt-0.5">
                        {yg.events.filter(e => e.endYear).map(e => (
                          <span key={e.id}>→ {formatYear(e.endYear!)}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dot */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-4">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2 border-border bg-background group-hover:scale-150 transition-transform"
                      style={{
                        borderColor: yg.eraColor,
                        backgroundColor: yg.events.some(e => e.significance === 3) ? yg.eraColor : undefined,
                      }}
                    />
                    {/* Span line for endYear events */}
                    {yg.events.some(e => e.endYear) && (
                      <div
                        className="w-0.5 mt-0.5 rounded-full opacity-40"
                        style={{
                          backgroundColor: yg.eraColor,
                          height: '20px',
                        }}
                      />
                    )}
                  </div>

                  {/* Events */}
                  <div className="flex-1 flex flex-col gap-2 pb-2">
                    {yg.events.map(event => (
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

          {/* End marker */}
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
