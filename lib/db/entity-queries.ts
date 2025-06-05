import Database from 'better-sqlite3'
import { getDatabasePath } from '@/lib/db'
import path from 'path'

const DB_PATH = getDatabasePath()

export interface Entity {
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

export interface EntityWithParsedData extends Omit<Entity, 'tags' | 'properties'> {
  tags: string[]
  properties: Record<string, any>
}

export interface EntityTopic {
  entity_id: string
  topic_id: string
  description: string
  relationship_type: string
  context: string | null
  topic_title?: string
}

function parseEntity(entity: Entity): EntityWithParsedData {
  return {
    ...entity,
    tags: JSON.parse(entity.tags || '[]'),
    properties: JSON.parse(entity.properties || '{}')
  }
}

export function getAllEntities(): EntityWithParsedData[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const entities = db.prepare(`
      SELECT * FROM entities 
      WHERE active = 1 
      ORDER BY type, name
    `).all() as Entity[]
    
    return entities.map(parseEntity)
  } finally {
    db.close()
  }
}

export function getEntitiesByType(type: string): EntityWithParsedData[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const entities = db.prepare(`
      SELECT * FROM entities 
      WHERE type = ? AND active = 1 
      ORDER BY name
    `).all(type) as Entity[]
    
    return entities.map(parseEntity)
  } finally {
    db.close()
  }
}

export function getEntityById(id: string): EntityWithParsedData | null {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const entity = db.prepare(`
      SELECT * FROM entities 
      WHERE id = ? AND active = 1
    `).get(id) as Entity | undefined
    
    return entity ? parseEntity(entity) : null
  } finally {
    db.close()
  }
}

export function getEntityTopics(entityId: string): EntityTopic[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const topics = db.prepare(`
      SELECT et.*, t.title as topic_title
      FROM entity_topics et
      JOIN topics t ON et.topic_id = t.id
      WHERE et.entity_id = ?
      ORDER BY et.created_at DESC
    `).all(entityId) as EntityTopic[]
    
    return topics
  } finally {
    db.close()
  }
}

export function searchEntities(query: string): EntityWithParsedData[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const searchTerm = `%${query}%`
    const entities = db.prepare(`
      SELECT * FROM entities 
      WHERE active = 1 
      AND (
        name LIKE ? 
        OR description LIKE ? 
        OR tags LIKE ?
      )
      ORDER BY 
        CASE 
          WHEN name LIKE ? THEN 1
          WHEN description LIKE ? THEN 2
          ELSE 3
        END,
        name
    `).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm) as Entity[]
    
    return entities.map(parseEntity)
  } finally {
    db.close()
  }
}