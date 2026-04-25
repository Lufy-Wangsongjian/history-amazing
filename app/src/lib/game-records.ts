/**
 * 游戏最佳记录持久化 + 成绩卡分享
 */
import { useState, useCallback } from 'react'
import { syncSubmitGameRecord } from '@/lib/api'

// ── 最佳记录 ──

const RECORDS_KEY = 'chrono-atlas-game-records'
const TOKEN_KEY = 'chrono-atlas-token'

export interface GameRecord {
  score: number       // 得分
  total: number       // 满分
  time?: number       // 用时（秒）
  combo?: number      // 最佳连击
  date: string        // ISO 日期
}

type GameId = 'quiz' | 'memory' | 'riddle' | 'sorter' | 'challenge'

function loadRecords(): Record<string, GameRecord> {
  try {
    const raw = localStorage.getItem(RECORDS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveRecords(records: Record<string, GameRecord>) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  } catch {}
}

/** 检查当前是否已登录（通过 localStorage token） */
function hasAuthToken(): boolean {
  try {
    return !!localStorage.getItem(TOKEN_KEY)
  } catch {
    return false
  }
}

export function useGameRecords(gameId: GameId) {
  const [best, setBest] = useState<GameRecord | null>(() => {
    const records = loadRecords()
    return records[gameId] ?? null
  })

  const submitScore = useCallback((record: Omit<GameRecord, 'date'>): { isNewBest: boolean } => {
    const records = loadRecords()
    const prev = records[gameId]
    const ratio = record.score / record.total
    const prevRatio = prev ? prev.score / prev.total : -1

    // 新纪录：更高得分率，或同分时更快
    const isNewBest = ratio > prevRatio ||
      (ratio === prevRatio && record.time !== undefined && prev?.time !== undefined && record.time < prev.time)

    if (isNewBest || !prev) {
      const newRecord: GameRecord = { ...record, date: new Date().toISOString() }
      records[gameId] = newRecord
      saveRecords(records)
      setBest(newRecord)

      // 后台同步到服务端（fire-and-forget，通过 localStorage token 判断登录态）
      if (hasAuthToken()) {
        syncSubmitGameRecord({
          gameId,
          score: newRecord.score,
          total: newRecord.total,
          time: newRecord.time,
          combo: newRecord.combo,
          date: newRecord.date,
        }).catch(() => {})
      }

      return { isNewBest: true }
    }

    return { isNewBest: false }
  }, [gameId])

  /** 用服务端合并后的数据覆盖本地（登录合并后调用） */
  const setBestFromServer = useCallback((record: GameRecord | null) => {
    if (record) {
      const records = loadRecords()
      records[gameId] = record
      saveRecords(records)
      setBest(record)
    }
  }, [gameId])

  return { best, submitScore, setBestFromServer }
}

// ── 成绩卡分享（Canvas 生成图片） ──

interface ScoreCardData {
  gameTitle: string
  score: number
  total: number
  label: string        // 评价文案，如 "记忆大师"
  extraLine?: string   // 额外信息，如 "用时 1:23，翻牌 12 次"
  isNewBest?: boolean
}

export function generateScoreCard(data: ScoreCardData): string {
  const W = 360, H = 240
  const canvas = document.createElement('canvas')
  canvas.width = W * 2
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.scale(2, 2)

  // 背景
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0f0f23')
  bg.addColorStop(1, '#1a1040')
  ctx.fillStyle = bg
  ctx.roundRect(0, 0, W, H, 16)
  ctx.fill()

  // 标题
  ctx.fillStyle = '#a78bfa'
  ctx.font = 'bold 13px system-ui'
  ctx.fillText(`Chrono Atlas · ${data.gameTitle}`, 24, 36)

  // 分数
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px system-ui'
  ctx.fillText(`${data.score}/${data.total}`, 24, 100)

  // 评价
  ctx.fillStyle = '#c4b5fd'
  ctx.font = 'bold 16px system-ui'
  ctx.fillText(data.label, 24, 130)

  // 额外信息
  if (data.extraLine) {
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px system-ui'
    ctx.fillText(data.extraLine, 24, 155)
  }

  // 新纪录徽章
  if (data.isNewBest) {
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 12px system-ui'
    ctx.fillText('🏆 新纪录!', 24, 180)
  }

  // 底部
  ctx.fillStyle = '#4b5563'
  ctx.font = '10px system-ui'
  ctx.fillText('来挑战我吧！扫码或搜索 Chrono Atlas', 24, H - 16)

  return canvas.toDataURL('image/png')
}

export async function shareScoreCard(data: ScoreCardData) {
  const dataUrl = generateScoreCard(data)
  if (!dataUrl) return

  const blob = await (await fetch(dataUrl)).blob()
  const file = new File([blob], 'chrono-atlas-score.png', { type: 'image/png' })

  const shareText = `我在 Chrono Atlas「${data.gameTitle}」获得了 ${data.score}/${data.total} 的成绩${data.isNewBest ? '（新纪录！）' : ''}，来挑战我吧！`

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ text: shareText, files: [file] })
      return
    } catch {}
  }

  // 降级：下载图片
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = 'chrono-atlas-score.png'
  a.click()
}
