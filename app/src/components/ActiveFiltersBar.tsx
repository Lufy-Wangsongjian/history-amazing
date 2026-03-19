import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, RotateCcw, SlidersHorizontal } from 'lucide-react'

export interface ActiveFilterItem {
  id: string
  label: string
  onRemove: () => void
}

interface ActiveFiltersBarProps {
  filters: ActiveFilterItem[]
  resultCount: number
  onClearAll: () => void
}

export function ActiveFiltersBar({ filters, resultCount, onClearAll }: ActiveFiltersBarProps) {
  if (filters.length === 0) {
    return null
  }

  return (
    <div className="border-b border-border/50 bg-card/65 px-4 py-3 backdrop-blur-sm md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal size={13} className="text-primary" />
            当前已应用 {filters.length} 个筛选条件，命中
            <strong className="text-foreground"> {resultCount} </strong>
            条事件
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter.id}
                variant="secondary"
                className="group inline-flex min-h-8 cursor-default items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-2.5 py-1 text-xs font-medium text-foreground"
              >
                <span>{filter.label}</span>
                <button
                  onClick={filter.onRemove}
                  className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                  aria-label={`移除筛选 ${filter.label}`}
                >
                  <X size={11} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 shrink-0 gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={12} />
          清空筛选
        </Button>
      </div>
    </div>
  )
}
