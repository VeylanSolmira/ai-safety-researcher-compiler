import { NextResponse } from 'next/server'
import { getCourseHighlights } from '@/lib/db/course-highlights-queries'

export async function GET() {
  try {
    const highlights = getCourseHighlights()
    return NextResponse.json(highlights)
  } catch (error) {
    console.error('Error fetching course highlights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course highlights' },
      { status: 500 }
    )
  }
}