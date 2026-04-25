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

  // ────────────────────────────────────
  // 每日签到 + 连续打卡
  // ────────────────────────────────────

  /** 获取签到状态 */
  router.get('/streak', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const row = db.prepare(
      'SELECT current_streak, longest_streak, last_checkin, total_checkins FROM user_streaks WHERE user_id = ?'
    ).get(userId) as { current_streak: number; longest_streak: number; last_checkin: string | null; total_checkins: number } | undefined

    if (!row) {
      res.json({ currentStreak: 0, longestStreak: 0, lastCheckin: null, totalCheckins: 0, checkedInToday: false })
      return
    }

    const today = new Date().toISOString().slice(0, 10)
    const checkedInToday = row.last_checkin === today

    res.json({
      currentStreak: row.current_streak,
      longestStreak: row.longest_streak,
      lastCheckin: row.last_checkin,
      totalCheckins: row.total_checkins,
      checkedInToday,
    })
  })

  /** 执行每日签到 */
  router.post('/streak/checkin', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    const row = db.prepare(
      'SELECT current_streak, longest_streak, last_checkin, total_checkins FROM user_streaks WHERE user_id = ?'
    ).get(userId) as { current_streak: number; longest_streak: number; last_checkin: string | null; total_checkins: number } | undefined

    if (row?.last_checkin === today) {
      // 今天已签到
      res.json({
        currentStreak: row.current_streak,
        longestStreak: row.longest_streak,
        totalCheckins: row.total_checkins,
        checkedInToday: true,
        isNew: false,
      })
      return
    }

    let newStreak: number
    if (!row) {
      // 首次签到
      newStreak = 1
      db.prepare(
        'INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_checkin, total_checkins) VALUES (?, 1, 1, ?, 1)'
      ).run(userId, today)
    } else if (row.last_checkin === yesterday) {
      // 连续签到
      newStreak = row.current_streak + 1
      const longestStreak = Math.max(row.longest_streak, newStreak)
      db.prepare(
        'UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_checkin = ?, total_checkins = total_checkins + 1 WHERE user_id = ?'
      ).run(newStreak, longestStreak, today, userId)
    } else {
      // 断签，重新开始
      newStreak = 1
      db.prepare(
        'UPDATE user_streaks SET current_streak = 1, last_checkin = ?, total_checkins = total_checkins + 1 WHERE user_id = ?'
      ).run(today, userId)
    }

    const updated = db.prepare(
      'SELECT current_streak, longest_streak, total_checkins FROM user_streaks WHERE user_id = ?'
    ).get(userId) as { current_streak: number; longest_streak: number; total_checkins: number }

    res.json({
      currentStreak: updated.current_streak,
      longestStreak: updated.longest_streak,
      totalCheckins: updated.total_checkins,
      checkedInToday: true,
      isNew: true,
    })
  })

  // ────────────────────────────────────
  // 周排行榜
  // ────────────────────────────────────

  /** 获取当前周的排行榜 */
  router.get('/leaderboard', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const weekKey = getWeekKey()
    const scoreType = (req.query.type as string) || 'read_count'

    // 前 20 名
    const rows = db.prepare(`
      SELECT ws.user_id, ws.score, u.nickname, u.avatar
      FROM weekly_scores ws
      JOIN users u ON u.id = ws.user_id
      WHERE ws.week_key = ? AND ws.score_type = ?
      ORDER BY ws.score DESC
      LIMIT 20
    `).all(weekKey, scoreType) as Array<{ user_id: string; score: number; nickname: string; avatar: string | null }>

    // 自己的排名
    const myScore = db.prepare(
      'SELECT score FROM weekly_scores WHERE user_id = ? AND week_key = ? AND score_type = ?'
    ).get(userId, weekKey, scoreType) as { score: number } | undefined

    const myRank = myScore
      ? (db.prepare(
          'SELECT COUNT(*) as rank FROM weekly_scores WHERE week_key = ? AND score_type = ? AND score > ?'
        ).get(weekKey, scoreType, myScore.score) as { rank: number }).rank + 1
      : null

    res.json({
      weekKey,
      scoreType,
      top: rows.map(r => ({
        userId: r.user_id,
        nickname: r.nickname,
        avatar: r.avatar,
        score: r.score,
      })),
      me: myScore ? { rank: myRank, score: myScore.score } : null,
    })
  })

  /** 更新周分数（由后端自动调用或前端提交） */
  router.post('/leaderboard/submit', (req: Request, res: Response) => {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { scoreType, score } = req.body as { scoreType?: string; score?: number }
    if (!scoreType || typeof score !== 'number') {
      res.status(400).json({ error: 'scoreType 和 score 必填' })
      return
    }

    const validTypes = new Set(['read_count', 'quiz_score', 'challenge_score'])
    if (!validTypes.has(scoreType)) {
      res.status(400).json({ error: '无效的 scoreType' })
      return
    }

    const weekKey = getWeekKey()

    // 累加分数（非替换）
    db.prepare(`
      INSERT INTO weekly_scores (user_id, week_key, score_type, score)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, week_key, score_type) DO UPDATE SET
        score = CASE
          WHEN ? = 'read_count' THEN excluded.score
          ELSE MAX(weekly_scores.score, excluded.score)
        END
    `).run(userId, weekKey, scoreType, score, scoreType)

    res.json({ ok: true })
  })

  return router
}

/** 获取当前 ISO 周的 key，如 "2026-W17" */
function getWeekKey(): string {
  const now = new Date()
  const jan1 = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - jan1.getTime()) / 86400000)
  const weekNum = Math.ceil((days + jan1.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}
