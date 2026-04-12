import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'

export interface FunFact {
  emoji: string
  text: string
}

/**
 * 从事件数据中自动生成趣味历史冷知识
 */
export function generateFunFacts(events: HistoricalEvent[]): FunFact[] {
  const facts: FunFact[] = []
  if (events.length === 0) return facts

  // 1. 最古老的事件
  const oldest = events.reduce((min, e) => e.year < min.year ? e : min, events[0])
  if (oldest) {
    const yearsAgo = oldest.year < 0
      ? new Date().getFullYear() + Math.abs(oldest.year)
      : new Date().getFullYear() - oldest.year
    facts.push({
      emoji: '🏛️',
      text: `这里最古老的事件是「${oldest.title}」，发生在${formatYear(oldest.year)}，距今已有 ${yearsAgo} 年！`,
    })
  }

  // 2. 最多事件的世纪
  const centuryMap = new Map<number, number>()
  events.forEach(e => {
    const century = Math.floor(e.year / 100)
    centuryMap.set(century, (centuryMap.get(century) || 0) + 1)
  })
  let busiestCentury = 0, busiestCount = 0
  centuryMap.forEach((count, century) => {
    if (count > busiestCount) { busiestCentury = century; busiestCount = count }
  })
  if (busiestCount > 0) {
    const centuryLabel = busiestCentury >= 0
      ? `公元 ${busiestCentury * 100}~${(busiestCentury + 1) * 100} 年`
      : `公元前 ${Math.abs(busiestCentury + 1) * 100}~${Math.abs(busiestCentury) * 100} 年`
    facts.push({
      emoji: '📊',
      text: `人类文明最「忙碌」的 100 年是 ${centuryLabel}，记录了 ${busiestCount} 条历史事件。`,
    })
  }

  // 3. 出现最多次的人物
  const figureMap = new Map<string, number>()
  events.forEach(e => {
    if (e.figure) {
      e.figure.split(/[、,，/]/).map(n => n.trim()).filter(Boolean).forEach(name => {
        figureMap.set(name, (figureMap.get(name) || 0) + 1)
      })
    }
  })
  const topFigure = Array.from(figureMap.entries()).sort((a, b) => b[1] - a[1])[0]
  if (topFigure) {
    facts.push({
      emoji: '👤',
      text: `出场次数最多的历史人物是「${topFigure[0]}」，在 ${topFigure[1]} 个事件中被提及。`,
    })
  }

  // 4. 持续时间最长的事件
  const longestDuration = events
    .filter(e => e.endYear)
    .reduce((max, e) => {
      const dur = (e.endYear! - e.year)
      return dur > (max?.duration || 0) ? { event: e, duration: dur } : max
    }, null as { event: HistoricalEvent; duration: number } | null)
  if (longestDuration) {
    facts.push({
      emoji: '⏳',
      text: `持续时间最长的事件是「${longestDuration.event.title}」，跨越了 ${longestDuration.duration} 年。`,
    })
  }

  // 5. 里程碑事件数量
  const milestones = events.filter(e => e.significance === 3)
  facts.push({
    emoji: '⭐',
    text: `在全部 ${events.length} 条事件中，有 ${milestones.length} 个被标记为「里程碑」——它们改变了文明的走向。`,
  })

  // 6. 涉及国家最多的类目
  const catRegionMap = new Map<string, Set<string>>()
  events.forEach(e => {
    if (!catRegionMap.has(e.category)) catRegionMap.set(e.category, new Set())
    catRegionMap.get(e.category)!.add(e.region)
  })
  let globalCat = '', globalRegionCount = 0
  catRegionMap.forEach((regions, cat) => {
    if (regions.size > globalRegionCount) { globalCat = cat; globalRegionCount = regions.size }
  })
  if (globalCat) {
    facts.push({
      emoji: '🌍',
      text: `「${CATEGORY_CONFIG[globalCat as keyof typeof CATEGORY_CONFIG]?.label || globalCat}」是最全球化的领域，涉及 ${globalRegionCount} 个国家和地区。`,
    })
  }

  // 7. 同一年发生最多事件
  const yearMap = new Map<number, number>()
  events.forEach(e => yearMap.set(e.year, (yearMap.get(e.year) || 0) + 1))
  let busiestYear = 0, busiestYearCount = 0
  yearMap.forEach((count, year) => {
    if (count > busiestYearCount) { busiestYear = year; busiestYearCount = count }
  })
  if (busiestYearCount > 1) {
    facts.push({
      emoji: '🔥',
      text: `${formatYear(busiestYear)} 是历史上最「爆」的一年——同年发生了 ${busiestYearCount} 件大事！`,
    })
  }

  // 8. 中国事件占比
  const chinaCount = events.filter(e => e.region === 'china').length
  if (chinaCount > 0) {
    facts.push({
      emoji: '🇨🇳',
      text: `中国历史事件有 ${chinaCount} 条，占全部事件的 ${Math.round(chinaCount / events.length * 100)}%。`,
    })
  }

  // 9. 文学事件统计
  const litEvents = events.filter(e => e.category === 'literature')
  if (litEvents.length > 0) {
    const oldestLit = litEvents.reduce((min, e) => e.year < min.year ? e : min, litEvents[0])
    facts.push({
      emoji: '📚',
      text: `文学类事件共 ${litEvents.length} 条，最古老的是「${oldestLit.title}」（${formatYear(oldestLit.year)}）——人类用文字记录故事的传统比很多帝国都要长寿。`,
    })
  }

  // 10. 音乐事件统计
  const musicEvents = events.filter(e => e.category === 'music')
  if (musicEvents.length > 0) {
    const musicRegions = new Set(musicEvents.map(e => e.region))
    facts.push({
      emoji: '🎵',
      text: `音乐类事件覆盖了 ${musicRegions.size} 个国家和地区——从苏美尔竖琴到韩国流行乐，音乐真的是人类的通用语言。`,
    })
  }

  // 11. 文学 vs 音乐里程碑对比
  const litMilestones = litEvents.filter(e => e.significance === 3).length
  const musicMilestones = musicEvents.filter(e => e.significance === 3).length
  if (litMilestones > 0 && musicMilestones > 0) {
    facts.push({
      emoji: '🏆',
      text: `文学有 ${litMilestones} 个里程碑事件，音乐有 ${musicMilestones} 个——${litMilestones > musicMilestones ? '文学在"改变世界的事件"上略胜一筹' : musicMilestones > litMilestones ? '音乐在"改变世界的事件"上略胜一筹' : '两者势均力敌'}。`,
    })
  }

  // 12. 诗歌事件统计
  const poetryEvents = events.filter(e => e.category === 'literature' && /诗|poem|poetry|抒情|词|俳句|十四行|sonnet|离骚|草叶/i.test(`${e.title} ${e.description}`))
  if (poetryEvents.length >= 3) {
    facts.push({
      emoji: '🖊️',
      text: `收录了 ${poetryEvents.length} 条与诗歌相关的事件——从三千年前的《诗经》到现代主义的《荒原》，诗歌是人类坚持得最久的艺术形式。`,
    })
  }

  // 13. 音乐剧事件统计
  const musicalEvents = events.filter(e => /音乐剧|musical|百老汇|Broadway|西区故事|歌剧魅影|猫|汉密尔顿|Hamilton|韦伯|魔法坏女巫/i.test(`${e.title} ${e.description}`))
  if (musicalEvents.length >= 3) {
    facts.push({
      emoji: '🎭',
      text: `收录了 ${musicalEvents.length} 条音乐剧相关事件——百老汇每年吸引超过 1400 万观众，一条不到一公里的街道承载着全球最集中的现场表演艺术。`,
    })
  }

  // 14. 中国古典诗词统计
  const chinaPoetryEvents = events.filter(e =>
    e.region === 'china' && e.category === 'literature' &&
    /诗经|楚辞|离骚|唐诗|宋词|元曲|李白|杜甫|苏轼|李清照|辛弃疾|白居易|王维|柳永|关汉卿|马致远|窦娥|西厢|牡丹亭|诗人|词|曲|建安|乐府|国风/i.test(`${e.title} ${e.description}`)
  )
  if (chinaPoetryEvents.length >= 5) {
    facts.push({
      emoji: '📜',
      text: `中国古典诗词相关事件有 ${chinaPoetryEvents.length} 条——从《诗经》到元曲跨越两千多年。"唐诗宋词元曲"是中国人的精神家底，也是汉语最精美的结晶。`,
    })
  }

  return facts
}

/** Hook: 获取随机一条冷知识 */
export function useRandomFact(events: HistoricalEvent[]): FunFact | null {
  return useMemo(() => {
    if (events.length === 0) return null
    const facts = generateFunFacts(events)
    return facts[Math.floor(Math.random() * facts.length)] || null
  }, [events])
}
