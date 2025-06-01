#!/usr/bin/env tsx

// Script to export database content back to journey.ts format
import { getDb } from '../lib/db'
import fs from 'fs/promises'
import path from 'path'

async function exportDbToJourney() {
  console.log('Exporting database content to journey.ts format...\n')
  
  const db = getDb()
  
  // Get all data with relationships
  const tiers = await db.query.tiers.findMany({
    with: {
      modules: {
        with: {
          topics: {
            with: {
              prerequisites: true,
              experiments: true,
              caseStudies: true,
              explorations: true
            }
          }
        }
      }
    },
    orderBy: (tiers, { asc }) => [asc(tiers.id)]
  })
  
  // Format topics
  const formatTopic = (topic: any) => {
    const parts = [`
          {
            id: '${topic.id}',
            title: '${topic.title.replace(/'/g, "\\'")}',
            description: '${topic.description.replace(/'/g, "\\'")}',
            estimatedTime: '${topic.estimatedHours} hours',
            difficulty: '${topic.difficulty}' as const,`]
    
    if (topic.roadmapContentId) {
      parts.push(`
            roadmapContentId: '${topic.roadmapContentId}',`)
    }
    
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      parts.push(`
            prerequisites: [${topic.prerequisites.map((p: any) => `'${p.prerequisiteId}'`).join(', ')}],`)
    }
    
    if (topic.content) {
      parts.push(`
            content: \`${topic.content.replace(/`/g, '\\`')}\`,`)
    }
    
    if (topic.experiments && topic.experiments.length > 0) {
      parts.push(`
            relatedExperiments: [${topic.experiments.map((e: any) => `'${e.experimentId}'`).join(', ')}],`)
    }
    
    if (topic.caseStudies && topic.caseStudies.length > 0) {
      parts.push(`
            relatedCaseStudies: [${topic.caseStudies.map((c: any) => `'${c.caseStudyId}'`).join(', ')}],`)
    }
    
    if (topic.explorations && topic.explorations.length > 0) {
      parts.push(`
            relatedExplorations: [${topic.explorations.map((e: any) => `'${e.explorationId}'`).join(', ')}],`)
    }
    
    if (topic.tags && topic.tags.length > 0) {
      parts.push(`
            tags: [${topic.tags.map((t: string) => `'${t}'`).join(', ')}]`)
    }
    
    parts.push(`
          }`)
    
    return parts.join('')
  }
  
  // Format modules
  const formatModule = (module: any) => {
    return `
      {
        id: '${module.id}',
        title: '${module.title.replace(/'/g, "\\'")}',
        description: '${module.description.replace(/'/g, "\\'")}',
        estimatedTime: '${module.estimatedWeeks} weeks',
        learningObjectives: [
${module.learningObjectives.map((obj: string) => `          '${obj.replace(/'/g, "\\'")}'`).join(',\n')}
        ],
        topics: [${module.topics.map(formatTopic).join(',')}
        ]
      }`
  }
  
  // Format tiers
  const formatTier = (tier: any) => {
    return `
  {
    id: '${tier.id}',
    title: '${tier.title.replace(/'/g, "\\'")}',
    level: '${tier.level}' as const,
    description: '${tier.description.replace(/'/g, "\\'")}',
    estimatedDuration: '${tier.estimatedMonths} months',
    modules: [${tier.modules.map(formatModule).join(',')}
    ],
    type: 'linear' as const,
    prerequisites: [${tier.prerequisites.map((p: string) => `'${p}'`).join(', ')}],
    unlocks: [],
    skillsGained: [],
    careerRelevance: []
  }`
  }
  
  // Generate the TypeScript content
  const journeyContent = `// Auto-generated from database - DO NOT EDIT DIRECTLY
// Generated on: ${new Date().toISOString()}
// Run 'npm run db:export' to regenerate from database

import type { Tier } from './journey'

export const journeyTiers: Tier[] = [${tiers.map(formatTier).join(',')}
]
`
  
  // Write to a separate file first to avoid circular imports
  const outputPath = path.join(process.cwd(), 'lib', 'journey-generated.ts')
  await fs.writeFile(outputPath, journeyContent)
  
  console.log(`✅ Exported ${tiers.length} tiers with ${tiers.reduce((sum, t) => sum + t.modules.length, 0)} modules and ${tiers.reduce((sum, t) => sum + t.modules.reduce((mSum, m) => mSum + m.topics.length, 0), 0)} topics`)
  console.log(`📁 Output written to: ${outputPath}`)
  console.log('\nTo update journey.ts, manually copy the content from journey-generated.ts')
}

// Run the export
exportDbToJourney()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })