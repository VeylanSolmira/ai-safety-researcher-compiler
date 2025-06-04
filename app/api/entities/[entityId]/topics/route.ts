import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

export async function GET(
  request: Request,
  { params }: { params: { entityId: string } }
) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Get all topics associated with this entity
    const topics = db.prepare(`
      SELECT 
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
      WHERE et.entity_id = ?
      ORDER BY ti.position, m.position, t.position
    `).all(params.entityId)
    
    // Group by relationship type
    const groupedTopics = topics.reduce((acc, topic) => {
      if (!acc[topic.relationship_type]) {
        acc[topic.relationship_type] = []
      }
      acc[topic.relationship_type].push({
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
    }, {} as Record<string, any[]>)
    
    return NextResponse.json(groupedTopics)
  } catch (error) {
    console.error('Error fetching entity topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entity topics' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}