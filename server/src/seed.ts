/**
 * 种子脚本：将前端 TS 硬编码数据导入 SQLite
 *
 * 运行方式: npm run seed
 */
import { getDB, closeDB } from './db.js'

// ── 类型（与前端 types.ts 保持一致）──────────────────────
type Category =
  | 'literature' | 'science' | 'music' | 'art' | 'philosophy'
  | 'history' | 'technology' | 'architecture' | 'religion'
  | 'warfare' | 'exploration' | 'medicine'

type Region =
  | 'china' | 'japan' | 'korea' | 'mongolia'
  | 'vietnam' | 'thailand' | 'cambodia' | 'myanmar' | 'indonesia' | 'philippines' | 'malaysia' | 'singapore'
  | 'india' | 'pakistan' | 'sri-lanka' | 'nepal'
  | 'iran' | 'iraq' | 'turkey' | 'israel' | 'saudi-arabia' | 'syria' | 'uzbekistan' | 'afghanistan'
  | 'uk' | 'france' | 'germany' | 'italy' | 'spain' | 'portugal' | 'greece' | 'russia'
  | 'netherlands' | 'poland' | 'austria' | 'sweden' | 'switzerland' | 'belgium' | 'czech'
  | 'norway' | 'denmark' | 'ireland' | 'romania' | 'hungary'
  | 'egypt' | 'ethiopia' | 'nigeria' | 'south-africa' | 'morocco' | 'mali' | 'kenya' | 'tanzania'
  | 'usa' | 'mexico' | 'brazil' | 'argentina' | 'peru' | 'colombia' | 'canada' | 'chile' | 'cuba'
  | 'australia' | 'new-zealand'
  | 'global'

interface HistoricalEvent {
  id: string
  year: number
  endYear?: number
  title: string
  description: string
  details?: string
  category: Category
  region: Region
  significance: 1 | 2 | 3
  figure?: string
  icon?: string
  relatedIds?: string[]
}

// ── 加载所有事件数据 ──────────────────────────────
// 统一从前端聚合层导入，这样 seed 与前端共享同一套扩展逻辑。
async function loadAllEvents(): Promise<HistoricalEvent[]> {
  const module = await import('../../app/src/data/events.js')
  const { baseHistoricalEvents, historicalEvents, historicalEventsMultiplier } = module

  console.log(`🧱 基础主事件 ${baseHistoricalEvents.length} 条`)
  console.log(`📈 扩展倍数 x${historicalEventsMultiplier}`)

  return historicalEvents as HistoricalEvent[]
}

// ── 主逻辑 ─────────────────────────────────────
async function seed() {
  console.log('🌱 开始种子数据导入...')

  const allEvents = await loadAllEvents()
  console.log(`📦 共加载 ${allEvents.length} 条事件`)

  const db = getDB()

  // 清空旧数据（开发阶段方便反复 seed）
  db.exec('DELETE FROM event_relations')
  db.exec('DELETE FROM events')
  // 重建 FTS 索引
  db.exec("INSERT INTO events_fts(events_fts) VALUES('rebuild')")

  // 准备批量插入语句
  const insertEvent = db.prepare(`
    INSERT OR REPLACE INTO events (id, year, end_year, title, description, details, category, region, significance, figure, icon)
    VALUES (@id, @year, @endYear, @title, @description, @details, @category, @region, @significance, @figure, @icon)
  `)

  const insertRelation = db.prepare(`
    INSERT OR IGNORE INTO event_relations (event_id, related_id)
    VALUES (@eventId, @relatedId)
  `)

  // 使用事务批量写入
  const insertAll = db.transaction((events: HistoricalEvent[]) => {
    for (const e of events) {
      insertEvent.run({
        id: e.id,
        year: e.year,
        endYear: e.endYear ?? null,
        title: e.title,
        description: e.description,
        details: e.details ?? null,
        category: e.category,
        region: e.region,
        significance: e.significance,
        figure: e.figure ?? null,
        icon: e.icon ?? null,
      })
    }

    // 第二轮：插入关联关系（需要所有事件已入库）
    for (const e of events) {
      if (e.relatedIds) {
        for (const relatedId of e.relatedIds) {
          insertRelation.run({ eventId: e.id, relatedId })
        }
      }
    }
  })

  insertAll(allEvents)

  // 统计验证
  const count = db.prepare('SELECT COUNT(*) as cnt FROM events').get() as { cnt: number }
  const relCount = db.prepare('SELECT COUNT(*) as cnt FROM event_relations').get() as { cnt: number }

  console.log(`✅ 成功导入 ${count.cnt} 条事件, ${relCount.cnt} 条关联关系`)

  // 输出各类别统计
  const categoryStats = db.prepare(`
    SELECT category, COUNT(*) as cnt FROM events GROUP BY category ORDER BY cnt DESC
  `).all() as { category: string; cnt: number }[]
  console.log('\n📊 类别统计:')
  for (const s of categoryStats) {
    console.log(`   ${s.category.padEnd(14)} ${s.cnt}`)
  }

  // 输出年份范围
  const range = db.prepare('SELECT MIN(year) as minY, MAX(year) as maxY FROM events').get() as { minY: number; maxY: number }
  console.log(`\n📅 年份范围: ${range.minY} ~ ${range.maxY}`)

  closeDB()
  console.log('\n🎉 种子数据导入完成!')
}

seed().catch(err => {
  console.error('❌ 种子导入失败:', err)
  closeDB()
  process.exit(1)
})
