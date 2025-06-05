import { NextRequest, NextResponse } from 'next/server'
import { getDatabasePath } from '@/lib/db'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = getDatabasePath()

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

export async function GET(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const paper = db.prepare(`
      SELECT * FROM papers WHERE id = ?
    `).get(params.paperId) as PaperRow | undefined
    
    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      )
    }
    
    // Parse JSON fields
    const parsedPaper = {
      ...paper,
      authors: JSON.parse(paper.authors),
      tags: JSON.parse(paper.tags)
    }
    
    return NextResponse.json(parsedPaper)
  } catch (error) {
    console.error('Error fetching paper:', error)
    return NextResponse.json(
      { error: 'Failed to fetch paper' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const updates = await request.json()
    
    // Build dynamic update query
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
    
    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }
    
    fields.push('updated_at = datetime("now")')
    values.push(params.paperId)
    
    const query = `UPDATE papers SET ${fields.join(', ')} WHERE id = ?`
    const result = db.prepare(query).run(...values)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      changes: result.changes
    })
  } catch (error) {
    console.error('Error updating paper:', error)
    return NextResponse.json(
      { error: 'Failed to update paper' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const result = db.prepare('DELETE FROM papers WHERE id = ?').run(params.paperId)
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      changes: result.changes
    })
  } catch (error) {
    console.error('Error deleting paper:', error)
    return NextResponse.json(
      { error: 'Failed to delete paper' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}