import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'

/* ================================================================
   事件详情叙事引擎 v2
   ────────────────────────────────────────────────────────────────
   目标：即使事件没有手写 details，也能生成**针对该事件独有的**叙事段落，
   而不是所有同类目事件共享同一段模板。

   策略：
   1. 有 details → 原文 + 时空定位 + 深层视角
   2. 无 details → 动态拼装 5 段内容：
      a. 时空锚点（年份 + 地区 + 时代 + description）
      b. 基于事件标题/类目/地区的动态解读（非固定模板）
      c. 跨时空对照（同时期其他地区在干什么？）
      d. 人物聚焦或结构性力量分析
      e. 历史回响（这件事对后世意味着什么）
   ================================================================ */

/* ---------- 类目 × 时代 叙事矩阵 ---------- */
const CATEGORY_ERA_NARRATIVES: Record<string, Record<string, string>> = {
  history: {
    '远古文明': '在文字出现之前，人类社会的组织方式就已经在发生深刻变化。这一事件揭示了早期人类如何从部落走向更复杂的社会结构。',
    '古典时代': '古典时代的政治实验为后世提供了丰富的范本——城邦、帝国、法律、外交，许多今天仍在使用的治理概念都萌芽于这个时期。',
    '轴心时代': '轴心时代是人类精神觉醒的高峰。在这个时期，东西方几乎同时诞生了一批深刻影响后世的思想家和制度创新者。',
    '帝国时代': '帝国的扩张带来了前所未有的跨区域联系，也制造了深刻的文化碰撞。这一事件正是帝国逻辑与地方现实互动的产物。',
    '中世纪': '中世纪远非"黑暗时代"——在宗教、贸易和技术的交织中，新的社会秩序正在孕育。这一事件就是那个时代生命力的证明。',
    '文艺复兴前夜': '在文艺复兴的曙光到来之前，旧秩序已经开始松动。这一事件处于变革的前沿，为即将到来的巨变埋下了伏笔。',
    '文艺复兴': '文艺复兴不仅是艺术的繁荣，更是人对自身能力的重新发现。这一事件体现了那个时代最核心的精神：人可以重塑世界。',
    '科学革命': '当实验和理性取代了权威和教条，人类认识世界的方式发生了根本性转变。这一事件是那场认知革命的一个关键节点。',
    '工业时代': '蒸汽、钢铁和铁路重塑了空间和时间的意义。工业时代的每一个事件都在加速一个新世界的诞生。',
    '现代': '在全球化、信息化和科技爆炸的现代，每一个重大事件都以前所未有的速度传播和产生连锁反应。',
  },
  warfare: {
    '远古文明': '在文明的最早阶段，武力冲突就已经是资源争夺和领土扩张的核心手段。早期战争的规模虽小，却奠定了后世军事组织的雏形。',
    '古典时代': '古典时代的战争不仅是军事较量，更是制度和文明模式的对决。胜者的制度往往被败者吸收，推动文明的融合。',
    '帝国时代': '帝国的疆域靠征战获得，也靠征战维持。这一时期的军事冲突直接决定了哪些文明能存续、哪些将被吞没。',
    '中世纪': '骑士、城堡和十字军——中世纪的战争既是信仰的表达，也是权力的角逐。它重新画定了欧亚大陆的文明版图。',
    '现代': '两次世界大战和冷战重新定义了"战争"的含义——从堑壕到核武器，从热战到代理战争，现代军事冲突的阴影笼罩着整个人类。',
  },
  science: {
    '古典时代': '古典时代的科学探索往往与哲学密不可分。观察、推理和数学开始成为理解自然的工具，尽管它们还远未系统化。',
    '科学革命': '17-18世纪的科学革命是人类认知史上最剧烈的断裂。实验方法、数学语言和同行评议的确立，让科学从此走上了加速发展的轨道。',
    '现代': '现代科学的发现速度令人目眩——从量子力学到基因编辑，每一个突破都在重新定义"可能"的边界。',
  },
  technology: {
    '远古文明': '最早的技术发明——石器、陶器、农业——看似简单，却是人类脱离纯粹动物状态的关键一步。',
    '工业时代': '工业革命是技术力量的集中爆发。机器取代手工，不仅改变了生产方式，也重塑了社会结构、城市面貌和人际关系。',
    '现代': '信息技术的发展速度已经超越了大多数人的想象力。每一个技术里程碑都在缩短下一个突破到来的间隔。',
  },
  literature: {
    '远古文明': '在文字刚刚诞生的时代，书写本身就是一种权力。最早的文学——神话、赞美诗和王名表——同时承担着记忆、祭祀和统治三重功能。它们告诉我们：人类从一开始就需要用故事来解释世界。',
    '古典时代': '古典时代的文学作品不仅是艺术创作，更是一个文明自我理解的方式。荷马史诗定义了英雄主义，《诗经》定义了抒情传统，《罗摩衍那》定义了信仰叙事——每一部经典都是一个文明的精神肖像。',
    '轴心时代': '轴心时代的文学开始反思人的内在世界——屈原的忧愤、萨福的爱情、索福克勒斯的命运拷问。文学从祭祀走向个体，从神话走向人的真实处境。',
    '帝国时代': '帝国的扩张为文学带来了翻译和跨文化传播。维吉尔向荷马致敬，佛经从梵文译成中文——文学成为连接不同文明的精神桥梁。',
    '中世纪': '中世纪的文学在宗教和世俗之间寻找平衡。《一千零一夜》、游吟诗人的歌谣和日本的物语文学，都证明了即使在信仰笼罩一切的时代，人的故事依然有不可替代的力量。',
    '文艺复兴前夜': '在文艺复兴前夜，但丁用意大利方言而非拉丁语写作《神曲》，这一选择本身就是一场文化革命——它宣告了民族语言文学的诞生。',
    '文艺复兴': '文艺复兴时期的文学重新发现了个人——莎士比亚笔下的哈姆雷特、塞万提斯笔下的堂吉诃德、紫式部笔下的光源氏，个人的情感、矛盾和尊严成为书写的核心主题。',
    '科学革命': '当科学改变了人对自然的理解，文学也随之转变。伏尔泰用小说传播启蒙思想，斯威夫特用讽刺解剖社会——文学成为理性时代最锋利的思想工具。',
    '工业时代': '工业化带来了现代城市、阶级冲突和个体异化——狄更斯、雨果、陀思妥耶夫斯基和鲁迅用文字记录了这些巨变中最深刻的人性真相。',
    '现代': '现代文学在形式和内容上都在不断突破边界——意识流、魔幻现实主义、后殖民写作、非虚构创作。它追问的问题越来越尖锐：在一个加速变化的世界里，人的意义是什么？',
  },
  music: {
    '远古文明': '音乐可能比文字更古老——远古人类用骨笛、鼓和声带创造出最早的旋律。音乐最初与祭祀、劳动和巫术融为一体，是人类表达敬畏和共鸣的最原始方式。',
    '古典时代': '古希腊人把音乐视为宇宙秩序的映射——毕达哥拉斯发现了音程与数学比例的关系。中国的编钟和印度的吠陀吟诵同样证明：音乐理论在古典时代就已经是一门精密的学问。',
    '轴心时代': '轴心时代的音乐与礼仪、哲学深度绑定。孔子说\"兴于诗，立于礼，成于乐\"——在东方，音乐是教化工具；在西方，音乐是通向理性的桥梁。',
    '帝国时代': '帝国的扩张带来了音乐的跨文化交流。丝绸之路上，琵琶从波斯传入中国，竖琴从美索不达米亚传入埃及——帝国的音乐是融合的产物。',
    '中世纪': '格里高利圣咏和五线谱的发明是中世纪音乐最重要的遗产。教堂不仅是祈祷的场所，更是音乐实验室——复调音乐、和声学和记谱法都在这里萌芽。',
    '文艺复兴前夜': '在文艺复兴前夜，游吟诗人用方言歌唱爱情，世俗音乐开始与宗教音乐分庭抗礼。音乐正在从教堂走向宫廷和街头。',
    '文艺复兴': '文艺复兴带来了歌剧的诞生和器乐的独立。巴赫把复调推向极致，维瓦尔第让协奏曲成为独立体裁——音乐从神的赞美转向人的表达。',
    '科学革命': '在科学革命的背景下，音乐的\"古典\"时代到来了。海顿、莫扎特发展出交响曲和奏鸣曲的完美形式——结构精密、比例均衡，如同音乐版的牛顿力学。',
    '工业时代': '贝多芬打破了古典的平衡，浪漫主义音乐释放出前所未有的情感力量。肖邦、瓦格纳、柴可夫斯基——工业时代的音乐是个人激情的最高表达。留声机的发明让音乐第一次超越了现场。',
    '现代': '从爵士到摇滚，从电子到嘻哈——20世纪的音乐革命比任何时代都更快、更激烈。技术改变了音乐的创作、传播和消费方式，但音乐表达情感和连接人群的本质从未改变。',
  },
}

