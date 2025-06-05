#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

console.log('🔧 Fixing remaining type errors...\n')

// Fix 1: Update tsconfig.json to allow Set iteration
const tsconfigPath = './tsconfig.json'
let tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8')
const tsconfig = JSON.parse(tsconfigContent)
tsconfig.compilerOptions.target = "es2015"
tsconfig.compilerOptions.downlevelIteration = true
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))
console.log('✅ Updated tsconfig.json for Set iteration')

// Fix 2: Fix validation-batch reduce type errors
const validateBatchPath = './app/api/citations/validate-batch/route.ts'
let validateBatchContent = fs.readFileSync(validateBatchPath, 'utf-8')

// Fix the reduce with proper type annotations
validateBatchContent = validateBatchContent.replace(
  'const citationsByStatus = results.reduce<Record<string, ValidationResult[]>>((acc, citation) => {',
  'const citationsByStatus = results.reduce<Record<string, ValidationResult[]>>((acc: Record<string, ValidationResult[]>, citation: ValidationResult) => {'
)

// Fix the second reduce
validateBatchContent = validateBatchContent.replace(
  '.reduce<Record<string, number>>((acc, c) => {',
  '.reduce<Record<string, number>>((acc: Record<string, number>, c: ValidationResult) => {'
)

// Fix Object.keys usage
validateBatchContent = validateBatchContent.replace(
  'Object.keys(citationsByStatus)',
  'Object.keys(citationsByStatus) as string[]'
)

// Fix Object.values
validateBatchContent = validateBatchContent.replace(
  'Object.values(citationsByStatus).flat()',
  '(Object.values(citationsByStatus) as ValidationResult[][]).flat()'
)

fs.writeFileSync(validateBatchPath, validateBatchContent)
console.log('✅ Fixed app/api/citations/validate-batch/route.ts reduce types')

// Fix 3: Fix validate route types
const validatePath = './app/api/citations/validate/route.ts'
let validateContent = fs.readFileSync(validatePath, 'utf-8')

// Fix pattern types
validateContent = validateContent.replace(
  'for (const pattern of suspiciousPatterns) {',
  'for (const pattern of suspiciousPatterns as string[]) {'
)

// Fix paper types in map
validateContent = validateContent.replace(
  'matchingPapers.map(paper => ({',
  'matchingPapers.map((paper: any) => ({'
)

fs.writeFileSync(validatePath, validateContent)
console.log('✅ Fixed app/api/citations/validate/route.ts')

// Fix 4: Fix entity route types
const entityRoutePath = './app/api/entities/[entityId]/route.ts'
let entityRouteContent = fs.readFileSync(entityRoutePath, 'utf-8')

// Fix entity type
entityRouteContent = entityRouteContent.replace(
  ').get(params.entityId)',
  ').get(params.entityId) as any'
)

fs.writeFileSync(entityRoutePath, entityRouteContent)
console.log('✅ Fixed app/api/entities/[entityId]/route.ts')

// Fix 5: Fix entity topics route
const entityTopicsPath = './app/api/entities/[entityId]/topics/route.ts'
let entityTopicsContent = fs.readFileSync(entityTopicsPath, 'utf-8')

// Fix reduce type
entityTopicsContent = entityTopicsContent.replace(
  'const grouped = topics.reduce((acc, topic) => {',
  'const grouped = topics.reduce<Record<string, any[]>>((acc: Record<string, any[]>, topic: any) => {'
)

fs.writeFileSync(entityTopicsPath, entityTopicsContent)
console.log('✅ Fixed app/api/entities/[entityId]/topics/route.ts')

// Fix 6: Fix journey-generated.ts Topic interface
const journeyGenPath = './lib/journey-generated.ts'
let journeyGenContent = fs.readFileSync(journeyGenPath, 'utf-8')

// Update Topic interface to include estimatedTime
journeyGenContent = journeyGenContent.replace(
  `interface Topic {
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
}`,
  `interface Topic {
  id: string
  title: string
  description: string
  module_id: string
  position: number
  duration_minutes: number
  estimatedTime?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  learning_outcomes: string[]
  tags: string[]
}`
)

