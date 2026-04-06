import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'

interface FigureWordCloudProps {
  events: HistoricalEvent[]
  onSearch?: (query: string) => void
}

export function FigureWordCloud({ events, onSearch }: FigureWordCloudProps) {
  const words = useMemo(() => {
    const figureMap = new Map<string, number>()

    events.forEach(e => {
      if (e.figure) {
        // 有些事件 figure 字段包含多个人物用"、"或","分隔
        const names = e.figure.split(/[、,，/]/).map(n => n.trim()).filter(Boolean)
        names.forEach(name => {
          figureMap.set(name, (figureMap.get(name) || 0) + 1)
        })
      }
    })

    const sorted = Array.from(figureMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 60)

    if (sorted.length === 0) return []

    const maxCount = sorted[0][1]
    const minCount = sorted[sorted.length - 1][1]
    const range = Math.max(maxCount - minCount, 1)

    return sorted.map(([text, count]) => ({
      text,
      count,
      fontSize: 11 + ((count - minCount) / range) * 18, // 11px ~ 29px
    }))
  }, [events])

  if (words.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-muted-foreground">
        当前筛选条件下没有人物数据
      </div>
    )
  }

  // 基于文字内容生成伪随机色相（一致的哈希）
  const getColor = (text: string, count: number): string => {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i)
      hash |= 0
    }
    const hue = Math.abs(hash) % 360
    const saturation = 50 + (count > 2 ? 20 : 0)
    const lightness = 55 + (count > 3 ? 10 : 0)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 py-2">
      {words.map(word => (
        <button
          key={word.text}
          onClick={() => onSearch?.(word.text)}
          className="transition-all duration-200 hover:scale-110 hover:opacity-100 cursor-pointer leading-tight"
          style={{
            fontSize: `${word.fontSize}px`,
            color: getColor(word.text, word.count),
            opacity: 0.6 + (word.count > 2 ? 0.3 : 0.1),
            fontWeight: word.fontSize > 20 ? 700 : word.fontSize > 15 ? 600 : 400,
          }}
          title={`${word.text} — 出现 ${word.count} 次，点击搜索`}
        >
          {word.text}
        </button>
      ))}
    </div>
  )
}
