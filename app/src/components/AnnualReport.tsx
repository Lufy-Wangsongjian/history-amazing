import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, ERAS, formatYear } from '@/data/types'
import type { Category } from '@/data/types'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Download, Share2, Star, Clock, Globe, BookOpen, Trophy } from 'lucide-react'

interface AnnualReportProps {
  open: boolean
  onClose: () => void
  events: HistoricalEvent[]
  readIds: Set<string>
  unlockedAchievements: number
  totalAchievements: number
}

interface ReportStats {
  totalRead: number
  totalEvents: number
  readPercent: number
  erasExplored: { name: string; color: string; count: number }[]
  topCategories: { label: string; color: string; count: number }[]
  topRegions: { label: string; count: number }[]
  milestonesRead: number
  totalMilestones: number
  earliestEvent: HistoricalEvent | null
  latestEvent: HistoricalEvent | null
  longestStreak: number // 连续探索的时代数
  grade: { title: string; desc: string }
}

function computeStats(events: HistoricalEvent[], readIds: Set<string>): ReportStats {
  const readEvents = events.filter(e => readIds.has(e.id))
  const totalRead = readEvents.length
  const totalEvents = events.length
  const readPercent = totalEvents > 0 ? Math.round((totalRead / totalEvents) * 100) : 0

  // 时代分布
  const eraCountMap = new Map<string, number>()
  readEvents.forEach(e => {
    const era = ERAS.find(er => e.year >= er.startYear && e.year < er.endYear)
    if (era) eraCountMap.set(era.name, (eraCountMap.get(era.name) || 0) + 1)
  })
  const erasExplored = ERAS
    .filter(era => eraCountMap.has(era.name))
    .map(era => ({ name: era.name, color: era.color, count: eraCountMap.get(era.name) || 0 }))

  // 类目 top
  const catCountMap = new Map<string, number>()
  readEvents.forEach(e => catCountMap.set(e.category, (catCountMap.get(e.category) || 0) + 1))
  const topCategories = Array.from(catCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, count]) => {
      const cfg = CATEGORY_CONFIG[cat as Category]
      return { label: cfg?.label || cat, color: cfg?.color || '#888', count }
    })

  // 地区 top
  const regionCountMap = new Map<string, number>()
  readEvents.forEach(e => regionCountMap.set(e.region, (regionCountMap.get(e.region) || 0) + 1))
  const topRegions = Array.from(regionCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([, count]) => ({ label: '', count }))

  // 里程碑
  const milestonesRead = readEvents.filter(e => e.significance === 3).length
  const totalMilestones = events.filter(e => e.significance === 3).length

  // 最早/最晚
  const sorted = [...readEvents].sort((a, b) => a.year - b.year)
  const earliestEvent = sorted[0] || null
  const latestEvent = sorted[sorted.length - 1] || null

  // 连续时代
  const eraSet = new Set(erasExplored.map(e => e.name))
  let streak = 0, maxStreak = 0
  ERAS.forEach(era => {
    if (eraSet.has(era.name)) { streak++; maxStreak = Math.max(maxStreak, streak) }
    else streak = 0
  })

  // 等级
  let grade: { title: string; desc: string }
  if (totalRead >= 500) grade = { title: '文明守护者', desc: '你已走过人类文明史的大半旅程' }
  else if (totalRead >= 200) grade = { title: '时间旅行家', desc: '穿越千年，你的足迹遍布各个时代' }
  else if (totalRead >= 100) grade = { title: '历史探险家', desc: '好奇心驱动你探索更多未知领域' }
  else if (totalRead >= 30) grade = { title: '文明学徒', desc: '你已迈出探索历史的第一步' }
  else grade = { title: '初入历史', desc: '继续探索，更多精彩等待你发现' }

  return {
    totalRead, totalEvents, readPercent,
    erasExplored, topCategories, topRegions,
    milestonesRead, totalMilestones,
    earliestEvent, latestEvent,
    longestStreak: maxStreak, grade,
  }
}

