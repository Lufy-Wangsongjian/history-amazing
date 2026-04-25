# Backend Architecture Analysis - Chrono Atlas

## Executive Summary
The backend is a **lightweight Node.js/Express server** with **zero authentication currently**. It uses **SQLite for data persistence** and **OpenAI-compatible API for AI features**. The architecture is minimal and stateless, designed for read-heavy historical event queries.

---

## 1. Server Entry Point: `server/src/index.ts`

### File Path: `/Users/lufywang/Documents/Coding/history-amazing/server/src/index.ts` (461 lines)

### Key Findings:

#### Middleware Stack (Lines 16-22)
```typescript
const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
}))
app.use(express.json({ limit: '10kb' }))
```

**Current Middleware:**
- ✅ `cors` - CORS configuration
- ✅ `express.json` - JSON body parsing (10KB limit)
- ❌ **NO authentication middleware** (this is where we need to add auth)
- ❌ No rate limiting
- ❌ No request logging
- ❌ No helmet (security headers)

#### Server Configuration
- **Port**: `process.env.PORT || 3001`
- **CORS Origins**: `process.env.ALLOWED_ORIGINS` (comma-separated) or `'*'` (wildcard)
- **JSON Limit**: 10KB (restrictive, may need adjustment)

#### Routes Structure (Lines 228-446)

**Current API Endpoints:**

1. **GET `/api/events`** (Lines 228-318)
   - List events with filtering
   - Query parameters: categories, regions, yearMin, yearMax, search, significance, limit, offset
   - Supports FTS (Full-Text Search) for English, fallback search for CJK
   - Response: `{ data: Event[], total: number, limit: number, offset: number }`

2. **GET `/api/events/:id/context`** (Lines 320-369)
   - Get context for a specific event
   - Returns: contemporary events, same-category events, related events

3. **GET `/api/events/:id`** (Lines 371-382)
   - Get single event by ID
   - Response: Event object with relations

4. **GET `/api/stats`** (Lines 384-397)
   - Global statistics
   - Returns: counts by category, region, significance, year range

5. **POST `/api/ai/chat`** (Lines 400-434)
   - AI chat endpoint with Server-Sent Events (SSE)
   - Streams responses from LLM
   - Response headers: text/event-stream

6. **GET `/health`** (Lines 436-438)
   - Health check endpoint
   - Returns: `{ ok: true, hasClientBuild: boolean }`

7. **Fallback: SPA Router** (Lines 440-446)
   - Serves static client build
   - Redirects non-API routes to index.html

#### Authentication Status
- **Lines 1-450**: ❌ **Zero authentication**
- No middleware checking tokens, sessions, or user identities
- All routes are **completely public**
- The `/api/ai/chat` endpoint is **unprotected** - anyone can call it and potentially incur API costs

#### Server Startup (Lines 448-460)
```typescript
app.listen(PORT, () => {
  console.log(`Chrono Atlas 服务已启动: http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  closeDB()
  process.exit(0)
})

