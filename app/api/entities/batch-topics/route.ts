import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

interface Topic {
  entity_id: string
  id: string
  title: string
  tier_id: string
  module_id: string
  position: number
  tier_position?: number
  module_position?: number
  relationship_type: string
}

export async function POST(request: NextRequest) {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const { entityIds } = await request.json()
    
    if (!entityIds || !Array.isArray(entityIds)) {
      return NextResponse.json(
        { error: 'entityIds must be an array' },
        { status: 400 }
      )
    }
    
    const placeholders = entityIds.map(() => '?').join(',')
    const topics = db.prepare(`
      SELECT 
        et.entity_id,
        t.id,
        t.title,
        t.tier_id,
        t.module_id,
        t.position,
        ti.position as tier_position,
        m.position as module_position,
        et.relationship_type
      FROM entity_topics et
      JOIN topics t ON et.topic_id = t.id
      LEFT JOIN modules m ON t.module_id = m.id
      LEFT JOIN tiers ti ON t.tier_id = ti.id
      WHERE et.entity_id IN (${placeholders})
      ORDER BY et.entity_id, ti.position, m.position, t.position
    `).all(...entityIds) as Topic[]
    
    // Group by entity_id and then by relationship_type
    const grouped = topics.reduce<Record<string, Record<string, Topic[]>>>((acc, topic) => {
      if (!acc[topic.entity_id]) {
        acc[topic.entity_id] = {}
      }
      if (!acc[topic.entity_id][topic.relationship_type]) {
        acc[topic.entity_id][topic.relationship_type] = []
      }
      acc[topic.entity_id][topic.relationship_type].push({
        entity_id: topic.entity_id,
        id: topic.id,
        title: topic.title,
        tier_id: topic.tier_id,
        module_id: topic.module_id,
        position: topic.position,
        tier_position: topic.tier_position,
        module_position: topic.module_position,
        relationship_type: topic.relationship_type
      })
      return acc
    }, {})
    
    return NextResponse.json(grouped)
  } catch (error) {
    console.error('Error fetching batch topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch batch topics' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}
