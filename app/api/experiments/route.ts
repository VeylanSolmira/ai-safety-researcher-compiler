import { NextRequest, NextResponse } from 'next/server';
import { getAllExperiments, getExperimentsByDifficulty, getExperimentsByTag } from '@/lib/db/experiments-queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const difficulty = searchParams.get('difficulty') as any;
    const tag = searchParams.get('tag') as any;
    
    let experiments;
    
    if (difficulty) {
      experiments = getExperimentsByDifficulty(difficulty);
    } else if (tag) {
      experiments = getExperimentsByTag(tag);
    } else {
      experiments = getAllExperiments();
    }
    
    return NextResponse.json(experiments);
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}