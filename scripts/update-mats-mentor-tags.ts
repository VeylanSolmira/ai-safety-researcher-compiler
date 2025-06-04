#!/usr/bin/env tsx
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dbPath = join(__dirname, '..', 'journey.db')

const db = new Database(dbPath)

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON')

async function updateMentorTags() {
  console.log('Updating mentor tags and properties...\n')
  
  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION')
    
    // Get all MATS mentors
    const matsMentors = db.prepare(`
      SELECT id, name, tags, properties 
      FROM entities 
      WHERE type = 'researcher' 
      AND tags LIKE '%mats-mentor-2025%'
    `).all()
    
    console.log(`Found ${matsMentors.length} MATS mentors to update`)
    
    // Update each mentor
    const updateStmt = db.prepare(`
      UPDATE entities 
      SET tags = ?, properties = ?
      WHERE id = ?
    `)
    
    for (const mentor of matsMentors) {
      const tags = JSON.parse(mentor.tags)
      const properties = JSON.parse(mentor.properties)
      
      // Add generic "mentor" tag if not present
      if (!tags.includes('mentor')) {
        tags.push('mentor')
      }
      
      // Add isMentor property
      properties.isMentor = true
      
      // Run update
      updateStmt.run(
        JSON.stringify(tags),
        JSON.stringify(properties),
        mentor.id
      )
      
      console.log(`✅ Updated ${mentor.name}`)
    }
    
    // Also update CBAI mentors if they exist
    console.log('\nChecking CBAI mentors...')
    const cbaiMentors = db.prepare(`
      SELECT id, name, tags, properties 
      FROM entities 
      WHERE type = 'researcher' 
      AND tags LIKE '%cbai-mentor%'
    `).all()
    
    console.log(`Found ${cbaiMentors.length} CBAI mentors`)
    
    for (const mentor of cbaiMentors) {
      const tags = JSON.parse(mentor.tags)
      const properties = JSON.parse(mentor.properties)
      
      // Add generic "mentor" tag if not present
      if (!tags.includes('mentor')) {
        tags.push('mentor')
      }
      
      // Add isMentor property
      properties.isMentor = true
      
      // Run update
      updateStmt.run(
        JSON.stringify(tags),
        JSON.stringify(properties),
        mentor.id
      )
      
      console.log(`✅ Updated ${mentor.name}`)
    }
    
    // Commit transaction
    db.exec('COMMIT')
    
    // Verify updates
    console.log('\n📊 Verification:')
    const mentorCount = db.prepare(`
      SELECT COUNT(*) as count 
      FROM entities 
      WHERE type = 'researcher' 
      AND tags LIKE '%mentor%'
    `).get()
    
    console.log(`Total entities with 'mentor' tag: ${mentorCount.count}`)
    
    // Show a sample
    const sample = db.prepare(`
      SELECT name, tags, properties 
      FROM entities 
      WHERE type = 'researcher' 
      AND tags LIKE '%mentor%'
      LIMIT 3
    `).all()
    
    console.log('\nSample updated mentors:')
    sample.forEach(m => {
      const props = JSON.parse(m.properties)
      console.log(`- ${m.name}: isMentor = ${props.isMentor}`)
    })
    
  } catch (error) {
    db.exec('ROLLBACK')
    console.error('Error updating mentor tags:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the script
updateMentorTags().catch(console.error)