/* ---------- 地区维度的独特视角 ---------- */
const REGION_PERSPECTIVES: Record<string, string> = {
  china: '中国文明的连续性在世界历史中极为罕见——从这一事件中，我们能看到一条横跨数千年的文化脉络如何在特定时刻显现其韧性或脆弱性。',
  japan: '日本文明的独特之处在于它对外来影响的高度选择性吸收。这一事件体现了日本如何在保持自身文化核心的同时，与更广阔的世界互动。',
  india: '印度次大陆是世界上文化多样性最丰富的地区之一。这一事件发生在这片土地上多元文明交织的背景下，其影响往往以意想不到的方式扩散。',
  greece: '古希腊对民主、哲学和科学的贡献是人类文明的基石。这一事件延续或重新诠释了那个传统。',
  italy: '从罗马帝国到文艺复兴，意大利半岛一直是西方文明最重要的实验场之一。这一事件正是那种持续创新精神的体现。',
  uk: '作为工业革命的发源地和曾经最大殖民帝国的中心，英国的每一个重大事件都会在全球范围内产生回响。',
  usa: '美国的历史虽然不长，但其作为"实验性国家"的特质使得它的每一个关键事件都具有全球示范效应。',
  france: '法国文化中对自由、平等、博爱的执着追求，使得这个国家的重大事件往往带有强烈的普世主义色彩。',
  germany: '德国的历史是一部在分裂与统一、理性与狂热之间剧烈摆荡的戏剧。这一事件映射着那种张力。',
  egypt: '尼罗河畔的文明是人类最古老的文明之一。即使在法老时代过去数千年后，埃及仍然是连接非洲、中东和地中海世界的关键枢纽。',
  russia: '横跨欧亚的俄罗斯，其历史事件往往同时带有东方和西方的双重印记。这种地缘特质使得它的每一个转折点都格外复杂。',
  global: '这是一个真正全球性的事件——它的影响不局限于某一个国家或地区，而是深刻改变了人类文明的整体走向。',
}

