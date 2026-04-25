/**
 * 新用户引导卡片 — 前 3 次打开时在时间线顶部展示功能引导
 * 每次展示 1 张，点击后消失并记住，3 张全部消失后不再显示
 */
import { useState, useEffect } from 'react'
import { BookOpen, Grid3X3, Brain, X, ArrowRight } from 'lucide-react'

const STORAGE_KEY = 'chrono-atlas-onboarding-step'

interface GuideCard {
  id: number
  icon: React.ReactNode
  title: string
  desc: string
  action: string
}

const CARDS: GuideCard[] = [
  {
    id: 0,
    icon: <BookOpen size={18} className="text-emerald-500" />,
    title: '试试策展路线',
    desc: '跟随专家精心编排的学习路径，深度探索丝绸之路、文艺复兴等主题。',
    action: '打开策展路线',
  },
  {
    id: 1,
    icon: <Grid3X3 size={18} className="text-violet-500" />,
    title: '查看你的探索热力图',
    desc: '一张图看清你探索了哪些时代和类别，发现知识盲区。',
    action: '打开热力图',
  },
  {
    id: 2,
    icon: <Brain size={18} className="text-pink-500" />,
    title: '挑战知识测验',
    desc: '6 种互动游戏等你来玩：测验、连连看、猜谜、排序、对决……',
    action: '开始挑战',
  },
]

interface OnboardingGuideProps {
  onAction: (cardId: number) => void
}

export function OnboardingGuide({ onAction }: OnboardingGuideProps) {
  const [step, setStep] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored !== null ? Number(stored) : 0
    } catch {
      return 0
    }
  })
  const [visible, setVisible] = useState(true)

  // 每次 dismiss 后持久化
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(step)) } catch {}
  }, [step])

  if (step >= CARDS.length || !visible) return null

  const card = CARDS[step]

  return (
    <div className="mx-3 md:mx-4 mt-2 mb-1">
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex-shrink-0 mt-0.5">{card.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground">{card.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{card.desc}</p>
          <button
            onClick={() => {
              onAction(card.id)
              setStep(prev => prev + 1)
            }}
            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-violet-500 hover:text-violet-600 transition-colors"
          >
            {card.action}
            <ArrowRight size={12} />
          </button>
        </div>
        <button
          onClick={() => setStep(prev => prev + 1)}
          className="flex-shrink-0 p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground"
          title="跳过"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
