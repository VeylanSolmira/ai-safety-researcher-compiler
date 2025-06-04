import { NextResponse } from 'next/server'
import { getAllExternalResources } from '@/lib/db/resource-queries'

export async function GET() {
  try {
    const resources = getAllExternalResources()
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching external resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch external resources' },
      { status: 500 }
    )
  }
}