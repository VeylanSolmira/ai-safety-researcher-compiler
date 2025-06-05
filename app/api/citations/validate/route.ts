import { NextRequest, NextResponse } from 'next/server'
import { getDatabasePath } from '@/lib/db'
import Database from 'better-sqlite3'
import path from 'path'
import crypto from 'crypto'

const DB_PATH = getDatabasePath()

interface ValidationRequest {
  content: string
  strict?: boolean
  context?: {
    topicId?: string
    section?: string
    claimType?: 'empirical' | 'theoretical' | 'historical' | 'technical'
  }
}

interface CitationResult {
  text: string
  status: 'verified' | 'unverified' | 'suspicious' | 'broken' | 'hallucinated'
  confidence: number
  suggestion?: string
  matchedPaper?: {
    id: string
    title: string
    authors: string[]
    year: number
    url: string
  }
}

// Citation extraction patterns
const citationPatterns = [
  {
    name: 'markdown_link',
    regex: /\[([^\]]+)\]\(([^)]+)\)/g,
    extract: (match: RegExpMatchArray) => {
      const titlePart = match[1];
      const url = match[2];
      const yearMatch = titlePart.match(/\((\d{4})\)/);
      const authorMatch = titlePart.match(/\s-\s([^(]+)\s*\(/);
      
      return {
        text: match[0],
        title: titlePart.replace(/\s*-\s*[^(]+\s*\(\d{4}\)/, '').trim(),
        authors: authorMatch ? [authorMatch[1].trim()] : undefined,
        year: yearMatch ? parseInt(yearMatch[1]) : undefined,
        url
      };
    }
  },
  {
    name: 'quoted_year',
    regex: /"([^"]+)"\s*\((\d{4})\)/g,
    extract: (match: RegExpMatchArray) => ({
      text: match[0],
      title: match[1],
      year: parseInt(match[2])
    })
  },
  {
    name: 'author_et_al',
    regex: /([A-Z][a-z]+)\s+et\s+al\.\s*\((\d{4})\)/g,
    extract: (match: RegExpMatchArray) => ({
      text: match[0],
      authors: [match[1] + ' et al.'],
      year: parseInt(match[2])
    })
  }
];

// String similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Simple Jaccard similarity for quick API responses
  const tokens1 = new Set(s1.split(/\s+/));
  const tokens2 = new Set(s2.split(/\s+/));
  
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...(tokens1 as any), ...tokens2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export async function POST(request: NextRequest) {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const body: ValidationRequest = await request.json()
    
    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }
    
    // Extract citations from content
    const extractedCitations: any[] = []
    
    for (const pattern of citationPatterns) {
      const matches = Array.from(body.content.matchAll(pattern.regex))
      for (const match of matches) {
        try {
          const citation = pattern.extract(match)
          extractedCitations.push(citation)
        } catch (e) {
          // Skip malformed citations
        }
      }
    }
    
    // Load known papers and hallucination patterns
    const knownPapers = db.prepare('SELECT * FROM known_papers').all() as any[]
    const hallucPatterns = db.prepare('SELECT * FROM hallucination_patterns').all() as any[]
    
    // Validate each citation
    const results: CitationResult[] = []
    
    for (const citation of extractedCitations) {
      let status: CitationResult['status'] = 'unverified'
      let confidence = 0.5
      let suggestion: string | undefined
      let matchedPaper: CitationResult['matchedPaper'] | undefined
      
      // Check year validity
      const currentYear = new Date().getFullYear()
      if (citation.year && citation.year > currentYear) {
        status = 'suspicious'
        confidence = 0.1
        suggestion = `Future year detected (${citation.year}). Check if this is correct.`
      }
      
      // Check against hallucination patterns
      for (const pattern of hallucPatterns as any[]) {
        const regex = new RegExp(pattern.pattern, 'i')
        if (regex.test(citation.text)) {
          status = 'hallucinated'
          confidence = 0.2
          suggestion = `This citation matches a known hallucination pattern: ${pattern.description}`
        }
      }
      
      // Match against known papers
      if (citation.title) {
        let bestMatch = { paper: null as any, similarity: 0 }
        
        for (const paper of knownPapers) {
          const similarity = calculateSimilarity(citation.title, paper.title)
          if (similarity > bestMatch.similarity) {
            bestMatch = { paper, similarity }
          }
        }
        
        if (bestMatch.similarity > 0.7) {
          status = 'verified'
          confidence = bestMatch.similarity
          matchedPaper = {
            id: bestMatch.paper.id,
            title: bestMatch.paper.title,
            authors: JSON.parse(bestMatch.paper.authors),
            year: bestMatch.paper.year,
            url: bestMatch.paper.url
          }
          
          // Generate suggestion if not exact match
          if (bestMatch.similarity < 0.95) {
            const authors = matchedPaper.authors
            const authorStr = authors.length > 2 ? 
              `${authors[0]} et al.` : 
              authors.join(' & ')
            
            suggestion = `[${matchedPaper.title} - ${authorStr} (${matchedPaper.year})](${matchedPaper.url})`
          }
        }
      }
      
      // Check for common issues
      if (citation.url && !citation.url.startsWith('http')) {
        status = status === 'verified' ? status : 'broken'
        suggestion = suggestion || `Add protocol: https://${citation.url}`
      }
      
      results.push({
        text: citation.text,
        status,
        confidence,
        suggestion,
        matchedPaper
      })
    }
    
    // Generate summary
    const summary = {
      total: results.length,
      verified: results.filter(r => r.status === 'verified').length,
      suspicious: results.filter(r => r.status === 'suspicious').length,
      broken: results.filter(r => r.status === 'broken').length,
      hallucinated: results.filter(r => r.status === 'hallucinated').length,
      unverified: results.filter(r => r.status === 'unverified').length
    }
    
    // Store validation results if context provided
    if (body.context?.topicId) {
      const writableDb = new Database(DB_PATH)
      try {
        const stmt = writableDb.prepare(`
          INSERT INTO validation_history (
            topic_id, validation_run_id, total_citations,
            verified_count, suspicious_count, broken_count, hallucinated_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        
        const runId = crypto.randomBytes(8).toString('hex')
        stmt.run(
          body.context.topicId,
          runId,
          summary.total,
          summary.verified,
          summary.suspicious,
          summary.broken,
          summary.hallucinated
        )
      } finally {
        writableDb.close()
      }
    }
    
    return NextResponse.json({
      citations: results,
      summary,
      suggestions: results
        .filter(r => r.suggestion)
        .map((r: any) => ({
          original: r.text,
          suggestion: r.suggestion
        }))
    })
    
  } catch (error) {
    console.error('Error validating citations:', error)
    return NextResponse.json(
      { error: 'Failed to validate citations' },
      { status: 500 }
    )
  } finally {
    db.close()
  }
}