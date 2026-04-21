import { useState, useMemo, useCallback, useEffect } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { Search, HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface HistoryRiddleProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

interface RiddleState {
  targetEvent: HistoricalEvent
  clues: string[]
  revealedClues: number
  guessedCorrectly: boolean | null
  score: number
  round: number
  totalRounds: number
  roundScores: number[]
}

function generateClues(event: HistoricalEvent): string[] {
  const clues: string[] = []
  const catCfg = CATEGORY_CONFIG[event.category]
  const regionCfg = REGION_CONFIG[event.region]

  // Clue 1: Vague (category + era hint)
  const eraHint = event.year < -500 ? '远古时代' : event.year < 0 ? '古典时代' : event.year < 500 ? '古代晚期' : event.year < 1500 ? '中世纪' : event.year < 1800 ? '近代' : '现代'
  clues.push(`这件事属于${catCfg.label}领域，发生在${eraHint}。`)

  // Clue 2: More specific (region + century)
  const century = event.year < 0
    ? `公元前 ${Math.ceil(Math.abs(event.year) / 100)} 世纪`
    : `公元 ${Math.ceil(event.year / 100)} 世纪`
  clues.push(`发生在${regionCfg.label}地区，${century}。${event.figure ? `与一位关键人物有关。` : ''}`)

  // Clue 3: Almost revealing (year + first char of title)
  const titleHint = event.title.slice(0, Math.min(3, Math.ceil(event.title.length / 3)))
  clues.push(`发生在${formatYear(event.year)}，名称以「${titleHint}...」开头。`)

  return clues
}

function pickMilestoneEvents(events: HistoricalEvent[], count: number): HistoricalEvent[] {
  const milestones = events.filter(e => e.significance >= 2 && e.title.length >= 3)
  const shuffled = [...milestones].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function HistoryRiddle({ open, onClose, events, onSelectEvent }: HistoryRiddleProps) {
  const TOTAL_ROUNDS = 5
  const targetPool = useMemo(() => pickMilestoneEvents(events, TOTAL_ROUNDS), [events, open])

  const [state, setState] = useState<RiddleState | null>(null)
  const [guessInput, setGuessInput] = useState('')
  const [suggestions, setSuggestions] = useState<HistoricalEvent[]>([])
  const [gameOver, setGameOver] = useState(false)

  const startGame = useCallback(() => {
    if (targetPool.length === 0) return
    const target = targetPool[0]
    setState({
      targetEvent: target,
      clues: generateClues(target),
      revealedClues: 1,
      guessedCorrectly: null,
      score: 0,
      round: 1,
      totalRounds: Math.min(TOTAL_ROUNDS, targetPool.length),
      roundScores: [],
    })
    setGuessInput('')
    setSuggestions([])
    setGameOver(false)
  }, [targetPool])

  // Auto-start when opening (moved from render to useEffect)
  useEffect(() => {
    if (open && !state && !gameOver) {
      startGame()
    }
  }, [open, state, gameOver, startGame])

  const revealNextClue = useCallback(() => {
    if (!state || state.revealedClues >= 3) return
    setState(prev => prev ? { ...prev, revealedClues: prev.revealedClues + 1 } : null)
  }, [state])

  const handleGuess = useCallback((guessedEvent: HistoricalEvent) => {
    if (!state) return
    const correct = guessedEvent.id === state.targetEvent.id
    const points = correct ? (4 - state.revealedClues) : 0 // 3 pts for 1 clue, 2 for 2, 1 for 3
    const newScore = state.score + points
    const newRoundScores = [...state.roundScores, points]

    if (state.round >= state.totalRounds) {
      setState(prev => prev ? { ...prev, guessedCorrectly: correct, score: newScore, roundScores: newRoundScores } : null)
      setTimeout(() => setGameOver(true), 1500)
    } else {
      setState(prev => prev ? { ...prev, guessedCorrectly: correct, score: newScore, roundScores: newRoundScores } : null)
      setTimeout(() => {
        const nextTarget = targetPool[state.round]
        if (nextTarget) {
          setState(prev => prev ? {
            ...prev,
            targetEvent: nextTarget,
            clues: generateClues(nextTarget),
            revealedClues: 1,
            guessedCorrectly: null,
            round: prev.round + 1,
          } : null)
          setGuessInput('')
          setSuggestions([])
        }
      }, 1500)
    }
  }, [state, targetPool])

  const handleInputChange = useCallback((value: string) => {
    setGuessInput(value)
    if (value.trim().length >= 1) {
      const q = value.trim().toLowerCase()
      const matches = events.filter(e => e.title.toLowerCase().includes(q)).slice(0, 6)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }, [events])

  const handleClose = () => {
    setState(null)
    setGameOver(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="sm:max-w-lg max-h-[min(88vh,720px)] flex flex-col overflow-hidden">
        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
          <HelpCircle size={20} className="text-violet-500" />
          历史猜谜
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          根据线索猜出历史事件，线索越少分数越高！
        </DialogDescription>

        {state && !gameOver && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>第 {state.round}/{state.totalRounds} 轮</span>
              <span>得分：{state.score}</span>
            </div>

            <div className="space-y-2">
              {state.clues.slice(0, state.revealedClues).map((clue, idx) => (
                <div key={idx} className="px-3 py-2 rounded-lg bg-violet-500/5 border border-violet-500/20 text-sm">
                  <span className="text-violet-500 font-semibold mr-2">线索 {idx + 1}：</span>
                  {clue}
                </div>
              ))}
            </div>

            {state.guessedCorrectly === null ? (
              <>
                {state.revealedClues < 3 && (
                  <button
                    onClick={revealNextClue}
                    className="text-xs text-violet-500 hover:text-violet-600 transition-colors"
                  >
                    再看一条线索 (当前可得 {4 - state.revealedClues - 1} 分)
                  </button>
                )}

                <div className="relative">
                  <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
                    <Search size={14} className="text-muted-foreground" />
                    <input
                      type="text"
                      value={guessInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="输入事件名称猜答案..."
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                  </div>
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {suggestions.map(evt => (
                        <button
                          key={evt.id}
                          onClick={() => handleGuess(evt)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_CONFIG[evt.category].color }} />
                          <span className="font-mono text-muted-foreground">{formatYear(evt.year)}</span>
                          <span className="truncate">{evt.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${state.guessedCorrectly ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
                {state.guessedCorrectly ? <CheckCircle2 size={20} className="text-green-500" /> : <XCircle size={20} className="text-red-500" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{state.guessedCorrectly ? '答对了！' : '答错了！'}</p>
                  <button
                    onClick={() => onSelectEvent(state.targetEvent)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {state.targetEvent.title}（{formatYear(state.targetEvent.year)}）· 点击查看详情 →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {gameOver && state && (
          <div className="mt-4 text-center space-y-4">
            <div className="text-4xl font-bold text-violet-500">{state.score}</div>
            <p className="text-sm text-muted-foreground">
              {state.score >= state.totalRounds * 2 ? '历史大师！' : state.score >= state.totalRounds ? '不错的成绩！' : '继续加油！'}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              {state.roundScores.map((s, i) => (
                <span key={i} className={`px-2 py-1 rounded ${s > 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                  R{i + 1}: {s}分
                </span>
              ))}
            </div>
            <button
              onClick={startGame}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors"
            >
              <RotateCcw size={14} />
              再来一局
            </button>
          </div>
        )}

        {events.length < 5 && (
          <p className="text-xs text-muted-foreground text-center py-8">事件数量不足，请扩大筛选范围后再试。</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
