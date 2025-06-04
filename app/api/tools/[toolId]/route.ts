import { NextResponse } from 'next/server'
import { getToolById } from '@/lib/db/resource-queries'

export async function GET(
  request: Request,
  { params }: { params: { toolId: string } }
) {
  try {
    const tool = getToolById(params.toolId)

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const parsedTool = {
      ...tool,
      research_areas: tool.research_areas ? JSON.parse(tool.research_areas) : [],
      use_cases: tool.use_cases ? JSON.parse(tool.use_cases) : [],
      programming_languages: tool.programming_languages ? JSON.parse(tool.programming_languages) : [],
      key_papers: tool.key_papers ? JSON.parse(tool.key_papers) : [],
      related_tools: tool.related_tools ? JSON.parse(tool.related_tools) : [],
      is_open_source: Boolean(tool.is_open_source),
      maintained: Boolean(tool.maintained),
      tool_type: tool.type // Ensure consistency
    }

    return NextResponse.json(parsedTool)
  } catch (error) {
    console.error('Error fetching tool:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    )
  }
}