import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'
import { buildEventDetailParagraphs } from '@/lib/event-detail'
import { fetchEventContext } from '@/lib/api'
import {
  Clock,
  MapPin,
  Tag,
  User,
  Star,
  ArrowRight,
  Link2,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  X,
  PanelRightOpen,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RegionFlag } from './RegionFlag'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface EventDetailProps {
  event: HistoricalEvent | null
  events: HistoricalEvent[]
  onClose: () => void
  onNavigate: (event: HistoricalEvent) => void
}

const EMPTY_CONTEXT = {
  contemporaryEvents: [] as HistoricalEvent[],
  sameCategoryEvents: [] as HistoricalEvent[],
  relatedEvents: [] as HistoricalEvent[],
}

export function EventDetail({ event, events, onClose, onNavigate }: EventDetailProps) {
  const catCfg = event ? CATEGORY_CONFIG[event.category] : null
  const regionCfg = event ? REGION_CONFIG[event.region] : null
  const era = event ? getEra(event.year) : null
  const detailParagraphs = useMemo(() => (event ? buildEventDetailParagraphs(event) : []), [event])
  const [context, setContext] = useState(EMPTY_CONTEXT)
  const [loadedContextEventId, setLoadedContextEventId] = useState<string | null>(null)
  const [isImageError, setIsImageError] = useState(false)
  const eventId = event?.id ?? null
  const eventImage = event?.image

  useEffect(() => {
    setIsImageError(false)
  }, [eventId])

  useEffect(() => {
    if (!eventId) {
      return
    }

    const controller = new AbortController()

    fetchEventContext(eventId, controller.signal)
      .then(response => {
        if (controller.signal.aborted) return
        setContext(response)
        setLoadedContextEventId(eventId)
      })
      .catch((fetchError: unknown) => {
        if ((fetchError as DOMException).name === 'AbortError') {
          return
        }

        console.error('加载事件关联上下文失败', fetchError)
        setContext(EMPTY_CONTEXT)
        setLoadedContextEventId(eventId)
      })

    return () => controller.abort()
  }, [eventId])

  const handleNavigate = useCallback((nextEvent: HistoricalEvent) => {
    onNavigate(nextEvent)
  }, [onNavigate])

  const currentIndex = useMemo(() => {
    if (!eventId) return -1
    return events.findIndex(item => item.id === eventId)
  }, [eventId, events])

  const previousEvent = currentIndex > 0 ? events[currentIndex - 1] : null
  const nextEvent = currentIndex >= 0 && currentIndex < events.length - 1 ? events[currentIndex + 1] : null

  if (!event || !catCfg || !regionCfg) {
    return null
  }

  const resolvedContext = eventId && loadedContextEventId === eventId ? context : EMPTY_CONTEXT
  const isContextLoading = !!eventId && loadedContextEventId !== eventId
  const { contemporaryEvents, sameCategoryEvents, relatedEvents } = resolvedContext

  return (
    <Dialog open={!!event} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="left-auto right-0 top-0 h-screen max-h-screen w-full max-w-full translate-x-0 translate-y-0 rounded-none border-l border-border/60 border-t-0 border-b-0 border-r-0 p-0 gap-0 sm:w-[min(760px,92vw)] sm:max-w-[760px] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{event.title}</DialogTitle>
        <DialogDescription className="sr-only">{event.description}</DialogDescription>

        <div className="flex h-full min-h-0 flex-col bg-background">
          <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: catCfg.color }} />

          <div className="border-b border-border/50 bg-card/70 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-start gap-3 justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <PanelRightOpen size={12} className="text-primary" />
                  详情抽屉
                </div>
                <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-foreground">{event.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  保持右侧阅读，左侧时间线仍可作为上下文参考。
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => previousEvent && handleNavigate(previousEvent)}
                  disabled={!previousEvent}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">上一条</span>
                </button>
                <button
                  onClick={() => nextEvent && handleNavigate(nextEvent)}
                  disabled={!nextEvent}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">下一条</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-border/60 p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="关闭详情抽屉"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={12} />
                {formatYear(event.year)}
                {event.endYear && (
                  <>
                    <ArrowRight size={10} />
                    {formatYear(event.endYear)}
                  </>
                )}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={12} />
                <RegionFlag region={event.region} size={14} className="inline-block" /> {regionCfg.label}
              </span>
              <span
                className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${catCfg.color}20`, color: catCfg.color }}
              >
                <Tag size={10} />
                {catCfg.label}
              </span>
              {event.figure && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User size={12} />
                  {event.figure}
                </span>
              )}
              <span className="flex items-center gap-0.5 text-xs text-amber-500">
                {Array.from({ length: event.significance }, (_, index) => (
                  <Star key={index} size={10} fill="currentColor" />
                ))}
              </span>
            </div>

            {event.endYear && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                <Clock size={14} className="text-primary" />
                <span className="text-xs text-foreground">
                  持续 <strong>{event.endYear - event.year}</strong> 年（{formatYear(event.year)} — {formatYear(event.endYear)}）
                </span>
              </div>
            )}

            {/* 历史配图 */}
            {eventImage && !isImageError && (
              <div className="mb-4 rounded-xl border border-border/50 overflow-hidden bg-card/60">
                <div className="relative w-full max-h-[360px] overflow-hidden bg-black/5">
                  <img
                    src={eventImage}
                    alt={event.title}
                    className="w-full h-auto max-h-[360px] object-cover"
                    loading="lazy"
                    onError={() => setIsImageError(true)}
                  />
                </div>
                <div className="px-3 py-1.5 text-[10px] text-muted-foreground/60 text-center border-t border-border/30">
                  历史配图（自动加载）
                </div>
              </div>
            )}

            <div className="mb-4 rounded-xl border border-border/50 bg-card/60 p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            {era && (
              <div
                className="px-4 py-3 rounded-lg mb-6 border"
                style={{
                  backgroundColor: `${era.color}08`,
                  borderColor: `${era.color}30`,
                }}
              >
                <p className="text-xs font-medium" style={{ color: era.color }}>
                  所属时代：{era.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatYear(era.startYear)} — {formatYear(era.endYear)}
                </p>
              </div>
            )}

            <div className="mb-6 rounded-xl border border-border/50 bg-card/60 p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                <ScrollText size={14} className="text-primary" />
                事件详情
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {detailParagraphs.map((paragraph, index) => (
                  <p key={`${event.id}-detail-${index}`} className={index === 0 ? 'text-foreground/90' : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {isContextLoading && (
              <div className="mb-6 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                正在从数据库加载关联事件…
              </div>
            )}

            {relatedEvents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Link2 size={14} className="text-purple-500" />
                  因果关联
                </h3>
                <div className="relative pl-4 border-l-2 border-dashed border-purple-300/50 space-y-2">
                  {relatedEvents.map((relatedEvent, index) => {
                    const relatedCategory = CATEGORY_CONFIG[relatedEvent.category]
                    const relatedRegion = REGION_CONFIG[relatedEvent.region]
                    const isCurrent = relatedEvent.year <= event.year

                    return (
                      <button
                        key={relatedEvent.id}
                        onClick={() => handleNavigate(relatedEvent)}
                        className={`
                          w-full text-left p-2.5 rounded-lg border transition-all
                          hover:border-purple-300/80 hover:bg-purple-500/5
                          ${isCurrent ? 'border-border/50 bg-card/50' : 'border-border/30'}
                        `}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: relatedCategory.color }}
                          />
                          <span className="text-[10px] text-muted-foreground font-mono">{formatYear(relatedEvent.year)}</span>
                          <span className="text-[10px]">{relatedRegion.flag}</span>
                          {index < relatedEvents.length - 1 && (
                            <ArrowRight size={8} className="text-muted-foreground/50 ml-auto" />
                          )}
                        </div>
                        <p className="text-xs font-medium line-clamp-1">{relatedEvent.title}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {contemporaryEvents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-primary" />
                  同时期发生的事
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contemporaryEvents.map((contemporaryEvent) => {
                    const contemporaryCategory = CATEGORY_CONFIG[contemporaryEvent.category]
                    const contemporaryRegion = REGION_CONFIG[contemporaryEvent.region]

                    return (
                      <button
                        key={contemporaryEvent.id}
                        onClick={() => handleNavigate(contemporaryEvent)}
                        className="text-left p-2.5 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: contemporaryCategory.color }}
                          />
                          <span className="text-[10px] text-muted-foreground font-mono">{formatYear(contemporaryEvent.year)}</span>
                          <span className="text-[10px]">{contemporaryRegion.flag}</span>
                        </div>
                        <p className="text-xs font-medium line-clamp-1">{contemporaryEvent.title}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {sameCategoryEvents.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <span
                    className="w-1 h-4 rounded-full"
                    style={{ backgroundColor: catCfg.color }}
                  />
                  {catCfg.label}发展脉络
                </h3>
                <div className="space-y-1.5">
                  {sameCategoryEvents.map((sameCategoryEvent) => {
                    const sameCategoryRegion = REGION_CONFIG[sameCategoryEvent.region]

                    return (
                      <button
                        key={sameCategoryEvent.id}
                        onClick={() => handleNavigate(sameCategoryEvent)}
                        className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-[10px] text-muted-foreground font-mono w-20 text-right flex-shrink-0">
                          {formatYear(sameCategoryEvent.year)}
                        </span>
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: catCfg.color }}
                        />
                        <span className="text-xs flex-1 truncate">{sameCategoryEvent.title}</span>
                        <span className="text-xs">{sameCategoryRegion.flag}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
