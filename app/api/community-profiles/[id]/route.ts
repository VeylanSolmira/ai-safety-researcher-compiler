import { NextResponse } from 'next/server'
import { getCommunityProfile } from '@/lib/db/community-profiles-queries'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = getCommunityProfile(params.id)
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Community profile not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching community profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community profile' },
      { status: 500 }
    )
  }
}