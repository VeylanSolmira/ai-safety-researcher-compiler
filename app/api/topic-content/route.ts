import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const roadmapSlug = searchParams.get('roadmap')
  const topicId = searchParams.get('topic')
  const viewMode = searchParams.get('viewMode') || 'neutral'

  if (!roadmapSlug || !topicId) {
    return NextResponse.json(
      { error: 'Missing roadmap or topic parameter' },
      { status: 400 }
    )
  }

  try {
    // Path to content directory
    const contentDir = path.join(
      process.cwd(),
      'src/data/roadmaps',
      roadmapSlug,
      'content'
    )

    // Find the file that matches the topic ID
    const files = fs.readdirSync(contentDir)
    
    // First, try to find a personal version if in personal mode
    let topicFile = null
    if (viewMode === 'personal') {
      // Check if topicId already includes the @ pattern
      if (topicId.includes('@')) {
        topicFile = files.find(file => file === `${topicId}.personal.md`)
      } else {
        topicFile = files.find(file => file.endsWith(`@${topicId}.personal.md`))
      }
    }
    
    // If no personal version found, or in neutral mode, use the regular file
    if (!topicFile) {
      // Check if topicId already includes the @ pattern
      if (topicId.includes('@')) {
        topicFile = files.find(file => file === `${topicId}.md` && !file.includes('.personal.'))
      } else {
        topicFile = files.find(file => file.endsWith(`@${topicId}.md`) && !file.includes('.personal.'))
      }
    }

    if (!topicFile) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Read the content
    const filePath = path.join(contentDir, topicFile)
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Add a marker if this is personal content
    const isPersonalContent = topicFile.includes('.personal.')

    return NextResponse.json({ content, isPersonalContent })
  } catch (error) {
    console.error('Error loading topic content:', error)
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
}