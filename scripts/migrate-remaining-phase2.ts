import Database from 'better-sqlite3';
import path from 'path';
import { profiles } from '../lib/community-profiles';
import { courseHighlights } from '../lib/course-highlights';
import { externalResources } from '../lib/external-resources';
import { sectionPrompts } from '../lib/prompts';

const DB_PATH = path.join(process.cwd(), 'journey.db');

async function migrateRemainingPhase2() {
  const db = new Database(DB_PATH);
  
  try {
    // 1. Create community_profiles table
    db.exec(`
      CREATE TABLE IF NOT EXISTS community_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        website TEXT,
        tags JSON,
        personal_note TEXT,
        overview TEXT NOT NULL,
        contributions JSON,
        assessment JSON,
        critical_questions JSON,
        alternative_perspectives JSON,
        resources JSON,
        disclaimer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created community_profiles table');

    // 2. Create course_highlights table
    db.exec(`
      CREATE TABLE IF NOT EXISTS course_highlights (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT CHECK(type IN ('case-study', 'experiment', 'exploration', 'topic')),
        content_id TEXT NOT NULL,
        tier_id TEXT,
        topics JSON,
        tags JSON,
        navigation_path TEXT,
        order_index INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created course_highlights table');

    // 3. Create external_resources table
    db.exec(`
      CREATE TABLE IF NOT EXISTS external_resources (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        url TEXT NOT NULL,
        description TEXT,
        metadata JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created external_resources table');

    // 4. Create ai_prompts table
    db.exec(`
      CREATE TABLE IF NOT EXISTS ai_prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        mode TEXT NOT NULL,
        type TEXT CHECK(type IN ('teacher', 'adversary')),
        prompt_template TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(section, mode, type)
      );
    `);
    console.log('✅ Created ai_prompts table');

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_community_profiles_role ON community_profiles(role);
      CREATE INDEX IF NOT EXISTS idx_course_highlights_type ON course_highlights(type);
      CREATE INDEX IF NOT EXISTS idx_course_highlights_tier ON course_highlights(tier_id);
      CREATE INDEX IF NOT EXISTS idx_external_resources_type ON external_resources(type);
      CREATE INDEX IF NOT EXISTS idx_ai_prompts_section ON ai_prompts(section);
    `);
    console.log('✅ Created indexes');

    // Migrate Community Profiles
    const profileStmt = db.prepare(`
      INSERT OR REPLACE INTO community_profiles (
        id, name, role, website, tags, personal_note, overview,
        contributions, assessment, critical_questions,
        alternative_perspectives, resources, disclaimer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let profileCount = 0;
    for (const [id, profile] of Object.entries(profiles)) {
      profileStmt.run(
        profile.id,
        profile.name,
        profile.role,
        profile.website || null,
        JSON.stringify(profile.tags || []),
        profile.personalNote || null,
        profile.overview,
        JSON.stringify(profile.contributions || {}),
        JSON.stringify(profile.assessment || {}),
        JSON.stringify(profile.criticalQuestions || []),
        JSON.stringify(profile.alternativePerspectives || []),
        JSON.stringify(profile.resources || []),
        profile.disclaimer || null
      );
      profileCount++;
      console.log(`✅ Migrated profile: ${profile.name}`);
    }

    // Migrate Course Highlights
    const highlightStmt = db.prepare(`
      INSERT OR REPLACE INTO course_highlights (
        id, title, description, type, content_id, tier_id,
        topics, tags, navigation_path, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let highlightCount = 0;
    courseHighlights.forEach((highlight, index) => {
      highlightStmt.run(
        highlight.id,
        highlight.title,
        highlight.description,
        highlight.type,
        highlight.id, // Use ID as content_id for now
        highlight.tier || null,
        JSON.stringify(highlight.topics || []),
        JSON.stringify(highlight.tags || []),
        highlight.path || null,
        index
      );
      highlightCount++;
      console.log(`✅ Migrated highlight: ${highlight.title}`);
    });

    // Migrate External Resources
    const resourceStmt = db.prepare(`
      INSERT OR REPLACE INTO external_resources (
        id, name, type, url, description, metadata
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    let resourceCount = 0;
    
    // Handle notebook URLs
    if (externalResources.notebookUrls) {
      for (const [id, data] of Object.entries(externalResources.notebookUrls)) {
        resourceStmt.run(
          `notebook-${id}`,
          data.title || id,
          'notebook',
          data.url,
          data.description || null,
          JSON.stringify({ platform: data.platform || 'colab' })
        );
        resourceCount++;
      }
    }

    // Handle other resources (there might be more types)
    if (externalResources.aiTutor) {
      resourceStmt.run(
        'ai-tutor-config',
        'AI Tutor Configuration',
        'config',
        'internal',
        'Configuration for AI tutor functionality',
        JSON.stringify(externalResources.aiTutor)
      );
      resourceCount++;
    }

    console.log(`✅ Migrated ${resourceCount} external resources`);

    // Migrate Prompts
    const promptStmt = db.prepare(`
      INSERT OR REPLACE INTO ai_prompts (
        section, mode, type, prompt_template
      ) VALUES (?, ?, ?, ?)
    `);

    let promptCount = 0;
    
    // Iterate through sections
    for (const [section, promptData] of Object.entries(sectionPrompts)) {
      if (promptData && typeof promptData === 'object') {
        // Handle teacher prompts
        if (promptData.teacher) {
          if (promptData.teacher.academic) {
            promptStmt.run(section, 'academic', 'teacher', promptData.teacher.academic);
            promptCount++;
            console.log(`✅ Migrated prompt: ${section}/academic/teacher`);
          }
          if (promptData.teacher.personal) {
            promptStmt.run(section, 'personal', 'teacher', promptData.teacher.personal);
            promptCount++;
            console.log(`✅ Migrated prompt: ${section}/personal/teacher`);
          }
        }
        
        // Handle adversary prompts
        if (promptData.adversary) {
          if (promptData.adversary.academic) {
            promptStmt.run(section, 'academic', 'adversary', promptData.adversary.academic);
            promptCount++;
            console.log(`✅ Migrated prompt: ${section}/academic/adversary`);
          }
          if (promptData.adversary.personal) {
            promptStmt.run(section, 'personal', 'adversary', promptData.adversary.personal);
            promptCount++;
            console.log(`✅ Migrated prompt: ${section}/personal/adversary`);
          }
        }
      }
    }

    console.log(`\n✅ Migration Summary:`);
    console.log(`   - Community Profiles: ${profileCount} migrated`);
    console.log(`   - Course Highlights: ${highlightCount} migrated`);
    console.log(`   - External Resources: ${resourceCount} migrated`);
    console.log(`   - AI Prompts: ${promptCount} migrated`);

    // Verify migration
    const verifyProfiles = db.prepare('SELECT COUNT(*) as count FROM community_profiles').get() as { count: number };
    const verifyHighlights = db.prepare('SELECT COUNT(*) as count FROM course_highlights').get() as { count: number };
    const verifyResources = db.prepare('SELECT COUNT(*) as count FROM external_resources').get() as { count: number };
    const verifyPrompts = db.prepare('SELECT COUNT(*) as count FROM ai_prompts').get() as { count: number };
    
    console.log(`\n✅ Verification:`);
    console.log(`   - Community Profiles in DB: ${verifyProfiles.count}`);
    console.log(`   - Course Highlights in DB: ${verifyHighlights.count}`);
    console.log(`   - External Resources in DB: ${verifyResources.count}`);
    console.log(`   - AI Prompts in DB: ${verifyPrompts.count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run migration
migrateRemainingPhase2()
  .then(() => {
    console.log('\n✅ Phase 2 migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Phase 2 migration failed:', error);
    process.exit(1);
  });