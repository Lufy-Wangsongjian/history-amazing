import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'
import { historicalEvents } from '@/data/events'
import { Clock, MapPin, Tag, User, Star, ArrowRight, Link2 } from 'lucide-react'
import { useMemo, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface EventDetailProps {
  event: HistoricalEvent | null
  onClose: () => void
  onNavigate: (event: HistoricalEvent) => void
}

export function EventDetail({ event, onClose, onNavigate }: EventDetailProps) {
  const catCfg = event ? CATEGORY_CONFIG[event.category] : null
  const regionCfg = event ? REGION_CONFIG[event.region] : null
  const era = event ? getEra(event.year) : null

  // 同时代事件
  const contemporaryEvents = useMemo(() => {
    if (!event) return []
    const range = 50
    return historicalEvents
      .filter(e =>
        e.id !== event.id &&
        Math.abs(e.year - event.year) <= range
      )
      .sort((a, b) => Math.abs(a.year - event.year) - Math.abs(b.year - event.year))
      .slice(0, 6)
  }, [event])

  // 同类目事件
  const sameCategoryEvents = useMemo(() => {
    if (!event) return []
    return historicalEvents
      .filter(e => e.id !== event.id && e.category === event.category)
      .sort((a, b) => Math.abs(a.year - event.year) - Math.abs(b.year - event.year))
      .slice(0, 4)
  }, [event])

  // 因果关联事件
  const relatedEvents = useMemo(() => {
    if (!event?.relatedIds || event.relatedIds.length === 0) return []
    return event.relatedIds
      .map(id => historicalEvents.find(e => e.id === id))
      .filter((e): e is HistoricalEvent => !!e)
      .sort((a, b) => a.year - b.year)
  }, [event])

  // 处理导航 — 关闭当前然后打开新的
  const handleNavigate = useCallback((e: HistoricalEvent) => {
    onNavigate(e)
  }, [onNavigate])

  if (!event || !catCfg || !regionCfg) {
    return null
  }

  return (
    <Dialog open={!!event} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] p-0 overflow-hidden gap-0"
        showCloseButton={true}
      >
        {/* Header bar */}
        <div
          className="h-2 w-full flex-shrink-0"
          style={{ backgroundColor: catCfg.color }}
        />

        <div className="overflow-y-auto max-h-[calc(85vh-3.5rem)] p-6">
          {/* Hidden dialog title for accessibility */}
          <DialogTitle className="sr-only">{event.title}</DialogTitle>
          <DialogDescription className="sr-only">{event.description}</DialogDescription>

          {/* Meta row */}
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
              {regionCfg.flag} {regionCfg.label}
            </span>
            <span
              className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: catCfg.color + '20', color: catCfg.color }}
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
              {Array.from({ length: event.significance }, (_, i) => (
                <Star key={i} size={10} fill="currentColor" />
              ))}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-4">{event.title}</h2>

          {/* Duration info for endYear events */}
          {event.endYear && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
              <Clock size={14} className="text-primary" />
              <span className="text-xs text-foreground">
                持续 <strong>{event.endYear - event.year}</strong> 年（{formatYear(event.year)} — {formatYear(event.endYear)}）
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {event.description}
          </p>

          {/* Era info */}
          {era && (
            <div
              className="px-4 py-3 rounded-lg mb-6 border"
              style={{
                backgroundColor: era.color + '08',
                borderColor: era.color + '30',
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

          {/* Related Events (causal chain) */}
          {relatedEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                <Link2 size={14} className="text-purple-500" />
                因果关联
              </h3>
              <div className="relative pl-4 border-l-2 border-dashed border-purple-300/50 space-y-2">
                {relatedEvents.map((e, idx) => {
                  const c = CATEGORY_CONFIG[e.category]
                  const r = REGION_CONFIG[e.region]
                  const isCurrent = e.year <= event!.year
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleNavigate(e)}
                      className={`
                        w-full text-left p-2.5 rounded-lg border transition-all
                        hover:border-purple-300/80 hover:bg-purple-500/5
                        ${isCurrent ? 'border-border/50 bg-card/50' : 'border-border/30'}
                      `}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-[10px] text-muted-foreground font-mono">{formatYear(e.year)}</span>
                        <span className="text-[10px]">{r.flag}</span>
                        {idx < relatedEvents.length - 1 && (
                          <ArrowRight size={8} className="text-muted-foreground/50 ml-auto" />
                        )}
                      </div>
                      <p className="text-xs font-medium line-clamp-1">{e.title}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contemporary Events */}
          {contemporaryEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-primary" />
                同时期发生的事
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contemporaryEvents.map(e => {
                  const c = CATEGORY_CONFIG[e.category]
                  const r = REGION_CONFIG[e.region]
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleNavigate(e)}
                      className="text-left p-2.5 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-[10px] text-muted-foreground font-mono">{formatYear(e.year)}</span>
                        <span className="text-[10px]">{r.flag}</span>
                      </div>
                      <p className="text-xs font-medium line-clamp-1">{e.title}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Same Category */}
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
                {sameCategoryEvents.map(e => {
                  const r = REGION_CONFIG[e.region]
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleNavigate(e)}
                      className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-[10px] text-muted-foreground font-mono w-20 text-right flex-shrink-0">
                        {formatYear(e.year)}
                      </span>
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: catCfg.color }}
                      />
                      <span className="text-xs flex-1 truncate">{e.title}</span>
                      <span className="text-xs">{r.flag}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
