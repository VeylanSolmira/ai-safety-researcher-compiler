import { NextRequest, NextResponse } from 'next/server';
import { getExploration } from '@/lib/db/explorations-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { explorationId: string } }
) {
  try {
    const exploration = getExploration(params.explorationId);
    
    if (!exploration) {
      return NextResponse.json(
        { error: 'Exploration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(exploration);
  } catch (error) {
    console.error('Error fetching exploration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exploration' },
      { status: 500 }
    );
  }
}