function generateReportCard(stats: ReportStats): string {
  const canvas = document.createElement('canvas')
  const W = 400, H = 600
  canvas.width = W * 2
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas.toDataURL('image/png')
  ctx.scale(2, 2)

  // 背景
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
  bgGrad.addColorStop(0, '#0f0f23')
  bgGrad.addColorStop(0.5, '#1a1040')
  bgGrad.addColorStop(1, '#0a0a14')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // 顶部渐变装饰
  const topGrad = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W)
  topGrad.addColorStop(0, 'rgba(139,92,246,0.2)')
  topGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = topGrad
  ctx.fillRect(0, 0, W, 200)

  // 标题
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.textAlign = 'center'
  ctx.fillText('CHRONO ATLAS', W / 2, 36)

  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('我的探索报告', W / 2, 72)

  // 等级
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = '#a78bfa'
  ctx.fillText(stats.grade.title, W / 2, 106)

  ctx.font = '400 11px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(stats.grade.desc, W / 2, 126)

  // 核心数据
  ctx.textAlign = 'left'
  let y = 168

  const drawStat = (icon: string, label: string, value: string, color: string) => {
    ctx.font = '400 12px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillText(icon + ' ' + label, 36, y)
    ctx.font = '700 14px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = color
    ctx.textAlign = 'right'
    ctx.fillText(value, W - 36, y)
    ctx.textAlign = 'left'
    y += 32
  }

  drawStat('📖', '探索事件', `${stats.totalRead} / ${stats.totalEvents}`, '#60a5fa')
  drawStat('🌍', '覆盖时代', `${stats.erasExplored.length} / ${ERAS.length} 个`, '#34d399')
  drawStat('⭐', '里程碑发现', `${stats.milestonesRead} / ${stats.totalMilestones}`, '#fbbf24')
  drawStat('🔥', '最长连续时代', `${stats.longestStreak} 个时代`, '#f87171')

  // 最爱领域
  if (stats.topCategories.length > 0) {
    y += 8
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText('最爱领域', 36, y)
    y += 22
    stats.topCategories.slice(0, 3).forEach(cat => {
      ctx.font = '500 11px -apple-system, BlinkMacSystemFont, sans-serif'
      ctx.fillStyle = cat.color
      ctx.fillText(`● ${cat.label}`, 44, y)
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText(`${cat.count} 条`, 140, y)
      y += 20
    })
  }

  // 时间跨度
  if (stats.earliestEvent && stats.latestEvent) {
    y += 12
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText('时间跨度', 36, y)
    y += 22
    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText(`从 ${formatYear(stats.earliestEvent.year)} 到 ${formatYear(stats.latestEvent.year)}`, 44, y)
    const span = stats.latestEvent.year - stats.earliestEvent.year
    y += 18
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText(`跨越 ${span > 1000 ? (span / 1000).toFixed(1) + ' 千' : span} 年`, 44, y)
  }

  // 底部
  ctx.font = '400 9px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.textAlign = 'center'
  ctx.fillText('Chrono Atlas · 探索两万年文明', W / 2, H - 16)

  return canvas.toDataURL('image/png')
}

