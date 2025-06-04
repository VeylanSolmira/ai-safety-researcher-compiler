import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'journey.db');

async function completeEntityMigration() {
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = OFF'); // Temporarily disable to avoid issues
  
  try {
    console.log('Starting final entity migration cleanup...\n');

    // Step 1: Check migration status
    const stats = {
      mentorsTable: db.prepare('SELECT COUNT(*) as count FROM mentors').get().count,
      entitiesResearchers: db.prepare("SELECT COUNT(*) as count FROM entities WHERE type = 'researcher'").get().count,
      mentorTopics: db.prepare('SELECT COUNT(*) as count FROM mentor_topics').get().count,
      entityTopics: db.prepare('SELECT COUNT(*) as count FROM entity_topics').get().count,
      mentorResearchTopics: db.prepare('SELECT COUNT(*) as count FROM mentor_research_topics').get().count,
    };

    console.log('Current status:');
    console.log(`- Mentors table: ${stats.mentorsTable} records`);
    console.log(`- Entities (researchers): ${stats.entitiesResearchers} records`);
    console.log(`- Mentor topics: ${stats.mentorTopics} records`);
    console.log(`- Entity topics: ${stats.entityTopics} records`);
    console.log(`- Mentor research topics: ${stats.mentorResearchTopics} records\n`);

    // Step 2: Migrate any remaining mentors not in entities
    const unmigrated = db.prepare(`
      SELECT id FROM mentors WHERE id NOT IN (SELECT id FROM entities WHERE type = 'researcher')
    `).all();

    if (unmigrated.length > 0) {
      console.log(`Found ${unmigrated.length} unmigrated mentors. Migrating...`);
      
      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO entities (id, name, type, description, tags, properties, active)
        SELECT 
          id,
          name,
          'researcher' as type,
          COALESCE(biography, 'CBAI 2025 Fellowship mentor') as description,
          json_array('cbai-mentor', 'ai-safety') as tags,
          json_object(
            'website', website,
            'email', email,
            'offersmentorship', true,
            'organization', organization_id,
            'quickEvalRating', quick_eval_rating,
            'quickEvalNotes', quick_eval_notes
          ) as properties,
          is_active as active
        FROM mentors
        WHERE id = ?
      `);

      for (const mentor of unmigrated) {
        insertStmt.run(mentor.id);
      }
      console.log(`✅ Migrated ${unmigrated.length} mentors to entities\n`);
    }

    // Step 3: Migrate mentor_topics to entity_topics (ensure all are migrated)
    console.log('Ensuring all mentor_topics are in entity_topics...');
    db.exec(`
      INSERT OR IGNORE INTO entity_topics (entity_id, topic_id, description, relationship_type, context)
      SELECT 
        mentor_id as entity_id,
        topic_id,
        mentor_topic_description as description,
        'mentors-on' as relationship_type,
        context
      FROM mentor_topics
      WHERE EXISTS (SELECT 1 FROM entities WHERE id = mentor_id)
    `);

    // Step 4: Create views for backward compatibility
    console.log('Creating backward compatibility views...');
    
    // Drop existing views if they exist
    db.exec(`DROP VIEW IF EXISTS v_mentors_from_entities`);
    
    // Create view that makes entities look like mentors table
    db.exec(`
      CREATE VIEW v_mentors_from_entities AS
      SELECT 
        e.id,
        e.name,
        json_extract(e.properties, '$.organization') as organization_id,
        e.description as biography,
        json_extract(e.properties, '$.email') as email,
        json_extract(e.properties, '$.website') as website,
        json_extract(e.properties, '$.quickEvalRating') as quick_eval_rating,
        json_extract(e.properties, '$.quickEvalNotes') as quick_eval_notes,
        e.active as is_active,
        e.created_at,
        e.updated_at
      FROM entities e
      WHERE e.type = 'researcher'
    `);

    // Step 5: Update organization references
    console.log('Checking organization references...');
    const orgCheck = db.prepare(`
      SELECT COUNT(*) as count 
      FROM entities e1 
      WHERE e1.type = 'researcher' 
        AND json_extract(e1.properties, '$.organization') IS NOT NULL
        AND json_extract(e1.properties, '$.organization') NOT IN (
          SELECT id FROM entities WHERE type = 'organization'
        )
    `).get();

    if (orgCheck.count > 0) {
      console.log(`⚠️  Found ${orgCheck.count} researchers with invalid organization references`);
    }

    // Step 6: Create migration report
    const finalStats = {
      totalEntities: db.prepare('SELECT COUNT(*) as count FROM entities').get().count,
      researchers: db.prepare("SELECT COUNT(*) as count FROM entities WHERE type = 'researcher'").get().count,
      organizations: db.prepare("SELECT COUNT(*) as count FROM entities WHERE type = 'organization'").get().count,
      platforms: db.prepare("SELECT COUNT(*) as count FROM entities WHERE type = 'platform'").get().count,
      entityTopics: db.prepare('SELECT COUNT(*) as count FROM entity_topics').get().count,
    };

    console.log('\n✅ Migration Complete!');
    console.log('\nFinal statistics:');
    console.log(`- Total entities: ${finalStats.totalEntities}`);
    console.log(`  - Researchers: ${finalStats.researchers}`);
    console.log(`  - Organizations: ${finalStats.organizations}`);
    console.log(`  - Platforms: ${finalStats.platforms}`);
    console.log(`- Entity-topic relationships: ${finalStats.entityTopics}`);

    // Step 7: Recommendations
    console.log('\n📋 Next steps:');
    console.log('1. Update all API routes to use entities/entity_topics instead of mentors/mentor_topics');
    console.log('2. Test all mentor-related functionality');
    console.log('3. Once verified, remove old tables: mentors, mentor_research_topics, mentor_research_areas, mentor_qualifications');
    console.log('4. Update UI components to use the new entity structure');

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the migration
completeEntityMigration()
  .then(() => {
    console.log('\n✅ Entity migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });