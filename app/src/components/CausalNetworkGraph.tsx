import { useMemo, useCallback } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, formatYear } from '@/data/types'

interface CausalNetworkGraphProps {
  event: HistoricalEvent
  relatedEvents: HistoricalEvent[]
  onSelectEvent: (event: HistoricalEvent) => void
}

interface GraphNode {
  id: string
  label: string
  year: number
  category: string
  color: string
  isCurrent: boolean
  x: number
  y: number
  radius: number
}

interface GraphEdge {
  from: string
  to: string
  isBefore: boolean
}

const GRAPH_WIDTH = 360
const GRAPH_HEIGHT = 280
const CENTER_X = GRAPH_WIDTH / 2
const CENTER_Y = GRAPH_HEIGHT / 2
const ORBIT_RX = 130
const ORBIT_RY = 95
const CENTER_RADIUS = 24
const NODE_RADIUS = 16

export function CausalNetworkGraph({ event, relatedEvents, onSelectEvent }: CausalNetworkGraphProps) {
  const { nodes, edges } = useMemo(() => {
    const sorted = [...relatedEvents].sort((a, b) => a.year - b.year)

    const graphNodes: GraphNode[] = []
    const graphEdges: GraphEdge[] = []

    // Center node = current event
    graphNodes.push({
      id: event.id,
      label: truncate(event.title, 6),
      year: event.year,
      category: event.category,
      color: CATEGORY_CONFIG[event.category].color,
      isCurrent: true,
      x: CENTER_X,
      y: CENTER_Y,
      radius: CENTER_RADIUS,
    })

    // Place related events in a circle around center
    const count = sorted.length
    sorted.forEach((related, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2
      const x = CENTER_X + ORBIT_RX * Math.cos(angle)
      const y = CENTER_Y + ORBIT_RY * Math.sin(angle)

      graphNodes.push({
        id: related.id,
        label: truncate(related.title, 5),
        year: related.year,
        category: related.category,
        color: CATEGORY_CONFIG[related.category].color,
        isCurrent: false,
        x,
        y,
        radius: NODE_RADIUS,
      })

      graphEdges.push({
        from: related.year <= event.year ? related.id : event.id,
        to: related.year <= event.year ? event.id : related.id,
        isBefore: related.year <= event.year,
      })
    })

    // Inter-related edges (if any two related events also reference each other)
    const relatedIdSets = new Map<string, Set<string>>()
    for (const r of sorted) {
      if (r.relatedIds) {
        relatedIdSets.set(r.id, new Set(r.relatedIds))
      }
    }
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i]
        const b = sorted[j]
        const aRefs = relatedIdSets.get(a.id)
        const bRefs = relatedIdSets.get(b.id)
        if (aRefs?.has(b.id) || bRefs?.has(a.id)) {
          graphEdges.push({
            from: a.year <= b.year ? a.id : b.id,
            to: a.year <= b.year ? b.id : a.id,
            isBefore: true,
          })
        }
      }
    }

    return { nodes: graphNodes, edges: graphEdges }
  }, [event, relatedEvents])

  const handleClick = useCallback((nodeId: string) => {
    if (nodeId === event.id) return
    const target = relatedEvents.find(e => e.id === nodeId)
    if (target) onSelectEvent(target)
  }, [event.id, relatedEvents, onSelectEvent])

  if (relatedEvents.length === 0) return null

  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  return (
    <div className="mb-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
      <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
          <circle cx="12" cy="12" r="2" />
          <circle cx="4" cy="6" r="2" />
          <circle cx="20" cy="6" r="2" />
          <circle cx="4" cy="18" r="2" />
          <circle cx="20" cy="18" r="2" />
          <line x1="6" y1="7" x2="10" y2="11" />
          <line x1="14" y1="11" x2="18" y2="7" />
          <line x1="6" y1="17" x2="10" y2="13" />
          <line x1="14" y1="13" x2="18" y2="17" />
        </svg>
        因果关联网络
      </h3>
      <p className="text-[10px] text-muted-foreground mb-3">
        中心为当前事件，周围节点为因果关联事件。箭头方向表示因果传导方向。点击节点可跳转。
      </p>
      <svg
        viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
        className="w-full max-w-[420px] mx-auto"
        style={{ height: 'auto', maxHeight: '280px' }}
      >
        <defs>
          <marker
            id="causal-arrow"
            markerWidth="6"
            markerHeight="4"
            refX="5"
            refY="2"
            orient="auto"
          >
            <path d="M0,0 L6,2 L0,4" fill="currentColor" className="text-purple-400/60" />
          </marker>
          <marker
            id="causal-arrow-inter"
            markerWidth="5"
            markerHeight="3"
            refX="4"
            refY="1.5"
            orient="auto"
          >
            <path d="M0,0 L5,1.5 L0,3" fill="currentColor" className="text-muted-foreground/30" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const fromNode = nodeMap.get(edge.from)
          const toNode = nodeMap.get(edge.to)
          if (!fromNode || !toNode) return null

          const dx = toNode.x - fromNode.x
          const dy = toNode.y - fromNode.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const nx = dx / dist
          const ny = dy / dist

          const x1 = fromNode.x + nx * fromNode.radius
          const y1 = fromNode.y + ny * fromNode.radius
          const x2 = toNode.x - nx * toNode.radius
          const y2 = toNode.y - ny * toNode.radius

          const isInterRelated = !fromNode.isCurrent && !toNode.isCurrent
          return (
            <line
              key={`edge-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={isInterRelated ? 1 : 1.5}
              strokeDasharray={isInterRelated ? '3,3' : undefined}
              className={isInterRelated ? 'text-muted-foreground/20' : 'text-purple-400/50'}
              markerEnd={isInterRelated ? 'url(#causal-arrow-inter)' : 'url(#causal-arrow)'}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            className={node.isCurrent ? '' : 'cursor-pointer'}
            onClick={() => handleClick(node.id)}
          >
            {/* Glow for center */}
            {node.isCurrent && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius + 4}
                fill={node.color}
                opacity={0.15}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill={`${node.color}20`}
              stroke={node.color}
              strokeWidth={node.isCurrent ? 2.5 : 1.5}
            />
            {/* Label */}
            <text
              x={node.x}
              y={node.y - 3}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={node.isCurrent ? 9 : 8}
              fontWeight={node.isCurrent ? 600 : 400}
              fill="currentColor"
              className="text-foreground"
            >
              {node.label}
            </text>
            {/* Year */}
            <text
              x={node.x}
              y={node.y + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={7}
              fill="currentColor"
              className="text-muted-foreground"
            >
              {formatYear(node.year).replace('公元', '').replace(' 年', '')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}
