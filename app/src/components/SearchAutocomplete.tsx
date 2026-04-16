import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear } from '@/data/types'
import { Input } from '@/components/ui/input'
import { Search, X, Clock, Star, Sparkles } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { RegionFlag } from './RegionFlag'

interface SearchAutocompleteProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  events: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

const POPULAR_SEARCHES = ['丝绸之路', '文艺复兴', '工业革命', '秦始皇', '金字塔', '达芬奇']
const MAX_SUGGESTIONS = 8
const SEARCH_HISTORY_KEY = 'chrono-atlas-search-history'
const MAX_HISTORY = 10

/** 从 localStorage 读取搜索历史 */
function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === 'string').slice(0, MAX_HISTORY)
    return []
  } catch {
    return []
  }
}

/** 保存搜索历史到 localStorage */
function saveSearchHistory(history: string[]) {
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch {
    // 隐私模式下 localStorage 可能不可用
  }
}

/** 添加一条搜索记录 */
function addToHistory(keyword: string, history: string[]): string[] {
  const trimmed = keyword.trim()
  if (!trimmed) return history
  const filtered = history.filter(h => h !== trimmed)
  return [trimmed, ...filtered].slice(0, MAX_HISTORY)
}

/** 高亮匹配的关键词 */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary font-semibold rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function SearchAutocomplete({
  searchQuery,
  setSearchQuery,
  events,
  onSelectEvent,
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localInput, setLocalInput] = useState(searchQuery)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [searchHistory, setSearchHistory] = useState<string[]>(loadSearchHistory)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 同步外部 searchQuery 到 localInput
  useEffect(() => {
    setLocalInput(searchQuery)
  }, [searchQuery])

  // 计算联想结果：匹配标题 + 人物
  const suggestions = useMemo(() => {
    const q = localInput.trim().toLowerCase()
    if (!q || q.length < 1) return []

    const titleMatches: HistoricalEvent[] = []
    const figureMatches: HistoricalEvent[] = []
    const descMatches: HistoricalEvent[] = []

    for (const event of events) {
      if (titleMatches.length + figureMatches.length + descMatches.length >= MAX_SUGGESTIONS * 2) break

      const titleLower = event.title.toLowerCase()
      const figureLower = event.figure?.toLowerCase() || ''

      if (titleLower.includes(q)) {
        titleMatches.push(event)
      } else if (figureLower.includes(q)) {
        figureMatches.push(event)
      } else if (event.description.toLowerCase().includes(q)) {
        descMatches.push(event)
      }
    }

    // 标题匹配优先，然后人物匹配，最后描述匹配
    // 每组内里程碑优先
    const sortBySignificance = (a: HistoricalEvent, b: HistoricalEvent) => b.significance - a.significance
    titleMatches.sort(sortBySignificance)
    figureMatches.sort(sortBySignificance)
    descMatches.sort(sortBySignificance)

    return [...titleMatches, ...figureMatches, ...descMatches].slice(0, MAX_SUGGESTIONS)
  }, [localInput, events])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = useCallback((value: string) => {
    setLocalInput(value)
    setIsOpen(true)
    setActiveIndex(-1)
  }, [])

  const handleSubmit = useCallback(() => {
    setSearchQuery(localInput)
    setIsOpen(false)
    if (localInput.trim()) {
      const updated = addToHistory(localInput, searchHistory)
      setSearchHistory(updated)
      saveSearchHistory(updated)
    }
  }, [localInput, setSearchQuery, searchHistory])

  const handleClearHistory = useCallback(() => {
    setSearchHistory([])
    saveSearchHistory([])
  }, [])

  const handleSelectEvent = useCallback((event: HistoricalEvent) => {
    onSelectEvent(event)
    setIsOpen(false)
  }, [onSelectEvent])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelectEvent(suggestions[activeIndex])
        } else {
          handleSubmit()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }, [isOpen, suggestions, activeIndex, handleSubmit, handleSelectEvent])

  // 保持活动项可见
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex])

  const showDropdown = isOpen && (suggestions.length > 0 || (localInput.trim().length === 0))

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
        <Input
          ref={inputRef}
          value={localInput}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="搜索事件、人物..."
          className="pl-8 h-8 text-xs bg-background/50"
          id="chrono-search-input"
        />
        {localInput && (
          <button
            onClick={() => {
              setLocalInput('')
              setSearchQuery('')
              setIsOpen(false)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="清空搜索词"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* 联想下拉 */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-lg border border-border/60 bg-popover shadow-xl overflow-hidden search-autocomplete-dropdown">
          {/* 有输入时显示匹配结果 */}
          {localInput.trim().length > 0 && suggestions.length > 0 && (
            <div ref={listRef} className="max-h-[320px] overflow-y-auto py-1">
              {suggestions.map((event, idx) => {
                const catCfg = CATEGORY_CONFIG[event.category]
                const isActive = idx === activeIndex
                return (
                  <button
                    key={event.id}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors ${
                      isActive ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${catCfg.color}15`, color: catCfg.color }}
                    >
                      <CategoryIcon category={event.category} size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium truncate">
                          <HighlightText text={event.title} query={localInput.trim()} />
                        </span>
                        {event.significance === 3 && (
                          <Star size={9} className="text-amber-500 flex-shrink-0" fill="currentColor" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {formatYear(event.year)}
                        </span>
                        <RegionFlag region={event.region} size={10} />
                        <span className="text-[10px] text-muted-foreground">
                          {REGION_CONFIG[event.region].label}
                        </span>
                        {event.figure && (
                          <span className="text-[10px] text-muted-foreground truncate">
                            · <HighlightText text={event.figure} query={localInput.trim()} />
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
              {/* 底部搜索提示 */}
              <div className="px-3 py-1.5 border-t border-border/30 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Search size={10} />
                按 Enter 搜索 "{localInput.trim()}" · ↑↓ 选择 · Esc 关闭
              </div>
            </div>
          )}

          {/* 无输入时显示最近搜索 + 热门搜索 */}
          {localInput.trim().length === 0 && (
            <div className="p-3 space-y-3">
              {/* 最近搜索 */}
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Clock size={10} />
                      最近搜索
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="text-[10px] text-muted-foreground/60 hover:text-destructive transition-colors"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {searchHistory.map(keyword => (
                      <button
                        key={keyword}
                        onClick={() => {
                          setLocalInput(keyword)
                          setSearchQuery(keyword)
                          setIsOpen(false)
                        }}
                        className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] text-foreground/80 transition-colors hover:border-primary/40 hover:bg-primary/10"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 热门搜索 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-[10px] text-muted-foreground">
                  <Sparkles size={10} className="text-amber-500" />
                  热门搜索
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => {
                        setLocalInput(keyword)
                        setSearchQuery(keyword)
                        setIsOpen(false)
                        const updated = addToHistory(keyword, searchHistory)
                        setSearchHistory(updated)
                        saveSearchHistory(updated)
                      }}
                      className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 有输入但没匹配结果 */}
          {localInput.trim().length > 0 && suggestions.length === 0 && (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-muted-foreground">没有找到匹配的事件</p>
              <p className="text-[10px] text-muted-foreground mt-1">按 Enter 仍可搜索 "{localInput.trim()}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
