import { NextResponse } from 'next/server'
import { getDatabasePath } from '@/lib/db'
import { getAllTools } from '@/lib/db/resource-queries'
import Database from 'better-sqlite3'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') as any
  const type = searchParams.get('type') as any
  const tag = searchParams.get('tag') as any

  try {
    // Get all tools using the query function
    let tools = getAllTools()

    // Apply filters
    if (category) {
      tools = tools.filter(tool => tool.category === category)
    }

    if (type) {
      tools = tools.filter(tool => tool.type === type)
    }

    if (tag) {
      tools = tools.filter(tool => tool.tags?.includes(tag))
    }

    // Get all unique categories and tags
    const db = new Database(getDatabasePath(), { readonly: true })
    try {
      const categoriesStmt = db.prepare('SELECT DISTINCT category FROM tools ORDER BY category')
      const categories = (categoriesStmt.all() as any[]).map((row: any) => row.category)

      const tagsStmt = db.prepare('SELECT DISTINCT tag FROM tool_tags ORDER BY tag')
      const tags = (tagsStmt.all() as any[]).map((row: any) => row.tag)

      // Transform tools to match the expected format
      const transformedTools = tools.map((tool: any) => ({
        ...(tool as any),
        research_areas: tool.research_areas ? JSON.parse(tool.research_areas as any) : [],
        use_cases: tool.use_cases ? JSON.parse(tool.use_cases as any) : [],
        programming_languages: tool.programming_languages ? JSON.parse(tool.programming_languages as any) : [],
        key_papers: tool.key_papers ? JSON.parse(tool.key_papers as any) : [],
        related_tools: tool.related_tools ? JSON.parse(tool.related_tools as any) : [],
        is_open_source: Boolean(tool.is_open_source),
        maintained: Boolean(tool.maintained),
        tool_type: tool.type // Rename type to tool_type for consistency
      }))

      return NextResponse.json({
        tools: transformedTools,
        categories,
        tags,
        total: transformedTools.length
      })
    } finally {
      db.close()
    }
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}