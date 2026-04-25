# COMPREHENSIVE CODE REVIEW: History Amazing Backend
## Server-side Code Analysis (server/src/)

---

## 🔴 CRITICAL ISSUES

### 1. **EXPOSED API KEY IN VERSION CONTROL** [CRITICAL SECURITY]
**File:** `server/.env`  
**Lines:** 1  
**Severity:** CRITICAL

```
AI_API_KEY=sk-75ac26d68a0640a0b983deb60528264a
```

**Issue:** The API key is hardcoded and committed to the repository. This is exposed to anyone with access to the repo and can be used to:
- Make unauthorized API calls (costs/billing)
- Potentially inject malicious prompts through the AI endpoint
- Exfiltrate data through the AI service

**Recommendation:**
- Remove this key from `.env` immediately - it should be treated as compromised
- Add `.env` to `.gitignore`
- Use environment variables from deployment platform (Heroku, Vercel, Docker, etc.)
- Rotate the API key in the provider's dashboard

---

## 🔐 SECURITY ISSUES

### 2. **MISSING INPUT VALIDATION ON NUMERIC QUERY PARAMETERS** [HIGH SECURITY]
**File:** `server/src/index.ts`  
**Lines:** 138-149, 167-168, 214-216, 256-258

**Issue:** Query parameters are converted to numbers without validation:

```typescript
// Line 138-139
if (query.yearMin) {
  conditions.push(`${fieldPrefix}year >= @yearMin`)
  params.yearMin = Number(query.yearMin)  // ❌ No validation
}

// Line 167-168
params.limit = Number(limit)  // Can be Infinity, NaN, -1, etc.
params.offset = Number(offset)
```

**Problems:**
- `Number("Infinity")` → Infinity (unbounded queries)
- `Number("NaN")` → NaN (invalid SQL)
- `Number("-1000")` → negative values (logic bypass)
- No upper bounds on limit/offset can cause:
  - Memory exhaustion (loading entire database)
  - DoS vulnerability
  - N+1 query issues when retrieving relations

**Recommendation:**

```typescript
function validateLimit(value: string, max = 1000): number {
  const num = parseInt(value, 10)
  if (isNaN(num) || num < 0 || num > max) return max
  return num
}

function validateYear(value: string): number | null {
  const num = parseInt(value, 10)
  if (isNaN(num)) return null
  return Math.max(-20000, Math.min(2030, num)) // Clamp to valid range
}
```

---

### 3. **NO RATE LIMITING ON AI ENDPOINT** [HIGH SECURITY]
**File:** `server/src/index.ts`  
**Lines:** 354-380

**Issue:** The `/api/ai/chat` endpoint has no rate limiting. An attacker can:
- Spam requests to exhaust AI API credits
- Cause DoS through resource exhaustion
- Generate unbilled API calls

```typescript
app.post('/api/ai/chat', async (req, res) => {
  // ❌ No authentication, no rate limiting
  const { message } = req.body as { message?: string }
  // ... streams response immediately
})
```

**Recommendation:** Implement rate limiting:

```typescript
import rateLimit from 'express-rate-limit'

const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: 'Too many AI requests, please try again later'
})

app.post('/api/ai/chat', aiLimiter, async (req, res) => { ... })
```

---

### 4. **EXCESSIVE CORS PERMISSIVENESS** [MEDIUM SECURITY]
**File:** `server/src/index.ts`  
**Line:** 19

**Issue:**
```typescript
app.use(cors())  // ❌ Allows ALL origins to access ALL endpoints
```

This means:
- Any website can make API calls on behalf of users
- No CSRF protection for state-changing operations (though GET-only)
- Full cross-origin access to all data

