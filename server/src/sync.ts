/**
 * 用户数据同步模块 — 收藏、已读、游戏记录
 * 所有端点需要 JWT 认证
 */
import { Router } from 'express'
import type Database from 'better-sqlite3'
import type { Request, Response } from 'express'
import { verifyToken } from './auth.js'

// ── 中间件：解析 JWT，要求登录 ──

function requireAuth(req: Request, res: Response): string | null {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: '未登录' })
    return null
  }
  const decoded = verifyToken(authHeader.slice(7))
  if (!decoded) {
    res.status(401).json({ error: 'Token 无效或已过期' })
    return null
  }
  return decoded.userId
}

// ── 常量 & 校验 ──

const MAX_FAVORITES = 5000
const MAX_READ_EVENTS = 20000
const VALID_GAME_IDS = new Set(['quiz', 'memory', 'riddle', 'sorter', 'challenge'])

function isValidGameRecord(record: unknown): record is GameRecordPayload {
  if (!record || typeof record !== 'object') return false
  const r = record as Record<string, unknown>
  return typeof r.score === 'number' && typeof r.total === 'number' &&
    r.total > 0 && r.score >= 0 && r.score <= r.total
}

// ── 类型 ──

interface GameRecordPayload {
  gameId: string
  score: number
  total: number
  time?: number
  combo?: number
  date: string
}

// ── 路由 ──

