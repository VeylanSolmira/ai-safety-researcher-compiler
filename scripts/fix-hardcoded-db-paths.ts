#!/usr/bin/env tsx
/**
 * Fix all hardcoded database paths to use the centralized getDatabasePath function
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

// Files to update based on our search results
const filesToUpdate = [
  'lib/db/explorations-queries.ts',
  'lib/db/ideas-queries.ts',
  'lib/db/news-queries.ts',
  'lib/db/entity-queries.ts',
  'lib/db/timeline-queries.ts',
  'lib/db/papers-queries.ts',
  'lib/db/setup.ts',
  'lib/db/mentor-queries.ts',
  'lib/db/course-highlights-queries.ts',
  'lib/db/case-studies-queries.ts',
  'lib/db/resource-queries.ts',
  'lib/db/experiments-queries.ts',
  'lib/db/community-profiles-queries.ts',
  'app/api/tools/route.ts',
  'app/api/papers/route.ts',
  'app/api/papers/[paperId]/route.ts',
  'app/api/mentors/[mentorId]/route.ts',
  'app/api/mentors/route.ts',
  'app/api/citations/validate/route.ts',
  'app/api/citations/report/[topicId]/route.ts',
  'app/api/entities/[entityId]/route.ts',
  'app/api/entities/route.ts',
  'app/api/entities/batch-topics/route.ts',
  'app/api/topics/[topicId]/mentors/route.ts',
  'app/api/topics/[topicId]/add-toc/route.ts'
]

// Pattern to match hardcoded DB_PATH
const DB_PATH_PATTERN = /const DB_PATH = (?:path\.join\(process\.cwd\(\), 'journey\.db'\)|join\(process\.cwd\(\), 'journey\.db'\))/g

// Replacement text
const REPLACEMENT = `import { getDatabasePath } from '@/lib/db'

const DB_PATH = getDatabasePath()`

let updatedCount = 0

for (const filePath of filesToUpdate) {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`)
      continue
    }
    
    let content = fs.readFileSync(fullPath, 'utf-8')
    const originalContent = content
    
    // Check if file already imports getDatabasePath
    if (content.includes('getDatabasePath')) {
      console.log(`✓ Already updated: ${filePath}`)
      continue
    }
    
    // Check if file has the hardcoded pattern
    if (!content.includes("'journey.db'")) {
      console.log(`⚠️  No hardcoded path found: ${filePath}`)
      continue
    }
    
    // Add import at the top if not present
    if (!content.includes("import { getDatabasePath } from '@/lib/db'")) {
      // Find the right place to add the import (after other imports)
      const importMatch = content.match(/^import .* from ['"].*['"]$/m)
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length
        content = content.slice(0, lastImportIndex) + 
          "\nimport { getDatabasePath } from '@/lib/db'" + 
          content.slice(lastImportIndex)
      } else {
        // No imports found, add at the beginning
        content = "import { getDatabasePath } from '@/lib/db'\n\n" + content
      }
    }
    
    // Replace the hardcoded DB_PATH
    content = content.replace(
      /const DB_PATH = (?:path\.)?(?:join\(process\.cwd\(\), 'journey\.db'\))/g,
      'const DB_PATH = getDatabasePath()'
    )
    
    // For files that use 'join' without 'path.join'
    if (content.includes("join(process.cwd(), 'journey.db')") && !content.includes('path.join')) {
      // Remove the join import if it exists
      content = content.replace(/import { join } from 'path'\n?/g, '')
      content = content.replace(/import {([^}]*), join([^}]*)} from 'path'/g, 'import {$1$2} from \'path\'')
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content)
      console.log(`✅ Updated: ${filePath}`)
      updatedCount++
    } else {
      console.log(`⚠️  No changes made: ${filePath}`)
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error)
  }
}

console.log(`\n🎉 Updated ${updatedCount} files`)
console.log('\nNext steps:')
console.log('1. Review the changes')
console.log('2. Run npm run type-check to ensure no TypeScript errors')
console.log('3. Test locally to ensure everything works')
console.log('4. Commit and push the changes')