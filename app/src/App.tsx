import { FilterPanel } from '@/components/FilterPanel'
import { TimelineView } from '@/components/TimelineView'
import { EventDetail } from '@/components/EventDetail'
import { EraNavigator } from '@/components/EraNavigator'
import { ActiveFiltersBar } from '@/components/ActiveFiltersBar'
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp'
import { MobileTabBar } from '@/components/MobileTabBar'
import { DEFAULT_YEAR_RANGE, useTimelineState } from '@/hooks/useTimelineState'
import { useTheme } from '@/hooks/useTheme'
import { useIsMobile } from '@/hooks/use-mobile'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useFavorites } from '@/hooks/useFavorites'
import { useReadProgress, useAchievements } from '@/hooks/useProgress'
import { useExplorerMissions, type ExplorerMission } from '@/hooks/useExplorerMissions'
import { useRandomFact } from '@/lib/fun-facts'
import { downloadShareCard } from '@/lib/share-card'
import { ALL_REGIONS, getVisibleSelectedRegions } from '@/data/regions'
import { CATEGORY_CONFIG, REGION_CONFIG, ERAS, formatYear } from '@/data/types'
import type { HistoricalEvent, Category } from '@/data/types'
import { MilestoneTicker } from '@/components/MilestoneTicker'
import { Sparkles, Sun, Moon, PanelLeftOpen, Shuffle, CalendarDays, BookOpen, Brain, Heart, Users, Trophy, Clapperboard, Target, Swords, Puzzle, HelpCircle, ArrowUpDown, Grid3X3 } from 'lucide-react'
import { useState, useCallback, useRef, useEffect, useMemo, lazy, Suspense } from 'react'
import './App.css'

// 非核心视图和弹窗组件 lazy load（code-splitting）
const MatrixView = lazy(() => import('@/components/MatrixView').then(m => ({ default: m.MatrixView })))
const StatsView = lazy(() => import('@/components/StatsView').then(m => ({ default: m.StatsView })))
const CompareView = lazy(() => import('@/components/CompareView').then(m => ({ default: m.CompareView })))
const CivilizationMapView = lazy(() => import('@/components/CivilizationMapView').then(m => ({ default: m.CivilizationMapView })))
const WelcomeDialog = lazy(() => import('@/components/WelcomeDialog').then(m => ({ default: m.WelcomeDialog })))
const TodayInHistory = lazy(() => import('@/components/TodayInHistory').then(m => ({ default: m.TodayInHistory })))
const CuratedPaths = lazy(() => import('@/components/CuratedPaths').then(m => ({ default: m.CuratedPaths })))
const TimeWarpOverlay = lazy(() => import('@/components/TimeWarpOverlay').then(m => ({ default: m.TimeWarpOverlay })))
const HistoryQuiz = lazy(() => import('@/components/HistoryQuiz').then(m => ({ default: m.HistoryQuiz })))
const FavoritesPanel = lazy(() => import('@/components/FavoritesPanel').then(m => ({ default: m.FavoritesPanel })))
const AutoExplore = lazy(() => import('@/components/AutoExplore').then(m => ({ default: m.AutoExplore })))
const FigureGallery = lazy(() => import('@/components/FigureGallery').then(m => ({ default: m.FigureGallery })))
const ExplorerMissions = lazy(() => import('@/components/ExplorerMissions').then(m => ({ default: m.ExplorerMissions })))
const TimelineChallenge = lazy(() => import('@/components/TimelineChallenge').then(m => ({ default: m.TimelineChallenge })))
const AchievementsPanel = lazy(() => import('@/components/AchievementsPanel').then(m => ({ default: m.AchievementsPanel })))
const MemoryMatch = lazy(() => import('@/components/MemoryMatch').then(m => ({ default: m.MemoryMatch })))
const HistoryRiddle = lazy(() => import('@/components/HistoryRiddle').then(m => ({ default: m.HistoryRiddle })))
const TimelineSorter = lazy(() => import('@/components/TimelineSorter').then(m => ({ default: m.TimelineSorter })))
const ProgressHeatmap = lazy(() => import('@/components/ProgressHeatmap').then(m => ({ default: m.ProgressHeatmap })))