/* ---------- "你知道吗"知识点生成 ---------- */
export interface DidYouKnow {
  emoji: string
  text: string
}

export function generateDidYouKnow(event: HistoricalEvent): DidYouKnow[] {
  const facts: DidYouKnow[] = []
  const currentYear = new Date().getFullYear()
  const yearsAgo = event.year < 0
    ? currentYear + Math.abs(event.year)
    : currentYear - event.year

  // 时间距离感
  if (yearsAgo > 100) {
    facts.push({
      emoji: '⏰',
      text: `这件事发生在距今约 ${yearsAgo.toLocaleString()} 年前。如果把人类文明 6000 年压缩成一天 24 小时，它大约发生在${getTimeOfDay(event.year)}。`,
    })
  }

  // 持续时间
  if (event.endYear) {
    const duration = event.endYear - event.year
    if (duration > 50) {
      facts.push({
        emoji: '📏',
        text: `这个过程持续了约 ${duration} 年——比大多数现代国家的历史都要长。`,
      })
    } else if (duration > 0) {
      facts.push({
        emoji: '📏',
        text: `从开始到结束，这件事历经了 ${duration} 年。`,
      })
    }
  }

  // 里程碑强调
  if (event.significance === 3) {
    facts.push({
      emoji: '🌟',
      text: '这是一个里程碑级事件——在 Chrono Atlas 的评估体系中，只有极少数事件获得这个标记，意味着它对文明走向产生了不可逆转的影响。',
    })
  }

  // 同时代对照提示
  const era = getEra(event.year)
  if (era) {
    const eraSpan = era.endYear - era.startYear
    const positionInEra = ((event.year - era.startYear) / eraSpan * 100).toFixed(0)
    facts.push({
      emoji: '🗺️',
      text: `在"${era.name}"这个时代中，这件事发生在大约 ${positionInEra}% 的位置——${Number(positionInEra) < 30 ? '正处于时代的开端，旧秩序还未完全瓦解' : Number(positionInEra) > 70 ? '时代已近尾声，变革的信号越来越强' : '时代正值中段，各种力量在激烈角力'}。`,
    })
  }

  // 文学事件专属知识点
  if (event.category === 'literature') {
    const title = event.title
    if (title.includes('诗') || title.includes('史诗') || title.includes('抒情')) {
      facts.push({ emoji: '🖊️', text: '诗歌是人类最早的文学形式——在文字出现之前，人类就已经在用韵律和节奏来记忆故事和传递知识。' })
    } else if (title.includes('小说') || title.includes('物语') || title.includes('《')) {
      facts.push({ emoji: '📖', text: '长篇小说是一种相对年轻的文学形式——它要求读者投入大量的时间和注意力，也因此能创造出最深沉的共情体验。' })
    } else if (title.includes('文字') || title.includes('字母') || title.includes('甲骨')) {
      facts.push({ emoji: '✍️', text: '文字的发明是人类文明最关键的技术之一——有了文字，知识就不再随口述者的死亡而消失，文明可以跨代累积。' })
    }
  }

  // 音乐事件专属知识点
  if (event.category === 'music') {
    const title = event.title
    if (title.includes('交响') || title.includes('协奏') || title.includes('古典')) {
      facts.push({ emoji: '🎻', text: '一部完整的交响曲通常需要 60-80 位乐手同时演奏——它是人类在没有电子技术辅助的情况下创造的最复杂的声音艺术。' })
    } else if (title.includes('爵士') || title.includes('蓝调') || title.includes('即兴')) {
      facts.push({ emoji: '🎷', text: '爵士乐的核心是"即兴"——演奏者在固定的和声框架上自由创造旋律。每一次演奏都是唯一的，永远无法完全复制。' })
    } else if (title.includes('摇滚') || title.includes('披头士') || title.includes('猫王')) {
      facts.push({ emoji: '🎸', text: '摇滚乐在诞生之初被许多成年人视为"堕落的噪音"——这恰恰证明了它作为文化革命力量的巨大冲击力。' })
    } else if (title.includes('嘻哈') || title.includes('说唱') || title.includes('DJ')) {
      facts.push({ emoji: '🎤', text: '嘻哈文化起源于 1970 年代纽约最贫困的布朗克斯街区——它证明了伟大的艺术不需要昂贵的乐器，只需要一台唱机和一个麦克风。' })
    } else if (title.includes('歌剧') || title.includes('音乐剧')) {
      facts.push({ emoji: '🎭', text: '歌剧被称为"所有艺术的总和"——它同时结合了歌唱、管弦乐、戏剧表演、舞台设计和舞蹈，是人类最奢华的表演艺术形式。' })
    }
  }

  // 人物相关
  if (event.figure) {
    const names = event.figure.split(/[、,，/]/).map(n => n.trim()).filter(Boolean)
    if (names.length >= 2) {
      facts.push({
        emoji: '👥',
        text: `这一事件涉及 ${names.length} 位关键人物：${names.join('、')}。历史的走向往往由多个个体的交汇决定。`,
      })
    }
  }

  return facts.slice(0, 3)
}

