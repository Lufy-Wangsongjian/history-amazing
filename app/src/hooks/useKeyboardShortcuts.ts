import { useEffect, useRef } from 'react'
import type { HistoricalEvent } from '@/data/types'

interface UseKeyboardShortcutsOptions {
  /** 当前筛选后的事件列表 */
  events: HistoricalEvent[]
  /** 当前选中的事件 */
  selectedEvent: HistoricalEvent | null
  /** 选中事件回调 */
  setSelectedEvent: (event: HistoricalEvent | null) => void
  /** 设置聚焦年份（用于滚动到对应位置） */
  setFocusYear: (year: number | null) => void
}

/**
 * 全局键盘快捷键 Hook
 *
 * - `/` 或 `Ctrl+K` — 聚焦搜索框
 * - `Esc` — 关闭详情面板
 * - `J` — 选中下一个事件
 * - `K` — 选中上一个事件
 * - `?` — 显示快捷键提示（通过事件触发）
 */
export function useKeyboardShortcuts({
  events,
  selectedEvent,
  setSelectedEvent,
  setFocusYear,
}: UseKeyboardShortcutsOptions) {
  // 用 ref 存最新值，避免 useEffect 依赖不稳定的数组/对象引用
  const eventsRef = useRef(events)
  const selectedEventRef = useRef(selectedEvent)
  eventsRef.current = events
  selectedEventRef.current = selectedEvent

  // 只依赖稳定的 setter 函数，listener 只注册一次
  useEffect(() => {
    const navigateEvent = (direction: 'next' | 'prev') => {
      const currentEvents = eventsRef.current
      const currentSelected = selectedEventRef.current

      if (currentEvents.length === 0) return

      if (!currentSelected) {
        const target = direction === 'next' ? currentEvents[0] : currentEvents[currentEvents.length - 1]
        setSelectedEvent(target)
        setFocusYear(target.year)
        return
      }

      const currentIndex = currentEvents.findIndex(e => e.id === currentSelected.id)
      if (currentIndex === -1) {
        setSelectedEvent(currentEvents[0])
        setFocusYear(currentEvents[0].year)
        return
      }

      const nextIndex = direction === 'next'
        ? Math.min(currentIndex + 1, currentEvents.length - 1)
        : Math.max(currentIndex - 1, 0)

      if (nextIndex !== currentIndex) {
        const target = currentEvents[nextIndex]
        setSelectedEvent(target)
        setFocusYear(target.year)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      // `/` 或 `Ctrl+K` — 聚焦搜索框（在非输入状态下）
      if ((e.key === '/' && !isInput) || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        const searchInput = document.getElementById('chrono-search-input')
        if (searchInput) {
          searchInput.focus()
        }
        return
      }

      // 在输入框中时，只响应 Esc
      if (isInput) {
        if (e.key === 'Escape') {
          ;(target as HTMLElement).blur()
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          if (selectedEventRef.current) {
            setSelectedEvent(null)
          }
          break

        case 'j':
        case 'ArrowDown':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault()
            navigateEvent('next')
          }
          break

        case 'k':
        case 'ArrowUp':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault()
            navigateEvent('prev')
          }
          break

        case '?':
          window.dispatchEvent(new CustomEvent('chrono-show-shortcuts'))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSelectedEvent, setFocusYear])
}
