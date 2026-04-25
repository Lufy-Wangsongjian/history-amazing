import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

// ── 类型 ──

export interface AuthUser {
  id: string
  email: string | null
  nickname: string
  avatar: string | null
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  /** 发送邮箱验证码 */
  sendCode: (email: string) => Promise<{ ok: boolean; error?: string }>
  /** 验证邮箱验证码 → 登录 */
  verifyCode: (email: string, code: string) => Promise<{ ok: boolean; error?: string }>
  /** Google 登录 */
  loginWithGoogle: (credential: string) => Promise<{ ok: boolean; error?: string }>
  /** 登出 */
  logout: () => void
}

const TOKEN_KEY = 'chrono-atlas-token'

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ──

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  })
  const [isLoading, setIsLoading] = useState(!!token) // 有 token 时需要验证

  // 启动时用 token 获取用户信息
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid')
        return res.json()
      })
      .then((data: { user: AuthUser }) => {
        setUser(data.user)
      })
      .catch(err => {
        if ((err as Error).name !== 'AbortError') {
          // Token 无效，清除
          setToken(null)
          setUser(null)
          try { localStorage.removeItem(TOKEN_KEY) } catch {}
        }
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()
  }, [token])

  const saveLogin = useCallback((data: { token: string; user: AuthUser }) => {
    setToken(data.token)
    setUser(data.user)
    try { localStorage.setItem(TOKEN_KEY, data.token) } catch {}
  }, [])

  // 发送验证码
  const sendCode = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || '发送失败' }
      return { ok: true }
    } catch {
      return { ok: false, error: '网络错误，请检查连接' }
    }
  }, [])

  // 验证验证码 → 登录
  const verifyCode = useCallback(async (email: string, code: string) => {
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || '验证失败' }
      saveLogin(data)
      return { ok: true }
    } catch {
      return { ok: false, error: '网络错误，请检查连接' }
    }
  }, [saveLogin])

  // Google 登录
  const loginWithGoogle = useCallback(async (credential: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Google 登录失败' }
      saveLogin(data)
      return { ok: true }
    } catch {
      return { ok: false, error: '网络错误，请检查连接' }
    }
  }, [saveLogin])

  // 登出
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    try { localStorage.removeItem(TOKEN_KEY) } catch {}
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, sendCode, verifyCode, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
