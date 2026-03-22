import { CATEGORY_CONFIG, REGION_CONFIG } from '@/data/types'
import type { Category, Region } from '@/data/types'
import { ALL_REGIONS, CONTINENT_GROUPS } from '@/data/regions'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  BookOpen, FlaskConical, Music, Palette, Brain,
  Landmark, Cog, Building2, Search, X, RotateCcw,
  Grid3X3, AlignJustify, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, BarChart3, CheckSquare,
  Church, Swords, Compass, HeartPulse, Columns,
} from 'lucide-react'
import type { ViewMode } from '@/hooks/useTimelineState'
import { formatYear } from '@/data/types'
import { useState, useCallback, useEffect, useMemo } from 'react'

const TIMELINE_MIN_YEAR = -4000
const TIMELINE_MAX_YEAR = 2030
const POPULAR_SEARCHES = ['丝绸之路', '文艺复兴', '工业革命']

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

const ERA_PRESETS = [
  { label: '远古', range: [-4000, -500] as [number, number] },
  { label: '古典', range: [-500, 500] as [number, number] },
  { label: '中世纪', range: [500, 1400] as [number, number] },
  { label: '近现代', range: [1400, 2030] as [number, number] },
  { label: '全部', range: [-4000, 2030] as [number, number] },
]

const HIDDEN_REGIONS: Region[] = ['global']

interface FilterPanelProps {
  selectedCategories: Set<Category>
  toggleCategory: (cat: Category) => void
  selectedRegions: Set<Region>
  setSelectedRegions: (regions: Iterable<Region>) => void
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
  coreOnly: boolean
  setCoreOnly: (v: boolean) => void
  onMobileClose?: () => void
}

function clampYear(year: number) {
  return Math.min(TIMELINE_MAX_YEAR, Math.max(TIMELINE_MIN_YEAR, year))
}

