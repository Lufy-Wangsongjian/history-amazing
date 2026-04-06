import { useCallback, useMemo, useState } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowRightLeft, Flame, RotateCcw, Swords, Trophy, X } from 'lucide-react'

interface TimelineChallengeProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

interface ChallengeRound {
  id: string
  prompt: 'earlier' | 'later'
  left: HistoricalEvent
  right: HistoricalEvent
  correctSide: 'left' | 'right'
}

const ROUND_COUNT = 5

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildRounds(events: HistoricalEvent[]) {
  const pool = events.filter(event => event.significance >= 2)
  const source = pool.length >= ROUND_COUNT * 2 ? pool : events
  const rounds: ChallengeRound[] = []
  const usedIds = new Set<string>()

  for (let i = 0; i < source.length && rounds.length < ROUND_COUNT; i++) {
    const first = source[Math.floor(Math.random() * source.length)]
    const candidates = source.filter(event =>
      event.id !== first.id &&
      !usedIds.has(event.id) &&
      Math.abs(event.year - first.year) >= 30
    )

    if (!first || candidates.length === 0) continue
    const second = candidates[Math.floor(Math.random() * candidates.length)]
    const prompt: ChallengeRound['prompt'] = Math.random() > 0.5 ? 'earlier' : 'later'
    const [left, right] = shuffle([first, second])
    const earlierSide = left.year <= right.year ? 'left' : 'right'
    const correctSide = prompt === 'earlier'
      ? earlierSide
      : (earlierSide === 'left' ? 'right' : 'left')

    rounds.push({
      id: `${left.id}-${right.id}-${prompt}`,
      prompt,
      left,
      right,
      correctSide,
    })

    usedIds.add(first.id)
    usedIds.add(second.id)
  }

  return rounds
}

function ChallengeCard({
  event,
  label,
  disabled,
  highlight,
  onPick,
}: {
  event: HistoricalEvent
  label: string
  disabled: boolean
  highlight: 'none' | 'correct' | 'wrong'
  onPick: () => void
}) {
  const accent = highlight === 'correct'
    ? 'border-emerald-500/40 bg-emerald-500/10'
    : highlight === 'wrong'
      ? 'border-rose-500/40 bg-rose-500/10'
      : 'border-border/50 bg-background/80 hover:border-primary/40 hover:bg-accent/60'

  return (
    <button
      onClick={onPick}
      disabled={disabled}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${accent} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">候选 {label}</span>
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            color: CATEGORY_CONFIG[event.category].color,
            backgroundColor: `${CATEGORY_CONFIG[event.category].color}20`,
          }}
        >
          {CATEGORY_CONFIG[event.category].label}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground leading-6">{event.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{event.description}</p>
      <p className="mt-3 text-xs text-muted-foreground">{formatYear(event.year)}</p>
    </button>
  )
}

