#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

console.log('🔧 Fixing all type errors systematically...\n')

// Fix 1: Update validate-batch route
const validateBatchPath = './app/api/citations/validate-batch/route.ts'
let validateBatchContent = fs.readFileSync(validateBatchPath, 'utf-8')

// Add proper interfaces at the top
const batchInterfaces = `
interface ValidationRequest {
  citation_text: string
  context?: string
  extracted_title?: string
}

interface ValidationResult extends ValidationRequest {
  topic_id?: string
  content_type?: string
  validation_status: string
  confidence?: number
  known_paper_id?: string
  suggested_fix?: string
  validation_errors?: string[]
  issues?: string[]
}
`

// Insert interfaces after imports
validateBatchContent = validateBatchContent.replace(
  "import path from 'path'",
  `import path from 'path'
${batchInterfaces}`
)

// Fix the citations type
validateBatchContent = validateBatchContent.replace(
  'const { citations } = await request.json()',
  'const { citations }: { citations: ValidationRequest[] } = await request.json()'
)

// Fix the results type
validateBatchContent = validateBatchContent.replace(
  'const results = await Promise.all(',
  'const results: ValidationResult[] = await Promise.all('
)

// Fix reduce types
validateBatchContent = validateBatchContent.replace(
  'const citationsByStatus = results.reduce((acc, citation) => {',
  'const citationsByStatus = results.reduce<Record<string, ValidationResult[]>>((acc, citation) => {'
)

validateBatchContent = validateBatchContent.replace(
  '.reduce((acc, c) => {',
  '.reduce<Record<string, number>>((acc, c) => {'
)

fs.writeFileSync(validateBatchPath, validateBatchContent)
console.log('✅ Fixed app/api/citations/validate-batch/route.ts')

// Fix 2: Update validate route 
const validatePath = './app/api/citations/validate/route.ts'
let validateContent = fs.readFileSync(validatePath, 'utf-8')

// Update tsconfig target
validateContent = validateContent.replace(
  'const authorsList = [...uniqueAuthors]',
  'const authorsList = Array.from(uniqueAuthors)'
)

validateContent = validateContent.replace(
  'const journalsList = [...uniqueJournals]',
  'const journalsList = Array.from(uniqueJournals)'
)

validateContent = validateContent.replace(
  '.split(/[;,]\\s*/).filter(a => a.trim()))',
  '.split(/[;,]\\s*/).filter((a: string) => a.trim()))'
)

fs.writeFileSync(validatePath, validateContent)
console.log('✅ Fixed app/api/citations/validate/route.ts')

// Fix 3: Update db index to export sql
const dbIndexPath = './lib/db/index.ts'
let dbIndexContent = fs.readFileSync(dbIndexPath, 'utf-8')

// Add sql export
if (!dbIndexContent.includes('export { sql }')) {
  dbIndexContent = dbIndexContent.replace(
    "export { eq, and, or, like, sql, asc, desc } from 'drizzle-orm'",
    "export { eq, and, or, like, sql, asc, desc } from 'drizzle-orm'\nexport { sql } from 'drizzle-orm'"
  )
}

fs.writeFileSync(dbIndexPath, dbIndexContent)
console.log('✅ Fixed lib/db/index.ts - added sql export')

// Fix 4: Fix journey-queries.ts
const journeyQueriesPath = './lib/db/journey-queries.ts'
let journeyQueriesContent = fs.readFileSync(journeyQueriesPath, 'utf-8')

// Fix Topic import
journeyQueriesContent = journeyQueriesContent.replace(
  'Topic,',
  'topics as Topic,'
)

fs.writeFileSync(journeyQueriesPath, journeyQueriesContent)
console.log('✅ Fixed lib/db/journey-queries.ts')

// Fix 5: Fix papers-queries.ts
const papersPath = './lib/db/papers-queries.ts'
let papersContent = fs.readFileSync(papersPath, 'utf-8')

// Fix the missing paper variable and category type
papersContent = papersContent.replace(
  `return {
      ...paper,
      category: paper.category as Paper['category'],`,
  `return papers.map(paper => ({
      ...paper,
      category: paper.category as Paper['category'],`
)

// Close the map
papersContent = papersContent.replace(
  'reading_time: paper.reading_time',
  'reading_time: paper.reading_time\n    }))'
)

fs.writeFileSync(papersPath, papersContent)
console.log('✅ Fixed lib/db/papers-queries.ts')

