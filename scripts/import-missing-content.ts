import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

/**
 * Import missing markdown content into database
 * Handles both academic and personal content variants
 */
async function importMissingContent() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    console.log('Importing missing markdown content into database...\n')
    console.log('This script will preserve the academic/personal content distinction\n')
    
    const contentDir = path.join(
      process.cwd(),
      'src/data/roadmaps/ai-safety-researcher/content'
    )
    
    // Get all markdown files
    const allFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
    
    // Separate academic and personal versions
    const academicFiles = allFiles.filter(f => !f.includes('.personal.'))
    const personalFiles = allFiles.filter(f => f.includes('.personal.'))
    
    console.log(`Found ${academicFiles.length} academic files and ${personalFiles.length} personal files\n`)
    
    // Get all topics from database
    const dbTopics = db.prepare(`
      SELECT id, title, content_markdown, module_id
      FROM topics
    `).all()
    
    const dbTopicMap = new Map()
    dbTopics.forEach(topic => {
      dbTopicMap.set(topic.id, topic)
    })
    
    // First, let's check if we need to add content_personal column
    const tableInfo = db.prepare("PRAGMA table_info(topics)").all()
    const hasPersonalColumn = tableInfo.some(col => col.name === 'content_personal')
    
    if (!hasPersonalColumn) {
      console.log('Adding content_personal column to topics table...')
      db.prepare(`
        ALTER TABLE topics 
        ADD COLUMN content_personal TEXT
      `).run()
      console.log('✅ Added content_personal column\n')
    }
    
    // Prepare update statements
    const updateContent = db.prepare(`
      UPDATE topics 
      SET content_markdown = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    const updatePersonalContent = db.prepare(`
      UPDATE topics 
      SET content_personal = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    let imported = 0
    let skipped = 0
    let notInDb = 0
    
    // Process academic files
    console.log('Processing academic content files...')
    for (const file of academicFiles) {
      const filePath = path.join(contentDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      
      // Extract topic ID
      let topicId = ''
      if (file.includes('@')) {
        topicId = file.split('@')[0]
      } else {
        topicId = file.replace('.md', '').replace('-subtopic', '')
      }
      
      const dbTopic = dbTopicMap.get(topicId)
      
      if (!dbTopic) {
        console.log(`❌ NOT IN DB: ${file} (topic: ${topicId})`)
        notInDb++
        continue
      }
      
      // Only import if database content is empty or different
      if (!dbTopic.content_markdown || dbTopic.content_markdown === '') {
        updateContent.run(content, topicId)
        console.log(`✅ Imported: ${file} -> ${topicId}`)
        imported++
      } else if (dbTopic.content_markdown.trim() !== content.trim()) {
        console.log(`⚠️  Content differs: ${file} (keeping existing DB content)`)
        skipped++
      } else {
        console.log(`⏭️  Already in DB: ${file}`)
        skipped++
      }
    }
    
    // Process personal files
    console.log('\nProcessing personal content files...')
    let personalImported = 0
    let personalSkipped = 0
    
    for (const file of personalFiles) {
      const filePath = path.join(contentDir, file)
      const content = fs.readFileSync(filePath, 'utf8')
      
      // Extract topic ID (e.g., "agency@agency-subtopic.personal.md" -> "agency")
      let topicId = ''
      if (file.includes('@')) {
        topicId = file.split('@')[0]
      }
      
      const dbTopic = dbTopicMap.get(topicId)
      
      if (!dbTopic) {
        console.log(`❌ NOT IN DB: ${file} (topic: ${topicId})`)
        continue
      }
      
      // Import personal content
      updatePersonalContent.run(content, topicId)
      console.log(`✅ Imported personal: ${file} -> ${topicId}`)
      personalImported++
    }
    
    console.log('\n📊 Import Summary:')
    console.log(`   Academic content:`)
    console.log(`     ✅ Imported: ${imported}`)
    console.log(`     ⏭️  Skipped: ${skipped}`)
    console.log(`     ❌ Not in DB: ${notInDb}`)
    console.log(`   Personal content:`)
    console.log(`     ✅ Imported: ${personalImported}`)
    
    // List topics that still need content
    const emptyTopics = db.prepare(`
      SELECT id, title, module_id
      FROM topics
      WHERE (content_markdown IS NULL OR content_markdown = '')
        AND (content_personal IS NULL OR content_personal = '')
      ORDER BY id
    `).all()
    
    if (emptyTopics.length > 0) {
      console.log(`\n⚠️  Topics still without any content (${emptyTopics.length}):`)
      emptyTopics.forEach(topic => {
        console.log(`   - ${topic.id}: ${topic.title}`)
      })
    }
    
    // Check for files that couldn't be imported (not in DB)
    const orphanedFiles = []
    for (const file of academicFiles) {
      let topicId = file.includes('@') ? file.split('@')[0] : file.replace('.md', '').replace('-subtopic', '')
      if (!dbTopicMap.has(topicId)) {
        orphanedFiles.push({ file, topicId })
      }
    }
    
    if (orphanedFiles.length > 0) {
      console.log(`\n📝 Files that couldn't be imported (topic not in database):`)
      console.log(`   These may be from the old roadmap structure:\n`)
      orphanedFiles.forEach(({ file, topicId }) => {
        console.log(`   - ${file} (looking for topic: ${topicId})`)
      })
      
      console.log('\n💡 To resolve:')
      console.log('   1. Check if these topics should be added to the journey structure')
      console.log('   2. Or move these files to an archive directory')
    }
    
    console.log('\n🎉 Import complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

// Run if called directly
if (require.main === module) {
  importMissingContent()
}