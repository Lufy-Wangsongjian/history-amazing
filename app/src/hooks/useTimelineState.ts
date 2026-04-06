import { useState, useMemo, useCallback, useDeferredValue, useEffect } from 'react'
import type { Category, Region, HistoricalEvent } from '@/data/types'
import { getEffectiveRegionFilters } from '@/data/regions'
import { fetchAllEvents, fetchStats } from '@/lib/api'

export type ViewMode = 'timeline' | 'matrix' | 'stats' | 'compare' | 'civilizations'

export const DEFAULT_YEAR_RANGE: [number, number] = [-4000, 2030]
const EVENTS_PAGE_SIZE = 2000
const DERIVED_EVENT_PATTERN = /_(?:context|acceleration|diffusion|legacy)$/

function parseFiniteNumber(value: string | null) {
  if (value === null) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const VALID_VIEW_MODES: readonly string[] = ['timeline', 'matrix', 'stats', 'compare', 'civilizations']

function parseViewMode(value: string | null): ViewMode | undefined {
  if (value && VALID_VIEW_MODES.includes(value)) {
    return value as ViewMode
  }

  return undefined
}

function parseURLState() {
  const params = new URLSearchParams(window.location.search)
  const categories = params.get('cat')?.split(',').filter(Boolean) as Category[] | undefined
  const regions = params.get('reg')?.split(',').filter(Boolean) as Region[] | undefined
  const yearMin = parseFiniteNumber(params.get('ymin'))
  const yearMax = parseFiniteNumber(params.get('ymax'))
  const view = parseViewMode(params.get('view'))
  const search = params.get('q') || undefined
  const coreOnly = params.get('core') === '0' ? false : true
  const eventId = params.get('event') || undefined
  return { categories, regions, yearMin, yearMax, view, search, coreOnly, eventId }
}

function syncURLState(state: {
  selectedCategories: Set<Category>
  selectedRegions: Set<Region>
  yearRange: [number, number]
  viewMode: ViewMode
  searchQuery: string
  coreOnly: boolean
  selectedEventId: string | null
}) {
  const params = new URLSearchParams()
  const effectiveRegions = getEffectiveRegionFilters(state.selectedRegions)

  if (state.selectedCategories.size > 0) params.set('cat', Array.from(state.selectedCategories).join(','))
  if (effectiveRegions.length > 0) params.set('reg', effectiveRegions.join(','))
  if (state.yearRange[0] !== DEFAULT_YEAR_RANGE[0]) params.set('ymin', String(state.yearRange[0]))
  if (state.yearRange[1] !== DEFAULT_YEAR_RANGE[1]) params.set('ymax', String(state.yearRange[1]))
  if (state.viewMode !== 'timeline') params.set('view', state.viewMode)
  if (state.searchQuery) params.set('q', state.searchQuery)
  if (!state.coreOnly) params.set('core', '0')
  if (state.selectedEventId) params.set('event', state.selectedEventId)
  const str = params.toString()
  const url = str ? `${window.location.pathname}?${str}` : window.location.pathname
  window.history.replaceState(null, '', url)
}

function isDerivedEvent(event: HistoricalEvent) {
  return DERIVED_EVENT_PATTERN.test(event.id)
}

export function useTimelineState() {
  const urlState = useMemo(() => parseURLState(), [])

  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    () => (urlState.categories ? new Set(urlState.categories) : new Set())
  )
  const [selectedRegions, setSelectedRegionsState] = useState<Set<Region>>(
    () => (urlState.regions ? new Set(urlState.regions) : new Set())
  )
  const [yearRange, setYearRange] = useState<[number, number]>(
    () => [urlState.yearMin ?? DEFAULT_YEAR_RANGE[0], urlState.yearMax ?? DEFAULT_YEAR_RANGE[1]]
  )
  const [viewMode, setViewMode] = useState<ViewMode>(urlState.view ?? 'timeline')
  const [searchQuery, setSearchQuery] = useState(urlState.search ?? '')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(urlState.eventId ?? null)
  const [focusYear, setFocusYear] = useState<number | null>(null)
  const [filteredEvents, setFilteredEvents] = useState<HistoricalEvent[]>([])
  const [statsTotal, setStatsTotal] = useState(0)
  const [coreTotalEvents, setCoreTotalEvents] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [coreOnly, setCoreOnly] = useState(urlState.coreOnly)
  const [loadedQueryKey, setLoadedQueryKey] = useState<string | null>(null)

  const deferredSearch = useDeferredValue(searchQuery)
  const normalizedSearch = useMemo(() => deferredSearch.trim(), [deferredSearch])

  useEffect(() => {
    syncURLState({
      selectedCategories,
      selectedRegions,
      yearRange,
      viewMode,
      searchQuery: normalizedSearch,
      coreOnly,
      selectedEventId,
    })
  }, [selectedCategories, selectedRegions, yearRange, viewMode, normalizedSearch, coreOnly, selectedEventId])

  const query = useMemo(() => {
    const categories = Array.from(selectedCategories)
    const regions = getEffectiveRegionFilters(selectedRegions)

    return {
      categories: categories.length > 0 ? categories : undefined,
      regions: regions.length > 0 ? regions : undefined,
      yearMin: yearRange[0] !== DEFAULT_YEAR_RANGE[0] ? yearRange[0] : undefined,
      yearMax: yearRange[1] !== DEFAULT_YEAR_RANGE[1] ? yearRange[1] : undefined,
      search: normalizedSearch || undefined,
      limit: EVENTS_PAGE_SIZE,
      offset: 0,
    }
  }, [selectedCategories, selectedRegions, yearRange, normalizedSearch])

  const queryKey = useMemo(() => JSON.stringify(query), [query])

  const displayEvents = useMemo(() => {
    if (!coreOnly) return filteredEvents
    return filteredEvents.filter(event => !isDerivedEvent(event))
  }, [filteredEvents, coreOnly])

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null
    return filteredEvents.find(event => event.id === selectedEventId) ?? null
  }, [filteredEvents, selectedEventId])

  const visibleTotalEvents = useMemo(() => {
    if (coreOnly) {
      return coreTotalEvents || displayEvents.length
    }

    return statsTotal || filteredEvents.length
  }, [coreOnly, coreTotalEvents, displayEvents.length, filteredEvents.length, statsTotal])

  const isLoading = loadedQueryKey !== queryKey

  useEffect(() => {
    const controller = new AbortController()

    fetchStats(controller.signal)
      .then(stats => {
        setStatsTotal(stats.total)
        setCoreTotalEvents(stats.coreTotal)
      })
      .catch((fetchError: unknown) => {
        if ((fetchError as DOMException).name !== 'AbortError') {
          console.error('加载统计信息失败', fetchError)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetchAllEvents(query, controller.signal)
      .then(response => {
        if (controller.signal.aborted) return
        setFilteredEvents(response.data)
        setError(null)
        setLoadedQueryKey(queryKey)
      })
      .catch((fetchError: unknown) => {
        if ((fetchError as DOMException).name === 'AbortError') {
          return
        }

        console.error('加载历史事件失败', fetchError)
        setFilteredEvents([])
        setError('历史事件加载失败，请确认后端服务已启动。')
        setLoadedQueryKey(queryKey)
      })

    return () => controller.abort()
  }, [query, queryKey])

  const toggleCategory = useCallback((cat: Category) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const setSelectedRegions = useCallback((regions: Iterable<Region>) => {
    setSelectedRegionsState(new Set(regions))
  }, [])

  const toggleRegion = useCallback((region: Region) => {
    setSelectedRegionsState(prev => {
      const next = new Set(prev)
      if (next.has(region)) next.delete(region)
      else next.add(region)
      return next
    })
  }, [])

  const setSelectedEvent = useCallback((event: HistoricalEvent | null) => {
    setSelectedEventId(event?.id ?? null)
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedCategories(new Set())
    setSelectedRegionsState(new Set())
    setYearRange(DEFAULT_YEAR_RANGE)
    setSearchQuery('')
    setCoreOnly(true)
  }, [])

  return {
    selectedCategories,
    toggleCategory,
    selectedRegions,
    setSelectedRegions,
    toggleRegion,
    yearRange,
    setYearRange,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedEvent,
    setSelectedEvent,
    focusYear,
    setFocusYear,
    filteredEvents: displayEvents,
    coreOnly,
    setCoreOnly,
    clearFilters,
    totalEvents: visibleTotalEvents,
    isLoading,
    error,
  }
}
