import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const PROD_DB_PATH = './journey-public.db'

// Tables that should be completely absent
const FORBIDDEN_TABLES = [
  'users',
  'user_progress',
  'user_completions',
  'user_choices'
]

// Fields that must be NULL in production
const REQUIRED_NULL_FIELDS = {
  'entities': ['personal_note'],
  'ideas': ['quality_rating']
}

// Patterns that might indicate personal data
const SUSPICIOUS_PATTERNS = [
  { pattern: '%rating:%', description: 'Rating patterns' },
  { pattern: '%Rating:%', description: 'Rating patterns' },
  { pattern: '%personal note%', description: 'Personal note markers' },
  { pattern: '%TODO:%', description: 'Personal TODO markers' },
  { pattern: '%NOTE:%', description: 'Personal NOTE markers' }
]

function validateProductionDatabase(): boolean {
  if (!fs.existsSync(PROD_DB_PATH)) {
    console.error(`❌ Production database not found at ${PROD_DB_PATH}`)
    console.error('   Run "npm run db:create-prod" first')
    return false
  }

  const db = new Database(PROD_DB_PATH, { readonly: true })
  let hasErrors = false
  let hasWarnings = false

  try {
    console.log('🔍 Validating production database...\n')

    // Check for forbidden tables
    console.log('Checking for forbidden tables:')
    for (const table of FORBIDDEN_TABLES) {
      const exists = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
      ).get(table)
      
      if (exists) {
        console.error(`  ❌ FAIL: Table '${table}' exists (should be removed)`)
        hasErrors = true
      } else {
        console.log(`  ✅ PASS: Table '${table}' removed`)
      }
    }

    // Check for required NULL fields
    console.log('\nChecking for nullified personal fields:')
    for (const [table, fields] of Object.entries(REQUIRED_NULL_FIELDS)) {
      // Check if table exists first
      const tableExists = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
      ).get(table)
      
      if (!tableExists) {
        console.log(`  ⚠️  SKIP: Table '${table}' doesn't exist`)
        continue
      }

      for (const field of fields) {
        try {
          const result = db.prepare(
            `SELECT COUNT(*) as count FROM ${table} WHERE ${field} IS NOT NULL`
          ).get() as { count: number }
          
          if (result.count > 0) {
            console.error(`  ❌ FAIL: Found ${result.count} non-null values in ${table}.${field}`)
            hasErrors = true
          } else {
            console.log(`  ✅ PASS: All values null in ${table}.${field}`)
          }
        } catch (err) {
          console.log(`  ⚠️  SKIP: Field ${table}.${field} doesn't exist`)
        }
      }
    }

    // Check timeline tables are properly cleaned
    console.log('\nChecking timeline tables:')
    
    // time_blocks should be completely empty
    try {
      const timeBlockCount = db.prepare(
        `SELECT COUNT(*) as count FROM time_blocks`
      ).get() as { count: number }
      
      if (timeBlockCount > 0) {
        console.error(`  ❌ FAIL: Found ${timeBlockCount} rows in time_blocks (should be empty)`)
        hasErrors = true
      } else {
        console.log(`  ✅ PASS: time_blocks table is empty`)
      }
    } catch (err) {
      console.log(`  - time_blocks table not found`)
    }
    
    // timeline_items should be completely empty
    try {
      const itemCount = db.prepare(
        `SELECT COUNT(*) as count FROM timeline_items`
      ).get() as { count: number }
      
      if (itemCount > 0) {
        console.error(`  ❌ FAIL: Found ${itemCount} rows in timeline_items (should be empty)`)
        hasErrors = true
      } else {
        console.log(`  ✅ PASS: timeline_items table is empty`)
      }
    } catch (err) {
      console.log(`  - timeline_items table not found`)
    }
    
    // timeline_templates should only have public templates
    try {
      const privateCount = db.prepare(
        `SELECT COUNT(*) as count FROM timeline_templates WHERE is_public = 0 OR is_public IS NULL`
      ).get() as { count: number }
      
      if (privateCount > 0) {
        console.error(`  ❌ FAIL: Found ${privateCount} private templates in timeline_templates`)
        hasErrors = true
      } else {
        const publicCount = db.prepare(
          `SELECT COUNT(*) as count FROM timeline_templates WHERE is_public = 1`
        ).get() as { count: number }
        console.log(`  ✅ PASS: Only public templates remain (${publicCount} templates)`)
      }
    } catch (err) {
      console.log(`  - timeline_templates table not found`)
    }

    // Check for suspicious content patterns
    console.log('\nChecking for suspicious content patterns:')
    let suspiciousFindings = 0
    
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all() as { name: string }[]
    
    for (const { name: table } of tables) {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all()
        .filter((col: any) => col.type.includes('TEXT') || col.type.includes('CHAR'))
        .map((col: any) => col.name)
      
      for (const column of columns) {
        for (const { pattern, description } of SUSPICIOUS_PATTERNS) {
          try {
            const result = db.prepare(
              `SELECT COUNT(*) as count FROM ${table} WHERE ${column} LIKE ?`
            ).get(pattern) as { count: number }
            
            if (result.count > 0) {
              console.warn(`  ⚠️  WARNING: Found ${result.count} ${description} in ${table}.${column}`)
              suspiciousFindings += result.count
              hasWarnings = true
            }
          } catch (err) {
            // Column might not be searchable, skip
          }
        }
      }
    }
    
    if (suspiciousFindings === 0) {
      console.log('  ✅ PASS: No suspicious patterns found')
    }

    // Final summary
    console.log('\n' + '='.repeat(50))
    if (hasErrors) {
      console.error('\n❌ VALIDATION FAILED: Personal data detected in production database')
      console.error('   Run "npm run db:create-prod" to properly sanitize the database')
      return false
    } else if (hasWarnings) {
      console.warn('\n⚠️  VALIDATION PASSED WITH WARNINGS')
      console.warn('   Review warnings above to ensure no personal data leaked')
      return true
    } else {
      console.log('\n✅ VALIDATION PASSED: Production database is clean')
      return true
    }

  } catch (error) {
    console.error('❌ Validation error:', error)
    return false
  } finally {
    db.close()
  }
}

// Run validation
const isValid = validateProductionDatabase()
process.exit(isValid ? 0 : 1)