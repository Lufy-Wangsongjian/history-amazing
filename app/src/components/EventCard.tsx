import { useState, useCallback, useEffect } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'
import { buildEventDetailPreview } from '@/lib/event-detail'
import { cn } from '@/lib/utils'
import { ChevronDown, Clock, MapPin, User, Star, Tag, PanelRightOpen, Zap, Heart, Link2 } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { RegionFlag } from './RegionFlag'

interface EventCardProps {
  event: HistoricalEvent
  onClick: (event: HistoricalEvent) => void
  isSelected: boolean
  layout?: 'timeline' | 'compact'
  /** 入场动画延迟（ms），用于 stagger 瀑布效果 */
  animationDelay?: number
  /** 因果关联分类（当有事件选中时）：'related' | 'unrelated' | null */
  causalRole?: 'related' | 'unrelated' | null
  /** 是否已收藏 */
  isFavorite?: boolean
  /** 切换收藏回调 */
  onToggleFavorite?: (eventId: string) => void
}

export function EventCard({ event, onClick, isSelected, layout = 'timeline', animationDelay = 0, causalRole = null, isFavorite = false, onToggleFavorite }: EventCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isThumbError, setIsThumbError] = useState(false)
  const catCfg = CATEGORY_CONFIG[event.category]
  const regionCfg = REGION_CONFIG[event.region]
  const detailPreview = buildEventDetailPreview(event)
  const isMilestone = event.significance === 3
  const isTurningPoint = event.significance === 2
  const eventEra = isMilestone ? getEra(event.year) : undefined
  const thumbnailUrl = event.image

  useEffect(() => {
    setIsThumbError(false)
  }, [event.id])

  /** 里程碑事件的时代装饰 SVG 纹样 */
  const eraDecorPattern = isMilestone && eventEra ? getEraDecorSvg(eventEra.name, catCfg.color) : null

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
          {thumbnailUrl && !isThumbError && (
            <img
              src={thumbnailUrl}
              alt={event.title}
              loading="lazy"
              className="h-6 w-8 rounded object-cover border border-border/40 flex-shrink-0"
              onError={() => setIsThumbError(true)}
            />
          )}
          <span className="text-xs font-medium truncate">{event.title}</span>
          {isMilestone && <span className="text-amber-500 text-[9px] flex-shrink-0">★</span>}
        </div>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'group w-full text-left rounded-xl border transition-all duration-300 relative overflow-hidden',
        // 三级视觉权重：不同的动画入场
        isMilestone ? 'event-card-milestone' : isTurningPoint ? 'event-card-turning' : 'event-card-slice',
        expanded ? 'shadow-lg' : '',
        // 里程碑：大气的发光感
        isMilestone && !expanded && 'hover:shadow-xl hover:-translate-y-1',
        // 转折点：标准悬浮
        isTurningPoint && !expanded && 'hover:shadow-lg hover:-translate-y-0.5',
        // 文明切面：微弱悬浮
        !isMilestone && !isTurningPoint && !expanded && 'hover:shadow-md',
        isSelected
          ? 'border-primary/50 bg-primary/5 shadow-lg ring-1 ring-primary/20'
          : isMilestone
            ? 'border-border/50 bg-card/95 backdrop-blur-sm hover:border-border/80'
            : 'border-border/40 bg-card/90 backdrop-blur-sm hover:border-border/70',
        // 因果关联淡化
        causalRole === 'related' && 'event-card-related',
        causalRole === 'unrelated' && 'event-card-unrelated',
      )}
      style={{
        animationDelay: `${animationDelay}ms`,
        // 里程碑卡片：分类色光晕
        ...(isMilestone && !isSelected ? {
          boxShadow: `0 0 24px ${catCfg.color}15, 0 4px 12px rgba(0,0,0,0.1)`,
          borderLeftWidth: '3px',
          borderLeftColor: catCfg.color,
        } : {}),
        // 转折点卡片：左边框色条
        ...(isTurningPoint && !isSelected ? {
          borderLeftWidth: '2px',
          borderLeftColor: `${catCfg.color}80`,
        } : {}),
      }}
    >
      {/* 顶部类目色条 — 三级透明度 */}
      <div
        className={cn(
          'rounded-t-xl transition-all duration-300',
          isMilestone ? 'h-1.5' : isTurningPoint ? 'h-1' : 'h-0.5'
        )}
        style={{
          background: isMilestone
            ? `linear-gradient(135deg, ${catCfg.color}, ${catCfg.color}90)`
            : catCfg.color,
          opacity: isMilestone ? 1 : isTurningPoint ? 0.6 : 0.2,
        }}
      />

      {/* 里程碑事件：时代装饰纹样封面 */}
      {eraDecorPattern && (
        <div
          className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.06] overflow-hidden rounded-tr-xl"
          style={{
            backgroundImage: `url("${eraDecorPattern}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        />
      )}

      <button
        onClick={handleCardClick}
        className={cn(
          'w-full text-left',
          isMilestone ? 'p-4 md:p-5' : isTurningPoint ? 'p-3.5' : 'p-3'
        )}
      >
        <div className={cn('flex items-start gap-3 mb-1.5', isMilestone && 'gap-4')}>
          {/* 里程碑大号分类图标 */}
          {isMilestone && (
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center milestone-icon-pulse"
              style={{
                backgroundColor: `${catCfg.color}20`,
                ['--icon-pulse-color' as string]: `${catCfg.color}30`,
              }}
            >
              <CategoryIcon category={event.category} size={28} className="text-white/90" />
            </div>
          )}
          <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* 里程碑徽章 */}
            {isMilestone && (
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${catCfg.color}18`,
                    color: catCfg.color,
                  }}
                >
                  <Zap size={9} fill="currentColor" />
                  里程碑
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                  style={{ backgroundColor: `${catCfg.color}10`, color: catCfg.color }}
                >
                  {catCfg.label}
                </span>
              </div>
            )}
            <span className={cn(
              'font-mono text-muted-foreground tracking-tight',
              isMilestone ? 'text-xs font-semibold' : 'text-[11px]'
            )}>
              {formatYear(event.year)}
            </span>
            <h3 className={cn(
              'font-semibold leading-snug mt-1',
              isMilestone && 'text-base md:text-lg',
              isTurningPoint && 'text-[15px]',
              !isMilestone && !isTurningPoint && 'text-sm'
            )}
              style={isMilestone ? { color: catCfg.color } : undefined}
            >
              {event.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 因果关联数量 badge */}
            {event.relatedIds && event.relatedIds.length > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-medium text-purple-400" title={`${event.relatedIds.length} 个因果关联事件`}>
                <Link2 size={8} />
                {event.relatedIds.length}
              </span>
            )}
            <span className="text-xs flex items-center gap-1 text-muted-foreground pt-0.5">
              <RegionFlag region={event.region} size={16} />
              <span className="hidden sm:inline text-[10px]">{regionCfg.label}</span>
            </span>
            <ChevronDown
              size={14}
              className={cn('mt-0.5 text-muted-foreground transition-transform duration-300', expanded && 'rotate-180')}
            />
          </div>
          </div>
        </div>

        {/* 描述摘要（未展开时也可见，hover 时更明显） */}
        {!expanded && !isMilestone && (
          <p className="text-[11px] text-muted-foreground/50 line-clamp-1 mt-1 group-hover:text-muted-foreground/80 transition-colors">
            {event.description}
          </p>
        )}

        {/* 时间跨度条（有 endYear 的持续性事件） */}
        {event.endYear != null && !expanded && (() => {
          const duration = event.endYear - event.year
          if (duration <= 0) return null
          const widthPct = Math.min(Math.max(Math.log2(duration + 1) * 12, 10), 100)
          return (
            <div className="flex items-center gap-2 mt-1" title={`持续 ${duration} 年 (${formatYear(event.year)} — ${formatYear(event.endYear)})`}>
              <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: catCfg.color + '60',
                  }}
                />
              </div>
              <span className="text-[8px] text-muted-foreground/50 flex-shrink-0 tabular-nums">
                {duration}年
              </span>
            </div>
          )
        })()}

        {thumbnailUrl && !isThumbError && (
          <div className="mb-2 rounded-lg overflow-hidden border border-border/40 bg-muted/20">
            <img
              src={thumbnailUrl}
              alt={event.title}
              loading="lazy"
              className="w-full h-24 object-cover"
              onError={() => setIsThumbError(true)}
            />
          </div>
        )}

        <p className={cn(
          'text-muted-foreground leading-relaxed',
          isMilestone ? 'text-sm line-clamp-3' : 'text-xs line-clamp-2'
        )}>
          {event.description}
        </p>

        {/* 里程碑事件：底部 significance 星标行 */}
        {isMilestone && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/20">
            <span className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 3 }, (_, i) => (
                <Star key={i} size={11} fill="currentColor" />
              ))}
            </span>
            <span className="text-[10px] text-muted-foreground">
              对后续数十年甚至数百年的文明演进产生持续影响
            </span>
          </div>
        )}
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
              <RegionFlag region={event.region} size={12} className="inline-block" /> {regionCfg.label}
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">
                点击卡片可展开 / 收起摘要
              </span>
              {onToggleFavorite && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(event.id) }}
                  className={cn(
                    'inline-flex items-center gap-1 text-[11px] transition-colors',
                    isFavorite ? 'text-rose-500 hover:text-rose-400' : 'text-muted-foreground hover:text-rose-500'
                  )}
                  title={isFavorite ? '取消收藏' : '收藏'}
                >
                  <Heart size={11} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? '已收藏' : '收藏'}
                </button>
              )}
            </div>
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