fs.writeFileSync(journeyGenPath, journeyGenContent)
console.log('✅ Fixed lib/journey-generated.ts Topic interface')

// Fix 7: Fix journey.ts types
const journeyPath = './lib/journey.ts'
let journeyContent = fs.readFileSync(journeyPath, 'utf-8')

// Import Topic from journey-generated
if (!journeyContent.includes("import { journeyStructure } from './journey-generated'")) {
  journeyContent = journeyContent.replace(
    "import { getDb } from '@/lib/db'",
    `import { getDb } from '@/lib/db'
import { journeyStructure } from './journey-generated'`
  )
}

// Fix Topic type compatibility - add estimatedTime to mapped topics
journeyContent = journeyContent.replace(
  `topics: module.topics.map(topic => ({
          ...topic,
          tags: topic.tags?.filter((tag: string) => tag !== 'course') || []
        }))`,
  `topics: module.topics.map(topic => ({
          ...topic,
          estimatedTime: topic.duration_minutes,
          tags: topic.tags?.filter((tag: string) => tag !== 'course') || []
        }))`
)

fs.writeFileSync(journeyPath, journeyContent)
console.log('✅ Fixed lib/journey.ts')

// Fix 8: Fix community-profiles route types
const communityProfilesPath = './app/api/community-profiles/route.ts'
if (fs.existsSync(communityProfilesPath)) {
  let communityProfilesContent = fs.readFileSync(communityProfilesPath, 'utf-8')
  
  // Type the profiles query result
  communityProfilesContent = communityProfilesContent.replace(
    ').all()',
    ').all() as any[]'
  )
  
  fs.writeFileSync(communityProfilesPath, communityProfilesContent)
  console.log('✅ Fixed app/api/community-profiles/route.ts')
}

// Fix 9: Fix ideas route
const ideasPath = './app/api/ideas/route.ts'
if (fs.existsSync(ideasPath)) {
  let ideasContent = fs.readFileSync(ideasPath, 'utf-8')
  
  // Add proper typing
  ideasContent = ideasContent.replace(
    ').all()',
    ').all() as any[]'
  )
  
  fs.writeFileSync(ideasPath, ideasContent)
  console.log('✅ Fixed app/api/ideas/route.ts')
}

// Fix 10: Fix all route handler types
const routeFiles = [
  './app/api/case-studies/route.ts',
  './app/api/experiments/route.ts',
  './app/api/explorations/route.ts',
  './app/api/news/route.ts',
  './app/api/papers/route.ts',
  './app/api/tools/route.ts',
  './app/api/mentors/route.ts'
]

for (const file of routeFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8')
    
    // Fix all query results to be typed as any[]
    content = content.replace(/\)\.all\(\)/g, ').all() as any[]')
    content = content.replace(/\)\.get\(/g, ').get(')
    
    // Fix reduce operations
    content = content.replace(
      /\.reduce\((acc, \w+)\s*=>\s*{/g,
      '.reduce((acc: any, item: any) => {'
    )
    
    fs.writeFileSync(file, content)
    console.log(`✅ Fixed ${file}`)
  }
}

// Fix 11: Fix page component types
const pageFiles = [
  './app/resources/case-studies/page.tsx',
  './app/resources/communities/page.tsx',
  './app/resources/ideas-lab/page.tsx',
  './app/resources/news/page.tsx',
  './app/resources/papers/page.tsx',
  './app/resources/tools/page.tsx'
]

for (const file of pageFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8')
    
    // Fix any type errors with fetched data
    content = content.replace(
      /const (\w+) = await response\.json\(\)/g,
      'const $1 = await response.json() as any'
    )
    
    fs.writeFileSync(file, content)
    console.log(`✅ Fixed ${file}`)
  }
}

console.log('\n🎉 All remaining type fixes applied!')
console.log('Run "npm run type-check" to verify.')