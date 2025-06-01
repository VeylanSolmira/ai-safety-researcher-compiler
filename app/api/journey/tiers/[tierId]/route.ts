import { NextResponse } from 'next/server'
import { getTierById } from '@/lib/api/journey'

export async function GET(
  request: Request,
  { params }: { params: { tierId: string } }
) {
  try {
    const tier = await getTierById(params.tierId)
    
    if (!tier) {
      return NextResponse.json(
        { error: 'Tier not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(tier)
  } catch (error) {
    console.error('Error fetching tier:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tier' },
      { status: 500 }
    )
  }
}