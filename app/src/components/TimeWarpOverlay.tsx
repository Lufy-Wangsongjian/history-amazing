import { useEffect, useRef, useState, useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, ERAS, formatYear, getEra } from '@/data/types'
import { RegionFlag } from './RegionFlag'
import { CategoryIcon } from './CategoryIcon'
import { Sparkles, MapPin, Calendar, Zap, X, ArrowRight } from 'lucide-react'

interface TimeWarpOverlayProps {
  /** 是否显示穿越动画 */
  active: boolean
  /** 穿越目标事件 */
  targetEvent: HistoricalEvent | null
  /** 所有事件（用于计算时间线位置百分比） */
  allEvents: HistoricalEvent[]
  /** 动画结束后的回调（openDetail=true 表示打开详情） */
  onComplete: (openDetail?: boolean) => void
}

/** 穿越动画阶段 */
type WarpPhase = 'idle' | 'tunnel' | 'arrive' | 'reveal' | 'fadeout'

/** 根据年份计算在 6000 年时间线中的百分比 */
function getTimelinePercent(year: number): number {
  const MIN_YEAR = -4000
  const MAX_YEAR = 2030
  const pct = ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
  return Math.max(0, Math.min(100, pct))
}

/** 生成穿越隧道中飞过的随机年份序列 */
function generateYearSequence(targetYear: number, count: number): number[] {
  const years: number[] = []
  const span = 6000
  for (let i = 0; i < count; i++) {
    // 越靠后越接近目标年份
    const progress = i / count
    const randomRange = span * (1 - progress * progress)
    const year = Math.round(targetYear + (Math.random() - 0.5) * randomRange)
    years.push(Math.max(-4000, Math.min(2030, year)))
  }
  // 最后几个一定是目标年份
  years[count - 3] = targetYear + Math.round((Math.random() - 0.5) * 50)
  years[count - 2] = targetYear + Math.round((Math.random() - 0.5) * 10)
  years[count - 1] = targetYear
  return years
}

