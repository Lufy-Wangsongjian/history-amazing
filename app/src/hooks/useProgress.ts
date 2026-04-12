import { useState, useCallback, useEffect, useMemo } from 'react'
import type { Category } from '@/data/types'
import { CATEGORY_CONFIG, ERAS } from '@/data/types'

const PROGRESS_STORAGE_KEY = 'chrono-atlas-read-events'

/** 学习进度追踪 Hook */
export function useReadProgress() {
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY)
      return stored ? new Set(JSON.parse(stored) as string[]) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(Array.from(readIds)))
    } catch {}
  }, [readIds])

  const markRead = useCallback((id: string) => {
    setReadIds(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const isRead = useCallback((id: string) => readIds.has(id), [readIds])

  const readCount = readIds.size

  return { readIds, markRead, isRead, readCount }
}

/** 成就定义 */
export interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  category: 'exploration' | 'era' | 'category' | 'special'
  check: (ctx: AchievementContext) => boolean
}

interface AchievementContext {
  readCount: number
  readIds: Set<string>
  eventCategories: Map<string, Category> // eventId → category
  eventYears: Map<string, number> // eventId → year
  eventSignificances: Map<string, number> // eventId → significance
  totalEvents: number
  milestoneCount: number
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // 探索成就
  { id: 'first-step', title: '第一步', description: '浏览第 1 个历史事件', emoji: '👣', category: 'exploration', check: ctx => ctx.readCount >= 1 },
  { id: 'curious-mind', title: '好奇心', description: '浏览 10 个历史事件', emoji: '🔍', category: 'exploration', check: ctx => ctx.readCount >= 10 },
  { id: 'history-fan', title: '历史迷', description: '浏览 50 个历史事件', emoji: '📖', category: 'exploration', check: ctx => ctx.readCount >= 50 },
  { id: 'knowledge-seeker', title: '求知者', description: '浏览 100 个历史事件', emoji: '🎓', category: 'exploration', check: ctx => ctx.readCount >= 100 },
  { id: 'history-master', title: '历史大师', description: '浏览 300 个历史事件', emoji: '🏆', category: 'exploration', check: ctx => ctx.readCount >= 300 },

  // 时代成就 — 每个时代浏览至少 1 个事件
  ...ERAS.map(era => ({
    id: `era-${era.name}`,
    title: `${era.name}探险家`,
    description: `浏览 ${era.name} 的事件`,
    emoji: era.name.includes('远古') ? '🏺' : era.name.includes('古典') ? '🏛️' : era.name.includes('轴心') ? '🧘' : era.name.includes('帝国') ? '⚔️' : era.name.includes('中世纪') ? '🏰' : era.name.includes('文艺复兴前夜') ? '🌅' : era.name.includes('文艺复兴') ? '🎨' : era.name.includes('科学') ? '🔬' : era.name.includes('工业') ? '⚙️' : '🌐',
    category: 'era' as const,
    check: (ctx: AchievementContext) => {
      for (const [id] of ctx.readIds.entries()) {
        const year = ctx.eventYears.get(id)
        if (year !== undefined && year >= era.startYear && year < era.endYear) return true
      }
      return false
    },
  })),

  // 类目成就 — 每个类目浏览至少 1 个事件
  ...Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => ({
    id: `cat-${key}`,
    title: `${cfg.label}鉴赏家`,
    description: `浏览 ${cfg.label} 类事件`,
    emoji: key === 'literature' ? '📚' : key === 'science' ? '🧪' : key === 'music' ? '🎵' : key === 'art' ? '🖼️' : key === 'philosophy' ? '💭' : key === 'history' ? '📜' : key === 'technology' ? '💡' : key === 'architecture' ? '🏗️' : key === 'religion' ? '🕊️' : key === 'warfare' ? '⚔️' : key === 'exploration' ? '🗺️' : '💊',
    category: 'category' as const,
    check: (ctx: AchievementContext) => {
      for (const [id] of ctx.readIds.entries()) {
        if (ctx.eventCategories.get(id) === key) return true
      }
      return false
    },
  })),

  // 特殊成就
  { id: 'milestone-hunter', title: '里程碑猎手', description: '浏览 5 个里程碑事件', emoji: '🌟', category: 'special', check: ctx => {
    let count = 0
    for (const [id] of ctx.readIds.entries()) {
      if (ctx.eventSignificances.get(id) === 3) count++
      if (count >= 5) return true
    }
    return false
  }},
  { id: 'time-traveler', title: '时间旅行者', description: '浏览跨越 3 个不同时代的事件', emoji: '⏰', category: 'special', check: ctx => {
    const eras = new Set<string>()
    for (const [id] of ctx.readIds.entries()) {
      const year = ctx.eventYears.get(id)
      if (year !== undefined) {
        const era = ERAS.find(e => year >= e.startYear && year < e.endYear)
        if (era) eras.add(era.name)
      }
    }
    return eras.size >= 3
  }},

  // 类目专属深度成就 — 每个类目浏览 10 个事件解锁专属称号
  { id: 'cat-deep-literature', title: '文曲星', description: '浏览 10 个文学事件', emoji: '✒️', category: 'special', check: ctx => countCategoryReads(ctx, 'literature') >= 10 },
  { id: 'cat-deep-science', title: '求真者', description: '浏览 10 个科学事件', emoji: '🔭', category: 'special', check: ctx => countCategoryReads(ctx, 'science') >= 10 },
  { id: 'cat-deep-music', title: '知音人', description: '浏览 10 个音乐事件', emoji: '🎼', category: 'special', check: ctx => countCategoryReads(ctx, 'music') >= 10 },
  { id: 'cat-deep-art', title: '丹青妙手', description: '浏览 10 个艺术事件', emoji: '🎨', category: 'special', check: ctx => countCategoryReads(ctx, 'art') >= 10 },
  { id: 'cat-deep-philosophy', title: '思想者', description: '浏览 10 个哲学事件', emoji: '🦉', category: 'special', check: ctx => countCategoryReads(ctx, 'philosophy') >= 10 },
  { id: 'cat-deep-history', title: '太史令', description: '浏览 10 个历史事件', emoji: '📜', category: 'special', check: ctx => countCategoryReads(ctx, 'history') >= 10 },
  { id: 'cat-deep-technology', title: '造物主', description: '浏览 10 个技术事件', emoji: '⚡', category: 'special', check: ctx => countCategoryReads(ctx, 'technology') >= 10 },
  { id: 'cat-deep-architecture', title: '营造法师', description: '浏览 10 个建筑事件', emoji: '🏛️', category: 'special', check: ctx => countCategoryReads(ctx, 'architecture') >= 10 },
  { id: 'cat-deep-religion', title: '悟道者', description: '浏览 10 个宗教事件', emoji: '☸️', category: 'special', check: ctx => countCategoryReads(ctx, 'religion') >= 10 },
  { id: 'cat-deep-warfare', title: '兵法家', description: '浏览 10 个军事事件', emoji: '🗡️', category: 'special', check: ctx => countCategoryReads(ctx, 'warfare') >= 10 },
  { id: 'cat-deep-exploration', title: '航海家', description: '浏览 10 个探索事件', emoji: '🧭', category: 'special', check: ctx => countCategoryReads(ctx, 'exploration') >= 10 },
  { id: 'cat-deep-medicine', title: '岐黄传人', description: '浏览 10 个医学事件', emoji: '💉', category: 'special', check: ctx => countCategoryReads(ctx, 'medicine') >= 10 },
]

function countCategoryReads(ctx: AchievementContext, category: string): number {
  let count = 0
  for (const [id] of ctx.readIds.entries()) {
    if (ctx.eventCategories.get(id) === category) count++
  }
  return count
}

/** 计算已解锁的成就 */
export function useAchievements(
  readIds: Set<string>,
  events: Array<{ id: string; category: Category; year: number; significance: number }>
) {
  return useMemo(() => {
    const eventCategories = new Map<string, Category>()
    const eventYears = new Map<string, number>()
    const eventSignificances = new Map<string, number>()
    let milestoneCount = 0

    events.forEach(e => {
      eventCategories.set(e.id, e.category)
      eventYears.set(e.id, e.year)
      eventSignificances.set(e.id, e.significance)
      if (e.significance === 3) milestoneCount++
    })

    const ctx: AchievementContext = {
      readCount: readIds.size,
      readIds,
      eventCategories,
      eventYears,
      eventSignificances,
      totalEvents: events.length,
      milestoneCount,
    }

    const unlocked = ALL_ACHIEVEMENTS.filter(a => a.check(ctx))
    const locked = ALL_ACHIEVEMENTS.filter(a => !a.check(ctx))

    return { unlocked, locked, total: ALL_ACHIEVEMENTS.length, unlockedCount: unlocked.length }
  }, [readIds, events])
}
