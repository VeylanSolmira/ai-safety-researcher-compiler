import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Topics to load
const topicsToLoad = [
  'prompt-injection-attacks',
  'jailbreak-techniques', 
  'safety-evaluation-101',
  'how-llms-work',
  'training-failure-modes'
]

async function loadFromMarkdownFiles() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  console.log('🚀 Loading Phase 1 content from markdown files...\\n')
  
  try {
    let successCount = 0
    const contentDir = path.join(
      process.cwd(),
      'src/data/roadmaps/ai-safety-researcher/content'
    )
    
    for (const topicId of topicsToLoad) {
      console.log(`📝 Processing: ${topicId}`)
      
      // Check if files exist
      const academicPath = path.join(contentDir, `${topicId}@${topicId}-subtopic.md`)
      const personalPath = path.join(contentDir, `${topicId}@${topicId}-subtopic.personal.md`)
      
      if (fs.existsSync(academicPath) && fs.existsSync(personalPath)) {
        // Read content
        const academicContent = fs.readFileSync(academicPath, 'utf8')
        const personalContent = fs.readFileSync(personalPath, 'utf8')
        
        // Update database
        const updateStmt = db.prepare(`
          UPDATE topics 
          SET content_academic = ?, content_personal = ?
          WHERE id = ?
        `)
        
        const result = updateStmt.run(
          academicContent,
          personalContent,
          topicId
        )
        
        if (result.changes > 0) {
          console.log(`   ✅ Successfully loaded from files`)
          successCount++
        } else {
          console.log(`   ❌ Topic not found in database`)
        }
      } else {
        console.log(`   ⚠️  Markdown files not found`)
      }
    }
    
    console.log(`\\n✨ Loading complete!`)
    console.log(`✅ Successfully updated: ${successCount} topics`)
    
    // Verify Phase 1 completion
    const phase1Topics = [
      'why-ai-safety', 'risk-landscape', 'choose-your-path',
      'build-first-safety-tool', 'intro-red-teaming', 'basic-interpretability',
      'prompt-injection-attacks', 'jailbreak-techniques', 'safety-evaluation-101',
      'how-llms-work', 'training-failure-modes'
    ]
    
    const phase1Complete = db.prepare(`
      SELECT id FROM topics 
      WHERE id IN (${phase1Topics.map(() => '?').join(',')})
        AND content_academic IS NOT NULL AND length(content_academic) > 0
        AND content_personal IS NOT NULL AND length(content_personal) > 0
      ORDER BY id
    `).all(...phase1Topics)
    
    console.log(`\\n🎯 Phase 1 Final Status:`)
    console.log(`Completed: ${phase1Complete.map(t => t.id).join(', ')}`)
    console.log(`Total: ${phase1Complete.length}/11 topics`)
    
    if (phase1Complete.length === 11) {
      console.log(`\\n🎉 PHASE 1 COMPLETE! All 11 topics have content.`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    db.close()
  }
}

// Run the loader
loadFromMarkdownFiles()