import type { HistoricalEvent, Category } from '@/data/types'

/**
 * 智能推荐引擎
 * 基于用户阅读历史推荐"下一个你可能感兴趣的事件"
 *
 * 策略：
 * 1. 统计用户偏好的类目和地区（按阅读频率加权）
 * 2. 优先推荐因果关联事件（但用户还没看过的）
 * 3. 其次推荐同类目/同地区中重要度高的事件
 * 4. 最后引入多样性——偶尔推荐用户不常看的类目（拓展视野）
 */

interface RecommendationResult {
  event: HistoricalEvent
  reason: string
  score: number
}

export function generateRecommendations(
  currentEvent: HistoricalEvent,
  allEvents: HistoricalEvent[],
  readIds: Set<string>,
  maxResults: number = 4,
): RecommendationResult[] {
  if (allEvents.length === 0) return []

  // Build reading profile
  const categoryFreq = new Map<Category, number>()
  const regionFreq = new Map<string, number>()

  for (const evt of allEvents) {
    if (readIds.has(evt.id)) {
      categoryFreq.set(evt.category, (categoryFreq.get(evt.category) || 0) + 1)
      regionFreq.set(evt.region, (regionFreq.get(evt.region) || 0) + 1)
    }
  }

  const candidates: RecommendationResult[] = []
  const currentId = currentEvent.id
  const currentRelated = new Set(currentEvent.relatedIds || [])

  for (const evt of allEvents) {
    // Skip current event and already-read events
    if (evt.id === currentId || readIds.has(evt.id)) continue

    let score = 0
    let reason = ''

    // 1. Causal connection (highest priority)
    if (currentRelated.has(evt.id)) {
      score += 50
      reason = '因果关联'
    }

    // Check if the candidate has a relatedId pointing to currentEvent
    if (evt.relatedIds?.includes(currentId)) {
      score += 45
      if (!reason) reason = '因果关联'
    }

    // 2. Same category preference
    const catWeight = categoryFreq.get(evt.category) || 0
    if (evt.category === currentEvent.category) {
      score += 20 + Math.min(catWeight * 2, 15)
      if (!reason) reason = '同类目'
    } else if (catWeight > 0) {
      score += Math.min(catWeight * 2, 10)
      if (!reason && catWeight >= 3) reason = '你常看的类目'
    }

    // 3. Same region preference
    const regWeight = regionFreq.get(evt.region) || 0
    if (evt.region === currentEvent.region) {
      score += 10 + Math.min(regWeight, 8)
      if (!reason) reason = '同地区'
    }

    // 4. Temporal proximity
    const yearDiff = Math.abs(evt.year - currentEvent.year)
    if (yearDiff <= 50) {
      score += 15
      if (!reason) reason = '同时代'
    } else if (yearDiff <= 200) {
      score += 8
    }

    // 5. Significance bonus
    if (evt.significance === 3) {
      score += 12
      if (!reason) reason = '里程碑事件'
    } else if (evt.significance === 2) {
      score += 5
    }

    // 6. Diversity bonus — occasionally recommend from underexplored categories
    if (catWeight === 0 && evt.significance >= 2) {
      score += 8
      if (!reason) reason = '拓展视野'
    }

    if (score > 0) {
      candidates.push({ event: evt, reason, score })
    }
  }

  // Sort by score descending, take top N
  candidates.sort((a, b) => b.score - a.score)

  // Ensure diversity: don't recommend all from same category
  const results: RecommendationResult[] = []
  const usedCategories = new Set<string>()

  for (const c of candidates) {
    if (results.length >= maxResults) break
    // Allow max 2 from same category
    const catCount = [...results].filter(r => r.event.category === c.event.category).length
    if (catCount >= 2) continue
    results.push(c)
    usedCategories.add(c.event.category)
  }

  // If we still have room, fill with remaining candidates
  if (results.length < maxResults) {
    for (const c of candidates) {
      if (results.length >= maxResults) break
      if (results.some(r => r.event.id === c.event.id)) continue
      results.push(c)
    }
  }

  return results
}
