import Database from 'better-sqlite3';
import path from 'path';
import { getAllExperiments, getExperiment } from '../lib/experiments';

const DB_PATH = path.join(process.cwd(), 'journey.db');

async function migrateExperiments() {
  const db = new Database(DB_PATH);
  
  try {
    // Create experiments table
    db.exec(`
      CREATE TABLE IF NOT EXISTS experiments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        related_topic TEXT,
        prerequisites JSON,
        estimated_time TEXT NOT NULL,
        difficulty TEXT CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
        tags JSON,
        notebook_url TEXT,
        github_url TEXT,
        next_experiment TEXT,
        content_introduction TEXT NOT NULL,
        content_key_concepts JSON,
        content_exercises JSON,
        content_reflection_questions JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Created experiments table');

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_experiments_difficulty ON experiments(difficulty);
      CREATE INDEX IF NOT EXISTS idx_experiments_related_topic ON experiments(related_topic);
    `);

    console.log('✅ Created indexes');

    // Prepare insert statement
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO experiments (
        id, title, description, related_topic, prerequisites, estimated_time,
        difficulty, tags, notebook_url, github_url, next_experiment,
        content_introduction, content_key_concepts, content_exercises,
        content_reflection_questions
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    // Get all experiments
    const allExperiments = await getAllExperiments();
    
    // Migrate each experiment
    let count = 0;
    for (const metadata of allExperiments) {
      const experiment = await getExperiment(metadata.id);
      if (!experiment) continue;
      
      const { content } = experiment;
      
      insertStmt.run(
        metadata.id,
        metadata.title,
        metadata.description,
        metadata.relatedTopic || null,
        JSON.stringify(metadata.prerequisites || []),
        metadata.estimatedTime,
        metadata.difficulty,
        JSON.stringify(metadata.tags),
        metadata.notebookUrl || null,
        metadata.githubUrl || null,
        metadata.nextExperiment || null,
        content.introduction,
        JSON.stringify(content.keyConcepts || []),
        JSON.stringify(content.exercises || []),
        JSON.stringify(content.reflectionQuestions || [])
      );
      
      count++;
      console.log(`✅ Migrated experiment: ${metadata.title}`);
    }

    console.log(`\n✅ Successfully migrated ${count} experiments`);

    // Verify migration
    const verifyStmt = db.prepare('SELECT COUNT(*) as count FROM experiments');
    const result = verifyStmt.get() as { count: number };
    console.log(`✅ Verified: ${result.count} experiments in database`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run migration
migrateExperiments()
  .then(() => {
    console.log('\n✅ Experiments migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Experiments migration failed:', error);
    process.exit(1);
  });