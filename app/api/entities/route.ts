import { NextResponse } from 'next/server'
import { getDatabasePath } from '@/lib/db'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = getDatabasePath()

export async function GET(request: Request) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as any // Filter by type
    const featured = searchParams.get('featured') as any // Show only featured
    
    let query = `
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
      WHERE active = 1
    `
    
    const params: any[] = []
    
    // Add filters
    if (type && type !== 'all') {
      // Allow comma-separated types
      const types = type.split(',')
      query += ` AND type IN (${types.map(() => '?').join(',')})`
      params.push(...types)
    }
    
    query += ` ORDER BY type, name`
    
    const stmt = db.prepare(query)
    const entities = stmt.all(...params)
    
    // Parse JSON fields
    const parsedEntities = entities.map((entity: any) => ({
      ...(entity as any),
      tags: entity.tags ? JSON.parse(entity.tags) : [],
      properties: entity.properties ? JSON.parse(entity.properties) : {},
      active: Boolean(entity.active)
    }))
    
    return NextResponse.json(parsedEntities)
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}