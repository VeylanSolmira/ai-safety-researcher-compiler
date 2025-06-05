import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

export interface CourseHighlight {
  id: string
  type: 'concept' | 'paper' | 'tool' | 'researcher' | 'organization' | 'event'
  category: string
  title: string
  description: string
  significance: string
  tags: string[]
  related_topics: string[]
  external_links: Array<{ title: string; url: string }>
  date?: string
  created_at: string
}

export function getCourseHighlights(): CourseHighlight[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const highlights = db.prepare(`
      SELECT * FROM course_highlights
      ORDER BY created_at DESC
    `).all() as any[]
    
    return highlights.map((h: any) => ({
      ...h,
      tags: JSON.parse(h.tags || '[]'),
      related_topics: JSON.parse(h.related_topics || '[]'),
      external_links: JSON.parse(h.external_links || '[]')
    }))
  } finally {
    db.close()
  }
}

export function getCourseHighlightsByType(type: string): CourseHighlight[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const highlights = db.prepare(`
      SELECT * FROM course_highlights
      WHERE type = ?
      ORDER BY created_at DESC
    `).all(type) as any[]
    
    return highlights.map((h: any) => ({
      ...h,
      tags: JSON.parse(h.tags || '[]'),
      related_topics: JSON.parse(h.related_topics || '[]'),
      external_links: JSON.parse(h.external_links || '[]')
    }))
  } finally {
    db.close()
  }
}

export function getCourseHighlightsByCategory(category: string): CourseHighlight[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const highlights = db.prepare(`
      SELECT * FROM course_highlights
      WHERE category = ?
      ORDER BY created_at DESC
    `).all(category) as any[]
    
    return highlights.map((h: any) => ({
      ...h,
      tags: JSON.parse(h.tags || '[]'),
      related_topics: JSON.parse(h.related_topics || '[]'),
      external_links: JSON.parse(h.external_links || '[]')
    }))
  } finally {
    db.close()
  }
}