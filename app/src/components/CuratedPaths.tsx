import { useState, useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Flame, Map as MapIcon, Swords, Lightbulb, Dna, X, ChevronRight, BookOpen, Music } from 'lucide-react'
import { RegionFlag } from './RegionFlag'

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
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
