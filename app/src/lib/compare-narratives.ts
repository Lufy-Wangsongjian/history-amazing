/**
 * 多文明圈对比叙事引擎
 *
 * 为 CompareView 提供：
 * 1. 时代级多文明洞察（每个时代各文明圈在干什么）
 * 2. 共振年份微解读（同年不同文明圈事件之间的关联解读）
 */

import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
// CivilizationCircle type used by consumers, not directly here

/* ================================================================
   时代对比洞察（多文明圈版）
   ================================================================ */

interface CivInsight {
  civId: string
  text: string
}

interface MultiCivEraInsight {
  insights: CivInsight[]
  contrast: string
}

const ERA_MULTI_INSIGHTS: Record<string, MultiCivEraInsight> = {
  '远古文明': {
    insights: [
      { civId: 'east-asia', text: '黄河与长江流域出现定居农业和彩陶文化，中国进入新石器时代的繁荣期。' },
      { civId: 'south-asia', text: '印度河流域建起了规划严整的城市——哈拉帕和摩亨佐-达罗，拥有先进的排水系统。' },
      { civId: 'middle-east', text: '美索不达米亚发明了文字和轮子，尼罗河畔的法老开始修建金字塔。' },
      { civId: 'europe', text: '克里特岛的米诺斯文明正在地中海东部绽放，巨石阵在不列颠矗立。' },
      { civId: 'americas', text: '美洲原住民独立驯化了玉米、南瓜和豆类，开创了自己的农业革命。' },
      { civId: 'africa', text: '撒哈拉还是绿洲，北非的岩画记录了远古人类与野生动物共存的岁月。' },
    ],
    contrast: '六大文明几乎同时独立地发明了农业和城市——人类文明的起跑线比我们想象中更整齐。从美索不达米亚的楔形文字到中国的彩陶，各自用不同方式回答了同一个问题：如何让更多人在一起生活？',
  },
  '古典时代': {
    insights: [
      { civId: 'east-asia', text: '商周建立了以青铜礼器为核心的政治秩序，甲骨文记录了最早的中国历史。' },
      { civId: 'south-asia', text: '吠陀时代的印度孕育了种姓制度和梵文经典，奥义书开启了哲学的深度探索。' },
      { civId: 'middle-east', text: '亚述、巴比伦和波斯帝国轮番统治两河流域，腓尼基人发明了字母文字。' },
      { civId: 'europe', text: '希腊发明了城邦政治和哲学思辨，克里特文明传承给了迈锡尼。' },
      { civId: 'africa', text: '库施王国在尼罗河上游崛起，成为埃及文明的重要继承者和竞争者。' },
    ],
    contrast: '古典时代是"规则制定期"——每个文明都在用自己的方式回答"人应该如何被治理"：中国选择了礼制，印度选择了种姓，希腊选择了公民投票，波斯选择了宗教宽容的帝国治理。',
  },
  '轴心时代': {
    insights: [
      { civId: 'east-asia', text: '孔子和老子几乎同时出现，分别提出了"仁"的社会伦理和"道"的宇宙哲学。' },
      { civId: 'south-asia', text: '释迦牟尼在菩提树下悟道，耆那教的大雄也在追求灵魂的解脱。' },
      { civId: 'middle-east', text: '波斯帝国在实践宗教宽容，犹太先知们在巴比伦之囚中锤炼了一神教信仰。' },
      { civId: 'europe', text: '苏格拉底、柏拉图和亚里士多德用理性追问"什么是真理"，雅典成为民主的实验场。' },
    ],
    contrast: '雅斯贝尔斯所说的"轴心时代"在这里清晰可见：中国、印度、中东和希腊在互不知晓的情况下，几乎同时产生了影响数千年的精神觉醒——这是人类历史最令人惊叹的"巧合"。',
  },
  '帝国时代': {
    insights: [
      { civId: 'east-asia', text: '汉帝国统一中国并开辟丝绸之路，儒学成为官方意识形态。' },
      { civId: 'south-asia', text: '孔雀王朝的阿育王将佛教从地区信仰推广为世界宗教，贵霜帝国连接了印度与中亚。' },
      { civId: 'middle-east', text: '帕提亚帝国控制着丝绸之路的中段，犹太人在罗马统治下经历了大离散。' },
      { civId: 'europe', text: '罗马帝国用道路、法律和拉丁语将地中海世界连为一体。' },
      { civId: 'africa', text: '阿克苏姆王国控制红海贸易，成为连接非洲与印度洋世界的枢纽。' },
    ],
    contrast: '汉帝国和罗马帝国分据欧亚大陆东西两端，从未正式接触，却通过丝绸之路间接互相影响——中国的丝绸穿在罗马贵族身上，罗马的玻璃器皿出现在中国墓葬中。而在它们之间，贵霜、帕提亚和阿克苏姆构成了贸易网络的中间节点。',
  },
  '中世纪': {
    insights: [
      { civId: 'east-asia', text: '唐宋时期是中国文化的巅峰——科举、活字印刷、火药和指南针都诞生于此。' },
      { civId: 'south-asia', text: '笈多和朱罗王朝创造了印度古典文化的黄金时代，数学上发明了"零"。' },
      { civId: 'middle-east', text: '伊斯兰世界进入知识黄金时代——巴格达智慧宫保存了古典文献，代数和光学在这里诞生。' },
      { civId: 'europe', text: '欧洲在封建制和基督教下缓慢重建，大学、哥特式大教堂和十字军远征是这个时期的标志。' },
      { civId: 'southeast-asia', text: '吴哥窟和婆罗浮屠拔地而起，东南亚的印度化王国进入了建筑和艺术的黄金时代。' },
      { civId: 'africa', text: '马里帝国的曼萨穆萨富甲天下，廷巴克图成为撒哈拉以南的学术中心。' },
    ],
    contrast: '中世纪是东西方差距最悬殊的时期——当欧洲在"黑暗时代"挣扎时，伊斯兰世界和中国正创造着让后世惊叹的成就。东南亚和非洲也绝非沉默的旁观者，吴哥窟和廷巴克图足以证明文明的多中心性。',
  },
  '文艺复兴前夜': {
    insights: [
      { civId: 'east-asia', text: '蒙古帝国横扫欧亚，元朝统治下的中国展现了罕见的对外开放，但也承受了巨大的战乱创伤。' },
      { civId: 'south-asia', text: '德里苏丹国将伊斯兰文化带入南亚次大陆，印度教和伊斯兰文化开始了漫长的碰撞与融合。' },
      { civId: 'middle-east', text: '蒙古铁骑摧毁了巴格达，伊斯兰世界的重心从阿拉伯转向了突厥人和波斯人。' },
      { civId: 'europe', text: '意大利城邦的商业财富正在孕育文化革命，马可波罗的东方见闻激发了欧洲人的想象。' },
    ],
    contrast: '蒙古帝国像一股强风，把东西方原本各自封闭的世界吹到了一起。这次强制性的"全球化"虽然伴随着巨大的破坏，却为文艺复兴和大航海时代埋下了种子。',
  },
  '文艺复兴': {
    insights: [
      { civId: 'east-asia', text: '明帝国的郑和七下西洋展示了东方的海上力量，但随后的"禁海"政策成为影响深远的转折。' },
      { civId: 'south-asia', text: '莫卧儿帝国统一了印度，泰姬陵成为伊斯兰与印度美学融合的不朽象征。' },
      { civId: 'middle-east', text: '奥斯曼帝国攻陷君士坦丁堡，成为横跨三大洲的强权，但也把古希腊学者推向了西方。' },
      { civId: 'europe', text: '达芬奇在画布上探索人体，哥伦布在大西洋上追逐黄金——欧洲同时经历着精神和物质的双重爆发。' },
      { civId: 'americas', text: '阿兹特克的特诺奇蒂特兰和印加的马丘比丘证明，美洲文明在没有铁器和车轮的情况下达到了惊人的高度。' },
    ],
    contrast: '15-16世纪是全球文明格局开始剧变的关键期。当明朝选择内收、奥斯曼扩张到极限时，欧洲选择了外扩——这个方向差异在此后三百年被放大为巨大的力量不对称。而美洲文明正在巅峰期突然遭遇了毁灭性的外来冲击。',
  },
  '科学革命': {
    insights: [
      { civId: 'east-asia', text: '清帝国维持着庞大的疆域，但对科学方法的系统性探索基本缺席。日本在锁国中酝酿町人文化。' },
      { civId: 'south-asia', text: '莫卧儿帝国走向衰落，英国东印度公司逐步蚕食印度次大陆。' },
      { civId: 'middle-east', text: '奥斯曼帝国开始了漫长的衰落，"东方问题"成为欧洲外交的核心议题。' },
      { civId: 'europe', text: '伽利略、牛顿用实验和数学重新理解自然——这不只是科学的进步，更是认识论的革命。' },
      { civId: 'americas', text: '殖民地在独立运动中孕育新国家，美国独立宣言和海地革命改变了世界秩序。' },
    ],
    contrast: '科学革命是全球力量对比急剧变化的转折点。欧洲发展出了"用实验质疑权威"的方法论，这不是因为其他文明不聪明，而是一系列历史偶然的叠加——而这个优势一旦建立，就通过殖民和贸易迅速改变了每一个文明圈的命运。',
  },
  '工业时代': {
    insights: [
      { civId: 'east-asia', text: '鸦片战争打开了中国大门，日本通过明治维新走上"脱亚入欧"之路。东方世界在冲击下被迫重新定义自身。' },
      { civId: 'south-asia', text: '英国完成了对印度的全面殖民统治，印度铁路和英语教育深刻改变了次大陆。' },
      { civId: 'middle-east', text: '苏伊士运河通航缩短了东西方距离，奥斯曼帝国在各方压力下摇摇欲坠。' },
      { civId: 'europe', text: '蒸汽机、铁路和工厂将欧洲从农业社会推入工业文明，美国作为新兴力量迅速崛起。' },
      { civId: 'africa', text: '柏林会议上欧洲列强瓜分非洲，这片大陆经历了最黑暗的殖民时期。' },
    ],
    contrast: '19世纪是全球力量最不对等的时期——工业化赋予欧洲压倒性的军事和经济优势，但每个被冲击的文明圈都以自己的方式回应：中国有太平天国和洋务运动，日本有明治维新，印度有民族主义觉醒，非洲则在殖民的压迫中积蓄着独立的力量。',
  },
  '现代': {
    insights: [
      { civId: 'east-asia', text: '中国崛起为世界第二大经济体，日本动漫和韩流席卷全球——东亚正以多元方式重新定义全球话语。' },
      { civId: 'south-asia', text: '印度独立后成为世界最大的民主国家，IT产业和航天计划展示了新印度的雄心。' },
      { civId: 'middle-east', text: '石油改变了中东的命运，以阿冲突和伊斯兰复兴运动重塑了地区格局。' },
      { civId: 'europe', text: '两次世界大战削弱了欧洲，美国成为超级大国，但单极格局正在被多极化趋势取代。' },
      { civId: 'africa', text: '非洲独立浪潮创造了数十个新国家，21世纪的非洲是全球增长最快的大陆之一。' },
      { civId: 'americas', text: '拉丁美洲在民主化浪潮中寻找自己的道路，美国引领了信息技术革命。' },
    ],
    contrast: '21世纪的世界正在告别任何单一文明主导的叙事。全球化让各文明圈前所未有地紧密连接，但每个文明仍保持着独特的韵律。理解这种多元并存，需要回到这条6000年的时间线，看看"文明"从来就不是一条单行道。',
  },
}

