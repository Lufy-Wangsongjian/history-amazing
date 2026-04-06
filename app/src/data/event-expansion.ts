import type { HistoricalEvent, Category } from './types'
import { CATEGORY_CONFIG, REGION_CONFIG } from './types'

const DERIVED_PHASES = [
  { key: 'context', title: '背景酝酿', direction: -1, offset: 'major' },
  { key: 'acceleration', title: '关键推进', direction: -1, offset: 'minor' },
  { key: 'diffusion', title: '区域扩散', direction: 1, offset: 'minor' },
  { key: 'legacy', title: '长期影响', direction: 1, offset: 'major' },
] as const

const CATEGORY_ASPECT: Record<Category, string> = {
  literature: '文本生产与经典传播',
  science: '知识体系与方法论',
  music: '乐制、表演与传播网络',
  art: '审美风格与创作范式',
  philosophy: '思想论辩与学派传统',
  history: '制度秩序与社会结构',
  technology: '工艺路径与生产效率',
  architecture: '营造技术与城市空间',
  religion: '信仰组织与仪式秩序',
  warfare: '军事动员与权力格局',
  exploration: '航路网络与地理认知',
  medicine: '诊疗体系与公共健康',
}

const TIMELINE_MIN_YEAR = -20000
const TIMELINE_MAX_YEAR = 2029

export const HISTORICAL_EVENTS_MULTIPLIER = DERIVED_PHASES.length + 1

type DerivedPhase = typeof DERIVED_PHASES[number]

function getOffsetWindow(year: number) {
  const absoluteYear = Math.abs(year)

  if (absoluteYear >= 3000) return { major: 120, minor: 40 }
  if (absoluteYear >= 1500) return { major: 80, minor: 25 }
  if (year < 0) return { major: 40, minor: 12 }
  if (year < 1000) return { major: 20, minor: 8 }
  if (year < 1800) return { major: 12, minor: 4 }
  if (year < 1950) return { major: 6, minor: 2 }
  return { major: 3, minor: 1 }
}

function normalizeYear(year: number, direction: -1 | 1) {
  if (year === 0) {
    return direction < 0 ? -1 : 1
  }

  return year
}

function buildPhaseYear(baseYear: number, phase: DerivedPhase) {
  const offsets = getOffsetWindow(baseYear)
  const shift = phase.offset === 'major' ? offsets.major : offsets.minor
  const shiftedYear = normalizeYear(baseYear + phase.direction * shift, phase.direction)
  return Math.min(TIMELINE_MAX_YEAR, Math.max(TIMELINE_MIN_YEAR, shiftedYear))
}

function mergeRelatedIds(primaryIds: string[] | undefined, secondaryIds: string[]) {
  const seen = new Set<string>()
  const merged: string[] = []

  for (const id of [...(primaryIds ?? []), ...secondaryIds]) {
    if (!id || seen.has(id)) continue
    seen.add(id)
    merged.push(id)
  }

  return merged.length > 0 ? merged : undefined
}

function buildDerivedDescription(event: HistoricalEvent, phase: DerivedPhase) {
  const regionLabel = REGION_CONFIG[event.region].label
  const aspect = CATEGORY_ASPECT[event.category]

  switch (phase.key) {
    case 'context':
      return `围绕主事件「${event.title}」的前置背景展开，补足 ${regionLabel} 在 ${aspect} 上的酝酿过程。`
    case 'acceleration':
      return `围绕主事件「${event.title}」的关键推进阶段展开，呈现其从出现到成形的加速过程。`
    case 'diffusion':
      return `围绕主事件「${event.title}」的扩散阶段展开，补足其在更广范围传播后的连锁反应。`
    case 'legacy':
      return `围绕主事件「${event.title}」的长期影响展开，强调其在后续时代中的持续回响。`
  }
}

function buildDerivedDetails(event: HistoricalEvent, phase: DerivedPhase) {
  const categoryLabel = CATEGORY_CONFIG[event.category].label
  const regionLabel = REGION_CONFIG[event.region].label
  const aspect = CATEGORY_ASPECT[event.category]
  const figureText = event.figure ? ` 与 ${event.figure} 密切相关。` : ''
  const originalContext = event.details?.trim() || event.description

  const phaseLead = (() => {
    switch (phase.key) {
      case 'context':
        return `这是围绕主事件「${event.title}」生成的扩展时间节点，聚焦它出现之前的历史背景。`
      case 'acceleration':
        return `这是围绕主事件「${event.title}」生成的扩展时间节点，聚焦它进入关键推进期时的变化。`
      case 'diffusion':
        return `这是围绕主事件「${event.title}」生成的扩展时间节点，聚焦它在后续地区与群体中的扩散。`
      case 'legacy':
        return `这是围绕主事件「${event.title}」生成的扩展时间节点，聚焦它对后续时代的长期影响。`
    }
  })()

  return `${phaseLead} 它主要补足 ${regionLabel} 在 ${categoryLabel}（${aspect}）上的上下文脉络。主事件原始记录为：${event.description}${figureText}补充说明：${originalContext}`
}

function deriveSignificance(significance: HistoricalEvent['significance'], phase: DerivedPhase): HistoricalEvent['significance'] {
  if (phase.key === 'acceleration') {
    return significance
  }

  if (phase.key === 'legacy') {
    return Math.min(significance, 2) as HistoricalEvent['significance']
  }

  return Math.max(1, significance - 1) as HistoricalEvent['significance']
}

export function expandHistoricalEvents(baseEvents: HistoricalEvent[]) {
  const expanded = baseEvents.flatMap((event) => {
    const derivedIds = DERIVED_PHASES.map(phase => `${event.id}_${phase.key}`)

    const canonicalEvent: HistoricalEvent = {
      ...event,
      relatedIds: mergeRelatedIds(event.relatedIds, derivedIds),
    }

    const derivedEvents: HistoricalEvent[] = DERIVED_PHASES.map((phase, index) => {
      const id = derivedIds[index]
      const siblingIds = derivedIds.filter(derivedId => derivedId !== id)

      return {
        id,
        year: buildPhaseYear(event.year, phase),
        title: `「${event.title}」·${phase.title}`,
        description: buildDerivedDescription(event, phase),
        details: buildDerivedDetails(event, phase),
        category: event.category,
        region: event.region,
        significance: deriveSignificance(event.significance, phase),
        figure: event.figure,
        icon: event.icon,
        relatedIds: mergeRelatedIds(event.relatedIds, [event.id, ...siblingIds]),
      }
    })

    return [canonicalEvent, ...derivedEvents]
  })

  return expanded.sort((left, right) => left.year - right.year || left.id.localeCompare(right.id))
}
