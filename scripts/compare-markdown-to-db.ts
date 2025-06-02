import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

/**
 * Compare existing markdown files with database content
 * This helps identify content that exists in files but not in the database
 */
async function compareMarkdownToDb() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    console.log('Comparing markdown files with database content...\n')
    
    const contentDir = path.join(
      process.cwd(),
      'src/data/roadmaps/ai-safety-researcher/content'
    )
    
    // Get all markdown files (excluding personal versions)
    const markdownFiles = fs.readdirSync(contentDir)
      .filter(f => f.endsWith('.md') && !f.includes('.personal.'))
      .sort()
    
    console.log(`Found ${markdownFiles.length} markdown files to check\n`)
    
    // Get all topics from database with their content
    const dbTopics = db.prepare(`
      SELECT 
        id,
        title,
        content_academic,
        module_id
      FROM topics
    `).all()
    
    // Create a map for easy lookup
    const dbContentMap = new Map()
    dbTopics.forEach(topic => {
      dbContentMap.set(topic.id, topic.content_academic || '')
    })
    
    let matches = 0
    let mismatches = 0
    let notInDb = 0
    let emptyInDb = 0
    
    const issues = []
    
    for (const file of markdownFiles) {
      const filePath = path.join(contentDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      
      // Extract topic ID from filename (e.g., "agency@agency-subtopic.md" -> "agency")
      let topicId = ''
      if (file.includes('@')) {
        topicId = file.split('@')[0]
      } else {
        // Handle edge cases
        topicId = file.replace('.md', '').replace('-subtopic', '')
      }
      
      const dbContent = dbContentMap.get(topicId)
      
      if (dbContent === undefined) {
        console.log(`❌ NOT IN DB: ${file} (topic ID: ${topicId})`)
        notInDb++
        issues.push({
          file,
          topicId,
          issue: 'not_in_db',
          fileSize: fileContent.length
        })
      } else if (dbContent === '') {
        console.log(`⚠️  EMPTY IN DB: ${file} (topic ID: ${topicId})`)
        emptyInDb++
        issues.push({
          file,
          topicId,
          issue: 'empty_in_db',
          fileSize: fileContent.length
        })
      } else if (dbContent.trim() === fileContent.trim()) {
        console.log(`✅ MATCH: ${file}`)
        matches++
      } else {
        console.log(`⚠️  MISMATCH: ${file} (file: ${fileContent.length} chars, db: ${dbContent.length} chars)`)
        mismatches++
        issues.push({
          file,
          topicId,
          issue: 'content_mismatch',
          fileSize: fileContent.length,
          dbSize: dbContent.length,
          sizeDiff: Math.abs(fileContent.length - dbContent.length)
        })
      }
    }
    
    console.log('\n📊 Summary:')
    console.log(`   ✅ Matches: ${matches}`)
    console.log(`   ⚠️  Mismatches: ${mismatches}`)
    console.log(`   ❌ Not in database: ${notInDb}`)
    console.log(`   ⚠️  Empty in database: ${emptyInDb}`)
    console.log(`   Total files: ${markdownFiles.length}`)
    
    if (issues.length > 0) {
      console.log('\n📋 Issues that need attention:')
      
      // Group by issue type
      const byType = {
        not_in_db: issues.filter(i => i.issue === 'not_in_db'),
        empty_in_db: issues.filter(i => i.issue === 'empty_in_db'),
        content_mismatch: issues.filter(i => i.issue === 'content_mismatch')
      }
      
      if (byType.not_in_db.length > 0) {
        console.log(`\n   Files not in database (${byType.not_in_db.length}):`)
        byType.not_in_db.forEach(issue => {
          console.log(`   - ${issue.file} (${issue.fileSize} chars)`)
        })
      }
      
      if (byType.empty_in_db.length > 0) {
        console.log(`\n   Files with empty database content (${byType.empty_in_db.length}):`)
        byType.empty_in_db.forEach(issue => {
          console.log(`   - ${issue.file} (${issue.fileSize} chars in file)`)
        })
      }
      
      if (byType.content_mismatch.length > 0) {
        console.log(`\n   Files with content mismatches (${byType.content_mismatch.length}):`)
        byType.content_mismatch.forEach(issue => {
          console.log(`   - ${issue.file} (diff: ${issue.sizeDiff} chars)`)
        })
      }
      
      // Suggest next steps
      console.log('\n💡 Suggested actions:')
      if (byType.not_in_db.length > 0) {
        console.log('   1. Check if these topics should exist in the database')
        console.log('   2. Add missing topics to appropriate modules')
      }
      if (byType.empty_in_db.length > 0) {
        console.log('   3. Import content from these files to database')
        console.log('      Run: npx tsx scripts/import-missing-content.ts')
      }
      if (byType.content_mismatch.length > 0) {
        console.log('   4. Review content differences and decide which version to keep')
      }
    }
    
    // Also check for database topics that don't have files
    console.log('\n🔍 Checking for database topics without markdown files...')
    const dbTopicsWithContent = dbTopics.filter(t => t.content_academic && t.content_academic.length > 0)
    const filesSet = new Set(markdownFiles.map(f => {
      if (f.includes('@')) {
        return f.split('@')[0]
      }
      return f.replace('.md', '').replace('-subtopic', '')
    }))
    
    const dbOnlyTopics = dbTopicsWithContent.filter(t => !filesSet.has(t.id))
    if (dbOnlyTopics.length > 0) {
      console.log(`\n⚠️  Topics with content in DB but no markdown file (${dbOnlyTopics.length}):`)
      dbOnlyTopics.forEach(topic => {
        console.log(`   - ${topic.id}: ${topic.title}`)
      })
    } else {
      console.log('   ✅ All database content has corresponding files')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

// Run if called directly
if (require.main === module) {
  compareMarkdownToDb()
}