export function getMultiCivEraInsight(eraName: string): MultiCivEraInsight | null {
  return ERA_MULTI_INSIGHTS[eraName] || null
}

// 保持向后兼容的旧接口（如果其他地方还在用）
interface EraInsight {
  east: string
  west: string
  contrast: string
}

export function getEraInsight(eraName: string): EraInsight | null {
  const multi = ERA_MULTI_INSIGHTS[eraName]
  if (!multi) return null
  const eastInsight = multi.insights.find(i => i.civId === 'east-asia')
  const europeInsight = multi.insights.find(i => i.civId === 'europe')
  return {
    east: eastInsight?.text || '',
    west: europeInsight?.text || '',
    contrast: multi.contrast,
  }
}

/* ================================================================
   共振年份微解读（多文明圈版）
   ================================================================ */

export function buildResonanceNarrative(
  year: number,
  eastEvents: HistoricalEvent[],
  westEvents: HistoricalEvent[],
): string | null {
  if (eastEvents.length === 0 || westEvents.length === 0) return null

  const eastTop = eastEvents[0]
  const westTop = westEvents[0]

  const eastCat = CATEGORY_CONFIG[eastTop.category].label
  const westCat = CATEGORY_CONFIG[westTop.category].label

  if (eastTop.category === westTop.category) {
    return `${formatYear(year)}，不同文明圈在"${eastCat}"领域几乎同时发生了重要事件——「${eastTop.title}」和「${westTop.title}」。这种跨文明的同步性暗示着人类社会在面对相似挑战时，往往会产生相似的回应。`
  }

  return `${formatYear(year)}，一边在"${eastCat}"方面经历了「${eastTop.title}」，另一边则在"${westCat}"领域见证了「${westTop.title}」。同一时刻、不同维度的变化交织在一起，构成了那个年代的文明全景。`
}

/** 多文明圈版共振解读 */
export function buildMultiCivResonanceNarrative(
  year: number,
  civEvents: Array<{ civLabel: string; events: HistoricalEvent[] }>,
): string | null {
  const activeCivs = civEvents.filter(c => c.events.length > 0)
  if (activeCivs.length < 2) return null

  const descriptions = activeCivs.map(c => {
    const top = c.events[0]
    const cat = CATEGORY_CONFIG[top.category].label
    return `${c.civLabel}在"${cat}"领域经历了「${top.title}」`
  })

  if (descriptions.length === 2) {
    return `${formatYear(year)}，${descriptions[0]}，而${descriptions[1]}。同一时刻，不同文明圈的脉搏在不同频率上跳动。`
  }

  const lastDesc = descriptions.pop()!
  return `${formatYear(year)}，${descriptions.join('，')}，而${lastDesc}。同一时刻、${activeCivs.length}个文明圈的变化交织在一起，构成了那个年代的全景。`
}
