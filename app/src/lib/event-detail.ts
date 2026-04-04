import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'

/* ---------- 按类目维度的叙事引导 ---------- */
const CATEGORY_NARRATIVE: Record<string, string> = {
  history: '这一事件折射出当时人类社会权力结构与秩序的深层变动——新的制度、疆域或统治逻辑在此刻萌芽，并在此后的漫长岁月中持续塑造着相关文明的走向。',
  technology: '技术的跃迁往往悄然发生于某个工坊或实验室，却能在数代人之间重新定义生产方式与生活面貌。这一事件正是这样的转折——它打破了旧有的技术天花板，为此后更大规模的社会变革提供了物质基础。',
  science: '人类对自然界的追问在这里迈出了关键一步。无论是一次精密的观测还是一个跨时代的理论突破，它都拓宽了人类认知的边界，并为后续的科学探索打开了新的大门。',
  literature: '文字是文明最持久的回声。这一作品或书写体系的出现，不仅记录了当时的思想与情感，也为后世的读者和创作者构建了理解世界的新框架。',
  art: '艺术是文明的镜子，也是它最敏锐的触角。这一创造性事件在视觉语言和审美观念上打开了新的可能，其影响往往超越了作品本身，渗透到一个时代的精神气质之中。',
  philosophy: '当人类开始追问"何为善""何为真""何为正义"，文明便进入了自我反思的阶段。这一思想事件代表了某种根本性的精神探索，其提出的命题至今仍回荡在人类的思辨传统中。',
  religion: '信仰塑造了人类最深层的价值观和世界图景。这一宗教事件不仅改变了信众的精神生活，也深刻影响了社会组织、法律制度和文化表达。',
  warfare: '战争是文明最残酷的考验，也是权力格局最剧烈的重组。这一军事冲突的结局改写了相关地区的力量对比，其影响远远超出了战场本身。',
  music: '音乐是人类情感最纯粹的表达形式。这一音乐事件标志着某种新的声音语言或审美趣味的诞生，在听觉艺术的长河中留下了不可磨灭的印记。',
  medicine: '面对疾病与死亡，人类始终没有停止探索的脚步。这一医学事件代表了人类在理解和抗击疾病方面的重要进展，改善了无数人的生命质量和预期寿命。',
  architecture: '建筑是凝固的文明。每一座伟大建筑都凝结着那个时代的技术能力、审美理想和社会组织水平，它既是功能的产物，也是精神的纪念碑。',
  exploration: '对未知世界的好奇驱使人类不断跨越山海。这一探索事件拓展了人类已知世界的边界，促进了不同文明之间的接触与交流，也改变了人们对地球和自身的认识。',
}

/* ---------- 按重要程度的总结语 ---------- */
const SIGNIFICANCE_CLOSING: Record<HistoricalEvent['significance'], string> = {
  1: '它是文明拼图中不可或缺的一块碎片——单独看也许不够醒目，但放在更长的时间线上，它帮助我们理解这一地区或领域是如何一步步走到今天的。',
  2: '它是历史进程中一个清晰的转折点，标志着某种旧秩序的松动或新可能的开启。理解它，有助于我们把握此后一系列变化的脉络。',
  3: '这是一个里程碑级的历史节点——它的影响如同投入湖面的巨石，激起的涟漪在此后几十年甚至数百年间持续扩散，深刻塑造了我们今天所见的世界。',
}

/* ---------- 人物相关叙事 ---------- */
function buildFigureNarrative(event: HistoricalEvent): string {
  if (!event.figure) {
    return '这一事件的推动力来自制度演化、社会结构变迁或技术进步的内在逻辑，而非某个单一人物的意志——理解它需要将目光投向更宏观的历史脉络。'
  }
  return `${event.figure} 是这一事件的关键人物。个人的远见、决断或才华在此刻与时代的洪流交汇，产生了超越个体生命的深远影响。理解 ${event.figure} 的抱负与局限，是把握这段历史的重要线索。`
}

/* ---------- 主函数 ---------- */
export function buildEventDetailParagraphs(event: HistoricalEvent) {
  const category = CATEGORY_CONFIG[event.category]
  const region = REGION_CONFIG[event.region]
  const era = getEra(event.year)
  const durationText = event.endYear
    ? `，并延续至 ${formatYear(event.endYear)}，持续约 ${event.endYear - event.year} 年`
    : ''

  // 有手写 details 的事件——直接使用，但搭配更好的上下文段落
  if (event.details?.trim()) {
    return [
      event.details.trim(),
      `${event.title} 发生在 ${formatYear(event.year)} 的 ${region.label}${durationText}。${era ? `在"${era.name}"这一时代背景下，` : ''}${CATEGORY_NARRATIVE[event.category] || `这是一条"${category.label}"维度的重要事件。`}`,
      buildFigureNarrative(event) + ' ' + SIGNIFICANCE_CLOSING[event.significance],
    ]
  }

  // 没有 details 的事件——生成有深度的叙事段落
  const contextLine = era
    ? `${formatYear(event.year)} 年的 ${region.label}，正处于"${era.name}"时期。`
    : `${formatYear(event.year)} 年的 ${region.label}。`

  return [
    `${contextLine}${event.description}`,
    CATEGORY_NARRATIVE[event.category] || `这是一条"${category.label}"维度的重要事件，说明当时的人类社会正在这一领域发生关键变化。`,
    buildFigureNarrative(event) + ' ' + SIGNIFICANCE_CLOSING[event.significance],
  ]
}

export function buildEventDetailPreview(event: HistoricalEvent) {
  const paragraphs = buildEventDetailParagraphs(event)
  return paragraphs.slice(0, 2)
}