const WELCOME_STORAGE_KEY = 'chrono-atlas-welcome-dismissed'

function App() {
  const state = useTimelineState()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  const favs = useFavorites()
  const progress = useReadProgress()
  const achievements = useAchievements(progress.readIds, state.filteredEvents)
  const missions = useExplorerMissions(state.filteredEvents, progress.readIds)
  const randomFact = useRandomFact(state.filteredEvents)
  const passportEras = useMemo(() => ERAS.map(era => ({
    label: era.name,
    unlocked: state.filteredEvents.some(event =>
      progress.readIds.has(event.id) && event.year >= era.startYear && event.year < era.endYear
    ),
  })), [progress.readIds, state.filteredEvents])
  const passportCategories = useMemo(() => (Object.entries(CATEGORY_CONFIG) as Array<[Category, typeof CATEGORY_CONFIG[Category]]>).map(([category, config]) => ({
    label: config.label,
    tone: config.color,
    unlocked: state.filteredEvents.some(event => progress.readIds.has(event.id) && event.category === category),
  })), [progress.readIds, state.filteredEvents])

  // 自动标记已读：当用户打开事件详情时
  useEffect(() => {
    if (state.selectedEvent) {
      progress.markRead(state.selectedEvent.id)
    }
  }, [state.selectedEvent])

  // 全局键盘快捷键
  useKeyboardShortcuts({
    events: state.filteredEvents,
    selectedEvent: state.selectedEvent,
    setSelectedEvent: state.setSelectedEvent,
    setFocusYear: state.setFocusYear,
  })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showTodayInHistory, setShowTodayInHistory] = useState(false)
  const [showCuratedPaths, setShowCuratedPaths] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showMissions, setShowMissions] = useState(false)
  const [showTimelineChallenge, setShowTimelineChallenge] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showAutoExplore, setShowAutoExplore] = useState(false)
  const [showFigureGallery, setShowFigureGallery] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showMemoryMatch, setShowMemoryMatch] = useState(false)
  const [showHistoryRiddle, setShowHistoryRiddle] = useState(false)
  const [showTimelineSorter, setShowTimelineSorter] = useState(false)
  const [showProgressHeatmap, setShowProgressHeatmap] = useState(false)
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      if (typeof window === 'undefined') return false
      return !window.localStorage.getItem(WELCOME_STORAGE_KEY)
    } catch { return false }
  })

  // 穿越动画状态
  const [warpActive, setWarpActive] = useState(false)
  const [warpTarget, setWarpTarget] = useState<HistoricalEvent | null>(null)
  const warpTargetRef = useRef<HistoricalEvent | null>(null)

  const dismissWelcome = () => {
    try { window.localStorage.setItem(WELCOME_STORAGE_KEY, '1') } catch {}
    setShowWelcome(false)
  }

  /** 增强版穿越：尊重当前筛选条件 + 播放时空隧道动画 */
  const handleRandomExplore = useCallback(() => {
    const events = state.filteredEvents
    if (events.length === 0) return
    const idx = Math.floor(Math.random() * events.length)
    const target = events[idx]
    dismissWelcome()

    // 启动穿越动画
    warpTargetRef.current = target
    setWarpTarget(target)
    setWarpActive(true)
  }, [state.filteredEvents])

  /** 穿越动画结束回调 — openDetail=true 时打开事件详情 */
  const handleWarpComplete = useCallback((openDetail?: boolean) => {
    setWarpActive(false)
    if (openDetail && warpTargetRef.current) {
      state.setSelectedEvent(warpTargetRef.current)
    }
  }, [state.setSelectedEvent])

  /** 矩阵下钻：切换到时间线视图 + 设置时代年份范围 + 设置类目筛选 */
  const handleMatrixDrillDown = useCallback((eraName: string, category: Category) => {
    const era = ERAS.find(e => e.name === eraName)
    state.clearFilters()
    if (era) {
      state.setYearRange([era.startYear, era.endYear])
    }
    state.toggleCategory(category)
    state.setViewMode('timeline')
  }, [state.clearFilters, state.setYearRange, state.toggleCategory, state.setViewMode])

  /** StatsView 下钻：设置年份范围 + 可选类目 → 切到时间线 */
  const handleStatsDrillDown = useCallback((yearRange: [number, number], category?: Category) => {
    state.clearFilters()
    state.setYearRange(yearRange)
    if (category) state.toggleCategory(category)
    state.setViewMode('timeline')
  }, [state.clearFilters, state.setYearRange, state.toggleCategory, state.setViewMode])

  /** 搜索跳转（词云点击） */
  const handleSearchJump = useCallback((query: string) => {
    state.setSearchQuery(query)
    state.setViewMode('timeline')
  }, [state.setSearchQuery, state.setViewMode])

  const handleApplyMission = useCallback((mission: ExplorerMission) => {
    dismissWelcome()
    setShowMissions(false)
    state.clearFilters()
    state.setViewMode('timeline')

    if (mission.payload.type === 'era') {
      state.setYearRange(mission.payload.yearRange)
      state.setFocusYear(mission.payload.yearRange[0])
      state.setSelectedEvent(null)
      return
    }

    if (mission.payload.type === 'category') {
      state.toggleCategory(mission.payload.category)
      state.setSelectedEvent(null)
      return
    }

    const payload = mission.payload
    if (payload.type !== 'chain') return
    state.setSearchQuery(payload.search)
    state.setFocusYear(payload.focusYear)
    const anchorEvent = state.filteredEvents.find(event => event.id === payload.anchorId) || null
    state.setSelectedEvent(anchorEvent)
  }, [state.clearFilters, state.filteredEvents, state.setFocusYear, state.setSearchQuery, state.setSelectedEvent, state.setViewMode, state.setYearRange, state.toggleCategory])

  const activeFilters: Array<{ id: string; label: string; onRemove: () => void }> = []
  const visibleSelectedRegions = getVisibleSelectedRegions(state.selectedRegions)
  const hasSpecificRegionFilter = visibleSelectedRegions.length > 0 && visibleSelectedRegions.length < ALL_REGIONS.length

  if (state.searchQuery.trim()) {
    activeFilters.push({
      id: 'search',
      label: `搜索：${state.searchQuery.trim()}`,
      onRemove: () => state.setSearchQuery(''),
    })
  }

  if (state.yearRange[0] !== DEFAULT_YEAR_RANGE[0] || state.yearRange[1] !== DEFAULT_YEAR_RANGE[1]) {
    activeFilters.push({
      id: 'year-range',
      label: `时间：${formatYear(state.yearRange[0])} 至 ${formatYear(state.yearRange[1])}`,
      onRemove: () => state.setYearRange(DEFAULT_YEAR_RANGE),
    })
  }

  Array.from(state.selectedCategories).forEach((category) => {
    activeFilters.push({
      id: `cat-${category}`,
      label: CATEGORY_CONFIG[category].label,
      onRemove: () => state.toggleCategory(category),
    })
  })

  if (hasSpecificRegionFilter) {
    visibleSelectedRegions.forEach((region) => {
      activeFilters.push({
        id: `reg-${region}`,
        label: REGION_CONFIG[region].label,
        onRemove: () => state.toggleRegion(region),
      })
    })
  }

  if (!state.coreOnly) {
    activeFilters.push({
      id: 'core-only',
      label: '包含衍生事件',
      onRemove: () => state.setCoreOnly(true),
    })
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="h-14 flex-shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-md flex items-center justify-between px-4 md:px-5">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground md:hidden"
              aria-label="打开筛选侧栏"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <img src="/logo.svg" alt="Chrono Atlas" className="w-8 h-8 flex-shrink-0 drop-shadow-lg" />
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-foreground tracking-tight truncate">Chrono Atlas</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">人类文明时间线</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => {
              dismissWelcome()
              setShowTodayInHistory(true)
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20
              text-amber-600 dark:text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20
              transition-all duration-200 hover:shadow-sm"
            title="历史上的今天"
          >
            <CalendarDays size={14} />
            <span className="hidden sm:inline">今天</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowCuratedPaths(true)
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20
              text-emerald-600 dark:text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20
              transition-all duration-200 hover:shadow-sm"
            title="策展路线"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">路线</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowQuiz(true)
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20
              text-pink-600 dark:text-pink-400 hover:from-pink-500/20 hover:to-rose-500/20
              transition-all duration-200 hover:shadow-sm"
            title="历史知识测验"
          >
            <Brain size={14} />
            <span className="hidden sm:inline">测验</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowMemoryMatch(true)
            }}
            className="items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20
              text-teal-600 dark:text-teal-400 hover:from-teal-500/20 hover:to-cyan-500/20
              transition-all duration-200 hover:shadow-sm hidden md:flex"
            title="历史连连看"
          >
            <Puzzle size={14} />
            <span className="hidden lg:inline">连连看</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowHistoryRiddle(true)
            }}
            className="items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20
              text-violet-600 dark:text-violet-400 hover:from-violet-500/20 hover:to-fuchsia-500/20
              transition-all duration-200 hover:shadow-sm hidden md:flex"
            title="历史猜谜"
          >
            <HelpCircle size={14} />
            <span className="hidden lg:inline">猜谜</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowTimelineSorter(true)
            }}
            className="items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20
              text-orange-600 dark:text-orange-400 hover:from-orange-500/20 hover:to-amber-500/20
              transition-all duration-200 hover:shadow-sm hidden md:flex"
            title="历史排序挑战"
          >
            <ArrowUpDown size={14} />
            <span className="hidden lg:inline">排序</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowMissions(true)
            }}
            className="items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20
              text-amber-600 dark:text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20
              transition-all duration-200 hover:shadow-sm hidden md:flex"
            title="今日文明挑战"
            data-testid="open-missions"
          >
            <Target size={14} />
            <span className="hidden lg:inline">挑战</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowTimelineChallenge(true)
            }}
            className="items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20
              text-violet-600 dark:text-violet-400 hover:from-violet-500/20 hover:to-indigo-500/20
              transition-all duration-200 hover:shadow-sm hidden md:flex"
            title="时间对决"
            data-testid="open-timeline-challenge"
          >
            <Swords size={14} />
            <span className="hidden lg:inline">对决</span>
          </button>

          <button
            onClick={() => {
              dismissWelcome()
              setShowFavorites(true)
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20
              text-rose-600 dark:text-rose-400 hover:from-rose-500/20 hover:to-red-500/20
              transition-all duration-200 hover:shadow-sm relative"
            title="我的收藏"
          >
            <Heart size={14} />
            <span className="hidden sm:inline">收藏</span>
            {favs.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                {favs.count > 99 ? '99+' : favs.count}
              </span>
            )}
          </button>

          <button
            onClick={() => { dismissWelcome(); setShowFigureGallery(true) }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20
              text-indigo-600 dark:text-indigo-400 hover:from-indigo-500/20 hover:to-blue-500/20
              transition-all duration-200 hover:shadow-sm hidden md:flex"
            title="历史人物图鉴"
          >
            <Users size={14} />
            <span className="hidden lg:inline">人物</span>
          </button>

          <button
            onClick={() => { dismissWelcome(); setShowAutoExplore(true) }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20
              text-cyan-600 dark:text-cyan-400 hover:from-cyan-500/20 hover:to-teal-500/20
              transition-all duration-200 hover:shadow-sm hidden md:flex"
            title="连续穿越（自动探索）"
          >
            <Clapperboard size={14} />
            <span className="hidden lg:inline">漫游</span>
          </button>

          <button
            onClick={() => { dismissWelcome(); setShowAchievements(true) }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20
              text-amber-600 dark:text-amber-400 hover:from-amber-500/20 hover:to-yellow-500/20
              transition-all duration-200 hover:shadow-sm relative hidden md:flex"
            title="文明成就"
          >
            <Trophy size={14} />
            <span className="hidden lg:inline">成就</span>
            {achievements.unlockedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                {achievements.unlockedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { dismissWelcome(); setShowProgressHeatmap(true) }}
            className="items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20
              text-emerald-600 dark:text-emerald-400 hover:from-emerald-500/20 hover:to-green-500/20
              transition-all duration-200 hover:shadow-sm hidden lg:flex"
            title="探索热力图"
          >
            <Grid3X3 size={14} />
          </button>

          <button
            onClick={handleRandomExplore}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20
              text-violet-600 dark:text-violet-400 hover:from-violet-500/20 hover:to-purple-500/20
              transition-all duration-200 hover:shadow-sm"
            title="随机穿越"
          >
            <Shuffle size={14} />
            <span className="hidden sm:inline">穿越</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-amber-500" />
            <span>
              <strong className="text-foreground">{state.filteredEvents.length}</strong>
              <span className="mx-1">/</span>
              <strong className="text-foreground">{state.totalEvents}</strong>
              <span className="ml-1">条历史事件</span>
            </span>
            {state.isLoading && (
              <span className="text-[10px] text-primary">同步中…</span>
            )}
          </div>

          {/* 冷知识提示 — 桌面端 */}
          {randomFact && !state.isLoading && (
            <div className="hidden xl:flex items-center gap-1.5 max-w-[280px]" title={randomFact.text}>
              <span className="text-sm flex-shrink-0">{randomFact.emoji}</span>
              <span className="text-[10px] text-muted-foreground/70 truncate">{randomFact.text}</span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <MilestoneTicker events={state.filteredEvents} onSelectEvent={(event) => { dismissWelcome(); state.setSelectedEvent(event) }} />

      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {isMobile && mobileMenuOpen && (
          <div
            className="absolute inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className={`h-full min-h-0
          ${isMobile
            ? `absolute left-0 top-0 bottom-0 z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : ''
          }
        `}>
          <FilterPanel
            selectedCategories={state.selectedCategories}
            toggleCategory={state.toggleCategory}
            selectedRegions={state.selectedRegions}
            setSelectedRegions={state.setSelectedRegions}
            toggleRegion={state.toggleRegion}
            yearRange={state.yearRange}
            setYearRange={state.setYearRange}
            viewMode={state.viewMode}
            setViewMode={state.setViewMode}
            searchQuery={state.searchQuery}
            setSearchQuery={state.setSearchQuery}
            clearFilters={state.clearFilters}
            filteredCount={state.filteredEvents.length}
            totalCount={state.totalEvents}
            coreOnly={state.coreOnly}
            setCoreOnly={state.setCoreOnly}
            onMobileClose={isMobile ? () => setMobileMenuOpen(false) : undefined}
            events={state.filteredEvents}
            onSelectEvent={state.setSelectedEvent}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {state.error && (
            <div className="mx-4 mt-4 px-3 py-2 rounded-lg border border-destructive/30 bg-destructive/5 text-xs text-destructive">
              {state.error}
            </div>
          )}

          <ActiveFiltersBar
            filters={activeFilters}
            resultCount={state.filteredEvents.length}
            onClearAll={state.clearFilters}
          />

          <div key={state.viewMode} className="flex-1 min-h-0 flex flex-col view-transition-enter">
            <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">加载中…</div>}>
            {state.viewMode === 'timeline' ? (
              <TimelineView
                events={state.filteredEvents}
                selectedEvent={state.selectedEvent}
                onSelectEvent={state.setSelectedEvent}
                focusYear={state.focusYear}
                favoriteIds={favs.favorites}
                onToggleFavorite={favs.toggleFavorite}
              />
            ) : state.viewMode === 'matrix' ? (
              <MatrixView
                events={state.filteredEvents}
                selectedEvent={state.selectedEvent}
                onSelectEvent={state.setSelectedEvent}
                onDrillDown={handleMatrixDrillDown}
              />
            ) : state.viewMode === 'compare' ? (
              <CompareView
                events={state.filteredEvents}
                onSelectEvent={state.setSelectedEvent}
              />
            ) : state.viewMode === 'civilizations' ? (
              <CivilizationMapView
                events={state.filteredEvents}
                onSelectEvent={state.setSelectedEvent}
              />
            ) : (
              <StatsView
                events={state.filteredEvents}
                onSelectEvent={state.setSelectedEvent}
                onSearch={handleSearchJump}
                onDrillDown={handleStatsDrillDown}
              />
            )}
            </Suspense>
          </div>

          {state.viewMode === 'timeline' && (
            <EraNavigator
              events={state.filteredEvents}
              onSelectYear={state.setFocusYear}
            />
          )}

          {isMobile && (
            <MobileTabBar
              viewMode={state.viewMode}
              setViewMode={state.setViewMode}
            />
          )}
        </div>
      </div>

      <EventDetail
        event={state.selectedEvent}
        events={state.filteredEvents}
        onClose={() => state.setSelectedEvent(null)}
        onNavigate={(event) => state.setSelectedEvent(event)}
        isFavorite={state.selectedEvent ? favs.isFavorite(state.selectedEvent.id) : false}
        onToggleFavorite={state.selectedEvent ? () => favs.toggleFavorite(state.selectedEvent!.id) : undefined}
        onShare={state.selectedEvent ? () => downloadShareCard(state.selectedEvent!) : undefined}
        readIds={progress.readIds}
      />

      <KeyboardShortcutsHelp />

      <Suspense fallback={null}>
      <TodayInHistory
        open={showTodayInHistory}
        onClose={() => setShowTodayInHistory(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowTodayInHistory(false)
        }}
      />

      <WelcomeDialog
        open={showWelcome}
        totalEvents={state.totalEvents}
        onClose={dismissWelcome}
        onStartExplore={dismissWelcome}
        onOpenToday={() => {
          dismissWelcome()
          setShowTodayInHistory(true)
        }}
        onRandomExplore={handleRandomExplore}
      />

      <CuratedPaths
        open={showCuratedPaths}
        onClose={() => setShowCuratedPaths(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowCuratedPaths(false)
        }}
      />

      <TimeWarpOverlay
        active={warpActive}
        targetEvent={warpTarget}
        allEvents={state.filteredEvents}
        onComplete={handleWarpComplete}
      />

      <HistoryQuiz
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowQuiz(false)
        }}
      />

      <ExplorerMissions
        open={showMissions}
        onClose={() => setShowMissions(false)}
        missions={missions}
        onApplyMission={handleApplyMission}
      />

      <TimelineChallenge
        open={showTimelineChallenge}
        onClose={() => setShowTimelineChallenge(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowTimelineChallenge(false)
        }}
      />

      <FavoritesPanel
        open={showFavorites}
        onClose={() => setShowFavorites(false)}
        events={state.filteredEvents}
        favoriteIds={favs.favorites}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowFavorites(false)
        }}
        onToggleFavorite={favs.toggleFavorite}
        onClearAll={favs.clearAll}
      />

      <AutoExplore
        open={showAutoExplore}
        onClose={() => setShowAutoExplore(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowAutoExplore(false)
        }}
      />

      <FigureGallery
        open={showFigureGallery}
        onClose={() => setShowFigureGallery(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowFigureGallery(false)
        }}
      />

      <AchievementsPanel
        open={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlocked={achievements.unlocked}
        locked={achievements.locked}
        readCount={progress.readCount}
        totalEvents={state.totalEvents}
        passportEras={passportEras}
        passportCategories={passportCategories}
        nextUnlocks={achievements.locked.slice(0, 3)}
      />

      <MemoryMatch
        open={showMemoryMatch}
        onClose={() => setShowMemoryMatch(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowMemoryMatch(false)
        }}
      />

      <HistoryRiddle
        open={showHistoryRiddle}
        onClose={() => setShowHistoryRiddle(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowHistoryRiddle(false)
        }}
      />

      <TimelineSorter
        open={showTimelineSorter}
        onClose={() => setShowTimelineSorter(false)}
        events={state.filteredEvents}
        onSelectEvent={(event) => {
          state.setSelectedEvent(event)
          setShowTimelineSorter(false)
        }}
      />

      <ProgressHeatmap
        open={showProgressHeatmap}
        onClose={() => setShowProgressHeatmap(false)}
        events={state.filteredEvents}
        readIds={progress.readIds}
      />
      </Suspense>
    </div>
  )
}

export default App
