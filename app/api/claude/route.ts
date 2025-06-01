// API route for Claude interactions
// This keeps the API key on the server side

import { NextRequest, NextResponse } from 'next/server'
import { askClaude, analyzeContent, generateQuizQuestions } from '@/lib/claude-api'

// Rate limiting (simple in-memory store - use Redis in production)
const requestCounts = new Map<string, { 
  count: number
  tokens: number
  resetTime: number 
}>()

// Limits
const RATE_LIMIT = 10 // requests per minute
const TOKEN_LIMIT = 50000 // tokens per hour  
const RATE_WINDOW = 60 * 1000 // 1 minute for request count
const TOKEN_WINDOW = 60 * 60 * 1000 // 1 hour for token count

function checkRateLimit(ip: string, estimatedTokens: number = 1000): {
  allowed: boolean
  reason?: string
} {
  const now = Date.now()
  const userLimit = requestCounts.get(ip)
  
  if (!userLimit || now > userLimit.resetTime) {
    // Reset if window expired
    requestCounts.set(ip, { 
      count: 1, 
      tokens: estimatedTokens,
      resetTime: now + RATE_WINDOW 
    })
    return { allowed: true }
  }
  
  // Check request count
  if (userLimit.count >= RATE_LIMIT) {
    return { 
      allowed: false, 
      reason: `Rate limit exceeded: ${RATE_LIMIT} requests per minute` 
    }
  }
  
  // Check token usage (rough estimate)
  if (userLimit.tokens + estimatedTokens > TOKEN_LIMIT) {
    return { 
      allowed: false, 
      reason: `Token limit exceeded: ${TOKEN_LIMIT} tokens per hour` 
    }
  }
  
  userLimit.count++
  userLimit.tokens += estimatedTokens
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      )
    }

    // Parse request body first to estimate tokens
    const body = await request.json()
    const { action, ...params } = body
    
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const contentLength = JSON.stringify(body).length
    const estimatedTokens = Math.ceil(contentLength / 4) + 1000 // rough estimate
    
    const rateCheck = checkRateLimit(ip, estimatedTokens)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.reason || 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    let result: string

    switch (action) {
      case 'chat':
        if (!params.messages || !Array.isArray(params.messages)) {
          return NextResponse.json(
            { error: 'Messages array required for chat' },
            { status: 400 }
          )
        }
        result = await askClaude(params.messages, params.options)
        break

      case 'analyze':
        if (!params.content) {
          return NextResponse.json(
            { error: 'Content required for analysis' },
            { status: 400 }
          )
        }
        result = await analyzeContent(params.content, params.analysisType)
        break

      case 'quiz':
        if (!params.content) {
          return NextResponse.json(
            { error: 'Content required for quiz generation' },
            { status: 400 }
          )
        }
        result = await generateQuizQuestions(params.content, params.count)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: chat, analyze, or quiz' },
          { status: 400 }
        )
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Claude API route error:', error)
    
    // More detailed error response in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          error: 'Failed to process request', 
          details: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}