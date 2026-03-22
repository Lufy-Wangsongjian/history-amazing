import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import type Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { getDB, closeDB } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIST_PATH = path.resolve(__dirname, '../../app/dist')
const CLIENT_INDEX_PATH = path.join(CLIENT_DIST_PATH, 'index.html')
const HAS_CLIENT_BUILD = fs.existsSync(CLIENT_INDEX_PATH)

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

app.use(cors())
app.use(express.json())

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
    conditions.push(`${fieldPrefix}year >= @yearMin`)
    params.yearMin = Number(query.yearMin)
  }

  if (query.yearMax) {
    conditions.push(`${fieldPrefix}year <= @yearMax`)
    params.yearMax = Number(query.yearMax)
  }

  if (query.significance) {
    conditions.push(`${fieldPrefix}significance >= @significance`)
    params.significance = Number(query.significance)
  }
}

function fallbackSearch(db: Database.Database, req: express.Request, res: express.Response) {
  const query = req.query as ListQuery
  const { search, limit = '1000', offset = '0' } = query

  let sql = 'SELECT * FROM events WHERE (title LIKE @q OR description LIKE @q OR figure LIKE @q OR details LIKE @q)'
  const params: Record<string, unknown> = { q: `%${search}%` }
  const conditions: string[] = []

  applySharedFilters(conditions, params, query)

  if (conditions.length > 0) {
    sql += ` AND ${conditions.join(' AND ')}`
  }

  sql += ' ORDER BY year ASC LIMIT @limit OFFSET @offset'
  params.limit = Number(limit)
  params.offset = Number(offset)

  const rows = db.prepare(sql).all(params) as EventRow[]
  const data = attachRelations(db, rows)

  let countSql = 'SELECT COUNT(*) as total FROM events WHERE (title LIKE @q OR description LIKE @q OR figure LIKE @q OR details LIKE @q)'
  if (conditions.length > 0) {
    countSql += ` AND ${conditions.join(' AND ')}`
  }

  const countParams = { ...params }
  delete countParams.limit
  delete countParams.offset

  const { total } = db.prepare(countSql).get(countParams) as { total: number }
  res.json({ data, total, limit: Number(limit), offset: Number(offset) })
}

app.get('/api/events', (req, res) => {
  const db = getDB()
  const query = req.query as ListQuery
  const { search, limit = '1000', offset = '0' } = query

  if (search && search.trim()) {
    const hasCJK = /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(search)
    if (hasCJK) {
      fallbackSearch(db, req, res)
      return
    }

    const ftsQuery = search.trim().split(/\s+/).map(word => `"${word}"`).join(' OR ')
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
    params.limit = Number(limit)
    params.offset = Number(offset)

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
      res.json({ data, total, limit: Number(limit), offset: Number(offset) })
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
  params.limit = Number(limit)
  params.offset = Number(offset)

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
  res.json({ data, total, limit: Number(limit), offset: Number(offset) })
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
  const coreTotal = (db.prepare('SELECT id FROM events').all() as Array<{ id: string }>).filter(row => !isDerivedEventId(row.id)).length
  const byCategory = db.prepare('SELECT category, COUNT(*) as count FROM events GROUP BY category ORDER BY count DESC').all()
  const byRegion = db.prepare('SELECT region, COUNT(*) as count FROM events GROUP BY region ORDER BY count DESC').all()
  const bySignificance = db.prepare('SELECT significance, COUNT(*) as count FROM events GROUP BY significance ORDER BY significance DESC').all()
  const yearRange = db.prepare('SELECT MIN(year) as min, MAX(year) as max FROM events').get()

  res.json({ total, coreTotal, byCategory, byRegion, bySignificance, yearRange })
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
