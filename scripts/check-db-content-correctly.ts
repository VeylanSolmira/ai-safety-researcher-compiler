#!/usr/bin/env npx tsx

import { getDb, topics as topicsTable } from '../lib/db'

async function checkContent() {
  const db = getDb()
  
  // Get a few specific topics to check
  const topicsToCheck = ['why-ai-safety', 'risk-landscape', 'linear-algebra-ml']
  
  console.log('🔍 Checking specific topics in database...\n')
  
  for (const topicId of topicsToCheck) {
    const topic = await db
      .select()
      .from(topicsTable)
      .where(eq(topicsTable.id, topicId))
      .get()
    
    if (topic) {
      console.log(`\n📄 Topic: ${topic.id}`)
      console.log(`Title: ${topic.title}`)
      console.log(`Academic content length: ${topic.content_academic?.length || 0}`)
      console.log(`Personal content length: ${topic.content_personal?.length || 0}`)
      
      if (topic.content_academic) {
        console.log(`Academic content preview: ${topic.content_academic.substring(0, 100)}...`)
      }
      if (topic.content_personal) {
        console.log(`Personal content preview: ${topic.content_personal.substring(0, 100)}...`)
      }
    }
  }
  
  // Also get overall stats
  const allTopics = await db.select().from(topicsTable).all()
  const withContent = allTopics.filter(t => 
    (t.content_academic && t.content_academic.length > 0) || 
    (t.content_personal && t.content_personal.length > 0)
  )
  
  console.log(`\n📊 Overall: ${withContent.length} out of ${allTopics.length} topics have content`)
}

// Import eq from drizzle
import { eq } from 'drizzle-orm'

checkContent().catch(console.error)