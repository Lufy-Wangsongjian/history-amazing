import { useState, useCallback, useEffect, useRef } from 'react'
import { syncToggleFavorite, syncClearFavorites } from '@/lib/api'

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
 * - 登录后自动同步到服务端；未登录时回退到纯 localStorage
 * - `favorites` — 收藏的事件 ID 集合
 * - `isFavorite(id)` — 判断是否已收藏
 * - `toggleFavorite(id)` — 切换收藏状态
 * - `clearAll()` — 清空所有收藏
 * - `count` — 收藏数量
 * - `setFavoritesFromServer(ids)` — 用服务端数据覆盖本地（登录合并后调用）
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())
  const tokenRef = useRef<string | null>(null)

  // 状态变更时同步到 localStorage
  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  /** 让外部传入当前 token，用于判断是否需要同步服务端 */
  const setToken = useCallback((token: string | null) => {
    tokenRef.current = token
  }, [])

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

    // 后台同步到服务端（fire-and-forget）
    if (tokenRef.current) {
      syncToggleFavorite(id).catch(() => {
        // 网络失败不影响本地操作
      })
    }
  }, [])

  const clearAll = useCallback(() => {
    setFavorites(new Set())

    // 后台同步清空到服务端
    if (tokenRef.current) {
      syncClearFavorites().catch(() => {})
    }
  }, [])

  /** 用服务端合并后的数据覆盖本地 */
  const setFavoritesFromServer = useCallback((ids: string[]) => {
    setFavorites(new Set(ids))
  }, [])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearAll,
    count: favorites.size,
    setToken,
    setFavoritesFromServer,
  }
}