export function FilterPanel({
  selectedCategories, toggleCategory,
  selectedRegions, setSelectedRegions, toggleRegion,
  yearRange, setYearRange,
  viewMode, setViewMode,
  searchQuery, setSearchQuery,
  clearFilters,
  filteredCount, totalCount,
  coreOnly, setCoreOnly,
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

  const toggleContinentAll = useCallback((regions: Region[]) => {
    const next = new Set(selectedRegions)
    const allSelected = regions.every(region => next.has(region))

    regions.forEach(region => {
      if (allSelected) next.delete(region)
      else next.add(region)
    })

    setSelectedRegions(next)
  }, [selectedRegions, setSelectedRegions])

  const visibleSelectedRegionCount = useMemo(
    () => ALL_REGIONS.filter(region => selectedRegions.has(region)).length,
    [selectedRegions]
  )

  const allRegionsSelected = visibleSelectedRegionCount === ALL_REGIONS.length && ALL_REGIONS.length > 0

  useEffect(() => {
    const visibleRegions = Array.from(selectedRegions).filter(region => !HIDDEN_REGIONS.includes(region))

    if (visibleRegions.length === selectedRegions.size) return

    setSelectedRegions(visibleRegions)
  }, [selectedRegions, setSelectedRegions])

  const toggleAllRegions = useCallback(() => {
    setSelectedRegions(allRegionsSelected ? [] : ALL_REGIONS)
  }, [allRegionsSelected, setSelectedRegions])

  const commitYearInput = useCallback((key: 'min' | 'max', rawValue: string) => {
    const fallbackValue = key === 'min' ? yearRange[0] : yearRange[1]
    const parsed = Number(rawValue.trim())
    const nextValue = Number.isFinite(parsed) ? clampYear(parsed) : fallbackValue

    if (key === 'min') {
      setYearRange([Math.min(nextValue, yearRange[1]), yearRange[1]])
    } else {
      setYearRange([yearRange[0], Math.max(nextValue, yearRange[0])])
    }
  }, [setYearRange, yearRange])

  if (collapsed) {
    return (
      <div className="w-12 flex-shrink-0 bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col items-center py-4 gap-3">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          aria-label="展开筛选面板"
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
              backgroundColor: selectedCategories.has(key as Category) ? `${cfg.color}30` : 'transparent',
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
    <div className="w-72 h-full min-h-0 flex-shrink-0 bg-card/50 backdrop-blur-sm border-r border-border/50 flex flex-col overflow-hidden">
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
            aria-label="重置筛选"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => {
              if (onMobileClose) onMobileClose()
              else setCollapsed(true)
            }}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label={onMobileClose ? '关闭移动端筛选面板' : '折叠筛选面板'}
          >
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="p-4 space-y-5">
          <div>
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
                  aria-label="清空搜索词"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map(keyword => (
                <button
                  key={keyword}
                  onClick={() => setSearchQuery(keyword)}
                  className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-foreground">只看核心事件</p>
              <p className="text-[10px] text-muted-foreground">隐藏衍生的背景 / 扩散 / 影响事件</p>
            </div>
            <button
              onClick={() => setCoreOnly(!coreOnly)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                coreOnly ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              aria-label={coreOnly ? '当前只看核心事件，点击可包含衍生事件' : '当前包含衍生事件，点击切回核心事件'}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                  coreOnly ? 'translate-x-[18px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">视图模式</p>
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-muted/50 rounded-md">
              <Button
                variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="h-7 text-xs gap-1"
              >
                <AlignJustify size={12} />
                时间线
              </Button>
              <Button
                variant={viewMode === 'matrix' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('matrix')}
                className="h-7 text-xs gap-1"
              >
                <Grid3X3 size={12} />
                矩阵
              </Button>
              <Button
                variant={viewMode === 'compare' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('compare')}
                className="h-7 text-xs gap-1"
              >
                <Columns size={12} />
                对照
              </Button>
              <Button
                variant={viewMode === 'stats' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('stats')}
                className="h-7 text-xs gap-1"
              >
                <BarChart3 size={12} />
                统计
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">时间范围</p>
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
                min={TIMELINE_MIN_YEAR}
                max={TIMELINE_MAX_YEAR}
                step={10}
                value={[yearRange[0], yearRange[1]]}
                onValueChange={(value) => setYearRange([value[0], value[1]])}
                className="mt-2"
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-muted-foreground">起始年份</label>
                  <Input
                    key={`year-min-${yearRange[0]}`}
                    defaultValue={yearRange[0]}
                    type="number"
                    onBlur={(event) => commitYearInput('min', event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitYearInput('min', event.currentTarget.value)
                    }}
                    className="h-8 bg-background/50 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-muted-foreground">结束年份</label>
                  <Input
                    key={`year-max-${yearRange[1]}`}
                    defaultValue={yearRange[1]}
                    type="number"
                    onBlur={(event) => commitYearInput('max', event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitYearInput('max', event.currentTarget.value)
                    }}
                    className="h-8 bg-background/50 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2 gap-3">
                <span className="text-[10px] text-muted-foreground">{formatYear(yearRange[0])}</span>
                <span className="text-[10px] text-muted-foreground text-right">{formatYear(yearRange[1])}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">类目</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(([key, cfg]) => {
                const active = selectedCategories.has(key)
                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className="cursor-pointer text-xs h-7 px-2.5 gap-1.5 transition-colors duration-200 hover:bg-accent/60"
                    style={{
                      backgroundColor: active ? `${cfg.color}20` : 'transparent',
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

          <div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">国家 / 地区</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  已选 {visibleSelectedRegionCount} / {ALL_REGIONS.length}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAllRegions}
                className="h-7 shrink-0 px-2 text-[10px]"
                title={allRegionsSelected ? '取消全选地区' : '全选地区'}
              >
                <CheckSquare size={12} />
                {allRegionsSelected ? '取消' : '全选'}
              </Button>
            </div>
            <div className="space-y-1.5">
              {CONTINENT_GROUPS.map(group => {
                const isExpanded = expandedContinents.has(group.name)
                const selectedCount = group.regions.filter(r => selectedRegions.has(r)).length
                const allSelected = selectedCount === group.regions.length && selectedCount > 0

                return (
                  <div key={group.name} className="rounded-lg overflow-hidden border border-border/40 bg-background/20">
                    <div className="flex items-center gap-1 px-1.5 py-1.5">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleContinentAll(group.regions)}
                        className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                        title={allSelected ? `取消全选 ${group.name}` : `全选 ${group.name}`}
                      >
                        <CheckSquare size={12} />
                        {allSelected ? '取消' : '全选'}
                      </Button>
                    </div>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-1 px-3 pb-3 pt-1">
                        {group.regions.map(key => {
                          const cfg = REGION_CONFIG[key]
                          const active = selectedRegions.has(key)
                          return (
                            <Badge
                              key={key}
                              variant="outline"
                              className="cursor-pointer text-xs h-6 px-2 gap-1 transition-colors duration-200 hover:bg-accent/60"
                              style={{
                                backgroundColor: active ? `${cfg.color}20` : 'transparent',
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
      </div>
    </div>
  )
}
