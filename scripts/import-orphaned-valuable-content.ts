#!/usr/bin/env npx tsx

/**
 * Import valuable orphaned content based on the review document
 * This script implements the plan from valuable-orphaned-content-review.md
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

// Helper to create new topic
const insertTopic = db.prepare(`
  INSERT INTO topics (id, module_id, title, description, estimated_time, difficulty, position, content_academic, content_personal)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

// Get max position for a module
const getMaxPosition = db.prepare(`
  SELECT MAX(position) as max_pos FROM topics WHERE module_id = ?
`)

// Import plan based on the review document
const importPlan = [
  // 1. Create new topic for adversarial-meta-learning
  {
    action: 'create',
    file: 'adversarial-meta-learning@adversarial-meta-learning-subtopic.md',
    personalFile: 'adversarial-meta-learning@adversarial-meta-learning-subtopic.personal.md',
    topicId: 'adversarial-meta-learning',
    moduleId: 'advanced-red-teaming',
    title: 'Adversarial Meta-Learning',
    description: 'Advanced techniques for creating adaptive adversarial examples that generalize across models',
    estimatedTime: '3 hours',
    difficulty: 'advanced' as const
  },
  
  // 2. Import prerequisites content
  {
    action: 'update',
    file: 'prerequisites@prerequisites-topic.md',
    personalFile: 'prerequisites@prerequisites-topic.personal.md',
    topicId: 'prerequisites-foundations'
  },
  
  // 3. Import foundations content
  {
    action: 'update',
    file: 'foundations@foundations-topic.md',
    personalFile: 'foundations@foundations-topic.personal.md',
    topicId: 'ai-safety-foundations'
  },
  
  // 4. Import teacher-trainer content
  {
    action: 'update',
    file: 'teacher-trainer@teacher-trainer-subtopic.md',
    personalFile: 'teacher-trainer@teacher-trainer-subtopic.personal.md',
    topicId: 'teacher-trainer'
  },
  
  // 5. Import FAR content
  {
    action: 'update',
    file: 'far@far-subtopic.md',
    personalFile: 'far@far-subtopic.personal.md',
    topicId: 'frontier-ai-regulation'
  },
  
  // 6. Import iterative research design
  {
    action: 'update',
    file: 'iterative-research-design@iterative-research-design-subtopic.md',
    personalFile: 'iterative-research-design@iterative-research-design-subtopic.personal.md',
    topicId: 'iterative-research'
  },
  
  // 7. Import disrupting research (pending review)
  {
    action: 'review',
    file: 'disrupting-research@disrupting-research-subtopic.personal.md',
    note: 'Needs review for AI safety relevance'
  },
  
  // 8. Create new topic for foundational papers in foundation tier
  {
    action: 'create',
    file: 'foundational-papers@foundational-papers-subtopic.md',
    personalFile: 'foundational-papers@foundational-papers-subtopic.personal.md',
    topicId: 'foundational-papers',
    moduleId: 'intro-module', // Add to intro module in foundation tier
    title: 'Foundational AI Safety Papers',
    description: 'Essential papers that established the field of AI safety research',
    estimatedTime: '4 hours',
    difficulty: 'beginner' as const
  },
  
  // 9. Import problem decomposition
  {
    action: 'update',
    file: 'problem-decomposition-scoping@problem-decomposition-scoping-subtopic.md',
    personalFile: 'problem-decomposition-scoping@problem-decomposition-scoping-subtopic.personal.md',
    topicId: 'problem-decomposition'
  },
  
  // 10. Import core methodology
  {
    action: 'update',
    file: 'core-methodology@core-methodology-subtopic.md',
    personalFile: 'core-methodology@core-methodology-subtopic.personal.md',
    topicId: 'core-research-methodology'
  },
  
  // 11. Import safety capability balance
  {
    action: 'update',
    file: 'safety-capability-balance@safety-capability-balance-subtopic.md',
    personalFile: 'safety-capability-balance@safety-capability-balance-subtopic.personal.md',
    topicId: 'safety-capability-balance'
  },
  
  // 12. Skip Neel Nanda - already moved to community profiles
  {
    action: 'skip',
    file: 'neel-nanda@neel-nanda-subtopic.personal.md',
    note: 'Already imported to Community Directory profiles'
  }
]

console.log('🚀 Starting import of valuable orphaned content...\n')

let created = 0
let updated = 0
let skipped = 0
let needsReview = 0

for (const item of importPlan) {
  console.log(`Processing: ${item.file}`)
  
  if (item.action === 'skip') {
    console.log(`  ⏭️  Skipped: ${item.note}`)
    skipped++
    continue
  }
  
  if (item.action === 'review') {
    console.log(`  🔍 Needs review: ${item.note}`)
    needsReview++
    continue
  }
  
  // Read content files
  const academicContent = item.file ? readMarkdownFile(item.file) : ''
  const personalContent = item.personalFile ? readMarkdownFile(item.personalFile) : ''
  
  if (!academicContent && !personalContent) {
    console.log(`  ⚠️  Warning: No content found for ${item.file}`)
    continue
  }
  
  if (item.action === 'update') {
    // Update existing topic
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
      console.log(`  ❌ Error updating ${item.topicId}:`, error instanceof Error ? error.message : String(error))
    }
  } else if (item.action === 'create') {
    // Create new topic
    try {
      // Get next position
      const maxPosResult = getMaxPosition.get(item.moduleId) as { max_pos: number | null }
      const position = (maxPosResult?.max_pos ?? -1) + 1
      
      insertTopic.run(
        item.topicId!,
        item.moduleId!,
        item.title!,
        item.description!,
        item.estimatedTime!,
        item.difficulty!,
        position,
        academicContent || null,
        personalContent || null
      )
      
      console.log(`  ✅ Created new topic: ${item.topicId} in module ${item.moduleId}`)
      created++
    } catch (error) {
      console.log(`  ❌ Error creating ${item.topicId}:`, error instanceof Error ? error.message : String(error))
    }
  }
}

console.log('\n📊 Import Summary:')
console.log(`  Created: ${created} new topics`)
console.log(`  Updated: ${updated} existing topics`)
console.log(`  Skipped: ${skipped} items`)
console.log(`  Needs Review: ${needsReview} items`)

console.log('\n✅ Import complete!')

// Close database
db.close()