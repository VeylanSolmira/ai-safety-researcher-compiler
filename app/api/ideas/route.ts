import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllIdeas, 
  getIdeasByStatus, 
  getIdeasByQuality,
  getIdeasByTag 
} from '@/lib/db/ideas-queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const minQuality = searchParams.get('minQuality');
    const tag = searchParams.get('tag');
    
    let ideas;
    
    if (status) {
      ideas = getIdeasByStatus(status);
    } else if (minQuality) {
      const quality = parseInt(minQuality) || 1;
      ideas = getIdeasByQuality(quality);
    } else if (tag) {
      ideas = getIdeasByTag(tag);
    } else {
      ideas = getAllIdeas();
    }
    
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}