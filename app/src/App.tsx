import { FilterPanel } from '@/components/FilterPanel'
import { TimelineView } from '@/components/TimelineView'
import { MatrixView } from '@/components/MatrixView'
import { StatsView } from '@/components/StatsView'
import { CompareView } from '@/components/CompareView'
import { EventDetail } from '@/components/EventDetail'
import { TodayInHistory } from '@/components/TodayInHistory'
import { EraNavigator } from '@/components/EraNavigator'
import { ActiveFiltersBar } from '@/components/ActiveFiltersBar'
import { WelcomeDialog } from '@/components/WelcomeDialog'
import { DEFAULT_YEAR_RANGE, useTimelineState } from '@/hooks/useTimelineState'
import { useTheme } from '@/hooks/useTheme'
import { useIsMobile } from '@/hooks/use-mobile'
import { ALL_REGIONS, getVisibleSelectedRegions } from '@/data/regions'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { Globe, Sparkles, Sun, Moon, PanelLeftOpen, Shuffle, CalendarDays } from 'lucide-react'
import { useState } from 'react'
import './App.css'

const WELCOME_STORAGE_KEY = 'chrono-atlas-welcome-dismissed'

function App() {
  const state = useTimelineState()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showTodayInHistory, setShowTodayInHistory] = useState(false)
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.localStorage.getItem(WELCOME_STORAGE_KEY)
  })

  const dismissWelcome = () => {
    window.localStorage.setItem(WELCOME_STORAGE_KEY, '1')
    setShowWelcome(false)
  }

  const handleRandomExplore = () => {
    const events = state.filteredEvents
    if (events.length === 0) return
    const idx = Math.floor(Math.random() * events.length)
    state.setSelectedEvent(events[idx])
    dismissWelcome()
  }

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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
            <Globe size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-foreground tracking-tight truncate">Chrono Atlas</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">6000 年人类文明时间线</p>
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

          {state.viewMode === 'timeline' ? (
            <TimelineView
              events={state.filteredEvents}
              selectedEvent={state.selectedEvent}
              onSelectEvent={state.setSelectedEvent}
              focusYear={state.focusYear}
            />
          ) : state.viewMode === 'matrix' ? (
            <MatrixView
              events={state.filteredEvents}
              selectedEvent={state.selectedEvent}
              onSelectEvent={state.setSelectedEvent}
            />
          ) : state.viewMode === 'compare' ? (
            <CompareView
              events={state.filteredEvents}
              onSelectEvent={state.setSelectedEvent}
            />
          ) : (
            <StatsView
              events={state.filteredEvents}
              onSelectEvent={state.setSelectedEvent}
            />
          )}

          <EraNavigator
            events={state.filteredEvents}
            onSelectYear={state.setFocusYear}
          />
        </div>
      </div>

      <EventDetail
        event={state.selectedEvent}
        events={state.filteredEvents}
        onClose={() => state.setSelectedEvent(null)}
        onNavigate={(event) => state.setSelectedEvent(event)}
      />

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
    </div>
  )
}

export default App
