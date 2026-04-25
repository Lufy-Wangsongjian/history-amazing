/**
 * 每日签到 + 连续打卡组件
 * 嵌入 header 区域，显示当前连续天数，点击签到
 */
import { useState, useEffect, useCallback } from 'react'
import { Flame, Check } from 'lucide-react'
import { fetchStreak, checkin, type StreakInfo } from '@/lib/api'
import { showAchievementToast } from '@/components/AchievementToast'

interface DailyCheckinProps {
  className?: string
}

export function DailyCheckin({ className }: DailyCheckinProps) {
  const [streak, setStreak] = useState<StreakInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStreak().then(setStreak).catch(() => {})
  }, [])

  const handleCheckin = useCallback(async () => {
    if (loading || streak?.checkedInToday) return
    setLoading(true)
    try {
      const result = await checkin()
      setStreak(result)
      if (result.isNew) {
        // 签到成功提示
        if (result.currentStreak === 7) {
          showAchievementToast({ id: 'streak-7', emoji: '🔥', title: '连续签到 7 天！' })
        } else if (result.currentStreak === 30) {
          showAchievementToast({ id: 'streak-30', emoji: '💎', title: '连续签到 30 天！' })
        } else {
          showAchievementToast({ id: 'daily-checkin', emoji: '✅', title: `签到成功！连续 ${result.currentStreak} 天` })
        }
      }
    } catch {
      // 网络错误不影响
    } finally {
      setLoading(false)
    }
  }, [loading, streak])

  if (!streak) return null

  return (
    <button
      onClick={handleCheckin}
      disabled={loading}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
        streak.checkedInToday
          ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400'
          : 'bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:from-rose-500/20 hover:to-pink-500/20 hover:shadow-sm animate-pulse'
      } ${className || ''}`}
      title={streak.checkedInToday ? `已签到 · 连续 ${streak.currentStreak} 天` : '点击签到'}
    >
      {streak.checkedInToday ? (
        <>
          <Check size={14} />
          <Flame size={12} />
          <span>{streak.currentStreak}</span>
        </>
      ) : (
        <>
          <Flame size={14} />
          <span>签到</span>
        </>
      )}
    </button>
  )
}
