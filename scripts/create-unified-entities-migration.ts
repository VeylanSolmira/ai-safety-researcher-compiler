import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

// Comprehensive migration to unified entities system
function migrateToUnifiedEntities() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    console.log('🚀 Starting unified entities migration...\n')
    
    // Start transaction
    db.prepare('BEGIN').run()
    
    // 1. Create the entities table with hybrid approach
    console.log('📦 Creating entities table...')
    db.prepare(`
      CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        base_type TEXT NOT NULL CHECK(base_type IN ('organization', 'individual', 'platform')),
        engagement_model TEXT CHECK(engagement_model IN ('employment', 'membership', 'contribution', 'participation', 'collaboration')),
        description TEXT,
        website TEXT,
        location TEXT,
        tags JSON NOT NULL DEFAULT '[]',
        metadata JSON DEFAULT '{}',
        personal_note TEXT,
        featured BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
    
    // Create indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_entities_base_type ON entities(base_type)').run()
    db.prepare('CREATE INDEX IF NOT EXISTS idx_entities_active ON entities(active)').run()
    db.prepare('CREATE INDEX IF NOT EXISTS idx_entities_featured ON entities(featured)').run()
    
    // 2. Create relationships table
    console.log('📦 Creating relationships table...')
    db.prepare(`
      CREATE TABLE IF NOT EXISTS entity_relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_entity_id TEXT NOT NULL REFERENCES entities(id),
        to_entity_id TEXT NOT NULL REFERENCES entities(id),
        relationship_type TEXT NOT NULL,
        metadata JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(from_entity_id, to_entity_id, relationship_type)
      )
    `).run()
    
    const insertEntity = db.prepare(`
      INSERT OR IGNORE INTO entities (
        id, name, base_type, engagement_model, description, website, location, tags, metadata, personal_note, featured, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const insertRelationship = db.prepare(`
      INSERT OR IGNORE INTO entity_relationships (from_entity_id, to_entity_id, relationship_type, metadata)
      VALUES (?, ?, ?, ?)
    `)
    
    // 3. Migrate organizations
    console.log('\n📁 Migrating organizations...')
    const orgs = db.prepare('SELECT * FROM organizations').all()
    
    for (const org of orgs) {
      const tags = ['content-producer']
      if (org.type === 'research-lab') tags.push('research-lab', 'employer')
      if (org.type === 'university') tags.push('university', 'academic', 'employer')
      if (org.type === 'think-tank') tags.push('think-tank', 'policy')
      if (org.type === 'government') tags.push('government', 'policy')
      
      // Handle empty strings as null
      const website = org.website && org.website.trim() ? org.website : null
      const location = org.location && org.location.trim() ? org.location : null
      const description = org.description && org.description.trim() ? org.description : `${(org.type || 'organization').replace('-', ' ')} focused on AI safety research and development`
      
      insertEntity.run(
        org.id,
        org.name,
        'organization',
        'employment',
        description,
        website,
        location,
        JSON.stringify(tags),
        JSON.stringify({
          organizationType: org.type || 'organization',
          foundedYear: org.founded_year || null
        }),
        null,
        false,
        true
      )
      console.log(`  ✅ ${org.name}`)
    }
    
    // 4. Migrate mentors as individuals
    console.log('\n👥 Migrating mentors as individuals...')
    const mentors = db.prepare(`
      SELECT m.*, o.id as org_id, o.name as org_name 
      FROM mentors m 
      LEFT JOIN organizations o ON m.organization_id = o.id
    `).all()
    
    for (const mentor of mentors) {
      // Get research areas
      const researchAreas = db.prepare(`
        SELECT area FROM mentor_research_areas WHERE mentor_id = ?
      `).all(mentor.id).map(r => r.area)
      
      // Get qualifications
      const qualifications = db.prepare(`
        SELECT qualification FROM mentor_qualifications WHERE mentor_id = ?
      `).all(mentor.id).map(q => q.qualification)
      
      const tags = ['mentor', 'researcher', 'content-producer']
      if (researchAreas.includes('interpretability')) tags.push('mechanistic-interpretability')
      if (researchAreas.includes('alignment')) tags.push('alignment')
      if (researchAreas.includes('governance')) tags.push('governance')
      
      insertEntity.run(
        mentor.id,
        mentor.name,
        'individual',
        'collaboration',
        mentor.biography || 'AI Safety Researcher',
        mentor.website,
        null,
        JSON.stringify(tags),
        JSON.stringify({
          affiliation: mentor.org_name,
          researchAreas: researchAreas,
          qualifications: qualifications,
          cbaiMentor: true,
          acceptingStudents: true,
          email: mentor.email
        }),
        mentor.quick_eval_rating ? `CBAI Rating: ${mentor.quick_eval_rating}${mentor.quick_eval_notes ? ' - ' + mentor.quick_eval_notes : ''}` : null,
        false,
        mentor.is_active
      )
      
      // Create employment relationship if org exists
      if (mentor.org_id) {
        insertRelationship.run(
          mentor.id,
          mentor.org_id,
          'employed-by',
          JSON.stringify({ role: 'Researcher' })
        )
      }
      
      console.log(`  ✅ ${mentor.name}`)
    }
    
    // 5. Migrate community profiles
    console.log('\n🌟 Migrating community profiles...')
    const profiles = db.prepare('SELECT * FROM community_profiles').all()
    
    for (const profile of profiles) {
      if (profile.id === 'anthropic') {
        // Organization - but likely already exists from orgs table
        insertEntity.run(
          profile.id,
          profile.name,
          'organization',
          'employment',
          profile.overview,
          profile.website,
          'San Francisco, CA',
          JSON.stringify(['ai-safety-company', 'research-lab', 'employer', 'content-producer']),
          JSON.stringify({
            organizationType: 'company',
            contributions: profile.contributions ? JSON.parse(profile.contributions) : {},
            assessment: profile.assessment ? JSON.parse(profile.assessment) : {}
          }),
          profile.personal_note,
          true, // featured
          true
        )
      } else {
        // Individuals
        const tags = ['researcher', 'content-producer', 'thought-leader']
        
        // Special cases
        if (profile.id === 'neel-nanda') tags.push('mentor', 'mechanistic-interpretability')
        if (profile.id === 'paul-christiano' || profile.id === 'eliezer-yudkowsky') tags.push('founder')
        
        // Extract org from role if present
        let affiliation = null
        let role = profile.role
        if (role.includes(' at ')) {
          const parts = role.split(' at ')
          role = parts[0]
          affiliation = parts[1]
        } else if (role.includes('Founder of ')) {
          affiliation = role.replace('Founder of ', '')
        }
        
        insertEntity.run(
          profile.id,
          profile.name,
          'individual',
          'collaboration',
          profile.overview,
          profile.website,
          null,
          JSON.stringify(tags),
          JSON.stringify({
            role: role,
            affiliation: affiliation,
            contributions: profile.contributions ? JSON.parse(profile.contributions) : {},
            assessment: profile.assessment ? JSON.parse(profile.assessment) : {},
            criticalQuestions: profile.critical_questions ? JSON.parse(profile.critical_questions) : [],
            alternativePerspectives: profile.alternative_perspectives ? JSON.parse(profile.alternative_perspectives) : [],
            resources: profile.resources ? JSON.parse(profile.resources) : []
          }),
          profile.personal_note,
          true, // featured
          true
        )
        
        // Create founder relationships
        if (profile.id === 'paul-christiano') {
          insertRelationship.run(profile.id, 'arc', 'founder-of', null)
        } else if (profile.id === 'eliezer-yudkowsky') {
          insertRelationship.run(profile.id, 'miri', 'founder-of', null)
        }
        
        console.log(`  ✅ ${profile.name}`)
      }
    }
    
    // 6. Add hardcoded communities from the page
    console.log('\n🌐 Adding platform and community entities...')
    const platforms = [
      {
        id: 'lesswrong',
        name: 'LessWrong',
        base_type: 'platform',
        engagement_model: 'contribution',
        description: 'Community blog focused on rationality, AI safety, and effective reasoning',
        website: 'https://www.lesswrong.com',
        tags: ['forum', 'rationality', 'ai-safety', 'open-access', 'content-aggregator']
      },
      {
        id: 'alignment-forum',
        name: 'Alignment Forum',
        base_type: 'platform',
        engagement_model: 'contribution',
        description: 'Dedicated forum for technical AI alignment research and discussion',
        website: 'https://www.alignmentforum.org',
        tags: ['forum', 'technical-research', 'alignment', 'content-aggregator']
      },
      {
        id: 'ea-forum',
        name: 'EA Forum',
        base_type: 'platform',
        engagement_model: 'contribution',
        description: 'Effective Altruism community forum with significant AI safety discussion',
        website: 'https://forum.effectivealtruism.org',
        tags: ['forum', 'effective-altruism', 'ai-safety', 'career-advice', 'open-access']
      }
    ]
    
    for (const platform of platforms) {
      insertEntity.run(
        platform.id,
        platform.name,
        platform.base_type,
        platform.engagement_model,
        platform.description,
        platform.website,
        null,
        JSON.stringify(platform.tags),
        JSON.stringify({ platformType: 'forum' }),
        null,
        false,
        true
      )
      console.log(`  ✅ ${platform.name}`)
    }
    
    // Add some missing key organizations
    const missingOrgs = [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'AI research company focused on ensuring artificial general intelligence benefits humanity',
        website: 'https://openai.com',
        location: 'San Francisco, CA',
        tags: ['research-lab', 'ai-company', 'employer', 'content-producer']
      },
      {
        id: 'deepmind',
        name: 'DeepMind',
        description: 'AI research lab building general-purpose AI systems with safety considerations',
        website: 'https://deepmind.com',
        location: 'London, UK',
        tags: ['research-lab', 'ai-company', 'employer', 'content-producer']
      },
      {
        id: 'arc',
        name: 'Alignment Research Center',
        description: 'Research organization focused on understanding and aligning advanced AI systems',
        website: 'https://alignment.org',
        tags: ['research-lab', 'non-profit', 'alignment', 'content-producer']
      },
      {
        id: 'miri',
        name: 'Machine Intelligence Research Institute',
        description: 'Research institute focused on ensuring smarter-than-human AI has a positive impact',
        website: 'https://intelligence.org',
        location: 'Berkeley, CA',
        tags: ['research-lab', 'non-profit', 'alignment', 'content-producer']
      }
    ]
    
    for (const org of missingOrgs) {
      insertEntity.run(
        org.id,
        org.name,
        'organization',
        'employment',
        org.description,
        org.website,
        org.location || null,
        JSON.stringify(org.tags),
        JSON.stringify({ organizationType: 'research-lab' }),
        null,
        true, // featured
        true
      )
      console.log(`  ✅ ${org.name}`)
    }
    
    // Commit transaction
    db.prepare('COMMIT').run()
    
    // Summary
    const entityCount = db.prepare('SELECT COUNT(*) as count FROM entities').get().count
    const relationshipCount = db.prepare('SELECT COUNT(*) as count FROM entity_relationships').get().count
    
    console.log('\n✅ Migration complete!')
    console.log(`   - ${entityCount} entities created`)
    console.log(`   - ${relationshipCount} relationships created`)
    console.log('\n📋 Next steps:')
    console.log('   1. Update /resources/communities to use the entities API')
    console.log('   2. Create detail pages for different entity types')
    console.log('   3. Consider dropping obsolete tables: mentors, organizations, community_profiles')
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the migration
migrateToUnifiedEntities()