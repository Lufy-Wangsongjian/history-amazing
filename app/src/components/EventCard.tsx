import { useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { buildEventDetailPreview } from '@/lib/event-detail'
import { cn } from '@/lib/utils'
import { ChevronDown, Clock, MapPin, User, Star, Tag, PanelRightOpen } from 'lucide-react'

interface EventCardProps {
  event: HistoricalEvent
  onClick: (event: HistoricalEvent) => void
  isSelected: boolean
  layout?: 'timeline' | 'compact'
}

export function EventCard({ event, onClick, isSelected, layout = 'timeline' }: EventCardProps) {
  const [expanded, setExpanded] = useState(false)
  const catCfg = CATEGORY_CONFIG[event.category]
  const regionCfg = REGION_CONFIG[event.region]
  const detailPreview = buildEventDetailPreview(event)

  const handleCardClick = useCallback(() => {
    if (layout === 'compact') {
      onClick(event)
      return
    }

    setExpanded(prev => !prev)
  }, [event, layout, onClick])

  const handleOpenDetail = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClick(event)
  }, [event, onClick])

  if (layout === 'compact') {
    return (
      <button
        onClick={handleCardClick}
        className={cn(
          'w-full text-left p-2 rounded-lg border transition-all duration-200',
          'hover:shadow-md hover:scale-[1.02]',
          isSelected
            ? 'border-primary bg-primary/5 shadow-md'
            : 'border-border/50 bg-card/80 hover:border-border'
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: catCfg.color }}
          />
          <span className="text-[10px] text-muted-foreground">{formatYear(event.year)}</span>
          <span className="text-xs font-medium truncate">{event.title}</span>
        </div>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'group w-full text-left rounded-xl border transition-all duration-300',
        expanded ? 'shadow-lg' : 'hover:shadow-lg hover:-translate-y-0.5',
        isSelected
          ? 'border-primary/50 bg-primary/5 shadow-lg ring-1 ring-primary/20'
          : 'border-border/40 bg-card/90 backdrop-blur-sm hover:border-border/70'
      )}
    >
      <div
        className="h-1 rounded-t-xl transition-all duration-300"
        style={{
          backgroundColor: catCfg.color,
          opacity: event.significance === 3 ? 1 : event.significance === 2 ? 0.5 : 0.2,
        }}
      />

      <button
        onClick={handleCardClick}
        className="w-full text-left p-3.5"
      >
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div>
            <span className="text-[11px] font-mono text-muted-foreground tracking-tight">
              {formatYear(event.year)}
            </span>
            <h3 className={cn(
              'font-semibold text-sm leading-snug mt-1.5',
              event.significance === 3 && 'text-[15px]'
            )}>
              {event.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs flex items-center gap-1 text-muted-foreground pt-0.5">
              <span className="text-sm">{regionCfg.flag}</span>
              <span className="hidden sm:inline text-[10px]">{regionCfg.label}</span>
            </span>
            <ChevronDown
              size={14}
              className={cn('mt-0.5 text-muted-foreground transition-transform duration-300', expanded && 'rotate-180')}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-3.5 pb-4 pt-1 border-t border-border/30">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 mb-3">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock size={11} className="text-muted-foreground/70" />
              {formatYear(event.year)}
              {event.endYear && ` — ${formatYear(event.endYear)}`}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin size={11} className="text-muted-foreground/70" />
              {regionCfg.flag} {regionCfg.label}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Tag size={11} className="text-muted-foreground/70" />
              {catCfg.label}
            </span>
            {event.figure && (
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <User size={11} className="text-muted-foreground/70" />
                {event.figure}
              </span>
            )}
            <span className="flex items-center gap-0.5 text-[11px] text-amber-500">
              {Array.from({ length: event.significance }, (_, i) => (
                <Star key={i} size={10} fill="currentColor" />
              ))}
            </span>
          </div>

          {event.endYear && (
            <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-md bg-primary/5 border border-primary/15">
              <Clock size={12} className="text-primary" />
              <span className="text-[11px] text-foreground">
                持续 <strong>{event.endYear - event.year}</strong> 年
              </span>
            </div>
          )}

          <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
            {detailPreview.map((paragraph, index) => (
              <p key={`${event.id}-preview-${index}`} className={index > 0 ? 'text-foreground/80' : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground">
              点击卡片可展开 / 收起摘要
            </span>
            <button
              onClick={handleOpenDetail}
              className="text-[11px] text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
            >
              <PanelRightOpen size={12} />
              打开完整详情
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
