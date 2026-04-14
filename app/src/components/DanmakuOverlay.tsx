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
        className={`absolute top-14 right-14 z-20 p-1.5 rounded-md transition-colors hidden md:block ${
          enabled
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'bg-card/80 text-muted-foreground border border-border/30 hover:bg-accent'
        }`}
        title={enabled ? '关闭弹幕' : '开启冷知识弹幕'}
      >
        {enabled ? <X size={12} /> : <MessageCircle size={12} />}
      </button>

      {/* Danmaku layer */}
      {enabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {items.map(item => (
            <div
              key={item.id}
              className="absolute whitespace-nowrap pointer-events-auto cursor-pointer
                px-3 py-1 rounded-full bg-card/70 backdrop-blur-sm border border-border/20 shadow-sm
                text-[11px] text-muted-foreground/70 hover:text-foreground hover:bg-card/90 transition-colors"
              style={{
                top: `${item.y}%`,
                animation: `danmaku-slide ${item.duration}s linear forwards`,
              }}
              onClick={() => {
                // Can't easily link to specific event from fun-facts, just dismiss
              }}
            >
              <span className="mr-1">{item.fact.emoji}</span>
              {item.fact.text.length > 60 ? item.fact.text.slice(0, 58) + '…' : item.fact.text}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