function getTimeOfDay(year: number): string {
  // 把 -4000 到 2030 映射到 0-24 小时
  const pct = (year + 4000) / 6030
  const hour = Math.floor(pct * 24)
  if (hour < 6) return '凌晨（文明的最初萌芽期）'
  if (hour < 9) return '清晨（古典文明绽放的时刻）'
  if (hour < 12) return '上午（帝国与信仰扩张的高峰）'
  if (hour < 15) return '下午（文艺复兴与科学革命的酝酿期）'
  if (hour < 18) return '傍晚（工业化与全球化的加速期）'
  if (hour < 21) return '夜晚的前半段（两次世界大战与冷战的阴影）'
  return '深夜（信息时代的高速运转期）'
}

/* ---------- 跨时空对照生成 ---------- */
function buildCrossTimeContext(event: HistoricalEvent): string {
  const era = getEra(event.year)
  if (!era) return ''

  const region = REGION_CONFIG[event.region]

  // 基于时代生成"同一时期，世界其他地方在发生什么"的提示
  const ERA_CROSS_REFS: Record<string, string> = {
    '远古文明': '同一时期，美索不达米亚在发明楔形文字，埃及在修建金字塔，印度河流域在建设摩亨佐-达罗城。',
    '古典时代': '同一时期，希腊在实验民主制，中国处于百家争鸣，波斯帝国横跨三大洲。',
    '轴心时代': '同一时期，孔子在鲁国授徒，苏格拉底在雅典对话，释迦牟尼在恒河流域说法——人类精神在东西方同时觉醒。',
    '帝国时代': '同一时期，罗马帝国统治地中海，汉帝国雄踞东亚，贵霜帝国连接中亚——丝绸之路将它们串联成一条文明走廊。',
    '中世纪': '同一时期，拜占庭在延续罗马遗产，伊斯兰世界正经历黄金时代，中国的唐宋文明达到巅峰。',
    '文艺复兴前夜': '同一时期，蒙古帝国正在重塑欧亚版图，意大利城邦在酝酿商业革命，中国的宋元文化在技术和艺术上领先世界。',
    '文艺复兴': '同一时期，欧洲在重新发现古典遗产，奥斯曼帝国雄踞东西之间，明帝国在东亚维持着庞大的朝贡体系。',
    '科学革命': '同一时期，伽利略在挑战教会权威，牛顿在剑桥发现万有引力，康熙帝在紫禁城接见耶稣会士。',
    '工业时代': '同一时期，欧洲的工厂烟囱在改变天际线，美国在向西部扩张，清帝国在内忧外患中艰难维持。',
    '现代': '在这个全球化的时代，任何一个地方发生的重大事件，都会以前所未有的速度传遍全世界。',
  }

  const crossRef = ERA_CROSS_REFS[era.name]
  if (!crossRef) return ''

  return `当「${event.title}」在${region.label}发生时，世界并非只有这一个故事。${crossRef}把这件事放在全球同步的视野中，你会发现文明的演进从来不是孤立的。`
}

