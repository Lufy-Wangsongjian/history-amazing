import { useMemo, useState } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RegionFlag } from './RegionFlag'
import { Users, X, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

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
        // 最常出现的地区和类目
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
      .sort((a, b) => b.events.length - a.events.length)
  }, [events])

  const filteredFigures = useMemo(() => {
    if (!searchQuery.trim()) return figures
    const q = searchQuery.trim().toLowerCase()
    return figures.filter(f => f.name.toLowerCase().includes(q))
  }, [figures, searchQuery])

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">历史人物图鉴</DialogTitle>
        <DialogDescription className="sr-only">按事件数量排序的历史人物索引</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(85vh,750px)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-950 text-white px-5 py-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(99,102,241,0.15),transparent_50%)]" />
            <div className="relative z-[1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">历史人物图鉴</h2>
                  <p className="text-[10px] text-slate-400">
                    {figures.length} 位历史人物 · 按出场次数排序
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
            {/* 搜索框 */}
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索人物..."
                className="pl-8 h-8 text-xs bg-white/10 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* 人物列表 */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-1.5">
              {filteredFigures.slice(0, 100).map(figure => {
                const catCfg = CATEGORY_CONFIG[figure.primaryCategory as keyof typeof CATEGORY_CONFIG]
                return (
                  <div
                    key={figure.name}
                    className="rounded-lg border border-border/40 bg-card/80 p-3 hover:border-border hover:bg-accent/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {/* 头像占位符 */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: catCfg ? `${catCfg.color}20` : '#33333320', color: catCfg?.color || '#999' }}
                      >
                        {figure.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{figure.name}</span>
                          <span className="text-[10px] text-muted-foreground">{figure.events.length} 条事件</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                          <RegionFlag region={figure.primaryRegion as any} size={10} />
                          <span>{REGION_CONFIG[figure.primaryRegion as keyof typeof REGION_CONFIG]?.label}</span>
                          <span>·</span>
                          <span style={{ color: catCfg?.color }}>{catCfg?.label}</span>
                          <span>·</span>
                          <span>{formatYear(figure.earliestYear)}</span>
                        </div>
                      </div>
                    </div>
                    {/* 关联事件 */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {figure.events.slice(0, 4).map(evt => (
                        <button
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          className="text-[10px] px-2 py-0.5 rounded-full border border-border/40 bg-muted/30 hover:bg-accent/50 hover:border-border transition-colors truncate max-w-[180px]"
                        >
                          {formatYear(evt.year)} {evt.title}
                        </button>
                      ))}
                      {figure.events.length > 4 && (
                        <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                          +{figure.events.length - 4} 更多
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
