import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { inArray } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topicIds, viewMode = 'academic' } = body

    if (!topicIds || !Array.isArray(topicIds) || topicIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid topicIds array' },
        { status: 400 }
      )
    }

    // Limit batch size to prevent overwhelming the database
    if (topicIds.length > 100) {
      return NextResponse.json(
        { error: 'Batch size exceeds maximum of 100 topics' },
        { status: 400 }
      )
    }

    const db = getDb()
    
    // Clean up topic IDs (handle legacy @ patterns)
    const cleanTopicIds = topicIds.map(topicId => {
      let cleanId = topicId
      if (topicId.includes('@')) {
        cleanId = topicId.split('@').pop() || topicId
        cleanId = cleanId.replace('.personal', '')
      }
      return cleanId
    })
    
    // Fetch all topics in a single query
    const results = await db
      .select({
        id: topics.id,
        title: topics.title,
        description: topics.description,
        contentAcademic: topics.contentAcademic,
        contentPersonal: topics.contentPersonal
      })
      .from(topics)
      .where(inArray(topics.id, cleanTopicIds))

    // Create a map for quick lookup
    const topicMap = new Map()
    results.forEach(topic => {
      const content = viewMode === 'personal' 
        ? topic.contentPersonal 
        : topic.contentAcademic
      
      topicMap.set(topic.id, {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        content: content || '',
        hasContent: !!content,
        isPersonalContent: viewMode === 'personal' && !!topic.contentPersonal
      })
    })

    // Return results maintaining the original order
    const orderedResults = cleanTopicIds.map((id, index) => {
      const data = topicMap.get(id)
      if (!data) {
        return {
          id: topicIds[index], // Use original ID for reference
          content: '',
          hasContent: false,
          error: 'Topic not found'
        }
      }
      return { ...data, originalId: topicIds[index] }
    })

    return NextResponse.json({ 
      topics: orderedResults,
      viewMode,
      count: orderedResults.length 
    })
  } catch (error) {
    console.error('Error loading batch topic content:', error)
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
}

// Also support GET for smaller batches via query params
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const topicIdsParam = searchParams.get('topicIds')
  const viewMode = searchParams.get('viewMode') || 'academic'

  if (!topicIdsParam) {
    return NextResponse.json(
      { error: 'Missing topicIds parameter' },
      { status: 400 }
    )
  }

  const topicIds = topicIdsParam.split(',').filter(id => id.trim())

  // For GET requests, limit to 20 topics to keep URL reasonable
  if (topicIds.length > 20) {
    return NextResponse.json(
      { error: 'GET batch size exceeds maximum of 20 topics. Use POST for larger batches.' },
      { status: 400 }
    )
  }

  // Reuse POST logic
  return POST(new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ topicIds, viewMode })
  }))
}