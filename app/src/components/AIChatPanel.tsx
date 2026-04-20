import { useState, useCallback, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Sparkles, Loader2, Trash2 } from 'lucide-react'

interface AIChatPanelProps {
  onNavigateToEvent?: (query: string) => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  '秦始皇和亚历山大大帝谁更早？',
  '带我了解丝绸之路的历史',
  '二战有哪些关键转折点？',
  '哪些发明改变了人类文明进程？',
  '文艺复兴为什么发生在意大利？',
  '中国四大发明对世界有什么影响？',
]

export function AIChatPanel({ onNavigateToEvent }: AIChatPanelProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // 打开时聚焦输入框
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return
    const userMsg: ChatMessage = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    // 开始流式接收
    const assistantMsg: ChatMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: '抱歉，请求失败了。请稍后再试。' }
          return copy
        })
        setIsStreaming(false)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.done) break
            if (data.content) {
              setMessages(prev => {
                const copy = [...prev]
                const last = copy[copy.length - 1]
                copy[copy.length - 1] = { ...last, content: last.content + data.content }
                return copy
              })
            }
          } catch { /* 忽略解析错误 */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages(prev => {
          const copy = [...prev]
          if (copy[copy.length - 1]?.role === 'assistant' && !copy[copy.length - 1].content) {
            copy[copy.length - 1] = { role: 'assistant', content: '连接中断，请检查网络后重试。' }
          }
          return copy
        })
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [isStreaming])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }, [input, sendMessage])

  const clearChat = useCallback(() => {
    if (isStreaming) {
      abortRef.current?.abort()
    }
    setMessages([])
  }, [isStreaming])

  // 处理【事件名称】格式的点击跳转
  const renderContent = useCallback((text: string) => {
    const parts = text.split(/【([^】]+)】/)
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // 事件名称 — 可点击
        return (
          <button
            key={i}
            onClick={() => onNavigateToEvent?.(part)}
            className="text-primary hover:underline font-medium inline"
          >
            {part}
          </button>
        )
      }
      return <span key={i}>{part}</span>
    })
  }, [onNavigateToEvent])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all"
        title="AI 时光向导"
      >
        <MessageCircle size={22} />
      </button>
    )
  }

  return (
    <>
      {/* 移动端遮罩 */}
      <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setOpen(false)} />
      <div className="fixed z-50 flex flex-col overflow-hidden border border-border/60 bg-card shadow-2xl
        inset-x-0 bottom-0 h-[80vh] rounded-t-2xl rounded-b-none
        md:inset-auto md:bottom-6 md:right-6 md:w-[360px] md:h-[520px] md:max-h-[calc(100vh-6rem)] md:rounded-2xl">
      {/* 移动端抓手 */}
      <div
        className="md:hidden flex-shrink-0 flex justify-center py-2 cursor-pointer"
        onClick={() => setOpen(false)}
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-3 flex-shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">时光向导</h3>
              <p className="text-[10px] text-white/60">AI 历史问答</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors" title="清空对话">
                <Trash2 size={14} />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-4">
            <Sparkles size={28} className="mx-auto mb-2 text-violet-400" />
            <p className="text-sm font-medium text-foreground mb-1">你好！我是时光向导</p>
            <p className="text-xs text-muted-foreground mb-4">问我任何历史问题，或选择下方话题开始</p>
            <div className="space-y-1.5">
              {SUGGESTIONS.slice(0, 4).map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-violet-300 hover:bg-violet-500/5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
              msg.role === 'user'
                ? 'bg-violet-500 text-white rounded-br-md'
                : 'bg-muted/50 text-foreground rounded-bl-md border border-border/30'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="whitespace-pre-wrap">
                  {msg.content ? renderContent(msg.content) : (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 size={12} className="animate-spin" /> 思考中...
                    </span>
                  )}
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border/50 px-3 py-2.5 bg-card">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="问任何历史问题..."
            disabled={isStreaming}
            className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition-all disabled:opacity-50 placeholder:text-muted-foreground/50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="p-2.5 rounded-xl bg-violet-500 text-white disabled:opacity-40 hover:bg-violet-600 transition-colors flex-shrink-0"
          >
            {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
