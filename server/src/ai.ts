/**
 * AI 问答服务 — 基于 LLM + SQLite RAG
 */
import OpenAI from 'openai'
import type Database from 'better-sqlite3'

const SYSTEM_PROMPT = `你是 Chrono Atlas（文明时间线）的 AI 导览员，名叫"时光向导"。你的职责是帮助用户探索人类 6000 年文明史。

你拥有一个包含约 11000 条历史事件的数据库，覆盖 12 个领域（文学、科学、音乐、艺术、哲学、历史、技术、建筑、宗教、军事、探索、医学）和 81 个国家/地区。

回答规则：
1. 回答要简洁精炼，控制在 200 字以内，除非用户要求详细讲解
2. 如果提到具体事件，用【事件名称】格式标注，便于前端高亮和跳转
3. 比较类问题（"谁更早？"）直接给出答案并附上年份
4. 路线规划类（"带我了解..."）列出 5-8 个关键事件，按时间排序
5. 如果提供了相关事件上下文，优先基于这些事件回答
6. 保持亲切、有学识的语气，偶尔加入有趣的冷知识
7. 回答使用中文`

interface EventRow {
  id: string
  year: number
  title: string
  description: string
  category: string
  region: string
  significance: number
  figure: string | null
}

/**
 * 从数据库检索与用户问题相关的事件（RAG）
 */
export function retrieveRelevantEvents(db: Database.Database, query: string, limit = 12): EventRow[] {
  // 提取关键词
  const keywords = query
    .replace(/[？?！!。，,、""''（）()]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2)

  if (keywords.length === 0) return []

  // 用 LIKE 搜索（对中文更友好）
  const conditions = keywords.map((_, i) => `(title LIKE @kw${i} OR description LIKE @kw${i} OR figure LIKE @kw${i})`)
  const params: Record<string, unknown> = {}
  keywords.forEach((kw, i) => { params[`kw${i}`] = `%${kw}%` })

  const sql = `
    SELECT id, year, title, description, category, region, significance, figure
    FROM events
    WHERE ${conditions.join(' OR ')}
    ORDER BY significance DESC, year ASC
    LIMIT @limit
  `
  params.limit = limit

  try {
    return db.prepare(sql).all(params) as EventRow[]
  } catch {
    return []
  }
}

/**
 * 将检索到的事件格式化为上下文文本
 */
function formatEventsContext(events: EventRow[]): string {
  if (events.length === 0) return ''
  const lines = events.map(e => {
    const yearStr = e.year < 0 ? `公元前${Math.abs(e.year)}年` : `${e.year}年`
    return `- ${yearStr}【${e.title}】(${e.category}, ${e.region})${e.figure ? ` 人物:${e.figure}` : ''}: ${e.description}`
  })
  return `\n\n以下是数据库中与问题相关的历史事件，请基于这些信息回答：\n${lines.join('\n')}`
}

/**
 * 创建 OpenAI 客户端（兼容 DeepSeek / 通义千问等 OpenAI 兼容 API）
 */
function createClient(): OpenAI | null {
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY
  if (!apiKey) return null

  const baseURL = process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.deepseek.com'
  return new OpenAI({ apiKey, baseURL })
}

const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat'

/**
 * 流式 AI 回答
 */
export async function* streamAIResponse(
  db: Database.Database,
  userMessage: string,
): AsyncGenerator<string> {
  const client = createClient()
  if (!client) {
    yield 'AI 功能未启用。请在服务器环境变量中设置 AI_API_KEY（支持 DeepSeek / OpenAI / 通义千问等 OpenAI 兼容 API）。\n\n'
    yield '设置方法：\n```\nexport AI_API_KEY=sk-xxx\nexport AI_BASE_URL=https://api.deepseek.com  # 可选，默认 DeepSeek\nexport AI_MODEL=deepseek-chat  # 可选\n```'
    return
  }

  // RAG: 检索相关事件
  const relevantEvents = retrieveRelevantEvents(db, userMessage)
  const contextText = formatEventsContext(relevantEvents)

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT + contextText },
    { role: 'user', content: userMessage },
  ]

  try {
    const stream = await client.chat.completions.create({
      model: AI_MODEL,
      messages,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) yield content
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    yield `\n\n[AI 调用出错: ${msg}]`
  }
}
