import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'

// Database path
const DB_PATH = path.join(process.cwd(), 'journey.db')

// Create database instance
let db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!db) {
    const sqlite = new Database(DB_PATH)
    sqlite.pragma('foreign_keys = ON')
    db = drizzle(sqlite, { schema })
  }
  return db
}

// Export schema for easy access
export * from './schema'

// Export common query utilities
export { eq, and, or, like, sql, asc, desc } from 'drizzle-orm'