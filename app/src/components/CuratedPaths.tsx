import { useState, useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Flame, Map as MapIcon, Swords, Lightbulb, Dna, X, ChevronRight, BookOpen, Music, Feather, Theater, ScrollText, Landmark, GraduationCap } from 'lucide-react'
import { RegionFlag } from './RegionFlag'
import { EXAM_TOPICS } from '@/data/exam-syllabus'

interface CuratedPath {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  /** 事件 ID 列表（有序） */
  eventIds: string[]
  /** 关键词匹配（如果没有精确 ID 匹配，用关键词模糊匹配） */
  keywords: string[]
  narrativeSummary: string
  /** 逐步导读提示词（按顺序对应匹配到的事件） */
  stepGuides: StepGuide[]
  /** 开篇综述：路线开始前的导入叙事 */
  prologue?: string
  /** 结尾总结：路线结束后的反思叙事 */
  epilogue?: string
}

interface StepGuide {
  /** 匹配关键词（命中事件标题/描述则使用该导读） */
  match: string[]
  /** 导读文案 */
  narrative: string
}

/** 为策展路线中的第 idx 个事件生成过渡导读 */
function getStepNarrative(path: CuratedPath, event: HistoricalEvent, idx: number, total: number): string | null {
  // 1. 尝试精确匹配 stepGuides
  const text = `${event.title} ${event.description}`
  for (const guide of path.stepGuides) {
    if (guide.match.some(kw => text.includes(kw))) {
      return guide.narrative
    }
  }

  // 2. 自动生成位置感知的过渡句
  if (idx === 0) return `故事从这里开始。在「${path.name}」的叙事中，这是最早的起点——一切后来的发展，都可以追溯到此刻。`
  if (idx === total - 1) return `故事在这里暂时落幕。但历史从不真正结束——「${path.name}」的叙事还在继续，只是接力棒已经传到了我们这一代。`
  if (idx < total * 0.3) return '在叙事的早期阶段，变化往往是缓慢而不可见的。但正是这些不起眼的积累，为后来的剧变埋下了种子。'
  if (idx > total * 0.7) return '到了叙事的后半段，变化的速度和规模都在加速。每一个新事件，都建立在此前所有事件的累积之上。'
  return null
}

const CURATED_PATHS: CuratedPath[] = [
  {
    id: 'fire',
    name: '火的传承',
    description: '从普罗米修斯到核能 — 人类如何驾驭能量',
    icon: <Flame size={18} />,
    color: '#E27D60',
    eventIds: [],
    keywords: ['火', '蒸汽', '电力', '核', '能源', '煤', '石油', '发电', '火药', '燃烧'],
    narrativeSummary: '从远古的钻木取火，到工业革命的蒸汽机咆哮，再到核裂变释放的惊人力量——人类对能量的驾驭，是文明加速的根本动力。每一次能源革命，都重新定义了"可能"的边界。',
    prologue: '在你开始这段旅程之前，试着想象一个没有火的世界：黑暗的洞穴、生冷的食物、只能在白天活动的生活。火的掌握不只是一项技术——它是人类脱离动物状态的第一步。接下来你将看到，从那一刻起，人类对能量的渴望如何驱动了整部文明史。',
    epilogue: '回望这条从篝火到核能的旅程，你会发现一个令人敬畏的规律：每一次能源革命都让人类的能力呈指数级增长，但也带来了与之匹配的风险——火带来了烧毁，蒸汽带来了污染，核能带来了毁灭的可能。下一次能源革命在哪里？它的风险又是什么？',
    stepGuides: [
      { match: ['火', '钻木', '控制火'], narrative: '掌握火，是人类从自然界独立出来的第一步。它带来温暖、熟食和保护，也点燃了技术进步的第一缕火花。' },
      { match: ['火药'], narrative: '火药的发明改变了权力的等式——城墙不再不可摧，骑士不再不可挡。能量第一次被用于瞬间释放巨大破坏力。' },
      { match: ['蒸汽', '瓦特'], narrative: '蒸汽机把热能转化为机械动力，这是人类第一次摆脱对肌肉和自然力的依赖。工业革命由此点燃。' },
      { match: ['电', '发电', '法拉第', '爱迪生'], narrative: '电的驯服是人类最优雅的能量革命——看不见的力量开始照亮城市、驱动机器、传递信息。' },
      { match: ['石油', '内燃'], narrative: '石油为 20 世纪注入了前所未有的动力，也埋下了地缘冲突和气候危机的伏笔。' },
      { match: ['核'], narrative: '核能是人类迄今为止释放的最强大力量——它既能毁灭城市，也能照亮千万家庭。人类第一次站在了"自我终结"的能力面前。' },
      { match: ['可再生', '太阳能', '风电'], narrative: '从化石能源转向可再生能源，是 21 世纪最重要的文明转型之一。这一步是否走得够快，将决定未来的样貌。' },
    ],
  },
  {
    id: 'eastwest',
    name: '东西方相遇',
    description: '丝绸之路到全球化 — 文明如何互相发现',
    icon: <MapIcon size={18} />,
    color: '#2980B9',
    eventIds: [],
    keywords: ['丝绸之路', '大航海', '郑和', '哥伦布', '马可波罗', '贸易', '全球化', '通商', '开港', '交流'],
    narrativeSummary: '当张骞的马蹄踏上西域的沙漠，当哥伦布的船帆捕获大西洋的风——东方与西方在漫长的历史中反复相遇。每一次相遇，都不只是货物的交换，更是思想、技术和信仰的碰撞与融合。',
    prologue: '在这条路线开始之前，想象一下：公元前 2000 年的世界，一个中国农民和一个希腊牧羊人对彼此的存在一无所知。他们之间隔着万里山川和数千年的等待。接下来你将看到，人类是如何一步步缩短这段距离的——从骆驼商队到帆船舰队，从丝绸之路到海底光缆。',
    epilogue: '回望这条从驼铃到光纤的道路，你会发现一个悖论：东西方越是频繁地相遇，就越是发现彼此的不同。但也正是这种"不同"，构成了人类文明最丰富的养料。下一次东西方的"相遇"正在数字空间中发生——它将产生什么样的碰撞？',
    stepGuides: [
      { match: ['张骞', '丝绸之路'], narrative: '张骞的出使打通了东西方之间的物理通道。丝绸、香料和思想，沿着这条道路双向流动了一千多年。' },
      { match: ['马可波罗'], narrative: '马可波罗的游记让欧洲人第一次"看见"了东方的富庶——尽管其中不乏夸张，但它点燃的好奇心为后来的大航海时代做了精神铺垫。' },
      { match: ['郑和'], narrative: '郑和的船队规模远超同期任何欧洲舰队，但它的目的不是征服，而是"宣示"。这是一种完全不同的与世界互动的方式。' },
      { match: ['哥伦布'], narrative: '哥伦布的到来从根本上改变了新旧大陆的命运。"发现"这个词本身就暗含了一种不对等——对美洲原住民而言，这是一场灾难的开始。' },
      { match: ['全球化', '互联网', '万维网'], narrative: '互联网让全球化进入了新的阶段——信息的流动几乎不再受距离限制。东西方的"相遇"不再需要穿越大洋，只需要一个链接。' },
    ],
  },
  {
    id: 'empires',
    name: '帝国的兴衰',
    description: '从亚述到大英帝国 — 权力如何塑造世界',
    icon: <Swords size={18} />,
    color: '#C0392B',
    eventIds: [],
    keywords: ['帝国', '王朝', '统一', '灭亡', '征服', '殖民', '霸权', '独立', '革命', '战争'],
    narrativeSummary: '帝国是文明力量的巅峰表达，也是其最危险的形态。从亚述铁骑到蒙古铁蹄，从罗马的万里道路到大英帝国的全球航线——每一个帝国都在追问同一个问题：权力的极限在哪里？答案总是：在其衰落之时才揭晓。',
    prologue: '权力是一种会生长的东西——它从部落酋长的权杖开始，长成城邦的城墙，再长成帝国的疆界线。在你即将看到的这些帝国故事中，有一个反复出现的模式：征服、繁荣、傲慢、衰落。没有一个帝国能逃过这个循环，但每一个帝国都留下了深刻改变后世的遗产。',
    epilogue: '帝国已成为过去时的政治形态——至少在名义上如此。但帝国的逻辑——中心对边缘的控制、强者对弱者的支配——是否真的消失了？看完这条路线后，你也许会重新思考"帝国"这个词在21世纪的含义。',
    stepGuides: [
      { match: ['亚述'], narrative: '亚述帝国是历史上第一个真正意义上的军事帝国。它证明了有组织的暴力可以建立辽阔的统治——但也预示了同样的暴力终将成为其毁灭的原因。' },
      { match: ['罗马'], narrative: '罗马的伟大不仅在于它的军事力量，更在于它的制度创新——法律、道路、公共工程和公民权的概念，至今仍是现代文明的基石。' },
      { match: ['蒙古', '成吉思汗'], narrative: '蒙古帝国在短短几十年内建立了人类历史上最大的连续陆地帝国。它带来的破坏和它促成的跨大陆交流一样震撼。' },
      { match: ['殖民', '大英', '瓜分'], narrative: '欧洲殖民帝国的扩张重新画定了全球的政治和经济版图。它的遗产——边界线、语言、制度——至今仍深刻影响着前殖民地国家。' },
      { match: ['独立', '解放'], narrative: '帝国的崩溃往往不是一夜之间发生的，而是无数人争取自由的累积结果。每一场独立运动，都是对"被统治"这个概念本身的否定。' },
    ],
  },
  {
    id: 'ideas',
    name: '思想的光',
    description: '从苏格拉底到启蒙运动 — 思想如何改变一切',
    icon: <Lightbulb size={18} />,
    color: '#DAA520',
    eventIds: [],
    keywords: ['哲学', '思想', '启蒙', '民主', '自由', '儒', '佛', '伊斯兰', '理性', '人权', '宪法'],
    narrativeSummary: '当苏格拉底在雅典市场上提出"我知道我什么都不知道"，当孔子在鲁国说出"己所不欲勿施于人"——人类第一次学会用理性审视自身。从轴心时代的百家争鸣到启蒙运动的理性之光，思想的力量比任何军队都更加持久。',
    prologue: '动物用本能回应世界，人类用思想改造世界。在这条路线中，你将遇到人类历史上最锋利的头脑——他们提出的问题至今无人能完全回答，但正是这些"未解之问"推动文明不断前进。从孔子到康德，从佛陀到萨特，每一位思想家都在为人类的精神版图增添新的领地。',
    epilogue: '走完这条路线你会发现：两千多年来，人类思考的核心问题几乎没有变过——什么是正义？什么是自由？什么是美好生活？变化的只是我们回答这些问题的角度和工具。也许真正的进步不在于找到终极答案，而在于学会提出更好的问题。',
    stepGuides: [
      { match: ['孔子', '儒'], narrative: '孔子的思想塑造了东亚世界两千多年的社会秩序和道德观念。"仁"与"礼"的张力，至今仍是理解中国社会的关键。' },
      { match: ['苏格拉底', '柏拉图'], narrative: '苏格拉底和柏拉图开创了西方哲学的对话传统——不是给出答案，而是不断追问。这种精神是科学和民主的共同源头。' },
      { match: ['佛', '释迦'], narrative: '佛陀的教导提供了一种完全不同的解脱路径——不是改造世界，而是改变看待世界的方式。这种思想跨越了文化和地理边界。' },
      { match: ['启蒙', '理性'], narrative: '启蒙运动是人类精神史上最雄心勃勃的项目之一：用理性取代迷信，用法律取代暴力，用教育取代愚昧。它的承诺至今尚未完全兑现。' },
      { match: ['人权', '宣言'], narrative: '人权概念的确立标志着一种全新的道德共识：每一个人，仅仅因为是人，就拥有不可剥夺的尊严和权利。' },
    ],
  },
  {
    id: 'science',
    name: '科学的跃迁',
    description: '从造纸术到互联网 — 技术如何加速文明',
    icon: <Dna size={18} />,
    color: '#41B3A3',
    eventIds: [],
    keywords: ['发明', '科学', '技术', '计算', '互联网', '印刷', '造纸', '电', '计算机', '卫星', '基因'],
    narrativeSummary: '造纸术让知识不再是少数人的特权，印刷术让思想可以瞬间跨越国界，互联网让整个人类文明成为一个互联的神经网络。每一次技术跃迁，都不只是工具的改进——它重新定义了人类是什么。',
    prologue: '人类和其他动物的根本区别，不是语言，不是直立行走，而是我们制造工具的能力——以及用一代人的工具为下一代人创造更好的工具的能力。这条路线将带你穿越六千年的技术加速史：从石器到芯片，每一次跃迁都让下一次跃迁来得更快。你会注意到一个令人眩晕的趋势：技术变革的间隔正在以指数级缩短。',
    epilogue: '从造纸到互联网，技术进步的速度越来越快，但人类适应技术的速度并没有同步加快。我们用石器时代的大脑操作着核时代的工具——这种错位也许是21世纪最大的风险，也是最大的机遇。下一次技术跃迁已经在发生，它叫人工智能。',
    stepGuides: [
      { match: ['造纸'], narrative: '纸的发明让知识的记录和传播成本急剧下降。在此之前，大部分人类智慧都随着口述者的离世而消散。' },
      { match: ['印刷', '古腾堡', '活字'], narrative: '印刷术的普及是信息民主化的第一步。当书籍从手抄转为批量复制，思想的传播速度从步行提升到了光速的前奏。' },
      { match: ['电报', '电话'], narrative: '电报和电话消灭了信息传递的物理距离。人类第一次可以在瞬间与千里之外的人对话——世界开始"缩小"。' },
      { match: ['计算机', '图灵', 'ENIAC'], narrative: '计算机的发明是 20 世纪最具颠覆性的技术事件。它不是简单地加速了计算，而是创造了一种全新的"思考"方式。' },
      { match: ['互联网', '万维网'], narrative: '互联网把全人类连入了同一个信息网络。它的影响还在展开中——我们可能还处于这场革命的早期阶段。' },
      { match: ['基因', 'DNA', 'CRISPR'], narrative: '基因编辑技术让人类第一次有能力直接改写生命的"源代码"。这是一个充满希望也充满危险的新疆域。' },
      { match: ['AI', '人工智能', 'ChatGPT', 'AlphaGo'], narrative: '人工智能正在重新定义"智能"的含义。当机器开始在越来越多领域超越人类，我们不得不重新思考：是什么让人类独特？' },
    ],
  },
  {
    id: 'literature',
    name: '文字的力量',
    description: '从楔形文字到魔幻现实主义 — 文学如何塑造人类灵魂',
    icon: <BookOpen size={18} />,
    color: '#E8A87C',
    eventIds: [],
    keywords: ['文字', '文学', '诗', '小说', '戏剧', '史诗', '叙事', '写作', '散文', '字母', '印刷', '作家', '诗人'],
    narrativeSummary: '从苏美尔泥板上的《吉尔伽美什史诗》到加西亚·马尔克斯的马孔多小镇——文学是人类为自己编织的最持久的意义之网。每一部伟大的文学作品都在追问同一个问题：活着意味着什么？',
    prologue: '在你开始这条路线之前，请记住一件事：你正在阅读的每一个文字，都是一根跨越时间的线。五千年前，一个苏美尔书吏用芦苇笔在湿泥板上压下第一个楔形符号——从那一刻起，人类的思想就不再随风消散。文学不仅是娱乐，它是人类对抗遗忘的最古老的武器。',
    epilogue: '从泥板到电子书，载体变了无数次，但文学的本质从未改变：一个人用文字记录下自己对世界的理解，另一个人在几十年、几百年甚至几千年后读到它，然后说——"是的，我也是这样感觉的。"这种穿越时空的共鸣，是文学存在的唯一理由，也是最充分的理由。',
    stepGuides: [
      { match: ['楔形', '苏美尔', '甲骨文', '象形'], narrative: '文字是文明的基础设施。没有文字，就没有法律、没有历史、没有文学。最早的书写系统同时是技术发明和精神革命。' },
      { match: ['吉尔伽美什'], narrative: '这是人类最古老的文学作品——一个国王追寻永生却最终接受死亡的故事。四千多年过去了，它探讨的主题依然是文学的核心命题。' },
      { match: ['荷马', '伊利亚特', '奥德赛'], narrative: '荷马为西方文学确立了两个永恒的母题：战争中的英雄主义（伊利亚特）和漫长的归乡之路（奥德赛）。此后两千五百年的西方文学，都是这两个母题的变奏。' },
      { match: ['但丁', '神曲'], narrative: '但丁用方言而非拉丁语写作，这个选择本身就是一场文学革命。《神曲》证明了民族语言也能承载最崇高的精神表达。' },
      { match: ['莎士比亚', '哈姆雷特'], narrative: '莎士比亚在四百年前创造的人物——哈姆雷特的犹豫、麦克白的野心、李尔王的疯狂——至今仍是人性最准确的肖像。' },
      { match: ['堂吉诃德', '塞万提斯'], narrative: '《堂吉诃德》是小说的诞生证明——它第一次证明了一个虚构角色可以像真人一样复杂、矛盾和令人同情。' },
      { match: ['红楼梦', '曹雪芹'], narrative: '《红楼梦》是中国文学的珠穆朗玛峰——一个家族的兴衰中折射出整个文明的美与哀。' },
      { match: ['托尔斯泰', '陀思妥耶夫斯基', '卡夫卡', '乔伊斯'], narrative: '19-20世纪的文学巨匠们各自打开了一扇窗：托尔斯泰看到了历史的全景，陀思妥耶夫斯基看到了灵魂的深渊，卡夫卡看到了现代人的荒诞，乔伊斯看到了意识的河流。' },
      { match: ['鲁迅', '呐喊'], narrative: '鲁迅的写作不是消遣，是手术。他用最冷静的文字切入最痛的伤口，让一个民族不得不直视自己。' },
    ],
  },
  {
    id: 'music',
    name: '旋律的长河',
    description: '从苏美尔竖琴到嘻哈 — 音乐如何成为人类的通用语言',
    icon: <Music size={18} />,
    color: '#C38D9E',
    eventIds: [],
    keywords: ['音乐', '乐器', '交响', '歌剧', '爵士', '摇滚', '嘻哈', '流行', '古典', '作曲', '唱片', '录音', '演奏', '旋律', '节奏'],
    narrativeSummary: '音乐可能是人类最古老的艺术——远古洞穴中的骨笛、苏美尔王陵中的竖琴、巴赫的赋格、贝多芬的交响曲、爵士的即兴、摇滚的嘶吼。从祭祀到街头，从教堂到耳机，音乐始终是人类最直接的情感语言。',
    prologue: '在文字出现之前，人类就在唱歌了。在哲学出现之前，人类就在用节奏表达敬畏和欢乐了。音乐是人类最古老、最直接、也最神秘的艺术形式——我们至今不完全理解为什么一组有规律的声波能让人落泪或起舞。接下来的故事，是人类四万年来用声音编织意义的历程。',
    epilogue: '从骨笛到蓝牙耳机，音乐的载体变了又变，但它做的事情始终一样：把无法用语言表达的东西变成可以被听见的东西。在你读这段文字的此刻，地球上有数十亿人正在听音乐——这也许是人类唯一真正的"通用语言"。',
    stepGuides: [
      { match: ['竖琴', '里拉琴', '乐器', '骨笛'], narrative: '最早的乐器告诉我们：人类在发明文字之前就已经在创造音乐。音乐可能和语言一样古老——它是人类表达情感的最原始方式。' },
      { match: ['毕达哥拉斯', '音律', '音程'], narrative: '毕达哥拉斯发现音乐和数学之间的联系，这个发现影响了此后两千五百年的音乐理论。悦耳的和声背后是简洁的数学比例——音乐是可以被"计算"的美。' },
      { match: ['格里高利', '圣咏'], narrative: '格里高利圣咏是西方音乐传统的根。它的旋律简洁而崇高，从中生长出了整个复调音乐和和声学的大树。' },
      { match: ['五线谱', '圭多', '记谱'], narrative: '五线谱的发明让音乐第一次可以被精确记录和跨时空传播——这是音乐史上最重要的技术革新之一，意义堪比文字的发明。' },
      { match: ['巴赫', '亨德尔', '巴洛克'], narrative: '巴赫是音乐的建筑大师——他的赋格像数学定理一样精密，却又充满人性的温暖。他去世后被遗忘了近百年，然后被整个音乐世界重新发现。' },
      { match: ['莫扎特'], narrative: '莫扎特的天才在于"轻盈"——最复杂的音乐结构在他手中变得流畅自然，仿佛本该如此。他的35年生命是一场关于天才和命运的永恒传说。' },
      { match: ['贝多芬', '英雄', '第九'], narrative: '贝多芬打破了古典音乐的一切规则，用交响曲表达了人类最强烈的情感——从愤怒到狂喜，从绝望到超越。他在失聪后写出了人类最伟大的音乐。' },
      { match: ['爵士', '蓝调', '新奥尔良'], narrative: '爵士乐是自由的声音——每一次即兴演奏都是一次对规则的挑战和超越。它诞生于美国最受压迫的社区，却成为了全世界的通用语言。' },
      { match: ['摇滚', '猫王', '披头士'], narrative: '摇滚乐不只是一种音乐，它是一场文化地震——它打破了种族界限、代际鸿沟和审美标准，让整个世界的年轻人第一次有了共同的声音。' },
      { match: ['嘻哈', '说唱', 'DJ', '布朗克斯'], narrative: '嘻哈从纽约最穷的街区走出来，成为21世纪全球最大的音乐类型。它证明了一件事：最好的艺术往往诞生在最艰难的环境中。' },
    ],
  },
  {
    id: 'poetry',
    name: '诗韵千年',
    description: '从《诗经》到《荒原》— 诗歌如何在最短的篇幅里抵达最深的真相',
    icon: <Feather size={18} />,
    color: '#D4A574',
    eventIds: [],
    keywords: ['诗', '诗歌', '诗经', '楚辞', '唐诗', '宋词', '十四行诗', '俳句', '史诗', '抒情', '离骚', '草叶集', '荒原', '诗人'],
    narrativeSummary: '如果说小说是一条大河，诗歌就是一口深井——它用最少的文字通向最深的地下水。从三千年前黄河边的"关关雎鸠"，到一百年前伦敦雾中的"四月是最残忍的月份"——人类一直在用韵律和节奏来表达语言无法触及的东西。',
    prologue: '诗歌是一种奇怪的艺术：它用最少的字，说最多的话。一首好诗可以只有几行，却让你反复阅读数十年而不觉得穷尽。接下来你将看到，从东方到西方，从远古到现代，诗人们如何用各自的语言和韵律，触及人类经验中最深处的矿脉——爱、死、美、孤独、时间的流逝。',
    epilogue: '诗歌的黄金时代结束了吗？在这个信息过载的年代，人们似乎不再需要用韵律来记忆和传递知识。但诗歌从来不是为了传递信息——它是为了在语言的缝隙中发现那些无法被散文说出的真相。只要人类还有无法用日常语言表达的感受，诗歌就不会消亡。',
    stepGuides: [
      { match: ['诗经', '关关', '风雅颂'], narrative: '《诗经》是中国诗歌的源头——305首诗来自民间歌谣、庙堂祭祀和贵族宴饮，用最朴素的语言建立了中国诗歌"言志"的传统。' },
      { match: ['离骚', '屈原', '楚辞'], narrative: '屈原把个人的政治挫折升华为对理想的终极追问。《离骚》开创了中国诗歌的"浪漫主义"——此后两千年，每一个不得志的诗人都在屈原身上看到自己。' },
      { match: ['荷马', '伊利亚特', '奥德赛'], narrative: '荷马的两部史诗为西方文学确立了两个永恒主题：在战争中寻找意义（伊利亚特），在漫长的旅途中寻找家（奥德赛）。' },
      { match: ['萨福', '抒情', '莱斯博斯'], narrative: '萨福的诗歌直接、炽烈、不加掩饰——她是西方文学中第一个用"我"来写爱情的诗人。她的大部分作品已失传，但留下的残篇足以让她不朽。' },
      { match: ['苏轼', '宋词', '李清照', '辛弃疾'], narrative: '宋词把音乐性和文学性推到了极致——苏轼的豪放和李清照的婉约，是中国诗词最动人的两种声音。' },
      { match: ['鲁米', '苏菲', '波斯'], narrative: '鲁米的诗歌穿越了语言和宗教的界限——八百年后的美国读者在他的诗句中找到了爱、失去和寻找的共鸣。' },
      { match: ['十四行诗', '彼特拉克', '莎士比亚'], narrative: '十四行诗是诗歌中的"微型建筑"——14行的严格限制反而激发了最精妙的结构和最密集的意象。' },
      { match: ['俳句', '芭蕉', '日本'], narrative: '17个音节能做什么？松尾芭蕉用它捕捉了一只青蛙跳入古池的瞬间——那个"噗通"声回响了三百多年。' },
      { match: ['惠特曼', '草叶', '自由'], narrative: '惠特曼说："我歌唱我自己。"他的自由体诗打碎了英语诗歌的格律枷锁，让诗歌的呼吸重新变得自然。' },
      { match: ['荒原', '艾略特', '现代'], narrative: '《荒原》是现代诗歌的分水岭——在此之前，诗歌试图给出答案；在此之后，诗歌学会了提出更好的问题。' },
    ],
  },
  {
    id: 'musical-theater',
    name: '舞台传奇',
    description: '从百老汇到伦敦西区 — 音乐剧如何成为最激动人心的现场艺术',
    icon: <Theater size={18} />,
    color: '#9B59B6',
    eventIds: [],
    keywords: ['音乐剧', '百老汇', 'Broadway', '西区', 'West End', '韦伯', '桑德海姆', '汉密尔顿', '歌剧魅影', '猫', '悲惨世界', 'Les Mis', '芝加哥', '魔法坏女巫'],
    narrativeSummary: '音乐剧是最民主的表演艺术——它不需要你懂乐理，不需要你读过剧本，你只需要坐在那里，让音乐、歌声和故事同时冲击你的感官。从百老汇到伦敦西区，从《西区故事》到《汉密尔顿》，音乐剧用两小时创造了一个让你笑、哭、起立鼓掌的完整宇宙。',
    prologue: '想象一下：灯光暗下，乐队奏出第一个和弦，幕布升起——在接下来的两个半小时里，你将同时被歌声、舞蹈、灯光和故事包围。音乐剧是人类发明的最"贪心"的艺术形式：它把所有的表演艺术塞进一个舞台。接下来的故事，从1728年伦敦的《乞丐歌剧》开始，一路走到百老汇的霓虹灯下。',
    epilogue: '音乐剧从来不是"高雅艺术"的附庸——它从街头娱乐中诞生，靠打动普通观众的心而存活。但最好的音乐剧证明了：流行的不一定是肤浅的。当观众在"Do You Hear the People Sing"响起时不由自主地起立，当"Memory"的旋律让满场落泪——这就是现场表演不可替代的魔力。在流媒体统治一切的时代，剧场依然亮着灯。',
    stepGuides: [
      { match: ['乞丐歌剧', '盖伊'], narrative: '1728年的《乞丐歌剧》是音乐剧的"化石"——它用流行小调嘲笑上流社会，证明了"严肃内容+流行音乐"的组合可以创造爆炸性的效果。' },
      { match: ['演艺船', 'Show Boat'], narrative: '《演艺船》是音乐剧走向成熟的转折点——它第一次证明了音乐剧可以讲述严肃的社会故事，而不只是轻浮的娱乐。' },
      { match: ['俄克拉荷马', 'Oklahoma'], narrative: '《俄克拉荷马！》改变了一切——歌曲、舞蹈和剧情不再是互不相干的拼盘，而是有机融合的整体。现代音乐剧从这里开始。' },
      { match: ['西区故事', 'West Side'], narrative: '伯恩斯坦用爵士和拉丁节奏重写了《罗密欧与朱丽叶》——音乐剧第一次证明它可以像歌剧一样深刻、像电影一样震撼。' },
      { match: ['猫', 'Cats', '韦伯'], narrative: '《猫》让全世界知道了什么是"超级音乐剧"——它不依赖明星、不依赖复杂剧情，只靠音乐、舞蹈和一群穿猫服装的演员，就征服了全球观众。' },
      { match: ['歌剧魅影', 'Phantom'], narrative: '水晶灯坠落、地下湖的烛光、面具后的深情——《歌剧魅影》证明了音乐剧可以创造出比电影更壮观的视觉奇迹。' },
      { match: ['悲惨世界', 'Les Mis', '勋伯格'], narrative: '"Do You Hear the People Sing"从巴黎街垒唱到了全世界的抗议现场——一首音乐剧歌曲变成了真正的革命颂歌。' },
      { match: ['汉密尔顿', 'Hamilton', '米兰达'], narrative: '《汉密尔顿》用嘻哈讲美国建国史、用非白人卡司演白人国父——它不只是一部音乐剧，它是一份关于"谁有权讲述历史"的宣言。' },
      { match: ['魔法坏女巫', 'Wicked'], narrative: '《魔法坏女巫》从"反派"的视角重述了《绿野仙踪》——它提醒我们：每一个被称为"坏人"的人，可能只是被误解的人。' },
    ],
  },
  {
    id: 'chinese-poetry',
    name: '诗词千年',
    description: '从《诗经》到元曲 — 中国古典诗词如何用最凝练的语言表达最深的情感',
    icon: <ScrollText size={18} />,
    color: '#D4A574',
    eventIds: [],
    keywords: ['诗经', '楚辞', '离骚', '唐诗', '宋词', '元曲', '李白', '杜甫', '苏轼', '李清照', '辛弃疾', '关汉卿', '窦娥', '西厢', '牡丹亭', '白居易', '王维', '柳永', '陆游', '马致远', '赋比兴', '词牌', '律诗', '绝句'],
    narrativeSummary: '从三千年前黄河边的"关关雎鸠"到元代戏台上窦娥的血泪——中国古典诗词走过了诗经的质朴、楚辞的瑰丽、唐诗的壮美、宋词的婉约、元曲的悲壮。每一种体裁都是时代精神的结晶，每一个字都是千锤百炼的汉语之美。',
    prologue: '中国是世界上唯一一个从未中断过诗歌传统的文明——三千年来，从黄河到长江，从宫廷到市井，中国人始终在用诗词记录生活、表达情感、抗议不公。接下来你将走过诗经的旷野、楚辞的云梦泽、唐诗的长安大道、宋词的西湖画舫、元曲的勾栏瓦肆。每一站，都是汉语最美的时刻。',
    epilogue: '从"关关雎鸠"到"断肠人在天涯"，中国古典诗词用了三千年走完了从质朴到华美再到归于质朴的完整旅程。今天的中国人可能不再写格律诗，但"举头望明月，低头思故乡"仍然是每个游子的心声；"但愿人长久，千里共婵娟"仍然是中秋夜最常被引用的句子。这些诗句已经嵌入了汉语的基因——只要中国人还在说中文，它们就不会消亡。',
    stepGuides: [
      { match: ['诗经', '国风', '关关', '赋比兴', '孔子'], narrative: '"关关雎鸠，在河之洲"——三千年前黄河边的民歌，至今仍是中国人最熟悉的诗句。《诗经》确立了"赋比兴"三种手法，为此后所有中国诗歌奠定了技法基础。' },
      { match: ['楚辞', '离骚', '屈原', '九歌'], narrative: '如果说《诗经》是北方的质朴大地，《楚辞》就是南方的瑰丽天空。屈原把个人的悲愤升华为"香草美人"的象征体系——此后两千年，每个失意的诗人都在他身上找到了精神同伴。' },
      { match: ['乐府', '木兰', '孔雀'], narrative: '汉乐府打破了四言诗的限制，五言诗由此成为主流。"孔雀东南飞，五里一徘徊"——叙事诗第一次在中国文学中获得了史诗般的长度和力量。' },
      { match: ['建安', '曹操', '曹植'], narrative: '"对酒当歌，人生几何"——建安时代的诗人第一次在诗歌中直面生死。曹操的苍凉、曹植的华美、王粲的悲壮，构成了"建安风骨"这个中国文学史上最阳刚的美学标签。' },
      { match: ['初唐', '王勃'], narrative: '"海内存知己，天涯若比邻"——初唐四杰用才华和早逝，为盛唐诗歌的到来拉开了序幕。' },
      { match: ['李白', '杜甫', '诗仙', '诗圣'], narrative: '李白如月，杜甫如日。一个醉卧长安，一个忧怀天下。他们在洛阳的那次相遇，是中国文学史上最动人的一幕——太阳和月亮终于在同一片天空中相遇了。' },
      { match: ['王维', '山水', '空山'], narrative: '"空山新雨后，天气晚来秋"——王维用 20 个字就画出了一幅最安静的中国山水画。苏轼说他"诗中有画，画中有诗"。' },
      { match: ['白居易', '长恨歌', '琵琶行'], narrative: '白居易追求"老妪能解"——他的诗歌要让不识字的老太太也能听懂。这种追求让他的诗传遍整个东亚：日本平安时代的贵族把《白氏文集》当成必读经典。' },
      { match: ['柳永', '市井', '浅斟'], narrative: '柳永把词从文人的书斋带到了市井的歌楼——"凡有井水饮处，皆能歌柳词"。他是中国文学史上第一个真正的"流行歌曲"作者。' },
      { match: ['苏轼', '大江东去', '赤壁', '豪放'], narrative: '苏轼一个人就改变了"词"的命运——在他之前，词是"诗余"、是小道；在他之后，词成为了和诗平起平坐的文学正宗。' },
      { match: ['李清照', '寻寻觅觅', '婉约'], narrative: '14 个叠字、97 个汉字——李清照用这首《声声慢》写出了中国词史上最著名的开篇，也写出了一个女性在乱世中的孤独和尊严。' },
      { match: ['辛弃疾', '挑灯看剑', '破阵'], narrative: '辛弃疾 21 岁率 50 骑闯入金兵大营活捉叛将——这个真实经历让他的词有了别人写不出的力量。"醉里挑灯看剑"不是想象，是记忆。' },
      { match: ['窦娥', '关汉卿', '元杂剧'], narrative: '窦娥在刑场上的三桩誓愿——血溅白绫、六月飞雪、大旱三年——是中国文学史上最震撼的悲剧高潮。关汉卿把底层百姓的冤屈搬上了舞台。' },
      { match: ['天净沙', '马致远', '枯藤', '秋思'], narrative: '28 个字、9 个意象、零动词——马致远用中国文学史上最简洁的手法写出了最经典的乡愁。这首小令证明了：真正的大师知道什么时候该停笔。' },
      { match: ['西厢记', '王实甫', '有情人'], narrative: '"愿天下有情人终成眷属"——这句话从元代传到今天，成为了中国人说"祝你幸福"最文雅的方式。' },
      { match: ['牡丹亭', '汤显祖', '杜丽娘'], narrative: '"情不知所起，一往而深"——汤显祖和莎士比亚同年离世，但他们不知道彼此。《牡丹亭》是中国文学对"爱情可以超越生死"这一命题最极致的回答。' },
    ],
  },
  {
    id: 'china-civilization',
    name: '华夏文明脉络',
    description: '从黄帝传说到改革开放 — 华夏五千年不间断的文明之旅',
    icon: <Landmark size={18} />,
    color: '#DE2910',
    eventIds: [],
    keywords: ['中国', '华夏', '黄帝', '夏朝', '商朝', '周朝', '秦', '汉', '唐', '宋', '明', '清', '春秋', '战国', '孔子', '造纸', '科举', '大运河', '丝绸', '紫禁城', '鸦片', '辛亥', '五四', '改革开放', '长城'],
    narrativeSummary: '从黄帝传说到改革开放——华夏文明是人类历史上唯一从未中断的文明。五千年间，它经历了统一与分裂的反复交替、儒道佛的精神建构、科技发明的全球领先、近代百年的屈辱与觉醒。这条路线串联了中国文明最关键的 20+ 个节点，带你走完华夏五千年。',
    prologue: '华夏文明的独特之处在于它的连续性——世界上没有第二个文明能在同一片土地上、用同一套文字、延续五千年不间断的历史记录。从黄帝传说开始，经历了夏商周三代奠基、秦汉大一统、唐宋文化巅峰、明清帝国的辉煌与封闭、近代百年的痛苦转型，直到当代的重新崛起。让我们沿着这条脉络，看看华夏文明的每一个关键转折。',
    epilogue: '回望五千年，华夏文明最了不起的不是任何单一的发明或制度，而是它的韧性——无论经历多少次入侵、分裂和动荡，它总能在废墟上重建。从"九九归一"到"天下大同"，从"四大发明"到"改革开放"，这条文明的河流虽然多次改道，但从未干涸。今天的中国正站在一个新的历史节点上——它将如何书写下一个五千年？',
    stepGuides: [
      { match: ['黄帝', '华夏', '始祖', '炎黄'], narrative: '"炎黄子孙"——这个称呼连接着每一个中国人与五千年前的传说时代。黄帝可能不是一个人，而是一个时代的象征：从部落走向文明的开端。' },
      { match: ['夏朝', '大禹', '二里头'], narrative: '大禹治水、家天下——夏朝开启了中国王朝更替的漫长循环。二里头遗址的发现让"夏朝是否存在"的千年疑问终于有了考古学的回应。' },
      { match: ['商朝', '甲骨', '青铜'], narrative: '甲骨文和青铜器——商朝用文字记录天意，用青铜铸造权力。这两项遗产奠定了中华文明的物质和精神基础。' },
      { match: ['周朝', '封建', '宗法', '周公', '礼乐'], narrative: '周公制礼作乐——"礼"是秩序，"乐"是和谐。这套制度设计了中国社会两千年的基本框架：等级分明、各安其分。' },
      { match: ['春秋', '战国', '百家争鸣'], narrative: '中国思想的"大爆炸"——儒、道、法、墨同时登场，数百年的战乱反而催生了人类历史上最活跃的思想黄金期。' },
      { match: ['孔子', '儒家', '论语'], narrative: '一个落魄贵族、失意官员、流浪教师——孔子生前不算成功，但他死后两千年，他的思想成了东亚文明的底层操作系统。' },
      { match: ['秦始皇', '秦朝', '统一', '长城', '兵马俑'], narrative: '"书同文、车同轨、行同伦"——秦始皇用铁血手段完成了中国第一次大一统。长城和兵马俑是他权力的纪念碑，也是万千劳工血泪的见证。' },
      { match: ['汉朝', '汉武帝', '丝绸之路', '张骞'], narrative: '"汉"从一个朝代名变成了一个民族名——汉朝用四百年证明了大一统是可以持久的。张骞凿空西域，打通了连接东西方的丝绸之路。' },
      { match: ['造纸', '蔡伦'], narrative: '一项看似普通的技术改进，改变了整个人类文明的进程——蔡伦让知识从竹简和丝帛上"飞"了起来。' },
      { match: ['三国', '曹操', '诸葛亮'], narrative: '三国是中国最"全民皆知"的历史——不是因为它多重要，而是因为《三国演义》让它成了中国人最早的"历史启蒙读本"。' },
      { match: ['隋朝', '大运河', '科举'], narrative: '大运河和科举——隋朝只活了 38 年，却留下了影响中国一千多年的两大遗产。一条水路连接南北经济，一套考试制度打破门阀垄断。' },
      { match: ['唐朝', '贞观', '盛唐', '开元'], narrative: '盛唐是中国文化自信的巅峰——长安是当时世界上最国际化的城市，唐诗是中国文学永恒的黄金标准，"唐人"成了海外华人的代称。' },
      { match: ['宋朝', '北宋', '南宋', '交子', '活字'], narrative: '如果只看科技和经济，宋朝是当时全球最先进的文明——纸币、火药武器、活字印刷、航海指南针。但军事上的积弱让这个文化巅峰始终处于被动。' },
      { match: ['元朝', '忽必烈', '蒙古'], narrative: '蒙古铁骑横扫欧亚，建立了人类历史上最大的陆地帝国。元朝是中国历史上第一个由非汉族建立的大一统王朝——马可波罗笔下的东方奇迹。' },
      { match: ['明朝', '朱元璋', '紫禁城', '郑和'], narrative: '明朝的矛盾集于一身：郑和七下西洋展示了无与伦比的海洋实力，但随后的海禁让中国与大航海时代擦肩而过。紫禁城壮丽，也是封闭的象征。' },
      { match: ['清朝', '康熙', '乾隆', '满族'], narrative: '康乾盛世是中国封建王朝最后的辉煌——但这个盛世的尾声恰好赶上了西方工业革命。当英国人开始用蒸汽机织布时，中国还在用手工纺车。' },
      { match: ['鸦片', '南京条约', '近代'], narrative: '1840 年的炮声震碎了"天朝上国"的幻梦。鸦片战争不仅是一场军事失败，更是两种文明模式的碰撞——中国用了将近两百年来消化这场冲击。' },
      { match: ['辛亥', '孙中山', '共和'], narrative: '两千多年的帝制在一声枪响中终结——辛亥革命是中国从王朝循环走向现代共和的转折点。但真正的现代化之路才刚刚开始。' },
      { match: ['五四', '新文化', '白话文'], narrative: '"赛先生"和"德先生"——五四运动用科学和民主两面旗帜为中国思想的现代转型定下了基调。白话文取代文言文，中国人开始用新的语言思考新的问题。' },
      { match: ['新中国', '成立', '1949'], narrative: '1949 年 10 月 1 日——一个新的时代开始了。无论如何评价此后的历史，这一刻标志着中国百年屈辱的终结和独立自主的重新开始。' },
      { match: ['改革开放', '邓小平', '深圳'], narrative: '1978 年——中国再次站在了历史的十字路口。改革开放不仅改变了中国，也改变了世界：8 亿人脱贫，全球第二大经济体崛起，人类历史上规模最大的社会转型正在进行中。' },
    ],
  },
  {
    id: 'europe-civilization',
    name: '欧洲文明脉络',
    description: '从米诺斯宫殿到欧盟 — 三千年欧洲文明的兴衰与重生',
    icon: <Landmark size={18} />,
    color: '#2E4057',
    eventIds: [],
    keywords: ['希腊', '罗马', '雅典', '斯巴达', '亚历山大', '凯撒', '奥古斯都', '查理曼', '十字军', '黑死病', '文艺复兴', '达芬奇', '路德', '宗教改革', '启蒙', '法国大革命', '拿破仑', '工业革命', '维也纳', '俾斯麦', '一战', '二战', '柏林墙', '欧盟', '欧洲', '诺曼', '威斯特伐利亚', '光荣革命', '大宪章'],
    narrativeSummary: '欧洲文明的故事是一部不断自我革新的史诗——从爱琴海的城邦民主到罗马的万里帝国，从中世纪的教堂尖塔到文艺复兴的穹顶壁画，从启蒙运动的理性之光到两次世界大战的毁灭性疯狂，再到废墟上建起的欧盟。没有哪个文明像欧洲这样频繁地摧毁自己又重建自己。',
    prologue: '欧洲不是一个"国家"，而是一个"辩论场"——三千年来，自由与秩序、信仰与理性、民族与普世在这片不大的半岛上反复碰撞。它产生了民主、也产生了独裁；产生了人权宣言、也产生了种族灭绝。理解欧洲，不是理解一种文明，而是理解文明最剧烈的内部张力。让我们从克里特岛开始。',
    epilogue: '从米诺斯宫殿到布鲁塞尔总部，欧洲文明走过了三千年。它最了不起的品质不是从未犯错——恰恰相反，它犯过人类历史上最惨烈的错误。它了不起的地方在于：它发明了一套自我纠错的机制——法治、议会、自由媒体、独立司法。两次世界大战证明了欧洲的疯狂可以达到什么程度，而欧盟的建立证明了从疯狂中觉醒后可以走多远。',
    stepGuides: [
      { match: ['米诺斯', '克里特', '迈锡尼'], narrative: '在大陆文明之前，爱琴海上的岛屿已经诞生了宫殿和文字。米诺斯文明的精美壁画和复杂排水系统证明：欧洲文明的起点不在北方的森林，而在南方的海洋。' },
      { match: ['雅典', '民主', '克里斯提尼', '伯里克利'], narrative: '雅典的实验回答了一个至今仍有争议的问题：普通人能否自治？两千五百年前的答案是"可以，但很困难"——这个判断至今没有过时。' },
      { match: ['亚历山大', '马其顿', '希腊化'], narrative: '亚历山大用十年时间创造了一个从希腊到印度的帝国，但他的真正遗产不是领土——而是希腊文化与东方文化的大规模融合，即"希腊化"世界。' },
      { match: ['罗马', '奥古斯都', '帝国', '法律'], narrative: '罗马的遗产是制度：道路、法律、公民权、行省治理。当帝国灭亡后，这些制度以各种变形继续运作了一千多年。欧洲本质上是一个"后罗马"文明。' },
      { match: ['基督教', '米兰', '君士坦丁'], narrative: '基督教的胜利改变了一切——从此欧洲有了一个统一的精神框架：一个上帝、一部经典、一套道德标准。这个框架在此后一千五百年里既是凝聚力的来源，也是冲突的根源。' },
      { match: ['查理曼', '加洛林', '法兰克'], narrative: '查理曼是"欧洲"概念的第一个实体化身——他的帝国涵盖了今天法国、德国和意大利的大部分。843年帝国三分，大致画出了欧洲三大国的雏形。' },
      { match: ['十字军', '耶路撒冷'], narrative: '十字军是欧洲第一次大规模的对外军事冒险。它的初衷是宗教的，但后果是世俗的——欧洲人重新发现了被遗忘的古典知识，也第一次见识了东方的富庶。' },
      { match: ['黑死病', '瘟疫'], narrative: '黑死病在1347-1351年间杀死了欧洲三分之一到二分之一的人口。但灾难的另一面是：劳动力的急剧减少提高了农民的议价能力，封建制度开始松动。有学者认为文艺复兴的种子就在瘟疫中埋下。' },
      { match: ['文艺复兴', '达芬奇', '美第奇'], narrative: '文艺复兴从意大利开始：美第奇家族的财富、古典文献的重新发现、个人主义的觉醒——这三者汇合产生了一场人类精神的爆发。达芬奇既是艺术家也是工程师，他本人就是文艺复兴精神的缩影。' },
      { match: ['路德', '宗教改革', '新教'], narrative: '路德的95条论纲撕裂了基督教世界。宗教改革不仅是神学争论——它打破了教会对知识的垄断，为个人良心的自由打开了一条缝隙，而那条缝隙后来变成了一扇大门。' },
      { match: ['威斯特伐利亚', '主权', '三十年战争'], narrative: '三十年战争毁掉了德意志三分之一的人口，但它的结束——威斯特伐利亚和约——创造了现代国际关系的基本语法：主权、领土完整、互不干涉。' },
      { match: ['启蒙', '伏尔泰', '卢梭', '洛克', '百科全书'], narrative: '启蒙运动是欧洲精神史上最大胆的实验：用理性取代传统，用科学取代迷信，用法律取代暴力。它的遗产——人权、法治、政教分离——至今仍是"现代"的定义。' },
      { match: ['法国大革命', '巴士底', '人权宣言'], narrative: '1789年是欧洲历史的分水岭：旧制度在巴黎街头被推翻。"自由、平等、博爱"——这三个词从此成为全世界每一场革命的精神口号。' },
      { match: ['拿破仑', '滑铁卢'], narrative: '拿破仑用军事天才征服了大半个欧洲，又用《拿破仑法典》从根本上改变了它的法律体系。他失败了，但他散播的思想——民族主义和自由主义——再也收不回去。' },
      { match: ['工业革命', '蒸汽', '铁路'], narrative: '工业革命让欧洲获得了对全球其他文明的压倒性物质优势。蒸汽机不仅驱动了工厂和火车，也驱动了殖民扩张——19世纪的欧洲字面意义上"吞噬"了世界。' },
      { match: ['一战', '索姆河', '凡尔赛'], narrative: '1914-1918年，欧洲用工业化的效率自我毁灭。一千万人死亡、四个帝国解体——一战证明了"文明"的欧洲可以多么"不文明"。' },
      { match: ['二战', '希特勒', '大屠杀', 'Holocaust'], narrative: '大屠杀是欧洲文明最黑暗的时刻——用工业化手段系统性地屠杀六百万犹太人。它证明了：启蒙运动的"理性"并不自动导向善良，现代技术可以用于最原始的邪恶。' },
      { match: ['柏林墙', '冷战', '铁幕'], narrative: '柏林墙倒塌的那个夜晚，欧洲画出了它三千年故事中最动人的一幕：不是征服，不是革命，而是人们用锤子和拥抱终结了一个时代。' },
      { match: ['欧盟', '欧洲一体化', '马斯特里赫特'], narrative: '欧盟是人类历史上最大规模的自愿主权让渡实验——27个曾经互相厮杀的国家选择了合作。它不完美，但它的存在本身就是对两次世界大战最好的回答。' },
    ],
  },
  {
    id: 'american-experiment',
    name: '美国实验',
    description: '从五月花号到硅谷 — 一个"实验性国家"的四百年故事',
    icon: <Landmark size={18} />,
    color: '#1B4965',
    eventIds: [],
    keywords: ['美国', '独立', '宪法', '林肯', '内战', '奴隶', '西进', '淘金', '新政', '罗斯福', '民权', '马丁', '路德', '金', '肯尼迪', '登月', '阿波罗', '硅谷', '苹果', '互联网', '9/11', '奥巴马', '五月花', '杰斐逊', '华盛顿', '珍珠港', '越战', '水门', '麦卡锡', '好莱坞', 'iPhone'],
    narrativeSummary: '美国是人类历史上最大胆的政治实验——一群来自不同国家、不同信仰的移民，试图在一片"新大陆"上从零开始建造一个"人人生而平等"的国家。四百年过去了，这个实验的结果仍在书写中：它产生了宪法和自由女神，也产生了奴隶制和种族隔离；它登上了月球，也深陷于越战泥潭。美国的故事不是一条直线进步的故事，而是理想与现实反复拉锯的故事。',
    prologue: '没有哪个国家像美国一样，是被一份文件"发明"出来的。1776年的《独立宣言》不是宣布一个既有民族的独立，而是提出了一个激进的命题："人人生而平等。"接下来的两百多年，美国人一直在争论这句话到底意味着什么——谁算"人人"？"平等"到什么程度？这个辩论至今没有结束。让我们从大西洋上的一艘帆船开始。',
    epilogue: '从詹姆斯敦的沼泽到硅谷的芯片工厂，美国用四百年走完了许多文明用数千年走过的路程。它最了不起的不是它的财富或军事力量——而是它的自我纠错能力：奴隶制被废除了，女性获得了投票权，种族隔离被推翻了，水门事件证明总统也在法律之下。但每一次纠错都伴随着巨大的痛苦和代价。美国实验的终极考验不是"能不能变强"，而是"能不能兑现自己的承诺"——这个承诺写在独立宣言的第二段里，至今仍是人类政治文明中最美丽也最沉重的一句话。',
    stepGuides: [
      { match: ['詹姆斯敦', '弗吉尼亚', '殖民'], narrative: '1607年，104个英国人踏上弗吉尼亚的沼泽地。他们中的大多数在第一年就死了——但活下来的人建立了北美第一个永久殖民地。烟草让它活了下来，奴隶制让它富了起来。美国的光明与黑暗从这里同时开始。' },
      { match: ['五月花', '清教徒', '普利茅斯'], narrative: '五月花号上的102名乘客不是来淘金的——他们是来寻找"信仰自由"的清教徒。在登陆前，他们签署了《五月花号公约》，同意通过"公正和平等的法律"来自我治理。这份简陋的协议被后人视为美国民主的种子。' },
      { match: ['萨勒姆', '女巫'], narrative: '萨勒姆的女巫恐慌提醒我们：自由社会也能被恐惧吞噬。当人们相信邪恶无处不在时，理性就让位给了歇斯底里。这个教训在麦卡锡时代和9/11之后反复重演。' },
      { match: ['独立宣言', '独立', '杰斐逊'], narrative: '"人人生而平等，造物主赋予他们某些不可剥夺的权利"——杰斐逊写下这句话时，他自己拥有600多名奴隶。美国的理想从一开始就与现实存在巨大的裂缝——但正是这个理想为后来的每一场平权运动提供了最有力的武器。' },
      { match: ['宪法', '费城', '制宪', '麦迪逊'], narrative: '55个人在一个闷热的夏天里争论了四个月，创造出一部4543个英文单词的文件——它至今仍是美国的最高法律。宪法最天才的设计是"制衡"：没有任何一个人、一个机构可以拥有绝对权力。' },
      { match: ['路易斯安那', '购地', '杰斐逊'], narrative: '杰斐逊花了1500万美元买下了210万平方公里的土地——每英亩不到3美分。这笔可能是人类历史上最划算的地产交易，让美国从大西洋沿岸的狭长国家变成了一个横跨大陆的巨人。' },
      { match: ['眼泪之路', '印第安', '迁移', '切罗基'], narrative: '美国西进运动的另一面是原住民的灾难。"眼泪之路"上4000名切罗基人死亡——他们是被一个标榜"人人平等"的国家驱逐的。"对谁平等"的问题从此缠绕了美国两百年。' },
      { match: ['淘金', '加利福尼亚', '49'], narrative: '淘金热不只是关于黄金——它是关于美国梦的原型叙事：任何人，不管出身如何，都可以西进寻找财富。大多数人空手而归，但这个梦至今仍驱动着移民涌向美国。' },
      { match: ['内战', '南北', '萨姆特', '邦联'], narrative: '美国内战是对"一个民族能不能半奴隶半自由地存活"这个问题的血腥回答。62万人的死亡证明了答案是"不能"——但完全的自由又花了一百年才到来。' },
      { match: ['解放', '奴隶', '宣言', '林肯'], narrative: '林肯的《解放奴隶宣言》用法律的语言做了一件道德的事。它没有一夜之间改变所有人的命运，但它让内战从一场保卫联邦的战争变成了一场解放人类的战争。' },
      { match: ['自由女神', '移民', '埃利斯'], narrative: '"给我你那疲惫的、贫穷的、渴望自由呼吸的芸芸众生"——自由女神像底座上的这首诗定义了一个理想。1200万移民经过埃利斯岛时看到她的第一眼，改变了他们的一生。' },
      { match: ['大萧条', '崩盘', '华尔街', '1929'], narrative: '1929年的华尔街崩盘证明了不受约束的资本主义可以多么具有破坏性。大萧条不仅摧毁了经济——它摧毁了对"看不见的手"的盲信，为政府干预经济打开了大门。' },
      { match: ['新政', '罗斯福', 'FDR'], narrative: '罗斯福的新政不是一个单一的政策——它是一种哲学的转变：政府应该成为普通人的安全网。社会保障、劳工权利、银行监管——这些今天被视为理所当然的东西，都是新政的遗产。' },
      { match: ['珍珠港', '太平洋', '日本'], narrative: '珍珠港把一个孤立主义的国家拖入了世界大战。美国用它不可思议的工业产能证明了"民主兵工厂"的力量——在四年间，它造出了30万架飞机、8万辆坦克和6000艘军舰。' },
      { match: ['麦卡锡', '红色恐惧', '共产'], narrative: '麦卡锡时代的教训是：自由社会中最危险的敌人不一定来自外部——恐惧本身就可以让一个民主国家自我吞噬。当"爱国"被用作压制异见的工具时，自由就名存实亡了。' },
      { match: ['民权', '马丁', '梦想', '游行'], narrative: '"我有一个梦想"——这或许是20世纪最有力量的演说。马丁·路德·金没有号召暴力，而是召唤美国"兑现它的承诺"。他的策略是让美国用自己的理想来审判自己的现实。' },
      { match: ['肯尼迪', '达拉斯', '遇刺'], narrative: '肯尼迪遇刺不只是一个总统的死亡——它是美国战后乐观主义的终结。此后的越战、水门、暗杀一连串的创伤，让"美国永远在进步"的信念产生了深深的裂缝。' },
      { match: ['登月', '阿波罗', '阿姆斯特朗', '月球'], narrative: '当阿姆斯特朗踏上月球时，全人类为之屏息。登月是美国最纯粹的成就——它不是为了征服或获利，而是为了证明人类可以做到。那一刻，美国属于全世界。' },
      { match: ['硅谷', '苹果', '乔布斯', 'Apple', '个人电脑', 'iPhone'], narrative: '从车库里的两个史蒂夫到市值三万亿的巨头——苹果的故事浓缩了美国创新文化的精髓：叛逆、想象力和"改变世界"的狂妄。硅谷不只是生产技术，它生产的是一种信念：未来是可以被发明的。' },
      { match: ['9/11', '恐怖', '世贸', '双子塔'], narrative: '2001年9月11日改变了一切。在那个清澈的秋日早晨，美国发现自己不再是不可触碰的。此后的二十年——两场战争、监控体系、社会分裂——都是那一天的漫长余震。' },
      { match: ['奥巴马', '非裔', '总统'], narrative: '一个来自肯尼亚移民家庭的年轻参议员当选总统——这在半个世纪前是不可想象的。奥巴马的胜选证明了美国的自我纠错能力，但也揭示了远未愈合的种族创伤。' },
    ],
  },
  // ── 考试大纲路线 ──
  {
    id: 'exam-zhongkao',
    name: '中考必考考点',
    description: '覆盖初中历史大纲核心考点，助力中考复习',
    icon: <GraduationCap size={20} />,
    color: '#3b82f6',
    eventIds: [],
    keywords: EXAM_TOPICS.filter(t => t.level === 'zhongkao' || t.level === 'both').flatMap(t => t.keywords.slice(0, 3)),
    narrativeSummary: '按照初中历史课程标准整理的必考知识点，涵盖中国古代史、中国近现代史、世界古代史和世界近现代史四大模块。',
    stepGuides: EXAM_TOPICS.filter(t => t.level === 'zhongkao' || t.level === 'both').map(t => ({
      match: t.keywords.slice(0, 2),
      narrative: `【${t.module}·${t.name}】${t.description}`,
    })),
    prologue: '中考历史覆盖从远古文明到改革开放的完整脉络。让我们沿着时间线，逐一回顾每一个必考知识点。记住：理解比记忆更重要。',
    epilogue: '恭喜你完成了中考历史核心考点的复习！记住要把事件放在时代背景中理解因果关系，这是中考高分的关键。',
  },
  {
    id: 'exam-gaokao',
    name: '高考重点考点',
    description: '高中历史必修+选修核心考点，备战高考',
    icon: <GraduationCap size={20} />,
    color: '#ef4444',
    eventIds: [],
    keywords: EXAM_TOPICS.filter(t => t.level === 'gaokao' || t.level === 'both').flatMap(t => t.keywords.slice(0, 3)),
    narrativeSummary: '按照高中历史新课标整理的重点考点，注重政治制度演变、经济发展脉络、思想文化演进三条主线。',
    stepGuides: EXAM_TOPICS.filter(t => t.level === 'gaokao' || t.level === 'both').map(t => ({
      match: t.keywords.slice(0, 2),
      narrative: `【${t.module}·${t.name}】${t.description}`,
    })),
    prologue: '高考历史强调唯物史观、时空观念、史料实证、历史解释和家国情怀五大核心素养。让我们用这些视角重新审视每一个关键历史节点。',
    epilogue: '高考历史不仅考查记忆，更考查分析和论述能力。建议你将这些事件串联成因果链条，形成自己的历史认知框架。',
  },
]

