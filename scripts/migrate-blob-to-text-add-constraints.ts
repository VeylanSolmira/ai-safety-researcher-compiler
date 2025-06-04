import Database from 'better-sqlite3';
import path from 'path';

async function migrateBlobToTextAndAddConstraints() {
  console.log('Starting BLOB to TEXT migration and adding constraints...\n');

  // Create direct database connection for migration
  const dbPath = path.join(process.cwd(), 'journey.db');
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  try {
    // Step 1: Check how many topics have BLOB content
    console.log('Step 1: Checking for BLOB content in topics...');
    
    const blobCheckQuery = `
      SELECT 
        id,
        title,
        CASE 
          WHEN typeof(content_academic) = 'blob' THEN 'BLOB'
          ELSE typeof(content_academic)
        END as academic_type,
        CASE 
          WHEN typeof(content_personal) = 'blob' THEN 'BLOB'
          ELSE typeof(content_personal)
        END as personal_type,
        LENGTH(content_academic) as academic_length,
        LENGTH(content_personal) as personal_length
      FROM topics
      WHERE typeof(content_academic) = 'blob' 
         OR typeof(content_personal) = 'blob'
    `;

    const blobTopics = db.prepare(blobCheckQuery).all() as any[];
    
    if (blobTopics.length === 0) {
      console.log('✅ No BLOB content found in database. All content is already TEXT.');
    } else {
      console.log(`⚠️  Found ${blobTopics.length} topics with BLOB content:`);
      blobTopics.forEach(topic => {
        console.log(`   - ${topic.title} (ID: ${topic.id})`);
        console.log(`     Academic: ${topic.academic_type} (${topic.academic_length} bytes)`);
        console.log(`     Personal: ${topic.personal_type} (${topic.personal_length} bytes)`);
      });
    }

    // Step 2: Convert BLOB content to TEXT
    if (blobTopics.length > 0) {
      console.log('\nStep 2: Converting BLOB content to TEXT...');
      
      const updateStmt = db.prepare(`
        UPDATE topics 
        SET 
          content_academic = CAST(content_academic AS TEXT),
          content_personal = CAST(content_personal AS TEXT)
        WHERE id = ?
      `);

      const convertBlobs = db.transaction((topics: any[]) => {
        for (const topic of topics) {
          updateStmt.run(topic.id);
          console.log(`   ✅ Converted topic ${topic.id} (${topic.title})`);
        }
      });

      convertBlobs(blobTopics);
      console.log(`\n✅ Successfully converted ${blobTopics.length} topics from BLOB to TEXT`);
    }

    // Step 3: Verify conversion
    console.log('\nStep 3: Verifying conversion...');
    const verifyQuery = `
      SELECT COUNT(*) as blob_count
      FROM topics
      WHERE typeof(content_academic) = 'blob' 
         OR typeof(content_personal) = 'blob'
    `;
    
    const result = db.prepare(verifyQuery).get() as { blob_count: number };
    if (result.blob_count === 0) {
      console.log('✅ Verification successful: No BLOB content remaining');
    } else {
      console.error(`❌ Verification failed: ${result.blob_count} topics still have BLOB content`);
      process.exit(1);
    }

    // Step 4: Create a new table with proper constraints
    console.log('\nStep 4: Creating new table with TEXT constraints...');
    
    // SQLite doesn't support adding CHECK constraints to existing tables,
    // so we need to recreate the table with constraints
    
    // Disable foreign key checks temporarily
    db.pragma('foreign_keys = OFF');
    
    // Begin transaction
    db.exec('BEGIN TRANSACTION');
    
    try {
      // Clean up any previous failed attempts
      const oldTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='topics_old'").get();
      if (oldTableExists) {
        db.exec('DROP TABLE topics_old');
      }
      
      // Drop any views that depend on the topics table
      const views = db.prepare("SELECT name FROM sqlite_master WHERE type='view' AND sql LIKE '%topics%'").all() as any[];
      views.forEach((view: any) => {
        console.log(`  Dropping view: ${view.name}`);
        db.exec(`DROP VIEW IF EXISTS ${view.name}`);
      });
      
      // First, rename the existing table
      db.exec('ALTER TABLE topics RENAME TO topics_old');
    
    // Create new table with CHECK constraints
    db.exec(`
      CREATE TABLE topics (
        id TEXT PRIMARY KEY,
        module_id TEXT REFERENCES modules(id),
        title TEXT NOT NULL,
        description TEXT,
        estimated_time TEXT,
        difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced', NULL)),
        roadmap_content_id TEXT,
        content_academic TEXT CHECK(typeof(content_academic) IN ('null', 'text')),
        content_personal TEXT CHECK(typeof(content_personal) IN ('null', 'text')),
        has_journey_extras INTEGER DEFAULT 0,
        has_interactive_transition INTEGER DEFAULT 0,
        assessment_id TEXT,
        position INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
        updated_at INTEGER DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Copy data from old table to new table
    db.exec(`
      INSERT INTO topics 
      SELECT 
        id, module_id, title, description, estimated_time, difficulty,
        roadmap_content_id,
        CAST(content_academic AS TEXT) as content_academic,
        CAST(content_personal AS TEXT) as content_personal,
        has_journey_extras, has_interactive_transition, assessment_id,
        position, created_at, updated_at
      FROM topics_old
    `);
    
      // Drop the old table
      db.exec('DROP TABLE topics_old');
      
      // Commit transaction
      db.exec('COMMIT');
      
      console.log('✅ Successfully created new table with TEXT constraints');
    } catch (tableError) {
      // Rollback on error
      db.exec('ROLLBACK');
      throw tableError;
    } finally {
      // Re-enable foreign key checks
      db.pragma('foreign_keys = ON');
    }

    // Step 5: Final verification
    console.log('\nStep 5: Final verification...');
    
    // Check that constraints are in place
    const tableInfo = db.prepare("PRAGMA table_info(topics)").all();
    console.log('\nTable structure with constraints:');
    console.log(tableInfo);
    
    // Verify all content is still accessible
    const topicCount = db.prepare('SELECT COUNT(*) as count FROM topics').get() as { count: number };
    console.log(`\n✅ Migration complete! ${topicCount.count} topics in database.`);
    
    // Show a sample of migrated content
    const sampleTopics = db.prepare(`
      SELECT id, title, 
             LENGTH(content_academic) as academic_length,
             LENGTH(content_personal) as personal_length,
             typeof(content_academic) as academic_type,
             typeof(content_personal) as personal_type
      FROM topics 
      WHERE content_academic IS NOT NULL OR content_personal IS NOT NULL
      LIMIT 5
    `).all();
    
    console.log('\nSample of migrated topics:');
    sampleTopics.forEach((topic: any) => {
      console.log(`- ${topic.title}: Academic (${topic.academic_type}, ${topic.academic_length} chars), Personal (${topic.personal_type}, ${topic.personal_length} chars)`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    db.close();
    process.exit(1);
  } finally {
    // Always close the database connection
    if (db) {
      db.close();
    }
  }
}

// Run the migration
migrateBlobToTextAndAddConstraints();