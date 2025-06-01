import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

// Export database to CURRICULUM.md format
async function exportToCurriculumMD() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    // Get all data ordered properly
    const tiers = db.prepare(`
      SELECT * FROM tiers ORDER BY position
    `).all() as any[]
    
    const modules = db.prepare(`
      SELECT * FROM modules ORDER BY tier_id, position
    `).all() as any[]
    
    const topics = db.prepare(`
      SELECT * FROM topics ORDER BY module_id, position
    `).all() as any[]
    
    // Start building the markdown content
    let content = `# AI Safety Research Curriculum

## Overview
A comprehensive curriculum for AI safety research, progressing from foundational concepts to expert-level research leadership.

### Structure
- **${tiers.length} Tiers**: ${tiers.map(t => t.title).join(' → ')}
- **${modules.length} Modules**: Distributed across all learning levels
- **${topics.length} Topics**: Comprehensive coverage of AI safety

---

`

    // Process each tier
    for (const tier of tiers) {
      const tierModules = modules.filter(m => m.tier_id === tier.id)
      const tierTopicCount = tierModules.reduce((total, module) => {
        return total + topics.filter(t => t.module_id === module.id).length
      }, 0)
      
      // Tier header
      content += `## ${tier.title.toUpperCase()} TIER\n\n`
      content += `*${tier.description}*\n\n`
      content += `- **Duration**: ${tier.estimated_duration || 'Self-paced'}\n`
      content += `- **Modules**: ${tierModules.length}\n`
      content += `- **Topics**: ${tierTopicCount}\n`
      content += `- **Type**: ${tier.type === 'linear' ? 'Linear progression' : 'Open exploration'}\n\n`
      
      // Process modules in this tier
      tierModules.forEach((module, moduleIndex) => {
        const moduleTopics = topics.filter(t => t.module_id === module.id)
        
        content += `### ${moduleIndex + 1}. ${module.title}\n\n`
        content += `*${module.description}*\n\n`
        
        if (module.estimated_time) {
          content += `**Duration**: ${module.estimated_time}\n\n`
        }
        
        // List topics
        content += `**Topics**:\n`
        moduleTopics.forEach((topic, topicIndex) => {
          content += `${topicIndex + 1}. **${topic.title}**`
          
          if (topic.difficulty) {
            const difficultyEmoji = {
              beginner: '🟢',
              intermediate: '🟡',
              advanced: '🔴'
            }
            content += ` ${difficultyEmoji[topic.difficulty] || ''}`
          }
          
          content += `\n`
          content += `   - ${topic.description}\n`
          
          if (topic.estimated_time) {
            content += `   - *Duration: ${topic.estimated_time}*\n`
          }
          
          // Add special markers
          const markers = []
          if (topic.has_journey_extras) markers.push('📚 Journey Content')
          if (topic.has_interactive_transition) markers.push('🎮 Interactive')
          if (topic.roadmap_content_id) markers.push('🗺️ Roadmap')
          if (topic.assessment_id) markers.push('📝 Assessment')
          
          if (markers.length > 0) {
            content += `   - ${markers.join(' | ')}\n`
          }
          
          content += '\n'
        })
        
        if (module.assessment_type) {
          content += `**Assessment**: ${module.assessment_type.charAt(0).toUpperCase() + module.assessment_type.slice(1).replace('-', ' ')}\n\n`
        }
        
        content += '---\n\n'
      })
    }
    
    // Add summary statistics
    content += `## Summary Statistics

### Topics by Tier
`
    
    for (const tier of tiers) {
      const tierModules = modules.filter(m => m.tier_id === tier.id)
      const tierTopicCount = tierModules.reduce((total, module) => {
        return total + topics.filter(t => t.module_id === module.id).length
      }, 0)
      
      content += `- **${tier.title}**: ${tierTopicCount} topics across ${tierModules.length} modules\n`
    }
    
    // Add module breakdown
    content += `\n### Largest Modules\n`
    
    const moduleTopicCounts = modules.map(module => ({
      title: module.title,
      tier: tiers.find(t => t.id === module.tier_id)?.title || 'Unknown',
      count: topics.filter(t => t.module_id === module.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 10)
    
    moduleTopicCounts.forEach((module, index) => {
      content += `${index + 1}. **${module.title}** (${module.tier}): ${module.count} topics\n`
    })
    
    // Add special focus areas
    content += `\n### Special Focus Areas\n\n`
    
    // Find AI Agents module
    const agentsModule = modules.find(m => m.id === 'ai-agents-tool-use')
    if (agentsModule) {
      const agentTopics = topics.filter(t => t.module_id === agentsModule.id)
      content += `#### 🤖 AI Agents & Tool Use (2025 Priority)\n`
      content += `A dedicated module focusing on the safety challenges of autonomous AI agents:\n\n`
      agentTopics.forEach(topic => {
        content += `- **${topic.title}**: ${topic.description}\n`
      })
      content += '\n'
    }
    
    // Add learning paths
    content += `### Recommended Learning Paths

1. **Technical Track**: Foundation ML → Production Safety → Advanced Systems
2. **Research Track**: Research Methods → Alignment Research → Research Leadership  
3. **Policy Track**: Ethics Primer → Governance Fundamentals → Advanced Governance
4. **AI Agents Track**: Essential ML → AI Agents & Tool Use → Multi-Agent Systems

---

*Generated on ${new Date().toLocaleDateString()} | ${topics.length} topics | ${modules.length} modules | ${tiers.length} tiers*
`
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'CURRICULUM.md')
    fs.writeFileSync(outputPath, content)
    
    console.log('✅ Exported curriculum to:', outputPath)
    console.log(`📊 Stats: ${tiers.length} tiers, ${modules.length} modules, ${topics.length} topics`)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

exportToCurriculumMD()