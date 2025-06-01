import { NextResponse } from 'next/server'
import { searchTopics } from '@/lib/api/journey'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.length < 2) {
      return NextResponse.json([])
    }
    
    const results = await searchTopics(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error searching topics:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}