export function createSyncRouter(db: Database.Database): Router {
  const router = Router()

  // ────────────────────────────────────
  // 收藏
  // ────────────────────────────────────

  /** 获取用户所有收藏 */
  router.get('/favorites', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const rows = db.prepare(
      'SELECT event_id FROM user_favorites WHERE user_id = ? ORDER BY created_at ASC'
    ).all(userId) as Array<{ event_id: string }>

    res.json({ ids: rows.map(r => r.event_id) })
  })

  /** 全量覆盖收藏（用于登录时从 localStorage 合并） */
  router.put('/favorites', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { ids } = req.body as { ids?: string[] }
    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'ids 必须是数组' })
      return
    }

    const mergeTransaction = db.transaction(() => {
      // 获取服务端已有的收藏
      const serverRows = db.prepare(
        'SELECT event_id FROM user_favorites WHERE user_id = ?'
      ).all(userId) as Array<{ event_id: string }>
      const serverSet = new Set(serverRows.map(r => r.event_id))

      // 合并：服务端 ∪ 客户端
      const merged = new Set([...serverSet, ...ids])

      // 插入客户端独有的
      const insertStmt = db.prepare(
        'INSERT OR IGNORE INTO user_favorites (user_id, event_id) VALUES (?, ?)'
      )
      for (const eventId of merged) {
        if (!serverSet.has(eventId)) {
          insertStmt.run(userId, eventId)
        }
      }

      return Array.from(merged)
    })

    const merged = mergeTransaction()
    res.json({ ids: merged })
  })

  /** 切换单个收藏 */
  router.post('/favorites/toggle', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { eventId } = req.body as { eventId?: string }
    if (!eventId) {
      res.status(400).json({ error: 'eventId 必填' })
      return
    }

    const existing = db.prepare(
      'SELECT 1 FROM user_favorites WHERE user_id = ? AND event_id = ?'
    ).get(userId, eventId)

    if (existing) {
      db.prepare('DELETE FROM user_favorites WHERE user_id = ? AND event_id = ?').run(userId, eventId)
      res.json({ favorited: false })
    } else {
      db.prepare('INSERT INTO user_favorites (user_id, event_id) VALUES (?, ?)').run(userId, eventId)
      res.json({ favorited: true })
    }
  })

  /** 清空所有收藏 */
  router.delete('/favorites', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    db.prepare('DELETE FROM user_favorites WHERE user_id = ?').run(userId)
    res.json({ ok: true })
  })

  // ────────────────────────────────────
  // 已读事件
  // ────────────────────────────────────

  /** 获取用户所有已读 */
  router.get('/read-events', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const rows = db.prepare(
      'SELECT event_id FROM user_read_events WHERE user_id = ? ORDER BY created_at ASC'
    ).all(userId) as Array<{ event_id: string }>

    res.json({ ids: rows.map(r => r.event_id) })
  })

  /** 合并已读事件（登录时从 localStorage 合并） */
  router.put('/read-events', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { ids } = req.body as { ids?: string[] }
    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'ids 必须是数组' })
      return
    }

    const mergeTransaction = db.transaction(() => {
      const insertStmt = db.prepare(
        'INSERT OR IGNORE INTO user_read_events (user_id, event_id) VALUES (?, ?)'
      )
      for (const eventId of ids) {
        insertStmt.run(userId, eventId)
      }

      // 返回合并后的全量
      const rows = db.prepare(
        'SELECT event_id FROM user_read_events WHERE user_id = ?'
      ).all(userId) as Array<{ event_id: string }>

      return rows.map(r => r.event_id)
    })

    const merged = mergeTransaction()
    res.json({ ids: merged })
  })

  /** 标记单个事件为已读 */
  router.post('/read-events/mark', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { eventId } = req.body as { eventId?: string }
    if (!eventId) {
      res.status(400).json({ error: 'eventId 必填' })
      return
    }

    db.prepare(
      'INSERT OR IGNORE INTO user_read_events (user_id, event_id) VALUES (?, ?)'
    ).run(userId, eventId)

    res.json({ ok: true })
  })

  // ────────────────────────────────────
  // 游戏记录
  // ────────────────────────────────────

  /** 获取用户所有游戏最佳记录 */
  router.get('/game-records', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const rows = db.prepare(
      'SELECT game_id, score, total, time, combo, date FROM user_game_records WHERE user_id = ?'
    ).all(userId) as Array<{ game_id: string; score: number; total: number; time: number | null; combo: number | null; date: string }>

    const records: Record<string, { score: number; total: number; time?: number; combo?: number; date: string }> = {}
    for (const row of rows) {
      records[row.game_id] = {
        score: row.score,
        total: row.total,
        time: row.time ?? undefined,
        combo: row.combo ?? undefined,
        date: row.date,
      }
    }

    res.json({ records })
  })

  /** 合并游戏记录（登录时从 localStorage 合并，只保留更优的） */
  router.put('/game-records', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { records } = req.body as { records?: Record<string, GameRecordPayload> }
    if (!records || typeof records !== 'object') {
      res.status(400).json({ error: 'records 必须是对象' })
      return
    }

    const mergeTransaction = db.transaction(() => {
      for (const [gameId, record] of Object.entries(records)) {
        if (!VALID_GAME_IDS.has(gameId) || !isValidGameRecord(record)) continue

        const existing = db.prepare(
          'SELECT score, total FROM user_game_records WHERE user_id = ? AND game_id = ?'
        ).get(userId, gameId) as { score: number; total: number } | undefined

        const newRatio = record.score / record.total
        const existingRatio = existing ? existing.score / existing.total : -1

        // 只在新记录更好时更新
        if (newRatio > existingRatio ||
            (newRatio === existingRatio && !existing)) {
          db.prepare(`
            INSERT INTO user_game_records (user_id, game_id, score, total, time, combo, date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id, game_id) DO UPDATE SET
              score = excluded.score,
              total = excluded.total,
              time = excluded.time,
              combo = excluded.combo,
              date = excluded.date
          `).run(userId, gameId, record.score, record.total, record.time ?? null, record.combo ?? null, record.date)
        }
      }

      // 返回合并后的全量
      const rows = db.prepare(
        'SELECT game_id, score, total, time, combo, date FROM user_game_records WHERE user_id = ?'
      ).all(userId) as Array<{ game_id: string; score: number; total: number; time: number | null; combo: number | null; date: string }>

      const merged: Record<string, { score: number; total: number; time?: number; combo?: number; date: string }> = {}
      for (const row of rows) {
        merged[row.game_id] = {
          score: row.score,
          total: row.total,
          time: row.time ?? undefined,
          combo: row.combo ?? undefined,
          date: row.date,
        }
      }
      return merged
    })

    const merged = mergeTransaction()
    res.json({ records: merged })
  })

  /** 提交单个游戏分数 */
  router.post('/game-records/submit', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { gameId, score, total, time, combo, date } = req.body as GameRecordPayload & { gameId?: string }
    if (!gameId || typeof score !== 'number' || typeof total !== 'number' || total <= 0 || score < 0 || score > total) {
      res.status(400).json({ error: 'gameId, score, total 必填且合法' })
      return
    }
    if (!VALID_GAME_IDS.has(gameId)) {
      res.status(400).json({ error: '无效的 gameId' })
      return
    }

    const existing = db.prepare(
      'SELECT score, total, time FROM user_game_records WHERE user_id = ? AND game_id = ?'
    ).get(userId, gameId) as { score: number; total: number; time: number | null } | undefined

    const newRatio = score / total
    const existingRatio = existing ? existing.score / existing.total : -1

    const isNewBest = newRatio > existingRatio ||
      (newRatio === existingRatio && time !== undefined && existing?.time !== undefined && existing.time !== null && time < existing.time) ||
      !existing

    if (isNewBest) {
      db.prepare(`
        INSERT INTO user_game_records (user_id, game_id, score, total, time, combo, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, game_id) DO UPDATE SET
          score = excluded.score,
          total = excluded.total,
          time = excluded.time,
          combo = excluded.combo,
          date = excluded.date
      `).run(userId, gameId, score, total, time ?? null, combo ?? null, date || new Date().toISOString())
    }

    res.json({ isNewBest })
  })

  // ────────────────────────────────────
  // 一次性全量同步（登录时调用）
  // ────────────────────────────────────

  /** 登录后一次性同步所有本地数据到服务端，返回合并后的全量 */
  router.post('/merge-all', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { favorites, readEvents, gameRecords } = req.body as {
      favorites?: string[]
      readEvents?: string[]
      gameRecords?: Record<string, GameRecordPayload>
    }

    const result = db.transaction(() => {
      // ─── 合并收藏 ───
      let mergedFavorites: string[] = []
      {
        const serverRows = db.prepare(
          'SELECT event_id FROM user_favorites WHERE user_id = ?'
        ).all(userId) as Array<{ event_id: string }>
        const serverSet = new Set(serverRows.map(r => r.event_id))
        const clientIds = (favorites ?? []).slice(0, MAX_FAVORITES)
        const merged = new Set([...serverSet, ...clientIds])

        const insertStmt = db.prepare(
          'INSERT OR IGNORE INTO user_favorites (user_id, event_id) VALUES (?, ?)'
        )
        for (const id of merged) {
          if (!serverSet.has(id)) insertStmt.run(userId, id)
        }
        mergedFavorites = Array.from(merged)
      }

      // ─── 合并已读 ───
      let mergedReadEvents: string[] = []
      {
        const insertStmt = db.prepare(
          'INSERT OR IGNORE INTO user_read_events (user_id, event_id) VALUES (?, ?)'
        )
        const readIds = (readEvents ?? []).slice(0, MAX_READ_EVENTS)
        for (const id of readIds) {
          insertStmt.run(userId, id)
        }
        const rows = db.prepare(
          'SELECT event_id FROM user_read_events WHERE user_id = ?'
        ).all(userId) as Array<{ event_id: string }>
        mergedReadEvents = rows.map(r => r.event_id)
      }

      // ─── 合并游戏记录 ───
      const mergedGameRecords: Record<string, { score: number; total: number; time?: number; combo?: number; date: string }> = {}
      {
        if (gameRecords) {
          for (const [gameId, record] of Object.entries(gameRecords)) {
            if (!VALID_GAME_IDS.has(gameId) || !isValidGameRecord(record)) continue

            const existing = db.prepare(
              'SELECT score, total FROM user_game_records WHERE user_id = ? AND game_id = ?'
            ).get(userId, gameId) as { score: number; total: number } | undefined

            const newRatio = record.score / record.total
            const existingRatio = existing ? existing.score / existing.total : -1

            if (newRatio > existingRatio || !existing) {
              db.prepare(`
                INSERT INTO user_game_records (user_id, game_id, score, total, time, combo, date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, game_id) DO UPDATE SET
                  score = excluded.score,
                  total = excluded.total,
                  time = excluded.time,
                  combo = excluded.combo,
                  date = excluded.date
              `).run(userId, gameId, record.score, record.total, record.time ?? null, record.combo ?? null, record.date || new Date().toISOString())
            }
          }
        }

        const rows = db.prepare(
          'SELECT game_id, score, total, time, combo, date FROM user_game_records WHERE user_id = ?'
        ).all(userId) as Array<{ game_id: string; score: number; total: number; time: number | null; combo: number | null; date: string }>

        for (const row of rows) {
          mergedGameRecords[row.game_id] = {
            score: row.score,
            total: row.total,
            time: row.time ?? undefined,
            combo: row.combo ?? undefined,
            date: row.date,
          }
        }
      }

      return { favorites: mergedFavorites, readEvents: mergedReadEvents, gameRecords: mergedGameRecords }
    })()

    res.json(result)
  })

  return router
}
