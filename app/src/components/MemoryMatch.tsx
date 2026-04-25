import { useState, useCallback, useEffect, useRef } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { formatYear, CATEGORY_CONFIG } from '@/data/types'
import { X, RotateCcw, Trophy, Clock } from 'lucide-react'

interface MemoryMatchProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent?: (event: HistoricalEvent) => void
}

interface Card {
  id: string
  content: string
  type: 'title' | 'year'
  eventId: string
  matchKey: string
}

type GameState = 'playing' | 'won'

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function MemoryMatch({ open, onClose, events }: MemoryMatchProps) {
  const DIFFICULTY_LEVELS = [
    { label: '简单', pairs: 4, cols: 'grid-cols-4' },
    { label: '普通', pairs: 6, cols: 'grid-cols-4' },
    { label: '困难', pairs: 8, cols: 'grid-cols-4' },
  ] as const
  const [difficultyIdx, setDifficultyIdx] = useState(1)
  const PAIR_COUNT = DIFFICULTY_LEVELS[difficultyIdx].pairs
  const gridCols = DIFFICULTY_LEVELS[difficultyIdx].cols
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set())
  const [matchedKeys, setMatchedKeys] = useState<Set<string>>(new Set())
  const [firstPick, setFirstPick] = useState<Card | null>(null)
  const [lockBoard, setLockBoard] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [elapsed, setElapsed] = useState(0)
  const [gameState, setGameState] = useState<GameState>('playing')
  const flipBackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 清理翻牌定时器，防止组件卸载后更新 state
  useEffect(() => {
    return () => {
      if (flipBackTimerRef.current) clearTimeout(flipBackTimerRef.current)
    }
  }, [])

  // Pick events and create card pairs
  const setupGame = useCallback(() => {
    if (events.length === 0) return
    // Prefer milestone events
    const milestones = events.filter(e => e.significance === 3)
    const pool = milestones.length >= PAIR_COUNT ? milestones : events
    const selected = shuffleArray(pool).slice(0, PAIR_COUNT)

    const newCards: Card[] = []
    selected.forEach((event) => {
      newCards.push({
        id: `${event.id}-title`,
        content: event.title.length > 20 ? event.title.slice(0, 18) + '…' : event.title,
        type: 'title',
        eventId: event.id,
        matchKey: event.id,
      })
      newCards.push({
        id: `${event.id}-year`,
        content: formatYear(event.year),
        type: 'year',
        eventId: event.id,
        matchKey: event.id,
      })
    })

    setCards(shuffleArray(newCards))
    setFlippedIds(new Set())
    setMatchedKeys(new Set())
    setFirstPick(null)
    setLockBoard(false)
    setAttempts(0)
    setStartTime(Date.now())
    setElapsed(0)
    setGameState('playing')
  }, [events, PAIR_COUNT])

  useEffect(() => {
    if (open) setupGame()
  }, [open, setupGame])

  // Timer
  useEffect(() => {
    if (!open || gameState !== 'playing' || startTime === 0) return
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(timer)
  }, [open, gameState, startTime])

  // Check win
  useEffect(() => {
    if (matchedKeys.size === PAIR_COUNT && PAIR_COUNT > 0 && cards.length > 0) {
      setGameState('won')
    }
  }, [matchedKeys, cards])

  const handleCardClick = useCallback((card: Card) => {
    if (lockBoard) return
    if (flippedIds.has(card.id)) return
    if (matchedKeys.has(card.matchKey)) return

    const newFlipped = new Set(flippedIds)
    newFlipped.add(card.id)
    setFlippedIds(newFlipped)

    if (!firstPick) {
      setFirstPick(card)
      return
    }

    // Second pick
    setAttempts(prev => prev + 1)
    setLockBoard(true)

    if (firstPick.matchKey === card.matchKey && firstPick.id !== card.id) {
      // Match!
      setMatchedKeys(prev => {
        const next = new Set(prev)
        next.add(card.matchKey)
        return next
      })
      setFirstPick(null)
      setLockBoard(false)
    } else {
      // No match - flip back after delay
      flipBackTimerRef.current = setTimeout(() => {
        setFlippedIds(prev => {
          const next = new Set(prev)
          next.delete(firstPick.id)
          next.delete(card.id)
          return next
        })
        setFirstPick(null)
        setLockBoard(false)
        flipBackTimerRef.current = null
      }, 800)
    }
  }, [lockBoard, flippedIds, matchedKeys, firstPick])

  const getRating = () => {
    if (attempts <= PAIR_COUNT + 2) return { stars: 3, label: '记忆大师' }
    if (attempts <= PAIR_COUNT * 2) return { stars: 2, label: '历史学徒' }
    return { stars: 1, label: '初入门径' }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden flex flex-col max-h-[min(94vh,760px)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 flex-shrink-0">
          <h2 className="text-sm font-bold text-foreground">历史连连看</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {/* 难度选择 */}
            <div className="flex items-center gap-1 mr-2">
              {DIFFICULTY_LEVELS.map((d, i) => (
                <button key={d.label} onClick={() => { setDifficultyIdx(i); }} className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${i === difficultyIdx ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{d.label}</button>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock size={12} /> {formatTime(elapsed)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              翻牌 {attempts} 次
            </span>
            <span className="text-[11px] text-primary font-medium">
              {matchedKeys.size}/{PAIR_COUNT}
            </span>
            <button
              onClick={setupGame}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
              title="重新开始"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Game board */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {gameState === 'won' ? (
            <div className="text-center py-8">
              <Trophy size={40} className="mx-auto mb-3 text-amber-500" />
              <p className="text-lg font-bold text-foreground mb-1">
                {getRating().label}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                {'★'.repeat(getRating().stars)}{'☆'.repeat(3 - getRating().stars)}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                用时 {formatTime(elapsed)}，翻牌 {attempts} 次
              </p>
              <button
                onClick={setupGame}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                再来一局
              </button>
            </div>
          ) : (
            <div className={`grid ${gridCols} gap-2.5`}>
              {cards.map(card => {
                const isFlipped = flippedIds.has(card.id) || matchedKeys.has(card.matchKey)
                const isMatched = matchedKeys.has(card.matchKey)
                const matchedEvent = isMatched ? events.find(e => e.id === card.eventId) : null
                const catColor = matchedEvent ? CATEGORY_CONFIG[matchedEvent.category]?.color : undefined

                return (
                  <div
                    key={card.id}
                    className="relative aspect-[3/4] cursor-pointer group"
                    style={{ perspective: '600px' }}
                    onClick={() => handleCardClick(card)}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-500"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      {/* Front (hidden) */}
                      <div
                        className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30
                          flex items-center justify-center backface-hidden group-hover:from-primary/30 group-hover:to-primary/20 transition-colors"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <span className="text-primary/40 text-lg font-bold">?</span>
                      </div>

                      {/* Back (content) */}
                      <div
                        className={`absolute inset-0 rounded-lg border flex items-center justify-center p-1.5 text-center backface-hidden
                          ${isMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : card.type === 'title'
                              ? 'bg-card border-border/50'
                              : 'bg-amber-500/5 border-amber-500/20'
                          }`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          borderColor: isMatched && catColor ? `${catColor}40` : undefined,
                        }}
                      >
                        <span className={`text-[11px] leading-tight font-medium ${
                          isMatched ? 'text-emerald-600 dark:text-emerald-400' :
                          card.type === 'year' ? 'font-mono text-amber-600 dark:text-amber-400' : 'text-foreground'
                        }`}>
                          {card.content}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-border/30 text-[10px] text-muted-foreground/60 text-center flex-shrink-0">
          翻牌配对：事件名 ↔ 发生年份 · 里程碑事件优先
        </div>
      </div>
    </div>
  )
}
