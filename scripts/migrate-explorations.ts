import Database from 'better-sqlite3';
import path from 'path';
import { getAllExplorations, getExploration } from '../lib/explorations';

const DB_PATH = path.join(process.cwd(), 'journey.db');

async function migrateExplorations() {
  const db = new Database(DB_PATH);
  
  try {
    // Create explorations table
    db.exec(`
      CREATE TABLE IF NOT EXISTS explorations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        related_topic TEXT,
        key_questions JSON,
        reading_time TEXT NOT NULL,
        last_updated DATE,
        tags JSON,
        discussion_prompts JSON,
        related_resources JSON,
        next_exploration TEXT,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Created explorations table');

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_explorations_related_topic ON explorations(related_topic);
      CREATE INDEX IF NOT EXISTS idx_explorations_last_updated ON explorations(last_updated);
    `);

    console.log('✅ Created indexes');

    // Prepare insert statement
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO explorations (
        id, title, description, related_topic, key_questions,
        reading_time, last_updated, tags, discussion_prompts,
        related_resources, next_exploration, content
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    // Get all explorations
    const allExplorations = await getAllExplorations();
    
    // Migrate each exploration
    let count = 0;
    for (const metadata of allExplorations) {
      const exploration = await getExploration(metadata.id);
      if (!exploration) continue;
      
      insertStmt.run(
        metadata.id,
        metadata.title,
        metadata.description,
        metadata.relatedTopic || null,
        JSON.stringify(metadata.keyQuestions || []),
        metadata.readingTime,
        metadata.lastUpdated,
        JSON.stringify(metadata.tags),
        JSON.stringify(metadata.discussionPrompts || []),
        JSON.stringify(metadata.relatedResources || []),
        metadata.nextExploration || null,
        exploration.content
      );
      
      count++;
      console.log(`✅ Migrated exploration: ${metadata.title}`);
    }

    console.log(`\n✅ Successfully migrated ${count} explorations`);

    // Verify migration
    const verifyStmt = db.prepare('SELECT COUNT(*) as count FROM explorations');
    const result = verifyStmt.get() as { count: number };
    console.log(`✅ Verified: ${result.count} explorations in database`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run migration
migrateExplorations()
  .then(() => {
    console.log('\n✅ Explorations migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Explorations migration failed:', error);
    process.exit(1);
  });