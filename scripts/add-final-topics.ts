#!/usr/bin/env tsx

// Add the final remaining topics
import { getDb, topics } from '../lib/db'

async function addFinalTopics() {
  console.log('Adding final topics to reach 113...\n')
  
  const db = getDb()
  
  // Get modules
  const modules = await db.query.modules.findMany({
    with: { tier: true }
  })
  
  // Find appropriate modules for remaining topics
  const cuttingEdgeModule = modules.find(m => m.id === 'cutting-edge-research')
  const advancedRedTeaming = modules.find(m => m.id === 'advanced-red-teaming')
  
  console.log(`Cutting Edge module: ${cuttingEdgeModule?.title}`)
  console.log(`Advanced Red Teaming module: ${advancedRedTeaming?.title}`)
  
  const finalTopics = [
    // Security topics go to Advanced Red Teaming (it's about adversarial stuff)
    {
      id: 'ai-systems-security',
      title: 'AI Systems Security',
      description: 'Security considerations for deployed AI systems',
      moduleId: advancedRedTeaming?.id,
      estimatedHours: 3,
      difficulty: 'advanced' as const,
      roadmapContentId: 'computer-security-subtopic',
      tags: ['security', 'deployment', 'vulnerabilities', 'protection']
    },
    {
      id: 'disrupting-safety-research',
      title: 'Disrupting AI Safety Research',
      description: 'Understanding and preventing attacks on safety research',
      moduleId: advancedRedTeaming?.id,
      estimatedHours: 2,
      difficulty: 'advanced' as const,
      roadmapContentId: 'disrupting-research-subtopic',
      tags: ['security', 'research', 'attacks', 'defense']
    },
    // Add a couple more topics to reach 113
    {
      id: 'prompt-injection-defense',
      title: 'Prompt Injection & Defense',
      description: 'Understanding and defending against prompt injection attacks',
      moduleId: advancedRedTeaming?.id,
      estimatedHours: 2,
      difficulty: 'advanced' as const,
      roadmapContentId: 'prompt-injection-subtopic',
      tags: ['prompt-injection', 'security', 'llms', 'defense']
    },
    {
      id: 'jailbreak-techniques',
      title: 'Jailbreak Techniques & Prevention',
      description: 'Analyzing and preventing AI jailbreaks',
      moduleId: advancedRedTeaming?.id,
      estimatedHours: 2,
      difficulty: 'advanced' as const,
      roadmapContentId: 'jailbreak-subtopic',
      tags: ['jailbreak', 'security', 'robustness', 'prevention']
    }
  ]
  
  for (const topic of finalTopics) {
    if (!topic.moduleId) {
      console.log(`⚠️  Skipping ${topic.title} - module not found`)
      continue
    }
    
    try {
      await db.insert(topics).values(topic)
      console.log(`✅ Added topic: ${topic.title}`)
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        console.log(`⏭️  Topic already exists: ${topic.title}`)
      } else {
        console.error(`❌ Failed to add ${topic.title}:`, error.message)
      }
    }
  }
  
  // Final count
  const allTopics = await db.query.topics.findMany()
  const allModules = await db.query.modules.findMany()
  
  console.log(`\n✅ Final counts:`)
  console.log(`- Total topics: ${allTopics.length} (target: 113)`)
  console.log(`- Total modules: ${allModules.length} (target: 24)`)
  
  // Show distribution
  const tierCounts = await db.query.tiers.findMany({
    with: {
      modules: {
        with: {
          topics: true
        }
      }
    }
  })
  
  console.log('\n📊 Distribution by tier:')
  tierCounts.forEach(tier => {
    const topicCount = tier.modules.reduce((sum, m) => sum + m.topics.length, 0)
    console.log(`- ${tier.title}: ${tier.modules.length} modules, ${topicCount} topics`)
  })
}

// Run the script
addFinalTopics()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })