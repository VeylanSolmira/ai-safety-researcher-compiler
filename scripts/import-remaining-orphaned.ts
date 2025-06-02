#!/usr/bin/env npx tsx

/**
 * Import remaining orphaned content with corrected topic IDs
 */

import Database from 'better-sqlite3'
import * as fs from 'fs'
import * as path from 'path'

const db = new Database('journey.db')

// Helper to read markdown file
function readMarkdownFile(filePath: string): string {
  const fullPath = path.join(
    '/Users/infinitespire/ai_dev/ai-safety-research-compiler/src/data/roadmaps/ai-safety-researcher/content',
    filePath
  )
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf-8')
  }
  return ''
}

// Helper to update topic content
const updateTopicContent = db.prepare(`
  UPDATE topics 
  SET content_academic = ?, content_personal = ?
  WHERE id = ?
`)

// Remaining imports with corrected IDs
const remainingImports = [
  {
    file: 'foundations@foundations-topic.md',
    personalFile: 'foundations@foundations-topic.personal.md',
    topicId: 'ai-welfare-patienthood' // This might not be the right match, let's check
  },
  {
    file: 'teacher-trainer@teacher-trainer-subtopic.md',
    personalFile: 'teacher-trainer@teacher-trainer-subtopic.personal.md',
    topicId: 'teacher-trainer-paradigms'
  },
  {
    file: 'core-methodology@core-methodology-subtopic.md',
    personalFile: 'core-methodology@core-methodology-subtopic.personal.md',
    topicId: 'core-methodology'
  }
]

console.log('🚀 Importing remaining orphaned content...\n')

let updated = 0

for (const item of remainingImports) {
  console.log(`Processing: ${item.file}`)
  
  // Read content files
  const academicContent = readMarkdownFile(item.file)
  const personalContent = readMarkdownFile(item.personalFile)
  
  if (!academicContent && !personalContent) {
    console.log(`  ⚠️  Warning: No content found`)
    continue
  }
  
  try {
    const result = updateTopicContent.run(
      academicContent || null,
      personalContent || null,
      item.topicId
    )
    
    if (result.changes > 0) {
      console.log(`  ✅ Updated topic: ${item.topicId}`)
      updated++
    } else {
      console.log(`  ⚠️  Topic not found: ${item.topicId}`)
    }
  } catch (error) {
    console.log(`  ❌ Error:`, error instanceof Error ? error.message : String(error))
  }
}

// Check if FAR content should go elsewhere
console.log('\n🔍 Checking for FAR/Frontier AI Regulation topic...')
const farCheck = db.prepare(`
  SELECT id, title FROM topics 
  WHERE title LIKE '%regulation%' 
     OR title LIKE '%governance%' 
     OR title LIKE '%policy%'
  ORDER BY title
`).all()

console.log('Potential topics for FAR content:')
farCheck.forEach((topic: any) => {
  console.log(`  - ${topic.id}: ${topic.title}`)
})

console.log(`\n📊 Summary: Updated ${updated} topics`)
console.log('\n💡 Note: FAR content may need to be imported to a governance/policy topic')
console.log('💡 Note: foundations@foundations-topic content may need manual review for proper placement')

db.close()