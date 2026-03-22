import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarDays, X, Sparkles } from 'lucide-react'
import { RegionFlag } from './RegionFlag'

interface TodayInHistoryProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

/**
 * 历史上的今天
 * 由于历史事件只有年份数据，我们根据"今天是一年中的第几天"的比例
 * 将事件在同一年内均匀分布，匹配今天对应的日期窗口
 */
export function TodayInHistory({ open, onClose, events, onSelectEvent }: TodayInHistoryProps) {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  // 今天在一年中的比例 (0-1)
  const dayOfYear = getDayOfYear(month, day)
  const yearRatio = dayOfYear / 366

  const todayEvents = useMemo(() => {
    if (!open) return []

    // 按年份分组，每个年份内按 ID 排序后根据索引分配日期比例
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
        // 如果事件对应的"日期"和今天相近（±3天的窗口 ≈ ±0.008）
        if (Math.abs(eventRatio - yearRatio) < 0.015 || yearEvents.length <= 2) {
          // 对于只有1-2个事件的年份，使用更宽松的匹配
          if (yearEvents.length <= 2) {
            // 简单hash决定该事件"属于"哪一天
            const hash = simpleHash(event.id)
            const eventDay = hash % 366
            const todayDay = dayOfYear
            if (Math.abs(eventDay - todayDay) <= 2 || Math.abs(eventDay - todayDay) >= 364) {
              matched.push(event)
            }
          } else {
            matched.push(event)
          }
        }
      })
    })

    // 按年份排序，优先里程碑
    return matched
      .sort((a, b) => {
        if (a.significance !== b.significance) return b.significance - a.significance
        return a.year - b.year
      })
      .slice(0, 20)
  }, [events, open, yearRatio, dayOfYear])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[min(84vh,820px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
        {/* Header */}
        <div className="border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20">
                <CalendarDays size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-foreground">历史上的今天</h2>
                <p className="text-xs text-muted-foreground">
                  {month}月{day}日 — 在漫长的历史中，今天曾发生过什么？
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="min-h-0 flex-1" type="hover">
          <div className="space-y-3 p-5">
            {todayEvents.length === 0 ? (
              <div className="py-12 text-center">
                <Sparkles className="mx-auto mb-3 text-muted-foreground" size={36} />
                <p className="text-sm text-muted-foreground">今天的历史相对平静</p>
                <p className="mt-1 text-xs text-muted-foreground">试试点击"随机穿越"发现更多</p>
              </div>
            ) : (
              todayEvents.map((event, idx) => {
                const catCfg = CATEGORY_CONFIG[event.category]
                return (
                  <div
                    key={event.id}
                    className="today-sequence-in"
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    <button
                      onClick={() => onSelectEvent(event)}
                      className="group w-full rounded-xl border border-border/50 bg-card/80 p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md today-heartbeat"
                      style={{
                        ['--heartbeat-delay' as string]: `${idx * 200}ms`,
                      }}
                    >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {formatYear(event.year)}
                      </span>
                      <RegionFlag region={event.region} size={14} />
                      <span
                        className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: `${catCfg.color}18`,
                          color: catCfg.color,
                        }}
                      >
                        {catCfg.label}
                      </span>
                      {event.significance === 3 && (
                        <span className="text-[10px] text-amber-500">★ 里程碑</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {event.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                    </button>
                  </div>
                )
              })
            )}
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
