import { NextResponse } from 'next/server'
import { getTopicById } from '@/lib/api/journey'

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topic = await getTopicById(params.topicId)
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error fetching topic:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to fetch topic', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}