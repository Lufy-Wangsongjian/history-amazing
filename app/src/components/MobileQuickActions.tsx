import {
  BookOpen, Shuffle, Brain, Puzzle, HelpCircle, ArrowUpDown,
  Target, Swords, Users, Clapperboard, Trophy, Grid3X3, BarChart3, Sparkles,
} from 'lucide-react'

interface MobileQuickActionsProps {
  onPath: () => void
  onRandom: () => void
  onQuiz: () => void
  onMemory: () => void
  onRiddle: () => void
  onSorter: () => void
  onMissions: () => void
  onChallenge: () => void
  onFigures: () => void
  onAutoExplore: () => void
  onAchievements: () => void
  onProgressHeatmap: () => void
  onAnnualReport: () => void
  /** 成就解锁数 */
  unlockedAchievements?: number
}

/**
 * 移动端快捷入口区 —— 在汉堡侧栏底部展示所有功能按钮
 * 桌面端通过 Header 下拉菜单访问，移动端通过此区访问
 */
export function MobileQuickActions({
  onPath, onRandom,
  onQuiz, onMemory, onRiddle, onSorter, onMissions, onChallenge,
  onFigures, onAutoExplore, onAchievements, onProgressHeatmap, onAnnualReport,
  unlockedAchievements = 0,
}: MobileQuickActionsProps) {
  const sections = [
    {
      title: '探索',
      items: [
        { icon: <BookOpen size={18} />, label: '策展路线', color: '#10b981', onClick: onPath },
        { icon: <Shuffle size={18} />, label: '随机穿越', color: '#a855f7', onClick: onRandom },
        { icon: <Clapperboard size={18} />, label: '连续漫游', color: '#3b82f6', onClick: onAutoExplore },
        { icon: <Users size={18} />, label: '人物图鉴', color: '#6366f1', onClick: onFigures },
      ],
    },
    {
      title: '互动游戏',
      items: [
        { icon: <Brain size={18} />, label: '知识测验', color: '#ec4899', onClick: onQuiz },
        { icon: <Puzzle size={18} />, label: '连连看', color: '#f43f5e', onClick: onMemory },
        { icon: <HelpCircle size={18} />, label: '猜谜', color: '#f59e0b', onClick: onRiddle },
        { icon: <ArrowUpDown size={18} />, label: '排序挑战', color: '#06b6d4', onClick: onSorter },
        { icon: <Target size={18} />, label: '今日挑战', color: '#ef4444', onClick: onMissions },
        { icon: <Swords size={18} />, label: '时间对决', color: '#8b5cf6', onClick: onChallenge },
      ],
    },
    {
      title: '我的数据',
      items: [
        { icon: <Trophy size={18} />, label: `成就${unlockedAchievements ? ` ${unlockedAchievements}` : ''}`, color: '#eab308', onClick: onAchievements },
        { icon: <Grid3X3 size={18} />, label: '探索热力', color: '#06b6d4', onClick: onProgressHeatmap },
        { icon: <BarChart3 size={18} />, label: '探索报告', color: '#3b82f6', onClick: onAnnualReport },
      ],
    },
  ]

  return (
    <div className="border-t border-border/40 px-4 py-4 space-y-4">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/70">
        <Sparkles size={12} className="text-amber-500" />
        <span>快捷入口</span>
      </div>
      {sections.map(section => (
        <div key={section.title}>
          <div className="text-[10px] font-medium text-muted-foreground mb-2 px-1">
            {section.title}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {section.items.map(item => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-card/60 border border-border/40 hover:bg-accent/60 active:scale-[0.96] transition-all min-h-[64px]"
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] text-foreground/80 text-center leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
