import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Compass, CalendarDays, Shuffle, Sparkles, X } from 'lucide-react'
import { useMemo, useRef, useEffect, useState } from 'react'
import { ERAS, CATEGORY_CONFIG } from '@/data/types'
import type { Category } from '@/data/types'

interface WelcomeDialogProps {
  open: boolean
  totalEvents: number
  onClose: () => void
  onStartExplore: () => void
  onOpenToday: () => void
  onRandomExplore: () => void
}

/** Canvas 粒子 */
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  targetX: number
  targetY: number
  eraIndex: number
  phase: 'scatter' | 'converge' | 'band'
}

function createParticles(width: number, height: number, count: number): Particle[] {
  const categories = Object.keys(CATEGORY_CONFIG) as Category[]
  const eraCount = ERAS.length
  return Array.from({ length: count }, (_, i) => {
    const cat = categories[i % categories.length]
    const eraIdx = Math.floor(Math.random() * eraCount)
    return {
      x: width / 2 + (Math.random() - 0.5) * 60,
      y: height / 2 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size: 1.5 + Math.random() * 2.5,
      color: CATEGORY_CONFIG[cat].color,
      alpha: 0,
      targetX: 0,
      targetY: 0,
      eraIndex: eraIdx,
      phase: 'scatter' as const,
    }
  })
}

