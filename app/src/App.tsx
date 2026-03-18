import { FilterPanel } from '@/components/FilterPanel'
import { TimelineView } from '@/components/TimelineView'
import { MatrixView } from '@/components/MatrixView'
import { StatsView } from '@/components/StatsView'
import { EventDetail } from '@/components/EventDetail'
import { EraNavigator } from '@/components/EraNavigator'
import { useTimelineState } from '@/hooks/useTimelineState'
import { useTheme } from '@/hooks/useTheme'
import { useIsMobile } from '@/hooks/use-mobile'
import { Globe, Sparkles, Sun, Moon, PanelLeftOpen } from 'lucide-react'
import { useState } from 'react'
import './App.css'

function App() {
  const state = useTimelineState()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="h-14 flex-shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-md flex items-center justify-between px-4 md:px-5">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile menu toggle */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground md:hidden"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">Chrono Atlas</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">6000 年人类文明时间线</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-amber-500" />
            <span>
              <strong className="text-foreground">{state.filteredEvents.length}</strong> 条历史事件
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile overlay */}
        {isMobile && mobileMenuOpen && (
          <div
            className="absolute inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Filter Panel - drawer on mobile */}
        <div className={`
          ${isMobile
            ? `absolute left-0 top-0 bottom-0 z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : ''
          }
        `}>
          <FilterPanel
            selectedCategories={state.selectedCategories}
            toggleCategory={state.toggleCategory}
            selectedRegions={state.selectedRegions}
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
            onMobileClose={isMobile ? () => setMobileMenuOpen(false) : undefined}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
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
          ) : (
            <StatsView
              events={state.filteredEvents}
              onSelectEvent={state.setSelectedEvent}
            />
          )}

          {/* Bottom era navigator */}
          <EraNavigator
            events={state.filteredEvents}
            onSelectYear={state.setFocusYear}
          />
        </div>
      </div>

      {/* Event detail modal */}
      <EventDetail
        event={state.selectedEvent}
        onClose={() => state.setSelectedEvent(null)}
        onNavigate={(event) => state.setSelectedEvent(event)}
      />
    </div>
  )
}

export default App
