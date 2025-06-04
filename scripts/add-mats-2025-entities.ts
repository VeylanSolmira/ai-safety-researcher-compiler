#!/usr/bin/env tsx
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dbPath = join(__dirname, '..', 'journey.db')

const db = new Database(dbPath)

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON')

interface Entity {
  id: string
  name: string
  type: 'researcher' | 'organization' | 'platform'
  description: string
  tags: string[]
  properties: Record<string, any>
  personal_note?: string
}

interface EntityTopicRelation {
  entity_id: string
  topic_id: string
  description: string
  relationship_type: string
}

const matsOrganization: Entity = {
  id: 'mats-program',
  name: 'MATS (Machine Learning Alignment & Theory Scholars)',
  type: 'organization',
  description: 'Independent research and educational seminar program for AI alignment, connecting scholars with top mentors in a 10-week intensive program',
  tags: ['educational-program', 'ai-safety', 'mentorship', 'berkeley', 'summer-2025'],
  properties: {
    website: 'https://matsprogram.org',
    legalStatus: '501(c)(3) public charity',
    founded: 2021,
    location: 'Berkeley, California',
    alumniCount: 361,
    mentorCount: 75,
    programDuration: '10 weeks',
    summerDates: 'June 16 - August 22, 2025',
    fundingSources: [
      'Open Philanthropy',
      'Survival and Flourishing Fund', 
      'Foresight Institute',
      'Cooperative AI Foundation'
    ],
    tracks: [
      'Oversight & Control',
      'Evaluations', 
      'Interpretability',
      'Governance & Strategy',
      'Agency',
      'Security'
    ]
  }
}

const matsMentors: Entity[] = [
  {
    id: 'buck-shlegeris-mats',
    name: 'Buck Shlegeris',
    type: 'researcher',
    description: 'MATS 2025 Summer mentor at Redwood Research focusing on AI control, red-teaming, and alignment evaluations/demos',
    tags: ['ai-safety', 'control', 'red-teaming', 'mats-mentor-2025', 'redwood-research'],
    properties: {
      organization: 'Redwood Research',
      location: 'SF Bay Area',
      mentorshipProgram: 'MATS Summer 2025',
      researchFocus: 'Control, Red-teaming, Alignment evals/demos',
      track: 'Oversight & Control',
      matsProfile: 'https://www.matsprogram.org/mentors'
    }
  },
  {
    id: 'adria-garriga-alonso-mats',
    name: 'Adrià Garriga-Alonso',
    type: 'researcher', 
    description: 'MATS 2025 Summer mentor at FAR AI specializing in mechanistic interpretability research',
    tags: ['ai-safety', 'interpretability', 'mechanistic-interpretability', 'mats-mentor-2025', 'far-ai'],
    properties: {
      organization: 'FAR AI',
      location: 'Washington, D.C.',
      mentorshipProgram: 'MATS Summer 2025',
      researchFocus: 'Mechanistic interpretability',
      track: 'Interpretability',
      matsProfile: 'https://www.matsprogram.org/mentors'
    }
  },
  {
    id: 'eli-lifland-mats',
    name: 'Eli Lifland',
    type: 'researcher',
    description: 'MATS 2025 Summer mentor at AI Futures Project working on AI governance, policy, and national security',
    tags: ['ai-safety', 'governance', 'policy', 'national-security', 'mats-mentor-2025'],
    properties: {
      organization: 'AI Futures Project',
      location: 'SF Bay Area',
      mentorshipProgram: 'MATS Summer 2025',
      researchFocus: 'AI governance, policy, National security',
      track: 'Governance',
      matsProfile: 'https://www.matsprogram.org/mentors'
    }
  },
  {
    id: 'ethan-perez-mats',
    name: 'Ethan Perez',
    type: 'researcher',
    description: 'MATS 2025 Summer mentor at Anthropic focusing on AI control, red-teaming, and scalable oversight',
    tags: ['ai-safety', 'control', 'red-teaming', 'scalable-oversight', 'mats-mentor-2025', 'anthropic'],
    properties: {
      organization: 'Anthropic',
      location: 'SF Bay Area', 
      mentorshipProgram: 'MATS Summer 2025',
      researchFocus: 'AI control, red-teaming, scalable oversight',
      track: 'Oversight & Control',
      matsProfile: 'https://www.matsprogram.org/mentors'
    }
  }
]

// Supporting organizations (if not already in DB)
const supportingOrgs: Entity[] = [
  {
    id: 'far-ai',
    name: 'FAR AI',
    type: 'organization',
    description: 'AI safety research organization focused on mechanistic interpretability and alignment research',
    tags: ['research-lab', 'ai-safety', 'interpretability', 'washington-dc'],
    properties: {
      location: 'Washington, D.C.',
      researchAreas: ['mechanistic-interpretability', 'alignment']
    }
  },
  {
    id: 'ai-futures-project',
    name: 'AI Futures Project',
    type: 'organization',
    description: 'Organization focused on AI governance, policy research, and national security implications of AI',
    tags: ['think-tank', 'ai-governance', 'policy', 'sf-bay-area'],
    properties: {
      location: 'SF Bay Area',
      focusAreas: ['ai-governance', 'policy', 'national-security']
    }
  }
]

