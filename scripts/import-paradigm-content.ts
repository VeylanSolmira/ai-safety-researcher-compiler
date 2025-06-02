import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

async function importParadigmContent() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    console.log('Importing paradigm content into database...\n')
    
    // Define the topics and their corresponding markdown files
    const paradigmTopics = [
      {
        id: 'introduction-ai-paradigms',
        file: 'introduction-ai-paradigms@introduction-ai-paradigms-subtopic.md'
      },
      {
        id: 'cultural-paradigms-ai',
        file: 'cultural-paradigms-ai@cultural-paradigms-ai-subtopic.md'
      },
      {
        id: 'paradigm-driven-research',
        file: 'paradigm-driven-research@paradigm-driven-research-subtopic.md'
      },
      {
        id: 'paradigms-in-practice',
        file: 'paradigms-in-practice@paradigms-in-practice-subtopic.md'
      },
      {
        id: 'creating-new-paradigms',
        file: 'creating-new-paradigms@creating-new-paradigms-subtopic.md'
      }
    ]
    
    const updateTopic = db.prepare(`
      UPDATE topics 
      SET content_academic = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    const contentDir = path.join(
      process.cwd(),
      'src/data/roadmaps/ai-safety-researcher/content'
    )
    
    for (const topic of paradigmTopics) {
      const filePath = path.join(contentDir, topic.file)
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8')
        updateTopic.run(content, topic.id)
        console.log(`✅ Imported content for: ${topic.id}`)
      } else {
        console.log(`❌ File not found: ${topic.file}`)
      }
    }
    
    // Verify the import
    console.log('\nVerifying import...')
    const verifyQuery = db.prepare(`
      SELECT id, title, 
             CASE WHEN content_academic IS NOT NULL THEN 'Has content' ELSE 'No content' END as status,
             LENGTH(content_academic) as content_length
      FROM topics 
      WHERE module_id = 'paradigms-mental-models'
    `)
    
    const results = verifyQuery.all()
    console.table(results)
    
    console.log('\n🎉 Import complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

importParadigmContent()