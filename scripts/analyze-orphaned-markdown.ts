import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

/**
 * Analyze orphaned markdown files to categorize their content value
 */
async function analyzeOrphanedMarkdown() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    const contentDir = path.join(
      process.cwd(),
      'src/data/roadmaps/ai-safety-researcher/content'
    )
    
    // Get all markdown files
    const allFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') && !f.includes('.personal.'))
    
    // Get all topic IDs from database
    const dbTopics = db.prepare('SELECT id FROM topics').all()
    const dbTopicIds = new Set(dbTopics.map(t => t.id))
    
    // Find orphaned files
    const orphanedFiles = []
    for (const file of allFiles) {
      let topicId = ''
      if (file.includes('@')) {
        topicId = file.split('@')[0]
      } else {
        topicId = file.replace('.md', '').replace('-subtopic', '').replace('-topic', '')
      }
      
      if (!dbTopicIds.has(topicId)) {
        const filePath = path.join(contentDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        orphanedFiles.push({
          file,
          topicId,
          content,
          size: content.length,
          hasContent: content.length > 1000, // Files over 1KB likely have real content
          isPlaceholder: content.includes('This is a placeholder') || content.includes('Content coming soon'),
          lineCount: content.split('\n').length
        })
      }
    }
    
    // Analyze and categorize
    const analysis = {
      valuable: [],
      maybeValuable: [],
      filler: []
    }
    
    for (const orphan of orphanedFiles) {
      // Check for specific valuable content indicators
      const hasRealContent = orphan.hasContent && !orphan.isPlaceholder
      const hasStructure = orphan.content.includes('##') || orphan.content.includes('###')
      const hasLists = orphan.content.includes('- ') || orphan.content.includes('* ')
      const hasCode = orphan.content.includes('```')
      const hasLinks = orphan.content.includes('[') && orphan.content.includes('](')
      
      const contentScore = [hasRealContent, hasStructure, hasLists, hasCode, hasLinks].filter(Boolean).length
      
      // Extract first few meaningful lines for preview
      const lines = orphan.content.split('\n').filter(line => line.trim() && !line.startsWith('#'))
      const preview = lines.slice(0, 3).join(' ').substring(0, 150) + '...'
      
      const entry = {
        file: orphan.file,
        topicId: orphan.topicId,
        size: orphan.size,
        lineCount: orphan.lineCount,
        preview
      }
      
      if (contentScore >= 3 && orphan.size > 2000) {
        analysis.valuable.push(entry)
      } else if (contentScore >= 2 || orphan.size > 1000) {
        analysis.maybeValuable.push(entry)
      } else {
        analysis.filler.push(entry)
      }
    }
    
    // Generate report
    const report = `# Orphaned Markdown Files Analysis
Generated: ${new Date().toISOString()}

## Summary
- Total orphaned files: ${orphanedFiles.length}
- Valuable content: ${analysis.valuable.length}
- Maybe valuable: ${analysis.maybeValuable.length}
- Filler/placeholder: ${analysis.filler.length}

## Valuable Content (Should Review for Import)
These files contain substantial, structured content that could be valuable for the journey:

${analysis.valuable.map(f => `### ${f.file}
- **Topic ID**: ${f.topicId}
- **Size**: ${f.size} bytes (${f.lineCount} lines)
- **Preview**: ${f.preview}
`).join('\n')}

## Maybe Valuable (Quick Review Recommended)
These files have some content but may need evaluation:

${analysis.maybeValuable.map(f => `### ${f.file}
- **Topic ID**: ${f.topicId}
- **Size**: ${f.size} bytes (${f.lineCount} lines)
- **Preview**: ${f.preview}
`).join('\n')}

## Filler/Placeholder (Can Archive or Delete)
These files appear to be placeholders or have minimal content:

${analysis.filler.map(f => `### ${f.file}
- **Topic ID**: ${f.topicId}
- **Size**: ${f.size} bytes
`).join('\n')}

## Recommendations

1. **For Valuable Content**:
   - Review each file to determine if it should:
     a) Become a new topic in the journey
     b) Be merged into an existing related topic
     c) Be archived for reference
   
2. **For Maybe Valuable**:
   - Quick scan to see if any unique content exists
   - Most are likely placeholder content with some structure
   
3. **For Filler**:
   - These can be safely archived or deleted
   - They mostly contain boilerplate placeholder text

## Next Steps
- Review valuable content files individually
- Decide on appropriate topics or modules for valuable content
- Update database with any content worth preserving
- Archive or remove filler files to reduce confusion
`
    
    // Write report
    const reportPath = path.join(process.cwd(), 'docs/orphaned-markdown-analysis.md')
    fs.writeFileSync(reportPath, report)
    
    console.log('Analysis complete! Report saved to: docs/orphaned-markdown-analysis.md')
    console.log(`\nSummary:`)
    console.log(`- Valuable content: ${analysis.valuable.length} files`)
    console.log(`- Maybe valuable: ${analysis.maybeValuable.length} files`)
    console.log(`- Filler: ${analysis.filler.length} files`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    db.close()
  }
}

// Run if called directly
if (require.main === module) {
  analyzeOrphanedMarkdown()
}