**Recommendation:**

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: false,
  maxAge: 3600
}))
```

---

### 5. **IMPROPER ERROR EXPOSURE IN AI ENDPOINT** [MEDIUM SECURITY]
**File:** `server/src/index.ts`  
**Lines:** 375-376

**Issue:**
```typescript
} catch (err) {
  res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
  // ❌ Full error message exposed to client (may leak internals)
}
```

If the API key is invalid or service is down, the full error (including auth failures) is sent to the client, potentially leaking configuration details.

**Recommendation:**

```typescript
} catch (err) {
  const isAuthError = err instanceof Error && err.message.includes('401|403|auth')
  const message = isAuthError 
    ? 'AI service authentication failed' 
    : 'AI service temporarily unavailable'
  res.write(`data: ${JSON.stringify({ error: message })}\n\n`)
  console.error('[AI Error]', err) // Log full error server-side
}
```

---

## 🐛 LOGIC BUGS

### 6. **RACE CONDITION IN DATABASE INITIALIZATION** [MEDIUM]
**File:** `server/src/db.ts`  
**Lines:** 11-23

**Issue:**
```typescript
let db: Database.Database | null = null

export function getDB(): Database.Database {
  if (!db) {  // ❌ Non-atomic check-then-act
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
  }
  return db
}
```

In concurrent requests, multiple threads could pass the `if (!db)` check before assignment, causing:
- Multiple database connections
- Multiple schema initializations (duplicate triggers/indexes)

**Recommendation:**

```typescript
let db: Database.Database | null = null
const dbInitPromise = initializeDB()

async function initializeDB() {
  // ... initialization logic
}

