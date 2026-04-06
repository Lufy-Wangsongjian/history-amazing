import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarDays, X, Sparkles, Star, Clock, ArrowRight } from 'lucide-react'
import { RegionFlag } from './RegionFlag'
import { CategoryIcon } from './CategoryIcon'

interface TodayInHistoryProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

/** 中文星期名称 */
const WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 历史上的今天 — 封面式升级版
 */
export function TodayInHistory({ open, onClose, events, onSelectEvent }: TodayInHistoryProps) {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const weekday = WEEKDAY_NAMES[today.getDay()]
  const currentYear = today.getFullYear()

  const dayOfYear = getDayOfYear(month, day)
  const yearRatio = dayOfYear / 366

  const todayEvents = useMemo(() => {
    if (!open) return []

    const yearMap = new Map<number, HistoricalEvent[]>()
    events.forEach(e => {
      const arr = yearMap.get(e.year) || []
      arr.push(e)
      yearMap.set(e.year, arr)
    })

    const matched: HistoricalEvent[] = []
    yearMap.forEach(yearEvents => {
      yearEvents.sort((a, b) => a.id.localeCompare(b.id))
      yearEvents.forEach((event, idx) => {
        const eventRatio = yearEvents.length === 1 ? 0.5 : idx / (yearEvents.length - 1)
        if (Math.abs(eventRatio - yearRatio) < 0.015 || yearEvents.length <= 2) {
          if (yearEvents.length <= 2) {
            const hash = simpleHash(event.id)
            const eventDay = hash % 366
            if (Math.abs(eventDay - dayOfYear) <= 2 || Math.abs(eventDay - dayOfYear) >= 364) {
              matched.push(event)
            }
          } else {
            matched.push(event)
          }
        }
      })
    })

    return matched
      .sort((a, b) => {
        if (a.significance !== b.significance) return b.significance - a.significance
        return a.year - b.year
      })
      .slice(0, 20)
  }, [events, open, yearRatio, dayOfYear])

  // 精选"每日一事件"深度推荐 — 选 significance 最高的那条
  const featuredEvent = useMemo(() => {
    if (todayEvents.length === 0) return null
    return todayEvents[0] // 已按 significance 降序排列，第一条就是最重要的
  }, [todayEvents])

  // 剩余事件（去掉精选）
  const otherEvents = useMemo(() => {
    if (!featuredEvent) return todayEvents
    return todayEvents.filter(e => e.id !== featuredEvent.id)
  }, [todayEvents, featuredEvent])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[min(88vh,900px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">

        {/* ===== 封面式头部 ===== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
          {/* 装饰光晕 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_40%)]" />

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>

          <div className="relative z-[1] px-6 py-6 md:py-8">
            {/* 日期大字 */}
            <div className="flex items-end gap-3 mb-4">
              <div className="leading-none">
                <span className="text-5xl md:text-6xl font-black text-white tracking-tight">{day}</span>
              </div>
              <div className="pb-1">
                <div className="text-lg font-bold text-white/90">{month}月</div>
                <div className="text-xs text-slate-400">星期{weekday}</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <CalendarDays size={14} className="text-amber-400" />
                <span className="text-xs text-amber-300/80 font-medium">历史上的今天</span>
              </div>
            </div>

            {/* 统计条 */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Sparkles size={11} className="text-amber-400" />
                <span className="text-slate-200">
                  这一天发生了 <strong className="text-white">{todayEvents.length}</strong> 件大事
                </span>
              </div>
              {todayEvents.filter(e => e.significance === 3).length > 0 && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={10} fill="currentColor" />
                  <span>{todayEvents.filter(e => e.significance === 3).length} 个里程碑</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== 精选深度推荐 ===== */}
        {featuredEvent && (
          <div className="border-b border-border/50 px-5 py-4 bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="flex items-center gap-1.5 mb-2.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
              <Star size={10} fill="currentColor" />
              每日精选推荐
            </div>
            <button
              onClick={() => onSelectEvent(featuredEvent)}
              className="group w-full text-left rounded-xl border border-amber-500/20 bg-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-amber-500/40"
            >
              <div className="flex items-start gap-3.5">
                {/* 分类图标 */}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${CATEGORY_CONFIG[featuredEvent.category].color}18` }}
                >
                  <CategoryIcon category={featuredEvent.category} size={22} className="text-foreground/70" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* N 年前标签 */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      <Clock size={9} />
                      {featuredEvent.year < 0
                        ? `距今约 ${currentYear + Math.abs(featuredEvent.year)} 年`
                        : `${currentYear - featuredEvent.year} 年前的今天`}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{formatYear(featuredEvent.year)}</span>
                  </div>
                  {/* 标题 */}
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5">
                    {featuredEvent.title}
                  </h3>
                  {/* 描述 */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {featuredEvent.description}
                  </p>
                  {/* 元信息 */}
                  <div className="flex items-center gap-3 mt-2.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <RegionFlag region={featuredEvent.region} size={12} />
                      {REGION_CONFIG[featuredEvent.region].label}
                    </span>
                    <span style={{ color: CATEGORY_CONFIG[featuredEvent.category].color }}>
                      {CATEGORY_CONFIG[featuredEvent.category].label}
                    </span>
                    {featuredEvent.figure && (
                      <span className="truncate">· {featuredEvent.figure}</span>
                    )}
                    <span className="ml-auto flex items-center gap-0.5 text-primary group-hover:translate-x-0.5 transition-transform">
                      查看详情 <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* ===== 其余事件列表 ===== */}
        <ScrollArea className="min-h-0 flex-1" type="hover">
          <div className="space-y-2.5 p-5">
            {todayEvents.length === 0 ? (
              <div className="py-12 text-center">
                <Sparkles className="mx-auto mb-3 text-muted-foreground" size={36} />
                <p className="text-sm text-muted-foreground">今天的历史相对平静</p>
                <p className="mt-1 text-xs text-muted-foreground">试试点击"随机穿越"发现更多</p>
              </div>
            ) : otherEvents.length > 0 ? (
              <>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  更多今日事件 ({otherEvents.length})
                </div>
                {otherEvents.map((event, idx) => {
                  const catCfg = CATEGORY_CONFIG[event.category]
                  const yearsAgo = event.year < 0
                    ? currentYear + Math.abs(event.year)
                    : currentYear - event.year
                  return (
                    <div
                      key={event.id}
                      className="today-sequence-in"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <button
                        onClick={() => onSelectEvent(event)}
                        className="group w-full rounded-xl border border-border/50 bg-card/80 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md today-heartbeat"
                        style={{ ['--heartbeat-delay' as string]: `${idx * 200}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <Clock size={8} />
                            {yearsAgo} 年前
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {formatYear(event.year)}
                          </span>
                          <RegionFlag region={event.region} size={12} />
                          <span
                            className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                            style={{ backgroundColor: `${catCfg.color}15`, color: catCfg.color }}
                          >
                            {catCfg.label}
                          </span>
                          {event.significance === 3 && (
                            <span className="text-[9px] text-amber-500">★</span>
                          )}
                        </div>
                        <h3 className="text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary leading-snug">
                          {event.title}
                        </h3>
                        <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                      </button>
                    </div>
                  )
                })}
              </>
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function getDayOfYear(month: number, day: number): number {
  const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let total = 0
  for (let i = 1; i < month; i++) total += daysInMonth[i]
  return total + day
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
