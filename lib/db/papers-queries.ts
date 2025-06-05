import Database from 'better-sqlite3'
import { getDatabasePath } from '@/lib/db'
import path from 'path'

const DB_PATH = getDatabasePath()

export interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  category: 'foundational' | 'alignment' | 'interpretability' | 'governance' | 'technical' | 'philosophy'
  tags: string[]
  abstract: string
  link: string
  importance: 'essential' | 'important' | 'useful'
  reading_time?: string | null
  created_at?: string
  updated_at?: string
}

interface PaperRow {
  id: string
  title: string
  authors: string
  year: number
  category: string
  tags: string
  abstract: string
  link: string
  importance: string
  reading_time: string | null
  created_at: string
  updated_at: string
}

export function getAllPapers(): Paper[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const papers = db.prepare(`
      SELECT * FROM papers 
      ORDER BY year DESC, title ASC
    `).all() as PaperRow[]
    
    return papers.map(parsePaperRow)
  } finally {
    db.close()
  }
}

export function getPapersByCategory(category: string): Paper[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const papers = db.prepare(`
      SELECT * FROM papers 
      WHERE category = ?
      ORDER BY year DESC, title ASC
    `).all(category) as PaperRow[]
    
    return papers.map(parsePaperRow)
  } finally {
    db.close()
  }
}

export function getPapersByImportance(importance: string): Paper[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const papers = db.prepare(`
      SELECT * FROM papers 
      WHERE importance = ?
      ORDER BY year DESC, title ASC
    `).all(importance) as PaperRow[]
    
    return papers.map(parsePaperRow)
  } finally {
    db.close()
  }
}

export function searchPapers(query: string): Paper[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const searchPattern = `%${query}%`
    const papers = db.prepare(`
      SELECT * FROM papers 
      WHERE title LIKE ? 
         OR abstract LIKE ?
         OR authors LIKE ?
         OR tags LIKE ?
      ORDER BY 
        CASE 
          WHEN title LIKE ? THEN 1
          WHEN authors LIKE ? THEN 2
          ELSE 3
        END,
        year DESC, 
        title ASC
    `).all(
      searchPattern, searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern
    ) as PaperRow[]
    
    return papers.map(parsePaperRow)
  } finally {
    db.close()
  }
}

export function getPaperById(id: string): Paper | null {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const paper = db.prepare(`
      SELECT * FROM papers WHERE id = ?
    `).get(id) as PaperRow | undefined
    
    return paper ? parsePaperRow(paper) : null
  } finally {
    db.close()
  }
}

export function getEssentialPapers(): Paper[] {
  return getPapersByImportance('essential')
}

export function getRecentPapers(limit: number = 5): Paper[] {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const papers = db.prepare(`
      SELECT * FROM papers 
      ORDER BY year DESC, created_at DESC
      LIMIT ?
    `).all(limit) as PaperRow[]
    
    return papers.map(parsePaperRow)
  } finally {
    db.close()
  }
}

export function getPaperStats() {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM papers').get() as { count: number }
    
    const byCategory = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM papers 
      GROUP BY category
    `).all() as { category: string; count: number }[]
    
    const byImportance = db.prepare(`
      SELECT importance, COUNT(*) as count 
      FROM papers 
      GROUP BY importance
    `).all() as { importance: string; count: number }[]
    
    const byYear = db.prepare(`
      SELECT year, COUNT(*) as count 
      FROM papers 
      GROUP BY year
      ORDER BY year DESC
    `).all() as { year: number; count: number }[]
    
    return {
      total: totalCount.count,
      byCategory,
      byImportance,
      byYear
    }
  } finally {
    db.close()
  }
}

// Helper function to parse database row to Paper object
function parsePaperRow(row: PaperRow): Paper {
  return {
    ...row,
    category: row.category as Paper['category'],
    importance: row.importance as Paper['importance'],
    authors: JSON.parse((row as any).authors || "[]"),
    tags: JSON.parse((row as any).tags || "[]"),
    reading_time: row.reading_time
  }
}

// Write operations (for admin use)
export function addPaper(paper: Omit<Paper, 'created_at' | 'updated_at'>): void {
  const db = new Database(DB_PATH)
  
  try {
    const stmt = db.prepare(`
      INSERT INTO papers (
        id, title, authors, year, category, tags, 
        abstract, link, importance, reading_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      paper.id,
      paper.title,
      JSON.stringify(paper.authors),
      paper.year,
      paper.category,
      JSON.stringify(paper.tags),
      paper.abstract,
      paper.link,
      paper.importance,
      paper.reading_time || null
    )
  } finally {
    db.close()
  }
}

export function updatePaper(id: string, updates: Partial<Paper>): void {
  const db = new Database(DB_PATH)
  
  try {
    const fields = []
    const values = []
    
    if (updates.title !== undefined) {
      fields.push('title = ?')
      values.push(updates.title)
    }
    if (updates.authors !== undefined) {
      fields.push('authors = ?')
      values.push(JSON.stringify(updates.authors))
    }
    if (updates.year !== undefined) {
      fields.push('year = ?')
      values.push(updates.year)
    }
    if (updates.category !== undefined) {
      fields.push('category = ?')
      values.push(updates.category)
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?')
      values.push(JSON.stringify(updates.tags))
    }
    if (updates.abstract !== undefined) {
      fields.push('abstract = ?')
      values.push(updates.abstract)
    }
    if (updates.link !== undefined) {
      fields.push('link = ?')
      values.push(updates.link)
    }
    if (updates.importance !== undefined) {
      fields.push('importance = ?')
      values.push(updates.importance)
    }
    if (updates.reading_time !== undefined) {
      fields.push('reading_time = ?')
      values.push(updates.reading_time)
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = datetime("now")')
      values.push(id)
      
      const query = `UPDATE papers SET ${fields.join(', ')} WHERE id = ?`
      db.prepare(query).run(...values)
    }
  } finally {
    db.close()
  }
}

export function deletePaper(id: string): void {
  const db = new Database(DB_PATH)
  
  try {
    db.prepare('DELETE FROM papers WHERE id = ?').run(id)
  } finally {
    db.close()
  }
}