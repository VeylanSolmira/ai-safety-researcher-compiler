#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

// Fix citation report route
const citationReportPath = './app/api/citations/report/[topicId]/route.ts'
let citationReportContent = fs.readFileSync(citationReportPath, 'utf-8')

// Add interface after imports
const citationInterface = `
interface Citation {
  id: string
  topic_id: string
  content_type: string
  citation_text: string
  context: string
  validation_status: string
  confidence?: number
  extracted_title?: string
  extracted_authors?: string
  extracted_year?: string
  issues?: string
  run_date: string
}

interface Topic {
  id: string
  title: string
}
`

citationReportContent = citationReportContent.replace(
  "const DB_PATH = path.join(process.cwd(), 'journey.db')",
  `const DB_PATH = path.join(process.cwd(), 'journey.db')
${citationInterface}`
)

// Type the database queries
citationReportContent = citationReportContent.replace(
  ').get(params.topicId)',
  ').get(params.topicId) as Topic | undefined'
)

citationReportContent = citationReportContent.replace(
  ').all(params.topicId)',
  ').all(params.topicId) as Citation[]'
)

// Fix history query type
citationReportContent = citationReportContent.replace(
  /\)\.all\(params\.topicId\)\s*\n\s*\n\s*\/\/ Group by run/,
  ').all(params.topicId) as Array<{ run_date: string, status: string, count: number }>\n\n    // Group by run'
)

fs.writeFileSync(citationReportPath, citationReportContent)
console.log('✓ Fixed citation report route types')

// Fix citation validate-batch route
const validateBatchPath = './app/api/citations/validate-batch/route.ts'
let validateBatchContent = fs.readFileSync(validateBatchPath, 'utf-8')

// Add interface
const batchInterface = `
interface ValidationRequest {
  citation_text: string
  context?: string
  extracted_title?: string
}
`

validateBatchContent = validateBatchContent.replace(
  'export async function POST(request: Request) {',
  `${batchInterface}
export async function POST(request: Request) {`
)

// Type the request body
validateBatchContent = validateBatchContent.replace(
  'const { citations } = await request.json()',
  'const { citations }: { citations: ValidationRequest[] } = await request.json()'
)

// Fix reduce type
validateBatchContent = validateBatchContent.replace(
  'const citationsByStatus = results.reduce((acc, citation) => {',
  'const citationsByStatus = results.reduce<Record<string, any[]>>((acc, citation) => {'
)

fs.writeFileSync(validateBatchPath, validateBatchContent)
console.log('✓ Fixed validate-batch route types')

// Fix community-profiles-queries.ts
const communityProfilesPath = './lib/db/community-profiles-queries.ts'
let communityProfilesContent = fs.readFileSync(communityProfilesPath, 'utf-8')

// Type the queries
communityProfilesContent = communityProfilesContent.replace(
  ').all()',
  ').all() as Array<any>'
)

communityProfilesContent = communityProfilesContent.replace(
  ').get(id)',
  ').get(id) as any'
)

fs.writeFileSync(communityProfilesPath, communityProfilesContent)
console.log('✓ Fixed community-profiles-queries types')

// Fix timeline-queries.ts
const timelinePath = './lib/db/timeline-queries.ts'
let timelineContent = fs.readFileSync(timelinePath, 'utf-8')

// Type the database results
timelineContent = timelineContent.replace(
  ').all(userId)',
  ').all(userId) as Array<any>'
)

timelineContent = timelineContent.replace(
  ').get(blockId)',
  ').get(blockId) as any'
)

timelineContent = timelineContent.replace(
  ').all(blockId)',
  ').all(blockId) as Array<any>'
)

fs.writeFileSync(timelinePath, timelineContent)
console.log('✓ Fixed timeline-queries types')

// Fix journey.ts tag type
const journeyPath = './lib/journey.ts'
let journeyContent = fs.readFileSync(journeyPath, 'utf-8')

journeyContent = journeyContent.replace(
  '.filter(tag => tag !== \'course\')',
  '.filter((tag: string) => tag !== \'course\')'
)

fs.writeFileSync(journeyPath, journeyContent)
console.log('✓ Fixed journey.ts types')

// Fix papers-queries category type
const papersPath = './lib/db/papers-queries.ts'
let papersContent = fs.readFileSync(papersPath, 'utf-8')

// Add type assertion for category
papersContent = papersContent.replace(
  'return {',
  'return {\n      ...paper,\n      category: paper.category as Paper[\'category\'],'
)

fs.writeFileSync(papersPath, papersContent)
console.log('✓ Fixed papers-queries types')

console.log('\n✅ Type fixes applied! Run npm run type-check to verify.')