/* ---------- 主函数 ---------- */
export function buildEventDetailParagraphs(event: HistoricalEvent): string[] {
  const category = CATEGORY_CONFIG[event.category]
  const region = REGION_CONFIG[event.region]
  const era = getEra(event.year)
  const durationText = event.endYear
    ? `，并延续至 ${formatYear(event.endYear)}，持续约 ${event.endYear - event.year} 年`
    : ''

  // ── 有手写 details 的事件 ──
  if (event.details?.trim()) {
    const paragraphs = [
      event.details.trim(),
      `${event.title} 发生在 ${formatYear(event.year)} 的 ${region.label}${durationText}。${era ? `在"${era.name}"这一时代背景下，` : ''}${getCategoryEraNarrative(event.category, era?.name) || `这是一条"${category.label}"维度的重要事件。`}`,
    ]

    const cross = buildCrossTimeContext(event)
    if (cross) paragraphs.push(cross)

    paragraphs.push(buildFigureNarrative(event))
    paragraphs.push(buildHistoricalEcho(event))

    return paragraphs
  }

  // ── 无 details 的事件 ── 生成独特叙事
  const contextLine = era
    ? `${formatYear(event.year)} 年的 ${region.label}，正处于"${era.name}"时期。`
    : `${formatYear(event.year)} 年的 ${region.label}。`

  const paragraphs = [
    `${contextLine}${event.description}`,
    getCategoryEraNarrative(event.category, era?.name) || `这是一条"${category.label}"维度的重要事件，说明当时的人类社会正在这一领域发生关键变化。`,
  ]

  // 地区独特视角
  const regionPerspective = REGION_PERSPECTIVES[event.region]
  if (regionPerspective) {
    paragraphs.push(regionPerspective)
  }

  // 跨时空对照
  const cross = buildCrossTimeContext(event)
  if (cross) paragraphs.push(cross)

  paragraphs.push(buildFigureNarrative(event))
  paragraphs.push(buildHistoricalEcho(event))

  return paragraphs
}

