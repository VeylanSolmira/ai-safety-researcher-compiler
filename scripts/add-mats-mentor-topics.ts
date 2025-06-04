import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

// Mapping of research areas to topic IDs
const RESEARCH_AREA_TO_TOPICS = {
  'Interpretability': [
    'mechanistic-interp',
    'basic-interpretability',
    'explainable-ai',
    'scalable-interpretability'
  ],
  'Evaluations': [
    'safety-evaluation-101',
    'agent-evaluation-testing',
    'automated-red-teaming',
    'intro-red-teaming'
  ],
  'AI agency': [
    'agency-in-ai',
    'agent-architectures',
    'agent-safety-fundamentals',
    'embedded-agency'
  ],
  'Governance': [
    'governance-basics',
    'policy-analysis',
    'institutional-design',
    'international-coordination'
  ],
  'Security': [
    'ai-systems-security',
    'ai-computer-security',
    'adversarial-robustness',
    'prompt-injection-defense'
  ],
  'Oversight/control': [
    'control-problem',
    'cognitive-oversight',
    'safety-monitoring',
    'deceptive-alignment'
  ],
  'Prosaic alignment': [
    'empirical-alignment',
    'alignment-theory',
    'training-failure-modes',
    'goal-misgeneralization'
  ],
  'Boundaries': [
    'situational-awareness',
    'deceptive-alignment',
    'mesa-optimization'
  ],
  'Learning': [
    'how-llms-trained',
    'understanding-llms',
    'llm-psychology',
    'training-failure-modes'
  ],
  'Field-building': [
    'ai-paradigms-overview',
    'foundational-papers',
    'ai-development-factions',
    'why-ai-safety'
  ],
  'General': [
    'risk-assessment-intro',
    'safety-capability-balance',
    'existential-risk-assessment'
  ]
}

// Special mappings for specific mentors based on their descriptions
const MENTOR_SPECIFIC_TOPICS = {
  'neel-nanda': ['mechanistic-interp', 'basic-interpretability', 'understanding-llms'],
  'evan-hubinger': ['deceptive-alignment', 'goal-misgeneralization', 'mesa-optimization', 'agent-evaluation-testing'],
  'richard-ngo': ['agency-in-ai', 'agent-architectures', 'multi-agent-coordination', 'embedded-agency'],
  'sam-bowman': ['safety-evaluation-101', 'automated-ai-safety', 'llm-psychology'],
  'dan-hendrycks': ['adversarial-robustness', 'ai-systems-security', 'multimodal-attacks'],
  'paul-christiano': ['alignment-theory', 'amplification-debate', 'empirical-alignment'],
  'buck-shlegeris': ['control-problem', 'intro-red-teaming'],
  'ethan-perez': ['automated-red-teaming', 'control-problem'],
  'eli-lifland': ['international-coordination', 'policy-analysis']
}

async function main() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // First, merge duplicate entries
    console.log('Merging duplicate entries...')
    
    // Get all entity_topics for the duplicates we want to keep
    const duplicateMappings = [
      { keep: 'buck-shlegeris-mats', remove: 'mats-2025-buck-shlegeris' },
      { keep: 'eli-lifland-mats', remove: 'mats-2025-eli-lifland' },
      { keep: 'ethan-perez-mats', remove: 'mats-2025-ethan-perez' }
    ]
    
    for (const { keep, remove } of duplicateMappings) {
      // Update the kept entry to have the mats-mentor-2025 tag
      db.prepare(`
        UPDATE entities 
        SET tags = json_set(
          COALESCE(tags, '[]'),
          '$[' || json_array_length(COALESCE(tags, '[]')) || ']',
          'mats-mentor-2025'
        )
        WHERE id = ? AND NOT EXISTS (
          SELECT 1 FROM json_each(tags) WHERE value = 'mats-mentor-2025'
        )
      `).run(keep)
      
      // Delete the duplicate
      db.prepare('DELETE FROM entities WHERE id = ?').run(remove)
      console.log(`Merged ${remove} into ${keep}`)
    }
    
    // Get all MATS mentors
    const mentors = db.prepare(`
      SELECT id, name, properties
      FROM entities
      WHERE type = 'researcher' 
      AND EXISTS (
        SELECT 1 FROM json_each(tags) WHERE value = 'mats-mentor-2025'
      )
    `).all()
    
    console.log(`\nFound ${mentors.length} MATS mentors`)
    
    // Prepare insert statement
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO entity_topics (entity_id, topic_id, description, relationship_type, context)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    let totalAdded = 0
    
    for (const mentor of mentors) {
      console.log(`\nProcessing ${mentor.name} (${mentor.id})...`)
      
      const topics = new Set<string>()
      
      // Check if we have specific topics for this mentor
      if (MENTOR_SPECIFIC_TOPICS[mentor.id]) {
        MENTOR_SPECIFIC_TOPICS[mentor.id].forEach(t => topics.add(t))
      } else {
        // Parse research areas from properties
        const props = JSON.parse(mentor.properties || '{}')
        const researchArea = props.research_areas || props.track || ''
        
        // Map research area to topics
        if (RESEARCH_AREA_TO_TOPICS[researchArea]) {
          RESEARCH_AREA_TO_TOPICS[researchArea].forEach(t => topics.add(t))
        }
        
        // Also check researchFocus and expertise
        if (props.researchFocus) {
          // Add relevant topics based on research focus
          const focus = props.researchFocus.toLowerCase()
          if (focus.includes('interpretability')) {
            ['mechanistic-interp', 'basic-interpretability'].forEach(t => topics.add(t))
          }
          if (focus.includes('alignment')) {
            ['alignment-theory', 'empirical-alignment'].forEach(t => topics.add(t))
          }
          if (focus.includes('safety')) {
            ['agent-safety-fundamentals', 'safety-evaluation-101'].forEach(t => topics.add(t))
          }
        }
      }
      
      // Add topics to database
      let addedForMentor = 0
      for (const topicId of topics) {
        try {
          insertStmt.run(
            mentor.id,
            topicId,
            `Research focus and mentorship area for ${mentor.name} at MATS`,
            'research_focus',
            JSON.stringify({ source: 'mats_program', year: 2025 })
          )
          addedForMentor++
        } catch (err) {
          // Topic might not exist or already linked
          console.log(`  - Skipped ${topicId}: ${err.message}`)
        }
      }
      
      console.log(`  Added ${addedForMentor} topics`)
      totalAdded += addedForMentor
    }
    
    console.log(`\nTotal topics added: ${totalAdded}`)
    
    // Verify the results
    const verifyStmt = db.prepare(`
      SELECT COUNT(DISTINCT entity_id) as mentors_with_topics
      FROM entity_topics
      WHERE entity_id IN (
        SELECT id FROM entities 
        WHERE type = 'researcher' 
        AND EXISTS (
          SELECT 1 FROM json_each(tags) WHERE value = 'mats-mentor-2025'
        )
      )
    `)
    
    const result = verifyStmt.get()
    console.log(`\nVerification: ${result.mentors_with_topics} mentors now have topic connections`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    db.close()
  }
}

main().catch(console.error)