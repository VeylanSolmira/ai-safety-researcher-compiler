import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

interface Entity {
  id: string
  name: string
  type: 'researcher' | 'organization' | 'platform'
  description: string
  tags: string
  properties: string
  personal_note: string | null
  active: number
  created_at: string
  updated_at: string
}

async function showCurrentEntities() {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    console.log('=== Current Entities in Database ===\n')
    
    // Get total count
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM entities WHERE active = 1').get() as { count: number }
    console.log(`Total active entities: ${totalCount.count}\n`)
    
    // Get counts by type
    const typeCounts = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM entities 
      WHERE active = 1 
      GROUP BY type 
      ORDER BY type
    `).all() as { type: string; count: number }[]
    
    console.log('Counts by type:')
    typeCounts.forEach(({ type, count }) => {
      console.log(`  ${type}: ${count}`)
    })
    console.log()
    
    // Get all entities
    const entities = db.prepare(`
      SELECT * FROM entities 
      WHERE active = 1 
      ORDER BY type, name
    `).all() as Entity[]
    
    // Group by type for better display
    const groupedEntities = entities.reduce((acc, entity) => {
      if (!acc[entity.type]) acc[entity.type] = []
      acc[entity.type].push(entity)
      return acc
    }, {} as Record<string, Entity[]>)
    
    // Display entities by type
    Object.entries(groupedEntities).forEach(([type, typeEntities]) => {
      console.log(`\n=== ${type.toUpperCase()}S ===`)
      typeEntities.forEach(entity => {
        const tags = JSON.parse(entity.tags || '[]')
        const properties = JSON.parse(entity.properties || '{}')
        
        console.log(`\nID: ${entity.id}`)
        console.log(`Name: ${entity.name}`)
        console.log(`Description: ${entity.description}`)
        console.log(`Tags: ${tags.join(', ') || 'none'}`)
        
        // Show relevant properties
        const propKeys = Object.keys(properties)
        if (propKeys.length > 0) {
          console.log('Properties:')
          propKeys.forEach(key => {
            console.log(`  ${key}: ${properties[key]}`)
          })
        }
        
        if (entity.personal_note) {
          console.log(`Personal Note: ${entity.personal_note}`)
        }
      })
    })
    
    // Check for entity_topics relationships
    console.log('\n\n=== Entity-Topic Relationships ===')
    const relationshipCount = db.prepare(`
      SELECT COUNT(*) as count 
      FROM entity_topics
    `).get() as { count: number }
    
    console.log(`Total entity-topic relationships: ${relationshipCount.count}`)
    
    if (relationshipCount.count > 0) {
      const sampleRelationships = db.prepare(`
        SELECT et.*, e.name as entity_name, t.title as topic_title
        FROM entity_topics et
        JOIN entities e ON et.entity_id = e.id
        JOIN topics t ON et.topic_id = t.id
        LIMIT 10
      `).all()
      
      console.log('\nSample relationships (first 10):')
      sampleRelationships.forEach((rel: any) => {
        console.log(`  ${rel.entity_name} → ${rel.topic_title} (${rel.relationship_type})`)
      })
    }
    
  } catch (error) {
    console.error('Error reading entities:', error)
  } finally {
    db.close()
  }
}

showCurrentEntities().catch(console.error)