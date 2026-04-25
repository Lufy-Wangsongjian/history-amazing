/**
 * 挑战好友链接工具
 * 生成带种子的 URL，好友打开后进入同一套题目
 */

/** 生成基于时间戳的挑战种子 */
export function generateChallengeSeed(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** 基于种子的确定性随机数生成器 */
export function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }
}

/** 基于种子的确定性洗牌 */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  const rng = seededRandom(seed)
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** 生成挑战好友链接 */
export function generateChallengeLink(params: {
  game: 'quiz' | 'challenge' | 'sorter'
  seed: string
  score?: number
  nickname?: string
}): string {
  const url = new URL(window.location.origin)
  url.hash = `challenge=${params.game}&seed=${params.seed}`
  if (params.score !== undefined) url.searchParams.set('score', String(params.score))
  if (params.nickname) url.searchParams.set('from', params.nickname)
  return url.toString()
}

/** 从 URL 解析挑战参数 */
export function parseChallengeFromURL(): {
  game: string
  seed: string
  score?: number
  from?: string
} | null {
  const hash = window.location.hash
  if (!hash.startsWith('#challenge=')) return null

  const parts = hash.slice(1).split('&')
  const params: Record<string, string> = {}
  for (const part of parts) {
    const [key, value] = part.split('=')
    if (key && value) params[key] = decodeURIComponent(value)
  }

  if (!params.challenge || !params.seed) return null

  const searchParams = new URLSearchParams(window.location.search)

  return {
    game: params.challenge,
    seed: params.seed,
    score: searchParams.has('score') ? Number(searchParams.get('score')) : undefined,
    from: searchParams.get('from') || undefined,
  }
}

/** 复制文本到剪贴板 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

/** 生成挑战分享文案 */
export function getChallengeShareText(params: {
  game: string
  score: number
  total: number
  nickname?: string
  link: string
}): string {
  const gameNames: Record<string, string> = {
    quiz: '知识测验',
    challenge: '时间对决',
    sorter: '排序挑战',
  }
  const gameName = gameNames[params.game] || params.game
  return `我在 Chrono Atlas「${gameName}」拿到了 ${params.score}/${params.total} 的成绩，来挑战我吧！\n${params.link}`
}
