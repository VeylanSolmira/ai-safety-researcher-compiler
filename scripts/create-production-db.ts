import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const TABLES_TO_EXCLUDE = [
  'users',
  'user_progress', 
  'user_completions',
  'user_choices'
  // Keeping ai_prompts table as requested
  // Timeline tables are kept but user data is cleaned
]

const FIELDS_TO_NULLIFY = {
  'entities': ['personal_note'],
  'ideas': ['quality_rating'], // Keeping warnings as they're helpful disclaimers
  // Note: keeping content_personal as it's a public feature
}

function createProductionDatabase() {
  console.log('Creating production database...')
  
  // Check if dev database exists
  if (!fs.existsSync('./journey-dev.db')) {
    console.log('Development database not found. Creating from journey.db if it exists...')
    if (fs.existsSync('./journey.db')) {
      fs.copyFileSync('./journey.db', './journey-dev.db')
    } else {
      console.error('No database found. Please run db:init first.')
      process.exit(1)
    }
  }
  
  // Create backup of original
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]
  const backupPath = `./journey-dev.db.backup-${timestamp}`
  fs.copyFileSync('./journey-dev.db', backupPath)
  console.log(`Created backup at ${backupPath}`)
  
  // Copy to production database
  fs.copyFileSync('./journey-dev.db', './journey-public.db')
  console.log('Copied database to journey-public.db')
  
  const db = new Database('./journey-public.db')
  db.pragma('foreign_keys = OFF') // Temporarily disable to avoid constraint issues
  
  try {
    // Drop sensitive tables
    console.log('\nDropping sensitive tables:')
    for (const table of TABLES_TO_EXCLUDE) {
      try {
        db.prepare(`DROP TABLE IF EXISTS ${table}`).run()
        console.log(`  ✓ Dropped table: ${table}`)
      } catch (err) {
        console.log(`  ⚠ Could not drop ${table}: ${err.message}`)
      }
    }
    
    // Nullify sensitive fields
    console.log('\nNullifying sensitive fields:')
    for (const [table, fields] of Object.entries(FIELDS_TO_NULLIFY)) {
      for (const field of fields) {
        try {
          const result = db.prepare(`UPDATE ${table} SET ${field} = NULL WHERE ${field} IS NOT NULL`).run()
          if (result.changes > 0) {
            console.log(`  ✓ Nullified ${result.changes} rows in ${table}.${field}`)
          } else {
            console.log(`  - No data to nullify in ${table}.${field}`)
          }
        } catch (err) {
          console.log(`  ⚠ Could not update ${table}.${field}: ${err.message}`)
        }
      }
    }
    
    // Clean timeline tables (as per sanitization requirements)
    console.log('\nCleaning timeline tables:')
    
    // Remove ALL time_blocks (contains user_id and personal planning data)
    try {
      const timeBlockResult = db.prepare(`DELETE FROM time_blocks`).run()
      if (timeBlockResult.changes > 0) {
        console.log(`  ✓ Removed ${timeBlockResult.changes} time blocks (all personal planning data)`)
      } else {
        console.log(`  - No time blocks to remove`)
      }
    } catch (err) {
      console.log(`  ⚠ Could not clean time_blocks: ${err.message}`)
    }
    
    // Remove ALL timeline_items (contains personal tasks and notes)
    try {
      const itemsResult = db.prepare(`DELETE FROM timeline_items`).run()
      if (itemsResult.changes > 0) {
        console.log(`  ✓ Removed ${itemsResult.changes} timeline items (all personal tasks/notes)`)
      } else {
        console.log(`  - No timeline items to remove`)
      }
    } catch (err) {
      console.log(`  ⚠ Could not clean timeline_items: ${err.message}`)
    }
    
    // Remove only PRIVATE timeline templates (keep public ones like MATS template)
    try {
      const templateResult = db.prepare(`
        DELETE FROM timeline_templates 
        WHERE is_public = 0 OR is_public IS NULL
      `).run()
      if (templateResult.changes > 0) {
        console.log(`  ✓ Removed ${templateResult.changes} private timeline templates`)
      } else {
        console.log(`  - No private timeline templates to remove`)
      }
      
      // Show what public templates remain
      const publicTemplates = db.prepare(`
        SELECT COUNT(*) as count FROM timeline_templates WHERE is_public = 1
      `).get() as { count: number }
      if (publicTemplates.count > 0) {
        console.log(`  ✓ Kept ${publicTemplates.count} public timeline templates`)
      }
    } catch (err) {
      console.log(`  ⚠ Could not clean timeline_templates: ${err.message}`)
    }
    
    // Clean up any orphaned data
    console.log('\nCleaning up database:')
    db.prepare('VACUUM').run()
    console.log('  ✓ Database vacuumed')
    
    // Get file sizes for comparison
    const originalSize = fs.statSync('./journey-dev.db').size
    const prodSize = fs.statSync('./journey-public.db').size
    const reduction = ((originalSize - prodSize) / originalSize * 100).toFixed(1)
    
    console.log('\n✅ Production database created successfully!')
    console.log(`   Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   Production size: ${(prodSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   Size reduction: ${reduction}%`)
    
  } catch (error) {
    console.error('Error creating production database:', error)
    throw error
  } finally {
    db.close()
  }
}

