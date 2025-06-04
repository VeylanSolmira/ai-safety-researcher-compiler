import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

interface BatchValidationRequest {
  topicIds?: string[]
  contentType?: 'academic' | 'personal' | 'both'
  revalidate?: boolean // Force revalidation of already validated citations
}

export async function POST(request: NextRequest) {
  const db = new Database(DB_PATH)
  
  try {
    const body: BatchValidationRequest = await request.json()
    const contentType = body.contentType || 'both'
    
    // Build query
    let query = `
      SELECT 
        cv.id,
        cv.topic_id,
        cv.content_type,
        cv.citation_text,
        cv.validation_status,
        cv.confidence,
        cv.suggested_fix,
        t.title as topic_title
      FROM citation_validations cv
      JOIN topics t ON cv.topic_id = t.id
      WHERE 1=1
    `
    
    const params: any[] = []
    
    if (body.topicIds && body.topicIds.length > 0) {
      query += ` AND cv.topic_id IN (${body.topicIds.map(() => '?').join(',')})`
      params.push(...body.topicIds)
    }
    
    if (contentType !== 'both') {
      query += ' AND cv.content_type = ?'
      params.push(contentType)
    }
    
    if (!body.revalidate) {
      query += ' AND cv.validation_status = "unverified"'
    }
    
    query += ' ORDER BY cv.topic_id, cv.id'
    
    const citations = db.prepare(query).all(...params)
    
    // Group by topic
    const byTopic = citations.reduce((acc, citation) => {
      if (!acc[citation.topic_id]) {
        acc[citation.topic_id] = {
          topicId: citation.topic_id,
          topicTitle: citation.topic_title,
          citations: []
        }
      }
      acc[citation.topic_id].citations.push(citation)
      return acc
    }, {} as Record<string, any>)
    
    // Calculate statistics
    const stats = {
      totalTopics: Object.keys(byTopic).length,
      totalCitations: citations.length,
      byStatus: citations.reduce((acc, c) => {
        acc[c.validation_status] = (acc[c.validation_status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      needsAttention: citations.filter(c => 
        c.validation_status === 'broken' || 
        c.validation_status === 'hallucinated' ||
        c.validation_status === 'suspicious'
      ).length
    }
    
    return NextResponse.json({
      stats,
      topics: Object.values(byTopic),
      priorities: citations
        .filter(c => c.validation_status !== 'verified')
        .slice(0, 20)
        .map(c => ({
          id: c.id,
          topicId: c.topic_id,
          text: c.citation_text,
          status: c.validation_status,
          suggestion: c.suggested_fix
        }))
    })
    
  } catch (error) {
    console.error('Error in batch validation:', error)
    return NextResponse.json(
      { error: 'Failed to validate batch' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}