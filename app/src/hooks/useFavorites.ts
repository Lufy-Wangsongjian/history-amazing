import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'chrono-atlas-favorites'

/** 从 localStorage 读取收藏 ID 列表 */
function loadFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return new Set()
    const arr = JSON.parse(stored) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

/** 保存收藏 ID 列表到 localStorage */
function saveFavorites(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
  } catch {
    // localStorage 满了之类的极端情况
  }
}

/**
 * 个人收藏 Hook
 * - `favorites` — 收藏的事件 ID 集合
 * - `isFavorite(id)` — 判断是否已收藏
 * - `toggleFavorite(id)` — 切换收藏状态
 * - `clearAll()` — 清空所有收藏
 * - `count` — 收藏数量
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())

  // 状态变更时同步到 localStorage
  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const isFavorite = useCallback((id: string) => {
    return favorites.has(id)
  }, [favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setFavorites(new Set())
  }, [])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearAll,
    count: favorites.size,
  }
}
