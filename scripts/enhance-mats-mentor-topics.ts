import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

// More specific mappings based on actual mentor research
const ENHANCED_MENTOR_TOPICS = {
  'mats-2025-neel-nanda': {
    topics: [
      { id: 'mechanistic-interp', desc: 'Pioneered mechanistic interpretability methods' },
      { id: 'basic-interpretability', desc: 'Teaching interpretability fundamentals' },
      { id: 'understanding-llms', desc: 'Research on transformer internals' },
      { id: 'scalable-interpretability', desc: 'Working on scaling interpretability' }
    ]
  },
  'mats-2025-evan-hubinger': {
    topics: [
      { id: 'deceptive-alignment', desc: 'Key researcher on deceptive alignment' },
      { id: 'mesa-optimization', desc: 'Co-authored foundational mesa-optimization paper' },
      { id: 'goal-misgeneralization', desc: 'Research on goal misgeneralization' },
      { id: 'agent-evaluation-testing', desc: 'Leads Alignment Stress-Testing team' },
      { id: 'safety-evaluation-101', desc: 'Developing evaluation methodologies' }
    ]
  },
  'mats-2025-richard-ngo': {
    topics: [
      { id: 'agency-in-ai', desc: 'Theoretical work on AI agency' },
      { id: 'agent-architectures', desc: 'Research on agent design' },
      { id: 'multi-agent-coordination', desc: 'Multi-agent systems research' },
      { id: 'governance-basics', desc: 'Work on AGI governance' },
      { id: 'embedded-agency', desc: 'Contributions to embedded agency theory' }
    ]
  },
  'mats-2025-sam-bowman': {
    topics: [
      { id: 'safety-evaluation-101', desc: 'Leading safety evaluation research' },
      { id: 'automated-ai-safety', desc: 'Research on automating safety work' },
      { id: 'llm-psychology', desc: 'Understanding LLM behavior' },
      { id: 'understanding-llms', desc: 'Research on language model capabilities' }
    ]
  },
  'mats-2025-david-krueger': {
    topics: [
      { id: 'safety-evaluation-101', desc: 'Safety evaluation methodology' },
      { id: 'goal-misgeneralization', desc: 'Research on goal misgeneralization' },
      { id: 'training-failure-modes', desc: 'Understanding training failures' },
      { id: 'alignment-theory', desc: 'Theoretical alignment research' }
    ]
  },
  'mats-2025-owain-evans': {
    topics: [
      { id: 'agency-in-ai', desc: 'AI agency research' },
      { id: 'human-agent-interaction', desc: 'Human-AI interaction studies' },
      { id: 'cognitive-oversight', desc: 'Cognitive process monitoring' },
      { id: 'llm-psychology', desc: 'LLM behavior analysis' }
    ]
  },
  'mats-2025-paul-riechers': {
    topics: [
      { id: 'mechanistic-interp', desc: 'Information-theoretic interpretability' },
      { id: 'emergent-behaviors', desc: 'Emergent complexity in AI systems' },
      { id: 'basic-interpretability', desc: 'Teaching interpretability' }
    ]
  },
  'mats-2025-nicholas-carlini': {
    topics: [
      { id: 'adversarial-robustness', desc: 'Leading adversarial ML researcher' },
      { id: 'ai-systems-security', desc: 'AI security expert' },
      { id: 'jailbreak-techniques', desc: 'Research on model attacks' },
      { id: 'prompt-injection-defense', desc: 'Prompt injection research' },
      { id: 'multimodal-attacks', desc: 'Multimodal security research' }
    ]
  },
  'mats-2025-dawn-song': {
    topics: [
      { id: 'ai-computer-security', desc: 'AI and cybersecurity research' },
      { id: 'adversarial-robustness', desc: 'Adversarial defense methods' },
      { id: 'data-poisoning-defense', desc: 'Data security research' },
      { id: 'ai-systems-security', desc: 'Comprehensive AI security' }
    ]
  },
  'mats-2025-mary-phuong': {
    topics: [
      { id: 'safety-evaluation-101', desc: 'Safety evaluation at DeepMind' },
      { id: 'agent-evaluation-testing', desc: 'Agent testing methodologies' },
      { id: 'automated-red-teaming', desc: 'Automated testing systems' },
      { id: 'risk-assessment-intro', desc: 'Risk assessment frameworks' }
    ]
  }
}

async function main() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // First clear existing generic mappings for mentors we're enhancing
    console.log('Clearing generic mappings for enhanced mentors...')
    
    const clearStmt = db.prepare(`
      DELETE FROM entity_topics 
      WHERE entity_id = ? 
      AND relationship_type = 'research_focus'
    `)
    
    for (const mentorId of Object.keys(ENHANCED_MENTOR_TOPICS)) {
      clearStmt.run(mentorId)
    }
    
    // Add enhanced mappings
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO entity_topics (entity_id, topic_id, description, relationship_type, context)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    let totalAdded = 0
    
    for (const [mentorId, data] of Object.entries(ENHANCED_MENTOR_TOPICS)) {
      console.log(`\nProcessing ${mentorId}...`)
      let addedForMentor = 0
      
      for (const topic of data.topics) {
        try {
          insertStmt.run(
            mentorId,
            topic.id,
            topic.desc,
            'research_focus',
            JSON.stringify({ 
              source: 'mats_program', 
              year: 2025,
              specific: true 
            })
          )
          addedForMentor++
          console.log(`  ✓ Added ${topic.id}`)
        } catch (err) {
          console.log(`  - Skipped ${topic.id}: ${err.message}`)
        }
      }
      
      console.log(`  Total added: ${addedForMentor}`)
      totalAdded += addedForMentor
    }
    
    console.log(`\nTotal topics added: ${totalAdded}`)
    
    // Show final statistics
    const stats = db.prepare(`
      SELECT 
        COUNT(DISTINCT et.entity_id) as mentors_with_topics,
        COUNT(*) as total_connections,
        AVG(topic_count) as avg_topics_per_mentor
      FROM (
        SELECT entity_id, COUNT(*) as topic_count
        FROM entity_topics
        WHERE entity_id IN (
          SELECT id FROM entities 
          WHERE type = 'researcher' 
          AND EXISTS (
            SELECT 1 FROM json_each(tags) WHERE value = 'mats-mentor-2025'
          )
        )
        GROUP BY entity_id
      ) et
    `).get()
    
    console.log(`\nFinal Statistics:`)
    console.log(`- Mentors with topics: ${stats.mentors_with_topics}`)
    console.log(`- Total connections: ${stats.total_connections}`)
    console.log(`- Average topics per mentor: ${Math.round(stats.avg_topics_per_mentor * 10) / 10}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    db.close()
  }
}

main().catch(console.error)