export function TimeWarpOverlay({ active, targetEvent, allEvents, onComplete }: TimeWarpOverlayProps) {
  const [phase, setPhase] = useState<WarpPhase>('idle')
  const [displayYear, setDisplayYear] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  // 分离定时器 ref，避免不同 effect 互相清除
  const mainTimeoutRefs = useRef<number[]>([])
  const yearTimeoutRefs = useRef<number[]>([])
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const targetEventRef = useRef(targetEvent)
  targetEventRef.current = targetEvent

  const clearMainTimeouts = () => {
    mainTimeoutRefs.current.forEach(id => clearTimeout(id))
    mainTimeoutRefs.current = []
  }
  const clearYearTimeouts = () => {
    yearTimeoutRefs.current.forEach(id => clearTimeout(id))
    yearTimeoutRefs.current = []
  }
  const clearAll = () => {
    clearMainTimeouts()
    clearYearTimeouts()
    cancelAnimationFrame(animFrameRef.current)
  }

  // 计算目标事件在时间线上的位置
  const timelineContext = useMemo(() => {
    if (!targetEvent) return null
    const pct = getTimelinePercent(targetEvent.year)
    const era = getEra(targetEvent.year)
    const catCfg = CATEGORY_CONFIG[targetEvent.category]

    // 计算同时代事件数量
    const eraEvents = allEvents.filter(e => {
      const eEra = getEra(e.year)
      return eEra?.name === era?.name
    })

    // 计算排名
    const sortedByYear = [...allEvents].sort((a, b) => a.year - b.year)
    const rank = sortedByYear.findIndex(e => e.id === targetEvent.id) + 1

    return {
      percent: Math.round(pct),
      era,
      catCfg,
      eraEventCount: eraEvents.length,
      rank,
      totalEvents: allEvents.length,
    }
  }, [targetEvent, allEvents])

  // 穿越隧道 Canvas 动画
  useEffect(() => {
    if (phase !== 'tunnel' || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    // 星粒子
    const stars: Array<{
      x: number; y: number; z: number
      speed: number; color: string; size: number
    }> = []

    const categories = Object.values(CATEGORY_CONFIG)
    for (let i = 0; i < 300; i++) {
      const cat = categories[i % categories.length]
      stars.push({
        x: (Math.random() - 0.5) * W * 3,
        y: (Math.random() - 0.5) * H * 3,
        z: Math.random() * 2000,
        speed: 15 + Math.random() * 25,
        color: cat.color,
        size: 1 + Math.random() * 2,
      })
    }

    const startTime = performance.now()
    const DURATION = 1200 // ms

    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / DURATION, 1)

      ctx.fillStyle = `rgba(10, 10, 20, ${0.3 + progress * 0.2})`
      ctx.fillRect(0, 0, W, H)

      // 中心光晕
      const glowRadius = 100 + progress * 200
      const glowGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, glowRadius)
      glowGrad.addColorStop(0, `rgba(245, 158, 11, ${0.15 * (1 - progress)})`)
      glowGrad.addColorStop(0.5, `rgba(147, 112, 219, ${0.08 * (1 - progress)})`)
      glowGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, W, H)

      // 星粒子 — 速度随时间加速
      const speedMultiplier = 1 + progress * 8
      stars.forEach(star => {
        star.z -= star.speed * speedMultiplier

        if (star.z <= 0) {
          star.z = 2000
          star.x = (Math.random() - 0.5) * W * 3
          star.y = (Math.random() - 0.5) * H * 3
        }

        const sx = (star.x / star.z) * 400 + W / 2
        const sy = (star.y / star.z) * 400 + H / 2
        const sz = star.size * (1 - star.z / 2000) * (1 + progress)

        if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) return

        // 拖尾
        const tailLength = Math.min(star.speed * speedMultiplier * 0.3, 40)
        const tailX = sx + (star.x > 0 ? 1 : -1) * tailLength * (1 - star.z / 2000) * 0.5
        const tailY = sy + (star.y > 0 ? 1 : -1) * tailLength * (1 - star.z / 2000) * 0.5

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(sx, sy)
        ctx.strokeStyle = star.color
        ctx.globalAlpha = 0.4 * (1 - star.z / 2000)
        ctx.lineWidth = sz * 0.5
        ctx.stroke()

        // 亮点
        ctx.beginPath()
        ctx.arc(sx, sy, sz, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = 0.8 * (1 - star.z / 2000)
        ctx.fill()
      })

      ctx.globalAlpha = 1

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase])

  // 年份滚动效果（独立定时器，不干扰主控流程）
  useEffect(() => {
    const target = targetEventRef.current
    if (phase !== 'tunnel' || !target) return

    clearYearTimeouts()
    const sequence = generateYearSequence(target.year, 20)
    let idx = 0

    const tick = () => {
      if (idx < sequence.length) {
        setDisplayYear(formatYear(sequence[idx]))
        idx++
        const delay = 30 + idx * 15
        const t = window.setTimeout(tick, delay) as unknown as number
        yearTimeoutRefs.current.push(t)
      }
    }

    const t = window.setTimeout(tick, 200) as unknown as number
    yearTimeoutRefs.current.push(t)

    return () => clearYearTimeouts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // 主控制流程 — 只依赖 active 触发，targetEvent 从 prop 直接读
  useEffect(() => {
    if (!active || !targetEvent) {
      setPhase('idle')
      return
    }

    clearAll()
    setPhase('tunnel')
    setDisplayYear('')

    // 1.3s 后切到"抵达"
    const t1 = window.setTimeout(() => {
      setPhase('arrive')
    }, 1300) as unknown as number
    mainTimeoutRefs.current.push(t1)

    // 1.7s 后显示揭示（停留等待用户操作，不再自动关闭）
    const t2 = window.setTimeout(() => {
      setPhase('reveal')
    }, 1700) as unknown as number
    mainTimeoutRefs.current.push(t2)

    return () => clearAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // 淡出后关闭
  const handleDismiss = (openDetail: boolean) => {
    clearAll()
    setPhase('fadeout')
    const t = window.setTimeout(() => {
      setPhase('idle')
      onCompleteRef.current(openDetail)
    }, 350) as unknown as number
    mainTimeoutRefs.current.push(t)
  }

  if (phase === 'idle' || !targetEvent) return null

  const catCfg = CATEGORY_CONFIG[targetEvent.category]

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center time-warp-overlay time-warp-${phase}`}
      onClick={() => {
        if (phase === 'reveal') {
          handleDismiss(false)
        }
      }}
    >
      {/* 背景暗层 */}
      <div className="absolute inset-0 bg-slate-950/95 time-warp-backdrop" />

      {/* Canvas 粒子隧道 */}
      {(phase === 'tunnel' || phase === 'arrive') && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* 年份数字滚动 — 隧道阶段 */}
      {phase === 'tunnel' && displayYear && (
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="text-[10px] text-amber-400/80 font-medium tracking-[0.3em] uppercase animate-pulse">
            穿越中...
          </div>
          <div
            className="text-5xl md:text-7xl font-bold font-mono text-white/90 time-warp-year"
            style={{ textShadow: '0 0 40px rgba(245,158,11,0.4), 0 0 80px rgba(245,158,11,0.2)' }}
          >
            {displayYear}
          </div>
        </div>
      )}

      {/* 到达阶段 — 白色闪光 */}
      {phase === 'arrive' && (
        <div className="absolute inset-0 bg-white/20 time-warp-flash" />
      )}

      {/* 揭示阶段 — 目标事件信息 */}
      {phase === 'reveal' && timelineContext && (
        <div
          className="relative z-10 flex flex-col items-center gap-5 px-6 max-w-xl mx-auto time-warp-reveal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 时间位置上下文 */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" />
              你穿越到了人类文明第
              <strong className="text-amber-400 text-sm">{timelineContext.percent}%</strong>
              的时间点
            </span>
          </div>

          {/* 时间线位置条 */}
          <div className="w-full max-w-sm">
            <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
              {/* 时代色段 */}
              {ERAS.map(era => {
                const left = getTimelinePercent(era.startYear)
                const width = getTimelinePercent(era.endYear) - left
                return (
                  <div
                    key={era.name}
                    className="absolute top-0 h-full opacity-40"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: era.color,
                    }}
                  />
                )
              })}
              {/* 当前位置标记 */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg shadow-amber-500/50 time-warp-position-dot"
                style={{
                  left: `${timelineContext.percent}%`,
                  transform: `translateX(-50%) translateY(-50%)`,
                  backgroundColor: catCfg.color,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-slate-600">公元前 4000</span>
              <span className="text-[9px] text-slate-600">公元 2030</span>
            </div>
          </div>

          {/* 事件卡片预览 */}
          <div
            className="w-full rounded-xl border p-5 backdrop-blur-md time-warp-card"
            style={{
              borderColor: `${catCfg.color}40`,
              backgroundColor: `rgba(15, 15, 25, 0.85)`,
              boxShadow: `0 0 40px ${catCfg.color}15, 0 20px 60px rgba(0,0,0,0.5)`,
            }}
          >
            {/* 顶部装饰条 */}
            <div
              className="h-1 rounded-full mb-4"
              style={{ background: `linear-gradient(to right, ${catCfg.color}, ${catCfg.color}40)` }}
            />

            <div className="flex items-start gap-4">
              {/* 分类图标 */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${catCfg.color}20` }}
              >
                <CategoryIcon category={targetEvent.category} size={24} className="text-white/90" />
              </div>

              <div className="flex-1 min-w-0">
                {/* 年份 + 标签 */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-semibold" style={{ color: catCfg.color }}>
                    {formatYear(targetEvent.year)}
                  </span>
                  {targetEvent.significance === 3 && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/15 text-amber-400">
                      <Zap size={8} fill="currentColor" />
                      里程碑
                    </span>
                  )}
                </div>

                {/* 标题 */}
                <h3 className="text-lg font-bold text-white leading-snug mb-2">
                  {targetEvent.title}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-2">
                  {targetEvent.description}
                </p>

                {/* 元信息 */}
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    <RegionFlag region={targetEvent.region} size={12} />
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {timelineContext.era?.name}
                  </span>
                  <span style={{ color: catCfg.color }}>
                    {catCfg.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => handleDismiss(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 transition-all duration-200"
            >
              <X size={13} />
              关闭
            </button>
            <button
              onClick={() => handleDismiss(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${catCfg.color}, ${catCfg.color}cc)`,
                boxShadow: `0 4px 15px ${catCfg.color}30`,
              }}
            >
              查看完整详情
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
