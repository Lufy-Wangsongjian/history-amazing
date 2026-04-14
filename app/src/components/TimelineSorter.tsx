import { useState, useMemo, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
import { ArrowUpDown, CheckCircle2, XCircle, RotateCcw, ChevronUp, ChevronDown, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface TimelineSorterProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

function pickSortableEvents(events: HistoricalEvent[], count: number): HistoricalEvent[] {
  // Pick events from at least 3 different eras with good year spread
  const milestones = events.filter(e => e.significance >= 2)
  if (milestones.length < count) return events.slice(0, count)

  const shuffled = [...milestones].sort(() => Math.random() - 0.5)
  const selected: HistoricalEvent[] = []
  const usedCenturies = new Set<number>()

  for (const evt of shuffled) {
    const century = Math.floor(evt.year / 100)
    if (!usedCenturies.has(century) || selected.length < count) {
      selected.push(evt)
      usedCenturies.add(century)
      if (selected.length >= count) break
    }
  }

  return selected
}

export function TimelineSorter({ open, onClose, events }: TimelineSorterProps) {
  const ITEM_COUNT = 5
  const sourceEvents = useMemo(() => pickSortableEvents(events, ITEM_COUNT), [events, open])

  const [items, setItems] = useState<HistoricalEvent[]>([])
  const [correctOrder, setCorrectOrder] = useState<HistoricalEvent[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)

  const startGame = useCallback(() => {
    const sorted = [...sourceEvents].sort((a, b) => a.year - b.year)
    const shuffled = [...sourceEvents].sort(() => Math.random() - 0.5)
    setCorrectOrder(sorted)
    setItems(shuffled)
    setSubmitted(false)
    setResults([])
    setScore(0)
    setRound(prev => prev + 1)
  }, [sourceEvents])

  const moveItem = useCallback((fromIndex: number, direction: 'up' | 'down') => {
    if (submitted) return
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= items.length) return
    const newItems = [...items]
    const temp = newItems[fromIndex]
    newItems[fromIndex] = newItems[toIndex]
    newItems[toIndex] = temp
    setItems(newItems)
  }, [items, submitted])

  const handleSubmit = useCallback(() => {
    const checks = items.map((item, idx) => item.id === correctOrder[idx].id)
    setResults(checks)
    const correct = checks.filter(Boolean).length
    setScore(correct)
    setSubmitted(true)
  }, [items, correctOrder])

  // Auto-start
  if (open && round === 0 && sourceEvents.length >= ITEM_COUNT) {
    startGame()
  }

  const handleClose = () => {
    setRound(0)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
          <ArrowUpDown size={20} className="text-orange-500" />
          历史排序挑战
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          把这些历史事件按时间从早到晚排列！
        </DialogDescription>

        {items.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              {items.map((item, idx) => {
                const catCfg = CATEGORY_CONFIG[item.category]
                const isCorrect = submitted ? results[idx] : null
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                      isCorrect === true ? 'border-green-500/40 bg-green-500/5' :
                      isCorrect === false ? 'border-red-500/40 bg-red-500/5' :
                      'border-border/50 bg-card/50 hover:bg-accent/30'
                    }`}
                  >
                    <span className="text-xs font-bold text-muted-foreground w-5 text-center">{idx + 1}</span>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catCfg.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.title}</p>
                      {submitted && (
                        <p className="text-[10px] text-muted-foreground font-mono">{formatYear(item.year)}</p>
                      )}
                    </div>
                    {!submitted && (
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 rounded hover:bg-accent disabled:opacity-30 transition-colors"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          onClick={() => moveItem(idx, 'down')}
                          disabled={idx === items.length - 1}
                          className="p-0.5 rounded hover:bg-accent disabled:opacity-30 transition-colors"
                        >
                          <ChevronDown size={12} />
                        </button>
                      </div>
                    )}
                    {isCorrect === true && <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />}
                    {isCorrect === false && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                  </div>
                )
              })}
            </div>

            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <Send size={14} />
                提交排序
              </button>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm font-medium">
                  {score === ITEM_COUNT ? '完美！全部正确！' :
                   score >= 3 ? `不错！答对 ${score}/${ITEM_COUNT}` :
                   `答对 ${score}/${ITEM_COUNT}，继续加油！`}
                </p>
                {submitted && score < ITEM_COUNT && (
                  <p className="text-xs text-muted-foreground">
                    正确顺序：{correctOrder.map(e => `${e.title}(${formatYear(e.year)})`).join(' → ')}
                  </p>
                )}
                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  <RotateCcw size={14} />
                  再来一轮
                </button>
              </div>
            )}
          </div>
        )}

        {sourceEvents.length < ITEM_COUNT && (
          <p className="text-xs text-muted-foreground text-center py-8">事件数量不足，请扩大筛选范围后再试。</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
