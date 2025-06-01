import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

// Export database to journey.ts format using direct SQL
async function exportDbToJourney() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    console.log('Exporting database content to journey.ts format...\n')
    
    // Get all tiers
    const tiers = db.prepare(`
      SELECT * FROM tiers ORDER BY position
    `).all() as any[]
    
    // Get all modules
    const modules = db.prepare(`
      SELECT * FROM modules ORDER BY tier_id, position
    `).all() as any[]
    
    // Get all topics
    const topics = db.prepare(`
      SELECT * FROM topics ORDER BY module_id, position
    `).all() as any[]
    
    // Build the journey structure
    const journeyTiers = tiers.map(tier => {
      const tierModules = modules.filter(m => m.tier_id === tier.id)
      
      return {
        id: tier.id,
        title: tier.title,
        level: tier.level,
        description: tier.description,
        estimatedDuration: tier.estimated_duration || '3 months',
        modules: tierModules.map(module => {
          const moduleTopics = topics.filter(t => t.module_id === module.id)
          
          return {
            id: module.id,
            title: module.title,
            description: module.description,
            estimatedTime: module.estimated_time || '2 weeks',
            learningObjectives: [
              `Master ${module.title.toLowerCase()} concepts`,
              'Apply knowledge to real-world scenarios',
              'Build practical implementations'
            ],
            topics: moduleTopics.map(topic => {
              const topicObj: any = {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                estimatedTime: topic.estimated_time || '4 hours',
                difficulty: topic.difficulty || 'intermediate'
              }
              
              if (topic.roadmap_content_id) {
                topicObj.roadmapContentId = topic.roadmap_content_id
              }
              
              if (topic.has_journey_extras) {
                topicObj.hasJourneyExtras = true
              }
              
              if (topic.has_interactive_transition) {
                topicObj.hasInteractiveTransition = true
              }
              
              return topicObj
            })
          }
        }),
        type: tier.type || 'linear',
        prerequisites: [],
        unlocks: [],
        skillsGained: [],
        careerRelevance: []
      }
    })
    
    // Generate TypeScript content
    const content = `// Auto-generated from database - DO NOT EDIT DIRECTLY
// Generated on: ${new Date().toISOString()}
// Run 'npm run db:export' to regenerate from database

import type { Tier } from './types'

export const journeyTiers: Tier[] = ${JSON.stringify(journeyTiers, null, 2)}
`
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'lib', 'journey-generated.ts')
    fs.writeFileSync(outputPath, content)
    
    console.log(`✅ Exported ${tiers.length} tiers with ${modules.length} modules and ${topics.length} topics`)
    console.log(`📁 Output written to: ${outputPath}`)
    console.log('\nTo update journey.ts, manually copy the content from journey-generated.ts')
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

exportDbToJourney()