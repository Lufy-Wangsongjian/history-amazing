import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'

/**
 * 生成事件分享卡片的 Canvas 图像
 * 返回 data URL（PNG 格式）
 */
export function generateShareCard(event: HistoricalEvent): string {
  const canvas = document.createElement('canvas')
  const W = 600
  const H = 400
  canvas.width = W * 2 // 2x 分辨率
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas.toDataURL('image/png')
  ctx.scale(2, 2)

  const catCfg = CATEGORY_CONFIG[event.category]
  const regionCfg = REGION_CONFIG[event.region]
  const era = getEra(event.year)

  // 背景
  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, '#0a0a14')
  bgGrad.addColorStop(1, '#1a1a2e')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // 顶部装饰色条
  ctx.fillStyle = catCfg.color
  ctx.fillRect(0, 0, W, 4)

  // 顶部分类色光晕
  const glowGrad = ctx.createRadialGradient(100, 80, 0, 100, 80, 200)
  glowGrad.addColorStop(0, catCfg.color + '20')
  glowGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = glowGrad
  ctx.fillRect(0, 0, W, 200)

  // 品牌标题
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillText('CHRONO ATLAS · 文明时间线', 30, 36)

  // 年份 — 大字
  ctx.font = '800 36px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = catCfg.color
  ctx.fillText(formatYear(event.year), 30, 88)

  // 时代标签
  if (era) {
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = era.color + 'cc'
    ctx.fillText(era.name, 30, 110)
  }

  // 事件标题
  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = '#ffffff'
  const titleLines = wrapText(ctx, event.title, W - 60)
  let y = 150
  titleLines.forEach(line => {
    ctx.fillText(line, 30, y)
    y += 30
  })

  // 描述
  ctx.font = '400 13px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  const descLines = wrapText(ctx, event.description, W - 60)
  y += 8
  descLines.slice(0, 4).forEach(line => {
    ctx.fillText(line, 30, y)
    y += 20
  })

  // 底部信息栏
  const bottomY = H - 40
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillRect(0, bottomY - 15, W, 55)

  ctx.font = '500 11px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText(`${regionCfg.flag} ${regionCfg.label}`, 30, bottomY + 5)
  ctx.fillStyle = catCfg.color
  ctx.fillText(`● ${catCfg.label}`, 160, bottomY + 5)
  if (event.figure) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText(`👤 ${event.figure}`, 260, bottomY + 5)
  }

  // 右下角里程碑标记
  if (event.significance === 3) {
    ctx.fillStyle = '#f59e0b'
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillText('★ 里程碑事件', W - 120, bottomY + 5)
  }

  return canvas.toDataURL('image/png')
}

/** 文本换行 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let currentLine = ''

  for (const char of text) {
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

/**
 * 下载分享卡片
 */
export function downloadShareCard(event: HistoricalEvent) {
  const dataUrl = generateShareCard(event)
  const link = document.createElement('a')
  link.download = `chrono-atlas-${event.id}.png`
  link.href = dataUrl
  link.click()
}
