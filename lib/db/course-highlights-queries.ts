import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = process.env.NODE_ENV === 'production' 
  ? path.join(process.cwd(), 'journey-public.db')
  : path.join(process.cwd(), 'journey-dev.db')

export function getAllCourseHighlights() {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    // For now, return empty array since we don't have a course_highlights table
    // This can be expanded later when the feature is implemented
    return []
  } finally {
    db.close()
  }
}