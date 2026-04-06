import { useState, useMemo, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Brain, Trophy, RotateCcw, ArrowRight, X,
  CheckCircle, XCircle, Zap
} from 'lucide-react'

interface HistoryQuizProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

interface QuizQuestion {
  type: 'year' | 'region' | 'category' | 'figure'
  event: HistoricalEvent
  question: string
  options: string[]
  correctIndex: number
}

/** 从事件数组中随机抽取 n 个不重复元素 */
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

/** 生成一道题目 */
function generateQuestion(event: HistoricalEvent, allEvents: HistoricalEvent[]): QuizQuestion | null {
  const questionTypes: QuizQuestion['type'][] = ['year', 'region', 'category']
  if (event.figure) questionTypes.push('figure')

  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]

  switch (type) {
    case 'year': {
      const correctYear = formatYear(event.year)
      const decoys = new Set<string>()
      // 生成干扰年份：附近的年份
      const offsets = [-200, -100, -50, 50, 100, 200, -500, 500]
      for (const offset of offsets) {
        if (decoys.size >= 3) break
        const y = event.year + offset
        const fy = formatYear(y)
        if (fy !== correctYear && y > -20000 && y < 2030) decoys.add(fy)
      }
      if (decoys.size < 3) return null
      const options = [correctYear, ...Array.from(decoys).slice(0, 3)].sort(() => Math.random() - 0.5)
      return {
        type: 'year',
        event,
        question: `「${event.title}」发生在哪一年？`,
        options,
        correctIndex: options.indexOf(correctYear),
      }
    }

    case 'region': {
      const correctLabel = REGION_CONFIG[event.region].label
      const otherRegions = allEvents
        .filter(e => e.region !== event.region)
        .map(e => REGION_CONFIG[e.region].label)
      const uniqueOthers = [...new Set(otherRegions)]
      if (uniqueOthers.length < 3) return null
      const decoys = pickRandom(uniqueOthers, 3)
      const options = [correctLabel, ...decoys].sort(() => Math.random() - 0.5)
      return {
        type: 'region',
        event,
        question: `「${event.title}」(${formatYear(event.year)}) 发生在哪个地区？`,
        options,
        correctIndex: options.indexOf(correctLabel),
      }
    }

    case 'category': {
      const correctLabel = CATEGORY_CONFIG[event.category].label
      const otherCats = Object.values(CATEGORY_CONFIG)
        .map(c => c.label)
        .filter(l => l !== correctLabel)
      const decoys = pickRandom(otherCats, 3)
      const options = [correctLabel, ...decoys].sort(() => Math.random() - 0.5)
      return {
        type: 'category',
        event,
        question: `「${event.title}」属于哪个领域？`,
        options,
        correctIndex: options.indexOf(correctLabel),
      }
    }

    case 'figure': {
      if (!event.figure) return null
      const correctFigure = event.figure
      const otherFigures = allEvents
        .filter(e => e.figure && e.figure !== correctFigure)
        .map(e => e.figure!)
      const uniqueOthers = [...new Set(otherFigures)]
      if (uniqueOthers.length < 3) return null
      const decoys = pickRandom(uniqueOthers, 3)
      const options = [correctFigure, ...decoys].sort(() => Math.random() - 0.5)
      return {
        type: 'figure',
        event,
        question: `「${event.title}」(${formatYear(event.year)}) 的关键人物是谁？`,
        options,
        correctIndex: options.indexOf(correctFigure),
      }
    }

    default:
      return null
  }
}

/** 生成一组题目 */
function generateQuiz(events: HistoricalEvent[], count: number = 5): QuizQuestion[] {
  // 优先选 significance >= 2 的事件出题
  const important = events.filter(e => e.significance >= 2)
  const pool = important.length >= count * 2 ? important : events
  const candidates = pickRandom(pool, count * 3) // 多选一些防止生成失败

  const questions: QuizQuestion[] = []
  for (const event of candidates) {
    if (questions.length >= count) break
    const q = generateQuestion(event, events)
    if (q) questions.push(q)
  }
  return questions
}

const QUIZ_SIZE = 5