export function TimelineChallenge({ open, onClose, events, onSelectEvent }: TimelineChallengeProps) {
  const [rounds, setRounds] = useState<ChallengeRound[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const currentRound = rounds[currentIndex]
  const answered = selectedSide !== null
  const isCorrect = answered && currentRound ? selectedSide === currentRound.correctSide : false

  const result = useMemo(() => {
    if (!finished || rounds.length === 0) return null
    const ratio = score / rounds.length
    if (ratio >= 0.9) return { title: '时间先知', desc: '你几乎能凭直觉排列文明演进。' }
    if (ratio >= 0.7) return { title: '年代猎手', desc: '你对时代先后已经很敏感了。' }
    if (ratio >= 0.5) return { title: '文明观察员', desc: '方向对了，再多玩两轮就会越来越准。' }
    return { title: '新手旅者', desc: '别急，时间感是玩出来的。' }
  }, [finished, rounds.length, score])

  const startChallenge = useCallback(() => {
    const nextRounds = buildRounds(events)
    setRounds(nextRounds)
    setCurrentIndex(0)
    setSelectedSide(null)
    setScore(0)
    setCombo(0)
    setBestCombo(0)
    setStarted(true)
    setFinished(false)
  }, [events])

  const handlePick = useCallback((side: 'left' | 'right') => {
    if (!currentRound || answered) return
    setSelectedSide(side)
    if (side === currentRound.correctSide) {
      setScore(prev => prev + 1)
      setCombo(prev => {
        const next = prev + 1
        setBestCombo(best => Math.max(best, next))
        return next
      })
    } else {
      setCombo(0)
    }
  }, [answered, currentRound])

  const handleNext = useCallback(() => {
    if (!currentRound) return
    if (currentIndex >= rounds.length - 1) {
      setFinished(true)
      return
    }
    setCurrentIndex(prev => prev + 1)
    setSelectedSide(null)
  }, [currentIndex, currentRound, rounds.length])

  return (
    <Dialog open={open} onOpenChange={nextOpen => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">时间对决</DialogTitle>
        <DialogDescription className="sr-only">判断两件历史事件的时间先后顺序</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(88vh,760px)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-950 text-white px-5 py-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.22),transparent_45%)]" />
            <div className="relative z-[1] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Swords size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">时间对决</h2>
                  <p className="text-[11px] text-violet-100/70 mt-0.5">猜对先后顺序，看看你的时间感有多准</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="关闭时间对决"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100/60">当前得分</p>
                <p className="mt-1 text-2xl font-bold">{score}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-violet-100/60">
                  <Flame size={11} />
                  连击
                </div>
                <p className="mt-1 text-2xl font-bold">{combo}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-violet-100/60">最佳连击</p>
                <p className="mt-1 text-2xl font-bold">{bestCombo}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-5">
              {!started && (
                <div className="py-12 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-500">
                    <ArrowRightLeft size={26} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-foreground">5 轮快问快答</h3>
                  <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-7">
                    每轮给你两件历史事件，判断哪件更早发生，或者哪件更晚发生。
                    不需要背诵全部年份，只要抓住文明演进的大方向就行。
                  </p>
                  <button
                    onClick={startChallenge}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5"
                    data-testid="start-timeline-challenge"
                  >
                    <Swords size={16} />
                    开始对决
                  </button>
                </div>
              )}

              {started && !finished && currentRound && (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Round {currentIndex + 1}</p>
                      <h3 className="mt-2 text-xl font-bold text-foreground">
                        哪件事{currentRound.prompt === 'earlier' ? '更早' : '更晚'}发生？
                      </h3>
                    </div>
                    <span className="rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground">
                      {currentIndex + 1} / {rounds.length}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <ChallengeCard
                      event={currentRound.left}
                      label="A"
                      disabled={answered}
                      highlight={answered ? (currentRound.correctSide === 'left' ? 'correct' : selectedSide === 'left' ? 'wrong' : 'none') : 'none'}
                      onPick={() => handlePick('left')}
                    />
                    <ChallengeCard
                      event={currentRound.right}
                      label="B"
                      disabled={answered}
                      highlight={answered ? (currentRound.correctSide === 'right' ? 'correct' : selectedSide === 'right' ? 'wrong' : 'none') : 'none'}
                      onPick={() => handlePick('right')}
                    />
                  </div>

                  {answered && (
                    <div className={`mt-5 rounded-2xl border p-4 ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/8' : 'border-amber-500/30 bg-amber-500/8'}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-semibold ${isCorrect ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'}`}>
                          {isCorrect ? '判断正确，时间感在线。' : '这轮翻车了，但记住这两个年份就赚到。'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          A：{formatYear(currentRound.left.year)} · B：{formatYear(currentRound.right.year)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => onSelectEvent(currentRound.left)}
                          className="rounded-xl border border-border/50 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                        >
                          查看 A 详情
                        </button>
                        <button
                          onClick={() => onSelectEvent(currentRound.right)}
                          className="rounded-xl border border-border/50 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                        >
                          查看 B 详情
                        </button>
                        <button
                          onClick={handleNext}
                          className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          {currentIndex >= rounds.length - 1 ? '查看成绩' : '下一轮'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {finished && result && (
                <div className="py-10 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500">
                    <Trophy size={30} />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-foreground">{result.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{result.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2">
                    <span className="text-sm font-semibold text-foreground">{score} / {rounds.length} 轮正确</span>
                    <span className="text-xs text-muted-foreground">最佳连击 {bestCombo}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={startChallenge}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                    >
                      <RotateCcw size={14} />
                      再战一轮
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded-2xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      返回时间线
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
