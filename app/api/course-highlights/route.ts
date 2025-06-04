import { NextResponse } from 'next/server'
import { getAllCourseHighlights } from '@/lib/db/course-highlights-queries'

export async function GET() {
  try {
    const highlights = getAllCourseHighlights()
    return NextResponse.json(highlights)
  } catch (error) {
    console.error('Error fetching course highlights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course highlights' },
      { status: 500 }
    )
  }
}