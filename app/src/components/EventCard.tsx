import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: HistoricalEvent
  onClick: (event: HistoricalEvent) => void
  isSelected: boolean
  layout?: 'timeline' | 'compact'
}

export function EventCard({ event, onClick, isSelected, layout = 'timeline' }: EventCardProps) {
  const catCfg = CATEGORY_CONFIG[event.category]
  const regionCfg = REGION_CONFIG[event.region]

  if (layout === 'compact') {
    return (
      <button
        onClick={() => onClick(event)}
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
    <button
      onClick={() => onClick(event)}
      className={cn(
        'group w-full text-left rounded-xl border transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5',
        isSelected
          ? 'border-primary/50 bg-primary/5 shadow-lg ring-1 ring-primary/20'
          : 'border-border/40 bg-card/90 backdrop-blur-sm hover:border-border/70'
      )}
    >
      {/* significance indicator bar */}
      <div
        className="h-1 rounded-t-xl transition-all duration-300"
        style={{
          backgroundColor: catCfg.color,
          opacity: event.significance === 3 ? 1 : event.significance === 2 ? 0.5 : 0.2,
        }}
      />

      <div className="p-3.5">
        {/* top row: year + region */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono text-muted-foreground tracking-tight">
            {formatYear(event.year)}
          </span>
          <span className="text-xs flex items-center gap-1 text-muted-foreground">
            <span className="text-sm">{regionCfg.flag}</span>
            <span className="text-[10px]">{regionCfg.label}</span>
          </span>
        </div>

        {/* title */}
        <h3 className={cn(
          'font-semibold text-sm leading-snug mb-1.5',
          event.significance === 3 && 'text-[15px]'
        )}>
          {event.title}
        </h3>

        {/* description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
          {event.description}
        </p>

        {/* bottom row: category + figure */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: catCfg.color + '18',
              color: catCfg.color,
            }}
          >
            {catCfg.label}
          </span>
          {event.figure && (
            <span className="text-[10px] text-muted-foreground italic">
              {event.figure}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
