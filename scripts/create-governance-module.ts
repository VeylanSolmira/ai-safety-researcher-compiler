import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

function createGovernanceModule() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Start transaction
    db.prepare('BEGIN').run()
    
    // First, check which tier to add this to (Advanced tier)
    const advancedTier = db.prepare('SELECT id FROM tiers WHERE id = ?').get('advanced')
    if (!advancedTier) {
      throw new Error('Advanced tier not found')
    }
    
    // Get the max position in advanced tier
    const maxPosition = db.prepare(
      'SELECT MAX(position) as max_pos FROM modules WHERE tier_id = ?'
    ).get('advanced')?.max_pos || 0
    
    // Create the new module
    const moduleId = 'ai-governance-implementation'
    const insertModule = db.prepare(`
      INSERT INTO modules (id, tier_id, title, description, estimated_time, position)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    insertModule.run(
      moduleId,
      'advanced',
      'AI Governance & Implementation',
      'Bridge technical AI safety with real-world policy implementation. Learn how to design governance structures, evaluation frameworks, and safety documentation for AI systems.',
      '6-8 weeks',
      maxPosition + 1
    )
    
    console.log('✅ Created AI Governance & Implementation module')
    
    // Create the 7 topics for this module
    const topics = [
      {
        id: 'ai-rd-governance',
        title: 'AI R&D Governance Structures',
        description: 'Design and evaluate governance models for AI research organizations to ensure safety',
        estimatedTime: '4-5 hours',
        difficulty: 'advanced',
        position: 1
      },
      {
        id: 'third-party-evaluation',
        title: 'Third-Party AI Evaluation Systems',
        description: 'Develop independent safety evaluation frameworks and certification processes',
        estimatedTime: '5-6 hours',
        difficulty: 'advanced',
        position: 2
      },
      {
        id: 'safety-cases',
        title: 'AI Safety Cases and Documentation',
        description: 'Create comprehensive safety documentation and evidence requirements for AI deployment',
        estimatedTime: '4-5 hours',
        difficulty: 'advanced',
        position: 3
      },
      {
        id: 'capability-scaling-laws',
        title: 'Capability Scaling Laws and Predictions',
        description: 'Understand and predict AI capability growth through empirical scaling laws',
        estimatedTime: '5-6 hours',
        difficulty: 'advanced',
        position: 4
      },
      {
        id: 'high-stakes-control',
        title: 'High-Stakes AI Control Settings',
        description: 'Design control mechanisms for AI systems in critical applications',
        estimatedTime: '6-7 hours',
        difficulty: 'advanced',
        position: 5
      },
      {
        id: 'embodied-ai-safety',
        title: 'Embodied AI and Robotics Safety',
        description: 'Address safety challenges in physical AI systems and robotic deployments',
        estimatedTime: '5-6 hours',
        difficulty: 'advanced',
        position: 6
      },
      {
        id: 'human-ai-knowledge-transfer',
        title: 'Bridging Human-AI Knowledge Gaps',
        description: 'Develop methods for effective knowledge transfer between humans and AI systems',
        estimatedTime: '4-5 hours',
        difficulty: 'advanced',
        position: 7
      }
    ]
    
    const insertTopic = db.prepare(`
      INSERT INTO topics (
        id, module_id, title, description, estimated_time, 
        difficulty, position, content_academic, content_personal
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const topic of topics) {
      insertTopic.run(
        topic.id,
        moduleId,
        topic.title,
        topic.description,
        topic.estimatedTime,
        topic.difficulty,
        topic.position,
        `# ${topic.title}\n\n## Overview\n\n${topic.description}\n\n## Content coming soon...`,
        `# ${topic.title} - Personal View\n\n## My Take\n\n${topic.description}\n\n## Content coming soon...`
      )
      console.log(`✅ Created topic: ${topic.title}`)
    }
    
    // Now create mentor-topic mappings for the new topics
    const mentorMappings = [
      // ai-rd-governance
      { mentor: 'mauricio-baker', topic: 'ai-rd-governance', desc: 'Identifying effective R&D structures for AI safety and governance' },
      
      // third-party-evaluation
      { mentor: 'michael-chen', topic: 'third-party-evaluation', desc: 'Third-party oversight' },
      
      // safety-cases
      { mentor: 'michael-chen', topic: 'safety-cases', desc: 'Safety cases' },
      
      // capability-scaling-laws
      { mentor: 'michael-chen', topic: 'capability-scaling-laws', desc: 'Observational scaling laws for dangerous capabilities' },
      
      // high-stakes-control
      { mentor: 'cody-rushing', topic: 'high-stakes-control', desc: 'Novel high-stakes control settings' },
      
      // embodied-ai-safety
      { mentor: 'vicky-charisi', topic: 'embodied-ai-safety', desc: 'Legal frameworks for embodied AI and robotics safety' },
      
      // human-ai-knowledge-transfer
      { mentor: 'david-bau-alex-loftus', topic: 'human-ai-knowledge-transfer', desc: 'Experiments bridging human-AI knowledge gap' }
    ]
    
    const insertMapping = db.prepare(`
      INSERT INTO mentor_topics (mentor_id, topic_id, mentor_topic_description)
      VALUES (?, ?, ?)
    `)
    
    for (const mapping of mentorMappings) {
      try {
        insertMapping.run(mapping.mentor, mapping.topic, mapping.desc)
        console.log(`✅ Mapped ${mapping.mentor} to ${mapping.topic}`)
      } catch (err) {
        console.log(`⚠️  Mapping may already exist: ${mapping.mentor} -> ${mapping.topic}`)
      }
    }
    
    // Commit transaction
    db.prepare('COMMIT').run()
    console.log('\n✅ Successfully created AI Governance & Implementation module with 7 topics!')
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Error creating module:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the script
createGovernanceModule()