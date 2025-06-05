import { NextResponse } from 'next/server'
import { getDatabasePath } from '@/lib/db'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = getDatabasePath()

interface EntityRow {
  id: string
  name: string
  type: string
  description: string
  tags: string | null
  properties: string | null
  personal_note: string | null
  active: number
}

export async function GET() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const query = `
      SELECT 
        e.id,
        e.name,
        e.type,
        e.description,
        e.tags,
        e.properties,
        e.personal_note,
        e.active
      FROM entities e
      WHERE e.type = 'researcher' AND e.active = 1
      ORDER BY e.name
    `
    
    const entities = db.prepare(query).all() as any[] as any[] as any[] as EntityRow[]
    
    // Transform entities to mentor format
    const enrichedMentors = entities.map((entity: EntityRow) => {
      // Parse properties JSON
      const properties = entity.properties ? JSON.parse(entity.properties) : {}
      
      // Get research areas from properties
      const researchAreas = properties.researchAreas || []
      
      // Get qualifications from expertise or background
      const qualifications = properties.expertise || []
      
      // Get mentor topics
      const topics = db.prepare(`
        SELECT 
          t.id as topic_id,
          t.title as topic_title,
          et.description as mentor_topic_description
        FROM entity_topics et
        JOIN topics t ON et.topic_id = t.id
        WHERE et.entity_id = ?
      `).all(entity.id)
      
      // Parse tags to check for quick eval rating
      const tags = entity.tags ? JSON.parse(entity.tags) : []
      const ratingMatch = entity.personal_note?.match(/Rating:\s*(\d+(?:-\d+)?)/i)
      const rating = ratingMatch ? ratingMatch[1] : null
      
      return {
        id: entity.id,
        name: entity.name,
        biography: entity.description,
        email: properties.email || null,
        website: properties.website || null,
        organization: properties.organization ? {
          name: properties.organization,
          type: 'research'
        } : null,
        researchAreas,
        qualifications,
        topics,
        quickEvaluation: rating ? {
          rating: rating,
          notes: entity.personal_note
        } : null,
        is_active: entity.active
      }
    })
    
    return NextResponse.json(enrichedMentors)
  } catch (error) {
    console.error('Error fetching mentors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}