// Verify no sensitive data remains
function verifyProductionDatabase() {
  console.log('\nVerifying production database...')
  const db = new Database('./journey-public.db', { readonly: true })
  
  try {
    let issues = 0
    
    // Check that sensitive tables don't exist
    console.log('\nChecking for excluded tables:')
    for (const table of TABLES_TO_EXCLUDE) {
      const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table)
      if (exists) {
        console.log(`  ❌ Table still exists: ${table}`)
        issues++
      } else {
        console.log(`  ✓ Table removed: ${table}`)
      }
    }
    
    // Check that sensitive fields are nullified
    console.log('\nChecking for nullified fields:')
    for (const [table, fields] of Object.entries(FIELDS_TO_NULLIFY)) {
      for (const field of fields) {
        try {
          const result = db.prepare(`SELECT COUNT(*) as count FROM ${table} WHERE ${field} IS NOT NULL`).get()
          if (result.count > 0) {
            console.log(`  ❌ Found ${result.count} non-null values in ${table}.${field}`)
            issues++
          } else {
            console.log(`  ✓ All values null in ${table}.${field}`)
          }
        } catch (err) {
          // Table might not exist, which is fine
          console.log(`  - Skipped ${table}.${field} (table may not exist)`)
        }
      }
    }
    
    // Sample check for any remaining personal data
    console.log('\nChecking for potential personal data patterns:')
    const personalPatterns = [
      { pattern: '%rating:%', description: 'Rating patterns' },
      { pattern: '%personal%', description: 'Personal keywords' },
      { pattern: '%@%', description: 'Email patterns' }
    ]
    
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
    for (const { name: table } of tables) {
      // Skip system tables
      if (table.startsWith('sqlite_')) continue
      
      // Get all text columns
      const columns = db.prepare(`PRAGMA table_info(${table})`).all()
        .filter(col => col.type.includes('TEXT') || col.type.includes('CHAR'))
      
      for (const col of columns) {
        for (const { pattern, description } of personalPatterns) {
          try {
            const result = db.prepare(
              `SELECT COUNT(*) as count FROM ${table} WHERE ${col.name} LIKE ?`
            ).get(pattern)
            
            if (result.count > 0) {
              console.log(`  ⚠ Found ${result.count} potential ${description} in ${table}.${col.name}`)
              // Don't count as critical issue, just warning
            }
          } catch (err) {
            // Column might not be searchable, skip
          }
        }
      }
    }
    
    if (issues === 0) {
      console.log('\n✅ Production database verification passed!')
    } else {
      console.log(`\n❌ Found ${issues} issues that need attention`)
    }
    
    return issues === 0
  } finally {
    db.close()
  }
}

// Main execution
async function main() {
  try {
    createProductionDatabase()
    const isValid = verifyProductionDatabase()
    
    if (!isValid) {
      console.error('\n⚠️  Production database has issues. Please review and fix.')
      process.exit(1)
    }
    
    console.log('\n🎉 Production database is ready for deployment!')
    console.log('   File: ./journey-public.db')
    console.log('   Next step: Add journey-public.db to git and deploy')
    
  } catch (error) {
    console.error('Failed to create production database:', error)
    process.exit(1)
  }
}

main()