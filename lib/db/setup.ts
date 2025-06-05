import Database from 'better-sqlite3'
import { getDatabasePath } from '@/lib/db'
import fs from 'fs'
import path from 'path'

// Create database instance
const DB_PATH = getDatabasePath()

// Initialize database with schema
export function initializeDatabase(force = false) {
  // Remove existing database if force is true
  if (force && fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log('Removed existing database')
  }

  // Create new database
  const db = new Database(DB_PATH)
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON')
  
  // Read and execute schema
  const schemaPath = path.join(process.cwd(), 'docs', 'database-schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')
  
  // Remove comments and split into statements
  const cleanSchema = schema
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
  
  const statements = cleanSchema
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0)
  
  console.log(`Executing ${statements.length} SQL statements...`)
  
  try {
    // Execute each statement individually
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length > 0) {
        try {
          db.prepare(statement).run()
        } catch (error: any) {
          console.error(`Error executing statement ${i + 1}:`, statement.substring(0, 50) + '...')
          console.error('Error:', error.message)
          throw error
        }
      }
    }
    
    console.log('Database schema created successfully')
  } catch (error) {
    console.error('Error creating schema:', error)
    throw error
  }
  
  // Insert initial data
  insertInitialData(db)
  
  return db
}

// Insert initial data
function insertInitialData(db: Database.Database) {
  // Insert learning paths
  const insertPath = db.prepare(`
    INSERT INTO learning_paths (id, name, description) VALUES (?, ?, ?)
  `)
  
  const paths = [
    ['all', 'All Paths', 'Suitable for all learning paths'],
    ['technical-safety', 'Technical Safety', 'Focus on technical AI safety research'],
    ['governance', 'Governance', 'Focus on AI policy and governance'],
    ['engineering', 'Engineering', 'Focus on building safe AI systems'],
    ['research', 'Research', 'Focus on AI safety research']
  ]
  
  db.transaction(() => {
    for (const [id, name, description] of paths) {
      insertPath.run(id, name, description)
    }
  })()
  
  console.log('Inserted learning paths')
}

// Get database instance (singleton)
let dbInstance: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    if (!fs.existsSync(DB_PATH)) {
      console.log('Database not found, initializing...')
      dbInstance = initializeDatabase()
    } else {
      dbInstance = new Database(DB_PATH)
      dbInstance.pragma('foreign_keys = ON')
    }
  }
  return dbInstance
}

// Close database connection
export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

// Run if called directly
if (require.main === module) {
  console.log('Setting up AI Safety Journey database...')
  const forceReset = process.argv.includes('--force')
  initializeDatabase(forceReset)
  console.log('Database setup complete!')
  process.exit(0)
}