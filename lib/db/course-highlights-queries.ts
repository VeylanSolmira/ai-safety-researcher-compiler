import Database from 'better-sqlite3'
import { getDatabasePath } from '@/lib/db'
import path from 'path'

const DB_PATH = getDatabasePath()

export interface CourseHighlight {
  id: string
  type: string
  title: string
  description: string
  content_id: string
  tier_id?: string
  topics?: string[]
  tags: string[]
  navigation_path?: string
  order_index?: number
  created_at: string
}

export function getCourseHighlights(): CourseHighlight[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const highlights = db.prepare(`
      SELECT * FROM course_highlights
      ORDER BY order_index, created_at DESC
    `).all() as any[]
    
    return highlights.map((h: any) => ({
      ...h,
      topics: h.topics ? JSON.parse(h.topics) : [],
      tags: h.tags ? JSON.parse(h.tags) : []
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