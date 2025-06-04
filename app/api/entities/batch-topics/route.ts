import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

export async function POST(request: Request) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const { entityIds } = await request.json()
    
    if (!Array.isArray(entityIds) || entityIds.length === 0) {
      return NextResponse.json(
        { error: 'entityIds must be a non-empty array' },
        { status: 400 }
      )
    }
    
    // Create placeholders for SQL IN clause
    const placeholders = entityIds.map(() => '?').join(',')
    
    // Get all topics for all specified entities in one query
    const topics = db.prepare(`
      SELECT 
        et.entity_id,
        t.id,
        t.title,
        t.description,
        t.module_id,
        m.title as module_title,
        m.tier_id,
        ti.title as tier_title,
        et.description as entity_description,
        et.relationship_type,
        et.context
      FROM entity_topics et
      JOIN topics t ON et.topic_id = t.id
      JOIN modules m ON t.module_id = m.id
      JOIN tiers ti ON m.tier_id = ti.id
      WHERE et.entity_id IN (${placeholders})
      ORDER BY et.entity_id, ti.position, m.position, t.position
    `).all(...entityIds)
    
    // Group by entity_id first, then by relationship_type
    const result = topics.reduce((acc, topic) => {
      if (!acc[topic.entity_id]) {
        acc[topic.entity_id] = {}
      }
      
      if (!acc[topic.entity_id][topic.relationship_type]) {
        acc[topic.entity_id][topic.relationship_type] = []
      }
      
      acc[topic.entity_id][topic.relationship_type].push({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        entityDescription: topic.entity_description,
        context: topic.context,
        journey: {
          tierId: topic.tier_id,
          tierTitle: topic.tier_title,
          moduleId: topic.module_id,
          moduleTitle: topic.module_title,
          path: `/journey/${topic.tier_id}/${topic.module_id}/${topic.id}`
        }
      })
      
      return acc
    }, {} as Record<string, Record<string, any[]>>)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching batch entity topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entity topics' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}