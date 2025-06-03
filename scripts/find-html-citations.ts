#!/usr/bin/env tsx

import { getDb } from '../lib/db'
import { topics } from '../lib/db/schema'
import { like, or } from 'drizzle-orm'

async function findHtmlCitationWarnings() {
  console.log('Searching for HTML citation warnings in the database...\n')
  
  const db = getDb()

  // Common HTML citation warning patterns
  const htmlPatterns = [
    '%<span%citation%warning%',
    '%<span%style%color%',
    '%<span%class%citation%',
    '%[citation%needed]%',
    '%[unverified]%',
    '%[flagged]%'
  ]

  // Search in both content_academic and content_personal fields
  const results = await db.select({
    id: topics.id,
    title: topics.title,
    moduleId: topics.moduleId,
    contentAcademic: topics.contentAcademic,
    contentPersonal: topics.contentPersonal
  })
  .from(topics)
  .where(
    or(
      // Check content_academic for any HTML patterns
      ...htmlPatterns.map(pattern => like(topics.contentAcademic, pattern)),
      // Check content_personal for any HTML patterns
      ...htmlPatterns.map(pattern => like(topics.contentPersonal, pattern))
    )
  )

  if (results.length === 0) {
    console.log('No HTML citation warnings found in the database.')
    return
  }

  console.log(`Found ${results.length} topics with HTML citation warnings:\n`)

  // Analyze each result
  for (const topic of results) {
    console.log(`\nTopic: ${topic.title} (${topic.id})`)
    console.log(`Module: ${topic.moduleId}`)
    
    // Check academic content
    if (topic.contentAcademic) {
      const academicMatches = findHtmlTags(topic.contentAcademic)
      if (academicMatches.length > 0) {
        console.log('\n  Academic content HTML citations:')
        academicMatches.forEach((match, i) => {
          console.log(`    ${i + 1}. ${match.substring(0, 100)}...`)
        })
      }
    }

    // Check personal content
    if (topic.contentPersonal) {
      const personalMatches = findHtmlTags(topic.contentPersonal)
      if (personalMatches.length > 0) {
        console.log('\n  Personal content HTML citations:')
        personalMatches.forEach((match, i) => {
          console.log(`    ${i + 1}. ${match.substring(0, 100)}...`)
        })
      }
    }
  }

  // Summary statistics
  console.log('\n\n=== SUMMARY ===')
  console.log(`Total topics with HTML citations: ${results.length}`)
  
  let academicCount = 0
  let personalCount = 0
  let totalHtmlTags = 0

  for (const topic of results) {
    if (topic.contentAcademic && findHtmlTags(topic.contentAcademic).length > 0) {
      academicCount++
      totalHtmlTags += findHtmlTags(topic.contentAcademic).length
    }
    if (topic.contentPersonal && findHtmlTags(topic.contentPersonal).length > 0) {
      personalCount++
      totalHtmlTags += findHtmlTags(topic.contentPersonal).length
    }
  }

  console.log(`Topics with HTML in academic content: ${academicCount}`)
  console.log(`Topics with HTML in personal content: ${personalCount}`)
  console.log(`Total HTML citation tags found: ${totalHtmlTags}`)

  // Export the list for further processing
  const exportData = results.map(topic => ({
    id: topic.id,
    title: topic.title,
    moduleId: topic.moduleId,
    hasHtmlInAcademic: topic.contentAcademic ? findHtmlTags(topic.contentAcademic).length > 0 : false,
    hasHtmlInPersonal: topic.contentPersonal ? findHtmlTags(topic.contentPersonal).length > 0 : false,
    academicHtmlCount: topic.contentAcademic ? findHtmlTags(topic.contentAcademic).length : 0,
    personalHtmlCount: topic.contentPersonal ? findHtmlTags(topic.contentPersonal).length : 0
  }))

  // Write results to JSON file
  const fs = await import('fs/promises')
  await fs.writeFile(
    'docs/html-citations-in-db.json',
    JSON.stringify(exportData, null, 2)
  )
  console.log('\nResults exported to docs/html-citations-in-db.json')
}

function findHtmlTags(content: string): string[] {
  const matches: string[] = []
  
  // Match various HTML span patterns with citation warnings
  const patterns = [
    /<span[^>]*citation[^>]*>.*?<\/span>/gi,
    /<span[^>]*style[^>]*color[^>]*>.*?\[.*?\].*?<\/span>/gi,
    /<span[^>]*>\s*\[citation.*?\]\s*<\/span>/gi,
    /<span[^>]*>\s*\[unverified\]\s*<\/span>/gi,
    /<span[^>]*>\s*\[flagged\]\s*<\/span>/gi
  ]

  for (const pattern of patterns) {
    const found = content.match(pattern)
    if (found) {
      matches.push(...found)
    }
  }

  return matches
}

// Run the script
findHtmlCitationWarnings().catch(console.error)