import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

function migrateCommunityProfiles() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    console.log('🚀 Migrating community profiles to entities table...\n')
    
    // Start transaction
    db.prepare('BEGIN').run()
    
    // Get existing community profiles
    const profiles = db.prepare('SELECT * FROM community_profiles').all()
    console.log(`Found ${profiles.length} community profiles to migrate`)
    
    const insertEntity = db.prepare(`
      INSERT OR REPLACE INTO entities (
        id, name, type, description, tags, properties, personal_note, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    let migrated = 0
    
    for (const profile of profiles) {
      // Determine entity type based on the profile
      let entityType = 'researcher' // Default
      if (profile.id === 'anthropic') {
        entityType = 'organization'
      }
      
      // Parse tags if they exist
      let tags = ['ai-safety']
      if (profile.tags) {
        try {
          const parsedTags = JSON.parse(profile.tags)
          tags = [...tags, ...parsedTags]
        } catch (e) {
          console.warn(`Could not parse tags for ${profile.name}`)
        }
      }
      
      // Build properties object
      const properties: any = {
        website: profile.website
      }
      
      // Add researcher-specific properties
      if (entityType === 'researcher') {
        properties.offersmentorship = false // These are prominent figures, not CBAI mentors
        properties.conductResearch = true
        
        // Try to parse nuanced_view and extract useful info
        if (profile.nuanced_view) {
          try {
            const view = JSON.parse(profile.nuanced_view)
            if (view.strengths) properties.strengths = view.strengths
            if (view.concerns) properties.concerns = view.concerns
          } catch (e) {
            // Not JSON, store as is
            properties.nuancedView = profile.nuanced_view
          }
        }
      }
      
      // Add organization-specific properties
      if (entityType === 'organization') {
        properties.organizationType = 'ai-safety-company'
        properties.hasOpenPositions = true
        properties.conductResearch = true
      }
      
      // Include contributions if available
      if (profile.contributions) {
        try {
          properties.contributions = JSON.parse(profile.contributions)
        } catch (e) {
          properties.contributions = profile.contributions
        }
      }
      
      insertEntity.run(
        profile.id,
        profile.name,
        entityType,
        profile.objective_description || profile.description,
        JSON.stringify(tags),
        JSON.stringify(properties),
        profile.personal_view || null,
        1 // active
      )
      
      console.log(`  ✅ Migrated ${profile.name} as ${entityType}`)
      migrated++
    }
    
    // Commit transaction
    db.prepare('COMMIT').run()
    console.log(`\n✅ Successfully migrated ${migrated} community profiles!`)
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Error:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the migration
try {
  migrateCommunityProfiles()
} catch (error) {
  console.error('❌ Migration failed:', error)
  process.exit(1)
}