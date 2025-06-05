import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

interface PersonalData {
  entities: Record<string, {
    personal_note: string | null
  }>
  ideas: Record<string, {
    quality_rating: number | null
    warnings: string | null
  }>
  metadata: {
    extracted_at: string
    source_db: string
  }
}

function extractPersonalData() {
  console.log('Extracting personal data from database...')
  
  const db = new Database('./journey-dev.db', { readonly: true })
  const personalData: PersonalData = {
    entities: {},
    ideas: {},
    metadata: {
      extracted_at: new Date().toISOString(),
      source_db: 'journey-dev.db'
    }
  }
  
  try {
    // Extract entity personal notes
    console.log('\nExtracting entity personal notes:')
    const entities = db.prepare(`
      SELECT id, name, personal_note 
      FROM entities 
      WHERE personal_note IS NOT NULL
    `).all()
    
    for (const entity of entities) {
      personalData.entities[entity.id] = {
        personal_note: entity.personal_note
      }
      console.log(`  ✓ ${entity.name}: ${entity.personal_note?.substring(0, 50)}...`)
    }
    console.log(`  Total: ${entities.length} personal notes`)
    
    // Extract idea ratings only (not warnings, as those are kept public)
    console.log('\nExtracting idea ratings:')
    const ideas = db.prepare(`
      SELECT id, title, quality_rating 
      FROM ideas 
      WHERE quality_rating IS NOT NULL
    `).all()
    
    for (const idea of ideas) {
      personalData.ideas[idea.id] = {
        quality_rating: idea.quality_rating,
        warnings: null // No longer extracting warnings
      }
      console.log(`  ✓ ${idea.title}: Rating ${idea.quality_rating}`)
    }
    console.log(`  Total: ${ideas.length} ideas with ratings`)
    
    // Save to JSON file
    const outputPath = './data/personal-data.json'
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, JSON.stringify(personalData, null, 2))
    
    console.log(`\n✅ Personal data extracted to: ${outputPath}`)
    console.log('   This file is gitignored and won\'t be committed')
    
    // Also create a personal SQLite database for more complex queries
    createPersonalDatabase(personalData)
    
  } catch (error) {
    console.error('Error extracting personal data:', error)
    throw error
  } finally {
    db.close()
  }
}

function createPersonalDatabase(personalData: PersonalData) {
  console.log('\nCreating personal overlay database...')
  
  const db = new Database('./journey-personal.db')
  
  try {
    // Create tables for personal data
    db.prepare(`
      CREATE TABLE IF NOT EXISTS entity_personal (
        entity_id TEXT PRIMARY KEY,
        personal_note TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
    
    db.prepare(`
      CREATE TABLE IF NOT EXISTS idea_personal (
        idea_id TEXT PRIMARY KEY,
        quality_rating INTEGER,
        warnings TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run()
    
    // Insert entity personal data
    const entityStmt = db.prepare(`
      INSERT OR REPLACE INTO entity_personal (entity_id, personal_note, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `)
    
    for (const [id, data] of Object.entries(personalData.entities)) {
      entityStmt.run(id, data.personal_note)
    }
    
    // Insert idea personal data
    const ideaStmt = db.prepare(`
      INSERT OR REPLACE INTO idea_personal (idea_id, quality_rating, warnings, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `)
    
    for (const [id, data] of Object.entries(personalData.ideas)) {
      ideaStmt.run(id, data.quality_rating, data.warnings)
    }
    
    console.log('✅ Personal database created: ./journey-personal.db')
    
  } finally {
    db.close()
  }
}

// Utility to re-apply personal data after database updates
export function reapplyPersonalData() {
  console.log('Re-applying personal data to development database...')
  
  const personalDataPath = './data/personal-data.json'
  if (!fs.existsSync(personalDataPath)) {
    console.log('No personal data file found. Run extract-personal-data first.')
    return
  }
  
  const personalData: PersonalData = JSON.parse(fs.readFileSync(personalDataPath, 'utf-8'))
  const db = new Database('./journey-dev.db')
  
  try {
    db.pragma('foreign_keys = OFF')
    
    // Update entities
    const entityStmt = db.prepare('UPDATE entities SET personal_note = ? WHERE id = ?')
    for (const [id, data] of Object.entries(personalData.entities)) {
      entityStmt.run(data.personal_note, id)
    }
    
    // Update ideas
    const ideaStmt = db.prepare('UPDATE ideas SET quality_rating = ?, warnings = ? WHERE id = ?')
    for (const [id, data] of Object.entries(personalData.ideas)) {
      ideaStmt.run(data.quality_rating, data.warnings, id)
    }
    
    console.log('✅ Personal data re-applied to development database')
    
  } finally {
    db.close()
  }
}

// Main execution
if (require.main === module) {
  extractPersonalData()
}