import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'journey.db');

async function cleanupOldMentorTables() {
  const db = new Database(DB_PATH);
  
  try {
    console.log('🧹 Starting cleanup of old mentor tables...\n');

    // Step 1: Verify migration is complete
    console.log('📊 Verifying migration completeness...');
    
    const checks = {
      mentorCount: db.prepare('SELECT COUNT(*) as count FROM mentors').get().count,
      entityResearcherCount: db.prepare("SELECT COUNT(*) as count FROM entities WHERE type = 'researcher'").get().count,
      mentorTopicsCount: db.prepare('SELECT COUNT(*) as count FROM mentor_topics').get().count,
      entityTopicsFromMentors: db.prepare(`
        SELECT COUNT(*) as count 
        FROM entity_topics et 
        JOIN entities e ON et.entity_id = e.id 
        WHERE e.type = 'researcher' AND et.relationship_type = 'mentors-on'
      `).get().count,
    };

    console.log(`- Mentors in old table: ${checks.mentorCount}`);
    console.log(`- Researchers in entities: ${checks.entityResearcherCount}`);
    console.log(`- Mentor topics: ${checks.mentorTopicsCount}`);
    console.log(`- Entity topics from mentors: ${checks.entityTopicsFromMentors}`);

    // Check if all mentors are migrated
    const unmigrated = db.prepare(`
      SELECT id, name FROM mentors 
      WHERE id NOT IN (SELECT id FROM entities WHERE type = 'researcher')
    `).all();

    if (unmigrated.length > 0) {
      console.log('\n❌ Cannot proceed - found unmigrated mentors:');
      unmigrated.forEach(m => console.log(`  - ${m.id}: ${m.name}`));
      console.log('\nRun the migration script first: npx tsx scripts/complete-entity-migration.ts');
      process.exit(1);
    }

    console.log('\n✅ All mentors have been migrated to entities');

    // Step 2: Check for references to old tables
    console.log('\n🔍 Checking for references to old tables...');
    
    // Check for foreign key references
    const fkInfo = db.prepare("PRAGMA foreign_key_list('mentors')").all();
    const tablesReferencingMentors = db.prepare(`
      SELECT DISTINCT m.name as table_name 
      FROM sqlite_master m 
      WHERE m.sql LIKE '%REFERENCES mentors%' 
        AND m.type = 'table'
        AND m.name NOT IN ('mentors', 'mentor_topics')
    `).all();

    if (tablesReferencingMentors.length > 0) {
      console.log('⚠️  Found tables still referencing mentors:');
      tablesReferencingMentors.forEach(t => console.log(`  - ${t.table_name}`));
    }

    // Step 3: Create backup
    const backupPath = path.join(process.cwd(), `journey.db.backup-mentor-tables-${Date.now()}`);
    console.log(`\n💾 Creating backup at: ${backupPath}`);
    fs.copyFileSync(DB_PATH, backupPath);
    console.log('✅ Backup created');

    // Step 4: Show what will be deleted
    console.log('\n📋 Tables to be removed:');
    const tablesToRemove = [
      'mentors',
      'mentor_research_topics', 
      'mentor_research_areas',
      'mentor_qualifications'
    ];

    for (const table of tablesToRemove) {
      const exists = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type = 'table' AND name = ?
      `).get(table);
      
      if (exists) {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
        console.log(`  - ${table}: ${count} records`);
      }
    }

    // Step 5: Ask for confirmation
    console.log('\n⚠️  WARNING: This will permanently delete the old mentor tables!');
    console.log('The data has been migrated to the entities system.');
    console.log('A backup has been created at:', backupPath);
    console.log('\nTo proceed with deletion, run this script with --confirm flag');
    console.log('Example: npx tsx scripts/cleanup-old-mentor-tables.ts --confirm');

    if (!process.argv.includes('--confirm')) {
      console.log('\n❌ Cleanup cancelled - no changes made');
      process.exit(0);
    }

    // Step 6: Drop the tables
    console.log('\n🗑️  Dropping old tables...');
    
    db.pragma('foreign_keys = OFF');
    
    for (const table of tablesToRemove) {
      try {
        db.exec(`DROP TABLE IF EXISTS ${table}`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.error(`❌ Error dropping ${table}:`, error.message);
      }
    }

    // Also drop any indexes
    const indexes = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type = 'index' 
        AND (name LIKE 'idx_mentor%' OR tbl_name IN (${tablesToRemove.map(() => '?').join(',')}))
    `).all(...tablesToRemove);

    for (const index of indexes) {
      try {
        db.exec(`DROP INDEX IF EXISTS ${index.name}`);
        console.log(`✅ Dropped index: ${index.name}`);
      } catch (error) {
        console.error(`❌ Error dropping index ${index.name}:`, error.message);
      }
    }

    // Drop the view
    db.exec(`DROP VIEW IF EXISTS v_mentor_details`);
    console.log('✅ Dropped view: v_mentor_details');

    db.pragma('foreign_keys = ON');

    console.log('\n✅ Cleanup complete!');
    console.log('\n📝 Summary:');
    console.log('- All mentor data has been migrated to the entities system');
    console.log('- Old mentor tables have been removed');
    console.log('- Backup saved at:', backupPath);
    console.log('\n🎉 The entity migration is now complete!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the cleanup
cleanupOldMentorTables()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });