import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import type Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { getDB, closeDB } from './db.js'
import { streamAIResponse } from './ai.js'
import { createAuthRouter } from './auth.js'
import { createSyncRouter } from './sync.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIST_PATH = path.resolve(__dirname, '../../app/dist')
const CLIENT_INDEX_PATH = path.join(CLIENT_DIST_PATH, 'index.html')
const HAS_CLIENT_BUILD = fs.existsSync(CLIENT_INDEX_PATH)

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
}))
app.use(express.json({ limit: '10kb' }))

// ── 认证 & 数据同步路由 ──
const authDb = getDB()
app.use('/api/auth', createAuthRouter(authDb))
// sync 路由需要更大 body 限制（用户可能有数千个收藏/已读）
app.use('/api/sync', express.json({ limit: '1mb' }), createSyncRouter(authDb))

interface EventRow {
  id: string
  year: number
  end_year: number | null
  title: string
  description: string
  details: string | null
  category: string
  region: string
  significance: number
  figure: string | null
  icon: string | null
  image: string | null
}

interface ListQuery {
  categories?: string
  regions?: string
  yearMin?: string
  yearMax?: string
  search?: string
  significance?: string
  limit?: string
  offset?: string
}

const DERIVED_EVENT_PATTERN = /_(?:context|acceleration|diffusion|legacy)$/

function isDerivedEventId(eventId: string) {
  return DERIVED_EVENT_PATTERN.test(eventId)
}

const MAX_LIMIT = 2000
const MAX_OFFSET = 100000

/** 安全解析 limit/offset，防止 NaN 和超大值 */
function safeLimit(raw: string | undefined, fallback = 1000): number {
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 ? Math.min(Math.floor(n), MAX_LIMIT) : Math.min(fallback, MAX_LIMIT)
}
function safeOffset(raw: string | undefined): number {
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? Math.min(Math.floor(n), MAX_OFFSET) : 0
}
/** 安全解析年份参数 */
function safeYear(raw: string | undefined): number | undefined {
  if (!raw) return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}
/** 安全解析 significance（1-3） */
function safeSignificance(raw: string | undefined): number | undefined {
  if (!raw) return undefined
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 && n <= 3 ? Math.floor(n) : undefined
}
/** 转义 LIKE 通配符 */
function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, '\\$&')
}

function getRelatedIdsMap(db: Database.Database, eventIds: string[]) {
  const uniqueIds = Array.from(new Set(eventIds))

  if (uniqueIds.length === 0) {
    return new Map<string, string[]>()
  }

  const placeholders = uniqueIds.map(() => '?').join(', ')
  const relationRows = db
    .prepare(`SELECT event_id, related_id FROM event_relations WHERE event_id IN (${placeholders}) ORDER BY event_id ASC, related_id ASC`)
    .all(...uniqueIds) as Array<{ event_id: string; related_id: string }>

  const relatedIdsMap = new Map<string, string[]>()

  for (const row of relationRows) {
    const existing = relatedIdsMap.get(row.event_id)
    if (existing) {
      existing.push(row.related_id)
    } else {
      relatedIdsMap.set(row.event_id, [row.related_id])
    }
  }

  return relatedIdsMap
}

function mapEventRow(row: EventRow, relatedIds: string[] = []) {
  return {
    id: row.id,
    year: row.year,
    endYear: row.end_year ?? undefined,
    title: row.title,
    description: row.description,
    details: row.details ?? undefined,
    category: row.category,
    region: row.region,
    significance: row.significance,
    figure: row.figure ?? undefined,
    icon: row.icon ?? undefined,
    image: row.image ?? undefined,
    relatedIds: relatedIds.length ? relatedIds : undefined,
  }
}

function attachRelations(db: Database.Database, rows: EventRow[]) {
  const relatedIdsMap = getRelatedIdsMap(db, rows.map(row => row.id))
  return rows.map(row => mapEventRow(row, relatedIdsMap.get(row.id) ?? []))
}

function filterCoreContextRows(rows: EventRow[], limit?: number) {
  const coreRows = rows.filter(row => !isDerivedEventId(row.id))
  return typeof limit === 'number' ? coreRows.slice(0, limit) : coreRows
}

function applySharedFilters(
  conditions: string[],
  params: Record<string, unknown>,
  query: ListQuery,
  tableAlias = ''
) {
  const fieldPrefix = tableAlias ? `${tableAlias}.` : ''

  if (query.categories) {
    const categories = query.categories.split(',').filter(Boolean)
    if (categories.length > 0) {
      conditions.push(`${fieldPrefix}category IN (${categories.map((_, index) => `@cat${index}`).join(',')})`)
      categories.forEach((category, index) => {
        params[`cat${index}`] = category
      })
    }
  }

  if (query.regions) {
    const regions = query.regions.split(',').filter(Boolean)
    if (regions.length > 0) {
      conditions.push(`${fieldPrefix}region IN (${regions.map((_, index) => `@reg${index}`).join(',')})`)
      regions.forEach((region, index) => {
        params[`reg${index}`] = region
      })
    }
  }

  if (query.yearMin) {
    const yearMin = safeYear(query.yearMin)
    if (yearMin !== undefined) {
      conditions.push(`${fieldPrefix}year >= @yearMin`)
      params.yearMin = yearMin
    }
  }

  if (query.yearMax) {
    const yearMax = safeYear(query.yearMax)
    if (yearMax !== undefined) {
      conditions.push(`${fieldPrefix}year <= @yearMax`)
      params.yearMax = yearMax
    }
  }

  if (query.significance) {
    const significance = safeSignificance(query.significance)
    if (significance !== undefined) {
      conditions.push(`${fieldPrefix}significance >= @significance`)
      params.significance = significance
    }
  }
}

function fallbackSearch(db: Database.Database, req: express.Request, res: express.Response) {
  const query = req.query as ListQuery
  const { search } = query
  const limitNum = safeLimit(query.limit)
  const offsetNum = safeOffset(query.offset)

  let sql = "SELECT * FROM events WHERE (title LIKE @q ESCAPE '\\' OR description LIKE @q ESCAPE '\\' OR figure LIKE @q ESCAPE '\\' OR details LIKE @q ESCAPE '\\')"
  const params: Record<string, unknown> = { q: `%${escapeLike(search || '')}%` }
  const conditions: string[] = []

  applySharedFilters(conditions, params, query)

  if (conditions.length > 0) {
    sql += ` AND ${conditions.join(' AND ')}`
  }

  sql += ' ORDER BY year ASC LIMIT @limit OFFSET @offset'
  params.limit = limitNum
  params.offset = offsetNum

  const rows = db.prepare(sql).all(params) as EventRow[]
  const data = attachRelations(db, rows)

  let countSql = "SELECT COUNT(*) as total FROM events WHERE (title LIKE @q ESCAPE '\\' OR description LIKE @q ESCAPE '\\' OR figure LIKE @q ESCAPE '\\' OR details LIKE @q ESCAPE '\\')"
  if (conditions.length > 0) {
    countSql += ` AND ${conditions.join(' AND ')}`
  }

  const countParams = { ...params }
  delete countParams.limit
  delete countParams.offset

  const { total } = db.prepare(countSql).get(countParams) as { total: number }
  res.json({ data, total, limit: limitNum, offset: offsetNum })
}

app.get('/api/events', (req, res) => {
  const db = getDB()
  const query = req.query as ListQuery
  const { search } = query
  const limitNum = safeLimit(query.limit)
  const offsetNum = safeOffset(query.offset)

  if (search && search.trim()) {
    const hasCJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(search)
    if (hasCJK) {
      fallbackSearch(db, req, res)
      return
    }

    const ftsQuery = search.trim().split(/\s+/).map(word => `"${word.replace(/"/g, '""')}"`).join(' OR ')
    let sql = `
      SELECT e.*
      FROM events e
      JOIN events_fts fts ON e.rowid = fts.rowid
      WHERE events_fts MATCH @ftsQuery
    `

    const params: Record<string, unknown> = { ftsQuery }
    const conditions: string[] = []
    applySharedFilters(conditions, params, query, 'e')

    if (conditions.length > 0) {
      sql += ` AND ${conditions.join(' AND ')}`
    }

    sql += ' ORDER BY e.year ASC LIMIT @limit OFFSET @offset'
    params.limit = limitNum
    params.offset = offsetNum

    try {
      const rows = db.prepare(sql).all(params) as EventRow[]
      const data = attachRelations(db, rows)

      let countSql = `
        SELECT COUNT(*) as total
        FROM events e
        JOIN events_fts fts ON e.rowid = fts.rowid
        WHERE events_fts MATCH @ftsQuery
      `

      if (conditions.length > 0) {
        countSql += ` AND ${conditions.join(' AND ')}`
      }

      const countParams = { ...params }
      delete countParams.limit
      delete countParams.offset

      const { total } = db.prepare(countSql).get(countParams) as { total: number }
      res.json({ data, total, limit: limitNum, offset: offsetNum })
      return
    } catch {
      fallbackSearch(db, req, res)
      return
    }
  }

  let sql = 'SELECT * FROM events WHERE 1 = 1'
  const params: Record<string, unknown> = {}
  const conditions: string[] = []

  applySharedFilters(conditions, params, query)

  if (conditions.length > 0) {
    sql += ` AND ${conditions.join(' AND ')}`
  }

  sql += ' ORDER BY year ASC LIMIT @limit OFFSET @offset'
  params.limit = limitNum
  params.offset = offsetNum

  const rows = db.prepare(sql).all(params) as EventRow[]
  const data = attachRelations(db, rows)

  let countSql = 'SELECT COUNT(*) as total FROM events WHERE 1 = 1'
  if (conditions.length > 0) {
    countSql += ` AND ${conditions.join(' AND ')}`
  }

  const countParams = { ...params }
  delete countParams.limit
  delete countParams.offset

  const { total } = db.prepare(countSql).get(countParams) as { total: number }
  res.json({ data, total, limit: limitNum, offset: offsetNum })
})