export function WelcomeDialog({
  open,
  totalEvents,
  onClose,
  onStartExplore,
  onOpenToday,
  onRandomExplore,
}: WelcomeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const [animPhase, setAnimPhase] = useState<'scatter' | 'converge' | 'ready'>('scatter')
  const phaseRef = useRef<'scatter' | 'converge' | 'ready'>('scatter')

  // 时代光带数据
  const eraBars = useMemo(() => {
    const maxSpan = Math.max(...ERAS.map(e => e.endYear - e.startYear))
    return ERAS.map((era, i) => ({
      ...era,
      widthPct: Math.max(((era.endYear - era.startYear) / maxSpan) * 100, 20),
      delay: i * 0.15,
    }))
  }, [])

  // Canvas 粒子动画
  useEffect(() => {
    if (!open) return
    let cancelled = false

    // Dialog 有入场动画，canvas 初始尺寸可能为 0
    // 用轮询 + requestAnimationFrame 等待布局完成
    const initCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas || cancelled) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      // 如果尺寸仍为 0，等下一帧再试（最多重试 30 次 ≈ 500ms）
      if (rect.width === 0 || rect.height === 0) {
        retryCount++
        if (retryCount < 30) {
          requestAnimationFrame(initCanvas)
        } else {
          // 兜底：如果始终拿不到尺寸，直接跳到 ready 显示内容
          phaseRef.current = 'ready'
          setAnimPhase('ready')
        }
        return
      }

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      const W = rect.width
      const H = rect.height

      const PARTICLE_COUNT = 400
      particlesRef.current = createParticles(W, H, PARTICLE_COUNT)
      startTimeRef.current = performance.now()
      phaseRef.current = 'scatter'
      setAnimPhase('scatter')

      // 预计算时代光带的目标位置
      const bandY = H * 0.52
      const bandLeft = W * 0.08
      const bandRight = W * 0.92
      const totalWidth = bandRight - bandLeft
      const totalSpan = ERAS.reduce((s, e) => s + (e.endYear - e.startYear), 0)

      let xCursor = bandLeft
      const eraTargets = ERAS.map(era => {
        const eraWidth = ((era.endYear - era.startYear) / totalSpan) * totalWidth
        const center = xCursor + eraWidth / 2
        xCursor += eraWidth
        return { centerX: center, width: eraWidth }
      })

      // 给每个粒子分配汇聚目标
      particlesRef.current.forEach(p => {
        const target = eraTargets[p.eraIndex]
        p.targetX = target.centerX + (Math.random() - 0.5) * target.width * 0.9
        p.targetY = bandY + (Math.random() - 0.5) * 14
      })

      // 动画时间节点 (scatter 1s → converge 1s → ready)
      const SCATTER_END = 1.0
      const CONVERGE_END = 2.0

      const animate = () => {
        if (cancelled) return
        const elapsed = (performance.now() - startTimeRef.current) / 1000
        ctx.clearRect(0, 0, W, H)

        particlesRef.current.forEach(p => {
          if (elapsed < SCATTER_END) {
            p.alpha = Math.min(p.alpha + 0.06, 0.9)
            p.x += p.vx
            p.y += p.vy
            p.vx *= 0.99
            p.vy *= 0.99
            if (p.x < 0 || p.x > W) p.vx *= -1
            if (p.y < 0 || p.y > H) p.vy *= -1
          } else if (elapsed < CONVERGE_END) {
            if (p.phase === 'scatter') p.phase = 'converge'
            const t = Math.min((elapsed - SCATTER_END) / (CONVERGE_END - SCATTER_END), 1)
            const ease = t * t * (3 - 2 * t)
            p.x += (p.targetX - p.x) * ease * 0.1
            p.y += (p.targetY - p.y) * ease * 0.1
            p.alpha = 0.6 + 0.4 * ease
          } else {
            if (p.phase !== 'band') p.phase = 'band'
            p.x += Math.sin(elapsed * 0.5 + p.targetX * 0.01) * 0.15
            p.y += Math.cos(elapsed * 0.7 + p.targetY * 0.02) * 0.1
            p.alpha = 0.7 + Math.sin(elapsed * 1.2 + p.targetX * 0.01) * 0.2
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.alpha * 0.8
          ctx.fill()

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5)
          grd.addColorStop(0, p.color + '40')
          grd.addColorStop(1, p.color + '00')
          ctx.fillStyle = grd
          ctx.globalAlpha = p.alpha * 0.5
          ctx.fill()
        })

        ctx.globalAlpha = 1

        if (elapsed >= CONVERGE_END && phaseRef.current !== 'ready') {
          phaseRef.current = 'ready'
          setAnimPhase('ready')
        } else if (elapsed >= SCATTER_END && elapsed < CONVERGE_END && phaseRef.current === 'scatter') {
          phaseRef.current = 'converge'
          setAnimPhase('converge')
        }

        animFrameRef.current = requestAnimationFrame(animate)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    let retryCount = 0
    // 延迟到下一帧开始初始化，给 Dialog 入场动画一点时间
    requestAnimationFrame(initCanvas)

    return () => {
      cancelled = true
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [open])

  // 检查是否降低动画
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">欢迎来到 Chrono Atlas</DialogTitle>
        <DialogDescription className="sr-only">
          这是一个用于探索 6000 年人类文明时间线的交互式知识产品。
        </DialogDescription>

        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 min-h-[480px]">
          {/* ===== 背景光晕 ===== */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.18),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_50%_50%,rgba(147,112,219,0.08),transparent_45%)]" />

          {/* ===== Canvas 粒子系统 ===== */}
          {!prefersReducedMotion && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* ===== 关闭按钮 ===== */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="关闭欢迎提示"
          >
            <X size={16} />
          </button>

          {/* ===== 主内容 — 分阶段出现 ===== */}
          <div className="relative z-10 flex flex-col items-center px-6 py-8 md:px-10 md:py-10">
            {/* 顶部标签 — phase 1: 立即出现 */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200 welcome-glow transition-all duration-1000"
              style={{ opacity: 1 }}
            >
              <Sparkles size={12} />
              文明探索模式
            </div>

            {/* 核心标语 — phase 1: 1s 后 */}
            <h2
              className="mt-5 text-center text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl transition-all duration-1000"
              style={{
                opacity: animPhase !== 'scatter' || prefersReducedMotion ? 1 : 0,
                transform: animPhase !== 'scatter' || prefersReducedMotion ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <span className="gradient-text">6000 年</span>
              <span className="text-white"> · 一个屏幕</span>
            </h2>
            <p
              className="mt-3 max-w-lg text-center text-sm leading-6 text-slate-300/90 md:text-[15px] transition-all duration-1000 delay-300"
              style={{
                opacity: animPhase !== 'scatter' || prefersReducedMotion ? 1 : 0,
                transform: animPhase !== 'scatter' || prefersReducedMotion ? 'translateY(0)' : 'translateY(15px)',
              }}
            >
              文明的每一次突破，都像暗夜中点燃的一簇火光。Chrono Atlas 是一束穿越 6000 年的光线，帮助你看见时间的纹理。
            </p>

            {/* 时代光带 — phase 2: 汇聚阶段出现 */}
            <div
              className="mt-6 w-full max-w-lg transition-all duration-1000"
              style={{
                opacity: animPhase === 'ready' || animPhase === 'converge' || prefersReducedMotion ? 1 : 0,
                transform: animPhase === 'ready' || animPhase === 'converge' || prefersReducedMotion ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)',
              }}
            >
              <div className="flex items-center gap-1">
                {eraBars.map((era) => (
                  <div
                    key={era.name}
                    className="h-7 rounded-md flex items-center justify-center transition-all duration-500 group relative cursor-default"
                    style={{
                      flex: era.widthPct,
                      backgroundColor: `${era.color}25`,
                      borderBottom: `2px solid ${era.color}`,
                      animationDelay: `${era.delay}s`,
                    }}
                    title={era.name}
                  >
                    <span className="text-[7px] md:text-[8px] font-medium text-white/70 truncate px-0.5 select-none">
                      {era.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] text-slate-500">公元前 4000 年</span>
                <span className="text-[9px] text-slate-500">公元 2030 年</span>
              </div>
            </div>

            {/* 统计数字 */}
            <div
              className="mt-5 flex items-center gap-4 transition-all duration-700"
              style={{
                opacity: animPhase === 'ready' || prefersReducedMotion ? 1 : 0,
                transform: animPhase === 'ready' || prefersReducedMotion ? 'translateY(0)' : 'translateY(10px)',
              }}
            >
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                {totalEvents}+ 条事件
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                12 个文明维度
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                4 种探索视图
              </div>
            </div>

            {/* 三个入口按钮 — phase 3: 聚合方式出现 */}
            <div
              className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg transition-all duration-700 delay-100"
              style={{
                opacity: animPhase === 'ready' || prefersReducedMotion ? 1 : 0,
                transform: animPhase === 'ready' || prefersReducedMotion ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              }}
            >
              <button
                onClick={onOpenToday}
                className="flex-1 w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <CalendarDays size={16} className="text-amber-300" />
                历史上的今天
                <span className="text-[10px] text-slate-400 hidden sm:inline">— 在历史中找到今天的回响</span>
              </button>
            </div>
            <div
              className="mt-2 flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg transition-all duration-700 delay-200"
              style={{
                opacity: animPhase === 'ready' || prefersReducedMotion ? 1 : 0,
                transform: animPhase === 'ready' || prefersReducedMotion ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              }}
            >
              <button
                onClick={onRandomExplore}
                className="flex-1 w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/10 px-4 py-2.5 text-sm font-medium text-violet-100 transition-all hover:bg-violet-400/20 hover:-translate-y-0.5"
              >
                <Shuffle size={15} className="text-violet-300" />
                随机穿越一次
              </button>
              <button
                onClick={onStartExplore}
                className="flex-1 w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:from-amber-400 hover:to-orange-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20"
              >
                <Compass size={15} />
                从头开始探索
              </button>
            </div>

            {/* 底部提示 */}
            <p className="mt-6 text-[10px] text-slate-500 text-center">
              底部时代导航可快速跳转 · 左侧面板支持类目 / 地区 / 年份筛选
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
