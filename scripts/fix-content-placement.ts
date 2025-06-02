#!/usr/bin/env npx tsx

/**
 * Fix content placement for foundations and FAR
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

console.log('🔧 Fixing content placement...\n')

// 1. Move foundations content from ai-welfare-patienthood to prerequisites-foundations
console.log('1. Moving foundations content to correct location...')
const foundationsAcademic = readMarkdownFile('foundations@foundations-topic.md')
const foundationsPersonal = readMarkdownFile('foundations@foundations-topic.personal.md')

// First, clear the wrong placement
updateTopicContent.run(null, null, 'ai-welfare-patienthood')
console.log('  ✅ Cleared content from ai-welfare-patienthood')

// Then add to correct location (but preserve existing prerequisites content)
const existingPrereq = db.prepare('SELECT content_academic, content_personal FROM topics WHERE id = ?').get('prerequisites-foundations') as any

if (existingPrereq && existingPrereq.content_academic) {
  // Append foundations content to existing prerequisites
  const combinedAcademic = existingPrereq.content_academic + '\n\n---\n\n' + foundationsAcademic
  const combinedPersonal = (existingPrereq.content_personal || '') + 
    (foundationsPersonal ? '\n\n---\n\n' + foundationsPersonal : '')
  
  updateTopicContent.run(combinedAcademic, combinedPersonal || null, 'prerequisites-foundations')
  console.log('  ✅ Appended foundations content to prerequisites-foundations')
} else {
  updateTopicContent.run(foundationsAcademic, foundationsPersonal || null, 'prerequisites-foundations')
  console.log('  ✅ Added foundations content to prerequisites-foundations')
}

// 2. Import FAR content to global-coordination topic
console.log('\n2. Importing FAR content to global-coordination...')
const farAcademic = readMarkdownFile('far@far-subtopic.md')
const farPersonal = readMarkdownFile('far@far-subtopic.personal.md')

if (farAcademic || farPersonal) {
  updateTopicContent.run(farAcademic || null, farPersonal || null, 'global-coordination')
  console.log('  ✅ Added FAR content to global-coordination topic')
}

console.log('\n✅ Content placement fixed!')

db.close()