export async function getDB(): Promise<Database.Database> {
  if (!db) {
    db = await dbInitPromise
  }
  return db
}
```

---

### 7. **INCORRECT FTS PAGINATION WITH DERIVED EVENTS** [MEDIUM]
**File:** `server/src/index.ts`  
**Lines:** 103-106, 198-244

**Issue:** The search endpoint applies LIMIT before filtering out derived events:

```typescript
// FTS search first gets 1000 results
const rows = db.prepare(sql).all(params) as EventRow[]  // Line 219
// Then filters derived events AFTER pagination
const data = attachRelations(db, rows)  // Line 220
// But derived events should be filtered BEFORE limiting
```

This means:
- User requests limit=50, but may only get ~40 core events (if 10% are derived)
- Pagination becomes inconsistent
- The count query doesn't respect the derived filter

**Recommendation:**

```typescript
sql += ` AND id NOT LIKE '%_context' AND id NOT LIKE '%_acceleration' ...`
// OR filter in SQL:
sql += ` AND id NOT REGEXP '_(?:context|acceleration|diffusion|legacy)$'`
```

---

### 8. **OFF-BY-ONE / EDGE CASE IN YEAR RANGE QUERIES** [LOW]
**File:** `server/src/index.ts`  
**Lines:** 285-297

**Issue:**
```typescript
const contemporaryRows = db.prepare(`
  SELECT *
  FROM events
  WHERE id != @id
    AND year BETWEEN @minYear AND @maxYear
  ORDER BY ABS(year - @year) ASC, year ASC
  LIMIT 24
`).all({
  id: current.id,
  year: current.year,
  minYear: current.year - 50,
  maxYear: current.year + 50,  // ✅ Inclusive range
})
```

The ±50 year range is arbitrary and inflexible. If there are no events in ±50 years, it returns empty. Consider:
- Year -15000: ±50 might have no events nearby
- Need fallback logic

**Recommendation:**

```typescript
let windowSize = 50
let results = []
while (results.length < 6 && windowSize < 500) {
  const query = db.prepare(...).all({...})
  results = filterCoreContextRows(query, 6)
  windowSize += 50
}
```

---

### 9. **POTENTIAL NULL DEREFERENCE IN AI RESPONSE** [MEDIUM]
**File:** `server/src/ai.ts`  
**Lines:** 122-123

**Issue:**
```typescript
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content  // ✅ Safe
  if (content) yield content
}
```

While this specific code is safe (uses optional chaining), the error handling above doesn't verify the stream was successfully created:

```typescript
const stream = await client.chat.completions.create({...})  // Line 113
for await (const chunk of stream) {  // ❌ If stream is null, this crashes
```

---

## ⚠️ ERROR HANDLING ISSUES

### 10. **MISSING ERROR HANDLING IN FALLBACK SEARCH** [MEDIUM]
**File:** `server/src/index.ts`  
**Lines:** 152-184

**Issue:** The `fallbackSearch` function has no try-catch:

```typescript
function fallbackSearch(db: Database.Database, req: express.Request, res: express.Response) {
  const query = req.query as ListQuery
  const { search, limit = '1000', offset = '0' } = query

  let sql = 'SELECT * FROM events WHERE (title LIKE @q OR description LIKE @q OR figure LIKE @q OR details LIKE @q)'
  const params: Record<string, unknown> = { q: `%${search}%` }  // ❌ No validation
  const conditions: string[] = []

  // ... builds SQL ...

  const rows = db.prepare(sql).all(params) as EventRow[]  // ❌ No error handling
  // ❌ If SQL fails, entire endpoint crashes
}
```

If `search` contains malicious input or DB fails, the endpoint crashes.

**Recommendation:**

```typescript
function fallbackSearch(db: Database.Database, req: express.Request, res: express.Response) {
  try {
    // ... existing code ...
  } catch (err) {
    console.error('Search error:', err)
    res.status(400).json({ 
      error: 'Search failed',
      data: [],
      total: 0
    })
  }
}
```

---

### 11. **UNHANDLED PROMISE REJECTION IN SERVER STARTUP** [MEDIUM]
**File:** `server/src/index.ts`  
**Lines:** 394-406

**Issue:**
```typescript
app.listen(PORT, () => {
  console.log(`Chrono Atlas 服务已启动: http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  closeDB()
  process.exit(0)
})
```

No error handler for server startup. If the port is already in use:

```
Error: listen EADDRINUSE: address already in use :::3001
```

The error is unhandled and Node.js crashes with a non-zero exit code, but no graceful message.

**Recommendation:**

```typescript
const server = app.listen(PORT, () => {
  console.log(`Chrono Atlas 服务已启动: http://localhost:${PORT}`)
})

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`)
  } else {
    console.error('❌ Server error:', err)
  }
  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('Shutting down...')
  server.close(() => {
    closeDB()
    process.exit(0)
  })
})
```

---

### 12. **SILENT FAILURES IN SEED.TS RELATION VALIDATION** [LOW]
**File:** `server/src/seed.ts`  
**Lines:** 100-110

**Issue:**
```typescript
const validEventIds = new Set(events.map(e => e.id))
for (const e of events) {
  if (e.relatedIds) {
    for (const relatedId of e.relatedIds) {
      if (validEventIds.has(relatedId)) {
        insertRelation.run({ eventId: e.id, relatedId })
      }
      // ❌ Silently skips if relatedId not found (no warning)
    }
  }
}
```

Invalid relations are silently dropped. No warning if event references non-existent related events.

**Recommendation:**

```typescript
const missingRelations = []
for (const e of events) {
  if (e.relatedIds) {
    for (const relatedId of e.relatedIds) {
      if (!validEventIds.has(relatedId)) {
        missingRelations.push(`${e.id} -> ${relatedId}`)
      } else {
        insertRelation.run({ eventId: e.id, relatedId })
      }
    }
  }
}
if (missingRelations.length > 0) {
  console.warn(`⚠️  ${missingRelations.length} invalid relations skipped`)
}
```

---

## 📊 PERFORMANCE ISSUES

### 13. **N+1 QUERY PROBLEM IN RELATIONS RETRIEVAL** [MEDIUM]
**File:** `server/src/index.ts`  
**Lines:** 54-78, 98-101

**Issue:**
```typescript
function getRelatedIdsMap(db: Database.Database, eventIds: string[]) {
  const uniqueIds = Array.from(new Set(eventIds))
  
  if (uniqueIds.length === 0) {
    return new Map<string, string[]>()
  }

  const placeholders = uniqueIds.map(() => '?').join(', ')
  // ✅ Single query, good!
  const relationRows = db
    .prepare(`SELECT event_id, related_id FROM event_relations 
             WHERE event_id IN (${placeholders}) 
             ORDER BY event_id ASC, related_id ASC`)
    .all(...uniqueIds) as Array<{ event_id: string; related_id: string }>
  // ... rest of function
}
```

This is actually implemented well (batch query), but there's still an issue:

**Actual Issue:** After fetching relations, the code returns only IDs without the actual event data:

```typescript
function attachRelations(db: Database.Database, rows: EventRow[]) {
  const relatedIdsMap = getRelatedIdsMap(db, rows.map(row => row.id))
  return rows.map(row => mapEventRow(row, relatedIdsMap.get(row.id) ?? []))
}
```

The frontend only gets related event IDs, not the actual event data (title, year, etc.). This requires additional API calls to fetch relation details, causing N+1 queries on the frontend.

**Recommendation:** Optionally hydrate related events:

```typescript
function getRelatedEvents(db: Database.Database, eventIds: string[], hydrate = false) {
  const uniqueIds = Array.from(new Set(eventIds))
  if (uniqueIds.length === 0) return new Map()

  if (!hydrate) {
    // Current behavior: just IDs
    return getRelatedIdsMap(db, eventIds)
  }

  // New behavior: fetch full event data
  const placeholders = uniqueIds.map(() => '?').join(', ')
  const events = db.prepare(`
    SELECT e.* FROM events e
    JOIN event_relations r ON e.id = r.related_id
    WHERE r.event_id IN (${placeholders})
  `).all(...uniqueIds) as EventRow[]
  
  const map = new Map<string, EventRow[]>()
  for (const event of events) {
    // Group by event_id
  }
  return map
}
```

---

### 14. **UNBOUNDED QUERY LIMIT DEFAULT** [MEDIUM]
**File:** `server/src/index.ts`  
**Lines:** 154, 189

**Issue:**
```typescript
const { search, limit = '1000', offset = '0' } = query
// ❌ Default limit of 1000 is very high
```

Default limit of 1000 events means:
- Memory usage: 1000 EventRow objects × ~500 bytes = 500KB per query
- Database transfer time
- Network bandwidth
- Client JSON parsing

Worse, if a client doesn't specify limit, they always get 1000. There's no validation ceiling.

**Recommendation:**

```typescript
const MAX_LIMIT = 100
const DEFAULT_LIMIT = 20

const limit = Math.min(
  parseInt(query.limit || DEFAULT_LIMIT, 10) || DEFAULT_LIMIT,
  MAX_LIMIT
)
```

---

### 15. **MISSING INDEX ON SIGNIFICANCE QUERY** [LOW]
**File:** `server/src/index.ts`  
**Line:** 147

**Issue:**
```typescript
conditions.push(`${fieldPrefix}significance >= @significance`)
```

The query filters by significance >= a value, but looking at `db.ts`:

```typescript
// db.ts lines 50-54
CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_region ON events(region);
CREATE INDEX IF NOT EXISTS idx_events_year_category ON events(year, category);
CREATE INDEX IF NOT EXISTS idx_events_year_region ON events(year, region);
// ❌ No index on significance!
```

Queries filtering by significance will do full table scans.

**Recommendation:**

```typescript
CREATE INDEX IF NOT EXISTS idx_events_significance ON events(significance);
CREATE INDEX IF NOT EXISTS idx_events_year_significance ON events(year, significance);
```

---

## 🔗 API DESIGN ISSUES

### 16. **MISSING 400 ERRORS FOR INVALID INPUTS** [MEDIUM]
**File:** `server/src/index.ts`  
**Lines:** 136-149, 167-168

**Issue:** Invalid year/limit/offset values are silently coerced:

```typescript
// If user sends ?yearMin=abc
params.yearMin = Number("abc")  // → NaN
// Query still runs, probably returns empty

// If user sends ?limit=xyz
params.limit = Number("xyz")  // → NaN
// LIMIT NaN is invalid SQL, crashes
```

Should return 400 Bad Request for invalid inputs.

**Recommendation:**

```typescript
function validateQuery(query: ListQuery): { valid: boolean; error?: string } {
  if (query.yearMin && isNaN(Number(query.yearMin))) {
    return { valid: false, error: 'yearMin must be a number' }
  }
  if (query.limit && (isNaN(Number(query.limit)) || Number(query.limit) < 0)) {
    return { valid: false, error: 'limit must be a positive number' }
  }
  return { valid: true }
}

app.get('/api/events', (req, res) => {
  const query = req.query as ListQuery
  const validation = validateQuery(query)
  if (!validation.valid) {
    res.status(400).json({ error: validation.error })
    return
  }
  // ... proceed with query
})
```

---

### 17. **INCONSISTENT RESPONSE SCHEMAS** [MEDIUM]
**File:** `server/src/index.ts`  

**Issue:** Different endpoints return different error/response formats:

```typescript
// Line 281-282: Event detail endpoint
if (!current) {
  res.status(404).json({ error: 'Event not found' })
}

// Line 356-358: AI chat endpoint
if (!message?.trim()) {
  res.status(400).json({ error: 'message is required' })
}

// Line 382-384: Health endpoint
res.json({ ok: true, hasClientBuild: HAS_CLIENT_BUILD })

// Line 272: Events list endpoint
res.json({ data, total, limit: Number(limit), offset: Number(offset) })
```

Inconsistent error response structures make client handling difficult.

**Recommendation:**

```typescript
// Create unified response wrapper
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    total?: number
    limit?: number
    offset?: number
  }
}

// Usage:
res.status(404).json({
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'Event not found'
  }
})
```

---

### 18. **MISSING ERROR CODES IN RESPONSES** [LOW]
**File:** `server/src/index.ts`  

**Issue:** Error responses only have a string message, no machine-readable code:

```typescript
res.status(404).json({ error: 'Event not found' })  // ❌ No error code
res.status(400).json({ error: 'message is required' })  // ❌ No error code
```

Makes it hard for clients to:
- Log/track specific error types
- Handle specific errors differently
- i18n translations

**Recommendation:**

```typescript
const ERROR_CODES = {
  NOT_FOUND: 'EVENT_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED'
} as const

res.status(404).json({ 
  error: {
    code: ERROR_CODES.NOT_FOUND,
    message: 'Event not found'
  }
})
```

---

### 19. **MISSING RESPONSE VALIDATION SCHEMA** [LOW]
**File:** `server/src/index.ts`  

**Issue:** No response validation. If database schema changes, response shape becomes inconsistent.

**Recommendation:** Use a schema validation library:

```typescript
import { z } from 'zod'

const EventSchema = z.object({
  id: z.string(),
  year: z.number(),
  title: z.string(),
  // ... etc
})

const response = EventSchema.parse(row)
```

---

## 📝 CODE QUALITY ISSUES

### 20. **INCONSISTENT NULL/UNDEFINED HANDLING** [LOW]
**File:** `server/src/index.ts`  
**Lines:** 80-96

**Issue:**
```typescript
function mapEventRow(row: EventRow, relatedIds: string[] = []) {
  return {
    id: row.id,
    year: row.year,
    endYear: row.end_year ?? undefined,  // ✅ Explicit undefined
    title: row.title,
    description: row.description,
    details: row.details ?? undefined,  // ✅ Explicit undefined
    category: row.category,
    region: row.region,
    significance: row.significance,
    figure: row.figure ?? undefined,  // ✅ Explicit undefined
    icon: row.icon ?? undefined,  // ✅ Explicit undefined
    image: row.image ?? undefined,  // ✅ Explicit undefined
    relatedIds: relatedIds.length ? relatedIds : undefined,  // ✅ Explicit undefined
  }
}
```

Using `?? undefined` is redundant. Just use optional properties:

```typescript
function mapEventRow(row: EventRow, relatedIds: string[] = []) {
  const result: any = {
    id: row.id,
    year: row.year,
    title: row.title,
    description: row.description,
    category: row.category,
    region: row.region,
    significance: row.significance,
  }
  
  if (row.end_year !== null) result.endYear = row.end_year
  if (row.details !== null) result.details = row.details
  if (row.figure !== null) result.figure = row.figure
  if (row.icon !== null) result.icon = row.icon
  if (row.image !== null) result.image = row.image
  if (relatedIds.length) result.relatedIds = relatedIds
  
  return result
}
```

---

### 21. **DERIVED EVENT FILTERING INCONSISTENCY** [LOW]
**File:** `server/src/index.ts`  
**Lines:** 48-52, 103-106

**Issue:** The derived event pattern is defined but only used in specific places:

```typescript
const DERIVED_EVENT_PATTERN = /_(?:context|acceleration|diffusion|legacy)$/

function isDerivedEventId(eventId: string) {
  return DERIVED_EVENT_PATTERN.test(eventId)
}

// Used in:
// - filterCoreContextRows (lines 103-106)
// - /api/events/:id/context endpoint (lines 321-323)

// NOT used in:
// - /api/events list endpoint (line 186-274) ❌ May return derived events
// - /api/stats endpoint (line 340-351) ❌ Counts derived events
```

Inconsistent filtering means some endpoints return derived events while others don't.

**Recommendation:** Apply filtering consistently everywhere or document the behavior.

---

## 🎯 SUMMARY TABLE

| Issue | Severity | Category | File | Line(s) |
|-------|----------|----------|------|---------|
| Exposed API Key | 🔴 CRITICAL | Security | `.env` | 1 |
| Missing Input Validation | 🔴 HIGH | Security | `index.ts` | 138-149, 167-168 |
| No Rate Limiting on AI | 🔴 HIGH | Security | `index.ts` | 354-380 |
| Excessive CORS | 🟠 MEDIUM | Security | `index.ts` | 19 |
| Error Message Exposure | 🟠 MEDIUM | Security | `index.ts` | 375-376 |
| DB Initialization Race | 🟠 MEDIUM | Logic Bug | `db.ts` | 11-23 |
| FTS Pagination Issue | 🟠 MEDIUM | Logic Bug | `index.ts` | 103-106, 198-244 |
| Year Range Edge Case | 🟡 LOW | Logic Bug | `index.ts` | 285-297 |
| Null Dereference Risk | 🟠 MEDIUM | Logic Bug | `ai.ts` | 122-123 |
| Missing Error Handler | 🟠 MEDIUM | Error Handling | `index.ts` | 152-184 |
| Unhandled Promise Rejection | 🟠 MEDIUM | Error Handling | `index.ts` | 394-406 |
| Silent Relation Failures | 🟡 LOW | Error Handling | `seed.ts` | 100-110 |
| Unbounded Query Default | 🟠 MEDIUM | Performance | `index.ts` | 154, 189 |
| Missing Index | 🟡 LOW | Performance | `db.ts` | 50-54 |
| No 400 Errors | 🟠 MEDIUM | API Design | `index.ts` | 136-149 |
| Inconsistent Schemas | 🟠 MEDIUM | API Design | `index.ts` | Various |
| Missing Error Codes | 🟡 LOW | API Design | `index.ts` | Various |
| Missing Response Schema | 🟡 LOW | API Design | `index.ts` | Various |
| Null/Undefined Inconsistency | 🟡 LOW | Code Quality | `index.ts` | 80-96 |
| Filtering Inconsistency | 🟡 LOW | Code Quality | `index.ts` | 48-106 |

---

## 🚨 IMMEDIATE ACTION ITEMS (Priority Order)

1. **[URGENT]** Rotate the exposed API key immediately
2. **[URGENT]** Add `.env` and `.env.local` to `.gitignore`
3. **[HIGH]** Implement input validation for numeric query parameters
4. **[HIGH]** Add rate limiting to `/api/ai/chat` endpoint
5. **[HIGH]** Restrict CORS to specific origins
6. **[MEDIUM]** Add try-catch to all database query endpoints
7. **[MEDIUM]** Add server startup error handler
8. **[MEDIUM]** Implement query parameter validation with 400 responses
9. **[MEDIUM]** Standardize API response schemas
10. **[LOW]** Add missing database indexes
11. **[LOW]** Fix derived event filtering consistency
