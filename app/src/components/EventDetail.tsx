import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'
import { buildEventDetailParagraphs, generateDidYouKnow, buildCausalNarrative, generateExternalLinks, generateImmersiveNarrative, getEraAmbience, generateTimeCapsule, findHistoricalCoincidences, generateCounterfactual, generateContextDimensions, generateNewsReport, generateCoreInsight, generateLegacy } from '@/lib/event-detail'
import { findQuotesForEvent } from '@/lib/literary-quotes'
import { generateRecommendations } from '@/lib/recommendations'
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
  Lightbulb,
  ExternalLink as ExternalLinkIcon,
  ChevronLeft,
  ChevronRight,
  X,
  PanelRightOpen,
  Heart,
  Share2,
  Sparkles,
  Eye,
  CalendarDays,
  Rewind,
  Newspaper,
  ChevronDown,
  TrendingUp,
  Layers,
  Zap,
  Landmark,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RegionFlag } from './RegionFlag'
import { CausalNetworkGraph } from './CausalNetworkGraph'
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
  /** 是否已收藏当前事件 */
  isFavorite?: boolean
  /** 切换收藏状态 */
  onToggleFavorite?: () => void
  /** 分享事件卡片 */
  onShare?: () => void
  /** 已阅读事件 ID 集合（用于智能推荐） */
  readIds?: Set<string>
}

const EMPTY_CONTEXT = {
  contemporaryEvents: [] as HistoricalEvent[],
  sameCategoryEvents: [] as HistoricalEvent[],
  relatedEvents: [] as HistoricalEvent[],
}

