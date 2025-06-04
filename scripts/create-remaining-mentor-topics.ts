import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

interface NewTopic {
  id: string
  moduleId: string
  title: string
  description: string
  mentorMappings: Array<{
    mentorId: string
    description: string
  }>
}

function createRemainingTopics() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Start transaction
    db.prepare('BEGIN').run()
    
    // First, let's find the appropriate module IDs
    const modules = db.prepare('SELECT id, title FROM modules').all() as Array<{id: string, title: string}>
    console.log('Available modules:', modules.map(m => `${m.id}: ${m.title}`).join('\n'))
    
    // Define all remaining topics with their target modules
    const remainingTopics: NewTopic[] = [
      // Category 3 (Governance) - Not in new module
      {
        id: 'ai-economic-impacts',
        moduleId: 'advanced-governance', // Advanced AI Governance & Policy
        title: 'AI Economic Impact Analysis',
        description: 'Methods for measuring and predicting the economic effects of AI deployment',
        mentorMappings: [{
          mentorId: 'mauricio-baker',
          description: 'Improving government visibility into AI economic impacts'
        }]
      },
      {
        id: 'ai-education-safety',
        moduleId: 'practical-safety-basics', // Practical AI Safety Basics
        title: 'AI in Education Safety',
        description: 'Safety considerations for AI deployment in educational settings',
        mentorMappings: [{
          mentorId: 'jonathan-zittrain',
          description: 'AI in education'
        }]
      },
      {
        id: 'ai-privacy-frameworks',
        moduleId: 'governance-intro', // AI Safety Policy & Ethics Primer
        title: 'AI Privacy and Data Protection',
        description: 'Privacy frameworks and data protection strategies for AI systems',
        mentorMappings: [{
          mentorId: 'jonathan-zittrain',
          description: 'Privacy frameworks'
        }]
      },
      {
        id: 'control-scaling-laws',
        moduleId: 'alignment-research', // Alignment Research Methods
        title: 'Scaling Laws for AI Control',
        description: 'Understanding how control methods scale with model capabilities',
        mentorMappings: [{
          mentorId: 'asa-cooper-stickland',
          description: 'Scaling laws for control'
        }]
      },
      
      // Category 1 - Not in new module
      {
        id: 'algorithmic-progress-forecasting',
        moduleId: 'research-methods', // Research Methods (intermediate)
        title: 'Algorithmic Progress Forecasting',
        description: 'Predicting future AI capabilities through analysis of algorithmic improvements',
        mentorMappings: [{
          mentorId: 'jason-lynch',
          description: 'Progress in Algorithms Project - historic algorithmic progress rates'
        }]
      },
      {
        id: 'control-rollback-mechanisms',
        moduleId: 'alignment-research', // Alignment Research Methods
        title: 'Control and Rollback Mechanisms',
        description: 'Implementing reversibility and checkpoint systems for AI actions',
        mentorMappings: [{
          mentorId: 'cody-rushing',
          description: 'Extending Ctrl-Z paper work'
        }]
      },
      {
        id: 'consumer-hardware-ai',
        moduleId: 'practical-safety-basics', // Practical AI Safety Basics
        title: 'AI on Consumer Hardware',
        description: 'Safety considerations for AI deployment on consumer devices',
        mentorMappings: [{
          mentorId: 'aaron-scher',
          description: 'Survey of LLMs on consumer hardware approaches'
        }]
      },
      {
        id: 'research-avoidance-patterns',
        moduleId: 'research-methods', // Research Methods
        title: 'Research Avoidance and Info Hazards',
        description: 'Understanding when and how to avoid dangerous research directions',
        mentorMappings: [{
          mentorId: 'aaron-scher',
          description: 'Historical case studies of research avoidance'
        }]
      },
      {
        id: 'international-ai-capabilities',
        moduleId: 'advanced-governance', // Advanced AI Governance & Policy
        title: 'International AI Capability Assessment',
        description: 'Monitoring and assessing AI development across different countries',
        mentorMappings: [{
          mentorId: 'aaron-scher',
          description: 'Chinese LLM capability evaluations'
        }]
      },
      
      // Category 2 - Not in new module
      {
        id: 'ai-planning-reasoning',
        moduleId: 'ai-agents-tool-use', // AI Agents & Tool Use
        title: 'AI Planning and Reasoning',
        description: 'Advanced planning and reasoning capabilities in AI systems',
        mentorMappings: [{
          mentorId: 'adria-garriga-alonso',
          description: 'Extending planning work in Sokoban models to LLMs'
        }]
      },
      {
        id: 'emergent-values-alignment',
        moduleId: 'alignment-research', // Alignment Research Methods
        title: 'Emergent Values in AI Systems',
        description: 'Understanding and aligning values that emerge from AI training',
        mentorMappings: [{
          mentorId: 'steven-basart',
          description: 'Extending Utility engineering (emergent values)'
        }]
      },
      {
        id: 'mechanistic-detection-methods',
        moduleId: 'advanced-interpretability', // Cutting-Edge Interpretability
        title: 'Mechanistic Detection Methods',
        description: 'Using mechanistic interpretability for detecting specific behaviors',
        mentorMappings: [{
          mentorId: 'joseph-bloom',
          description: 'Gears-level models of detection methods'
        }]
      },
      {
        id: 'llm-code-adaptation',
        moduleId: 'advanced-red-teaming', // Advanced Red Teaming & Adversarial ML
        title: 'LLM Code Adaptation',
        description: 'How LLMs adapt to different programming languages and paradigms',
        mentorMappings: [{
          mentorId: 'jason-lynch',
          description: 'LLM adaptation to esoteric programming languages'
        }]
      },
      {
        id: 'model-coordination-goals',
        moduleId: 'multi-agent-systems', // Multi-Agent & Complex Systems
        title: 'Model Coordination and Goals',
        description: 'Understanding coordination and goal formation in AI systems',
        mentorMappings: [{
          mentorId: 'cody-rushing',
          description: 'Model schelling points and goals'
        }]
      },
      {
        id: 'scheming-detection',
        moduleId: 'alignment-research', // Put with alignment topics
        title: 'Scheming Detection Methods',
        description: 'Techniques for detecting deceptive planning in AI systems',
        mentorMappings: [{
          mentorId: 'tyler-tracy',
          description: 'Incrimination strategies for scheming detection'
        }]
      }
    ]
    
    // Check which modules actually exist and create a mapping
    const moduleMap = new Map<string, string>()
    
    // Try to map to existing modules based on keywords
    for (const topic of remainingTopics) {
      let mappedModuleId = null
      
      // Try exact match first
      const exactMatch = modules.find(m => m.id === topic.moduleId)
      if (exactMatch) {
        mappedModuleId = exactMatch.id
      } else {
        // Try to find a similar module
        const keywords = topic.moduleId.split('-')
        for (const module of modules) {
          const moduleKeywords = module.title.toLowerCase().split(' ')
          if (keywords.some(k => moduleKeywords.some(mk => mk.includes(k) || k.includes(mk)))) {
            mappedModuleId = module.id
            break
          }
        }
      }
      
      if (mappedModuleId) {
        moduleMap.set(topic.id, mappedModuleId)
        console.log(`✅ Mapped ${topic.id} to module ${mappedModuleId}`)
      } else {
        console.log(`❌ Could not find module for ${topic.id} (looking for ${topic.moduleId})`)
      }
    }
    
    // Insert topics that have valid module mappings
    const insertTopic = db.prepare(`
      INSERT INTO topics (
        id, module_id, title, description, estimated_time, 
        difficulty, position, content_academic, content_personal
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const insertMentorMapping = db.prepare(`
      INSERT INTO mentor_topics (mentor_id, topic_id, mentor_topic_description)
      VALUES (?, ?, ?)
    `)
    
    for (const topic of remainingTopics) {
      const moduleId = moduleMap.get(topic.id)
      if (!moduleId) {
        console.log(`⚠️  Skipping ${topic.id} - no valid module found`)
        continue
      }
      
      // Get max position in the module
      const maxPos = db.prepare(
        'SELECT MAX(position) as max_pos FROM topics WHERE module_id = ?'
      ).get(moduleId)?.max_pos || 0
      
      try {
        // Insert the topic
        insertTopic.run(
          topic.id,
          moduleId,
          topic.title,
          topic.description,
          '4-6 hours',
          'advanced',
          maxPos + 1,
          `# ${topic.title}\n\n## Overview\n\n${topic.description}\n\n## Content coming soon...`,
          `# ${topic.title} - Personal View\n\n## My Take\n\n${topic.description}\n\n## Content coming soon...`
        )
        console.log(`✅ Created topic: ${topic.title}`)
        
        // Insert mentor mappings
        for (const mapping of topic.mentorMappings) {
          try {
            insertMentorMapping.run(mapping.mentorId, topic.id, mapping.description)
            console.log(`   ✅ Mapped ${mapping.mentorId} to ${topic.id}`)
          } catch (err) {
            console.log(`   ⚠️  Mapping may already exist: ${mapping.mentorId} -> ${topic.id}`)
          }
        }
      } catch (err) {
        console.log(`❌ Failed to create topic ${topic.id}:`, err)
      }
    }
    
    // Commit transaction
    db.prepare('COMMIT').run()
    console.log('\n✅ Successfully created remaining topics!')
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Error creating topics:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the script
createRemainingTopics()