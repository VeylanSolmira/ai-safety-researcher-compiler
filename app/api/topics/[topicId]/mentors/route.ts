import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // First try mentor_topics table (for backward compatibility)
    let mentors = db.prepare(`
      SELECT 
        m.id,
        m.name,
        o.name as organization_name,
        mt.mentor_topic_description,
        mt.context
      FROM mentor_topics mt
      JOIN mentors m ON mt.mentor_id = m.id
      LEFT JOIN organizations o ON m.organization_id = o.id
      WHERE mt.topic_id = ? AND m.is_active = 1
      ORDER BY m.name
    `).all(params.topicId)
    
    // If no results, try entity_topics table (new system)
    if (mentors.length === 0) {
      mentors = db.prepare(`
        SELECT 
          e.id,
          e.name,
          json_extract(e.properties, '$.organization') as organization_name,
          et.description as mentor_topic_description,
          et.context
        FROM entity_topics et
        JOIN entities e ON et.entity_id = e.id
        WHERE et.topic_id = ? 
          AND e.type = 'researcher' 
          AND e.active = 1
        ORDER BY e.name
      `).all(params.topicId)
    }
    
    return NextResponse.json(mentors)
  } catch (error) {
    console.error('Error fetching mentors for topic:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}