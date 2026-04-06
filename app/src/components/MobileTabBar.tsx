import type { ViewMode } from '@/hooks/useTimelineState'
import { AlignJustify, Grid3X3, Columns, BarChart3, Layers } from 'lucide-react'

interface MobileTabBarProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

const TABS: Array<{ mode: ViewMode; label: string; icon: React.FC<{ size?: number; className?: string }> }> = [
  { mode: 'timeline', label: '时间线', icon: AlignJustify },
  { mode: 'matrix', label: '矩阵', icon: Grid3X3 },
  { mode: 'compare', label: '对照', icon: Columns },
  { mode: 'stats', label: '统计', icon: BarChart3 },
  { mode: 'civilizations', label: '图谱', icon: Layers },
]

export function MobileTabBar({ viewMode, setViewMode }: MobileTabBarProps) {
  return (
    <div className="flex-shrink-0 h-14 bg-card/90 backdrop-blur-md border-t border-border/50 flex items-center justify-around px-1 md:hidden">
      {TABS.map(tab => {
        const isActive = viewMode === tab.mode
        const Icon = tab.icon
        return (
          <button
            key={tab.mode}
            onClick={() => setViewMode(tab.mode)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-lg transition-all duration-200 ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
              <Icon size={18} className={isActive ? 'text-primary' : ''} />
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </div>
            <span className={`text-[9px] font-medium ${isActive ? 'text-primary' : ''}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
