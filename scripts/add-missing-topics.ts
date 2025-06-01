#!/usr/bin/env tsx

// Add the remaining topics that were skipped
import { getDb, topics } from '../lib/db'

async function addMissingTopics() {
  console.log('Adding missing topics...\n')
  
  const db = getDb()
  
  // Find the correct module IDs
  const modules = await db.query.modules.findMany({
    with: { tier: true }
  })
  
  // Find ML Engineering module (it's called "Production Safety Engineering")
  const mlEngineeringModule = modules.find(m => 
    m.id === 'safety-engineering' || 
    m.title.includes('Safety Engineering')
  )
  
  // Find Security module in expert tier
  const securityModule = modules.find(m => 
    m.tier.level === 'expert' && 
    (m.title.includes('Security') || m.title.includes('Adversarial'))
  )
  
  console.log(`ML Engineering module: ${mlEngineeringModule?.title}`)
  console.log(`Security module: ${securityModule?.title}`)
  
  const missingTopics = [
    // ML Engineering topics
    {
      id: 'containerization-research',
      title: 'Containerization for Research',
      description: 'Docker and container orchestration for reproducible AI research',
      moduleId: mlEngineeringModule?.id,
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'docker-subtopic',
      tags: ['docker', 'containers', 'reproducibility', 'infrastructure']
    },
    {
      id: 'advanced-git-research',
      title: 'Advanced Git for Research',
      description: 'Version control best practices for collaborative AI safety research',
      moduleId: mlEngineeringModule?.id,
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'version-control-subtopic',
      tags: ['git', 'version-control', 'collaboration', 'reproducibility']
    },
    {
      id: 'distributed-training',
      title: 'Distributed Training Systems',
      description: 'Scaling AI training across multiple machines safely',
      moduleId: mlEngineeringModule?.id,
      estimatedHours: 4,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'distributed-systems-subtopic',
      tags: ['distributed', 'scaling', 'infrastructure', 'training']
    },
    // Expert tier security topics
    {
      id: 'ai-systems-security',
      title: 'AI Systems Security',
      description: 'Security considerations for deployed AI systems',
      moduleId: securityModule?.id,
      estimatedHours: 3,
      difficulty: 'expert' as const,
      roadmapContentId: 'computer-security-subtopic',
      tags: ['security', 'deployment', 'vulnerabilities', 'protection']
    },
    {
      id: 'disrupting-safety-research',
      title: 'Disrupting AI Safety Research',
      description: 'Understanding and preventing attacks on safety research',
      moduleId: securityModule?.id,
      estimatedHours: 2,
      difficulty: 'expert' as const,
      roadmapContentId: 'disrupting-research-subtopic',
      tags: ['security', 'research', 'attacks', 'defense']
    }
  ]
  
  // Also add some remaining roadmap topics we haven't covered
  const additionalRoadmapTopics = [
    {
      id: 'resource-allocation',
      title: 'Resource Allocation in AI Safety',
      description: 'Strategic allocation of resources for maximum safety impact',
      moduleId: modules.find(m => m.title.includes('Policy') && m.tier.level === 'advanced')?.id,
      estimatedHours: 2,
      difficulty: 'advanced' as const,
      roadmapContentId: 'resource-allocation-subtopic',
      tags: ['resources', 'strategy', 'allocation', 'impact']
    },
    {
      id: 'resource-tracking',
      title: 'Resource Tracking & Management',
      description: 'Tracking and managing AI safety research resources',
      moduleId: modules.find(m => m.title.includes('Policy') && m.tier.level === 'advanced')?.id,
      estimatedHours: 2,
      difficulty: 'advanced' as const,
      roadmapContentId: 'resource-tracking-subtopic',
      tags: ['tracking', 'management', 'resources', 'efficiency']
    },
    {
      id: 'deployment-gates',
      title: 'Deployment Gates & Safety Checks',
      description: 'Implementing safety gates before AI deployment',
      moduleId: mlEngineeringModule?.id,
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'deployment-gates-subtopic',
      tags: ['deployment', 'safety-checks', 'gates', 'production']
    },
    {
      id: 'training-run-monitoring',
      title: 'Training Run Monitoring',
      description: 'Monitoring AI training for safety and alignment',
      moduleId: mlEngineeringModule?.id,
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'training-run-monitoring-subtopic',
      tags: ['monitoring', 'training', 'safety', 'observability']
    }
  ]
  
  const allTopics = [...missingTopics, ...additionalRoadmapTopics]
  
  for (const topic of allTopics) {
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
  const finalTopics = await db.query.topics.findMany()
  console.log(`\n✅ Total topics: ${finalTopics.length} (target: 113)`)
}

// Run the script
addMissingTopics()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })