// Library functions for loading and processing roadmap data
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Type definitions for our roadmap data
export interface RoadmapMetadata {
  title: string
  briefTitle: string
  briefDescription: string
  description: string
  jsonUrl: string
  pdfUrl: string
  order: number
  renderer: string
  hasTopics: boolean
  isNew: boolean
  dimensions: {
    width: number
    height: number
  }
  // Add other metadata fields as needed
}

export interface RoadmapData extends RoadmapMetadata {
  content: string
  jsonData: any
}

// Get the path to roadmap files
function getRoadmapPath(slug: string) {
  return path.join(process.cwd(), 'src/data/roadmaps', slug)
}

// Load roadmap data from markdown and JSON files
export async function getRoadmapData(slug: string): Promise<RoadmapData | null> {
  try {
    const roadmapPath = getRoadmapPath(slug)
    
    // Read the markdown file with metadata
    const mdPath = path.join(roadmapPath, `${slug}.md`)
    const mdContent = fs.readFileSync(mdPath, 'utf8')
    const { data, content } = matter(mdContent)
    
    // Read the JSON file with visual structure
    const jsonPath = path.join(roadmapPath, `${slug}.json`)
    const jsonContent = fs.readFileSync(jsonPath, 'utf8')
    const rawJsonData = JSON.parse(jsonContent)
    
    // Transform nodes to ReactFlow format
    const transformedNodes = rawJsonData.nodes.map((node: any) => ({
      id: node.id,
      type: node.type || 'default',
      position: node.position || { x: node.x || 0, y: node.y || 0 },
      data: {
        label: node.data?.label || node.title || node.label || '',
        style: node.data?.style || node.style || {},
        viewMode: node.data?.viewMode || node.viewMode || 'both',
        description: node.data?.description || node.description,
        parentId: node.data?.parentId || node.parentId,
        width: node.data?.width || node.width,
        height: node.data?.height || node.height
      },
      width: node.width,
      height: node.height
    }))
    
    // Transform the JSON data to include transformed nodes
    const jsonData = {
      ...rawJsonData,
      nodes: transformedNodes
    }
    
    return {
      ...(data as RoadmapMetadata),
      content,
      jsonData
    }
  } catch (error) {
    console.error(`Failed to load roadmap ${slug}:`, error)
    return null
  }
}

// Get all available roadmaps
export async function getAllRoadmaps(): Promise<string[]> {
  const roadmapsPath = path.join(process.cwd(), 'src/data/roadmaps')
  const entries = fs.readdirSync(roadmapsPath, { withFileTypes: true })
  
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
}

// Load content for a specific topic
export async function getTopicContent(roadmapSlug: string, topicId: string): Promise<string | null> {
  try {
    const contentPath = path.join(getRoadmapPath(roadmapSlug), 'content')
    const files = fs.readdirSync(contentPath)
    
    // Find the file that matches the topic ID
    const topicFile = files.find(file => file.endsWith(`@${topicId}.md`))
    if (!topicFile) return null
    
    const filePath = path.join(contentPath, topicFile)
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    console.error(`Failed to load topic ${topicId}:`, error)
    return null
  }
}