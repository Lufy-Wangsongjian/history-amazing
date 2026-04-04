import { useState, useEffect } from 'react'
import { Keyboard, X } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['J', '↓'], desc: '下一个事件' },
  { keys: ['K', '↑'], desc: '上一个事件' },
  { keys: ['/'], desc: '聚焦搜索框' },
  { keys: ['⌘', 'K'], desc: '聚焦搜索框' },
  { keys: ['Esc'], desc: '关闭详情 / 取消聚焦' },
  { keys: ['?'], desc: '显示此快捷键帮助' },
]

export function KeyboardShortcutsHelp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(true)
    window.addEventListener('chrono-show-shortcuts', handler)
    return () => window.removeEventListener('chrono-show-shortcuts', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      <div
        className="bg-card border border-border/60 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Keyboard size={16} className="text-primary" />
            键盘快捷键
          </h3>
          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
        <div className="space-y-2.5">
          {SHORTCUTS.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{shortcut.desc}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, ki) => (
                  <span key={ki}>
                    {ki > 0 && <span className="text-[10px] text-muted-foreground mx-0.5">+</span>}
                    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md border border-border bg-muted text-[11px] font-mono font-medium text-foreground">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground text-center">
          在输入框中只有 Esc 生效
        </p>
      </div>
    </div>
  )
}
