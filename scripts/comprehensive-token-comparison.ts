#!/usr/bin/env node

import { getDb, eq } from '../lib/db'
import * as schema from '../lib/db/schema'
import { journeyTiers } from '../lib/journey'
import { mentors, organizations, researchTopics } from '../lib/resources/cbai-2025-mentors'

console.log('🔍 Comprehensive Token Usage Analysis\n')
console.log('=' .repeat(60))

// Helper to measure token usage
function measureTokens(data: any): number {
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  return Math.round(str.length / 4) // rough approximation: 4 chars = 1 token
}

// Measure different operations
const operations = []

// 1. Loading journey data
console.log('\n📚 JOURNEY DATA OPERATIONS')
console.log('-'.repeat(40))

// File method
const journeyFileTokens = measureTokens(journeyTiers)
console.log(`File import (journey.ts): ${journeyFileTokens.toLocaleString()} tokens`)

// Database method - single topic
const db = getDb()
const singleTopic = db.select().from(schema.topics).where(eq(schema.topics.id, 'alignment')).get()
const singleTopicTokens = measureTokens(singleTopic) + measureTokens('SELECT * FROM topics WHERE id = ?')
console.log(`DB query (single topic): ${singleTopicTokens} tokens`)

operations.push({
  operation: 'Fetch single topic',
  fileTokens: journeyFileTokens,
  dbTokens: singleTopicTokens,
  reduction: Math.round((1 - singleTopicTokens/journeyFileTokens) * 100)
})

// 2. Loading mentor data
console.log('\n👥 MENTOR DATA OPERATIONS')
console.log('-'.repeat(40))

const mentorFileData = { mentors, organizations, researchTopics }
const mentorFileTokens = measureTokens(mentorFileData)
console.log(`File import (mentors.ts): ${mentorFileTokens.toLocaleString()} tokens`)

// Database method - single mentor
const singleMentor = db.select().from(schema.mentors).where(eq(schema.mentors.id, 'stephen-casper')).get()
const singleMentorTokens = measureTokens(singleMentor) + measureTokens('SELECT * FROM mentors WHERE id = ?')
console.log(`DB query (single mentor): ${singleMentorTokens} tokens`)

operations.push({
  operation: 'Fetch single mentor',
  fileTokens: mentorFileTokens,
  dbTokens: singleMentorTokens,
  reduction: Math.round((1 - singleMentorTokens/mentorFileTokens) * 100)
})

// 3. Search operations
console.log('\n🔎 SEARCH OPERATIONS')
console.log('-'.repeat(40))

// File method - search for "safety"
let fileSearchCount = 0
for (const tier of journeyTiers) {
  for (const module of tier.modules) {
    for (const topic of module.topics) {
      if (topic.title.toLowerCase().includes('safety') || 
          topic.description.toLowerCase().includes('safety')) {
        fileSearchCount++
      }
    }
  }
}
console.log(`File search "safety": ${journeyFileTokens.toLocaleString()} tokens (found ${fileSearchCount} results)`)

// Database method
const dbSearchResults = db
  .select({ id: schema.topics.id, title: schema.topics.title })
  .from(schema.topics)
  .all()
  .filter(t => t.title.toLowerCase().includes('safety'))
  
const dbSearchTokens = measureTokens(dbSearchResults) + measureTokens('SELECT id, title FROM topics')
console.log(`DB search "safety": ${dbSearchTokens} tokens (found ${dbSearchResults.length} results)`)

operations.push({
  operation: 'Search for "safety"',
  fileTokens: journeyFileTokens,
  dbTokens: dbSearchTokens,
  reduction: Math.round((1 - dbSearchTokens/journeyFileTokens) * 100)
})

// 4. Progress tracking
console.log('\n📊 PROGRESS TRACKING')
console.log('-'.repeat(40))

