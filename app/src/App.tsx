import { FilterPanel } from '@/components/FilterPanel'
import { TimelineView } from '@/components/TimelineView'
import { EventDetail } from '@/components/EventDetail'
import { EraNavigator } from '@/components/EraNavigator'
import { ActiveFiltersBar } from '@/components/ActiveFiltersBar'
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp'
import { MobileTabBar } from '@/components/MobileTabBar'
import { LoadingSkeletonWithTransition } from '@/components/LoadingSkeleton'
import { OnboardingGuide } from '@/components/OnboardingGuide'
import { AuthModal } from '@/components/AuthModal'
import { AchievementToastContainer, showAchievementToast } from '@/components/AchievementToast'
import { DailyCheckin } from '@/components/DailyCheckin'
import { useAuth } from '@/contexts/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { DEFAULT_YEAR_RANGE, useTimelineState } from '@/hooks/useTimelineState'
import { useTheme } from '@/hooks/useTheme'
import { useIsMobile } from '@/hooks/use-mobile'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useFavorites } from '@/hooks/useFavorites'
import { useReadProgress, useAchievements } from '@/hooks/useProgress'
import { useExplorerMissions, type ExplorerMission } from '@/hooks/useExplorerMissions'
import { useUserProfile, getPersonalizedSuggestions } from '@/hooks/useUserProfile'
import { useRandomFact } from '@/lib/fun-facts'
import { shareEvent } from '@/lib/share-card'
import { syncMergeAll } from '@/lib/api'
import { ALL_REGIONS, getVisibleSelectedRegions } from '@/data/regions'
import { CATEGORY_CONFIG, REGION_CONFIG, ERAS, formatYear } from '@/data/types'
import type { HistoricalEvent, Category } from '@/data/types'
import { MilestoneTicker } from '@/components/MilestoneTicker'
import { AIChatPanel } from '@/components/AIChatPanel'
import { MobileQuickActions } from '@/components/MobileQuickActions'
import { Sparkles, Sun, Moon, PanelLeftOpen, Shuffle, CalendarDays, BookOpen, Brain, Heart, Users, Trophy, Clapperboard, Target, Swords, Puzzle, HelpCircle, ArrowUpDown, Grid3X3, BarChart3, LogIn, LogOut, User, Mail } from 'lucide-react'
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
const AnnualReport = lazy(() => import('@/components/AnnualReport').then(m => ({ default: m.AnnualReport })))
const Leaderboard = lazy(() => import('@/components/Leaderboard').then(m => ({ default: m.Leaderboard })))

const WELCOME_STORAGE_KEY = 'chrono-atlas-welcome-dismissed'

