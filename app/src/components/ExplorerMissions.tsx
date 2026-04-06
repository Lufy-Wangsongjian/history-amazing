import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ExplorerMission } from '@/hooks/useExplorerMissions'
import { Compass, Crown, Link2, Sparkles, Target, X } from 'lucide-react'

interface ExplorerMissionsProps {
  open: boolean
  onClose: () => void
  missions: ExplorerMission[]
  onApplyMission: (mission: ExplorerMission) => void
}

function MissionIcon({ kind }: Pick<ExplorerMission, 'kind'>) {
  if (kind === 'era') return <Compass size={16} className="text-amber-300" />
  if (kind === 'category') return <Target size={16} className="text-sky-300" />
  return <Link2 size={16} className="text-violet-300" />
}

export function ExplorerMissions({ open, onClose, missions, onApplyMission }: ExplorerMissionsProps) {
  const completedCount = missions.filter(mission => mission.completed).length

  return (
    <Dialog open={open} onOpenChange={nextOpen => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-xl p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">文明挑战</DialogTitle>
        <DialogDescription className="sr-only">基于当前时间线自动生成的趣味探索任务</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(88vh,760px)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-amber-950 to-orange-950 text-white px-5 py-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.18),transparent_45%)]" />
            <div className="relative z-[1]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Crown size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">今日文明挑战</h2>
                    <p className="text-[11px] text-amber-100/70 mt-0.5">把 6000 年文明时间线玩成一张可以闯关的地图</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="关闭文明挑战"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/60">今日进度</p>
                  <p className="mt-1 text-2xl font-bold">{completedCount} / {missions.length}</p>
                  <p className="text-[11px] text-amber-100/60">完成挑战后再去看历史，会更像在玩一场时间冒险。</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-amber-100/60">
                    <Sparkles size={12} />
                    今日奖励
                  </div>
                  <p className="mt-2 text-sm font-semibold">护照印章 / 线索卡 / 时间侦探进度</p>
                  <p className="mt-1 text-[11px] text-amber-100/60">不是硬核 KPI，而是帮你更有目标地乱逛。</p>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-3">
              {missions.map(mission => {
                const progress = mission.targetCount > 0
                  ? Math.min((mission.progressCount / mission.targetCount) * 100, 100)
                  : 0

                return (
                  <section
                    key={mission.id}
                    className={`rounded-2xl border bg-gradient-to-br ${mission.accentClass} p-4 shadow-sm`}
                    data-testid={`mission-card-${mission.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-9 h-9 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center">
                          <MissionIcon kind={mission.kind} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-foreground">{mission.title}</h3>
                            {mission.completed && (
                              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                                已完成
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground leading-6">{mission.description}</p>
                          <p className="mt-2 text-[11px] text-muted-foreground">{mission.hint}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{Math.min(mission.progressCount, mission.targetCount)} / {mission.targetCount}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Progress</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="h-2 overflow-hidden rounded-full bg-background/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <span className="text-muted-foreground">{mission.reward}</span>
                        <button
                          onClick={() => onApplyMission(mission)}
                          className="inline-flex items-center rounded-xl border border-border/50 bg-background/80 px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-accent"
                        >
                          {mission.ctaLabel}
                        </button>
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
