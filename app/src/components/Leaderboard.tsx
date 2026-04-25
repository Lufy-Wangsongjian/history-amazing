/**
 * 周排行榜组件
 * 展示当前周的阅读量 / 测验分数排行榜
 */
import { useState, useEffect } from 'react'
import { Trophy, Crown, Medal, Award } from 'lucide-react'
import { fetchLeaderboard, type LeaderboardResponse } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface LeaderboardProps {
  open: boolean
  onClose: () => void
}

const SCORE_TYPES = [
  { value: 'read_count', label: '阅读量' },
  { value: 'quiz_score', label: '测验最高分' },
  { value: 'challenge_score', label: '对决最高分' },
] as const

const RANK_ICONS = [
  <Crown key="1" size={14} className="text-amber-500" />,
  <Medal key="2" size={14} className="text-slate-400" />,
  <Award key="3" size={14} className="text-amber-700" />,
]

export function Leaderboard({ open, onClose }: LeaderboardProps) {
  const [scoreType, setScoreType] = useState<string>('read_count')
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetchLeaderboard(scoreType)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [open, scoreType])

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-md max-h-[min(88vh,700px)] flex flex-col overflow-hidden">
        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
          <Trophy size={20} className="text-amber-500" />
          周排行榜
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {data?.weekKey ? `${data.weekKey}` : '本周'} · 每周一重置
        </DialogDescription>

        {/* 类型切换 */}
        <div className="flex gap-1.5 mt-2">
          {SCORE_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setScoreType(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                scoreType === t.value
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-muted/30 text-muted-foreground border border-transparent hover:bg-muted/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 排行列表 */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-3 space-y-1">
          {loading && (
            <div className="py-12 text-center text-sm text-muted-foreground">加载中...</div>
          )}

          {!loading && data && data.top.length === 0 && (
            <div className="py-12 text-center">
              <Trophy size={32} className="mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">本周还没有数据</p>
              <p className="text-xs text-muted-foreground/60 mt-1">开始探索以登上排行榜！</p>
            </div>
          )}

          {!loading && data && data.top.map((entry, idx) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                idx < 3 ? 'bg-amber-500/5 border border-amber-500/10' : 'border border-transparent'
              }`}
            >
              <div className="w-6 text-center flex-shrink-0">
                {idx < 3 ? RANK_ICONS[idx] : (
                  <span className="text-xs text-muted-foreground font-mono">{idx + 1}</span>
                )}
              </div>
              <div className="flex-shrink-0">
                {entry.avatar ? (
                  <img src={entry.avatar} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-500 flex items-center justify-center text-[10px] font-bold">
                    {entry.nickname[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground truncate block">{entry.nickname}</span>
              </div>
              <div className="text-sm font-bold text-foreground tabular-nums">{entry.score}</div>
            </div>
          ))}
        </div>

        {/* 我的排名 */}
        {data?.me && (
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-3 px-3 py-2 rounded-lg bg-violet-500/5 border border-violet-500/10">
            <div className="w-6 text-center flex-shrink-0">
              <span className="text-xs text-violet-500 font-bold">#{data.me.rank}</span>
            </div>
            <div className="flex-1 text-sm font-medium text-foreground">我的排名</div>
            <div className="text-sm font-bold text-foreground tabular-nums">{data.me.score}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
