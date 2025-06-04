import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const roadmapSlug = searchParams.get('roadmap') // Not used anymore, kept for backward compatibility
  const topicId = searchParams.get('topic')
  const viewMode = searchParams.get('viewMode') || 'academic'

  if (!topicId) {
    return NextResponse.json(
      { error: 'Missing topic parameter' },
      { status: 400 }
    )
  }

  try {
    const db = getDb()
    
    // Clean up the topic ID if it has the @ pattern from legacy system
    let cleanTopicId = topicId
    if (topicId.includes('@')) {
      // Extract just the topic ID part after @
      cleanTopicId = topicId.split('@').pop() || topicId
      // Remove .personal suffix if present
      cleanTopicId = cleanTopicId.replace('.personal', '')
    }
    
    // Query the database for the topic
    const result = await db
      .select()
      .from(topics)
      .where(eq(topics.id, cleanTopicId))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Topic not found', topicId: cleanTopicId },
        { status: 404 }
      )
    }

    const topic = result[0]
    
    // Select content based on view mode
    const content = viewMode === 'personal' 
      ? topic.contentPersonal 
      : topic.contentAcademic
    
    const isPersonalContent = viewMode === 'personal' && topic.contentPersonal

    return NextResponse.json({ 
      content: content || '',  // Return empty string if no content
      isPersonalContent,
      hasContent: !!(viewMode === 'personal' ? topic.contentPersonal : topic.contentAcademic),
      topicTitle: topic.title,
      topicDescription: topic.description
    })
  } catch (error) {
    console.error('Error loading topic content:', error)
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
}