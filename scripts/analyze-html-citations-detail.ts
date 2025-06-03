#!/usr/bin/env tsx

import { getDb } from '../lib/db'
import { topics } from '../lib/db/schema'
import { inArray } from 'drizzle-orm'

interface CitationDetail {
  topicId: string
  title: string
  contentType: 'academic' | 'personal'
  htmlSnippet: string
  suggestedMarkdown: string
  context: string
}

async function analyzeHtmlCitationsDetail() {
  console.log('Analyzing HTML citations in detail...\n')
  
  const db = getDb()

  // Get the topics with HTML citations from our previous search
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

  const citationDetails: CitationDetail[] = []

  for (const topic of results) {
    // Analyze academic content
    if (topic.contentAcademic) {
      const academicCitations = extractHtmlCitations(topic.contentAcademic)
      for (const citation of academicCitations) {
        citationDetails.push({
          topicId: topic.id,
          title: topic.title,
          contentType: 'academic',
          htmlSnippet: citation.html,
          suggestedMarkdown: citation.markdown,
          context: citation.context
        })
      }
    }

    // Analyze personal content
    if (topic.contentPersonal) {
      const personalCitations = extractHtmlCitations(topic.contentPersonal)
      for (const citation of personalCitations) {
        citationDetails.push({
          topicId: topic.id,
          title: topic.title,
          contentType: 'personal',
          htmlSnippet: citation.html,
          suggestedMarkdown: citation.markdown,
          context: citation.context
        })
      }
    }
  }

  // Display results
  console.log(`Found ${citationDetails.length} HTML citations to convert:\n`)

  for (const detail of citationDetails) {
    console.log(`\n${'='.repeat(80)}`)
    console.log(`Topic: ${detail.title} (${detail.topicId})`)
    console.log(`Content Type: ${detail.contentType}`)
    console.log(`\nHTML Citation:`)
    console.log(`  ${detail.htmlSnippet}`)
    console.log(`\nSuggested Markdown:`)
    console.log(`  ${detail.suggestedMarkdown}`)
    console.log(`\nContext (50 chars before/after):`)
    console.log(`  ...${detail.context}...`)
  }

  // Summary by type
  const unverifiedCount = citationDetails.filter(d => 
    d.htmlSnippet.includes('UNVERIFIED') || d.htmlSnippet.includes('⚠️')
  ).length

  console.log(`\n\n${'='.repeat(80)}`)
  console.log('SUMMARY:')
  console.log(`- Total HTML citations: ${citationDetails.length}`)
  console.log(`- Unverified citations: ${unverifiedCount}`)
  console.log(`- Topics affected: ${topicIds.length}`)

  // Export detailed results
  const fs = await import('fs/promises')
  await fs.writeFile(
    'docs/html-citations-detailed-analysis.json',
    JSON.stringify(citationDetails, null, 2)
  )
  console.log('\nDetailed analysis exported to docs/html-citations-detailed-analysis.json')
}

function extractHtmlCitations(content: string) {
  const citations: Array<{html: string, markdown: string, context: string}> = []
  
  // Pattern to match HTML span tags with citation warnings
  const htmlPattern = /<span[^>]*>.*?(?:\[.*?\]|⚠️\s*UNVERIFIED:?).*?<\/span>/gi
  
  let match
  while ((match = htmlPattern.exec(content)) !== null) {
    const htmlSnippet = match[0]
    const startIndex = Math.max(0, match.index - 50)
    const endIndex = Math.min(content.length, match.index + match[0].length + 50)
    const context = content.substring(startIndex, endIndex).replace(/\n/g, ' ')

    // Convert HTML to Markdown
    let markdown = htmlSnippet
    
    // Extract the citation text
    const citationMatch = htmlSnippet.match(/>([^<]+)</)?.[1] || ''
    
    if (htmlSnippet.includes('⚠️ UNVERIFIED:')) {
      // Convert unverified citations to markdown format
      markdown = `⚠️ **[UNVERIFIED CITATION]**`
    } else if (htmlSnippet.includes('[citation needed]')) {
      markdown = `**[citation needed]**`
    } else if (htmlSnippet.includes('[flagged]')) {
      markdown = `**[flagged for review]**`
    } else {
      // Generic conversion for other patterns
      markdown = `**[${citationMatch.replace(/^\s*\[|\]\s*$/g, '')}]**`
    }

    citations.push({
      html: htmlSnippet,
      markdown: markdown,
      context: context
    })
  }

  return citations
}

// Run the analysis
analyzeHtmlCitationsDetail().catch(console.error)