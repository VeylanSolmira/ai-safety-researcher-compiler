import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'

// Database path - use production database in production environment
export function getDatabasePath() {
  return process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'journey-public.db')
    : path.join(process.cwd(), 'journey-dev.db')
}

const DB_PATH = getDatabasePath()

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