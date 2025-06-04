import { NextRequest, NextResponse } from 'next/server';
import { getIdea } from '@/lib/db/ideas-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  try {
    const idea = getIdea(params.ideaId);
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    );
  }
}