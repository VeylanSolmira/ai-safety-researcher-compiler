import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Get topic ID from command line
const topicId = process.argv[2]
if (!topicId) {
  console.error('Usage: npx tsx import-single-topic.ts <topic-id>')
  process.exit(1)
}

// Read content files
const academicPath = path.join(__dirname, `${topicId}-academic.md`)
const personalPath = path.join(__dirname, `${topicId}-personal.md`)

if (!fs.existsSync(academicPath) || !fs.existsSync(personalPath)) {
  console.error(`Content files not found for topic: ${topicId}`)
  console.error(`Expected: ${academicPath} and ${personalPath}`)
  process.exit(1)
}

const academicContent = fs.readFileSync(academicPath, 'utf-8')
const personalContent = fs.readFileSync(personalPath, 'utf-8')

// Database connection
const dbPath = path.join(process.cwd(), 'journey.db')
const db = new Database(dbPath)

// Update topic
const stmt = db.prepare(`
  UPDATE topics 
  SET content_academic = ?, 
      content_personal = ?,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`)

const result = stmt.run(academicContent, personalContent, topicId)

if (result.changes > 0) {
  console.log(`✅ Successfully updated: ${topicId}`)
  
  // Verify the update
  const verify = db.prepare('SELECT id, LENGTH(content_academic) as ac_len, LENGTH(content_personal) as pc_len FROM topics WHERE id = ?')
  const row = verify.get(topicId) as any
  
  console.log(`📏 Academic content: ${row.ac_len} characters`)
  console.log(`📏 Personal content: ${row.pc_len} characters`)
} else {
  console.log(`❌ Failed to update - topic not found: ${topicId}`)
}

db.close()