export function AnnualReport({ open, onClose, events, readIds, unlockedAchievements, totalAchievements }: AnnualReportProps) {
  const stats = useMemo(() => computeStats(events, readIds), [events, readIds])

  const handleDownload = () => {
    const dataUrl = generateReportCard(stats)
    const link = document.createElement('a')
    link.download = 'chrono-atlas-report.png'
    link.href = dataUrl
    link.click()
  }

  const handleShare = async () => {
    const dataUrl = generateReportCard(stats)
    const text = `我在 Chrono Atlas 探索了 ${stats.totalRead} 个历史事件，横跨 ${stats.erasExplored.length} 个时代！`

    if (navigator.share) {
      try {
        const blob = dataURLToBlob(dataUrl)
        const file = new File([blob], 'chrono-atlas-report.png', { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'Chrono Atlas 探索报告', text, files: [file] })
          return
        }
        await navigator.share({ title: 'Chrono Atlas 探索报告', text })
        return
      } catch {}
    }
    handleDownload()
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose() }}>
      <DialogContent className="max-w-md p-0 overflow-hidden gap-0 border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">我的探索报告</DialogTitle>
        <DialogDescription className="sr-only">基于阅读进度的年度学习统计报告</DialogDescription>

        <div className="flex flex-col bg-card rounded-lg overflow-hidden max-h-[min(90vh,750px)]">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white px-5 py-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.25),transparent_60%)]" />
            <div className="relative z-[1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">我的探索报告</h2>
                  <p className="text-[10px] text-slate-400">{stats.grade.title} · {stats.grade.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={handleShare} className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors" title="分享报告"><Share2 size={14} /></button>
                <button onClick={handleDownload} className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors" title="下载报告卡片"><Download size={14} /></button>
                <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"><X size={14} /></button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-5 space-y-5">
              {/* 核心数据卡片 */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<BookOpen size={16} />} label="探索事件" value={`${stats.totalRead}`} sub={`/ ${stats.totalEvents} 总量`} color="text-blue-400" />
                <StatCard icon={<Globe size={16} />} label="覆盖时代" value={`${stats.erasExplored.length}`} sub={`/ ${ERAS.length} 个时代`} color="text-emerald-400" />
                <StatCard icon={<Star size={16} />} label="里程碑" value={`${stats.milestonesRead}`} sub={`/ ${stats.totalMilestones}`} color="text-amber-400" />
                <StatCard icon={<Trophy size={16} />} label="解锁成就" value={`${unlockedAchievements}`} sub={`/ ${totalAchievements}`} color="text-violet-400" />
              </div>

              {/* 探索进度条 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">总体进度</span>
                  <span className="font-mono font-semibold text-foreground">{stats.readPercent}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500" style={{ width: `${stats.readPercent}%` }} />
                </div>
              </div>

              {/* 最爱领域 */}
              {stats.topCategories.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <span className="w-1 h-3 rounded-full bg-primary" /> 最爱领域
                  </h3>
                  <div className="space-y-1.5">
                    {stats.topCategories.map(cat => (
                      <div key={cat.label} className="flex items-center gap-2">
                        <span className="text-[10px] w-10 text-right" style={{ color: cat.color }}>{cat.label}</span>
                        <div className="flex-1 h-4 bg-muted/30 rounded overflow-hidden">
                          <div className="h-full rounded transition-all duration-500" style={{ width: `${(cat.count / stats.totalRead) * 100}%`, backgroundColor: cat.color + '60' }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-6">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 时代足迹 */}
              {stats.erasExplored.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <span className="w-1 h-3 rounded-full bg-emerald-500" /> 时代足迹
                    <span className="text-[10px] font-normal text-muted-foreground ml-1">连续 {stats.longestStreak} 个时代</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.erasExplored.map(era => (
                      <span key={era.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border" style={{ borderColor: era.color + '40', color: era.color, backgroundColor: era.color + '10' }}>
                        {era.name} <span className="opacity-60">{era.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 时间跨度 */}
              {stats.earliestEvent && stats.latestEvent && (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Clock size={12} className="text-blue-400" /> 时间跨度
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    从 <span className="text-foreground font-medium">{formatYear(stats.earliestEvent.year)}</span> 到{' '}
                    <span className="text-foreground font-medium">{formatYear(stats.latestEvent.year)}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    跨越 {(() => { const s = stats.latestEvent!.year - stats.earliestEvent!.year; return s > 1000 ? `${(s/1000).toFixed(1)} 千年` : `${s} 年` })()}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
      <div className={`flex items-center gap-1.5 mb-1.5 ${color}`}>
        {icon}
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">{sub}</span>
      </div>
    </div>
  )
}

function dataURLToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png'
  const binary = atob(base64)
  const arr = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
  return new Blob([arr], { type: mime })
}
