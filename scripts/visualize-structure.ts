import Database from 'better-sqlite3'
import path from 'path'

// Create ASCII art visualization of tier/module/topic structure
function visualizeStructure() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    // Get all data
    const tiers = db.prepare(`
      SELECT * FROM tiers ORDER BY position
    `).all() as any[]
    
    const modules = db.prepare(`
      SELECT * FROM modules ORDER BY tier_id, position
    `).all() as any[]
    
    const topics = db.prepare(`
      SELECT * FROM topics ORDER BY module_id, position  
    `).all() as any[]
    
    console.log('\n🎯 AI SAFETY RESEARCH COMPILER - FULL STRUCTURE VISUALIZATION\n')
    console.log('━'.repeat(80))
    
    // Process each tier
    for (const tier of tiers) {
      const tierModules = modules.filter(m => m.tier_id === tier.id)
      const tierTopicCount = tierModules.reduce((total, module) => {
        return total + topics.filter(t => t.module_id === module.id).length
      }, 0)
      
      // Tier header with color coding
      const tierColors = {
        foundation: '\x1b[36m',    // Cyan
        intermediate: '\x1b[32m',  // Green  
        advanced: '\x1b[33m',      // Yellow
        expert: '\x1b[31m'         // Red
      }
      const color = tierColors[tier.level as string] || '\x1b[0m'
      const reset = '\x1b[0m'
      
      console.log(`\n${color}╔${'═'.repeat(78)}╗${reset}`)
      console.log(`${color}║ ${tier.title.toUpperCase().padEnd(76)} ║${reset}`)
      console.log(`${color}║ ${tier.description?.substring(0, 76).padEnd(76) || ''.padEnd(76)} ║${reset}`)
      console.log(`${color}║ Modules: ${tierModules.length} | Topics: ${tierTopicCount} | Duration: ${tier.estimated_duration || 'TBD'}${''.padEnd(76 - 40 - tierModules.length.toString().length - tierTopicCount.toString().length - (tier.estimated_duration?.length || 3))} ║${reset}`)
      console.log(`${color}╚${'═'.repeat(78)}╝${reset}`)
      
      // Process each module in tier
      for (let i = 0; i < tierModules.length; i++) {
        const module = tierModules[i]
        const moduleTopics = topics.filter(t => t.module_id === module.id)
        const isLast = i === tierModules.length - 1
        
        console.log(`  ${isLast ? '└' : '├'}─ 📦 ${module.title} (${moduleTopics.length} topics)`)
        
        // Show first 3 topics for each module
        const topicsToShow = moduleTopics.slice(0, 3)
        for (let j = 0; j < topicsToShow.length; j++) {
          const topic = topicsToShow[j]
          const topicPrefix = isLast ? '  ' : '│ '
          const isLastTopic = j === topicsToShow.length - 1 && moduleTopics.length <= 3
          
          console.log(`  ${topicPrefix}  ${isLastTopic && moduleTopics.length <= 3 ? '└' : '├'}─ ${topic.title}`)
        }
        
        if (moduleTopics.length > 3) {
          const topicPrefix = isLast ? '  ' : '│ '
          console.log(`  ${topicPrefix}  └─ ... and ${moduleTopics.length - 3} more topics`)
        }
      }
    }
    
    console.log('\n' + '━'.repeat(80))
    console.log('\n📊 SUMMARY STATISTICS:\n')
    
    // Summary table
    console.log('┌─────────────────┬──────────┬──────────┬─────────────┐')
    console.log('│ Tier            │ Modules  │ Topics   │ Avg/Module  │')
    console.log('├─────────────────┼──────────┼──────────┼─────────────┤')
    
    let totalModules = 0
    let totalTopics = 0
    
    for (const tier of tiers) {
      const tierModules = modules.filter(m => m.tier_id === tier.id)
      const tierTopicCount = tierModules.reduce((total, module) => {
        return total + topics.filter(t => t.module_id === module.id).length
      }, 0)
      
      totalModules += tierModules.length
      totalTopics += tierTopicCount
      
      const avg = tierModules.length > 0 ? (tierTopicCount / tierModules.length).toFixed(1) : '0.0'
      
      console.log(`│ ${tier.title.padEnd(15)} │ ${tierModules.length.toString().padStart(8)} │ ${tierTopicCount.toString().padStart(8)} │ ${avg.padStart(11)} │`)
    }
    
    console.log('├─────────────────┼──────────┼──────────┼─────────────┤')
    console.log(`│ ${'TOTAL'.padEnd(15)} │ ${totalModules.toString().padStart(8)} │ ${totalTopics.toString().padStart(8)} │ ${(totalTopics / totalModules).toFixed(1).padStart(11)} │`)
    console.log('└─────────────────┴──────────┴──────────┴─────────────┘')
    
    // Module distribution chart
    console.log('\n📈 MODULE DISTRIBUTION:\n')
    
    const maxModules = Math.max(...tiers.map(t => modules.filter(m => m.tier_id === t.id).length))
    
    for (const tier of tiers) {
      const tierModules = modules.filter(m => m.tier_id === tier.id)
      const barLength = Math.round((tierModules.length / maxModules) * 40)
      const bar = '█'.repeat(barLength) + '░'.repeat(40 - barLength)
      
      console.log(`${tier.title.padEnd(15)} │ ${bar} │ ${tierModules.length}`)
    }
    
    // Topics per module distribution
    console.log('\n📊 TOPICS PER MODULE (Top 10):\n')
    
    const moduleTopicCounts = modules.map(module => ({
      title: module.title,
      count: topics.filter(t => t.module_id === module.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 10)
    
    const maxTopics = Math.max(...moduleTopicCounts.map(m => m.count))
    
    for (const module of moduleTopicCounts) {
      const barLength = Math.round((module.count / maxTopics) * 30)
      const bar = '▓'.repeat(barLength) + '░'.repeat(30 - barLength)
      
      console.log(`${module.title.padEnd(35)} │ ${bar} │ ${module.count}`)
    }
    
    console.log('\n' + '━'.repeat(80))
    
  } catch (error) {
    console.error('❌ Visualization failed:', error)
  } finally {
    db.close()
  }
}

visualizeStructure()