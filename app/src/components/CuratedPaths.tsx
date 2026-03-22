import { useState, useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Flame, Map as MapIcon, Swords, Lightbulb, Dna, X, ChevronRight, BookOpen } from 'lucide-react'
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
