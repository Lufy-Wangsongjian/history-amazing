import { useEffect, useState, useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG } from '@/data/types'

interface CausalArcsProps {
  selectedEvent: HistoricalEvent | null
  events: HistoricalEvent[]
  containerRef: React.RefObject<HTMLDivElement | null>
  yearRefs: React.RefObject<Map<number, HTMLDivElement>>
}

interface ArcData {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  colorFrom: string
  colorTo: string
  targetTitle: string
}

export function CausalArcs({ selectedEvent, events, containerRef, yearRefs }: CausalArcsProps) {
  const [arcs, setArcs] = useState<ArcData[]>([])
  const [containerRect, setContainerRect] = useState({ width: 0, height: 0, scrollTop: 0 })

  const relatedEventsMap = useMemo(() => {
    const map = new Map<string, HistoricalEvent>()
    events.forEach(e => map.set(e.id, e))
    return map
  }, [events])

  useEffect(() => {
    if (!selectedEvent?.relatedIds?.length || !containerRef.current || !yearRefs.current) {
      setArcs([])
      return
    }

    const container = containerRef.current
    const containerBounds = container.getBoundingClientRect()

    const getEventPosition = (event: HistoricalEvent): { x: number; y: number } | null => {
      const yearEl = yearRefs.current?.get(event.year)
      if (!yearEl) return null
      const rect = yearEl.getBoundingClientRect()
      return {
        x: rect.left - containerBounds.left + rect.width / 2,
        y: rect.top - containerBounds.top + container.scrollTop + rect.height / 2,
      }
    }

    const sourcePos = getEventPosition(selectedEvent)
    if (!sourcePos) {
      setArcs([])
      return
    }

    const newArcs: ArcData[] = []
    const sourceColor = CATEGORY_CONFIG[selectedEvent.category].color

    selectedEvent.relatedIds.forEach(relId => {
      const targetEvent = relatedEventsMap.get(relId)
      if (!targetEvent) return

      const targetPos = getEventPosition(targetEvent)
      if (!targetPos) return

      const targetColor = CATEGORY_CONFIG[targetEvent.category].color

      newArcs.push({
        id: `${selectedEvent.id}-${relId}`,
        x1: sourcePos.x,
        y1: sourcePos.y,
        x2: targetPos.x,
        y2: targetPos.y,
        colorFrom: sourceColor,
        colorTo: targetColor,
        targetTitle: targetEvent.title,
      })
    })

    setArcs(newArcs)
    setContainerRect({
      width: container.scrollWidth,
      height: container.scrollHeight,
      scrollTop: container.scrollTop,
    })
  }, [selectedEvent, events, containerRef, yearRefs, relatedEventsMap])

  if (arcs.length === 0) return null

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-[5]"
      width={containerRect.width || '100%'}
      height={containerRect.height || '100%'}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {arcs.map(arc => (
          <linearGradient
            key={`grad-${arc.id}`}
            id={`causal-grad-${arc.id}`}
            x1={arc.x1}
            y1={arc.y1}
            x2={arc.x2}
            y2={arc.y2}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={arc.colorFrom} stopOpacity={0.7} />
            <stop offset="100%" stopColor={arc.colorTo} stopOpacity={0.7} />
          </linearGradient>
        ))}
      </defs>

      {arcs.map(arc => {
        const dx = arc.x2 - arc.x1
        const dy = arc.y2 - arc.y1
        const dist = Math.sqrt(dx * dx + dy * dy)
        // 弧线弯曲程度
        const curvature = Math.min(dist * 0.3, 120)
        const midX = (arc.x1 + arc.x2) / 2
        const midY = (arc.y1 + arc.y2) / 2
        // 向左弯曲
        const cpX = midX - curvature
        const cpY = midY

        const pathD = `M ${arc.x1} ${arc.y1} Q ${cpX} ${cpY} ${arc.x2} ${arc.y2}`
        const pathLength = dist * 1.2

        return (
          <g key={arc.id}>
            {/* 弧线底层辉光 */}
            <path
              d={pathD}
              fill="none"
              stroke={arc.colorFrom}
              strokeWidth={4}
              strokeOpacity={0.15}
              strokeLinecap="round"
              filter="blur(3px)"
            />
            {/* 弧线主体 */}
            <path
              d={pathD}
              fill="none"
              stroke={`url(#causal-grad-${arc.id})`}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength}
              className="causal-arc-draw"
            />
            {/* 方向性脉冲光点 */}
            <circle r={3} fill={arc.colorTo} opacity={0.9}>
              <animateMotion dur="2s" repeatCount="indefinite" path={pathD} />
            </circle>
            <circle r={6} fill={arc.colorTo} opacity={0.2}>
              <animateMotion dur="2s" repeatCount="indefinite" path={pathD} />
            </circle>
            {/* 终点箭头 */}
            <circle cx={arc.x2} cy={arc.y2} r={5} fill={arc.colorTo} opacity={0.6} />
          </g>
        )
      })}
    </svg>
  )
}
