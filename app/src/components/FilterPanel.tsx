import { CATEGORY_CONFIG, REGION_CONFIG, ERAS } from '@/data/types'
import type { Category, Region } from '@/data/types'
import { CONTINENT_GROUPS } from '@/data/regions'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  BookOpen, FlaskConical, Music, Palette, Brain,
  Landmark, Cog, Building2, Search, X, RotateCcw,
  Grid3X3, AlignJustify, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, BarChart3, CheckSquare, Square,
  Church, Swords, Compass, HeartPulse,
} from 'lucide-react'
import type { ViewMode } from '@/hooks/useTimelineState'
import { formatYear } from '@/data/types'
import { useState, useCallback } from 'react'

const categoryIcons: Record<Category, React.ReactNode> = {
  literature: <BookOpen size={14} />,
  science: <FlaskConical size={14} />,
  music: <Music size={14} />,
  art: <Palette size={14} />,
  philosophy: <Brain size={14} />,
  history: <Landmark size={14} />,
  technology: <Cog size={14} />,
  architecture: <Building2 size={14} />,
  religion: <Church size={14} />,
  warfare: <Swords size={14} />,
  exploration: <Compass size={14} />,
  medicine: <HeartPulse size={14} />,
}

// 快速跳转时代预设
const ERA_PRESETS = [
  { label: '远古', range: [-4000, -500] as [number, number] },
  { label: '古典', range: [-500, 500] as [number, number] },
  { label: '中世纪', range: [500, 1400] as [number, number] },
  { label: '近现代', range: [1400, 2030] as [number, number] },
  { label: '全部', range: [-4000, 2030] as [number, number] },
]

interface FilterPanelProps {
  selectedCategories: Set<Category>
  toggleCategory: (cat: Category) => void
  selectedRegions: Set<Region>
  toggleRegion: (region: Region) => void
  yearRange: [number, number]
  setYearRange: (range: [number, number]) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  clearFilters: () => void
  filteredCount: number
  totalCount: number
  onMobileClose?: () => void
}

export function FilterPanel({
  selectedCategories, toggleCategory,
  selectedRegions, toggleRegion,
  yearRange, setYearRange,
  viewMode, setViewMode,
  searchQuery, setSearchQuery,
  clearFilters,
  filteredCount, totalCount,
  onMobileClose,
}: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedContinents, setExpandedContinents] = useState<Set<string>>(new Set(['东亚', '欧洲']))

  const toggleContinent = useCallback((name: string) => {
    setExpandedContinents(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  // 全选/反选某个大洲的所有地区
  const toggleContinentAll = useCallback((regions: Region[]) => {
    const allSelected = regions.every(r => selectedRegions.has(r))
    regions.forEach(r => {
      if (allSelected) {
        if (selectedRegions.has(r)) toggleRegion(r)
      } else {
        if (!selectedRegions.has(r)) toggleRegion(r)
      }
    })
  }, [selectedRegions, toggleRegion])

  if (collapsed) {
    return (
      <div className="w-12 flex-shrink-0 bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col items-center py-4 gap-3">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronRight size={16} />
        </button>
        <Separator className="w-6" />
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => toggleCategory(key as Category)}
            className="p-1.5 rounded-md transition-all duration-200"
            style={{
              backgroundColor: selectedCategories.has(key as Category) ? cfg.color + '30' : 'transparent',
              color: selectedCategories.has(key as Category) ? cfg.color : undefined,
            }}
            title={cfg.label}
          >
            {categoryIcons[key as Category]}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="w-72 flex-shrink-0 bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground">探索筛选</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filteredCount} / {totalCount} 条记录
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearFilters}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="重置筛选"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => {
              if (onMobileClose) onMobileClose()
              else setCollapsed(true)
            }}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索事件、人物..."
              className="pl-8 h-8 text-xs bg-background/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* View Mode — 3 modes */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">视图模式</p>
            <div className="flex gap-1 p-0.5 bg-muted/50 rounded-md">
              <Button
                variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="flex-1 h-7 text-xs gap-1"
              >
                <AlignJustify size={12} />
                时间线
              </Button>
              <Button
                variant={viewMode === 'matrix' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('matrix')}
                className="flex-1 h-7 text-xs gap-1"
              >
                <Grid3X3 size={12} />
                矩阵
              </Button>
              <Button
                variant={viewMode === 'stats' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('stats')}
                className="flex-1 h-7 text-xs gap-1"
              >
                <BarChart3 size={12} />
                统计
              </Button>
            </div>
          </div>

          {/* Year Range with Quick Presets */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">时间范围</p>
            {/* Quick jump buttons */}
            <div className="flex flex-wrap gap-1 mb-2">
              {ERA_PRESETS.map(preset => {
                const isActive = yearRange[0] === preset.range[0] && yearRange[1] === preset.range[1]
                return (
                  <button
                    key={preset.label}
                    onClick={() => setYearRange(preset.range)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
            <div className="px-1">
              <Slider
                min={-4000}
                max={2030}
                step={10}
                value={[yearRange[0], yearRange[1]]}
                onValueChange={(v) => setYearRange([v[0], v[1]])}
                className="mt-2"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">{formatYear(yearRange[0])}</span>
                <span className="text-[10px] text-muted-foreground">{formatYear(yearRange[1])}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">类目</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(([key, cfg]) => {
                const active = selectedCategories.has(key)
                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className="cursor-pointer text-xs h-7 px-2.5 gap-1.5 transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: active ? cfg.color + '20' : 'transparent',
                      borderColor: active ? cfg.color : undefined,
                      color: active ? cfg.color : undefined,
                    }}
                    onClick={() => toggleCategory(key)}
                  >
                    {categoryIcons[key]}
                    {cfg.label}
                  </Badge>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Regions - grouped by continent */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">国家/地区</p>
            <div className="space-y-1">
              {CONTINENT_GROUPS.map(group => {
                const isExpanded = expandedContinents.has(group.name)
                const selectedCount = group.regions.filter(r => selectedRegions.has(r)).length
                const allSelected = selectedCount === group.regions.length && selectedCount > 0
                return (
                  <div key={group.name} className="rounded-lg overflow-hidden">
                    {/* Continent header */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleContinent(group.name)}
                        className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors text-left"
                      >
                        {isExpanded ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground" />}
                        <span className="text-xs font-medium text-foreground">{group.name}</span>
                        {selectedCount > 0 && (
                          <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                            {selectedCount}
                          </span>
                        )}
                      </button>
                      {/* Select/Deselect all */}
                      <button
                        onClick={() => toggleContinentAll(group.regions)}
                        className="p-1 rounded-md hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
                        title={allSelected ? '取消全选' : '全选'}
                      >
                        {allSelected ? <CheckSquare size={12} /> : <Square size={12} />}
                      </button>
                    </div>
                    {/* Expanded regions */}
                    {isExpanded && (
                      <div className="flex flex-wrap gap-1 px-2 pb-2 pt-1">
                        {group.regions.map(key => {
                          const cfg = REGION_CONFIG[key]
                          const active = selectedRegions.has(key)
                          return (
                            <Badge
                              key={key}
                              variant="outline"
                              className="cursor-pointer text-xs h-6 px-2 gap-1 transition-all duration-200 hover:scale-105"
                              style={{
                                backgroundColor: active ? cfg.color + '20' : 'transparent',
                                borderColor: active ? cfg.color : undefined,
                                color: active ? cfg.color : undefined,
                              }}
                              onClick={() => toggleRegion(key)}
                            >
                              <span className="text-sm leading-none">{cfg.flag}</span>
                              {cfg.label}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