export function EventDetail({ event, events, onClose, onNavigate, isFavorite, onToggleFavorite, onShare, readIds }: EventDetailProps) {
  const catCfg = event ? CATEGORY_CONFIG[event.category] : null
  const regionCfg = event ? REGION_CONFIG[event.region] : null
  const era = event ? getEra(event.year) : null
  const detailParagraphs = useMemo(() => (event ? buildEventDetailParagraphs(event) : []), [event])
  const didYouKnowFacts = useMemo(() => (event ? generateDidYouKnow(event) : []), [event])
  const immersiveNarrative = useMemo(() => (event ? generateImmersiveNarrative(event) : null), [event])
  const eraAmbience = useMemo(() => (event ? getEraAmbience(event) : null), [event])
  const timeCapsule = useMemo(() => (event ? generateTimeCapsule(event) : []), [event])
  const externalLinks = useMemo(() => (event ? generateExternalLinks(event) : []), [event])
  const legacyResult = useMemo(() => (event ? generateLegacy(event) : null), [event])
  const literaryQuotes = useMemo(() => (event ? findQuotesForEvent(event) : []), [event])
  const coincidences = useMemo(() => (event ? findHistoricalCoincidences(event, events) : []), [event, events])
  const counterfactual = useMemo(() => (event ? generateCounterfactual(event, events) : null), [event, events])
  const contextDimensions = useMemo(() => (event ? generateContextDimensions(event, events) : []), [event, events])
  const newsReportResult = useMemo(() => (event ? generateNewsReport(event) : null), [event])
  const coreInsight = useMemo(() => (event ? generateCoreInsight(event) : null), [event])
  const recommendations = useMemo(() => (event && readIds ? generateRecommendations(event, events, readIds, 4) : []), [event, events, readIds])
  const sameYearEvents = useMemo(() => {
    if (!event) return []
    const exact = events.filter(e => e.id !== event.id && e.year === event.year)
    if (exact.length >= 3) return exact.slice(0, 10)
    const nearby = events.filter(e => e.id !== event.id && Math.abs(e.year - event.year) <= 5)
      .sort((a, b) => Math.abs(a.year - event.year) - Math.abs(b.year - event.year))
    return nearby.slice(0, 10)
  }, [event, events])
  const [context, setContext] = useState(EMPTY_CONTEXT)
  const [loadedContextEventId, setLoadedContextEventId] = useState<string | null>(null)
  const [isImageError, setIsImageError] = useState(false)
  const [showSameYear, setShowSameYear] = useState(false)
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

  // 键盘导航：← → 方向键切换上一条/下一条，Esc 关闭
  useEffect(() => {
    if (!event) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在输入框中触发
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'ArrowLeft' && previousEvent) {
        e.preventDefault()
        handleNavigate(previousEvent)
      } else if (e.key === 'ArrowRight' && nextEvent) {
        e.preventDefault()
        handleNavigate(nextEvent)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [event, previousEvent, nextEvent, handleNavigate])

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
                {onToggleFavorite && (
                  <button
                    onClick={onToggleFavorite}
                    className={`inline-flex min-h-10 items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      isFavorite
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                        : 'border-border/60 text-muted-foreground hover:bg-accent hover:text-rose-500'
                    }`}
                    title={isFavorite ? '取消收藏' : '收藏此事件'}
                  >
                    <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                    <span className="hidden sm:inline">{isFavorite ? '已收藏' : '收藏'}</span>
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={onShare}
                    className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground font-medium transition-all hover:bg-accent hover:text-foreground"
                    title="生成分享卡片"
                  >
                    <Share2 size={14} />
                    <span className="hidden sm:inline">分享</span>
                  </button>
                )}
                <button
                  onClick={() => previousEvent && handleNavigate(previousEvent)}
                  disabled={!previousEvent}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                  title="上一条 (←)"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">上一条</span>
                </button>
                <button
                  onClick={() => nextEvent && handleNavigate(nextEvent)}
                  disabled={!nextEvent}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                  title="下一条 (→)"
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

            {/* 时间线位置指示器 */}
            <TimelinePositionIndicator year={event.year} eraColor={era?.color} />

            {/* 同年大事对照 */}
            {sameYearEvents.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowSameYear(prev => !prev)}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <CalendarDays size={14} className="text-emerald-500" />
                  同年大事
                  <span className="text-[10px] font-normal text-muted-foreground">
                    ({sameYearEvents.some(e => e.year === event.year) ? `${formatYear(event.year)}年` : `±5年内`}共 {sameYearEvents.length} 件)
                  </span>
                  <span className={`text-xs text-muted-foreground transition-transform ${showSameYear ? 'rotate-90' : ''}`}>▶</span>
                </button>
                {showSameYear && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {sameYearEvents.map(sameEvent => {
                      const sameCategory = CATEGORY_CONFIG[sameEvent.category]
                      const sameRegion = REGION_CONFIG[sameEvent.region]
                      return (
                        <button
                          key={sameEvent.id}
                          onClick={() => handleNavigate(sameEvent)}
                          className="text-left p-2 rounded-lg border border-border/50 hover:border-emerald-400/50 hover:bg-emerald-500/5 transition-all"
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sameCategory.color }} />
                            <span className="text-[10px] text-muted-foreground font-mono">{formatYear(sameEvent.year)}</span>
                            <span className="text-[10px]">{sameRegion.flag}</span>
                          </div>
                          <p className="text-xs font-medium line-clamp-1">{sameEvent.title}</p>
                        </button>
                      )
                    })}
                  </div>
                )}
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

            {literaryQuotes.length > 0 && (
              <div className="mb-6 rounded-xl border border-amber-600/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <ScrollText size={14} className="text-amber-600" />
                  经典引文
                </h3>
                <div className="space-y-3">
                  {literaryQuotes.map((quote, idx) => (
                    <div key={`${event.id}-quote-${idx}`} className="relative pl-4 border-l-2 border-amber-500/40">
                      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line font-serif italic">
                        {quote.text}
                      </p>
                      {quote.translation && (
                        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                          {quote.translation}
                        </p>
                      )}
                      <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 mt-1.5 font-medium">
                        —— {quote.source}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {immersiveNarrative && (
              <div className="mb-6 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 p-4">
                <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Eye size={14} className="text-indigo-400" />
                  如果你在那里
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {immersiveNarrative}
                </p>
              </div>
            )}

            {didYouKnowFacts.length > 0 && (
              <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Lightbulb size={14} className="text-amber-500" />
                  你知道吗
                </h3>
                <div className="space-y-2.5">
                  {didYouKnowFacts.map((fact, index) => (
                    <div key={`${event.id}-dyk-${index}`} className="flex items-start gap-2.5">
                      <span className="text-base flex-shrink-0 mt-0.5">{fact.emoji}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{fact.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {coincidences.length > 0 && (
              <div className="mb-6 rounded-xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-rose-500/5 p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-pink-500" />
                  历史巧合
                </h3>
                <div className="space-y-2.5">
                  {coincidences.map((c, idx) => (
                    <p key={`${event.id}-coin-${idx}`} className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                  ))}
                </div>
              </div>
            )}

            {newsReportResult && (
              <div className="mb-6 rounded-xl border border-stone-500/20 bg-gradient-to-br from-stone-500/5 to-neutral-500/5 p-4">
                <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Newspaper size={14} className="text-stone-500" />
                  历史现场
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic whitespace-pre-line font-serif">
                  {newsReportResult.report}
                </p>
                {newsReportResult.readerComments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-500/10 space-y-2">
                    <p className="text-[10px] text-stone-400 font-medium">假想读者来信</p>
                    {newsReportResult.readerComments.map((c, i) => (
                      <div key={i} className={`text-xs leading-relaxed pl-3 border-l-2 ${c.stance === 'positive' ? 'border-green-400/40 text-green-600 dark:text-green-400' : c.stance === 'negative' ? 'border-red-400/40 text-red-600 dark:text-red-400' : 'border-yellow-400/40 text-yellow-600 dark:text-yellow-400'}`}>
                        {c.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {coreInsight && (
              <div className="mb-6 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 p-4">
                <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Zap size={14} className="text-cyan-500" />
                  一句话读懂
                </h3>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  {coreInsight}
                </p>
              </div>
            )}

            {counterfactual && (
              <div className="mb-6 rounded-xl border border-dashed border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-amber-500/5 p-4">
                <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Rewind size={14} className="text-orange-500" />
                  如果历史重来
                  <span className="text-[10px] font-normal text-orange-400/70 ml-1">思想实验</span>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {counterfactual}
                </p>
              </div>
            )}

            {contextDimensions.length > 0 && (
              <div className="mb-6 space-y-2">
                {contextDimensions.map((dim, idx) => (
                  <details key={`${event.id}-dim-${idx}`} className="group rounded-lg border border-border/50 bg-muted/30">
                    <summary className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg">
                      {dim.icon === 'Clock' && <Clock size={13} className="text-blue-500" />}
                      {dim.icon === 'User' && <User size={13} className="text-green-500" />}
                      {dim.icon === 'Users' && <User size={13} className="text-green-500" />}
                      {dim.icon === 'Layers' && <Layers size={13} className="text-slate-500" />}
                      {dim.icon === 'TrendingUp' && <TrendingUp size={13} className="text-purple-500" />}
                      {dim.label}
                      <ChevronDown size={12} className="ml-auto text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="px-3 pb-3 text-sm text-muted-foreground leading-relaxed">{dim.content}</p>
                  </details>
                ))}
              </div>
            )}

            {timeCapsule.length > 0 && (
              <div className="mb-6 rounded-xl border border-teal-500/20 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Clock size={14} className="text-teal-500" />
                  时间胶囊
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">当这件事发生时的世界 vs 今天</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeCapsule.map((item, idx) => (
                    <div key={idx} className="text-center">
                      <span className="text-lg">{item.emoji}</span>
                      <p className="text-[10px] text-muted-foreground mt-1">{item.label}</p>
                      <p className="text-xs font-semibold text-foreground/80 mt-0.5">{item.then}</p>
                      <div className="text-[9px] text-muted-foreground/60 my-0.5">▼</div>
                      <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{item.now}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isContextLoading && (
              <div className="mb-6 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                正在从数据库加载关联事件…
              </div>
            )}

            {relatedEvents.length > 0 && (
              <CausalNetworkGraph
                event={event}
                relatedEvents={relatedEvents}
                onSelectEvent={handleNavigate}
              />
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
                    const causalText = buildCausalNarrative(event, relatedEvent)
                    const prevEvent = index > 0 ? relatedEvents[index - 1] : null
                    const yearDiff = prevEvent ? Math.abs(relatedEvent.year - prevEvent.year) : 0

                    return (
                      <div key={relatedEvent.id}>
                        {prevEvent && yearDiff > 0 && (
                          <div
                            className="flex items-center justify-center text-[9px] text-muted-foreground/50 font-mono"
                            style={{ height: `${Math.max(16, Math.min(96, 16 + Math.log2(Math.max(yearDiff, 1)) * 8))}px` }}
                          >
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/5 border border-purple-500/10">
                              {yearDiff} 年
                            </span>
                          </div>
                        )}
                        <button
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
                        {causalText && (
                          <p className="mt-1 ml-2 text-[11px] text-muted-foreground/70 leading-relaxed italic pl-2 border-l-2 border-purple-200/30">
                            {causalText}
                          </p>
                        )}
                      </div>
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

            {legacyResult && (
              <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Landmark size={14} className="text-emerald-500" />
                  历史遗产
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{legacyResult.text}</p>
              </div>
            )}

            {externalLinks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/30">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <ExternalLinkIcon size={14} className="text-blue-500" />
                  延伸阅读
                </h3>
                <div className="flex flex-wrap gap-2">
                  {externalLinks.map((link, idx) => (
                    <a
                      key={`${event.id}-ext-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent/50 transition-all"
                    >
                      <ExternalLinkIcon size={10} />
                      {link.label}
                    </a>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground/50">链接指向维基百科搜索页，可能需要进一步筛选结果。</p>
              </div>
            )}

            {eraAmbience && (
              <div className="mt-4 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/20">
                <p className="text-[11px] text-muted-foreground/70 italic leading-relaxed">
                  {eraAmbience}
                </p>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/30">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-cyan-500" />
                  推荐阅读
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">基于你的阅读历史和当前事件智能推荐</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendations.map((rec) => {
                    const recCategory = CATEGORY_CONFIG[rec.event.category]
                    const recRegion = REGION_CONFIG[rec.event.region]
                    return (
                      <button
                        key={rec.event.id}
                        onClick={() => handleNavigate(rec.event)}
                        className="text-left p-2.5 rounded-lg border border-border/50 hover:border-cyan-400/50 hover:bg-cyan-500/5 transition-all group"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: recCategory.color }}
                          />
                          <span className="text-[10px] text-muted-foreground font-mono">{formatYear(rec.event.year)}</span>
                          <span className="text-[10px]">{recRegion.flag}</span>
                          {rec.event.significance === 3 && (
                            <Star size={8} className="text-amber-500" fill="currentColor" />
                          )}
                          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                            {rec.reason}
                          </span>
                        </div>
                        <p className="text-xs font-medium line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{rec.event.title}</p>
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

/** 迷你时间线位置指示器 — 展示事件在 6000 年文明进程中的位置 */
function TimelinePositionIndicator({ year, eraColor }: { year: number; eraColor?: string }) {
  const MIN_YEAR = -4000
  const MAX_YEAR = 2030
  const totalSpan = MAX_YEAR - MIN_YEAR
  const clampedYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year))
  const progress = ((clampedYear - MIN_YEAR) / totalSpan) * 100
  const percentText = Math.round(progress)
  const dotColor = eraColor || '#f59e0b'

  return (
    <div className="mb-6 rounded-lg border border-border/40 bg-card/40 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-muted-foreground">文明进程定位</span>
        <span className="text-[10px] font-mono text-muted-foreground">
          已走过 {percentText}% 的人类文明史
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-muted/60 overflow-hidden">
        {/* 已过进度 */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, #8B7355 0%, #DAA520 25%, #4A6741 50%, #9370DB 70%, #4169E1 100%)`,
            opacity: 0.6,
          }}
        />
        {/* 当前位置圆点 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-background shadow-md transition-all duration-500"
          style={{ left: `${progress}%`, backgroundColor: dotColor }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[9px] text-muted-foreground/60">
        <span>公元前 4000 年</span>
        <span>公元 2030 年</span>
      </div>
    </div>
  )
}
