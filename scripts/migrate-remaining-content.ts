import Database from 'better-sqlite3';
import path from 'path';
import { caseStudies } from '../lib/case-studies';
import { newsStories } from '../lib/news';
import { percolatingIdeas } from '../lib/ideas-lab';

const DB_PATH = path.join(process.cwd(), 'journey.db');

async function migrateRemainingContent() {
  const db = new Database(DB_PATH);
  
  try {
    // 1. Create case_studies table
    db.exec(`
      CREATE TABLE IF NOT EXISTS case_studies (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        category TEXT,
        severity TEXT,
        tags JSON,
        citations JSON,
        lessons JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created case_studies table');

    // 2. Create news table
    db.exec(`
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        date DATE NOT NULL,
        category TEXT,
        tags JSON,
        source TEXT,
        author TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created news table');

    // 3. Create ideas table
    db.exec(`
      CREATE TABLE IF NOT EXISTS ideas (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT CHECK(status IN ('raw', 'developing', 'promising', 'mature')),
        quality_rating INTEGER CHECK(quality_rating BETWEEN 1 AND 10),
        category TEXT,
        tags JSON,
        warnings JSON,
        related_questions JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created ideas table');

    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);
      CREATE INDEX IF NOT EXISTS idx_case_studies_date ON case_studies(date);
      CREATE INDEX IF NOT EXISTS idx_news_date ON news(date);
      CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
      CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
      CREATE INDEX IF NOT EXISTS idx_ideas_quality_rating ON ideas(quality_rating);
    `);
    console.log('✅ Created indexes');

    // Migrate Case Studies
    const caseStudyStmt = db.prepare(`
      INSERT OR REPLACE INTO case_studies (
        id, title, summary, content, date, category, severity,
        tags, citations, lessons
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let caseStudyCount = 0;
    
    for (const caseStudy of caseStudies) {
      caseStudyStmt.run(
        caseStudy.id,
        caseStudy.title,
        caseStudy.summary,
        caseStudy.content,
        caseStudy.date,
        caseStudy.category || null,
        caseStudy.severity || null,
        JSON.stringify(caseStudy.tags || []),
        JSON.stringify(caseStudy.citations || []),
        JSON.stringify(caseStudy.lessons || [])
      );
      
      caseStudyCount++;
      console.log(`✅ Migrated case study: ${caseStudy.title}`);
    }

    // Migrate News
    const newsStmt = db.prepare(`
      INSERT OR REPLACE INTO news (
        id, title, summary, content, date, category, tags,
        source, author
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let newsCount = 0;
    
    for (const newsItem of newsStories) {
      newsStmt.run(
        newsItem.id,
        newsItem.title,
        newsItem.summary,
        newsItem.content,
        newsItem.date,
        newsItem.category || null,
        JSON.stringify(newsItem.tags || []),
        newsItem.source?.name || null,
        newsItem.author || null
      );
      
      newsCount++;
      console.log(`✅ Migrated news: ${newsItem.title}`);
    }

    // Migrate Ideas
    const ideaStmt = db.prepare(`
      INSERT OR REPLACE INTO ideas (
        id, title, summary, content, status, quality_rating,
        category, tags, warnings, related_questions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let ideaCount = 0;
    
    for (const idea of percolatingIdeas) {
      ideaStmt.run(
        idea.id,
        idea.title,
        idea.description,
        idea.content,
        idea.status,
        idea.quality,
        idea.tags?.[0] || null, // Use first tag as category
        JSON.stringify(idea.tags || []),
        idea.warning ? JSON.stringify([idea.warning]) : JSON.stringify([]),
        JSON.stringify(idea.questions || [])
      );
      
      ideaCount++;
      console.log(`✅ Migrated idea: ${idea.title}`);
    }

    console.log(`\n✅ Migration Summary:`);
    console.log(`   - Case Studies: ${caseStudyCount} migrated`);
    console.log(`   - News: ${newsCount} migrated`);
    console.log(`   - Ideas: ${ideaCount} migrated`);

    // Verify migration
    const verifyCaseStudies = db.prepare('SELECT COUNT(*) as count FROM case_studies').get() as { count: number };
    const verifyNews = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
    const verifyIdeas = db.prepare('SELECT COUNT(*) as count FROM ideas').get() as { count: number };
    
    console.log(`\n✅ Verification:`);
    console.log(`   - Case Studies in DB: ${verifyCaseStudies.count}`);
    console.log(`   - News in DB: ${verifyNews.count}`);
    console.log(`   - Ideas in DB: ${verifyIdeas.count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run migration
migrateRemainingContent()
  .then(() => {
    console.log('\n✅ Content migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Content migration failed:', error);
    process.exit(1);
  });