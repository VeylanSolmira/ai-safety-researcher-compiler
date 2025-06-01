#!/usr/bin/env tsx

// Script to add Phase 1 topics from the unified structure plan
import { getDb, topics } from '../lib/db'

async function addPhase1Topics() {
  console.log('Adding Phase 1 topics to database...\n')
  
  const db = getDb()

  // Find the module IDs we need
  const modules = await db.query.modules.findMany({
    with: { tier: true }
  })

  // Helper to find module by title and tier
  const findModule = (tierLevel: string, moduleTitle: string) => {
    return modules.find(m => 
      m.tier.level === tierLevel && 
      m.title.toLowerCase().includes(moduleTitle.toLowerCase())
    )
  }

  // Foundation Tier - Safety Fundamentals Module
  const safetyFundamentalsModule = findModule('foundation', 'risk') || 
                                   findModule('foundation', 'safety')

  if (!safetyFundamentalsModule) {
    console.error('Could not find Safety Fundamentals module')
    return
  }

  console.log(`Found Safety Fundamentals module: ${safetyFundamentalsModule.title}`)

  // Topics to add to Safety Fundamentals
  const safetyTopics = [
    {
      id: 'control-problem',
      title: 'The Control Problem',
      description: 'Understanding how to maintain control over advanced AI systems',
      moduleId: safetyFundamentalsModule.id,
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      prerequisites: [],
      learningObjectives: [
        'Understand the fundamental control problem in AI',
        'Explore different approaches to maintaining control',
        'Analyze failure modes when control is lost'
      ],
      roadmapContentId: 'control-subtopic',
      tags: ['control', 'alignment', 'safety', 'risk']
    },
    {
      id: 'agency-in-ai',
      title: 'AI Agency and Autonomy',
      description: 'Exploring goal-directed behavior and autonomous decision-making in AI systems',
      moduleId: safetyFundamentalsModule.id,
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      prerequisites: [],
      learningObjectives: [
        'Define agency in the context of AI systems',
        'Understand degrees of autonomy',
        'Analyze implications of agentic AI'
      ],
      roadmapContentId: 'agency-subtopic',
      tags: ['agency', 'autonomy', 'goals', 'behavior']
    },
    {
      id: 'situational-awareness',
      title: 'AI Situational Awareness',
      description: 'When AI systems understand their environment, context, and impact',
      moduleId: safetyFundamentalsModule.id,
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      prerequisites: [],
      learningObjectives: [
        'Recognize situational awareness in AI systems',
        'Understand risks of self-aware AI',
        'Explore detection and monitoring approaches'
      ],
      roadmapContentId: 'situational-awareness-subtopic',
      tags: ['awareness', 'self-model', 'understanding', 'risk']
    },
    {
      id: 'impenetrability',
      title: 'The Impenetrability Problem',
      description: 'Challenges in understanding and inspecting advanced AI systems',
      moduleId: safetyFundamentalsModule.id,
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      prerequisites: [],
      learningObjectives: [
        'Understand why advanced AI can be impenetrable',
        'Explore the limits of interpretability',
        'Consider approaches to maintaining transparency'
      ],
      roadmapContentId: 'impenetrability-subtopic',
      tags: ['interpretability', 'transparency', 'black-box', 'understanding']
    }
  ]

  // Foundation Tier - Core Foundations Module
  const coreFoundationsModule = findModule('foundation', 'core') || 
                                findModule('foundation', 'foundations')

  if (!coreFoundationsModule) {
    console.error('Could not find Core Foundations module')
    return
  }

  console.log(`Found Core Foundations module: ${coreFoundationsModule.title}`)

  // Topics to add to Core Foundations
  const foundationTopics = [
    {
      id: 'types-of-ai-systems',
      title: 'Types of AI Systems Overview',
      description: 'Survey of different AI architectures and their safety implications',
      moduleId: coreFoundationsModule.id,
      estimatedHours: 3,
      difficulty: 'beginner' as const,
      prerequisites: [],
      learningObjectives: [
        'Categorize different types of AI systems',
        'Understand safety implications of each type',
        'Recognize current and future AI architectures'
      ],
      roadmapContentId: 'types-ai-systems-subtopic',
      tags: ['ai-types', 'architectures', 'overview', 'fundamentals']
    },
    {
      id: 'understanding-llms',
      title: 'Understanding Large Language Models',
      description: 'Deep dive into how LLMs work and their unique safety considerations',
      moduleId: coreFoundationsModule.id,
      estimatedHours: 4,
      difficulty: 'beginner' as const,
      prerequisites: [],
      learningObjectives: [
        'Understand LLM architecture and training',
        'Recognize LLM capabilities and limitations',
        'Identify LLM-specific safety challenges'
      ],
      roadmapContentId: 'llms-subtopic',
      tags: ['llms', 'language-models', 'transformers', 'fundamentals']
    },
    {
      id: 'how-llms-trained',
      title: 'How LLMs are Trained',
      description: 'The training process, data requirements, and safety implications',
      moduleId: coreFoundationsModule.id,
      estimatedHours: 3,
      difficulty: 'beginner' as const,
      prerequisites: ['understanding-llms'],
      learningObjectives: [
        'Understand pretraining and fine-tuning',
        'Recognize data quality and bias issues',
        'Identify training-time safety interventions'
      ],
      roadmapContentId: 'how-llms-trained-subtopic',
      tags: ['training', 'llms', 'data', 'process']
    }
  ]

  // Insert all topics
  const allTopics = [...safetyTopics, ...foundationTopics]
  
  for (const topic of allTopics) {
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

  console.log('\nPhase 1 topics addition complete!')
  
  // Show summary
  const topicCount = await db.query.topics.findMany()
  console.log(`\nTotal topics in database: ${topicCount.length}`)
}

// Run the script
addPhase1Topics()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })