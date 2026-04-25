import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { X, Mail, ArrowLeft, Loader2 } from 'lucide-react'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

type Step = 'choose' | 'email-input' | 'code-input'

export function AuthModal({ open, onClose }: AuthModalProps) {
  const auth = useAuth()
  const [step, setStep] = useState<Step>('choose')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const codeInputRef = useRef<HTMLInputElement>(null)

  // 重置状态
  useEffect(() => {
    if (open) {
      setStep('choose')
      setEmail('')
      setCode('')
      setError('')
      setLoading(false)
    }
  }, [open])

  // 验证码输入框自动聚焦
  useEffect(() => {
    if (step === 'code-input') {
      setTimeout(() => codeInputRef.current?.focus(), 100)
    }
  }, [step])

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // 发送验证码
  const handleSendCode = useCallback(async () => {
    if (!email.trim() || loading) return
    setError('')
    setLoading(true)

    const result = await auth.sendCode(email.trim())
    setLoading(false)

    if (result.ok) {
      setStep('code-input')
      setCountdown(60)
    } else {
      setError(result.error || '发送失败')
    }
  }, [email, loading, auth])

  // 验证验证码
  const handleVerifyCode = useCallback(async () => {
    if (code.length !== 6 || loading) return
    setError('')
    setLoading(true)

    const result = await auth.verifyCode(email.trim(), code)
    setLoading(false)

    if (result.ok) {
      onClose()
    } else {
      setError(result.error || '验证失败')
    }
  }, [email, code, loading, auth, onClose])

  // 自动提交：6 位码输完自动验证
  useEffect(() => {
    if (code.length === 6 && step === 'code-input') {
      handleVerifyCode()
    }
  }, [code, step, handleVerifyCode])

  // Google 登录成功
  const handleGoogleSuccess = useCallback(async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return
    setError('')
    setLoading(true)

    const result = await auth.loginWithGoogle(credentialResponse.credential)
    setLoading(false)

    if (result.ok) {
      onClose()
    } else {
      setError(result.error || 'Google 登录失败')
    }
  }, [auth, onClose])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]" onClick={onClose} />
      <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
            <div className="flex items-center gap-2">
              {step !== 'choose' && (
                <button
                  onClick={() => { setStep(step === 'code-input' ? 'email-input' : 'choose'); setError('') }}
                  className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <h2 className="text-sm font-bold text-foreground">
                {step === 'choose' ? '登录 / 注册' : step === 'email-input' ? '邮箱登录' : '输入验证码'}
              </h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-6">
            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {error}
              </div>
            )}

            {step === 'choose' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center mb-4">
                  首次登录自动创建账号
                </p>

                {/* 邮箱登录 */}
                <button
                  onClick={() => setStep('email-input')}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-border/60 bg-background hover:bg-accent text-sm font-medium text-foreground transition-colors"
                >
                  <Mail size={18} className="text-violet-500" />
                  邮箱验证码登录
                </button>

                {/* 分割线 */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-[10px] text-muted-foreground">或</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* Google 登录 */}
                <div className="flex justify-center [&>div]:w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google 登录失败')}
                    size="large"
                    width="320"
                    text="continue_with"
                    shape="pill"
                  />
                </div>
              </div>
            )}

            {step === 'email-input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">邮箱地址</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                    placeholder="you@example.com"
                    autoFocus
                    className="w-full px-3 py-2.5 rounded-xl border border-border/60 bg-background text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <button
                  onClick={handleSendCode}
                  disabled={!email.trim() || loading}
                  className="w-full px-4 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-violet-600 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  发送验证码
                </button>
              </div>
            )}

            {step === 'code-input' && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground text-center">
                  验证码已发送至 <span className="font-medium text-foreground">{email}</span>
                </p>
                <div>
                  <input
                    ref={codeInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition-all placeholder:text-muted-foreground/30 placeholder:tracking-[0.5em]"
                  />
                </div>
                <button
                  onClick={handleVerifyCode}
                  disabled={code.length !== 6 || loading}
                  className="w-full px-4 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-violet-600 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  验证并登录
                </button>
                <button
                  onClick={handleSendCode}
                  disabled={countdown > 0 || loading}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  {countdown > 0 ? `${countdown}s 后可重新发送` : '重新发送验证码'}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 pt-0">
            <p className="text-[10px] text-muted-foreground/50 text-center">
              登录即表示同意我们的服务条款和隐私政策
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
