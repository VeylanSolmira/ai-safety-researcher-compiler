import { NextRequest, NextResponse } from 'next/server'
import { getEntityTopics } from '@/lib/db/entity-queries'

interface Topic {
  id: string
  title: string
  tier_id: string
  module_id: string
  position: number
  tier_position?: number
  module_position?: number
  relationship_type: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: { entityId: string } }
) {
  try {
    const topics = (await getEntityTopics(params.entityId) as unknown) as Topic[]
    
    // Group by relationship type
    const grouped = topics.reduce<Record<string, Topic[]>>((acc, topic) => {
      if (!acc[topic.relationship_type]) {
        acc[topic.relationship_type] = []
      }
      acc[topic.relationship_type].push({
        id: topic.id,
        title: topic.title,
        tier_id: topic.tier_id,
        module_id: topic.module_id,
        position: topic.position,
        tier_position: topic.tier_position,
        module_position: topic.module_position,
        relationship_type: topic.relationship_type
      })
      return acc
    }, {})
    
    return NextResponse.json(grouped)
  } catch (error) {
    console.error('Error fetching entity topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entity topics' },
      { status: 500 }
    )
  }
}
