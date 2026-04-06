import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear, getEra } from '@/data/types'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RegionFlag } from './RegionFlag'
import { CategoryIcon } from './CategoryIcon'
import { Heart, X, Trash2, Sparkles } from 'lucide-react'

interface FavoritesPanelProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  favoriteIds: Set<string>
  onSelectEvent: (event: HistoricalEvent) => void
  onToggleFavorite: (id: string) => void
  onClearAll: () => void
}

export function FavoritesPanel({
  open,
  onClose,
  events,
  favoriteIds,
  onSelectEvent,
  onToggleFavorite,
  onClearAll,
}: FavoritesPanelProps) {
  // 从事件列表中匹配出已收藏的事件
  const favoriteEvents = useMemo(() => {
    if (favoriteIds.size === 0) return []
    return events
      .filter(e => favoriteIds.has(e.id))
      .sort((a, b) => a.year - b.year)
  }, [events, favoriteIds])

  // 按时代分组
  const eraGroups = useMemo(() => {
    const groups: Array<{ era: string; color: string; events: HistoricalEvent[] }> = []
    let currentEra = ''
    favoriteEvents.forEach(event => {
      const era = getEra(event.year)
      const eraName = era?.name || '未知'
      if (eraName !== currentEra) {
        currentEra = eraName
        groups.push({ era: eraName, color: era?.color || '#666', events: [] })
      }
      groups[groups.length - 1].events.push(event)
    })
    return groups
  }, [favoriteEvents])

  // 统计
  const regionCount = useMemo(() => {
    const regions = new Set(favoriteEvents.map(e => e.region))
    return regions.size
  }, [favoriteEvents])

  const categoryCount = useMemo(() => {
    const cats = new Set(favoriteEvents.map(e => e.category))
    return cats.size
  }, [favoriteEvents])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">我的收藏</DialogTitle>
        <DialogDescription className="sr-only">你收藏的历史事件列表</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(85vh,750px)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-pink-950 to-slate-950 text-white px-5 py-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,63,94,0.15),transparent_50%)]" />
            <div className="relative z-[1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Heart size={18} className="text-white" fill="white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">我的收藏</h2>
                  <p className="text-[10px] text-slate-400">
                    {favoriteIds.size > 0
                      ? `${favoriteIds.size} 个事件 · 跨越 ${regionCount} 个地区 · ${categoryCount} 个领域`
                      : '收藏感兴趣的事件，构建你的文明探索路径'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {favoriteIds.size > 0 && (
                  <button
                    onClick={onClearAll}
                    className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    title="清空所有收藏"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              {favoriteEvents.length === 0 ? (
                <div className="py-12 text-center">
                  <Heart className="mx-auto mb-3 text-muted-foreground/40" size={40} />
                  <p className="text-sm text-muted-foreground">还没有收藏任何事件</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    浏览时间线时，点击事件卡片上的 ♡ 按钮收藏
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {eraGroups.map(group => (
                    <div key={group.era}>
                      {/* 时代标题 */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: group.color }} />
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: group.color }}>
                          {group.era}
                        </span>
                        <span className="text-[10px] text-muted-foreground">({group.events.length})</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: `${group.color}20` }} />
                      </div>
                      {/* 事件列表 */}
                      <div className="space-y-1.5">
                        {group.events.map(event => {
                          const catCfg = CATEGORY_CONFIG[event.category]
                          return (
                            <div key={event.id} className="flex items-center gap-2">
                              <button
                                onClick={() => onSelectEvent(event)}
                                className="flex-1 min-w-0 flex items-center gap-2.5 p-2.5 rounded-lg border border-border/40 bg-card/80 hover:border-border hover:bg-accent/50 transition-all text-left"
                              >
                                <div
                                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${catCfg.color}15`, color: catCfg.color }}
                                >
                                  <CategoryIcon category={event.category} size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono text-muted-foreground">{formatYear(event.year)}</span>
                                    <RegionFlag region={event.region} size={10} />
                                    {event.significance === 3 && (
                                      <Sparkles size={9} className="text-amber-500" />
                                    )}
                                  </div>
                                  <p className="text-xs font-medium truncate mt-0.5">{event.title}</p>
                                </div>
                              </button>
                              {/* 取消收藏按钮 */}
                              <button
                                onClick={() => onToggleFavorite(event.id)}
                                className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                                title="取消收藏"
                              >
                                <Heart size={14} fill="currentColor" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
