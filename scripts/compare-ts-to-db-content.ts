#!/usr/bin/env npx tsx

import { getDb, topics as topicsTable } from '../lib/db'
import { journeyTiers } from '../lib/journey'
import fs from 'fs'
import path from 'path'

async function compareContent() {
  console.log('🔍 Comparing TypeScript journey content with database...\n')
  
  const report = {
    totalTopicsInTS: 0,
    totalTopicsInDB: 0,
    matchingTopics: [] as any[],
    tsOnlyTopics: [] as any[],
    dbOnlyTopics: [] as any[],
    contentDifferences: [] as any[]
  }
  
  // Get all topics from database
  const db = getDb()
  const dbTopics = await db
    .select()
    .from(topicsTable)
    .all()
  
  const dbTopicMap = new Map(dbTopics.map(t => [t.id, t]))
  report.totalTopicsInDB = dbTopics.length
  
  // Extract all topics from TypeScript file
  const tsTopics: any[] = []
  for (const tier of journeyTiers) {
    for (const module of tier.modules) {
      for (const topic of module.topics) {
        tsTopics.push({
          id: topic.id,
          title: topic.title,
          content: topic.content || null,
          contentPersonal: topic.contentPersonal || null,
          tierId: tier.id,
          moduleId: module.id
        })
      }
    }
  }
  report.totalTopicsInTS = tsTopics.length
  
  // Compare topics
  for (const tsTopic of tsTopics) {
    const dbTopic = dbTopicMap.get(tsTopic.id)
    
    if (!dbTopic) {
      report.tsOnlyTopics.push({
        id: tsTopic.id,
        title: tsTopic.title,
        location: `${tsTopic.tierId} > ${tsTopic.moduleId}`,
        hasContent: !!tsTopic.content || !!tsTopic.contentPersonal
      })
    } else {
      // Topic exists in both - check content
      // Note: Need to handle null/undefined properly
      const tsAcademic = tsTopic.content || ''
      const dbAcademic = dbTopic.content_academic || ''
      const tsPersonal = tsTopic.contentPersonal || ''
      const dbPersonal = dbTopic.content_personal || ''
      
      const contentMatch = tsAcademic === dbAcademic
      const personalMatch = tsPersonal === dbPersonal
      
      if (!contentMatch || !personalMatch) {
        // Calculate content differences
        const tsContentLength = (tsTopic.content || '').length
        const dbContentLength = (dbTopic.content_academic || '').length
        const tsPersonalLength = (tsTopic.contentPersonal || '').length
        const dbPersonalLength = (dbTopic.content_personal || '').length
        
        report.contentDifferences.push({
          id: tsTopic.id,
          title: tsTopic.title,
          academicContent: {
            tsLength: tsContentLength,
            dbLength: dbContentLength,
            difference: dbContentLength - tsContentLength,
            tsHasContent: tsContentLength > 0,
            dbHasContent: dbContentLength > 0
          },
          personalContent: {
            tsLength: tsPersonalLength,
            dbLength: dbPersonalLength,
            difference: dbPersonalLength - tsPersonalLength,
            tsHasContent: tsPersonalLength > 0,
            dbHasContent: dbPersonalLength > 0
          }
        })
      }
      
      report.matchingTopics.push({
        id: tsTopic.id,
        title: tsTopic.title,
        contentMatch,
        personalMatch
      })
    }
  }
  
  // Find topics that are only in DB
  for (const dbTopic of dbTopics) {
    if (!tsTopics.find(t => t.id === dbTopic.id)) {
      report.dbOnlyTopics.push({
        id: dbTopic.id,
        title: dbTopic.title,
        hasAcademicContent: !!dbTopic.content_academic,
        hasPersonalContent: !!dbTopic.content_personal
      })
    }
  }
  
  // Generate report
  console.log('📊 Summary:')
  console.log(`Total topics in TypeScript: ${report.totalTopicsInTS}`)
  console.log(`Total topics in Database: ${report.totalTopicsInDB}`)
  console.log(`Topics in both: ${report.matchingTopics.length}`)
  console.log(`Topics only in TypeScript: ${report.tsOnlyTopics.length}`)
  console.log(`Topics only in Database: ${report.dbOnlyTopics.length}`)
  console.log(`Topics with content differences: ${report.contentDifferences.length}`)
  
  if (report.tsOnlyTopics.length > 0) {
    console.log('\n⚠️  Topics only in TypeScript (will be lost):')
    for (const topic of report.tsOnlyTopics) {
      console.log(`  - ${topic.id}: ${topic.title} (${topic.location})${topic.hasContent ? ' [HAS CONTENT]' : ''}`)
    }
  }
  
  if (report.contentDifferences.length > 0) {
    console.log('\n🔄 Topics with content differences:')
    for (const diff of report.contentDifferences) {
      console.log(`\n  ${diff.id}: ${diff.title}`)
      
      if (diff.academicContent.tsHasContent || diff.academicContent.dbHasContent) {
        console.log(`    Academic content:`)
        console.log(`      TS: ${diff.academicContent.tsLength} chars`)
        console.log(`      DB: ${diff.academicContent.dbLength} chars`)
        console.log(`      Diff: ${diff.academicContent.difference > 0 ? '+' : ''}${diff.academicContent.difference} chars`)
      }
      
      if (diff.personalContent.tsHasContent || diff.personalContent.dbHasContent) {
        console.log(`    Personal content:`)
        console.log(`      TS: ${diff.personalContent.tsLength} chars`)
        console.log(`      DB: ${diff.personalContent.dbLength} chars`)
        console.log(`      Diff: ${diff.personalContent.difference > 0 ? '+' : ''}${diff.personalContent.difference} chars`)
      }
    }
  }
  
  // Save detailed report
  const reportPath = path.join(process.cwd(), 'docs', 'ts-to-db-content-comparison.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n📄 Detailed report saved to: ${reportPath}`)
  
  // Summary recommendation
  console.log('\n✅ Recommendation:')
  if (report.tsOnlyTopics.length === 0 && report.contentDifferences.every(d => 
    d.academicContent.dbLength >= d.academicContent.tsLength && 
    d.personalContent.dbLength >= d.personalContent.tsLength
  )) {
    console.log('Safe to remove TypeScript content - database has all content and more.')
  } else {
    console.log('Review the differences above before removing TypeScript content.')
  }
}

compareContent().catch(console.error)