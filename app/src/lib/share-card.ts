import type { HistoricalEvent } from '@/data/types'
import { CATEGORY_CONFIG, REGION_CONFIG, formatYear, getEra } from '@/data/types'

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

/** 圆角矩形辅助（Canvas 没有原生 roundRect） */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

type CardLayout = 'landscape' | 'portrait' | 'square'

/**
 * 生成事件分享卡片
 */
export function generateShareCard(event: HistoricalEvent, layout: CardLayout = 'landscape'): string {
  const canvas = document.createElement('canvas')
  const dims = { landscape: [600, 400], portrait: [400, 600], square: [500, 500] }
  const [W, H] = dims[layout]
  canvas.width = W * 2
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas.toDataURL('image/png')
  ctx.scale(2, 2)

  const catCfg = CATEGORY_CONFIG[event.category]
  const regionCfg = REGION_CONFIG[event.region]
  const era = getEra(event.year)

  // 背景渐变
  const bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H)
  bgGrad.addColorStop(0, '#0a0a14')
  bgGrad.addColorStop(0.5, '#111122')
  bgGrad.addColorStop(1, '#1a1a2e')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  // 顶部装饰色条
  ctx.fillStyle = catCfg.color
  ctx.fillRect(0, 0, W, 4)

  // 分类色光晕
  const glowGrad = ctx.createRadialGradient(W * 0.15, H * 0.2, 0, W * 0.15, H * 0.2, W * 0.5)
  glowGrad.addColorStop(0, catCfg.color + '18')
  glowGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = glowGrad
  ctx.fillRect(0, 0, W, H * 0.5)

  // 品牌
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fillText('CHRONO ATLAS', 28, 34)

  // 年份大字
  const yearSize = layout === 'portrait' ? 32 : 36
  ctx.font = `800 ${yearSize}px -apple-system, BlinkMacSystemFont, sans-serif`
  ctx.fillStyle = catCfg.color
  ctx.fillText(formatYear(event.year), 28, 82)

  // 时代标签
  if (era) {
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = era.color + 'cc'
    ctx.fillText(era.name, 28, 104)
  }

  // 事件标题
  const titleMaxW = W - 56
  ctx.font = `700 ${layout === 'portrait' ? 20 : 22}px -apple-system, BlinkMacSystemFont, sans-serif`
  ctx.fillStyle = '#ffffff'
  const titleLines = wrapText(ctx, event.title, titleMaxW)
  let y = layout === 'portrait' ? 140 : 145
  titleLines.slice(0, 3).forEach(line => { ctx.fillText(line, 28, y); y += 28 })

  // 描述
  ctx.font = '400 13px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  const descLines = wrapText(ctx, event.description, titleMaxW)
  y += 6
  const maxDescLines = layout === 'portrait' ? 8 : 4
  descLines.slice(0, maxDescLines).forEach(line => { ctx.fillText(line, 28, y); y += 19 })
  if (descLines.length > maxDescLines) {
    ctx.fillText('...', 28, y)
  }

  // 里程碑标记
  if (event.significance === 3) {
    const badgeY = layout === 'portrait' ? H - 90 : H - 68
    roundRect(ctx, 28, badgeY, 100, 22, 11)
    ctx.fillStyle = '#f59e0b22'
    ctx.fill()
    ctx.strokeStyle = '#f59e0b44'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.font = '600 10px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('★ 里程碑事件', 38, badgeY + 15)
  }

  // 底部信息栏
  const bottomY = H - 38
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(0, bottomY - 14, W, 52)
  ctx.font = '500 11px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(`${regionCfg.flag} ${regionCfg.label}`, 28, bottomY + 6)
  ctx.fillStyle = catCfg.color
  ctx.fillText(`● ${catCfg.label}`, 150, bottomY + 6)
  if (event.figure) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    const figText = event.figure.length > 15 ? event.figure.slice(0, 14) + '…' : event.figure
    ctx.fillText(figText, 250, bottomY + 6)
  }

  // 右下角二维码提示
  ctx.font = '400 9px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.fillText('Chrono Atlas · 探索两万年文明', W - 185, bottomY + 6)

  return canvas.toDataURL('image/png')
}

/**
 * 将 dataURL 转为 Blob
 */
function dataURLToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png'
  const binary = atob(base64)
  const arr = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

/**
 * 分享事件 — 优先 Web Share API，降级为下载
 */
export async function shareEvent(event: HistoricalEvent, layout: CardLayout = 'landscape') {
  const dataUrl = generateShareCard(event, layout)
  const shareUrl = `${window.location.origin}${window.location.pathname}#event=${event.id}`
  const shareText = `${formatYear(event.year)} · ${event.title} — ${event.description.slice(0, 80)}…`

  // 优先 Web Share API（移动端）
  if (navigator.share) {
    try {
      const blob = dataURLToBlob(dataUrl)
      const file = new File([blob], `chrono-atlas-${event.id}.png`, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${formatYear(event.year)} · ${event.title}`,
          text: shareText,
          url: shareUrl,
          files: [file],
        })
        return
      }

      // 不支持文件分享时只分享链接
      await navigator.share({
        title: `${formatYear(event.year)} · ${event.title}`,
        text: shareText,
        url: shareUrl,
      })
      return
    } catch (err) {
      if ((err as Error).name === 'AbortError') return // 用户取消
    }
  }

  // 降级：复制链接 + 下载图片
  try {
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
  } catch {}
  downloadShareCard(event, layout)
}

/**
 * 下载分享卡片
 */
export function downloadShareCard(event: HistoricalEvent, layout: CardLayout = 'landscape') {
  const dataUrl = generateShareCard(event, layout)
  const link = document.createElement('a')
  link.download = `chrono-atlas-${event.id}.png`
  link.href = dataUrl
  link.click()
}
