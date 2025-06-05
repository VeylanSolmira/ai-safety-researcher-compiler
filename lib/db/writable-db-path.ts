import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let cachedDbPath: string | null = null

/**
 * Gets a writable database path, handling read-only filesystems in production.
 * In environments with read-only filesystems (like some serverless platforms),
 * this will copy the database to a writable location (/tmp).
 */
export function getWritableDatabasePath(): string {
  // If we've already determined the path, return it
  if (cachedDbPath) return cachedDbPath
  
  const isProduction = process.env.NODE_ENV === 'production'
  const dbFileName = isProduction ? 'journey-public.db' : 'journey-dev.db'
  
  // Check if we're in an environment with a read-only filesystem
  // This is indicated by either VERCEL env var or a READONLY_FS env var
  const hasReadOnlyFS = isProduction && (process.env.VERCEL || process.env.READONLY_FS)
  
  if (hasReadOnlyFS) {
    // Copy database to /tmp which is typically writable in serverless environments
    const sourceDbPath = path.join(process.cwd(), dbFileName)
    const tmpDbPath = path.join('/tmp', dbFileName)
    
    // Only copy if not already copied
    if (!fs.existsSync(tmpDbPath)) {
      try {
        console.log(`Copying database from ${sourceDbPath} to ${tmpDbPath} for read-only filesystem...`)
        fs.copyFileSync(sourceDbPath, tmpDbPath)
        console.log('Database copied successfully')
      } catch (error) {
        console.error('Error copying database to /tmp:', error)
        // Fall back to original path
        cachedDbPath = sourceDbPath
        return sourceDbPath
      }
    }
    
    cachedDbPath = tmpDbPath
    return tmpDbPath
  }
  
  // For local development or writable filesystems
  cachedDbPath = path.join(process.cwd(), dbFileName)
  return cachedDbPath
}

// Test function to verify database access
export function testDatabaseAccess(): boolean {
  try {
    const dbPath = getWritableDatabasePath()
    const db = new Database(dbPath, { readonly: true })
    const result = db.prepare('SELECT COUNT(*) as count FROM topics').get() as { count: number }
    db.close()
    console.log(`Database test successful. Found ${result.count} topics.`)
    return true
  } catch (error) {
    console.error('Database test failed:', error)
    return false
  }
}