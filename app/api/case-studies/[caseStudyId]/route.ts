import { NextRequest, NextResponse } from 'next/server';
import { getCaseStudy } from '@/lib/db/case-studies-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { caseStudyId: string } }
) {
  try {
    const caseStudy = getCaseStudy(params.caseStudyId);
    
    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error('Error fetching case study:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case study' },
      { status: 500 }
    );
  }
}