// Simulating updating progress - file method would need to:
// 1. Read entire file
// 2. Parse and find user progress
// 3. Update in memory
// 4. Write entire file back
const progressFileTokens = journeyFileTokens * 2 // read + write
console.log(`File update progress: ${progressFileTokens.toLocaleString()} tokens (read + write)`)

// Database method
const progressUpdateSQL = 'UPDATE user_progress SET completed = 1 WHERE user_id = ? AND topic_id = ?'
const progressDbTokens = measureTokens(progressUpdateSQL) + 20 // small response
console.log(`DB update progress: ${progressDbTokens} tokens`)

operations.push({
  operation: 'Update user progress',
  fileTokens: progressFileTokens,
  dbTokens: progressDbTokens,
  reduction: Math.round((1 - progressDbTokens/progressFileTokens) * 100)
})

// 5. Aggregation operations
console.log('\n📈 AGGREGATION OPERATIONS')
console.log('-'.repeat(40))

// Count topics per module - file method
const moduleTopicCounts: Record<string, number> = {}
for (const tier of journeyTiers) {
  for (const module of tier.modules) {
    moduleTopicCounts[module.id] = module.topics.length
  }
}
console.log(`File count topics/module: ${journeyFileTokens.toLocaleString()} tokens`)

// Database method
const dbModuleCounts = db
  .select({ 
    moduleId: schema.topics.moduleId,
    count: schema.sql<number>`count(*)`
  })
  .from(schema.topics)
  .all()
const dbCountTokens = measureTokens(dbModuleCounts) + measureTokens('SELECT module_id, COUNT(*) FROM topics GROUP BY module_id')
console.log(`DB count topics/module: ${dbCountTokens} tokens`)

operations.push({
  operation: 'Count topics per module',
  fileTokens: journeyFileTokens,
  dbTokens: dbCountTokens,
  reduction: Math.round((1 - dbCountTokens/journeyFileTokens) * 100)
})

// Summary
console.log('\n' + '='.repeat(60))
console.log('📊 SUMMARY OF TOKEN USAGE')
console.log('='.repeat(60))

operations.forEach(op => {
  console.log(`\n${op.operation}:`)
  console.log(`  File method: ${op.fileTokens.toLocaleString()} tokens`)
  console.log(`  DB method: ${op.dbTokens.toLocaleString()} tokens`)
  console.log(`  Reduction: ${op.reduction}% ✅`)
  console.log(`  Efficiency: ${Math.round(op.fileTokens/op.dbTokens)}x faster`)
})

// Overall average
const avgReduction = Math.round(operations.reduce((sum, op) => sum + op.reduction, 0) / operations.length)
console.log('\n' + '='.repeat(60))
console.log(`🎯 AVERAGE TOKEN REDUCTION: ${avgReduction}%`)
console.log('='.repeat(60))

// Real-world impact
console.log('\n💡 REAL-WORLD IMPACT:')
console.log('-'.repeat(40))
console.log('With 100 operations per day:')
const dailyFileTokens = operations.reduce((sum, op) => sum + op.fileTokens, 0) * 20 // 20 of each op
const dailyDbTokens = operations.reduce((sum, op) => sum + op.dbTokens, 0) * 20
console.log(`  File-based: ${dailyFileTokens.toLocaleString()} tokens/day`)
console.log(`  Database: ${dailyDbTokens.toLocaleString()} tokens/day`)
console.log(`  Daily savings: ${(dailyFileTokens - dailyDbTokens).toLocaleString()} tokens`)
console.log(`  Monthly savings: ${((dailyFileTokens - dailyDbTokens) * 30).toLocaleString()} tokens`)

// Cost estimation (rough)
const costPer1kTokens = 0.03 // example rate
const monthlySavingsDollars = ((dailyFileTokens - dailyDbTokens) * 30 / 1000 * costPer1kTokens).toFixed(2)
console.log(`  Estimated monthly cost savings: $${monthlySavingsDollars}`)

process.exit(0)