import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

export async function GET(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    // Get topic info
    const topic = db.prepare(`
      SELECT id, title 
      FROM topics 
      WHERE id = ?
    `).get(params.topicId)
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }
    
    // Get all citations for this topic
    const citations = db.prepare(`
      SELECT 
        cv.*,
        kp.title as matched_paper_title,
        kp.year as matched_paper_year
      FROM citation_validations cv
      LEFT JOIN known_papers kp ON cv.known_paper_id = kp.id
      WHERE cv.topic_id = ?
      ORDER BY cv.content_type, cv.validation_status
    `).all(params.topicId)
    
    // Get validation history
    const history = db.prepare(`
      SELECT * 
      FROM validation_history 
      WHERE topic_id = ? 
      ORDER BY run_date DESC 
      LIMIT 10
    `).all(params.topicId)
    
    // Calculate statistics
    const stats = {
      total: citations.length,
      byContentType: {
        academic: citations.filter(c => c.content_type === 'academic').length,
        personal: citations.filter(c => c.content_type === 'personal').length
      },
      byStatus: citations.reduce((acc, c) => {
        acc[c.validation_status] = (acc[c.validation_status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      verificationRate: citations.length > 0 ? 
        (citations.filter(c => c.validation_status === 'verified').length / citations.length) : 0,
      avgConfidence: citations.length > 0 ?
        citations.reduce((sum, c) => sum + (c.confidence || 0), 0) / citations.length : 0
    }
    
    // Group problematic citations
    const issues = {
      broken: citations.filter(c => c.validation_status === 'broken'),
      suspicious: citations.filter(c => c.validation_status === 'suspicious'),
      hallucinated: citations.filter(c => c.validation_status === 'hallucinated')
    }
    
    // Improvement opportunities
    const improvements = citations
      .filter(c => c.suggested_fix && c.validation_status !== 'verified')
      .map(c => ({
        id: c.id,
        current: c.citation_text,
        suggestion: c.suggested_fix,
        status: c.validation_status,
        confidence: c.confidence
      }))
    
    return NextResponse.json({
      topic: {
        id: topic.id,
        title: topic.title
      },
      stats,
      issues,
      improvements,
      history: history.map(h => ({
        date: h.run_date,
        total: h.total_citations,
        verified: h.verified_count,
        problematic: h.suspicious_count + h.broken_count + h.hallucinated_count
      })),
      citations: citations.map(c => ({
        id: c.id,
        text: c.citation_text,
        contentType: c.content_type,
        status: c.validation_status,
        confidence: c.confidence,
        matchedPaper: c.matched_paper_title ? {
          title: c.matched_paper_title,
          year: c.matched_paper_year
        } : null,
        suggestion: c.suggested_fix,
        errors: c.validation_errors ? JSON.parse(c.validation_errors) : []
      }))
    })
    
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}