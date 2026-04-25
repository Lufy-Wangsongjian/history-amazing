import { useMemo, useState, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { RegionFlag } from './RegionFlag'
import { Users, X, Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Virtuoso } from 'react-virtuoso'

interface FigureGalleryProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

interface FigureEntry {
  name: string
  events: HistoricalEvent[]
  primaryRegion: string
  primaryCategory: string
  earliestYear: number
}

export function FigureGallery({ open, onClose, events, onSelectEvent }: FigureGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null)

  const figures = useMemo(() => {
    const map = new Map<string, HistoricalEvent[]>()
    events.forEach(e => {
      if (!e.figure) return
      e.figure.split(/[、,，/]/).map(n => n.trim()).filter(Boolean).forEach(name => {
        const arr = map.get(name) || []
        arr.push(e)
        map.set(name, arr)
      })
    })

    return Array.from(map.entries())
      .map(([name, evts]): FigureEntry => {
        const sorted = evts.sort((a, b) => a.year - b.year)
        const regionCount = new Map<string, number>()
        const catCount = new Map<string, number>()
        evts.forEach(e => {
          regionCount.set(e.region, (regionCount.get(e.region) || 0) + 1)
          catCount.set(e.category, (catCount.get(e.category) || 0) + 1)
        })
        const primaryRegion = Array.from(regionCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        const primaryCategory = Array.from(catCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        return {
          name,
          events: sorted,
          primaryRegion,
          primaryCategory,
          earliestYear: sorted[0]?.year || 0,
        }
      })
      .sort((a, b) => a.earliestYear - b.earliestYear)
  }, [events])

  const filteredFigures = useMemo(() => {
    let result = figures
    if (filterCategory) {
      result = result.filter(f => f.primaryCategory === filterCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(f => f.name.toLowerCase().includes(q))
    }
    return result
  }, [figures, searchQuery, filterCategory])

  const categoryStats = useMemo(() => {
    const counts = new Map<string, number>()
    figures.forEach(f => counts.set(f.primaryCategory, (counts.get(f.primaryCategory) || 0) + 1))
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [figures])

  const toggleExpand = useCallback((name: string) => {
    setExpandedFigure(prev => prev === name ? null : name)
  }, [])

  const renderFigure = useCallback((index: number) => {
    const figure = filteredFigures[index]
    if (!figure) return null
    const catCfg = CATEGORY_CONFIG[figure.primaryCategory as keyof typeof CATEGORY_CONFIG]
    const isExpanded = expandedFigure === figure.name
    const showTimeline = figure.events.length >= 2
    const sorted = figure.events
    const minY = sorted[0]?.year ?? 0
    const maxY = sorted[sorted.length - 1]?.year ?? 0
    const span = maxY - minY

    return (
      <div className="px-4 py-1">
        <div
          className="rounded-xl border border-border/40 bg-card/80 hover:border-border/70 transition-all overflow-hidden"
        >
          {/* 主行 — 点击展开/收起 */}
          <button
            onClick={() => toggleExpand(figure.name)}
            className="w-full text-left px-4 py-3 flex items-center gap-3"
          >
            {/* 头像 */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
              style={{ backgroundColor: catCfg ? `${catCfg.color}18` : '#33333318', color: catCfg?.color || '#999' }}
            >
              {figure.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-foreground truncate">{figure.name}</span>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{figure.events.length} 条事件</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
                <RegionFlag region={figure.primaryRegion as any} size={12} />
                <span>{REGION_CONFIG[figure.primaryRegion as keyof typeof REGION_CONFIG]?.label}</span>
                <span className="text-border">·</span>
                <span className="font-medium" style={{ color: catCfg?.color }}>{catCfg?.label}</span>
                <span className="text-border">·</span>
                <span className="font-mono text-[10px]">{formatYear(figure.earliestYear)}</span>
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`text-muted-foreground/50 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {/* 迷你时间轴（≥2 事件，始终显示） */}
          {showTimeline && span > 0 && (
            <div className="px-5 pb-2">
              <div className="relative h-5">
                <div className="absolute top-2.5 left-4 right-4 h-px bg-border/40" />
                <span className="absolute top-3 left-0 text-[8px] text-muted-foreground/50 tabular-nums">{formatYear(minY)}</span>
                <span className="absolute top-3 right-0 text-[8px] text-muted-foreground/50 tabular-nums">{formatYear(maxY)}</span>
                {sorted.map((evt) => {
                  const pct = ((evt.year - minY) / span) * 100
                  const left = 4 + (pct / 100) * 92
                  const evtCat = CATEGORY_CONFIG[evt.category as keyof typeof CATEGORY_CONFIG]
                  return (
                    <button
                      key={evt.id}
                      onClick={(e) => { e.stopPropagation(); onSelectEvent(evt) }}
                      className="absolute top-1 -translate-x-1/2 hover:scale-150 transition-transform"
                      style={{ left: `${left}%` }}
                      title={`${formatYear(evt.year)} ${evt.title}`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full border-2 border-card"
                        style={{ backgroundColor: evtCat?.color || '#888' }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 展开区 — 事件列表 */}
          {isExpanded && (
            <div className="px-4 pb-3 border-t border-border/30 pt-2">
              <div className="space-y-1">
                {sorted.map(evt => {
                  const evtCat = CATEGORY_CONFIG[evt.category as keyof typeof CATEGORY_CONFIG]
                  return (
                    <button
                      key={evt.id}
                      onClick={() => onSelectEvent(evt)}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <span className="text-[10px] font-mono text-muted-foreground w-20 flex-shrink-0 tabular-nums">{formatYear(evt.year)}</span>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: evtCat?.color }} />
                      <span className="text-xs text-foreground truncate group-hover:text-primary transition-colors">{evt.title}</span>
                      {evt.significance === 3 && <span className="text-[9px] text-amber-500 flex-shrink-0">★</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }, [filteredFigures, expandedFigure, toggleExpand, onSelectEvent])

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden gap-0 border-0 h-[min(90vh,850px)]" showCloseButton={false}>
        <DialogTitle className="sr-only">历史人物图鉴</DialogTitle>
        <DialogDescription className="sr-only">按时间排序的历史人物索引</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden h-full">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-950 text-white px-5 py-4 flex-shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(99,102,241,0.15),transparent_50%)]" />
            <div className="relative z-[1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">历史人物图鉴</h2>
                  <p className="text-[10px] text-slate-400">
                    {figures.length} 位历史人物 · 按时间排序
                    {filteredFigures.length !== figures.length && ` · 已筛选 ${filteredFigures.length} 位`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索人物..."
                className="pl-8 h-8 text-xs bg-white/10 border-white/10 text-white placeholder:text-slate-500"
                data-figure-search
              />
            </div>
          </div>

          {/* 领域筛选 */}
          <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-2 flex-shrink-0 border-b border-border/30">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${!filterCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              全部
            </button>
            {categoryStats.slice(0, 10).map(([cat, count]) => {
              const cfg = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${filterCategory === cat ? 'text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                  style={filterCategory === cat ? { backgroundColor: cfg?.color } : undefined}
                >
                  {cfg?.label || cat} {count}
                </button>
              )
            })}
          </div>

          {/* 虚拟滚动人物列表 */}
          <div className="flex-1 min-h-0">
            {filteredFigures.length > 0 ? (
              <Virtuoso
                totalCount={filteredFigures.length}
                itemContent={renderFigure}
                overscan={200}
                style={{ height: '100%' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                未找到匹配的人物
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
