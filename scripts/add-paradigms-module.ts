import Database from 'better-sqlite3'
import path from 'path'

async function addParadigmsModule() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    console.log('Adding Paradigms & Mental Models module to Intermediate tier...\n')
    
    // First, check if module already exists
    const existingModule = db.prepare(`
      SELECT id FROM modules WHERE id = 'paradigms-mental-models'
    `).get()
    
    if (existingModule) {
      console.log('Module already exists, skipping module creation')
    } else {
      // Add the new module to intermediate tier
      const insertModule = db.prepare(`
        INSERT INTO modules (
          id, tier_id, title, description, 
          estimated_time, assessment_type, position
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      insertModule.run(
        'paradigms-mental-models',
        'intermediate',
        'Paradigms & Mental Models',
        'Understanding how metaphors and mental models shape AI safety research, policy, and development',
        '3 weeks',
        'project',
        9 // Position after other intermediate modules
      )
      
      console.log('✅ Added Paradigms & Mental Models module')
    }
    
    // Add topics to the module
    const topics = [
      {
        id: 'introduction-ai-paradigms',
        title: 'Introduction to AI Paradigms',
        description: 'Overview of 40+ paradigms shaping AI safety discourse, from competition to cooperation models',
        difficulty: 'intermediate',
        estimatedTime: '6 hours',
        position: 1
      },
      {
        id: 'cultural-paradigms-ai',
        title: 'Cultural Paradigms in AI',
        description: 'How different cultures conceptualize AI: Western, Eastern, Indigenous, and Global South perspectives',
        difficulty: 'intermediate',
        estimatedTime: '5 hours',
        position: 2
      },
      {
        id: 'paradigm-driven-research',
        title: 'Paradigm-Driven Research',
        description: 'How paradigms shape research priorities, funding, and safety strategies',
        difficulty: 'intermediate',
        estimatedTime: '4 hours',
        position: 3
      },
      {
        id: 'paradigms-in-practice',
        title: 'Paradigms in Practice',
        description: 'Applying paradigm analysis to real AI safety challenges and switching paradigms for new insights',
        difficulty: 'intermediate',
        estimatedTime: '5 hours',
        position: 4
      },
      {
        id: 'creating-new-paradigms',
        title: 'Creating New Paradigms',
        description: 'Developing novel metaphors and frameworks for emerging AI capabilities and risks',
        difficulty: 'advanced',
        estimatedTime: '4 hours',
        position: 5
      }
    ]
    
    const insertTopic = db.prepare(`
      INSERT OR IGNORE INTO topics (
        id, module_id, title, description,
        estimated_time, difficulty, position,
        has_journey_extras
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const topic of topics) {
      insertTopic.run(
        topic.id,
        'paradigms-mental-models',
        topic.title,
        topic.description,
        topic.estimatedTime,
        topic.difficulty,
        topic.position,
        1 // has_journey_extras
      )
      console.log(`✅ Added topic: ${topic.title}`)
    }
    
    // Add cross-references to existing topics
    console.log('\nAdding paradigm references to existing topics...')
    
    // Update ethics-fundamentals to reference paradigms
    const updateEthics = db.prepare(`
      UPDATE topics 
      SET description = description || ' Explores how different paradigms embed different ethical assumptions.'
      WHERE id = 'ethics-fundamentals'
    `)
    updateEthics.run()
    console.log('✅ Updated Ethics Fundamentals')
    
    // Update value-learning to reference paradigms  
    const updateValueLearning = db.prepare(`
      UPDATE topics
      SET description = description || ' Consider how paradigm choice affects which values we prioritize.'
      WHERE id = 'value-learning'
    `)
    updateValueLearning.run()
    console.log('✅ Updated Value Learning')
    
    // Update research-methodology to include paradigm awareness
    const updateMethodology = db.prepare(`
      UPDATE topics
      SET description = description || ' Includes paradigm-aware research design.'
      WHERE id = 'problem-decomposition-scoping'
    `)
    updateMethodology.run()
    console.log('✅ Updated Research Methodology')
    
    console.log('\n🎉 Successfully added Paradigms & Mental Models module with 5 topics!')
    console.log('📊 The intermediate tier now has 9 modules')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

addParadigmsModule()