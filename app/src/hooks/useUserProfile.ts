/**
 * 用户兴趣画像 Hook
 * 基于浏览行为（已读类别、收藏偏好）构建轻量画像，用于个性化推荐
 */
import { useMemo } from 'react'
import type { Category, HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, ERAS } from '@/data/types'

export interface UserProfile {
  /** 偏好类别（按阅读频率排序，前 3） */
  topCategories: Category[]
  /** 所有类别阅读计数 */
  categoryCounts: Record<string, number>
  /** 已探索时代 */
  exploredEras: string[]
  /** 未探索时代（知识盲区） */
  blindSpotEras: string[]
  /** 偏好地区（前 5） */
  topRegions: string[]
  /** 用户类型 */
  expertiseLevel: 'beginner' | 'intermediate' | 'expert'
  /** 总阅读量 */
  readCount: number
}

/**
 * 根据用户已读事件集合和全部事件，计算兴趣画像
 */
export function useUserProfile(
  readIds: Set<string>,
  events: HistoricalEvent[]
): UserProfile {
  return useMemo(() => {
    const readCount = readIds.size

    // ── 类别统计 ──
    const categoryCounts: Record<string, number> = {}
    const regionCounts: Record<string, number> = {}

    for (const event of events) {
      if (!readIds.has(event.id)) continue
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1
      regionCounts[event.region] = (regionCounts[event.region] || 0) + 1
    }

    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat as Category)

    const topCategories = sortedCategories.slice(0, 3)

    // ── 地区统计 ──
    const topRegions = Object.entries(regionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([region]) => region)

    // ── 时代探索 ──
    const exploredEras: string[] = []
    const blindSpotEras: string[] = []

    for (const era of ERAS) {
      const hasRead = events.some(
        e => readIds.has(e.id) && e.year >= era.startYear && e.year < era.endYear
      )
      if (hasRead) {
        exploredEras.push(era.name)
      } else {
        blindSpotEras.push(era.name)
      }
    }

    // ── 用户等级 ──
    let expertiseLevel: UserProfile['expertiseLevel'] = 'beginner'
    if (readCount >= 100) expertiseLevel = 'expert'
    else if (readCount >= 30) expertiseLevel = 'intermediate'

    return {
      topCategories,
      categoryCounts,
      exploredEras,
      blindSpotEras,
      topRegions,
      expertiseLevel,
      readCount,
    }
  }, [readIds, events])
}

/**
 * 基于用户画像推荐"猜你喜欢"事件
 * 策略：40% 偏好类别未读 + 40% 盲区时代 + 20% 高分随机
 */
export function getPersonalizedRecommendations(
  profile: UserProfile,
  events: HistoricalEvent[],
  readIds: Set<string>,
  count = 6
): HistoricalEvent[] {
  const unread = events.filter(e => !readIds.has(e.id))
  if (unread.length === 0) return []

  const result: HistoricalEvent[] = []
  const usedIds = new Set<string>()

  // 40% 偏好类别中未读的重要事件
  const preferredCount = Math.ceil(count * 0.4)
  if (profile.topCategories.length > 0) {
    const preferred = unread
      .filter(e => profile.topCategories.includes(e.category))
      .sort((a, b) => b.significance - a.significance)
    for (const e of preferred) {
      if (result.length >= preferredCount) break
      if (!usedIds.has(e.id)) {
        result.push(e)
        usedIds.add(e.id)
      }
    }
  }

  // 40% 盲区时代的里程碑事件（鼓励探索）
  const blindSpotCount = Math.ceil(count * 0.4)
  if (profile.blindSpotEras.length > 0) {
    const blindSpotEvents = unread.filter(e => {
      const era = ERAS.find(era => e.year >= era.startYear && e.year < era.endYear)
      return era && profile.blindSpotEras.includes(era.name)
    }).sort((a, b) => b.significance - a.significance)

    for (const e of blindSpotEvents) {
      if (result.length >= preferredCount + blindSpotCount) break
      if (!usedIds.has(e.id)) {
        result.push(e)
        usedIds.add(e.id)
      }
    }
  }

  // 20% 随机高分事件
  const remaining = count - result.length
  if (remaining > 0) {
    const highSignificance = unread
      .filter(e => e.significance >= 2 && !usedIds.has(e.id))
      .sort(() => Math.random() - 0.5)
    for (const e of highSignificance) {
      if (result.length >= count) break
      result.push(e)
    }
  }

  return result.slice(0, count)
}

/**
 * 基于用户画像生成个性化 AI 建议问题
 */
export function getPersonalizedSuggestions(profile: UserProfile): string[] {
  const suggestions: string[] = []

  // 基于偏好类别
  const categoryQuestions: Record<string, string[]> = {
    literature: ['哪些文学作品改变了人类思想？', '中国古典文学的巅峰在哪个时代？'],
    science: ['科学革命是怎么发生的？', '哪些科学发现最出人意料？'],
    music: ['音乐如何反映时代变迁？', '巴赫和贝多芬谁的影响更大？'],
    art: ['为什么文艺复兴发生在意大利？', '东方和西方的艺术有什么本质区别？'],
    philosophy: ['东方哲学和西方哲学最大的分歧是什么？', '孔子和苏格拉底谁更早？'],
    history: ['历史上最大的帝国是哪个？', '哪些战争改变了世界格局？'],
    technology: ['四大发明如何改变世界？', '人工智能会超越人类吗？'],
    architecture: ['金字塔是怎么建造的？', '哥特式教堂为什么那么高？'],
    religion: ['世界三大宗教有什么共同点？', '佛教是怎么传入中国的？'],
    warfare: ['哪场战役改变了历史走向？', '冷战是怎么结束的？'],
    exploration: ['大航海时代的动力是什么？', '人类是怎么走出非洲的？'],
    medicine: ['黑死病如何改变了欧洲？', '疫苗是怎么发明的？'],
  }

  // 添加偏好类别的问题
  for (const cat of profile.topCategories) {
    const qs = categoryQuestions[cat]
    if (qs) suggestions.push(qs[Math.floor(Math.random() * qs.length)])
  }

  // 基于盲区推荐探索
  if (profile.blindSpotEras.length > 0) {
    const era = profile.blindSpotEras[Math.floor(Math.random() * profile.blindSpotEras.length)]
    suggestions.push(`带我了解${era}时期发生了什么`)
  }

  // 基于等级推荐
  if (profile.expertiseLevel === 'beginner') {
    suggestions.push('人类文明史上最重要的 5 个转折点是什么？')
  } else if (profile.expertiseLevel === 'expert') {
    suggestions.push('有没有被低估的历史事件值得关注？')
  }

  // 补充通用问题
  const general = [
    '东西方文明在什么时候开始交流？',
    '工业革命为什么首先发生在英国？',
    '二战有哪些关键转折点？',
  ]
  while (suggestions.length < 6) {
    suggestions.push(general[suggestions.length % general.length])
  }

  return suggestions.slice(0, 6)
}