export function buildEventDetailPreview(event: HistoricalEvent): string[] {
  const paragraphs = buildEventDetailParagraphs(event)
  return paragraphs.slice(0, 2)
}

/* ---------- 内部辅助 ---------- */

function getCategoryEraNarrative(category: string, eraName?: string): string {
  if (!eraName) return CATEGORY_ERA_NARRATIVES[category]?.['现代'] || ''
  return CATEGORY_ERA_NARRATIVES[category]?.[eraName] || ''
}

function buildFigureNarrative(event: HistoricalEvent): string {
  if (!event.figure) {
    return '这一事件的推动力来自制度演化、社会结构变迁或技术进步的内在逻辑，而非某个单一人物的意志——理解它需要将目光投向更宏观的历史脉络。'
  }
  const names = event.figure.split(/[、,，/]/).map(n => n.trim()).filter(Boolean)
  if (names.length === 1) {
    return `${names[0]} 是这一事件的关键人物。个人的远见、决断或才华在此刻与时代的洪流交汇，产生了超越个体生命的深远影响。理解 ${names[0]} 的抱负与局限，是把握这段历史的重要线索。`
  }
  return `${names.join('、')}等人在这一事件中扮演了关键角色。历史往往不是一个人的独角戏，而是多个个体的意志、才华与时代机遇的交汇。`
}