export function HistoryQuiz({ open, onClose, events, onSelectEvent }: HistoryQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [started, setStarted] = useState(false)

  const startQuiz = useCallback(() => {
    const qs = generateQuiz(events, QUIZ_SIZE)
    setQuestions(qs)
    setCurrentIdx(0)
    setSelectedAnswer(null)
    setScore(0)
    setAnswered(false)
    setQuizFinished(false)
    setStarted(true)
  }, [events])

  const handleAnswer = useCallback((optionIdx: number) => {
    if (answered || !questions[currentIdx]) return
    setSelectedAnswer(optionIdx)
    setAnswered(true)
    if (optionIdx === questions[currentIdx].correctIndex) {
      setScore(prev => prev + 1)
    }
  }, [answered, questions, currentIdx])

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setQuizFinished(true)
    }
  }, [currentIdx, questions.length])

  const currentQ = questions[currentIdx]
  const isCorrect = answered && selectedAnswer === currentQ?.correctIndex

  // 评级
  const grade = useMemo(() => {
    if (!quizFinished || questions.length === 0) return null
    const pct = score / questions.length
    if (pct >= 0.8) return { emoji: '🏆', title: '历史学霸！', desc: '你对人类文明了如指掌' }
    if (pct >= 0.6) return { emoji: '📚', title: '历史达人', desc: '你的知识储备令人印象深刻' }
    if (pct >= 0.4) return { emoji: '🌱', title: '历史新芽', desc: '继续探索，你会成为历史通' }
    return { emoji: '🔭', title: '历史探险家', desc: '每一次探索都是学习的开始' }
  }, [quizFinished, score, questions.length])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">历史知识测验</DialogTitle>
        <DialogDescription className="sr-only">基于历史事件的趣味问答测验</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(85vh,700px)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white px-5 py-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.2),transparent_50%)]" />
            <div className="relative z-[1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Brain size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">历史知识测验</h2>
                  <p className="text-[10px] text-slate-400">测测你对人类文明了解多少</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {started && !quizFinished && (
                  <span className="text-xs font-mono text-slate-300">
                    {currentIdx + 1} / {questions.length}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            {/* 进度条 */}
            {started && !quizFinished && (
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentIdx + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-5">
              {/* ===== 开始前 ===== */}
              {!started && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🧠</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">准备好了吗？</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                    {QUIZ_SIZE} 道题目，基于 {events.length} 条历史事件随机生成。<br />
                    看看你能答对几题！
                  </p>
                  <button
                    onClick={startQuiz}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Zap size={16} />
                    开始测验
                  </button>
                </div>
              )}

              {/* ===== 答题中 ===== */}
              {started && !quizFinished && currentQ && (
                <div>
                  {/* 题目 */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/15 text-violet-500 text-xs font-bold">
                        {currentIdx + 1}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {currentQ.type === 'year' ? '年份题' : currentQ.type === 'region' ? '地区题' : currentQ.type === 'category' ? '类目题' : '人物题'}
                      </span>
                    </div>
                    <p className="text-[15px] font-semibold text-foreground leading-relaxed">
                      {currentQ.question}
                    </p>
                  </div>

                  {/* 选项 */}
                  <div className="space-y-2.5 mb-5">
                    {currentQ.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx
                      const isCorrectOption = idx === currentQ.correctIndex
                      let optionStyle = 'border-border/50 hover:border-border hover:bg-accent/50'
                      if (answered) {
                        if (isCorrectOption) {
                          optionStyle = 'border-emerald-500/50 bg-emerald-500/10'
                        } else if (isSelected && !isCorrectOption) {
                          optionStyle = 'border-red-500/50 bg-red-500/10'
                        } else {
                          optionStyle = 'border-border/30 opacity-50'
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={answered}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${optionStyle} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full border border-border/60 bg-muted/30 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm font-medium text-foreground">{option}</span>
                            {answered && isCorrectOption && (
                              <CheckCircle size={16} className="ml-auto text-emerald-500 flex-shrink-0" />
                            )}
                            {answered && isSelected && !isCorrectOption && (
                              <XCircle size={16} className="ml-auto text-red-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* 答案解释 + 下一题按钮 */}
                  {answered && (
                    <div className="space-y-3">
                      <div className={`rounded-xl p-3.5 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          {isCorrect ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ 回答正确！</span>
                          ) : (
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">✗ 答错了</span>
                          )}
                        </div>
                        <button
                          onClick={() => onSelectEvent(currentQ.event)}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {currentQ.event.title} · {formatYear(currentQ.event.year)} · 点击查看详情 →
                        </button>
                      </div>
                      <button
                        onClick={handleNext}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                      >
                        {currentIdx < questions.length - 1 ? '下一题' : '查看结果'}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ===== 结果 ===== */}
              {quizFinished && grade && (
                <div className="text-center py-4">
                  <div className="text-5xl mb-3">{grade.emoji}</div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{grade.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{grade.desc}</p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 mb-6">
                    <Trophy size={16} className="text-violet-500" />
                    <span className="text-sm font-bold text-foreground">
                      {score} / {questions.length} 题正确
                    </span>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={startQuiz}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <RotateCcw size={14} />
                      再来一轮
                    </button>
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent"
                    >
                      返回探索
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
