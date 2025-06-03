#!/usr/bin/env tsx

import { getDb } from '../lib/db'
import { topics } from '../lib/db/schema'
import { inArray } from 'drizzle-orm'
import * as fs from 'fs/promises'

async function backupTopicsWithHtml() {
  console.log('Creating backup of topics with HTML citations...\n')
  
  const db = getDb()

  // Get the topics with HTML citations
  const topicIds = [
    'prerequisites-foundations',
    'why-ai-safety',
    'risk-landscape',
    'intro-red-teaming',
    'prompt-injection-attacks',
    'jailbreak-techniques',
    'safety-evaluation-101',
    'how-llms-work',
    'safety-monitoring',
    'problem-decomposition',
    'containerization-research',
    'paradigm-driven-research'
  ]

  const results = await db.select()
    .from(topics)
    .where(inArray(topics.id, topicIds))

  // Create backup object
  const backup = {
    timestamp: new Date().toISOString(),
    description: 'Backup of topics with HTML citation warnings before conversion to Markdown',
    topics: results.map(topic => ({
      id: topic.id,
      title: topic.title,
      moduleId: topic.moduleId,
      contentAcademic: topic.contentAcademic,
      contentPersonal: topic.contentPersonal
    }))
  }

  // Save backup to file
  const backupPath = `backups/topics-html-citations-backup-${Date.now()}.json`
  await fs.mkdir('backups', { recursive: true })
  await fs.writeFile(backupPath, JSON.stringify(backup, null, 2))

  console.log(`✓ Backup saved to: ${backupPath}`)
  console.log(`  - Topics backed up: ${results.length}`)
  console.log(`  - Timestamp: ${backup.timestamp}`)
}

// Run the backup
backupTopicsWithHtml().catch(console.error)