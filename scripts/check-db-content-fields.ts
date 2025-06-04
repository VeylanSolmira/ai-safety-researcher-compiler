#!/usr/bin/env npx tsx

import { getDb, topics as topicsTable } from '../lib/db'

async function checkContentFields() {
  const db = getDb()
  const topics = await db
    .select()
    .from(topicsTable)
    .all()
  
  console.log('🔍 Checking database content fields...\n')
  
  const stats = {
    totalTopics: topics.length,
    withAcademicContent: 0,
    withPersonalContent: 0,
    withBothContent: 0,
    withNoContent: 0,
    withOnlyRoadmapId: 0
  }
  
  const noContentTopics: any[] = []
  
  for (const topic of topics) {
    const hasAcademic = topic.content_academic && topic.content_academic.length > 0
    const hasPersonal = topic.content_personal && topic.content_personal.length > 0
    
    if (hasAcademic) stats.withAcademicContent++
    if (hasPersonal) stats.withPersonalContent++
    if (hasAcademic && hasPersonal) stats.withBothContent++
    if (!hasAcademic && !hasPersonal) {
      stats.withNoContent++
      noContentTopics.push({
        id: topic.id,
        title: topic.title,
        roadmapContentId: topic.roadmap_content_id
      })
    }
    if (topic.roadmap_content_id) stats.withOnlyRoadmapId++
  }
  
  console.log('📊 Database Content Statistics:')
  console.log(`Total topics: ${stats.totalTopics}`)
  console.log(`With academic content: ${stats.withAcademicContent}`)
  console.log(`With personal content: ${stats.withPersonalContent}`)
  console.log(`With both content types: ${stats.withBothContent}`)
  console.log(`With no content: ${stats.withNoContent}`)
  console.log(`With roadmap_content_id: ${stats.withOnlyRoadmapId}`)
  
  if (noContentTopics.length > 0) {
    console.log('\n⚠️  Topics without content:')
    for (const topic of noContentTopics.slice(0, 10)) {
      console.log(`  - ${topic.id}: ${topic.title}${topic.roadmapContentId ? ` (roadmap: ${topic.roadmapContentId})` : ''}`)
    }
    if (noContentTopics.length > 10) {
      console.log(`  ... and ${noContentTopics.length - 10} more`)
    }
  }
}

checkContentFields().catch(console.error)