import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCaseStudies, 
  getCaseStudiesByCategory, 
  getCaseStudiesBySeverity,
  getCaseStudiesByTag 
} from '@/lib/db/case-studies-queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as any;
    const severity = searchParams.get('severity') as any;
    const tag = searchParams.get('tag') as any;
    
    let caseStudies;
    
    if (category) {
      caseStudies = getCaseStudiesByCategory(category);
    } else if (severity) {
      caseStudies = getCaseStudiesBySeverity(severity);
    } else if (tag) {
      caseStudies = getCaseStudiesByTag(tag);
    } else {
      caseStudies = getAllCaseStudies();
    }
    
    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}