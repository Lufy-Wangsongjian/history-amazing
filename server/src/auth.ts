/**
 * 认证模块 — 邮箱验证码 + Google OAuth + JWT
 */
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'
import { nanoid } from 'nanoid'
import type Database from 'better-sqlite3'
import type { Request, Response } from 'express'

// ── 类型定义 ──

export interface AuthUser {
  id: string
  email: string | null
  nickname: string
  avatar: string | null
}

interface UserRow {
  id: string
  email: string | null
  google_id: string | null
  nickname: string
  avatar: string | null
  created_at: string
  last_login_at: string
}

// ── JWT 工具 ──

const JWT_SECRET = process.env.JWT_SECRET || 'chrono-atlas-dev-secret-change-in-prod'
const JWT_EXPIRES_IN = '7d'

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email, nickname: user.nickname },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

export function verifyToken(token: string): { userId: string; email: string; nickname: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; nickname: string }
  } catch {
    return null
  }
}

// ── 邮件发送 ──

function createTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT) || 465
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const transport = createTransport()
  if (!transport) {
    console.log(`[Auth] SMTP 未配置，验证码: ${code} → ${email}`)
    return true // 开发环境，打印到控制台
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@chrono-atlas.com'

  try {
    await transport.sendMail({
      from,
      to: email,
      subject: 'Chrono Atlas 登录验证码',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:32px;background:#fafafa;border-radius:12px">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111">Chrono Atlas</h2>
          <p style="color:#666;font-size:14px;margin:0 0 24px">你的登录验证码：</p>
          <div style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:20px;text-align:center;letter-spacing:8px;font-size:32px;font-weight:700;color:#7c3aed">
            ${code}
          </div>
          <p style="color:#999;font-size:12px;margin:16px 0 0">验证码 5 分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    })
    return true
  } catch (err) {
    console.error('[Auth] 邮件发送失败:', err)
    return false
  }
}

// ── Google OAuth ──

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) return null
  return new OAuth2Client(clientId)
}

// ── 用户 CRUD ──

function findUserByEmail(db: Database.Database, email: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined
}

function findUserByGoogleId(db: Database.Database, googleId: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as UserRow | undefined
}

function findUserById(db: Database.Database, id: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
}

function createUser(db: Database.Database, data: { email?: string; googleId?: string; nickname: string; avatar?: string }): UserRow {
  const id = nanoid(16)
  db.prepare(
    'INSERT INTO users (id, email, google_id, nickname, avatar) VALUES (?, ?, ?, ?, ?)'
  ).run(id, data.email ?? null, data.googleId ?? null, data.nickname, data.avatar ?? null)

  return findUserById(db, id)!
}

function touchLastLogin(db: Database.Database, userId: string) {
  db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(userId)
}

/** 如果用户只通过邮箱注册，后续又用同一邮箱的 Google 登录，关联 google_id */
function linkGoogleId(db: Database.Database, userId: string, googleId: string, avatar?: string) {
  db.prepare('UPDATE users SET google_id = ?, avatar = COALESCE(avatar, ?) WHERE id = ?').run(googleId, avatar ?? null, userId)
}

function toAuthUser(row: UserRow): AuthUser {
  return { id: row.id, email: row.email, nickname: row.nickname, avatar: row.avatar }
}

// ── 路由 ──

export function createAuthRouter(db: Database.Database): Router {
  const router = Router()

  // ── 发送邮箱验证码 ──
  router.post('/send-code', async (req: Request, res: Response) => {
    const { email } = req.body as { email?: string }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: '请输入有效的邮箱地址' })
      return
    }

    // 频率限制：同一邮箱 60 秒内只能发一次
    const recent = db.prepare(
      "SELECT id FROM email_codes WHERE email = ? AND created_at > datetime('now', '-1 minute') AND used = 0"
    ).get(email)
    if (recent) {
      res.status(429).json({ error: '请稍后再试，验证码已发送' })
      return
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    db.prepare(
      "INSERT INTO email_codes (email, code, expires_at) VALUES (?, ?, datetime('now', '+5 minutes'))"
    ).run(email, code)

    const sent = await sendVerificationEmail(email, code)
    if (!sent) {
      res.status(500).json({ error: '验证码发送失败，请稍后重试' })
      return
    }

    res.json({ ok: true, message: '验证码已发送' })
  })

  // ── 验证邮箱验证码 → 登录/注册 ──
  router.post('/verify-code', (req: Request, res: Response) => {
    const { email, code } = req.body as { email?: string; code?: string }
    if (!email || !code) {
      res.status(400).json({ error: '请提供邮箱和验证码' })
      return
    }

    const row = db.prepare(
      "SELECT id FROM email_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now') ORDER BY id DESC LIMIT 1"
    ).get(email, code) as { id: number } | undefined

    if (!row) {
      res.status(401).json({ error: '验证码无效或已过期' })
      return
    }

    // 标记验证码已使用
    db.prepare('UPDATE email_codes SET used = 1 WHERE id = ?').run(row.id)

    // 查找或创建用户
    let user = findUserByEmail(db, email)
    if (!user) {
      const nickname = email.split('@')[0]
      user = createUser(db, { email, nickname })
    } else {
      touchLastLogin(db, user.id)
    }

    const token = signToken(toAuthUser(user))
    res.json({ token, user: toAuthUser(user) })
  })

  // ── Google 登录 ──
  router.post('/google', async (req: Request, res: Response) => {
    const { credential } = req.body as { credential?: string }
    if (!credential) {
      res.status(400).json({ error: '缺少 Google credential' })
      return
    }

    const googleClient = getGoogleClient()
    if (!googleClient) {
      res.status(501).json({ error: 'Google 登录未配置，请设置 GOOGLE_CLIENT_ID 环境变量' })
      return
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      const payload = ticket.getPayload()
      if (!payload || !payload.sub) {
        res.status(401).json({ error: 'Google 验证失败' })
        return
      }

      const googleId = payload.sub
      const googleEmail = payload.email ?? null
      const googleName = payload.name ?? payload.email?.split('@')[0] ?? 'User'
      const googleAvatar = payload.picture ?? null

      // 1. 先按 google_id 查找
      let user = findUserByGoogleId(db, googleId)

      if (!user && googleEmail) {
        // 2. 按邮箱查找（可能之前用邮箱注册过）
        user = findUserByEmail(db, googleEmail)
        if (user) {
          // 关联 Google ID 到已有账户
          linkGoogleId(db, user.id, googleId, googleAvatar ?? undefined)
          user = findUserById(db, user.id)!
        }
      }

      if (!user) {
        // 3. 创建新用户
        user = createUser(db, {
          email: googleEmail ?? undefined,
          googleId,
          nickname: googleName,
          avatar: googleAvatar ?? undefined,
        })
      } else {
        touchLastLogin(db, user.id)
      }

      const token = signToken(toAuthUser(user))
      res.json({ token, user: toAuthUser(user) })
    } catch (err) {
      console.error('[Auth] Google 验证失败:', err)
      res.status(401).json({ error: 'Google 验证失败' })
    }
  })

  // ── 获取当前用户信息 ──
  router.get('/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: '未登录' })
      return
    }

    const decoded = verifyToken(authHeader.slice(7))
    if (!decoded) {
      res.status(401).json({ error: 'Token 无效或已过期' })
      return
    }

    const user = findUserById(db, decoded.userId)
    if (!user) {
      res.status(401).json({ error: '用户不存在' })
      return
    }

    res.json({ user: toAuthUser(user) })
  })

  return router
}