process.on('SIGTERM', () => {
  closeDB()
  process.exit(0)
})
```
- Listens on configured PORT
- Gracefully shuts down on SIGINT/SIGTERM
- Closes DB connection on exit

---

## 2. Database Layer: `server/src/db.ts`

### File Path: `/Users/lufywang/Documents/Coding/history-amazing/server/src/db.ts` (106 lines)

### Database Initialization (Lines 11-23)

```typescript
export function getDB(): Database.Database {
  if (!db) {
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

**Database Configuration:**
- **Location**: `server/data/chrono-atlas.db`
- **Type**: SQLite3 (better-sqlite3)
- **Journal Mode**: WAL (Write-Ahead Logging) for concurrency
- **Foreign Keys**: Enabled
- **Singleton pattern**: Single DB instance per process

### Schema: `initSchema()` (Lines 25-81)

#### Table 1: `events`
```sql
CREATE TABLE IF NOT EXISTS events (
  id            TEXT PRIMARY KEY,
  year          INTEGER NOT NULL,
  end_year      INTEGER,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  details       TEXT,
  category      TEXT NOT NULL,
  region        TEXT NOT NULL,
  significance  INTEGER NOT NULL CHECK (significance BETWEEN 1 AND 3),
  figure        TEXT,
  icon          TEXT,
  image         TEXT
)
```

**Key Characteristics:**
- **No user-related columns** (no user_id, owner, etc.)
- **Immutable historical data** (no created_at, updated_at, deleted_at)
- 12+ columns for event data
- Significance: 1-3 (CHECK constraint)

#### Table 2: `event_relations`
```sql
CREATE TABLE IF NOT EXISTS event_relations (
  event_id      TEXT NOT NULL,
  related_id    TEXT NOT NULL,
  PRIMARY KEY (event_id, related_id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (related_id) REFERENCES events(id)
)
```

**Purpose**: Links related events together (graph relationships)

#### Virtual Table: `events_fts` (Full-Text Search)
```sql
CREATE VIRTUAL TABLE IF NOT EXISTS events_fts USING fts5(
  title, description, figure, details,
  content='events',
  content_rowid='rowid'
)
```

**Purpose**: FTS5 index for fast full-text search (optimized for English)

#### Indexes (Lines 50-54)
- `idx_events_year`
- `idx_events_category`
- `idx_events_region`
- `idx_events_year_category`
- `idx_events_year_region`

#### Triggers (Lines 62-77)
Auto-sync FTS index on INSERT/UPDATE/DELETE

### Migration Pattern: `ensureColumnExists()` (Lines 83-98)

```typescript
function ensureColumnExists(
  db: Database.Database,
  tableName: string,
  columnName: string,
  columnDefinition: string
) {
  try {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (!msg.includes('duplicate column')) {
      throw err
    }
  }
}
```

**Current Usage**: `ensureColumnExists(db, 'events', 'image', 'TEXT')` (Line 80)

**For Auth System, we'll need to:**
1. Add `users` table
2. Add `sessions` or `tokens` table
3. Add auth-related columns to existing tables if needed
4. Add indexes for auth lookups

### DB Cleanup (Lines 100-105)
```typescript
export function closeDB() {
  if (db) {
    db.close()
    db = null
  }
}
```

---

## 3. AI Service: `server/src/ai.ts`

### File Path: `/Users/lufywang/Documents/Coding/history-amazing/server/src/ai.ts` (131 lines)

### Environment Variables Used (Lines 80-87)

```typescript
const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY
const baseURL = process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.deepseek.com'
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat'
```

**Checked in order:**
1. `AI_API_KEY` (primary)
2. `OPENAI_API_KEY`
3. `DEEPSEEK_API_KEY`

**Base URL:**
1. `AI_BASE_URL` (primary)
2. `OPENAI_BASE_URL`
3. Default: `https://api.deepseek.com`

**Model**: `process.env.AI_MODEL || 'deepseek-chat'`

### RAG Integration
- Retrieves relevant events from DB based on user query
- Formats context and sends to LLM
- Streams response back to client

---

## 4. Dependencies: `server/package.json`

### File Path: `/Users/lufywang/Documents/Coding/history-amazing/server/package.json` (26 lines)

```json
{
  "name": "chrono-atlas-server",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "seed": "tsx src/seed.ts",
    "start": "tsx src/index.ts"
  },
  "dependencies": {
    "better-sqlite3": "^11.7.0",
    "cors": "^2.8.5",
    "dotenv": "^17.4.2",
    "express": "^5.1.0",
    "openai": "^6.34.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.12",
    "@types/cors": "^2.8.18",
    "@types/express": "^5.0.2",
    "tsx": "^4.19.0",
    "typescript": "~5.9.3"
  }
}
```

### Analysis:
- ✅ `express` (5.1.0) - Web framework
- ✅ `better-sqlite3` (11.7.0) - SQLite driver
- ✅ `cors` (2.8.5) - CORS middleware
- ✅ `dotenv` (17.4.2) - Environment variables
- ✅ `openai` (6.34.0) - LLM API client
- ❌ **NO auth packages**: No jwt, passport, bcrypt, etc.

**Missing for Auth Implementation:**
- `jsonwebtoken` - JWT signing/verification
- `bcryptjs` - Password hashing
- `passport` or custom auth middleware
- `cookie-parser` - Session management
- `express-session` - Session store (if needed)

---

## 5. TypeScript Configuration: `server/tsconfig.json`

### File Path: `/Users/lufywang/Documents/Coding/history-amazing/server/tsconfig.json` (14 lines)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "..",
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*", "../app/src/data/**/*"]
}
```

**Key Settings:**
- `strict: true` ✅ - Strict type checking enabled
- `target: ES2022` - Modern JavaScript
- `esModuleInterop: true` ✅ - Good for CommonJS imports
- `skipLibCheck: true` - Fast compilation

---

## 6. Environment Variables

### File Path: `/Users/lufywang/Documents/Coding/history-amazing/server/.env`

```env
AI_API_KEY=sk-75ac26d68a0640a0b983deb60528264a
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-chat
```

### All `process.env` Usage Across Server:

| Variable | File | Line | Purpose |
|----------|------|------|---------|
| `PORT` | index.ts | 17 | Server port (default: 3001) |
| `ALLOWED_ORIGINS` | index.ts | 20 | CORS allowed origins |
| `AI_API_KEY` | ai.ts | 80 | LLM API key |
| `OPENAI_API_KEY` | ai.ts | 80 | OpenAI key (fallback) |
| `DEEPSEEK_API_KEY` | ai.ts | 80 | DeepSeek key (fallback) |
| `AI_BASE_URL` | ai.ts | 83 | LLM API endpoint |
| `OPENAI_BASE_URL` | ai.ts | 83 | OpenAI endpoint (fallback) |
| `AI_MODEL` | ai.ts | 87 | LLM model name |

### Missing Environment Variables for Auth:
- `JWT_SECRET` - For signing JWTs
- `SESSION_SECRET` - For session encryption
- `DB_PATH` - Currently hardcoded
- `NODE_ENV` - To distinguish dev/prod
- `CORS_ORIGIN` - More structured CORS config

---

## 7. Seed Script: `server/src/seed.ts`

### File Path: `/Users/lufywang/Documents/Coding/history-amazing/server/src/seed.ts` (143 lines)

**Purpose**: Loads historical events from frontend data and populates SQLite

**Key Points:**
- Imports events from `app/src/data/events.js`
- Clears old data on each seed
- Uses transactions for batch insertion
- Inserts both events and event relations
- Validates data integrity

---

## Authentication Audit

### ❌ Current State: ZERO Authentication

**Search Results:**
- `jwt`, `token`, `session`, `auth`, `login`, `user`, `password` search in `/server/src/` → **Only AI-related "token" strings** (not auth tokens)

**Vulnerabilities:**
1. ✅ **AI Chat Endpoint Unprotected** (`/api/ai/chat`)
   - Anyone can call it
   - No rate limiting
   - Potential for API cost abuse
   - No tracking of who called it

2. ✅ **Data Endpoints Public** (`/api/events*`, `/api/stats`)
   - Read-only, so lower risk
   - But could be scraped or DDos'd

3. ✅ **No User Concept**
   - No user profiles
   - No preferences
   - No audit trails
   - No rate limiting per user

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React)                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  Express Server (index.ts)              │
├─────────────────────────────────────────────────────────┤
│  Middleware:                                             │
│  - CORS                                                 │
│  - JSON Parser                                          │
│  ❌ NO AUTH MIDDLEWARE                                  │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                 │
│  - GET  /api/events          (Public, Read)             │
│  - GET  /api/events/:id      (Public, Read)             │
│  - GET  /api/events/:id/context (Public, Read)          │
│  - GET  /api/stats           (Public, Read)             │
│  - POST /api/ai/chat         (🔴 UNPROTECTED, $$$)      │
│  - GET  /health              (Public, Status)           │
│  - SPA  * (Fallback)         (Public, Static)           │
├─────────────────────────────────────────────────────────┤
│  Services:                                               │
│  - DB (db.ts)                                            │
│  - AI (ai.ts)                                            │
└──────┬──────────────────────────┬──────────────────────┘
       ↓                          ↓
┌────────────────────┐   ┌────────────────────────┐
│  SQLite Database   │   │  OpenAI Compatible API │
│  (better-sqlite3)  │   │  (DeepSeek/OpenAI)     │
│                    │   │                        │
│  - events table    │   │  Uses AI_API_KEY       │
│  - relations table │   │  (Cost: $$$)           │
│  - FTS index       │   │                        │
│  - Indexes         │   │                        │
└────────────────────┘   └────────────────────────┘
```

---

## Recommendations for Auth Implementation

### Phase 1: Foundation (MVP)
1. **Add JWT-based authentication**
   - `jsonwebtoken` for signing/verifying
   - `bcryptjs` for password hashing
   - Auth middleware to protect sensitive endpoints

2. **Create auth database tables**
   - `users` table (email, password_hash, created_at, etc.)
   - `refresh_tokens` table (for token refresh logic)
   - Optional: `api_keys` table (for programmatic access)

3. **Protect `/api/ai/chat` endpoint**
   - Require valid JWT or API key
   - Add rate limiting (e.g., 10 requests/min per user)
   - Log all calls for audit trail

4. **Create auth endpoints**
   - `POST /auth/register` - Create account
   - `POST /auth/login` - Get JWT
   - `POST /auth/refresh` - Refresh expired token
   - `POST /auth/logout` - Invalidate token

### Phase 2: Enhancement
1. Add session management
2. Add role-based access control (RBAC)
3. Add user preferences/bookmarks storage
4. Add API key management for programmatic access

### Phase 3: Security
1. Add rate limiting middleware
2. Add request logging/audit
3. Add HTTPS enforcement
4. Add helmet security headers
5. Add input validation/sanitization

---

## Summary Table

| Aspect | Status | File | Line(s) |
|--------|--------|------|---------|
| **Middleware** | Minimal | index.ts | 19-22 |
| **Authentication** | ❌ None | - | - |
| **Routes** | 7 endpoints | index.ts | 228-446 |
| **Database** | SQLite | db.ts | 1-106 |
| **Tables** | 3 (events, relations, fts) | db.ts | 26-77 |
| **AI Integration** | OpenAI-compatible | ai.ts | 1-131 |
| **Env Variables** | 7 (mostly AI) | .env | All |
| **Dependencies** | 5 production | package.json | 11-17 |
| **Auth Packages** | ❌ Zero | package.json | - |
| **Port** | 3001 (configurable) | index.ts | 17 |
| **JWT Secret** | ❌ Not configured | - | - |
| **Session Store** | ❌ Not configured | - | - |

