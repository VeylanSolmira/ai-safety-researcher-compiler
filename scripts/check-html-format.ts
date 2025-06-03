#!/usr/bin/env tsx

import { getDb } from '../lib/db'
import { topics } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

async function checkHtmlFormat() {
  const db = getDb()
  const result = await db.select()
    .from(topics)
    .where(eq(topics.id, 'why-ai-safety'))
    .limit(1)

  const topic = result[0]
  if (topic && topic.contentAcademic) {
    // Find all HTML citations
    const htmlPattern = /<span[^>]*>.*?⚠️ UNVERIFIED.*?<\/span>/g
    const matches = topic.contentAcademic.match(htmlPattern)
    
    if (matches) {
      console.log(`Found ${matches.length} HTML citations in "Why AI Safety Matters":\n`)
      
      matches.forEach((match, index) => {
        console.log(`\nCitation ${index + 1}:`)
        console.log('HTML:', match)
        console.log('Length:', match.length, 'characters')
        
        // Find the line containing this citation
        const lines = topic.contentAcademic.split('\n')
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(match)) {
            console.log('Line number:', i + 1)
            console.log('Full line:', lines[i].substring(0, 200) + '...')
            break
          }
        }
      })
      
      // Show exact HTML format
      console.log('\n\nExact HTML format being used:')
      console.log('<span style="background-color: #ff0000; color: #ffffff; padding: 4px 8px; font-weight: bold;">⚠️ UNVERIFIED CITATION</span>')
      
      console.log('\n\nSuggested Markdown replacement:')
      console.log('⚠️ **[UNVERIFIED CITATION]**')
    }
  }
}

checkHtmlFormat().catch(console.error)