import { useMemo } from 'react'
import type { Category, HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, ERAS, formatYear } from '@/data/types'

export type ExplorerMissionPayload =
  | { type: 'era'; yearRange: [number, number] }
  | { type: 'category'; category: Category }
  | { type: 'chain'; anchorId: string; search: string; focusYear: number }

export interface ExplorerMission {
  id: string
  kind: 'era' | 'category' | 'chain'
  title: string
  description: string
  accentClass: string
  targetCount: number
  progressCount: number
  completed: boolean
  reward: string
  ctaLabel: string
  hint: string
  payload: ExplorerMissionPayload
}

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

function pickBySeed<T>(items: T[], seed: number, offset: number) {
  if (items.length === 0) return undefined
  return items[(seed + offset) % items.length]
}

function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useExplorerMissions(events: HistoricalEvent[], readIds: Set<string>) {
  return useMemo(() => {
    if (events.length === 0) return [] as ExplorerMission[]

    const seed = hashString(`${getTodayKey()}-${events.length}`)
    const readEventMap = new Map(
      events
        .filter(event => readIds.has(event.id))
        .map(event => [event.id, event])
    )

    const eraCandidates = ERAS.filter(era =>
      events.filter(event => event.year >= era.startYear && event.year < era.endYear).length >= 12
    )

    const categoryCandidates = (Object.keys(CATEGORY_CONFIG) as Category[])
      .map(category => ({
        category,
        count: events.filter(event => event.category === category).length,
      }))
      .filter(item => item.count >= 12)
      .sort((a, b) => b.count - a.count)

    const chainCandidates = events
      .filter(event => (event.relatedIds?.length || 0) >= 2)
      .sort((a, b) => {
        const scoreA = (a.relatedIds?.length || 0) * 10 + a.significance
        const scoreB = (b.relatedIds?.length || 0) * 10 + b.significance
        return scoreB - scoreA
      })

    const selectedEra = pickBySeed(eraCandidates, seed, 1)
    const selectedCategory = pickBySeed(categoryCandidates, seed, 7)
    const selectedChain = pickBySeed(chainCandidates, seed, 13)

    const missions: ExplorerMission[] = []

    if (selectedEra) {
      const progressCount = Array.from(readEventMap.values()).filter(
        event => event.year >= selectedEra.startYear && event.year < selectedEra.endYear
      ).length
      const targetCount = 3

      missions.push({
        id: `era-${selectedEra.name}`,
        kind: 'era',
        title: `${selectedEra.name}穿梭任务`,
        description: `阅读 ${targetCount} 个 ${selectedEra.name} 事件，感受这个时代最强烈的文明脉搏。`,
        accentClass: 'from-amber-500/20 to-orange-500/10 border-amber-500/20',
        targetCount,
        progressCount,
        completed: progressCount >= targetCount,
        reward: '奖励：解锁一张新的时代护照印章',
        ctaLabel: '前往时代',
        hint: `${formatYear(selectedEra.startYear)} → ${formatYear(selectedEra.endYear - 1)}`,
        payload: {
          type: 'era',
          yearRange: [selectedEra.startYear, selectedEra.endYear],
        },
      })
    }

    if (selectedCategory) {
      const progressCount = Array.from(readEventMap.values()).filter(
        event => event.category === selectedCategory.category
      ).length
      const targetCount = 3
      const categoryLabel = CATEGORY_CONFIG[selectedCategory.category].label

      missions.push({
        id: `category-${selectedCategory.category}`,
        kind: 'category',
        title: `${categoryLabel}猎奇任务`,
        description: `阅读 ${targetCount} 个 ${categoryLabel} 类事件，看看一个领域如何改变整条时间线。`,
        accentClass: 'from-sky-500/20 to-cyan-500/10 border-sky-500/20',
        targetCount,
        progressCount,
        completed: progressCount >= targetCount,
        reward: `奖励：${categoryLabel} 线索卡 +1`,
        ctaLabel: '筛到这个领域',
        hint: `当前事件池中约 ${selectedCategory.count} 条 ${categoryLabel} 事件`,
        payload: {
          type: 'category',
          category: selectedCategory.category,
        },
      })
    }

    if (selectedChain) {
      const missionIds = [selectedChain.id, ...(selectedChain.relatedIds || [])].slice(0, 3)
      const progressCount = missionIds.filter(id => readIds.has(id)).length
      const targetCount = Math.min(2, missionIds.length)

      missions.push({
        id: `chain-${selectedChain.id}`,
        kind: 'chain',
        title: '因果链追踪任务',
        description: `从「${selectedChain.title}」出发，再追踪至少 ${Math.max(targetCount - 1, 1)} 个相关事件，体验历史如何一环扣一环。`,
        accentClass: 'from-violet-500/20 to-fuchsia-500/10 border-violet-500/20',
        targetCount,
        progressCount,
        completed: progressCount >= targetCount,
        reward: '奖励：时间侦探称号进度 +1',
        ctaLabel: '打开因果链',
        hint: `${formatYear(selectedChain.year)} · ${selectedChain.title}`,
        payload: {
          type: 'chain',
          anchorId: selectedChain.id,
          search: selectedChain.title,
          focusYear: selectedChain.year,
        },
      })
    }

    return missions
  }, [events, readIds])
}
