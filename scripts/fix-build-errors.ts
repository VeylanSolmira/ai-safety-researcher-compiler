import fs from 'fs'
import path from 'path'

// Fix 1: Add missing getNewsStory export
const newsQueriesPath = path.join(process.cwd(), 'lib/db/news-queries.ts')
const newsQueriesContent = fs.readFileSync(newsQueriesPath, 'utf-8')

if (!newsQueriesContent.includes('export function getNewsStory')) {
  const additionalExport = `

export function getNewsStory(id: string) {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const query = \`
      SELECT 
        n.*,
        COUNT(DISTINCT nt.topic_id) as topic_count
      FROM news n
      LEFT JOIN news_topics nt ON n.id = nt.news_id
      WHERE n.id = ?
      GROUP BY n.id
    \`
    
    const news = db.prepare(query).get(id)
    
    if (!news) return null
    
    // Get related topics
    const topics = db.prepare(\`
      SELECT t.id, t.title
      FROM news_topics nt
      JOIN topics t ON nt.topic_id = t.id
      WHERE nt.news_id = ?
    \`).all(id)
    
    return {
      ...news,
      topics
    }
  } finally {
    db.close()
  }
}`
  
  fs.writeFileSync(newsQueriesPath, newsQueriesContent + additionalExport)
  console.log('✓ Added getNewsStory to news-queries.ts')
}

// Fix 2: Replace 'module' variable names
const filesToFix = [
  'app/journey/[tierId]/[moduleId]/page.tsx',
  'app/journey/[tierId]/page.tsx'
]

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8')
    // Replace 'module' variable with 'courseModule'
    content = content.replace(/const module = /g, 'const courseModule = ')
    content = content.replace(/let module = /g, 'let courseModule = ')
    content = content.replace(/\bmodule\./g, 'courseModule.')
    content = content.replace(/\{module\}/g, '{courseModule}')
    content = content.replace(/\(module\)/g, '(courseModule)')
    content = content.replace(/ module,/g, ' courseModule,')
    content = content.replace(/ module\}/g, ' courseModule}')
    fs.writeFileSync(filePath, content)
    console.log(`✓ Fixed module variable in ${file}`)
  }
}

// Fix 3: Escape apostrophes and quotes
const escapeFiles = [
  { file: 'app/journey/[tierId]/page.tsx', find: "you're", replace: "you&apos;re" },
  { file: 'app/journey/page.tsx', find: "Let's", replace: "Let&apos;s" },
  { file: 'app/page.tsx', find: "humanity's", replace: "humanity&apos;s" },
  { file: 'app/resources/ideas-lab/page.tsx', find: "don't", replace: "don&apos;t" },
  { file: 'app/journey/paradigms-assessment/page.tsx', find: '"Framework"', replace: '&quot;Framework&quot;' },
  { file: 'components/DatabaseDemo.tsx', find: "doesn't", replace: "doesn&apos;t" }
]

for (const { file, find, replace } of escapeFiles) {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8')
    content = content.replace(new RegExp(find, 'g'), replace)
    fs.writeFileSync(filePath, content)
    console.log(`✓ Fixed unescaped entities in ${file}`)
  }
}

console.log('\n✅ Build fixes applied! Run npm run build again.')