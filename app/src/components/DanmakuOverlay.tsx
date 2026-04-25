/**
 * 冷知识弹幕 — 飘浮式弹幕，从右向左滑过时间线上方
 */
import { useState, useEffect, useRef } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { generateFunFacts, type FunFact } from '@/lib/fun-facts'
import { MessageCircle, X } from 'lucide-react'

interface DanmakuOverlayProps {
  events: HistoricalEvent[]
  enabled: boolean
  onToggle: () => void
  onSelectEvent?: (event: HistoricalEvent) => void
}

interface DanmakuItem {
  id: number
  fact: FunFact
  y: number // percentage from top (5-30%)
  duration: number // animation duration in seconds
}

const MAX_VISIBLE = 3
const EMIT_INTERVAL_MS = 4000

export function DanmakuOverlay({ events, enabled, onToggle }: DanmakuOverlayProps) {
  const [items, setItems] = useState<DanmakuItem[]>([])
  const counterRef = useRef(0)
  const factsRef = useRef<FunFact[]>([])
  const factIndexRef = useRef(0)

  // Generate facts pool
  useEffect(() => {
    if (events.length > 0) {
      factsRef.current = generateFunFacts(events)
      factIndexRef.current = 0
    }
  }, [events])

  // Emit danmaku items
  useEffect(() => {
    if (!enabled || factsRef.current.length === 0) return

    const emit = () => {
      setItems(prev => {
        // Remove finished items (keep only recent ones)
        const active = prev.filter(item => Date.now() - item.id < (item.duration + 1) * 1000)
        if (active.length >= MAX_VISIBLE) return active

        const fact = factsRef.current[factIndexRef.current % factsRef.current.length]
        factIndexRef.current++

        const newItem: DanmakuItem = {
          id: Date.now() + counterRef.current++,
          fact,
          y: 5 + Math.random() * 25,
          duration: 10 + Math.random() * 5,
        }
        return [...active, newItem]
      })
    }

    emit() // emit first one immediately
    const timer = setInterval(emit, EMIT_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [enabled])

  // Cleanup on disable
  useEffect(() => {
    if (!enabled) setItems([])
  }, [enabled])

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
          enabled
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
            : 'bg-card/80 text-muted-foreground/50 border border-border/30 hover:bg-accent hover:text-muted-foreground'
        }`}
        title={enabled ? '关闭弹幕' : '开启冷知识弹幕'}
      >
        {enabled ? <X size={10} /> : <MessageCircle size={10} />}
        <span className="hidden sm:inline">弹幕</span>
      </button>

      {/* Danmaku layer */}
      {enabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {items.map(item => (
            <div
              key={item.id}
              className="absolute whitespace-nowrap pointer-events-auto cursor-default
                px-3 py-1.5 rounded-full
                bg-foreground/90 dark:bg-foreground/85
                text-background dark:text-background
                text-xs font-medium shadow-md"
              style={{
                top: `${item.y}%`,
                animation: `danmaku-slide ${item.duration}s linear forwards`,
              }}
            >
              <span className="mr-1.5">{item.fact.emoji}</span>
              {item.fact.text.length > 60 ? item.fact.text.slice(0, 58) + '…' : item.fact.text}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
