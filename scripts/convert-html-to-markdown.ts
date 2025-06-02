import Database from 'better-sqlite3'
import path from 'path'
import TurndownService from 'turndown'

/**
 * Convert HTML content in database to markdown
 * This maintains consistency across all content
 */
async function convertHtmlToMarkdown() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  // Initialize Turndown converter
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
  })
  
  // Add custom rules for better conversion
  turndown.addRule('preserveEmptyLines', {
    filter: ['br'],
    replacement: () => '\n'
  })
  
  try {
    console.log('Converting HTML content to markdown in database...\n')
    
    // Get all topics with HTML-like content
    const topicsWithHtml = db.prepare(`
      SELECT 
        t.id,
        t.title,
        t.content_markdown,
        t.content_personal,
        m.title as module_title,
        tier.title as tier_title
      FROM topics t
      JOIN modules m ON t.module_id = m.id
      JOIN tiers tier ON m.tier_id = tier.id
      WHERE (
        (t.content_markdown LIKE '%<p>%' 
         OR t.content_markdown LIKE '%<h1>%' 
         OR t.content_markdown LIKE '%<h2>%'
         OR t.content_markdown LIKE '%<h3>%'
         OR t.content_markdown LIKE '%<div>%'
         OR t.content_markdown LIKE '%<ul>%'
         OR t.content_markdown LIKE '%<ol>%'
         OR t.content_markdown LIKE '%<li>%'
         OR t.content_markdown LIKE '%<strong>%'
         OR t.content_markdown LIKE '%<em>%')
        AND t.content_markdown IS NOT NULL
      )
      OR (
        (t.content_personal LIKE '%<p>%' 
         OR t.content_personal LIKE '%<h1>%' 
         OR t.content_personal LIKE '%<h2>%'
         OR t.content_personal LIKE '%<h3>%'
         OR t.content_personal LIKE '%<div>%'
         OR t.content_personal LIKE '%<ul>%'
         OR t.content_personal LIKE '%<ol>%'
         OR t.content_personal LIKE '%<li>%'
         OR t.content_personal LIKE '%<strong>%'
         OR t.content_personal LIKE '%<em>%')
        AND t.content_personal IS NOT NULL
      )
      ORDER BY tier.position, m.position, t.position
    `).all()
    
    console.log(`Found ${topicsWithHtml.length} topics with HTML content to convert\n`)
    
    // Prepare update statements
    const updateMarkdown = db.prepare(`
      UPDATE topics 
      SET content_markdown = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    const updatePersonal = db.prepare(`
      UPDATE topics 
      SET content_personal = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    let convertedAcademic = 0
    let convertedPersonal = 0
    let errors = 0
    
    for (const topic of topicsWithHtml) {
      console.log(`Processing: ${topic.id} - ${topic.title}`)
      
      // Convert academic content
      if (topic.content_markdown && containsHtml(topic.content_markdown)) {
        try {
          const markdown = turndown.turndown(topic.content_markdown)
          updateMarkdown.run(markdown, topic.id)
          console.log(`  ✅ Converted academic content`)
          convertedAcademic++
        } catch (error) {
          console.log(`  ❌ Error converting academic content: ${error.message}`)
          errors++
        }
      }
      
      // Convert personal content
      if (topic.content_personal && containsHtml(topic.content_personal)) {
        try {
          const markdown = turndown.turndown(topic.content_personal)
          updatePersonal.run(markdown, topic.id)
          console.log(`  ✅ Converted personal content`)
          convertedPersonal++
        } catch (error) {
          console.log(`  ❌ Error converting personal content: ${error.message}`)
          errors++
        }
      }
    }
    
    console.log('\n📊 Conversion Summary:')
    console.log(`   Academic content converted: ${convertedAcademic}`)
    console.log(`   Personal content converted: ${convertedPersonal}`)
    console.log(`   Errors: ${errors}`)
    console.log(`   Total topics processed: ${topicsWithHtml.length}`)
    
    // Verify conversion
    console.log('\n🔍 Verifying conversion...')
    const remainingHtml = db.prepare(`
      SELECT COUNT(*) as count
      FROM topics 
      WHERE (
        (content_markdown LIKE '%<p>%' 
         OR content_markdown LIKE '%<h1>%' 
         OR content_markdown LIKE '%<h2>%')
        AND content_markdown IS NOT NULL
      )
    `).get()
    
    if (remainingHtml.count === 0) {
      console.log('✅ All HTML content successfully converted to markdown!')
    } else {
      console.log(`⚠️  ${remainingHtml.count} topics still contain HTML content`)
    }
    
    console.log('\n🎉 Conversion complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

function containsHtml(content: string): boolean {
  const htmlTags = ['<p>', '<h1>', '<h2>', '<h3>', '<div>', '<ul>', '<ol>', '<li>', '<strong>', '<em>', '<br', '<hr']
  return htmlTags.some(tag => content.includes(tag))
}

// Run if called directly
if (require.main === module) {
  convertHtmlToMarkdown()
}