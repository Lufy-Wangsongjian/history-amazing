import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Achievement } from '@/hooks/useProgress'
import { Trophy, X, Lock } from 'lucide-react'

interface AchievementsPanelProps {
  open: boolean
  onClose: () => void
  unlocked: Achievement[]
  locked: Achievement[]
  readCount: number
  totalEvents: number
}

export function AchievementsPanel({
  open, onClose, unlocked, locked, readCount, totalEvents
}: AchievementsPanelProps) {
  const progressPct = totalEvents > 0 ? Math.round((readCount / totalEvents) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose() }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">文明成就</DialogTitle>
        <DialogDescription className="sr-only">你的学习进度和解锁的成就</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(85vh,700px)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-yellow-950 to-slate-950 text-white px-5 py-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.2),transparent_50%)]" />
            <div className="relative z-[1]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                    <Trophy size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">文明成就</h2>
                    <p className="text-[10px] text-slate-400">
                      已解锁 {unlocked.length} / {unlocked.length + locked.length} 个成就
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* 学习进度条 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-300">学习进度</span>
                  <span className="text-xs font-mono text-amber-400">
                    {readCount} / {totalEvents} 事件已读 ({progressPct}%)
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 成就列表 */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              {/* 已解锁 */}
              {unlocked.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-2">
                    ✨ 已解锁 ({unlocked.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {unlocked.map(a => (
                      <div
                        key={a.id}
                        className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center"
                      >
                        <div className="text-2xl mb-1">{a.emoji}</div>
                        <p className="text-xs font-semibold text-foreground">{a.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 未解锁 */}
              {locked.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    🔒 未解锁 ({locked.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {locked.map(a => (
                      <div
                        key={a.id}
                        className="rounded-lg border border-border/30 bg-muted/20 p-3 text-center opacity-50"
                      >
                        <div className="text-2xl mb-1 grayscale">
                          <Lock size={20} className="mx-auto text-muted-foreground" />
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">{a.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
