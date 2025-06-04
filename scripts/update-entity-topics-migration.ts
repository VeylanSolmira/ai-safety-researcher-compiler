import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

function updateEntityTopicsMigration() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = OFF') // Temporarily disable to rename table
  
  try {
    console.log('🚀 Updating entity-topics system...\n')
    
    // Start transaction
    db.prepare('BEGIN').run()
    
    // 1. Rename mentor_topics to entity_topics
    console.log('📦 Renaming mentor_topics to entity_topics...')
    db.prepare(`
      ALTER TABLE mentor_topics RENAME TO entity_topics_old
    `).run()
    
    // 2. Create new entity_topics table with updated schema
    db.prepare(`
      CREATE TABLE entity_topics (
        entity_id TEXT NOT NULL REFERENCES entities(id),
        topic_id TEXT NOT NULL REFERENCES topics(id),
        description TEXT NOT NULL,
        relationship_type TEXT DEFAULT 'researches',
        context TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (entity_id, topic_id, description)
      )
    `).run()
    
    // 3. Copy existing mentor-topic relationships
    console.log('📋 Migrating existing mentor-topic relationships...')
    db.prepare(`
      INSERT INTO entity_topics (entity_id, topic_id, description, relationship_type, context)
      SELECT 
        mentor_id,
        topic_id,
        mentor_topic_description,
        'mentors-on',
        context
      FROM entity_topics_old
    `).run()
    
    const mentorTopicCount = db.prepare(`SELECT COUNT(*) as count FROM entity_topics WHERE relationship_type = 'mentors-on'`).get().count
    console.log(`  ✅ Migrated ${mentorTopicCount} mentor-topic relationships`)
    
    // 4. Add topic associations for organizations
    console.log('\n🏢 Adding organization-topic associations...')
    const insertEntityTopic = db.prepare(`
      INSERT OR IGNORE INTO entity_topics (entity_id, topic_id, description, relationship_type, context)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    // Anthropic topics
    const anthropicTopics = [
      { topicId: 'mechanistic-interp', desc: 'Mechanistic interpretability research and tool development' },
      { topicId: 'interpretability', desc: 'General interpretability methods and theory' },
      { topicId: 'constitutional-ai', desc: 'Constitutional AI and RLHF research' },
      { topicId: 'alignment-research', desc: 'AI alignment theory and methods' },
      { topicId: 'llm-psychology', desc: 'Understanding LLM behavior and psychology' }
    ]
    
    for (const topic of anthropicTopics) {
      try {
        insertEntityTopic.run('anthropic', topic.topicId, topic.desc, 'researches', 'Core research area')
        console.log(`  ✅ Anthropic → ${topic.topicId}`)
      } catch (err) {
        // Topic might not exist
        console.log(`  ⚠️  Topic ${topic.topicId} not found`)
      }
    }
    
    // DeepMind topics
    const deepmindTopics = [
      { topicId: 'ai-agents-tool-use', desc: 'Agent research and tool use' },
      { topicId: 'multi-agent-coordination', desc: 'Multi-agent systems research' },
      { topicId: 'safety-evaluation-101', desc: 'Safety evaluation methods' },
      { topicId: 'alignment-research', desc: 'Technical alignment research' }
    ]
    
    for (const topic of deepmindTopics) {
      try {
        insertEntityTopic.run('deepmind', topic.topicId, topic.desc, 'researches', 'Core research area')
        console.log(`  ✅ DeepMind → ${topic.topicId}`)
      } catch (err) {
        console.log(`  ⚠️  Topic ${topic.topicId} not found`)
      }
    }
    
    // OpenAI topics
    const openaiTopics = [
      { topicId: 'alignment-research', desc: 'Alignment from human feedback' },
      { topicId: 'red-teaming-protocols', desc: 'Red teaming and safety testing' },
      { topicId: 'deployment-gates', desc: 'Deployment safety and monitoring' }
    ]
    
    for (const topic of openaiTopics) {
      try {
        insertEntityTopic.run('openai', topic.topicId, topic.desc, 'researches', 'Core research area')
        console.log(`  ✅ OpenAI → ${topic.topicId}`)
      } catch (err) {
        console.log(`  ⚠️  Topic ${topic.topicId} not found`)
      }
    }
    
    // Redwood Research topics
    const redwoodTopics = [
      { topicId: 'adversarial-robustness', desc: 'Adversarial training and robustness' },
      { topicId: 'deceptive-alignment', desc: 'Detecting and preventing deceptive alignment' },
      { topicId: 'control-problem', desc: 'AI control research' },
      { topicId: 'mechanistic-interp', desc: 'Interpretability research' }
    ]
    
    for (const topic of redwoodTopics) {
      try {
        insertEntityTopic.run('redwood-research', topic.topicId, topic.desc, 'researches', 'Core research area')
        console.log(`  ✅ Redwood Research → ${topic.topicId}`)
      } catch (err) {
        console.log(`  ⚠️  Topic ${topic.topicId} not found`)
      }
    }
    
    // MIRI topics
    const miriTopics = [
      { topicId: 'agent-foundations', desc: 'Agent foundations research' },
      { topicId: 'embedded-agency', desc: 'Embedded agency problem' },
      { topicId: 'decision-theory', desc: 'Decision theory research' },
      { topicId: 'mesa-optimization', desc: 'Mesa-optimization risks' }
    ]
    
    for (const topic of miriTopics) {
      try {
        insertEntityTopic.run('miri', topic.topicId, topic.desc, 'researches', 'Core research area')
        console.log(`  ✅ MIRI → ${topic.topicId}`)
      } catch (err) {
        console.log(`  ⚠️  Topic ${topic.topicId} not found`)
      }
    }
    
    // 5. Add topic associations for platforms
    console.log('\n💬 Adding platform-topic associations...')
    
    // LessWrong frequently discussed topics
    const lesswrongTopics = [
      { topicId: 'ai-risks-fundamentals', desc: 'Fundamental discussions about AI risk' },
      { topicId: 'alignment-research', desc: 'Alignment research discussions' },
      { topicId: 'rationality', desc: 'Rationality and decision-making' },
      { topicId: 'existential-risk', desc: 'Existential risk discussions' }
    ]
    
    for (const topic of lesswrongTopics) {
      try {
        insertEntityTopic.run('lesswrong', topic.topicId, topic.desc, 'discusses', 'Popular topic area')
        console.log(`  ✅ LessWrong → ${topic.topicId}`)
      } catch (err) {
        console.log(`  ⚠️  Topic ${topic.topicId} not found`)
      }
    }
    
    // Alignment Forum topics
    const alignmentForumTopics = [
      { topicId: 'alignment-research', desc: 'Technical alignment research' },
      { topicId: 'mechanistic-interp', desc: 'Interpretability research discussions' },
      { topicId: 'agent-foundations', desc: 'Agent foundations theory' },
      { topicId: 'mesa-optimization', desc: 'Inner alignment discussions' }
    ]
    
    for (const topic of alignmentForumTopics) {
      try {
        insertEntityTopic.run('alignment-forum', topic.topicId, topic.desc, 'discusses', 'Core discussion area')
        console.log(`  ✅ Alignment Forum → ${topic.topicId}`)
      } catch (err) {
        console.log(`  ⚠️  Topic ${topic.topicId} not found`)
      }
    }
    
    // 6. Create indexes
    console.log('\n📑 Creating indexes...')
    db.prepare('CREATE INDEX idx_entity_topics_entity ON entity_topics(entity_id)').run()
    db.prepare('CREATE INDEX idx_entity_topics_topic ON entity_topics(topic_id)').run()
    db.prepare('CREATE INDEX idx_entity_topics_type ON entity_topics(relationship_type)').run()
    
    // 7. Drop old table
    db.prepare('DROP TABLE entity_topics_old').run()
    
    // Re-enable foreign keys
    db.pragma('foreign_keys = ON')
    
    // Commit transaction
    db.prepare('COMMIT').run()
    
    // Summary
    const totalEntityTopics = db.prepare('SELECT COUNT(*) as count FROM entity_topics').get().count
    const byType = db.prepare(`
      SELECT relationship_type, COUNT(*) as count 
      FROM entity_topics 
      GROUP BY relationship_type
    `).all()
    
    console.log('\n✅ Entity-topics update complete!')
    console.log(`   - ${totalEntityTopics} total entity-topic relationships`)
    byType.forEach(t => {
      console.log(`   - ${t.count} ${t.relationship_type} relationships`)
    })
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    db.pragma('foreign_keys = ON')
    db.close()
  }
}

// Run the migration
updateEntityTopicsMigration()