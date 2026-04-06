import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Achievement } from '@/hooks/useProgress'
import { Compass, Lock, Sparkles, Stamp, Trophy, X } from 'lucide-react'

interface PassportStamp {
  label: string
  unlocked: boolean
  tone?: string
}

interface AchievementsPanelProps {
  open: boolean
  onClose: () => void
  unlocked: Achievement[]
  locked: Achievement[]
  readCount: number
  totalEvents: number
  passportEras: PassportStamp[]
  passportCategories: PassportStamp[]
  nextUnlocks: Achievement[]
}

export function AchievementsPanel({
  open,
  onClose,
  unlocked,
  locked,
  readCount,
  totalEvents,
  passportEras,
  passportCategories,
  nextUnlocks,
}: AchievementsPanelProps) {
  const progressPct = totalEvents > 0 ? Math.round((readCount / totalEvents) * 100) : 0
  const unlockedEraCount = passportEras.filter(stamp => stamp.unlocked).length
  const unlockedCategoryCount = passportCategories.filter(stamp => stamp.unlocked).length

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose() }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">文明成就</DialogTitle>
        <DialogDescription className="sr-only">你的学习进度、文明护照和下一步解锁建议</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(88vh,760px)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-yellow-950 to-slate-950 text-white px-5 py-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.2),transparent_50%)]" />
            <div className="relative z-[1]">
              <div className="flex items-center justify-between mb-4 gap-3">
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

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-4">
              <section className="rounded-2xl border border-border/50 bg-card/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Stamp size={16} className="text-amber-500" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">文明护照</h3>
                      <p className="text-[11px] text-muted-foreground">把读过的时代和领域盖成一页真正有进度感的护照。</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-muted-foreground">
                    <p>时代印章 {unlockedEraCount} / {passportEras.length}</p>
                    <p>领域印章 {unlockedCategoryCount} / {passportCategories.length}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      <Compass size={12} />
                      时代足迹
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {passportEras.map(stamp => (
                        <div
                          key={stamp.label}
                          className={`rounded-xl border px-3 py-2 text-xs transition-colors ${stamp.unlocked ? 'border-amber-500/30 bg-amber-500/10 text-foreground' : 'border-border/40 bg-muted/20 text-muted-foreground'}`}
                        >
                          {stamp.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      <Sparkles size={12} />
                      领域图章
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {passportCategories.map(stamp => (
                        <div
                          key={stamp.label}
                          className={`rounded-xl border px-3 py-2 text-xs transition-colors ${stamp.unlocked ? 'text-foreground' : 'text-muted-foreground border-border/40 bg-muted/20'}`}
                          style={stamp.unlocked ? {
                            borderColor: `${stamp.tone}55`,
                            backgroundColor: `${stamp.tone}18`,
                          } : undefined}
                        >
                          {stamp.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {nextUnlocks.length > 0 && (
                <section className="rounded-2xl border border-border/50 bg-card/50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-violet-500" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">下一步最容易解锁</h3>
                      <p className="text-[11px] text-muted-foreground">不用全清成就，先把最顺手的几个拿下就行。</p>
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    {nextUnlocks.map(achievement => (
                      <div key={achievement.id} className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{achievement.emoji}</span>
                          <p className="text-xs font-semibold text-foreground">{achievement.title}</p>
                        </div>
                        <p className="mt-2 text-[11px] text-muted-foreground">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {unlocked.length > 0 && (
                <section>
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-2">
                    ✨ 已解锁 ({unlocked.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                </section>
              )}

              {locked.length > 0 && (
                <section>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    🔒 未解锁 ({locked.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                </section>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
