import { NextResponse } from 'next/server'
import { getAllEntities } from '@/lib/db/entity-queries'

// Force dynamic mode to prevent build-time execution
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as any
    
    const entities = getAllEntities()
    
    // Filter by type if specified
    const filtered = type 
      ? entities.filter(e => e.type === type)
      : entities
    
    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    )
  }
}