import { NextResponse } from 'next/server'
import { getTopicById } from '@/lib/api/journey'

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    console.log(`[API] Fetching topic: ${params.topicId}`)
    const topic = await getTopicById(params.topicId)
    
    if (!topic) {
      console.log(`[API] Topic not found: ${params.topicId}`)
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }
    
    console.log(`[API] Topic found: ${params.topicId}, has content: ${!!topic.content}`)
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