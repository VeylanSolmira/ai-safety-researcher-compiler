import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

/**
 * Export content from database to markdown files
 * This script ONLY creates/updates files, it does NOT delete any existing files
 */
async function exportContentToMarkdown() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    console.log('Exporting content from database to markdown files...\n')
    console.log('⚠️  This script will NOT delete any existing files\n')
    
    // Query all topics that have content (academic or personal)
    const topicsWithContent = db.prepare(`
      SELECT 
        t.id,
        t.title,
        t.content_academic,
        t.content_personal,
        t.roadmap_content_id,
        m.id as module_id,
        m.title as module_title,
        tier.id as tier_id,
        tier.title as tier_title
      FROM topics t
      JOIN modules m ON t.module_id = m.id
      JOIN tiers tier ON m.tier_id = tier.id
      WHERE (t.content_academic IS NOT NULL AND t.content_academic != '')
         OR (t.content_personal IS NOT NULL AND t.content_personal != '')
      ORDER BY tier.position, m.position, t.position
    `).all()
    
    console.log(`Found ${topicsWithContent.length} topics with content\n`)
    
    const contentDir = path.join(
      process.cwd(),
      'src/data/roadmaps/ai-safety-researcher/content'
    )
    
    // Ensure content directory exists
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
      console.log(`Created content directory: ${contentDir}\n`)
    }
    
    let created = 0
    let updated = 0
    let skipped = 0
    let personalCreated = 0
    let personalUpdated = 0
    let personalSkipped = 0
    
    for (const topic of topicsWithContent) {
      // Export academic content
      if (topic.content_academic) {
        const filename = `${topic.id}@${topic.id}-subtopic.md`
        const filePath = path.join(contentDir, filename)
        
        // Check if file already exists
        const fileExists = fs.existsSync(filePath)
        
        if (fileExists) {
          // Read existing content
          const existingContent = fs.readFileSync(filePath, 'utf8')
          
          // Only update if content is different
          if (existingContent !== topic.content_academic) {
            fs.writeFileSync(filePath, topic.content_academic)
            console.log(`✅ Updated: ${filename} (${topic.tier_title} > ${topic.module_title} > ${topic.title})`)
            updated++
          } else {
            console.log(`⏭️  Skipped: ${filename} (content unchanged)`)
            skipped++
          }
        } else {
          // Create new file
          fs.writeFileSync(filePath, topic.content_academic)
          console.log(`✅ Created: ${filename} (${topic.tier_title} > ${topic.module_title} > ${topic.title})`)
          created++
        }
      }
      
      // Export personal content
      if (topic.content_personal) {
        const personalFilename = `${topic.id}@${topic.id}-subtopic.personal.md`
        const personalFilePath = path.join(contentDir, personalFilename)
        
        // Check if file already exists
        const personalFileExists = fs.existsSync(personalFilePath)
        
        if (personalFileExists) {
          // Read existing content
          const existingPersonalContent = fs.readFileSync(personalFilePath, 'utf8')
          
          // Only update if content is different
          if (existingPersonalContent !== topic.content_personal) {
            fs.writeFileSync(personalFilePath, topic.content_personal)
            console.log(`✅ Updated personal: ${personalFilename}`)
            personalUpdated++
          } else {
            console.log(`⏭️  Skipped personal: ${personalFilename} (content unchanged)`)
            personalSkipped++
          }
        } else {
          // Create new file
          fs.writeFileSync(personalFilePath, topic.content_personal)
          console.log(`✅ Created personal: ${personalFilename}`)
          personalCreated++
        }
      }
    }
    
    console.log('\n📊 Export Summary:')
    console.log(`   Academic content:`)
    console.log(`     Created: ${created} new files`)
    console.log(`     Updated: ${updated} existing files`)
    console.log(`     Skipped: ${skipped} unchanged files`)
    console.log(`   Personal content:`)
    console.log(`     Created: ${personalCreated} new files`)
    console.log(`     Updated: ${personalUpdated} existing files`)
    console.log(`     Skipped: ${personalSkipped} unchanged files`)
    console.log(`   Total topics with content: ${topicsWithContent.length}`)
    
    // Also show topics WITHOUT content
    const topicsWithoutContent = db.prepare(`
      SELECT 
        t.id,
        t.title,
        m.title as module_title,
        tier.title as tier_title
      FROM topics t
      JOIN modules m ON t.module_id = m.id
      JOIN tiers tier ON m.tier_id = tier.id
      WHERE t.content_academic IS NULL OR t.content_academic = ''
      ORDER BY tier.position, m.position, t.position
    `).all()
    
    if (topicsWithoutContent.length > 0) {
      console.log(`\n⚠️  Topics without content (${topicsWithoutContent.length}):`)
      topicsWithoutContent.forEach(topic => {
        console.log(`   - ${topic.id} (${topic.tier_title} > ${topic.module_title} > ${topic.title})`)
      })
    }
    
    // List existing markdown files that are NOT in the database
    console.log('\n📁 Checking for orphaned markdown files...')
    const existingFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
    const dbTopicIds = new Set(topicsWithContent.map(t => `${t.id}@${t.id}-subtopic.md`))
    
    const orphanedFiles = existingFiles.filter(f => !dbTopicIds.has(f) && !f.includes('.personal.'))
    
    if (orphanedFiles.length > 0) {
      console.log(`\n⚠️  Found ${orphanedFiles.length} markdown files not linked to database content:`)
      orphanedFiles.forEach(file => {
        console.log(`   - ${file}`)
      })
      console.log('\n   These files were NOT deleted. Review them manually if needed.')
    } else {
      console.log('   ✅ No orphaned files found')
    }
    
    console.log('\n🎉 Export complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

// Add a companion import function for testing
export async function importMarkdownToDb() {
  console.log('\n📥 This would import markdown files to database (not implemented yet)')
  console.log('   Use import-paradigm-content.ts as a reference')
}

// Run export if called directly
if (require.main === module) {
  exportContentToMarkdown()
}