// Topic relationships - map MATS mentors to existing journey topics
const entityTopicRelations: EntityTopicRelation[] = [
  // Buck Shlegeris
  {
    entity_id: 'buck-shlegeris-mats',
    topic_id: 'control-problem',
    description: 'Mentors students on AI control methods and red-teaming approaches at MATS',
    relationship_type: 'mentors-on'
  },
  {
    entity_id: 'buck-shlegeris-mats',
    topic_id: 'intro-red-teaming',
    description: 'Teaches red-teaming techniques for alignment evaluation at MATS',
    relationship_type: 'mentors-on'
  },
  
  // Adrià Garriga-Alonso
  {
    entity_id: 'adria-garriga-alonso-mats',
    topic_id: 'mechanistic-interp',
    description: 'Leads mechanistic interpretability research projects at MATS',
    relationship_type: 'mentors-on'
  },
  {
    entity_id: 'adria-garriga-alonso-mats',
    topic_id: 'basic-interpretability',
    description: 'Mentors students on interpretability fundamentals at MATS',
    relationship_type: 'mentors-on'
  },
  
  // Eli Lifland
  {
    entity_id: 'eli-lifland-mats',
    topic_id: 'policy-analysis',
    description: 'Mentors on AI policy analysis and governance research at MATS',
    relationship_type: 'mentors-on'
  },
  {
    entity_id: 'eli-lifland-mats',
    topic_id: 'international-coordination',
    description: 'Explores national security and international AI coordination at MATS',
    relationship_type: 'mentors-on'
  },
  
  // Ethan Perez
  {
    entity_id: 'ethan-perez-mats',
    topic_id: 'control-problem',
    description: 'Researches AI control and scalable oversight methods at MATS',
    relationship_type: 'mentors-on'
  },
  {
    entity_id: 'ethan-perez-mats',
    topic_id: 'automated-red-teaming',
    description: 'Develops automated red-teaming approaches for AI safety at MATS',
    relationship_type: 'mentors-on'
  },
  
  // MATS organization relationships
  {
    entity_id: 'mats-program',
    topic_id: 'why-ai-safety',
    description: 'Trains scholars on fundamental AI safety concepts and research',
    relationship_type: 'provides-training'
  },
  {
    entity_id: 'mats-program',
    topic_id: 'research-project-mgmt',
    description: 'Provides research mentorship and project management training',
    relationship_type: 'provides-training'
  }
]

async function addMatsEntities() {
  console.log('Adding MATS 2025 entities to database...\n')
  
  // Prepare statements
  const insertEntity = db.prepare(`
    INSERT OR REPLACE INTO entities (id, name, type, description, tags, properties, personal_note, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `)
  
  const insertEntityTopic = db.prepare(`
    INSERT OR IGNORE INTO entity_topics (entity_id, topic_id, description, relationship_type)
    VALUES (?, ?, ?, ?)
  `)
  
  const checkEntity = db.prepare('SELECT id FROM entities WHERE id = ?')
  const checkTopic = db.prepare('SELECT id FROM topics WHERE id = ?')
  
  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION')
    
    // Add MATS organization
    console.log('Adding MATS organization...')
    insertEntity.run(
      matsOrganization.id,
      matsOrganization.name,
      matsOrganization.type,
      matsOrganization.description,
      JSON.stringify(matsOrganization.tags),
      JSON.stringify(matsOrganization.properties),
      matsOrganization.personal_note || null
    )
    
    // Add supporting organizations if they don't exist
    console.log('\nChecking supporting organizations...')
    for (const org of supportingOrgs) {
      const exists = checkEntity.get(org.id)
      if (!exists) {
        console.log(`Adding ${org.name}...`)
        insertEntity.run(
          org.id,
          org.name,
          org.type,
          org.description,
          JSON.stringify(org.tags),
          JSON.stringify(org.properties),
          org.personal_note || null
        )
      } else {
        console.log(`${org.name} already exists, skipping...`)
      }
    }
    
    // Add MATS mentors
    console.log('\nAdding MATS mentors...')
    for (const mentor of matsMentors) {
      console.log(`Adding ${mentor.name}...`)
      insertEntity.run(
        mentor.id,
        mentor.name,
        mentor.type,
        mentor.description,
        JSON.stringify(mentor.tags),
        JSON.stringify(mentor.properties),
        mentor.personal_note || null
      )
    }
    
    // Add entity-topic relationships
    console.log('\nAdding entity-topic relationships...')
    let relationCount = 0
    for (const relation of entityTopicRelations) {
      // Check if topic exists
      const topicExists = checkTopic.get(relation.topic_id)
      if (topicExists) {
        insertEntityTopic.run(
          relation.entity_id,
          relation.topic_id,
          relation.description,
          relation.relationship_type
        )
        relationCount++
      } else {
        console.log(`Warning: Topic ${relation.topic_id} not found, skipping relation`)
      }
    }
    
    // Commit transaction
    db.exec('COMMIT')
    
    console.log('\n✅ Successfully added:')
    console.log(`- 1 MATS organization`)
    console.log(`- ${supportingOrgs.length} supporting organizations (if new)`)
    console.log(`- ${matsMentors.length} MATS mentors`)
    console.log(`- ${relationCount} entity-topic relationships`)
    
    // Verify insertion
    const entityCount = db.prepare('SELECT COUNT(*) as count FROM entities WHERE tags LIKE ?').get('%mats%')
    console.log(`\nTotal MATS-related entities in database: ${entityCount.count}`)
    
  } catch (error) {
    db.exec('ROLLBACK')
    console.error('Error adding MATS entities:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the script
addMatsEntities().catch(console.error)