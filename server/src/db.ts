import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'data', 'chrono-atlas.db')

let db: Database.Database | null = null

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

function initSchema(db: Database.Database) {
  db.exec(`
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
    );

    CREATE TABLE IF NOT EXISTS event_relations (
      event_id      TEXT NOT NULL,
      related_id    TEXT NOT NULL,
      PRIMARY KEY (event_id, related_id),
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (related_id) REFERENCES events(id)
    );

    CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);
    CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
    CREATE INDEX IF NOT EXISTS idx_events_region ON events(region);
    CREATE INDEX IF NOT EXISTS idx_events_year_category ON events(year, category);
    CREATE INDEX IF NOT EXISTS idx_events_year_region ON events(year, region);

    CREATE VIRTUAL TABLE IF NOT EXISTS events_fts USING fts5(
      title, description, figure, details,
      content='events',
      content_rowid='rowid'
    );

    CREATE TRIGGER IF NOT EXISTS events_ai AFTER INSERT ON events BEGIN
      INSERT INTO events_fts(rowid, title, description, figure, details)
      VALUES (new.rowid, new.title, new.description, new.figure, new.details);
    END;

    CREATE TRIGGER IF NOT EXISTS events_ad AFTER DELETE ON events BEGIN
      INSERT INTO events_fts(events_fts, rowid, title, description, figure, details)
      VALUES ('delete', old.rowid, old.title, old.description, old.figure, old.details);
    END;

    CREATE TRIGGER IF NOT EXISTS events_au AFTER UPDATE ON events BEGIN
      INSERT INTO events_fts(events_fts, rowid, title, description, figure, details)
      VALUES ('delete', old.rowid, old.title, old.description, old.figure, old.details);
      INSERT INTO events_fts(rowid, title, description, figure, details)
      VALUES (new.rowid, new.title, new.description, new.figure, new.details);
    END;
  `)

  ensureColumnExists(db, 'events', 'image', 'TEXT')
}

function ensureColumnExists(
  db: Database.Database,
  tableName: string,
  columnName: string,
  columnDefinition: string
) {
  const columns = db
    .prepare(`PRAGMA table_info(${tableName})`)
    .all() as Array<{ name: string }>

  const hasColumn = columns.some(column => column.name === columnName)
  if (!hasColumn) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`)
  }
}

export function closeDB() {
  if (db) {
    db.close()
    db = null
  }
}
