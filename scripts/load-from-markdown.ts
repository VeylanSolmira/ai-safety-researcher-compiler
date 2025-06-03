import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const topics = [
  'prompt-injection-attacks',
  'jailbreak-techniques', 
  'safety-evaluation-101',
  'how-llms-work',
  'training-failure-modes'
]

async function loadFromMarkdown() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  console.log('🚀 Loading Phase 1 content from extracted markdown files...\\n')
  
  try {
    let successCount = 0
    const tempDir = path.join(process.cwd(), 'temp-phase1-content')
    const contentDir = path.join(process.cwd(), 'src/data/roadmaps/ai-safety-researcher/content')
    
    // Ensure content directory exists
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }
    
    for (const topicId of topics) {
      console.log(`📝 Processing: ${topicId}`)
      
      // Read from temp files
      const academicPath = path.join(tempDir, `${topicId}-academic.md`)
      const personalPath = path.join(tempDir, `${topicId}-personal.md`)
      
      if (fs.existsSync(academicPath) && fs.existsSync(personalPath)) {
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
          console.log(`   ✅ Successfully loaded into database`)
          
          // Also save to the standard content directory
          const stdAcademicPath = path.join(contentDir, `${topicId}@${topicId}-subtopic.md`)
          const stdPersonalPath = path.join(contentDir, `${topicId}@${topicId}-subtopic.personal.md`)
          
          fs.writeFileSync(stdAcademicPath, academicContent)
          fs.writeFileSync(stdPersonalPath, personalContent)
          
          console.log(`   📄 Exported to standard content directory`)
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
      SELECT id, 
        CASE WHEN length(content_academic) > 100 THEN '✓' ELSE '✗' END as has_content
      FROM topics 
      WHERE id IN (${phase1Topics.map(() => '?').join(',')})
      ORDER BY id
    `).all(...phase1Topics)
    
    console.log(`\\n🎯 Phase 1 Final Status:`)
    phase1Complete.forEach(topic => {
      console.log(`${topic.has_content} ${topic.id}`)
    })
    
    const completeCount = phase1Complete.filter(t => t.has_content === '✓').length
    console.log(`\\nTotal: ${completeCount}/11 topics with full content`)
    
    if (completeCount === 11) {
      console.log(`\\n🎉 PHASE 1 COMPLETE! All 11 topics have full content.`)
    }
    
    // Clean up temp directory
    console.log(`\\n🧹 Cleaning up temporary files...`)
    fs.rmSync(tempDir, { recursive: true, force: true })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    db.close()
  }
}

// Run the loader
loadFromMarkdown()