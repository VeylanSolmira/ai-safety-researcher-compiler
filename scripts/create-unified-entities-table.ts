import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

// Unified entity types
type EntityType = 'researcher' | 'organization' | 'platform'

interface UnifiedEntity {
  id: string
  name: string
  type: EntityType
  description: string
  tags: string[]
  properties: Record<string, any>  // Combines all metadata, flags, and type-specific data
  personal_note?: string
  active: boolean
}

function createUnifiedEntitiesTable() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Start transaction
    db.prepare('BEGIN').run()
    
    // Create the unified entities table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('researcher', 'organization', 'platform')),
        description TEXT NOT NULL,
        tags JSON,
        properties JSON,
        personal_note TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
    
    // Create indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(type)').run()
    db.prepare('CREATE INDEX IF NOT EXISTS idx_entities_active ON entities(active)').run()
    
    console.log('✅ Created unified entities table')
    
    // Example: Migrate existing data
    console.log('\n📦 Migrating existing data...')
    
    // Migrate mentors as researchers
    const mentors = db.prepare(`
      SELECT m.*, o.name as org_name 
      FROM mentors m 
      LEFT JOIN organizations o ON m.organization_id = o.id
    `).all()
    
    const insertEntity = db.prepare(`
      INSERT OR IGNORE INTO entities (
        id, name, type, description, tags, properties, personal_note, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const mentor of mentors) {
      // Get research areas from mentor_topics
      const topicRelations = db.prepare(`
        SELECT t.title FROM mentor_topics mt 
        JOIN topics t ON mt.topic_id = t.id 
        WHERE mt.mentor_id = ?
      `).all(mentor.id)
      const researchAreas = topicRelations.map(r => r.title)
      
      // Build tags array
      const tags = ['ai-safety', 'cbai-mentor', ...researchAreas]
      
      // Build properties object
      const properties = {
        website: mentor.website,
        affiliation: mentor.org_name,
        email: mentor.email,
        researchAreas: researchAreas,
        offersmentorship: true,
        acceptingStudents: true, // CBAI mentors
        conductResearch: true
      }
      
      insertEntity.run(
        mentor.id,
        mentor.name,
        'researcher',
        mentor.biography || `AI Safety Researcher`,
        JSON.stringify(tags),
        JSON.stringify(properties),
        mentor.quick_eval_rating ? `Rating: ${mentor.quick_eval_rating}` : null,
        mentor.is_active ? 1 : 0
      )
      console.log(`  ✅ Migrated mentor: ${mentor.name}`)
    }
    
    // Migrate organizations
    const orgs = db.prepare('SELECT * FROM organizations').all()
    
    for (const org of orgs) {
      const orgTags = ['ai-safety']
      if (org.type) orgTags.push(org.type)
      
      const properties = {
        website: org.website,
        organizationType: org.type || 'organization',
        hasOpenPositions: true,
        conductResearch: org.type === 'research-lab',
        provideFunding: org.type === 'think-tank'
      }
      
      insertEntity.run(
        org.id,
        org.name,
        'organization',
        org.description || `${org.type || 'Organization'} focused on AI safety research and development`,
        JSON.stringify(orgTags),
        JSON.stringify(properties),
        null,
        1  // active = true
      )
      console.log(`  ✅ Migrated organization: ${org.name}`)
    }
    
    // Migrate community profiles from database
    const communityProfiles = db.prepare('SELECT * FROM community_profiles').all()
    
    for (const community of communityProfiles) {
      const tags = ['ai-safety', 'platform']
      if (community.tags) {
        const parsedTags = JSON.parse(community.tags)
        tags.push(...parsedTags)
      }
      
      const properties = {
        website: community.website,
        platformType: community.type || 'community',
        hasOnlineCommunity: true
      }
      
      insertEntity.run(
        community.id,
        community.name,
        'platform',
        community.description,
        JSON.stringify(tags),
        JSON.stringify(properties),
        null,
        1  // active
      )
      console.log(`  ✅ Migrated community: ${community.name}`)
    }
    
    // Commit transaction
    db.prepare('COMMIT').run()
    console.log('\n✅ Successfully created unified entities system!')
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Error:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the script
createUnifiedEntitiesTable()