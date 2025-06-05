import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

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

export async function GET(request: NextRequest) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as any
    const importance = searchParams.get('importance') as any
    const search = searchParams.get('search') as any
    
    let query = 'SELECT * FROM papers WHERE 1=1'
    const params: any[] = []
    
    // Add filters
    if (category && category !== 'all') {
      query += ' AND category = ?'
      params.push(category)
    }
    
    if (importance) {
      query += ' AND importance = ?'
      params.push(importance)
    }
    
    // Add search
    if (search) {
      query += ` AND (
        title LIKE ? OR 
        abstract LIKE ? OR
        authors LIKE ? OR
        tags LIKE ?
      )`
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }
    
    // Add ordering
    query += ' ORDER BY year DESC, title ASC'
    
    const papers = db.prepare(query).all(...params) as PaperRow[]
    
    // Parse JSON fields
    const parsedPapers = papers.map((paper: any) => ({
      ...(paper as any),
      authors: JSON.parse(paper.authors),
      tags: JSON.parse(paper.tags)
    }))
    
    return NextResponse.json(parsedPapers)
  } catch (error) {
    console.error('Error fetching papers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}

export async function POST(request: NextRequest) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const paper = await request.json()
    
    // Validate required fields
    if (!paper.id || !paper.title || !paper.authors || !paper.year || 
        !paper.category || !paper.tags || !paper.abstract || !paper.link || 
        !paper.importance) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO papers (
        id, title, authors, year, category, tags, 
        abstract, link, importance, reading_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
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
    
    return NextResponse.json({
      success: true,
      id: paper.id,
      changes: result.changes
    })
  } catch (error) {
    console.error('Error creating paper:', error)
    return NextResponse.json(
      { error: 'Failed to create paper' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}