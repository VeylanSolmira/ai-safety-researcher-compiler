#!/usr/bin/env tsx

import { getDb } from '../lib/db'
import { topics } from '../lib/db/schema'
import { inArray, eq } from 'drizzle-orm'

async function convertHtmlCitationsToMarkdown() {
  console.log('Converting HTML citations to Markdown format...\n')
  
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

  let totalUpdated = 0
  let totalReplacements = 0

  for (const topic of results) {
    let academicUpdated = false
    let personalUpdated = false
    let academicReplacements = 0
    let personalReplacements = 0

    // Convert academic content
    if (topic.contentAcademic) {
      const { content, replacements } = convertHtmlToMarkdown(topic.contentAcademic)
      if (replacements > 0) {
        await db.update(topics)
          .set({ contentAcademic: content })
          .where(eq(topics.id, topic.id))
        academicUpdated = true
        academicReplacements = replacements
      }
    }

    // Convert personal content
    if (topic.contentPersonal) {
      const { content, replacements } = convertHtmlToMarkdown(topic.contentPersonal)
      if (replacements > 0) {
        await db.update(topics)
          .set({ contentPersonal: content })
          .where(eq(topics.id, topic.id))
        personalUpdated = true
        personalReplacements = replacements
      }
    }

    if (academicUpdated || personalUpdated) {
      totalUpdated++
      totalReplacements += academicReplacements + personalReplacements
      console.log(`✓ Updated: ${topic.title} (${topic.id})`)
      if (academicUpdated) {
        console.log(`  - Academic content: ${academicReplacements} replacements`)
      }
      if (personalUpdated) {
        console.log(`  - Personal content: ${personalReplacements} replacements`)
      }
    }
  }

  console.log(`\n=== CONVERSION COMPLETE ===`)
  console.log(`Topics updated: ${totalUpdated}`)
  console.log(`Total replacements: ${totalReplacements}`)
}

function convertHtmlToMarkdown(content: string): { content: string, replacements: number } {
  let replacements = 0
  let updatedContent = content

  // Pattern 1: Replace the specific unverified citation HTML
  const unverifiedPattern = /<span style="background-color: #ff0000; color: #ffffff; padding: 4px 8px; font-weight: bold;">⚠️ UNVERIFIED CITATION<\/span>/g
  updatedContent = updatedContent.replace(unverifiedPattern, () => {
    replacements++
    return '⚠️ **[UNVERIFIED CITATION]**'
  })

  // Pattern 2: Replace any other HTML span with citation-related content
  const genericCitationPattern = /<span[^>]*>\s*\[(citation needed|unverified|flagged)\]\s*<\/span>/gi
  updatedContent = updatedContent.replace(genericCitationPattern, (match, citationType) => {
    replacements++
    return `**[${citationType}]**`
  })

  // Pattern 3: Replace any remaining HTML spans that contain warning symbols
  const warningPattern = /<span[^>]*>⚠️[^<]*<\/span>/g
  updatedContent = updatedContent.replace(warningPattern, (match) => {
    // Extract the content between the tags
    const contentMatch = match.match(/>([^<]+)</)?.[1] || ''
    if (!match.includes('UNVERIFIED CITATION')) { // Don't double-process
      replacements++
      return `⚠️ **${contentMatch.replace('⚠️', '').trim()}**`
    }
    return match
  })

  // Pattern 4: Replace error message spans (the red italic ones)
  const errorMessagePattern = /<span style="color: #ff0000; font-style: italic;">\*([^<]+)\*<\/span>/g
  updatedContent = updatedContent.replace(errorMessagePattern, (match, errorText) => {
    replacements++
    return `*${errorText}*`
  })

  // Pattern 5: Clean up any remaining citation-related HTML spans
  const remainingSpanPattern = /<span[^>]*>(\[[^\]]+\])<\/span>/g
  updatedContent = updatedContent.replace(remainingSpanPattern, (match, bracketContent) => {
    replacements++
    return `**${bracketContent}**`
  })

  return { content: updatedContent, replacements }
}

// Run the conversion
convertHtmlCitationsToMarkdown().catch(console.error)