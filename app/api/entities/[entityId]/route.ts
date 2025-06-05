import { NextResponse } from 'next/server'
import { getDatabasePath } from '@/lib/db'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = getDatabasePath()

export async function GET(
  request: Request,
  { params }: { params: { entityId: string } }
) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Get entity details
    const entity = db.prepare(`
      SELECT 
        id,
        name,
        type,
        description,
        tags,
        properties,
        personal_note,
        active
      FROM entities
      WHERE id = ? AND active = 1
    `).get(params.entityId) as any as any
    
    if (!entity) {
      return NextResponse.json(
        { error: 'Entity not found' },
        { status: 404 }
      )
    }
    
    // Parse JSON fields
    const parsedEntity = {
      ...(entity as any),
      tags: entity.tags ? JSON.parse(entity.tags) : [],
      properties: entity.properties ? JSON.parse(entity.properties) : {},
      active: Boolean(entity.active)
    }
    
    // Get related topics for this entity
    const relatedTopics = db.prepare(`
      SELECT 
        t.id as topic_id,
        t.title as topic_title,
        et.relationship_type
      FROM entity_topics et
      JOIN topics t ON t.id = et.topic_id
      WHERE et.entity_id = ?
      ORDER BY et.relationship_type, t.title
    `).all(params.entityId)
    
    // Get topic count
    const topicCount = db.prepare(`
      SELECT COUNT(*) as count, relationship_type
      FROM entity_topics
      WHERE entity_id = ?
      GROUP BY relationship_type
    `).all(params.entityId)
    
    return NextResponse.json({
      ...(parsedEntity as any),
      relatedTopics,
      topicCounts: topicCount
    })
  } catch (error) {
    console.error('Error fetching entity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entity' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}