app.get('/api/events/:id/context', (req, res) => {
  const db = getDB()
  const current = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id) as EventRow | undefined

  if (!current) {
    res.status(404).json({ error: 'Event not found' })
    return
  }

  const contemporaryRows = db.prepare(`
    SELECT *
    FROM events
    WHERE id != @id
      AND year BETWEEN @minYear AND @maxYear
    ORDER BY ABS(year - @year) ASC, year ASC
    LIMIT 24
  `).all({
    id: current.id,
    year: current.year,
    minYear: current.year - 50,
    maxYear: current.year + 50,
  }) as EventRow[]

  const sameCategoryRows = db.prepare(`
    SELECT *
    FROM events
    WHERE id != @id
      AND category = @category
    ORDER BY ABS(year - @year) ASC, year ASC
    LIMIT 16
  `).all({
    id: current.id,
    category: current.category,
    year: current.year,
  }) as EventRow[]

  const relatedRows = db.prepare(`
    SELECT e.*
    FROM event_relations r
    JOIN events e ON e.id = r.related_id
    WHERE r.event_id = ?
    ORDER BY e.year ASC
  `).all(current.id) as EventRow[]

  res.json({
    contemporaryEvents: attachRelations(db, filterCoreContextRows(contemporaryRows, 6)),
    sameCategoryEvents: attachRelations(db, filterCoreContextRows(sameCategoryRows, 4)),
    relatedEvents: attachRelations(db, filterCoreContextRows(relatedRows)),
  })
})

app.get('/api/events/:id', (req, res) => {
  const db = getDB()
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id) as EventRow | undefined

  if (!row) {
    res.status(404).json({ error: 'Event not found' })
    return
  }

  const relatedIdsMap = getRelatedIdsMap(db, [row.id])
  res.json(mapEventRow(row, relatedIdsMap.get(row.id) ?? []))
})

app.get('/api/stats', (_req, res) => {
  const db = getDB()

  const total = (db.prepare('SELECT COUNT(*) as cnt FROM events').get() as { cnt: number }).cnt
  const coreTotal = (db.prepare(
    "SELECT COUNT(*) as cnt FROM events WHERE id NOT LIKE '%\\_context' ESCAPE '\\' AND id NOT LIKE '%\\_acceleration' ESCAPE '\\' AND id NOT LIKE '%\\_diffusion' ESCAPE '\\' AND id NOT LIKE '%\\_legacy' ESCAPE '\\'"
  ).get() as { cnt: number }).cnt
  const byCategory = db.prepare('SELECT category, COUNT(*) as count FROM events GROUP BY category ORDER BY count DESC').all()
  const byRegion = db.prepare('SELECT region, COUNT(*) as count FROM events GROUP BY region ORDER BY count DESC').all()
  const bySignificance = db.prepare('SELECT significance, COUNT(*) as count FROM events GROUP BY significance ORDER BY significance DESC').all()
  const yearRange = db.prepare('SELECT MIN(year) as min, MAX(year) as max FROM events').get()

  res.json({ total, coreTotal, byCategory, byRegion, bySignificance, yearRange })
})

// ── AI 问答 SSE 端点（允许更大 body 以传历史对话） ──
app.post('/api/ai/chat', express.json({ limit: '50kb' }), async (req, res) => {
  const { message, history } = req.body as { message?: string; history?: Array<{ role: 'user' | 'assistant'; content: string }> }
  if (!message?.trim()) {
    res.status(400).json({ error: 'message is required' })
    return
  }

  // SSE 头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  const db = getDB()
  let clientDisconnected = false
  req.on('close', () => { clientDisconnected = true })

  // 安全截取历史：最多 10 条消息（5 轮），每条 content 截断 500 字
  const safeHistory = (history || [])
    .slice(-10)
    .map(m => ({ role: m.role, content: (m.content || '').slice(0, 500) }))

  try {
    for await (const chunk of streamAIResponse(db, message.trim(), safeHistory)) {
      if (clientDisconnected) break
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
    }
    if (!clientDisconnected) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    }
  } catch (err) {
    if (!clientDisconnected) {
      console.error('[AI Chat Error]', err)
      res.write(`data: ${JSON.stringify({ error: '服务异常，请稍后重试' })}\n\n`)
    }
  } finally {
    res.end()
  }
})

app.get('/health', (_req, res) => {
  res.json({ ok: true, hasClientBuild: HAS_CLIENT_BUILD })
})

if (HAS_CLIENT_BUILD) {
  app.use(express.static(CLIENT_DIST_PATH))

  app.get(/^\/(?!api(?:\/|$)|health(?:\/|$)).*/, (_req, res) => {
    res.sendFile(CLIENT_INDEX_PATH)
  })
}

app.listen(PORT, () => {
  console.log(`Chrono Atlas 服务已启动: http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  closeDB()
  process.exit(0)
})

process.on('SIGTERM', () => {
  closeDB()
  process.exit(0)
})
