import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'

const SIGNIFICANCE_COPY: Record<HistoricalEvent['significance'], string> = {
  1: '它代表了一条值得被记录的文明切面，适合放回更长的时间线里理解其位置。',
  2: '它通常意味着一个更明显的转折点，能够帮助理解相关地区或领域的变化轨迹。',
  3: '它属于里程碑级节点，往往会对后续几十年甚至数百年的文明演进产生持续影响。',
}

export function buildEventDetailParagraphs(event: HistoricalEvent) {
  const category = CATEGORY_CONFIG[event.category]
  const region = REGION_CONFIG[event.region]
  const era = getEra(event.year)
  const durationText = event.endYear
    ? `，并延续至 ${formatYear(event.endYear)}，持续约 ${event.endYear - event.year} 年`
    : ''
  const figureText = event.figure
    ? `这条事件与 ${event.figure} 密切相关，人物因素是理解它的重要线索。`
    : '这条事件更适合从制度、社会结构或技术演化的角度来理解。'

  if (event.details?.trim()) {
    return [
      event.details.trim(),
      `${event.title} 发生在 ${formatYear(event.year)} 的 ${region.label}${durationText}。从主题上看，它属于“${category.label}”维度${era ? `，并处在“${era.name}”这一时代背景中` : ''}。${SIGNIFICANCE_COPY[event.significance]}`,
      figureText,
    ]
  }

  return [
    `${event.title} 发生在 ${formatYear(event.year)} 的 ${region.label}${durationText}。${event.description}`,
    `${era ? `从时间坐标看，它位于“${era.name}”阶段。` : ''}从主题分类看，这是一条“${category.label}”相关事件，说明当时的人类社会正在这一维度上发生关键变化。${SIGNIFICANCE_COPY[event.significance]}`,
    figureText,
  ]
}

export function buildEventDetailPreview(event: HistoricalEvent) {
  const paragraphs = buildEventDetailParagraphs(event)
  return paragraphs.slice(0, 2)
}
