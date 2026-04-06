import { useState, useEffect, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { RegionFlag } from './RegionFlag'
import { CategoryIcon } from './CategoryIcon'
import { Play, Pause, SkipForward, X, Sparkles, ChevronRight } from 'lucide-react'

interface AutoExploreProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

const SLIDE_COUNT = 10
const SLIDE_INTERVAL = 5000 // 5 秒自动切换

function pickRandomEvents(events: HistoricalEvent[], count: number): HistoricalEvent[] {
  // 优先选里程碑，再补普通事件
  const milestones = events.filter(e => e.significance === 3)
  const others = events.filter(e => e.significance < 3)
  const shuffledMilestones = [...milestones].sort(() => Math.random() - 0.5)
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5)
  const picked = [...shuffledMilestones.slice(0, Math.ceil(count * 0.6)), ...shuffledOthers]
  return picked.sort(() => Math.random() - 0.5).slice(0, count).sort((a, b) => a.year - b.year)
}

export function AutoExplore({ open, onClose, events, onSelectEvent }: AutoExploreProps) {
  const [slides, setSlides] = useState<HistoricalEvent[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(true)

  // 打开时生成幻灯片序列
  useEffect(() => {
    if (open && events.length > 0) {
      setSlides(pickRandomEvents(events, SLIDE_COUNT))
      setCurrentIdx(0)
      setPlaying(true)
    }
  }, [open, events])

  // 自动播放
  useEffect(() => {
    if (!open || !playing || slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentIdx(prev => {
        if (prev >= slides.length - 1) {
          setPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [open, playing, slides.length])

  const currentEvent = slides[currentIdx]
  const era = currentEvent ? getEra(currentEvent.year) : null
  const catCfg = currentEvent ? CATEGORY_CONFIG[currentEvent.category] : null

  const handleNext = useCallback(() => {
    if (currentIdx < slides.length - 1) {
      setCurrentIdx(prev => prev + 1)
    }
  }, [currentIdx, slides.length])

  const progress = slides.length > 0 ? ((currentIdx + 1) / slides.length) * 100 : 0

  if (!open || !currentEvent || !catCfg) return null

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-xl p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">连续穿越</DialogTitle>
        <DialogDescription className="sr-only">自动浏览随机历史事件</DialogDescription>

        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-[420px] flex flex-col">
          {/* 背景光晕 */}
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{
              background: `radial-gradient(circle at 30% 40%, ${catCfg.color}15, transparent 60%), radial-gradient(circle at 70% 60%, ${era?.color || catCfg.color}10, transparent 50%)`,
            }}
          />

          {/* 顶部控制栏 */}
          <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-semibold">连续穿越</span>
              <span className="text-[10px] text-slate-400">{currentIdx + 1} / {slides.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaying(!playing)}
                className="p-1.5 rounded-md border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={handleNext}
                disabled={currentIdx >= slides.length - 1}
                className="p-1.5 rounded-md border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30"
              >
                <SkipForward size={14} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* 进度条 */}
          <div className="h-0.5 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 主内容 — 事件展示 */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-8">
            {/* 年份 */}
            <div className="mb-4">
              <span className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: catCfg.color }}>
                {formatYear(currentEvent.year)}
              </span>
              {era && (
                <span className="ml-3 text-xs text-slate-400">{era.name}</span>
              )}
            </div>

            {/* 标题 */}
            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3">
              {currentEvent.title}
            </h3>

            {/* 描述 */}
            <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-3 mb-5">
              {currentEvent.description}
            </p>

            {/* 元信息 */}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <RegionFlag region={currentEvent.region} size={14} />
                {REGION_CONFIG[currentEvent.region].label}
              </span>
              <span className="flex items-center gap-1.5" style={{ color: catCfg.color }}>
                <CategoryIcon category={currentEvent.category} size={12} />
                {catCfg.label}
              </span>
              {currentEvent.figure && (
                <span>👤 {currentEvent.figure}</span>
              )}
            </div>

            {/* 查看详情 */}
            <button
              onClick={() => onSelectEvent(currentEvent)}
              className="mt-5 self-start inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition-all"
            >
              查看完整详情
              <ChevronRight size={14} />
            </button>
          </div>

          {/* 底部缩略导航 */}
          <div className="relative z-10 flex items-center gap-1 px-5 py-3 border-t border-white/10">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => { setCurrentIdx(idx); setPlaying(false) }}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIdx ? 'bg-amber-500' : idx < currentIdx ? 'bg-white/30' : 'bg-white/10'
                }`}
                title={slide.title}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
