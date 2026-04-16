import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import type { HistoricalEvent, Region } from '@/data/types'
import { REGION_CONFIG, formatYear } from '@/data/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ZoomIn, ZoomOut, RotateCcw, Info, Loader2 } from 'lucide-react'
import { fetchAllEvents } from '@/lib/api'

// ─── 颜色工具 ──────────────────────────────
function getRegionColor(region: Region): string {
  return REGION_CONFIG[region]?.color ?? '#6B7280'
}

function getRegionLabel(region: Region): string {
  return REGION_CONFIG[region]?.label ?? region
}

function getRegionFlag(region: Region): string {
  return REGION_CONFIG[region]?.flag ?? ''
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 100, g: 100, b: 100 }
}

function blockFill(hex: string, index: number, hovered: boolean) {
  const { r, g, b } = hexToRgb(hex)
  const alpha = hovered ? 0.55 : index % 2 === 0 ? 0.32 : 0.2
  return `rgba(${r},${g},${b},${alpha})`
}

function blockBorder(hex: string, hovered: boolean) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${hovered ? 0.85 : 0.5})`
}

// ─── 地理分组配置 ──────────────────────────────
interface GeoGroup {
  label: string
  regions: Region[]
}

const GEO_GROUPS: GeoGroup[] = [
  {
    label: '东亚',
    regions: ['china', 'japan', 'korea', 'north-korea' as Region, 'mongolia', 'taiwan' as Region, 'hong-kong' as Region, 'macau' as Region],
  },
  {
    label: '东南亚',
    regions: ['vietnam', 'thailand', 'cambodia', 'indonesia', 'myanmar', 'singapore' as Region, 'laos' as Region],
  },
  {
    label: '南亚',
    regions: ['india', 'pakistan', 'bangladesh' as Region, 'nepal' as Region, 'bhutan' as Region, 'sri-lanka' as Region],
  },
  {
    label: '中东/西亚',
    regions: ['iraq', 'iran', 'turkey', 'israel', 'syria', 'saudi-arabia', 'jordan', 'lebanon', 'yemen' as Region, 'kazakhstan' as Region, 'uzbekistan' as Region],
  },
  {
    label: '北非',
    regions: ['egypt', 'morocco', 'algeria' as Region, 'sudan' as Region, 'libya' as Region, 'tunisia' as Region],
  },
  {
    label: '撒哈拉以南非洲',
    regions: ['ethiopia', 'nigeria', 'south-africa', 'ghana' as Region, 'kenya' as Region, 'mali' as Region, 'tanzania' as Region],
  },
  {
    label: '西/南欧',
    regions: ['greece', 'italy', 'france', 'spain', 'portugal'],
  },
  {
    label: '西北欧',
    regions: ['uk', 'ireland' as Region, 'netherlands', 'belgium' as Region, 'switzerland' as Region],
  },
  {
    label: '中/北欧',
    regions: ['germany', 'austria', 'poland', 'czech' as Region, 'hungary' as Region, 'sweden', 'norway', 'denmark' as Region, 'finland' as Region],
  },
  {
    label: '东欧',
    regions: ['russia', 'ukraine', 'romania' as Region, 'serbia' as Region],
  },
  {
    label: '美洲',
    regions: ['usa', 'canada' as Region, 'mexico', 'brazil', 'argentina' as Region, 'peru' as Region, 'colombia' as Region, 'cuba' as Region, 'bolivia' as Region, 'venezuela' as Region],
  },
  {
    label: '大洋洲',
    regions: ['australia', 'new-zealand' as Region],
  },
]

// ─── 数据处理 ──────────────────────────────
interface DynastyBlock {
  event: HistoricalEvent
  region: Region
  startYear: number
  endYear: number
  index: number
}

interface CountryColumn {
  region: Region
  label: string
  flag: string
  color: string
  blocks: DynastyBlock[]
  groupLabel: string
}

function buildCountryColumns(events: HistoricalEvent[]): CountryColumn[] {
  const candidates = events.filter(e =>
    e.endYear != null &&
    e.endYear > e.year &&
    !e.id.includes('_context') &&
    !e.id.includes('_acceleration') &&
    !e.id.includes('_diffusion') &&
    !e.id.includes('_legacy')
  )

  const regionMap = new Map<Region, HistoricalEvent[]>()
  for (const e of candidates) {
    const list = regionMap.get(e.region) ?? []
    list.push(e)
    regionMap.set(e.region, list)
  }

  const columns: CountryColumn[] = []
  const regionToGroup = new Map<string, string>()
  for (const g of GEO_GROUPS) {
    for (const r of g.regions) regionToGroup.set(r, g.label)
  }

  for (const [region, regionEvents] of regionMap) {
    const sorted = regionEvents.sort((a, b) => a.year - b.year)
    columns.push({
      region,
      label: getRegionLabel(region),
      flag: getRegionFlag(region),
      color: getRegionColor(region),
      groupLabel: regionToGroup.get(region) ?? '其他',
      blocks: sorted.map((event, index) => ({
        event,
        region,
        startYear: event.year,
        endYear: event.endYear!,
        index,
      })),
    })
  }

  // 按地理分组排序
  const flatOrder: Region[] = GEO_GROUPS.flatMap(g => g.regions)
  columns.sort((a, b) => {
    const ai = flatOrder.indexOf(a.region)
    const bi = flatOrder.indexOf(b.region)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  return columns
}

// ─── 主组件 ──────────────────────────────
interface CivilizationMapViewProps {
  events: HistoricalEvent[] // 保持接口兼容，但内部会自行获取全量
  onSelectEvent: (event: HistoricalEvent) => void
}

const MIN_YEAR = -20000
const MAX_YEAR = 2030
const BASE_YEAR_PX = 0.16
const COL_WIDTH = 88

export function CivilizationMapView({ onSelectEvent }: CivilizationMapViewProps) {
  const [zoom, setZoom] = useState(1)
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [allEvents, setAllEvents] = useState<HistoricalEvent[]>([])
  const [loading, setLoading] = useState(true)

  // 独立请求全量数据（不受筛选器影响）
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetchAllEvents({ limit: 6000 }, controller.signal)
      .then(res => {
        if (!controller.signal.aborted) {
          setAllEvents(res.data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const columns = useMemo(() => buildCountryColumns(allEvents), [allEvents])

  const yearPx = BASE_YEAR_PX * zoom
  const totalHeight = (MAX_YEAR - MIN_YEAR) * yearPx
  const totalWidth = columns.length * COL_WIDTH

  const yearToY = useCallback((year: number) => {
    return (year - MIN_YEAR) * yearPx
  }, [yearPx])

  // 时间刻度
  const ticks = useMemo(() => {
    const result: number[] = []
    const step = zoom < 0.5 ? 1000 : zoom < 1.2 ? 500 : zoom < 2.5 ? 200 : 100
    for (let y = Math.ceil(MIN_YEAR / step) * step; y <= MAX_YEAR; y += step) {
      result.push(y)
    }
    return result
  }, [zoom])

  // 地理分组分隔线位置
  const groupSeparators = useMemo(() => {
    const seps: { x: number; label: string }[] = []
    let prevGroup = ''
    let groupStartIdx = 0
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].groupLabel !== prevGroup) {
        if (prevGroup) {
          seps.push({ x: i * COL_WIDTH, label: prevGroup })
        }
        groupStartIdx = i
        prevGroup = columns[i].groupLabel
      }
    }
    if (prevGroup) seps.push({ x: columns.length * COL_WIDTH, label: prevGroup })
    // 转换为 start/end
    const result: { startX: number; endX: number; label: string }[] = []
    let lastStart = 0
    for (const sep of seps) {
      result.push({ startX: lastStart, endX: sep.x, label: sep.label })
      lastStart = sep.x
    }
    void groupStartIdx
    return result
  }, [columns])

  // 初始滚动（仅首次加载完成时执行，缩放时不重置位置）
  const hasScrolledRef = useRef(false)
  useEffect(() => {
    if (containerRef.current && !loading && !hasScrolledRef.current) {
      hasScrolledRef.current = true
      const initialYearPx = BASE_YEAR_PX * 1
      containerRef.current.scrollTop = Math.max(0, (-3000 - MIN_YEAR) * initialYearPx - 60)
    }
  }, [loading])

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.4, 5))
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.4, 0.2))
  const handleZoomReset = () => setZoom(1)

  if (loading) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
          <Loader2 size={28} className="animate-spin text-primary" />
          <span className="text-sm font-medium">正在加载文明图谱数据…</span>
          <span className="text-xs text-muted-foreground/60">76 个国家/地区的王朝时间线</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* 工具栏 */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">文明图谱</h2>
          <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
            {columns.length} 个国家 · {columns.reduce((s, c) => s + c.blocks.length, 0)} 个王朝
          </span>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                  <Info size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px] text-xs">
                每列代表一个国家，纵轴为时间。色块高度 = 王朝持续时间，点击查看详情。支持缩放和横向滚动。
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <button onClick={handleZoomOut} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="缩小"><ZoomOut size={14} /></button>
          <span className="text-[10px] text-muted-foreground w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="放大"><ZoomIn size={14} /></button>
          <button onClick={handleZoomReset} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="重置"><RotateCcw size={13} /></button>
        </div>
      </div>

      {/* 主画布 */}
      <div ref={containerRef} className="flex-1 min-h-0 overflow-auto">
        {/* 粘性列标题 */}
        <div className="sticky top-0 z-30 flex flex-col border-b border-border/50 bg-card/95 backdrop-blur-md" style={{ width: totalWidth + 72 }}>
          {/* 地理分组条 */}
          <div className="flex h-5" style={{ marginLeft: 72 }}>
            {groupSeparators.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-center text-[8px] font-medium text-muted-foreground/70 border-r border-border/20 last:border-r-0 bg-muted/30"
                style={{ width: g.endX - g.startX }}
              >
                {g.label}
              </div>
            ))}
          </div>
          {/* 国家标题 */}
          <div className="flex">
            <div className="w-[72px] flex-shrink-0 bg-card/95" />
            {columns.map(col => (
              <div
                key={col.region}
                className="flex flex-col items-center justify-center py-1 border-l border-border/20 first:border-l-0"
                style={{ width: COL_WIDTH }}
              >
                <span className="text-xs leading-none">{col.flag}</span>
                <span className="text-[8px] font-semibold mt-0.5 truncate max-w-full px-0.5" style={{ color: col.color }}>
                  {col.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 时间画布 */}
        <div className="relative flex" style={{ height: totalHeight, width: totalWidth + 72 }}>
          {/* 左侧时间刻度 */}
          <div className="sticky left-0 z-20 w-[72px] flex-shrink-0 border-r border-border/30 bg-background/90 backdrop-blur-sm">
            {ticks.map(year => (
              <div key={year} className="absolute right-0 left-0" style={{ top: yearToY(year) }}>
                <span className="absolute right-2 -translate-y-1/2 text-[9px] text-muted-foreground/70 font-mono whitespace-nowrap">
                  {formatYear(year)}
                </span>
                <div className="absolute right-0 w-2 border-t border-border/30" style={{ top: 0 }} />
              </div>
            ))}
          </div>

          {/* 列轨道和色块 */}
          <div className="relative" style={{ width: totalWidth }}>
            {/* 列背景 */}
            {columns.map((col, ci) => (
              <div
                key={`track-${col.region}`}
                className="absolute top-0 bottom-0 border-l border-border/[0.07]"
                style={{
                  left: ci * COL_WIDTH,
                  width: COL_WIDTH,
                  background: ci % 2 === 0 ? 'transparent' : 'rgba(128,128,128,0.015)',
                }}
              />
            ))}

            {/* 地理分组竖线 */}
            {groupSeparators.map((g, i) => (
              g.startX > 0 && (
                <div
                  key={`gs-${i}`}
                  className="absolute top-0 bottom-0 border-l border-border/25"
                  style={{ left: g.startX }}
                />
              )
            ))}

            {/* 横向时间线 */}
            {ticks.map(year => (
              <div key={`g-${year}`} className="absolute left-0 right-0 border-t border-border/[0.06]" style={{ top: yearToY(year) }} />
            ))}

            {/* 色块 */}
            {columns.map((col, ci) =>
              col.blocks.map(block => {
                const top = yearToY(block.startYear)
                const height = Math.max(4, yearToY(block.endYear) - top)
                const isHovered = hoveredBlock === block.event.id
                const duration = block.endYear - block.startYear
                const pad = 2

                return (
                  <TooltipProvider key={block.event.id} delayDuration={80}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="absolute rounded-[3px] border transition-all duration-100 cursor-pointer overflow-hidden text-left"
                          style={{
                            top,
                            height,
                            left: ci * COL_WIDTH + pad,
                            width: COL_WIDTH - pad * 2,
                            backgroundColor: blockFill(col.color, block.index, isHovered),
                            borderColor: blockBorder(col.color, isHovered),
                            zIndex: isHovered ? 20 : 1,
                            boxShadow: isHovered ? `0 2px 12px ${col.color}30` : 'none',
                          }}
                          onClick={() => onSelectEvent(block.event)}
                          onMouseEnter={() => setHoveredBlock(block.event.id)}
                          onMouseLeave={() => setHoveredBlock(null)}
                        >
                          {/* 左侧色条 */}
                          <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: col.color }} />

                          {height > 12 && (
                            <div className="pl-[5px] pr-1 py-[1px] overflow-hidden">
                              <p className="text-[8px] font-bold leading-tight line-clamp-2" style={{ color: col.color }}>
                                {block.event.title.replace(/·.*$/, '').replace(/\s*建立$/, '').replace(/\s*建国$/, '').replace(/（完整时期）/, '').replace(/（.*?）/, '')}
                              </p>
                              {height > 22 && (
                                <p className="text-[7px] text-muted-foreground/80 leading-tight mt-[1px]">
                                  {formatYear(block.startYear)} – {formatYear(block.endYear)}
                                </p>
                              )}
                              {height > 36 && block.event.figure && (
                                <p className="text-[6px] text-muted-foreground/60 truncate mt-[1px]">
                                  {block.event.figure}
                                </p>
                              )}
                              {height > 50 && (
                                <p className="text-[6px] text-muted-foreground/40 leading-tight mt-[1px] line-clamp-2">
                                  {block.event.description}
                                </p>
                              )}
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8} className="max-w-[300px] z-50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{col.flag}</span>
                          <span className="font-bold text-xs" style={{ color: col.color }}>{block.event.title}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {formatYear(block.startYear)} — {formatYear(block.endYear)} · 持续 {duration} 年
                        </p>
                        {block.event.figure && (
                          <p className="text-[10px] text-muted-foreground">关键人物：{block.event.figure}</p>
                        )}
                        <p className="text-[10px] mt-1 line-clamp-3 text-foreground/80">{block.event.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