interface CuratedPathsProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

export function CuratedPaths({ open, onClose, events, onSelectEvent }: CuratedPathsProps) {
  const [activePath, setActivePath] = useState<string | null>(null)

  // 对每条路线匹配事件
  const pathEvents = useMemo(() => {
    const result: Map<string, HistoricalEvent[]> = new Map()
    CURATED_PATHS.forEach(path => {
      const matched = events.filter(event => {
        // ID 精确匹配
        if (path.eventIds.includes(event.id)) return true
        // 关键词模糊匹配
        const text = `${event.title} ${event.description} ${event.figure || ''}`
        return path.keywords.some(kw => text.includes(kw))
      })
      // 按年份排序
      matched.sort((a, b) => a.year - b.year)
      result.set(path.id, matched.slice(0, 20))
    })
    return result
  }, [events])

  const currentPath = CURATED_PATHS.find(p => p.id === activePath)
  const currentEvents = activePath ? (pathEvents.get(activePath) || []) : []

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[min(88vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
        {/* Header */}
        <div className="border-b border-border/50 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">策展路线</h2>
              <p className="text-xs text-muted-foreground">
                {activePath ? currentPath?.name : '选择一条叙事路线，跟随编辑精选的故事线'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activePath && (
              <button
                onClick={() => setActivePath(null)}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
              >
                返回列表
              </button>
            )}
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={18} />
            </button>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1" type="hover">
          {!activePath ? (
            /* 路线选择列表 */
            <div className="p-5 space-y-3">
              {CURATED_PATHS.map(path => {
                const matchedCount = pathEvents.get(path.id)?.length || 0
                return (
                  <button
                    key={path.id}
                    onClick={() => setActivePath(path.id)}
                    className="w-full text-left p-4 rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                    style={{ borderLeftWidth: '3px', borderLeftColor: path.color }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: `${path.color}30`, color: path.color }}
                      >
                        {path.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {path.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{path.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted-foreground">{matchedCount} 个事件</span>
                        <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            /* 路线详情 */
            <div className="p-5">
              {/* 开篇综述 */}
              {currentPath?.prologue && (
                <div
                  className="p-4 rounded-xl border mb-4"
                  style={{ backgroundColor: `${currentPath.color}05`, borderColor: `${currentPath.color}20` }}
                >
                  <p className="text-xs font-semibold text-foreground/70 mb-1.5 flex items-center gap-1">
                    <BookOpen size={12} style={{ color: currentPath.color }} />
                    开篇
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {currentPath.prologue}
                  </p>
                </div>
              )}

              {/* 叙事总结 */}
              {currentPath && (
                <div
                  className="p-4 rounded-xl border mb-5"
                  style={{ backgroundColor: `${currentPath.color}08`, borderColor: `${currentPath.color}30` }}
                >
                  <p className="text-sm text-foreground/90 leading-relaxed italic">
                    "{currentPath.narrativeSummary}"
                  </p>
                </div>
              )}

              {/* 事件列表 — 带连线 */}
              <div className="relative pl-6">
                {/* 连线 */}
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full"
                  style={{ backgroundColor: `${currentPath?.color}30` }}
                />
                <div className="space-y-3">
                  {currentEvents.map((event: HistoricalEvent, idx: number) => {
                    const catCfg = CATEGORY_CONFIG[event.category]
                    const stepNarrative = currentPath ? getStepNarrative(currentPath, event, idx, currentEvents.length) : null
                    return (
                      <div key={event.id} className="relative">
                        {/* 节点 */}
                        <div
                          className="absolute -left-6 top-3 w-3 h-3 rounded-full border-2"
                          style={{
                            borderColor: currentPath?.color,
                            backgroundColor: event.significance === 3 ? currentPath?.color : 'transparent',
                          }}
                        />
                        {/* 序号 */}
                        <span
                          className="absolute -left-[46px] top-2.5 text-[9px] font-mono font-bold"
                          style={{ color: currentPath?.color }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <button
                          onClick={() => onSelectEvent(event)}
                          className="w-full text-left p-3 rounded-lg border border-border/40 hover:border-border hover:bg-accent/30 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-muted-foreground">{formatYear(event.year)}</span>
                            <RegionFlag region={event.region} size={14} />
                            <span
                              className="text-[9px] px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${catCfg.color}18`, color: catCfg.color }}
                            >
                              {catCfg.label}
                            </span>
                            {event.significance === 3 && <span className="text-[9px] text-amber-500">★ 里程碑</span>}
                          </div>
                          <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                        </button>

                        {/* 逐步导读 */}
                        {stepNarrative && (
                          <div
                            className="mt-1.5 ml-1 pl-3 border-l-2 py-1.5"
                            style={{ borderColor: `${currentPath?.color}40` }}
                          >
                            <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic">{stepNarrative}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {currentEvents.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">当前筛选条件下没有匹配的事件</p>
                  <p className="text-xs text-muted-foreground mt-1">尝试清除筛选条件以查看完整路线</p>
                </div>
              )}

              {/* 结尾总结 */}
              {currentPath?.epilogue && currentEvents.length > 0 && (
                <div
                  className="p-4 rounded-xl border mt-5"
                  style={{ backgroundColor: `${currentPath.color}05`, borderColor: `${currentPath.color}20` }}
                >
                  <p className="text-xs font-semibold text-foreground/70 mb-1.5 flex items-center gap-1">
                    <BookOpen size={12} style={{ color: currentPath.color }} />
                    回望
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {currentPath.epilogue}
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
