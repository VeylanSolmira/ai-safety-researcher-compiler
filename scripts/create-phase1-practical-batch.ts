import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Store content in separate files to avoid template literal issues
const topicContents = [
  {
    id: 'build-first-safety-tool',
    files: {
      academic: 'phase1-content/build-first-safety-tool-academic.md',
      personal: 'phase1-content/build-first-safety-tool-personal.md'
    }
  },
  {
    id: 'intro-red-teaming',
    files: {
      academic: 'phase1-content/intro-red-teaming-academic.md',
      personal: 'phase1-content/intro-red-teaming-personal.md'
    }
  },
  {
    id: 'basic-interpretability',
    files: {
      academic: 'phase1-content/basic-interpretability-academic.md',
      personal: 'phase1-content/basic-interpretability-personal.md'
    }
  },
  {
    id: 'prompt-injection-attacks',
    files: {
      academic: 'phase1-content/prompt-injection-attacks-academic.md',
      personal: 'phase1-content/prompt-injection-attacks-personal.md'
    }
  },
  {
    id: 'jailbreak-techniques',
    files: {
      academic: 'phase1-content/jailbreak-techniques-academic.md',
      personal: 'phase1-content/jailbreak-techniques-personal.md'
    }
  },
  {
    id: 'safety-evaluation-101',
    files: {
      academic: 'phase1-content/safety-evaluation-101-academic.md',
      personal: 'phase1-content/safety-evaluation-101-personal.md'
    }
  },
  {
    id: 'how-llms-work',
    files: {
      academic: 'phase1-content/how-llms-work-academic.md',
      personal: 'phase1-content/how-llms-work-personal.md'
    }
  },
  {
    id: 'training-failure-modes',
    files: {
      academic: 'phase1-content/training-failure-modes-academic.md',
      personal: 'phase1-content/training-failure-modes-personal.md'
    }
  }
]

async function createPracticalContent() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  const scriptsDir = path.dirname(new URL(import.meta.url).pathname)
  
  console.log('🚀 Creating Phase 1 Practical content...\n')
  
  try {
    let successCount = 0
    let errorCount = 0
    
    for (const topic of topicContents) {
      console.log(`📝 Processing: ${topic.id}`)
      
      try {
        // Read content from files
        const academicPath = path.join(scriptsDir, topic.files.academic)
        const personalPath = path.join(scriptsDir, topic.files.personal)
        
        if (!fs.existsSync(academicPath)) {
          console.log(`   ⚠️  Skipping - academic content file not found: ${topic.files.academic}`)
          continue
        }
        
        if (!fs.existsSync(personalPath)) {
          console.log(`   ⚠️  Skipping - personal content file not found: ${topic.files.personal}`)
          continue
        }
        
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
          topic.id
        )
        
        if (result.changes > 0) {
          console.log(`   ✅ Successfully updated database`)
          
          // Export to markdown files
          const contentDir = path.join(
            process.cwd(),
            'src/data/roadmaps/ai-safety-researcher/content'
          )
          
          const exportAcademicPath = path.join(contentDir, `${topic.id}@${topic.id}-subtopic.md`)
          fs.writeFileSync(exportAcademicPath, academicContent)
          
          const exportPersonalPath = path.join(contentDir, `${topic.id}@${topic.id}-subtopic.personal.md`)
          fs.writeFileSync(exportPersonalPath, personalContent)
          
          console.log(`   📄 Exported to markdown files`)
          successCount++
        } else {
          console.log(`   ❌ Topic not found in database: ${topic.id}`)
          errorCount++
        }
      } catch (error) {
        console.log(`   ❌ Error processing ${topic.id}: ${error}`)
        errorCount++
      }
    }
    
    console.log('\n✨ Phase 1 content update complete!')
    console.log(`✅ Successfully updated: ${successCount} topics`)
    console.log(`❌ Errors: ${errorCount} topics`)
    
    // Show remaining topics that need content
    const remainingTopics = db.prepare(`
      SELECT id, title 
      FROM topics 
      WHERE (content_academic IS NULL OR content_academic = '')
      ORDER BY id
    `).all()
    
    if (remainingTopics.length > 0) {
      console.log(`\n📋 Remaining topics without content: ${remainingTopics.length}`)
      console.log('Next batch to work on:')
      remainingTopics.slice(0, 10).forEach(topic => {
        console.log(`   - ${topic.id}: ${topic.title}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
  } finally {
    db.close()
  }
}

// Run the script
createPracticalContent()