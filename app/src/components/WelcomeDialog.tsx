import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Compass, CalendarDays, Shuffle, SlidersHorizontal, Sparkles, X } from 'lucide-react'

interface WelcomeDialogProps {
  open: boolean
  totalEvents: number
  onClose: () => void
  onStartExplore: () => void
  onOpenToday: () => void
  onRandomExplore: () => void
}

export function WelcomeDialog({
  open,
  totalEvents,
  onClose,
  onStartExplore,
  onOpenToday,
  onRandomExplore,
}: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0" showCloseButton={false}>
        <DialogTitle className="sr-only">欢迎来到 Chrono Atlas</DialogTitle>
        <DialogDescription className="sr-only">
          这是一个用于探索 6000 年人类文明时间线的交互式知识产品。
        </DialogDescription>

        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-slate-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_25%)]" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="关闭欢迎提示"
          >
            <X size={16} />
          </button>

          <div className="relative grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="px-6 py-7 md:px-8 md:py-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200">
                <Sparkles size={12} />
                欢迎来到文明探索模式
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                在一条时间线上，重新理解
                <span className="text-amber-300"> 6000 年人类文明</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-[15px]">
                Chrono Atlas 把重大事件、地区差异、时代节奏和主题脉络放进同一个探索界面里。第一次使用，建议先沿时间线浏览，再切到矩阵、对照和统计视图做横向观察。
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                  {totalEvents}+ 条事件
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                  4 种探索视图
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                  支持地区 / 类目 / 年份筛选
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={onStartExplore}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-amber-300"
                >
                  <Compass size={16} />
                  开始探索时间线
                </button>
                <button
                  onClick={onOpenToday}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <CalendarDays size={16} />
                  看看历史上的今天
                </button>
                <button
                  onClick={onRandomExplore}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-100 transition-colors hover:bg-violet-400/20"
                >
                  <Shuffle size={16} />
                  随机穿越一次
                </button>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/15 px-6 py-6 lg:border-l lg:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">快速上手</p>
              <div className="mt-4 space-y-3">
                {[
                  {
                    icon: Compass,
                    title: '先按时间线扫一遍',
                    text: '底部时代导航可以快速跳到远古、古典、中世纪或现代。',
                  },
                  {
                    icon: SlidersHorizontal,
                    title: '再收窄筛选范围',
                    text: '优先用类目、地区和年份筛掉噪音，再看事件之间的关系。',
                  },
                  {
                    icon: Sparkles,
                    title: '最后切视图找模式',
                    text: '矩阵看密度，对照看文明并行，统计看整体结构。',
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Icon size={15} className="text-amber-300" />
                        {item.title}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-300">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
