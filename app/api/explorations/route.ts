import { NextRequest, NextResponse } from 'next/server';
import { getAllExplorations, getExplorationsByTag, searchExplorations } from '@/lib/db/explorations-queries';

// Force dynamic mode to prevent build-time execution
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get('tag') as any;
    const search = searchParams.get('search') as any;
    
    let explorations;
    
    if (tag) {
      explorations = getExplorationsByTag(tag);
    } else if (search) {
      explorations = searchExplorations(search);
    } else {
      explorations = getAllExplorations();
    }
    
    return NextResponse.json(explorations);
  } catch (error) {
    console.error('Error fetching explorations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch explorations' },
      { status: 500 }
    );
  }
}