// Fix 6: Fix progress.ts
const progressPath = './lib/api/progress.ts'
if (fs.existsSync(progressPath)) {
  let progressContent = fs.readFileSync(progressPath, 'utf-8')
  
  // Import sql from drizzle-orm
  progressContent = progressContent.replace(
    "import { getDb } from '@/lib/db'",
    "import { getDb } from '@/lib/db'\nimport { sql } from 'drizzle-orm'"
  )
  
  // Remove id from insert
  progressContent = progressContent.replace(
    /\.values\(\{\s*id:[^,]+,/g,
    '.values({'
  )
  
  fs.writeFileSync(progressPath, progressContent)
  console.log('✅ Fixed lib/api/progress.ts')
}

// Fix 7: Fix timeline-queries.ts types
const timelinePath = './lib/db/timeline-queries.ts'
let timelineContent = fs.readFileSync(timelinePath, 'utf-8')

// Add proper types for template queries
timelineContent = timelineContent.replace(
  ').all() as Array<any>',
  ').all() as Array<{id: string, user_id: string, name: string, description: string, structure: string, is_public: number, use_count: number, created_at: number}>'
)

// Fix template structure
timelineContent = timelineContent.replace(
  'structure: JSON.parse(template.structure)',
  'structure: JSON.parse((template as any).structure)'
)

// Add missing TimeBlock properties
timelineContent = timelineContent.replace(
  'collapsed: false,\n    metadata',
  'collapsed: false,\n    startDate: null,\n    endDate: null,\n    metadata'
)

fs.writeFileSync(timelinePath, timelineContent)
console.log('✅ Fixed lib/db/timeline-queries.ts')

// Fix 8: Fix community-profiles spread
const communityPath = './lib/db/community-profiles-queries.ts'
let communityContent = fs.readFileSync(communityPath, 'utf-8')

// Fix spread of unknown type
communityContent = communityContent.replace(
  /return profiles\.map\(profile => \(\{\s*\.\.\.profile,/g,
  'return profiles.map((profile: any) => ({\n      ...profile,'
)

fs.writeFileSync(communityPath, communityContent)
console.log('✅ Fixed lib/db/community-profiles-queries.ts')

// Fix 9: Remove journey-generated.ts import of non-existent types
const journeyGenPath = './lib/journey-generated.ts'
if (fs.existsSync(journeyGenPath)) {
  let journeyGenContent = fs.readFileSync(journeyGenPath, 'utf-8')
  
  // Remove bad import
  journeyGenContent = journeyGenContent.replace(
    "import { Tier, Module, Topic } from './types'",
    "// Types are defined inline"
  )
  
  // Add type definitions
  const typeDefinitions = `
interface Topic {
  id: string
  title: string
  description: string
  module_id: string
  position: number
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  learning_outcomes: string[]
  tags: string[]
}

interface Module {
  id: string
  title: string
  description: string
  tier_id: string
  position: number
  topics: Topic[]
}

interface Tier {
  id: string
  title: string
  description: string
  position: number
  modules: Module[]
}
`
  
  journeyGenContent = typeDefinitions + '\n' + journeyGenContent
  
  fs.writeFileSync(journeyGenPath, journeyGenContent)
  console.log('✅ Fixed lib/journey-generated.ts')
}

// Fix 10: Fix journey.ts tag parameter type
const journeyPath = './lib/journey.ts'
let journeyContent = fs.readFileSync(journeyPath, 'utf-8')

journeyContent = journeyContent.replace(
  '.filter(tag => tag !== \'course\')',
  '.filter((tag: string) => tag !== \'course\')'
)

fs.writeFileSync(journeyPath, journeyContent)
console.log('✅ Fixed lib/journey.ts')

// Fix 11: Fix entity-queries 
const entityPath = './lib/db/entity-queries.ts'
if (fs.existsSync(entityPath)) {
  let entityContent = fs.readFileSync(entityPath, 'utf-8')
  
  // Fix JSON.parse calls
  entityContent = entityContent.replace(
    /tags: entity\.tags \? JSON\.parse\(entity\.tags\)/g,
    'tags: entity.tags ? JSON.parse(entity.tags as string)'
  )
  
  entityContent = entityContent.replace(
    /properties: entity\.properties \? JSON\.parse\(entity\.properties\)/g,
    'properties: entity.properties ? JSON.parse(entity.properties as string)'
  )
  
  fs.writeFileSync(entityPath, entityContent)
  console.log('✅ Fixed lib/db/entity-queries.ts')
}

console.log('\n🎉 All type fixes applied!')
console.log('Run "npm run type-check" to see remaining issues.')
console.log('Run "npm run build" to test the build.')