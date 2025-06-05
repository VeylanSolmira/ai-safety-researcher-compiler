import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let cachedDbPath: string | null = null

export function getVercelSafeDatabasePath(): string {
  // If we've already determined the path, return it
  if (cachedDbPath) return cachedDbPath
  
  const isProduction = process.env.NODE_ENV === 'production'
  const dbFileName = isProduction ? 'journey-public.db' : 'journey-dev.db'
  
  // In production on Vercel, we need to handle the read-only filesystem
  if (isProduction && process.env.VERCEL) {
    // Copy database to /tmp which is writable in Vercel
    const sourceDbPath = path.join(process.cwd(), dbFileName)
    const tmpDbPath = path.join('/tmp', dbFileName)
    
    // Only copy if not already copied
    if (!fs.existsSync(tmpDbPath)) {
      try {
        console.log(`Copying database from ${sourceDbPath} to ${tmpDbPath} for Vercel...`)
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
  
  // For local development or non-Vercel production
  cachedDbPath = path.join(process.cwd(), dbFileName)
  return cachedDbPath
}

// Test function to verify database access
export function testDatabaseAccess(): boolean {
  try {
    const dbPath = getVercelSafeDatabasePath()
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