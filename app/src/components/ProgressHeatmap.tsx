import { useMemo } from 'react'
import type { HistoricalEvent, Category } from '@/data/types'
import { CATEGORY_CONFIG, ERAS } from '@/data/types'
import { Grid3X3 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ProgressHeatmapProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  readIds: Set<string>
}

function getHeatColor(ratio: number): string {
  if (ratio === 0) return 'bg-muted/30'
  if (ratio < 0.25) return 'bg-emerald-500/20'
  if (ratio < 0.50) return 'bg-emerald-500/40'
  if (ratio < 0.75) return 'bg-emerald-500/60'
  return 'bg-amber-500/60'
}

export function ProgressHeatmap({ open, onClose, events, readIds }: ProgressHeatmapProps) {
  const matrix = useMemo(() => {
    // Build era x category matrix
    const data: Array<{
      era: string
      eraColor: string
      cells: Array<{ category: Category; label: string; color: string; total: number; read: number }>
    }> = []

    const categories = Object.entries(CATEGORY_CONFIG) as Array<[Category, typeof CATEGORY_CONFIG[Category]]>

    for (const era of ERAS) {
      const eraEvents = events.filter(e => e.year >= era.startYear && e.year < era.endYear)
      const cells = categories.map(([cat, cfg]) => {
        const total = eraEvents.filter(e => e.category === cat).length
        const read = eraEvents.filter(e => e.category === cat && readIds.has(e.id)).length
        return { category: cat, label: cfg.label, color: cfg.color, total, read }
      })
      data.push({ era: era.name, eraColor: era.color, cells })
    }

    return data
  }, [events, readIds])

  const categories = Object.entries(CATEGORY_CONFIG) as Array<[Category, typeof CATEGORY_CONFIG[Category]]>
  const totalRead = readIds.size
  const totalEvents = events.length
  const overallPct = totalEvents > 0 ? Math.round((totalRead / totalEvents) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden p-0">
        <DialogTitle className="flex items-center gap-2 text-lg font-bold px-5 pt-5">
          <Grid3X3 size={20} className="text-emerald-500" />
          探索热力图
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground px-5">
          颜色越深 = 探索越多。点亮你的知识版图！（已探索 {totalRead}/{totalEvents}，{overallPct}%）
        </DialogDescription>

        <div className="overflow-auto px-5 pb-5 mt-3">
          <div className="min-w-[640px]">
            {/* Header: category labels */}
            <div className="flex items-end gap-0.5 mb-1 pl-24">
              {categories.map(([cat, cfg]) => (
                <div key={cat} className="flex-1 text-center">
                  <span className="text-[8px] text-muted-foreground leading-none block truncate px-0.5">{cfg.label}</span>
                  <div className="w-2 h-2 rounded-full mx-auto mt-0.5" style={{ backgroundColor: cfg.color }} />
                </div>
              ))}
            </div>

            {/* Rows: eras */}
            {matrix.map(row => (
              <div key={row.era} className="flex items-center gap-0.5 mb-0.5">
                <div className="w-24 flex-shrink-0 text-right pr-2">
                  <span className="text-[10px] text-muted-foreground">{row.era}</span>
                </div>
                {row.cells.map(cell => {
                  const ratio = cell.total > 0 ? cell.read / cell.total : 0
                  return (
                    <div
                      key={`${row.era}-${cell.category}`}
                      className={`flex-1 aspect-square rounded-sm ${getHeatColor(ratio)} transition-all hover:ring-1 hover:ring-foreground/20 cursor-default`}
                      title={`${row.era} × ${cell.label}: ${cell.read}/${cell.total} (${cell.total > 0 ? Math.round(ratio * 100) : 0}%)`}
                    />
                  )
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 justify-center text-[10px] text-muted-foreground">
              <span>少</span>
              <div className="w-4 h-4 rounded-sm bg-muted/30" />
              <div className="w-4 h-4 rounded-sm bg-emerald-500/20" />
              <div className="w-4 h-4 rounded-sm bg-emerald-500/40" />
              <div className="w-4 h-4 rounded-sm bg-emerald-500/60" />
              <div className="w-4 h-4 rounded-sm bg-amber-500/60" />
              <span>多</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