function App() {
  const state = useTimelineState()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  const favs = useFavorites()
  const progress = useReadProgress()
  const auth = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const achievements = useAchievements(progress.readIds, state.filteredEvents)

  // ── 登录后数据同步：把 localStorage 数据合并到服务端，并用服务端返回的合并结果覆盖本地 ──
  const syncedRef = useRef(false)
  useEffect(() => {
    if (!auth.user || !auth.token) {
      syncedRef.current = false
      // 登出时清除 token，停止增量同步
      favs.setToken(null)
      progress.setToken(null)
      return
    }
    if (syncedRef.current) return
    syncedRef.current = true

    // 收集本地数据（在启用增量同步之前做快照，避免竞态）
    const localFavorites = Array.from(favs.favorites)
    const localReadEvents = Array.from(progress.readIds)

    let localGameRecords: Record<string, { score: number; total: number; time?: number; combo?: number; date: string }> = {}
    try {
      const raw = localStorage.getItem('chrono-atlas-game-records')
      if (raw) localGameRecords = JSON.parse(raw)
    } catch {}

    // 一次性合并
    const token = auth.token
    syncMergeAll({
      favorites: localFavorites,
      readEvents: localReadEvents,
      gameRecords: localGameRecords,
    }).then(merged => {
      // 用服务端合并后的数据覆盖本地
      favs.setFavoritesFromServer(merged.favorites)
      progress.setReadIdsFromServer(merged.readEvents)

      // 合并游戏记录到 localStorage
      if (merged.gameRecords) {
        try {
          const existing = JSON.parse(localStorage.getItem('chrono-atlas-game-records') || '{}')
          const updated = { ...existing, ...merged.gameRecords }
          localStorage.setItem('chrono-atlas-game-records', JSON.stringify(updated))
        } catch {}
      }

      // 合并完成后才启用增量同步，避免 merge response 覆盖用户中途操作
      favs.setToken(token)
      progress.setToken(token)
    }).catch(() => {
      // 合并失败：重置标记以便后续可重试，但仍启用增量同步
      syncedRef.current = false
      favs.setToken(token)
      progress.setToken(token)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // 仅在登录状态变化时触发，favs/progress 回调引用稳定
  }, [auth.user, auth.token])

  // 成就解锁检测 — 新解锁时弹出庆祝 toast
  const prevUnlockedRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (achievements.unlocked.length === 0) return
    const currentIds = new Set(achievements.unlocked.map(a => a.id))
    if (prevUnlockedRef.current.size > 0) {
      for (const a of achievements.unlocked) {
        if (!prevUnlockedRef.current.has(a.id)) {
          showAchievementToast({ id: a.id, emoji: a.emoji, title: a.title })
        }
      }
    }
    prevUnlockedRef.current = currentIds
  }, [achievements.unlocked])

  const missions = useExplorerMissions(state.filteredEvents, progress.readIds)
  const userProfile = useUserProfile(progress.readIds, state.filteredEvents)
  const aiSuggestions = useMemo(() => getPersonalizedSuggestions(userProfile), [userProfile])
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
  }, [state.selectedEvent, progress.markRead])

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
  const [showAnnualReport, setShowAnnualReport] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // ── P0 弹窗单例策略：打开新弹窗时关闭所有其他弹窗 ──
  const closeAllModals = useCallback(() => {
    setShowTodayInHistory(false)
    setShowCuratedPaths(false)
    setShowQuiz(false)
    setShowMissions(false)
    setShowTimelineChallenge(false)
    setShowFavorites(false)
    setShowAutoExplore(false)
    setShowFigureGallery(false)
    setShowAchievements(false)
    setShowMemoryMatch(false)
    setShowHistoryRiddle(false)
    setShowTimelineSorter(false)
    setShowProgressHeatmap(false)
    setShowAnnualReport(false)
    setShowLeaderboard(false)
  }, [])
  const openModal = useCallback((setter: (v: boolean) => void) => {
    closeAllModals()
    dismissWelcome()
    setter(true)
  }, [closeAllModals])

  // ── P1 事件详情 URL 深链接 ──
  // 打开事件时同步 hash
  useEffect(() => {
    if (state.selectedEvent) {
      window.history.replaceState(null, '', `#event=${state.selectedEvent.id}`)
    } else {
      if (window.location.hash.startsWith('#event=')) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [state.selectedEvent])

  // 从 URL hash 恢复事件（仅首次加载时触发一次）
  const hashRestoredRef = useRef(false)
  useEffect(() => {
    if (hashRestoredRef.current) return
    const hash = window.location.hash
    if (hash.startsWith('#event=') && state.filteredEvents.length > 0) {
      const eventId = hash.slice(7)
      const event = state.filteredEvents.find(e => e.id === eventId)
      if (event) {
        state.setSelectedEvent(event)
      }
      hashRestoredRef.current = true
    }
  }, [state.filteredEvents, state.setSelectedEvent])

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

  // ── 全站登录拦截 ──
  if (auth.isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground">
        <img src="/logo.svg" alt="Chrono Atlas" className="w-12 h-12 mb-4 loading-logo-pulse" />
        <p className="text-sm text-muted-foreground">验证登录状态...</p>
      </div>
    )
  }

  if (!auth.user) {
    return <LoginGate />
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <header className="h-14 flex-shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-md flex items-center justify-between px-4 md:px-5 relative z-40">
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

        <div className="flex items-center gap-1.5 md:gap-2">
          {/* ── 移动端：只保留主题切换 + 汉堡菜单（其他功能在汉堡抽屉/底部 Tab 里） ── */}
          {isMobile ? (
            <>
              <button
                onClick={() => openModal(setShowTodayInHistory)}
                className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="历史上的今天"
                aria-label="历史上的今天"
              >
                <CalendarDays size={18} />
              </button>
              <button
                onClick={() => openModal(setShowFavorites)}
                className="relative p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="我的收藏"
                aria-label="我的收藏"
              >
                <Heart size={18} />
                {favs.count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                    {favs.count > 99 ? '99+' : favs.count}
                  </span>
                )}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title={theme === 'dark' ? '亮色' : '暗色'} aria-label="主题切换">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {/* 用户头像 / 登录按钮（移动端） */}
              {auth.user ? (
                <button onClick={() => auth.logout()} className="p-1.5 rounded-full hover:bg-accent transition-colors" title={`${auth.user.nickname}（点击退出）`}>
                  {auth.user.avatar ? (
                    <img src={auth.user.avatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center text-[10px] font-bold">{auth.user.nickname[0]}</div>
                  )}
                </button>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="登录" aria-label="登录">
                  <LogIn size={18} />
                </button>
              )}
            </>
          ) : (
            <>
          {/* ── 一级入口：今天 / 路线 / 穿越 / 收藏 ── */}
          <button onClick={() => openModal(setShowTodayInHistory)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-200 hover:shadow-sm" title="历史上的今天">
            <CalendarDays size={14} /><span className="hidden sm:inline">今天</span>
          </button>
          <button onClick={() => openModal(setShowCuratedPaths)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-200 hover:shadow-sm" title="策展路线">
            <BookOpen size={14} /><span className="hidden sm:inline">路线</span>
          </button>
          <button onClick={handleRandomExplore} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-200 hover:shadow-sm" title="随机穿越">
            <Shuffle size={14} /><span className="hidden sm:inline">穿越</span>
          </button>
          <button onClick={() => openModal(setShowFavorites)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:from-rose-500/20 hover:to-red-500/20 transition-all duration-200 hover:shadow-sm relative" title="我的收藏">
            <Heart size={14} /><span className="hidden sm:inline">收藏</span>
            {/* layout-lint-ignore-next-line negative-offset-clipping-risk */}
            {favs.count > 0 && (<span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center px-1">{favs.count > 99 ? '99+' : favs.count}</span>)}
          </button>

          {/* ── 🎮 互动下拉菜单（6 个游戏） ── */}
          <NavDropdown
            icon={<Brain size={14} />}
            label="互动"
            gradientFrom="from-pink-500/10"
            gradientTo="to-rose-500/10"
            borderColor="border-pink-500/20"
            textColor="text-pink-600 dark:text-pink-400"
            items={[
              { icon: <Brain size={14} />, label: '知识测验', onClick: () => openModal(setShowQuiz) },
              { icon: <Puzzle size={14} />, label: '连连看', onClick: () => openModal(setShowMemoryMatch) },
              { icon: <HelpCircle size={14} />, label: '猜谜', onClick: () => openModal(setShowHistoryRiddle) },
              { icon: <ArrowUpDown size={14} />, label: '排序挑战', onClick: () => openModal(setShowTimelineSorter) },
              { icon: <Target size={14} />, label: '今日挑战', onClick: () => openModal(setShowMissions), testId: 'open-missions' },
              { icon: <Swords size={14} />, label: '时间对决', onClick: () => openModal(setShowTimelineChallenge), testId: 'open-timeline-challenge' },
            ]}
          />

          {/* ── 📚 更多下拉菜单（5 个工具） ── */}
          <NavDropdown
            icon={<Sparkles size={14} />}
            label="更多"
            gradientFrom="from-indigo-500/10"
            gradientTo="to-blue-500/10"
            borderColor="border-indigo-500/20"
            textColor="text-indigo-600 dark:text-indigo-400"
            items={[
              { icon: <Users size={14} />, label: '人物图鉴', onClick: () => openModal(setShowFigureGallery) },
              { icon: <Clapperboard size={14} />, label: '连续漫游', onClick: () => openModal(setShowAutoExplore) },
              { icon: <Trophy size={14} />, label: `成就${achievements.unlockedCount > 0 ? ` (${achievements.unlockedCount})` : ''}`, onClick: () => openModal(setShowAchievements) },
              { icon: <Grid3X3 size={14} />, label: '探索热力图', onClick: () => openModal(setShowProgressHeatmap) },
              { icon: <BarChart3 size={14} />, label: '探索报告', onClick: () => openModal(setShowAnnualReport) },
              { icon: <Trophy size={14} />, label: '周排行榜', onClick: () => openModal(setShowLeaderboard) },
            ]}
          />

          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-amber-500" />
            <span>
              <strong className="text-foreground">{state.filteredEvents.length}</strong>
              <span className="mx-1">/</span>
              <strong className="text-foreground">{state.totalEvents}</strong>
              <span className="ml-1 hidden lg:inline">条历史事件</span>
            </span>
            {state.isLoading && (<span className="text-[10px] text-primary">同步中…</span>)}
          </div>

          {randomFact && !state.isLoading && (
            <div className="hidden xl:flex items-center gap-1.5 max-w-[240px]" title={randomFact.text}>
              <span className="text-sm flex-shrink-0">{randomFact.emoji}</span>
              <span className="text-[10px] text-muted-foreground/70 truncate">{randomFact.text}</span>
            </div>
          )}

          <DailyCheckin />

          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'} aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* 用户头像 / 登录按钮（桌面端） */}
          {auth.user ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-border/30 ml-0.5">
              {auth.user.avatar ? (
                <img src={auth.user.avatar} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center text-xs font-bold">{auth.user.nickname[0]}</div>
              )}
              <span className="text-xs text-muted-foreground hidden lg:inline max-w-[80px] truncate">{auth.user.nickname}</span>
              <button onClick={() => auth.logout()} className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="退出登录">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-200 hover:shadow-sm" title="登录">
              <User size={14} /><span className="hidden sm:inline">登录</span>
            </button>
          )}
            </>
          )}
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
            mobileExtra={isMobile ? (
              <MobileQuickActions
                unlockedAchievements={achievements.unlockedCount}
                onPath={() => { setMobileMenuOpen(false); openModal(setShowCuratedPaths) }}
                onRandom={() => { setMobileMenuOpen(false); handleRandomExplore() }}
                onQuiz={() => { setMobileMenuOpen(false); openModal(setShowQuiz) }}
                onMemory={() => { setMobileMenuOpen(false); openModal(setShowMemoryMatch) }}
                onRiddle={() => { setMobileMenuOpen(false); openModal(setShowHistoryRiddle) }}
                onSorter={() => { setMobileMenuOpen(false); openModal(setShowTimelineSorter) }}
                onMissions={() => { setMobileMenuOpen(false); openModal(setShowMissions) }}
                onChallenge={() => { setMobileMenuOpen(false); openModal(setShowTimelineChallenge) }}
                onFigures={() => { setMobileMenuOpen(false); openModal(setShowFigureGallery) }}
                onAutoExplore={() => { setMobileMenuOpen(false); openModal(setShowAutoExplore) }}
                onAchievements={() => { setMobileMenuOpen(false); openModal(setShowAchievements) }}
                onProgressHeatmap={() => { setMobileMenuOpen(false); openModal(setShowProgressHeatmap) }}
                onAnnualReport={() => { setMobileMenuOpen(false); openModal(setShowAnnualReport) }}
              />
            ) : undefined}
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

          {state.viewMode === 'timeline' && (
            <OnboardingGuide
              onAction={(cardId) => {
                if (cardId === 0) openModal(setShowCuratedPaths)
                else if (cardId === 1) openModal(setShowProgressHeatmap)
                else if (cardId === 2) openModal(setShowQuiz)
              }}
            />
          )}

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
        onToggleFavorite={state.selectedEvent ? (() => { const id = state.selectedEvent?.id; if (id) favs.toggleFavorite(id) }) : undefined}
        onShare={state.selectedEvent ? (() => { const e = state.selectedEvent; if (e) shareEvent(e) }) : undefined}
        readIds={progress.readIds}
        onFigureClick={(figure) => {
          state.setSelectedEvent(null)
          openModal(setShowFigureGallery)
          // 延迟设置搜索以确保 gallery 打开后能聚焦
          setTimeout(() => {
            const input = document.querySelector<HTMLInputElement>('[data-figure-search]')
            if (input) { input.value = figure; input.dispatchEvent(new Event('input', { bubbles: true })) }
          }, 300)
        }}
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
        preferredCategories={userProfile.topCategories}
        readIds={progress.readIds}
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

      <AnnualReport
        open={showAnnualReport}
        onClose={() => setShowAnnualReport(false)}
        events={state.filteredEvents}
        readIds={progress.readIds}
        unlockedAchievements={achievements.unlockedCount}
        totalAchievements={achievements.total}
      />

      <Leaderboard
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
      </Suspense>
      <AIChatPanel
        onNavigateToEvent={(query) => {
          state.setSearchQuery(query)
          state.setViewMode('timeline')
        }}
        suggestions={aiSuggestions}
      />

      {/* 首屏加载骨架屏 — 仅首次加载（无任何事件数据）时显示 */}
      <LoadingSkeletonWithTransition isLoading={state.isLoading && state.filteredEvents.length === 0} />

      {/* 登录弹窗 */}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* 成就解锁庆祝 toast */}
      <AchievementToastContainer />
    </div>
  )
}

/** 导航栏下拉菜单组件 */
interface NavDropdownItem {
  icon: React.ReactNode
  label: string
  onClick: () => void
  testId?: string
}
function NavDropdown({ icon, label, gradientFrom, gradientTo, borderColor, textColor, items }: {
  icon: React.ReactNode; label: string
  gradientFrom: string; gradientTo: string; borderColor: string; textColor: string
  items: NavDropdownItem[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r ${gradientFrom} ${gradientTo} border ${borderColor} ${textColor} hover:shadow-sm transition-all duration-200`}
      >
        {icon}<span className="hidden sm:inline">{label}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[100] min-w-[160px] rounded-lg border border-border/60 bg-popover shadow-xl overflow-hidden">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
              data-testid={item.testId}
            >
              <span className="text-muted-foreground">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** 全屏登录页 — 未登录时替代整个 App 内容 */
function LoginGate() {
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.06),transparent_50%)]" />

      {/* 主题切换 */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        {/* Logo */}
        <img src="/logo.svg" alt="Chrono Atlas" className="w-16 h-16 mb-4 drop-shadow-lg" />
        <h1 className="text-2xl font-bold tracking-tight mb-1">Chrono Atlas</h1>
        <p className="text-sm text-muted-foreground mb-8">探索两万年人类文明时间线</p>

        {/* 登录按钮组 */}
        <div className="w-full space-y-3">
          <button
            onClick={() => setShowAuth(true)}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/20"
          >
            <Mail size={18} />
            邮箱验证码登录
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-[10px] text-muted-foreground">或</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <div className="flex justify-center [&>div]:w-full">
            <GoogleLogin
              onSuccess={async (response) => {
                if (response.credential) {
                  await auth.loginWithGoogle(response.credential)
                }
              }}
              onError={() => {}}
              size="large"
              width="320"
              text="continue_with"
              shape="pill"
            />
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground/50 text-center mt-6">
          首次登录自动创建账号 · 登录即表示同意服务条款和隐私政策
        </p>
      </div>

      {/* 邮箱登录弹窗（复用 AuthModal） */}
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  )
}

export default App
