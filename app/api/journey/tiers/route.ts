import { NextResponse } from 'next/server'
import { getAllTiers } from '@/lib/api/journey'

export async function GET() {
  try {
    const tiers = await getAllTiers()
    return NextResponse.json(tiers)
  } catch (error) {
    console.error('Error fetching tiers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tiers' },
      { status: 500 }
    )
  }
}