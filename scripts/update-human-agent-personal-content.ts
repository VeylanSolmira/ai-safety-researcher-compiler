import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Read the markdown file
const markdownPath = path.join(__dirname, 'human-agent-interaction-personal.md')
const personalContent = fs.readFileSync(markdownPath, 'utf-8')

// Database connection
const dbPath = path.join(process.cwd(), 'journey.db')
const db = new Database(dbPath)

// Update the personal content for human-agent-interaction
const stmt = db.prepare(`
  UPDATE topics 
  SET content_personal = ?,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`)

const result = stmt.run(personalContent, 'human-agent-interaction')

if (result.changes > 0) {
  console.log('✅ Successfully updated human-agent-interaction personal content')
  
  // Verify the update
  const verify = db.prepare('SELECT id, LENGTH(content_personal) as length FROM topics WHERE id = ?')
  const row = verify.get('human-agent-interaction') as any
  
  console.log(`📏 Personal content length: ${row.length} characters`)
} else {
  console.log('❌ Failed to update - topic not found')
}

db.close()
console.log('✨ Update complete!')