/**
 * 成就解锁庆祝 toast — 从底部弹出，3 秒后自动消失
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { Trophy } from 'lucide-react'

interface AchievementToast {
  id: string
  emoji: string
  title: string
}

let globalPush: ((toast: AchievementToast) => void) | null = null

/** 外部调用：触发一个成就 toast */
export function showAchievementToast(toast: AchievementToast) {
  globalPush?.(toast)
}

/** Toast 容器 — 挂在 App 最外层 */
export function AchievementToastContainer() {
  const [toasts, setToasts] = useState<Array<AchievementToast & { fadingOut?: boolean }>>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const push = useCallback((toast: AchievementToast) => {
    setToasts(prev => [...prev, toast])

    // 2.5 秒后开始淡出
    const timer = setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === toast.id ? { ...t, fadingOut: true } : t))
      // 淡出动画 500ms 后移除
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
        timersRef.current.delete(toast.id)
      }, 500)
    }, 2500)

    timersRef.current.set(toast.id, timer)
  }, [])

  useEffect(() => {
    globalPush = push
    return () => { globalPush = null }
  }, [push])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer))
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border border-amber-500/30 bg-card/95 backdrop-blur-md shadow-xl shadow-amber-500/10 transition-all duration-500 ${
            toast.fadingOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 animate-[slideUp_0.4s_ease-out]'
          }`}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg">
            {toast.emoji}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Trophy size={12} className="text-amber-500" />
              <span className="text-[10px] font-medium text-amber-500 uppercase tracking-wider">成就解锁</span>
            </div>
            <p className="text-sm font-bold text-foreground">{toast.title}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