function buildHistoricalEcho(event: HistoricalEvent): string {
  const SIGNIFICANCE_ECHOES: Record<HistoricalEvent['significance'], string[]> = {
    1: [
      '它是文明拼图中不可或缺的一块碎片——放在更长的时间线上，它帮助我们理解这一地区或领域是如何一步步走到今天的。',
      '也许它在当时并未引起太多关注，但回头来看，正是这样的"小事件"构成了历史的基本肌理。',
    ],
    2: [
      '它是历史进程中一个清晰的转折点，标志着某种旧秩序的松动或新可能的开启。',
      '如果把历史比作一条大河，这一事件就是河道上的一个弯——它改变了水流的方向，虽然不像瀑布那样壮观，但影响同样深远。',
    ],
    3: [
      '这是一个里程碑级的历史节点——它的影响如同投入湖面的巨石，激起的涟漪在此后几十年甚至数百年间持续扩散。',
      '在历史的坐标轴上，这是一个无法绕过的锚点。此后的叙事，无论主动还是被动，都不得不以它为参照。',
    ],
  }
  const options = SIGNIFICANCE_ECHOES[event.significance] || SIGNIFICANCE_ECHOES[1]
  // 根据事件 ID 的 hash 做确定性选择，避免每次刷新变化
  const idx = hashCode(event.id) % options.length
  return options[idx]
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/* ================================================================
   因果链叙事过渡
   ────────────────────────────────────────────────────────────────
   为事件详情页的"因果关联"区块生成过渡文案：
   - 给每一个关联事件一句"它和当前事件之间的因果联系是什么"的说明
   ================================================================ */

export function buildCausalNarrative(
  currentEvent: HistoricalEvent,
  relatedEvent: HistoricalEvent,
): string {
  const yearDiff = relatedEvent.year - currentEvent.year
  const isEarlier = yearDiff < 0
  const absDiff = Math.abs(yearDiff)

  const currentCat = CATEGORY_CONFIG[currentEvent.category].label
  const relatedCat = CATEGORY_CONFIG[relatedEvent.category].label

  // 同年事件
  if (absDiff === 0) {
    return `「${relatedEvent.title}」与当前事件发生在同一年——两者可能共享同一个时代背景，或者互为因果的两面。`
  }

  // 前因
  if (isEarlier) {
    if (absDiff <= 30) {
      return `「${relatedEvent.title}」发生在 ${absDiff} 年前，是直接的近因——它创造的条件或打开的缺口，让当前事件得以发生。`
    }
    if (absDiff <= 200) {
      return `「${relatedEvent.title}」早了约 ${absDiff} 年，是更深层的远因。从${relatedCat}到${currentCat}的传导，往往需要数代人的时间。`
    }
    return `「${relatedEvent.title}」发生在 ${absDiff} 年前的远古。它播下的种子经过漫长岁月的酝酿，最终在当前事件中结出了果实。`
  }

  // 后果
  if (absDiff <= 30) {
    return `「${relatedEvent.title}」在 ${absDiff} 年后发生，是当前事件的直接后果——历史的因果链在短时间内就显现了出来。`
  }
  if (absDiff <= 200) {
    return `「${relatedEvent.title}」在约 ${absDiff} 年后出现。当前事件的影响并非立即显现，而是像慢性发酵一样，在数代人之后才充分展开。`
  }
  return `「${relatedEvent.title}」出现在 ${absDiff} 年后的遥远未来。当前事件的回响穿越了几个世纪，证明了真正重大的历史事件具有惊人的持久力。`
}

/* ================================================================
   外部延伸阅读链接
   ────────────────────────────────────────────────────────────────
   基于事件标题生成中文维基百科和英文 Wikipedia 的搜索链接。
   不保证页面一定存在，但提供了最可能命中的入口。
   ================================================================ */

export interface ExternalLink {
  label: string
  url: string
  icon: 'wikipedia' | 'search'
}

export function generateExternalLinks(event: HistoricalEvent): ExternalLink[] {
  const links: ExternalLink[] = []
  const title = event.title

  // 中文维基百科
  links.push({
    label: '中文维基百科',
    url: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title)}&go=Go`,
    icon: 'wikipedia',
  })

  // 英文 Wikipedia（用标题的关键词搜索）
  links.push({
    label: 'English Wikipedia',
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title)}&go=Go`,
    icon: 'wikipedia',
  })

  // 如果有人物，补一个人物搜索
  if (event.figure) {
    const figureName = event.figure.split(/[、,，/]/)[0].trim()
    links.push({
      label: `${figureName} — 维基百科`,
      url: `https://zh.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(figureName)}&go=Go`,
      icon: 'search',
    })
  }

  return links
}
