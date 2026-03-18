import { useState, useMemo, useCallback, useDeferredValue, useEffect } from 'react'
import type { Category, Region, HistoricalEvent } from '@/data/types'
import { historicalEvents } from '@/data/events'

export type ViewMode = 'timeline' | 'matrix' | 'stats'

// URL 参数解析/序列化工具
function parseURLState() {
  const params = new URLSearchParams(window.location.search)
  const categories = params.get('cat')?.split(',').filter(Boolean) as Category[] | undefined
  const regions = params.get('reg')?.split(',').filter(Boolean) as Region[] | undefined
  const yearMin = params.get('ymin') ? Number(params.get('ymin')) : undefined
  const yearMax = params.get('ymax') ? Number(params.get('ymax')) : undefined
  const view = params.get('view') as ViewMode | undefined
  const search = params.get('q') || undefined
  return { categories, regions, yearMin, yearMax, view, search }
}

function syncURLState(state: {
  selectedCategories: Set<Category>
  selectedRegions: Set<Region>
  yearRange: [number, number]
  viewMode: ViewMode
  searchQuery: string
}) {
  const params = new URLSearchParams()
  if (state.selectedCategories.size > 0) params.set('cat', Array.from(state.selectedCategories).join(','))
  if (state.selectedRegions.size > 0) params.set('reg', Array.from(state.selectedRegions).join(','))
  if (state.yearRange[0] !== -4000) params.set('ymin', String(state.yearRange[0]))
  if (state.yearRange[1] !== 2030) params.set('ymax', String(state.yearRange[1]))
  if (state.viewMode !== 'timeline') params.set('view', state.viewMode)
  if (state.searchQuery) params.set('q', state.searchQuery)
  const str = params.toString()
  const url = str ? `${window.location.pathname}?${str}` : window.location.pathname
  window.history.replaceState(null, '', url)
}

export function useTimelineState() {
  // 从 URL 恢复初始状态
  const urlState = useMemo(() => parseURLState(), [])

  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    () => urlState.categories ? new Set(urlState.categories) : new Set()
  )
  const [selectedRegions, setSelectedRegions] = useState<Set<Region>>(
    () => urlState.regions ? new Set(urlState.regions) : new Set()
  )
  const [yearRange, setYearRange] = useState<[number, number]>(
    () => [urlState.yearMin ?? -4000, urlState.yearMax ?? 2030]
  )
  const [viewMode, setViewMode] = useState<ViewMode>(urlState.view ?? 'timeline')
  const [searchQuery, setSearchQuery] = useState(urlState.search ?? '')
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null)
  const [focusYear, setFocusYear] = useState<number | null>(null)

  // 搜索防抖 — 使用 useDeferredValue 避免每次按键都触发全量过滤
  const deferredSearch = useDeferredValue(searchQuery)

  // URL 同步
  useEffect(() => {
    syncURLState({ selectedCategories, selectedRegions, yearRange, viewMode, searchQuery: deferredSearch })
  }, [selectedCategories, selectedRegions, yearRange, viewMode, deferredSearch])

  const filteredEvents = useMemo(() => {
    return historicalEvents.filter(event => {
      // 类目筛选
      if (selectedCategories.size > 0 && !selectedCategories.has(event.category)) return false
      // 地区筛选
      if (selectedRegions.size > 0 && !selectedRegions.has(event.region)) return false
      // 年份范围
      if (event.year < yearRange[0] || event.year > yearRange[1]) return false
      // 搜索（使用 deferred 值）
      if (deferredSearch) {
        const q = deferredSearch.toLowerCase()
        return (
          event.title.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          (event.figure && event.figure.toLowerCase().includes(q))
        )
      }
      return true
    }).sort((a, b) => a.year - b.year)
  }, [selectedCategories, selectedRegions, yearRange, deferredSearch])

  const toggleCategory = useCallback((cat: Category) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const toggleRegion = useCallback((region: Region) => {
    setSelectedRegions(prev => {
      const next = new Set(prev)
      if (next.has(region)) next.delete(region)
      else next.add(region)
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedCategories(new Set())
    setSelectedRegions(new Set())
    setYearRange([-4000, 2030])
    setSearchQuery('')
  }, [])

  return {
    selectedCategories, toggleCategory,
    selectedRegions, toggleRegion,
    yearRange, setYearRange,
    viewMode, setViewMode,
    searchQuery, setSearchQuery,
    selectedEvent, setSelectedEvent,
    focusYear, setFocusYear,
    filteredEvents,
    clearFilters,
    totalEvents: historicalEvents.length,
  }
}
