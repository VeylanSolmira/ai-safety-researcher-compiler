import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

function completeEntitiesConsolidation() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    console.log('🚀 Completing entities consolidation...\n')
    
    // Start transaction
    db.prepare('BEGIN').run()
    
    // Step 1: Check for Anthropic duplicate
    const anthropicInEntities = db.prepare('SELECT id FROM entities WHERE id = ?').get('anthropic')
    
    // Step 2: Migrate community_profiles to entities
    console.log('📦 Migrating community_profiles to entities...')
    const profiles = db.prepare('SELECT * FROM community_profiles').all()
    
    const insertEntity = db.prepare(`
      INSERT OR REPLACE INTO entities (
        id, name, type, description, tags, properties, personal_note, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    for (const profile of profiles) {
      // Skip Anthropic if already exists
      if (profile.id === 'anthropic' && anthropicInEntities) {
        console.log(`  ⏭️  Skipping Anthropic (already exists)`)
        continue
      }
      
      // Determine type
      const entityType = profile.id === 'anthropic' ? 'organization' : 'researcher'
      
      // Parse tags
      let tags = ['ai-safety']
      try {
        if (profile.tags) {
          const parsed = JSON.parse(profile.tags)
          tags = [...tags, ...parsed]
        }
      } catch (e) {}
      
      // Build properties
      const properties: any = {
        website: profile.website || null
      }
      
      if (entityType === 'researcher') {
        properties.role = profile.role
        properties.prominentFigure = true
        properties.conductResearch = true
      }
      
      // Get description - use objective_description or role
      const description = profile.objective_description || 
                         profile.role || 
                         `${profile.name} - AI Safety ${entityType}`
      
      insertEntity.run(
        profile.id,
        profile.name,
        entityType,
        description,
        JSON.stringify(tags),
        JSON.stringify(properties),
        profile.personal_view || null,
        1
      )
      
      console.log(`  ✅ Migrated ${profile.name} as ${entityType}`)
    }
    
    // Step 3: Add true platform entities that aren't in DB yet
    console.log('\n🌐 Adding platform entities...')
    const platforms = [
      {
        id: 'lesswrong',
        name: 'LessWrong',
        description: 'Community blog and forum focused on rationality and AI safety',
        tags: ['rationality', 'ai-safety', 'community', 'blog'],
        properties: {
          website: 'https://www.lesswrong.com',
          platformType: 'forum',
          hasOnlineCommunity: true
        }
      },
      {
        id: 'alignment-forum',
        name: 'Alignment Forum',
        description: 'Specialized forum for technical AI alignment research',
        tags: ['ai-alignment', 'research', 'technical', 'forum'],
        properties: {
          website: 'https://www.alignmentforum.org',
          platformType: 'forum',
          hasOnlineCommunity: true,
          researchFocused: true
        }
      },
      {
        id: 'ea-forum',
        name: 'EA Forum',
        description: 'Effective Altruism community forum with significant AI safety content',
        tags: ['effective-altruism', 'ai-safety', 'community', 'career-advice'],
        properties: {
          website: 'https://forum.effectivealtruism.org',
          platformType: 'forum',
          hasOnlineCommunity: true
        }
      }
    ]
    
    for (const platform of platforms) {
      // Check if already exists
      const exists = db.prepare('SELECT id FROM entities WHERE id = ?').get(platform.id)
      if (!exists) {
        insertEntity.run(
          platform.id,
          platform.name,
          'platform',
          platform.description,
          JSON.stringify(platform.tags),
          JSON.stringify(platform.properties),
          null,
          1
        )
        console.log(`  ✅ Added platform: ${platform.name}`)
      } else {
        console.log(`  ⏭️  Skipping ${platform.name} (already exists)`)
      }
    }
    
    // Step 4: Check final counts
    console.log('\n📊 Final entity counts:')
    const counts = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM entities 
      GROUP BY type 
      ORDER BY type
    `).all()
    
    for (const row of counts) {
      console.log(`  - ${row.type}: ${row.count}`)
    }
    
    // Commit transaction
    db.prepare('COMMIT').run()
    console.log('\n✅ Consolidation complete!')
    
    // Step 5: Note about cleanup
    console.log('\n🧹 Next steps:')
    console.log('  1. Drop community_profiles table: DROP TABLE community_profiles;')
    console.log('  2. Remove/deprecate lib/community-profiles.ts')
    console.log('  3. Update all code to use entities table')
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Error:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the consolidation
try {
  completeEntitiesConsolidation()
} catch (error) {
  console.error('❌ Consolidation failed:', error)
  process.exit(1)
}