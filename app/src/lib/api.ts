import type { Category, HistoricalEvent, Region } from '@/data/types'

export interface EventsQuery {
  categories?: Category[]
  regions?: Region[]
  yearMin?: number
  yearMax?: number
  search?: string
  significance?: number
  limit?: number
  offset?: number
}

export interface EventsResponse {
  data: HistoricalEvent[]
  total: number
  limit: number
  offset: number
}

export interface EventContextResponse {
  contemporaryEvents: HistoricalEvent[]
  sameCategoryEvents: HistoricalEvent[]
  relatedEvents: HistoricalEvent[]
}

export interface StatsResponse {
  total: number
  coreTotal: number
  byCategory: Array<{ category: Category; count: number }>
  byRegion: Array<{ region: Region; count: number }>
  bySignificance: Array<{ significance: number; count: number }>
  yearRange: {
    min: number
    max: number
  }
}

export interface AllEventsResponse {
  data: HistoricalEvent[]
  total: number
}

const TOKEN_KEY = 'chrono-atlas-token'

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) headers.Authorization = `Bearer ${token}`
  } catch {}
  return headers
}

async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, {
    signal,
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

async function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    signal,
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

function buildEventsQuery(query: EventsQuery) {
  const params = new URLSearchParams()

  if (query.categories?.length) params.set('categories', query.categories.join(','))
  if (query.regions?.length) params.set('regions', query.regions.join(','))
  if (typeof query.yearMin === 'number') params.set('yearMin', String(query.yearMin))
  if (typeof query.yearMax === 'number') params.set('yearMax', String(query.yearMax))
  if (query.search?.trim()) params.set('search', query.search.trim())
  if (typeof query.significance === 'number') params.set('significance', String(query.significance))
  if (typeof query.limit === 'number') params.set('limit', String(query.limit))
  if (typeof query.offset === 'number') params.set('offset', String(query.offset))

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export function fetchEvents(query: EventsQuery, signal?: AbortSignal) {
  return apiGet<EventsResponse>(`/api/events${buildEventsQuery(query)}`, signal)
}

export async function fetchAllEvents(query: EventsQuery, signal?: AbortSignal): Promise<AllEventsResponse> {
  const batchSize = query.limit ?? 2000
  let offset = query.offset ?? 0
  let total = 0
  const data: HistoricalEvent[] = []

  while (true) {
    const response = await fetchEvents({ ...query, limit: batchSize, offset }, signal)

    total = response.total
    data.push(...response.data)
    offset += response.data.length

    if (response.data.length === 0 || data.length >= response.total) {
      break
    }
  }

  return { data, total }
}

export function fetchEvent(id: string, signal?: AbortSignal) {
  return apiGet<HistoricalEvent>(`/api/events/${id}`, signal)
}

export function fetchEventContext(id: string, signal?: AbortSignal) {
  return apiGet<EventContextResponse>(`/api/events/${id}/context`, signal)
}

export function fetchStats(signal?: AbortSignal) {
  return apiGet<StatsResponse>('/api/stats', signal)
}

// ── 数据同步 API ──

export interface SyncGameRecord {
  score: number
  total: number
  time?: number
  combo?: number
  date: string
}

export interface MergeAllResponse {
  favorites: string[]
  readEvents: string[]
  gameRecords: Record<string, SyncGameRecord>
}

/** 登录后一次性合并所有本地数据到服务端 */
export function syncMergeAll(data: {
  favorites?: string[]
  readEvents?: string[]
  gameRecords?: Record<string, SyncGameRecord>
}, signal?: AbortSignal) {
  return apiPost<MergeAllResponse>('/api/sync/merge-all', data, signal)
}

/** 切换单个收藏 */
export function syncToggleFavorite(eventId: string, signal?: AbortSignal) {
  return apiPost<{ favorited: boolean }>('/api/sync/favorites/toggle', { eventId }, signal)
}

/** 清空所有收藏 */
export async function syncClearFavorites(signal?: AbortSignal): Promise<void> {
  const response = await fetch('/api/sync/favorites', {
    method: 'DELETE',
    signal,
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error(`请求失败：${response.status}`)
}

/** 标记单个事件已读 */
export function syncMarkRead(eventId: string, signal?: AbortSignal) {
  return apiPost<{ ok: boolean }>('/api/sync/read-events/mark', { eventId }, signal)
}

/** 提交单个游戏分数 */
export function syncSubmitGameRecord(data: {
  gameId: string
  score: number
  total: number
  time?: number
  combo?: number
  date?: string
}, signal?: AbortSignal) {
  return apiPost<{ isNewBest: boolean }>('/api/sync/game-records/submit', {
    ...data,
    date: data.date || new Date().toISOString(),
  }, signal)
}
