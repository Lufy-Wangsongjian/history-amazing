import { useMemo } from 'react'
import type { HistoricalEvent } from '@/data/types'
import { ERAS, formatYear } from '@/data/types'

interface EventDensityChartProps {
  events: HistoricalEvent[]
  /** 点击某个区间后跳转到时间线筛选 */
  onSelectRange?: (yearMin: number, yearMax: number) => void
}

/** 将事件按世纪分桶，计算每个桶的事件数量 */
function buildDensityBuckets(events: HistoricalEvent[], bucketSize: number = 100) {
  const MIN_YEAR = -4000
  const MAX_YEAR = 2030
  const bucketCount = Math.ceil((MAX_YEAR - MIN_YEAR) / bucketSize)

  const buckets: Array<{ startYear: number; endYear: number; count: number }> = []
  for (let i = 0; i < bucketCount; i++) {
    const start = MIN_YEAR + i * bucketSize
    buckets.push({
      startYear: start,
      endYear: Math.min(start + bucketSize, MAX_YEAR),
      count: 0,
    })
  }

  events.forEach(e => {
    const idx = Math.floor((e.year - MIN_YEAR) / bucketSize)
    if (idx >= 0 && idx < buckets.length) {
      buckets[idx].count++
    }
  })

  return buckets
}

/** SVG 事件密度折线图 */
export function EventDensityChart({ events, onSelectRange }: EventDensityChartProps) {
  const buckets = useMemo(() => buildDensityBuckets(events, 100), [events])
  const maxCount = Math.max(...buckets.map(b => b.count), 1)

  // SVG 尺寸
  const W = 600
  const H = 180
  const PADDING_LEFT = 40
  const PADDING_RIGHT = 16
  const PADDING_TOP = 20
  const PADDING_BOTTOM = 36
  const chartW = W - PADDING_LEFT - PADDING_RIGHT
  const chartH = H - PADDING_TOP - PADDING_BOTTOM

  // 生成折线路径
  const points = buckets.map((bucket, i) => {
    const x = PADDING_LEFT + (i / (buckets.length - 1)) * chartW
    const y = PADDING_TOP + chartH - (bucket.count / maxCount) * chartH
    return { x, y, bucket }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')

  // 填充区域路径（折线下方到底部）
  const areaPath = linePath +
    ` L ${(PADDING_LEFT + chartW).toFixed(1)} ${(PADDING_TOP + chartH).toFixed(1)}` +
    ` L ${PADDING_LEFT.toFixed(1)} ${(PADDING_TOP + chartH).toFixed(1)} Z`

  // Y 轴刻度
  const yTicks = useMemo(() => {
    const ticks: number[] = []
    const step = maxCount <= 10 ? 2 : maxCount <= 50 ? 10 : maxCount <= 200 ? 50 : 100
    for (let v = 0; v <= maxCount; v += step) {
      ticks.push(v)
    }
    if (ticks[ticks.length - 1] < maxCount) ticks.push(maxCount)
    return ticks
  }, [maxCount])

  // 时代背景色段
  const eraRects = useMemo(() => {
    const MIN_YEAR = -4000
    const MAX_YEAR = 2030
    const totalRange = MAX_YEAR - MIN_YEAR
    return ERAS.map(era => ({
      x: PADDING_LEFT + ((era.startYear - MIN_YEAR) / totalRange) * chartW,
      width: ((era.endYear - era.startYear) / totalRange) * chartW,
      color: era.color,
      name: era.name,
    }))
  }, [chartW])

  // 找到密度最高的桶（标注"文明爆发期"）
  const peakBucket = useMemo(() => {
    let peak = buckets[0]
    buckets.forEach(b => { if (b.count > peak.count) peak = b })
    return peak
  }, [buckets])

  const peakPoint = points.find(p => p.bucket === peakBucket)

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 时代背景色段 */}
        {eraRects.map(era => (
          <rect
            key={era.name}
            x={era.x}
            y={PADDING_TOP}
            width={era.width}
            height={chartH}
            fill={era.color}
            opacity={0.06}
          />
        ))}

        {/* Y 轴刻度线 */}
        {yTicks.map(v => {
          const y = PADDING_TOP + chartH - (v / maxCount) * chartH
          return (
            <g key={v}>
              <line
                x1={PADDING_LEFT}
                y1={y}
                x2={PADDING_LEFT + chartW}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeDasharray="3 3"
              />
              <text
                x={PADDING_LEFT - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground"
                fontSize={8}
                fontFamily="monospace"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* 渐变定义 */}
        <defs>
          <linearGradient id="density-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="20%" stopColor="#DAA520" />
            <stop offset="50%" stopColor="#4A6741" />
            <stop offset="75%" stopColor="#20B2AA" />
            <stop offset="100%" stopColor="#4169E1" />
          </linearGradient>
        </defs>

        {/* 填充区域 */}
        <path d={areaPath} fill="url(#density-gradient)" />

        {/* 折线 */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#line-gradient)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.bucket.count > 0 ? 2.5 : 0}
              fill="var(--background, #0a0a14)"
              stroke={p.bucket === peakBucket ? '#f59e0b' : 'currentColor'}
              strokeWidth={p.bucket === peakBucket ? 2 : 1}
              strokeOpacity={p.bucket === peakBucket ? 1 : 0.3}
              className="cursor-pointer transition-all hover:r-4"
            />
            {/* Hover 热区（不可见的大圆用于点击） */}
            {onSelectRange && (
              <circle
                cx={p.x}
                cy={p.y}
                r={8}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => onSelectRange(p.bucket.startYear, p.bucket.endYear)}
              >
                <title>{`${formatYear(p.bucket.startYear)} ~ ${formatYear(p.bucket.endYear)}: ${p.bucket.count} 条事件`}</title>
              </circle>
            )}
          </g>
        ))}

        {/* 峰值标注 */}
        {peakPoint && peakBucket.count > 0 && (
          <g>
            <line
              x1={peakPoint.x}
              y1={peakPoint.y - 6}
              x2={peakPoint.x}
              y2={PADDING_TOP + 2}
              stroke="#f59e0b"
              strokeWidth={0.5}
              strokeDasharray="2 2"
              opacity={0.6}
            />
            <text
              x={peakPoint.x}
              y={PADDING_TOP - 4}
              textAnchor="middle"
              className="fill-amber-500"
              fontSize={7}
              fontWeight="bold"
            >
              文明爆发期 ↑{peakBucket.count}
            </text>
          </g>
        )}

        {/* X 轴时代标签 */}
        {eraRects.map(era => (
          <text
            key={era.name}
            x={era.x + era.width / 2}
            y={H - 6}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={7}
          >
            {era.name.length > 3 ? era.name.slice(0, 2) : era.name}
          </text>
        ))}

        {/* 底部轴线 */}
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP + chartH}
          x2={PADDING_LEFT + chartW}
          y2={PADDING_TOP + chartH}
          stroke="currentColor"
          strokeOpacity={0.15}
        />
      </svg>
    </div>
  )
}
