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

export async function GET(
  request: Request,
  { params }: { params: { mentorId: string } }
) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Get mentor details
    const entity = db.prepare(`
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
      WHERE e.id = ? AND e.type = 'researcher' AND e.active = 1
    `).get(params.mentorId) as EntityRow | undefined
    
    if (!entity) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      )
    }
    
    // Parse properties for mentor data
    const properties = entity.properties ? JSON.parse(entity.properties) : {}
    const researchAreas = properties.researchAreas || []
    const qualifications = properties.expertise || []
    
    // Get mentor topics with full details
    const topics = db.prepare(`
      SELECT 
        t.id as topic_id,
        t.title as topic_title,
        t.module_id,
        m.title as module_title,
        m.tier_id,
        et.description as mentor_topic_description
      FROM entity_topics et
      JOIN topics t ON et.topic_id = t.id
      JOIN modules m ON t.module_id = m.id
      WHERE et.entity_id = ?
      ORDER BY m.tier_id, m.position, t.position
    `).all(params.mentorId)
    
    // Parse tags and personal note for rating
    const tags = entity.tags ? JSON.parse(entity.tags) : []
    const ratingMatch = entity.personal_note?.match(/Rating:\s*(\d+(?:-\d+)?)/i)
    const rating = ratingMatch ? ratingMatch[1] : null
    
    const enrichedMentor = {
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
    
    return NextResponse.json(enrichedMentor)
  } catch (error) {
    console.error('Error fetching mentor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentor' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}