/** 根据时代名称返回装饰用 SVG data URI */
function getEraDecorSvg(eraName: string, accentColor: string): string {
  const c = encodeURIComponent(accentColor)
  const patterns: Record<string, string> = {
    '远古文明': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 100 Q30 60 50 70 Q60 40 80 60 Q100 30 110 50' fill='none' stroke='${c}' stroke-width='2' opacity='0.8'/%3E%3Ccircle cx='60' cy='30' r='12' fill='none' stroke='${c}' stroke-width='1.5' opacity='0.5'/%3E%3Ccircle cx='40' cy='85' r='5' fill='${c}' opacity='0.3'/%3E%3C/svg%3E`,
    '古典时代': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='60,10 90,50 75,90 45,90 30,50' fill='none' stroke='${c}' stroke-width='1.5' opacity='0.6'/%3E%3Cline x1='60' y1='10' x2='60' y2='90' stroke='${c}' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E`,
    '轴心时代': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='20' fill='none' stroke='${c}' stroke-width='1.5' opacity='0.5'/%3E%3Ccircle cx='60' cy='60' r='35' fill='none' stroke='${c}' stroke-width='0.8' opacity='0.3'/%3E%3Ccircle cx='60' cy='60' r='50' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E`,
    '帝国时代': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 100 L60 20 L100 100' fill='none' stroke='${c}' stroke-width='1.5' opacity='0.5'/%3E%3Cline x1='35' y1='70' x2='85' y2='70' stroke='${c}' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='60' cy='20' r='4' fill='${c}' opacity='0.4'/%3E%3C/svg%3E`,
    '中世纪': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 110 L30 40 Q30 15 60 15 Q90 15 90 40 L90 110' fill='none' stroke='${c}' stroke-width='1.5' opacity='0.5'/%3E%3Cline x1='60' y1='15' x2='60' y2='110' stroke='${c}' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E`,
    '文艺复兴前夜': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='30' fill='none' stroke='${c}' stroke-width='1' opacity='0.4'/%3E%3Crect x='30' y='30' width='60' height='60' fill='none' stroke='${c}' stroke-width='0.8' opacity='0.3'/%3E%3C/svg%3E`,
    '文艺复兴': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='35' fill='none' stroke='${c}' stroke-width='1' opacity='0.4'/%3E%3Crect x='25' y='25' width='70' height='70' fill='none' stroke='${c}' stroke-width='0.8' opacity='0.3'/%3E%3Cline x1='60' y1='10' x2='60' y2='110' stroke='${c}' stroke-width='0.4' opacity='0.2'/%3E%3Cline x1='10' y1='60' x2='110' y2='60' stroke='${c}' stroke-width='0.4' opacity='0.2'/%3E%3C/svg%3E`,
    '科学革命': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='60' cy='60' rx='40' ry='20' fill='none' stroke='${c}' stroke-width='1' opacity='0.4' transform='rotate(30 60 60)'/%3E%3Cellipse cx='60' cy='60' rx='40' ry='20' fill='none' stroke='${c}' stroke-width='1' opacity='0.4' transform='rotate(-30 60 60)'/%3E%3Ccircle cx='60' cy='60' r='5' fill='${c}' opacity='0.3'/%3E%3C/svg%3E`,
    '工业时代': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='25' fill='none' stroke='${c}' stroke-width='1.5' opacity='0.4'/%3E%3Ccircle cx='60' cy='60' r='10' fill='none' stroke='${c}' stroke-width='1' opacity='0.3'/%3E%3Cline x1='60' y1='25' x2='60' y2='35' stroke='${c}' stroke-width='2' opacity='0.4'/%3E%3Cline x1='60' y1='85' x2='60' y2='95' stroke='${c}' stroke-width='2' opacity='0.4'/%3E%3Cline x1='25' y1='60' x2='35' y2='60' stroke='${c}' stroke-width='2' opacity='0.4'/%3E%3Cline x1='85' y1='60' x2='95' y2='60' stroke='${c}' stroke-width='2' opacity='0.4'/%3E%3C/svg%3E`,
    '现代': `data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='20' y='20' width='80' height='80' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.3'/%3E%3Crect x='35' y='35' width='50' height='50' fill='none' stroke='${c}' stroke-width='0.5' opacity='0.2'/%3E%3Ccircle cx='20' cy='20' r='2' fill='${c}' opacity='0.4'/%3E%3Ccircle cx='100' cy='20' r='2' fill='${c}' opacity='0.4'/%3E%3Ccircle cx='20' cy='100' r='2' fill='${c}' opacity='0.4'/%3E%3Ccircle cx='100' cy='100' r='2' fill='${c}' opacity='0.4'/%3E%3C/svg%3E`,
  }
  return patterns[eraName] || patterns['现代']
}
