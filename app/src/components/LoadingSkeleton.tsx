import { useState, useEffect } from 'react'

/**
 * 首屏加载骨架屏 — 仅在初次数据加载（无任何事件数据）时显示
 * 包含 logo、模拟进度条、骨架占位行、加载提示
 */
export function LoadingSkeleton() {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  // 模拟进度（非真实进度，给用户等待反馈）
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev // 卡在 90% 等待真实加载完成
        // 越接近 90% 越慢
        const increment = prev < 30 ? 8 : prev < 60 ? 4 : 2
        return Math.min(prev + increment, 90)
      })
    }, 200)
    return () => clearInterval(timer)
  }, [])

  if (fadeOut) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onTransitionEnd={() => fadeOut && setFadeOut(true)}
    >
      {/* Logo + 名称 */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/logo.svg" alt="Chrono Atlas" className="w-12 h-12 drop-shadow-lg loading-logo-pulse" />
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Chrono Atlas</h1>
          <p className="text-xs text-muted-foreground">Loading the timeline of human civilization...</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-64 sm:w-80 mb-8">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground/60 text-center mt-2">
          Loading historical events...
        </p>
      </div>

      {/* 骨架占位行 */}
      <div className="w-72 sm:w-96 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3" style={{ opacity: 1 - i * 0.12 }}>
            {/* 年份骨架 */}
            <div className="w-14 h-4 rounded bg-muted loading-shimmer flex-shrink-0" />
            {/* 标题骨架 */}
            <div className="flex-1 h-4 rounded bg-muted loading-shimmer" style={{ animationDelay: `${i * 0.1}s`, width: `${85 - i * 8}%` }} />
            {/* 类目圆点 */}
            <div className="w-3 h-3 rounded-full bg-muted loading-shimmer flex-shrink-0" style={{ animationDelay: `${i * 0.15}s` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 供 App.tsx 调用：当数据加载完成时触发淡出
 */
export function LoadingSkeletonWithTransition({ isLoading }: { isLoading: boolean }) {
  const [show, setShow] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!isLoading && show && !fading) {
      // 数据加载完成，开始淡出
      setFading(true)
      const timer = setTimeout(() => setShow(false), 500) // 等淡出动画完成
      return () => clearTimeout(timer)
    }
  }, [isLoading, show, fading])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <LoadingContent />
    </div>
  )
}

/** 内部加载内容（logo + 进度条 + 骨架行） */
function LoadingContent() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) return prev
        const increment = prev < 30 ? 8 : prev < 60 ? 4 : prev < 80 ? 2 : 1
        return Math.min(prev + increment, 92)
      })
    }, 200)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Logo + 名称 */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/logo.svg" alt="Chrono Atlas" className="w-12 h-12 drop-shadow-lg loading-logo-pulse" />
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Chrono Atlas</h1>
          <p className="text-xs text-muted-foreground">Loading the timeline of human civilization...</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-64 sm:w-80 mb-8">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground/60 text-center mt-2">
          Loading historical events...
        </p>
      </div>

      {/* 骨架占位行 */}
      <div className="w-72 sm:w-96 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3" style={{ opacity: 1 - i * 0.12 }}>
            <div className="w-14 h-4 rounded bg-muted loading-shimmer flex-shrink-0" />
            <div className="flex-1 h-4 rounded bg-muted loading-shimmer" style={{ animationDelay: `${i * 0.1}s`, width: `${85 - i * 8}%` }} />
            <div className="w-3 h-3 rounded-full bg-muted loading-shimmer flex-shrink-0" style={{ animationDelay: `${i * 0.15}s` }} />
          </div>
        ))}
      </div>
    </>
  )
}
