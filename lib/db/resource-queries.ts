import Database from 'better-sqlite3'
import { getDatabasePath } from '@/lib/db'
import path from 'path'

const DB_PATH = getDatabasePath()

interface ExternalResource {
  id: string
  name: string
  type?: string
  url: string
  description?: string
  metadata?: string
  created_at?: string
}

interface AIPrompt {
  id: string
  mode: string
  prompt: string
  created_at?: string
  updated_at?: string
}

interface Tool {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  url?: string
  github_url?: string
  documentation_url?: string
  research_areas?: string
  use_cases?: string
  difficulty_level: string
  type: string
  programming_languages?: string
  is_open_source: boolean
  maintained: boolean
  created_by?: string
  key_papers?: string
  related_tools?: string
  installation_guide?: string
  quick_start?: string
  created_at?: string
  updated_at?: string
  tags?: string[]
  examples?: ToolExample[]
}

interface ToolExample {
  id: string
  tool_id: string
  title: string
  description: string
  code: string
  language: string
  order_index: number
}

export function getAllExternalResources(): ExternalResource[] {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const stmt = db.prepare(`
      SELECT id, name, type, url, description, metadata, created_at 
      FROM external_resources 
      ORDER BY type, name
    `)
    const results = stmt.all() as ExternalResource[]
    // Parse metadata JSON if present
    return results.map((r: any) => ({
      ...r,
      metadata: r.metadata ? JSON.parse((r as any).metadata || "[]") : undefined
    }))
  } finally {
    db.close()
  }
}

export function getAllAIPrompts(): AIPrompt[] {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    const stmt = db.prepare(`
      SELECT id, mode, prompt, created_at, updated_at 
      FROM ai_prompts 
      ORDER BY mode
    `)
    return stmt.all() as AIPrompt[]
  } finally {
    db.close()
  }
}

export function getAllTools(): Tool[] {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Get all tools
    const toolsStmt = db.prepare(`
      SELECT id, name, description, category, subcategory, url,
             github_url, documentation_url, research_areas, use_cases,
             difficulty_level, tool_type as type, programming_languages,
             is_open_source, maintained, created_by, key_papers,
             related_tools, installation_guide, quick_start,
             created_at, updated_at
      FROM tools 
      ORDER BY category, name
    `)
    const tools = toolsStmt.all() as any[]
    
    // Get tags for each tool
    if (tools.length > 0) {
      const tagsStmt = db.prepare(`
        SELECT tool_id, tag 
        FROM tool_tags 
        WHERE tool_id IN (${tools.map(() => '?').join(',')})
      `)
      const allTags = tagsStmt.all(...tools.map(t => t.id)) as { tool_id: string; tag: string }[]
      
      // Group tags by tool_id
      const tagsByTool = allTags.reduce((acc, { tool_id, tag }) => {
        if (!acc[tool_id]) acc[tool_id] = []
        acc[tool_id].push(tag)
        return acc
      }, {} as Record<string, string[]>)
      
      // Add tags to tools
      return tools.map((tool: any) => ({
        ...tool,
        tags: tagsByTool[tool.id] || []
      }))
    } else {
      return []
    }
  } finally {
    db.close()
  }
}

export function getToolById(id: string): Tool | null {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Get tool
    const toolStmt = db.prepare(`
      SELECT id, name, description, category, subcategory, url,
             github_url, documentation_url, research_areas, use_cases,
             difficulty_level, tool_type as type, programming_languages,
             is_open_source, maintained, created_by, key_papers,
             related_tools, installation_guide, quick_start,
             created_at, updated_at
      FROM tools 
      WHERE id = ?
    `)
    const tool = toolStmt.get(id) as Tool | undefined
    
    if (!tool) return null
    
    // Get tags
    const tagsStmt = db.prepare(`
      SELECT tag 
      FROM tool_tags 
      WHERE tool_id = ?
    `)
    const tags = tagsStmt.all(id) as { tag: string }[]
    tool.tags = tags.map(t => t.tag)
    
    // Get examples
    const examplesStmt = db.prepare(`
      SELECT id, tool_id, title, description, code, language, order_index
      FROM tool_examples 
      WHERE tool_id = ?
      ORDER BY order_index
    `)
    tool.examples = examplesStmt.all(id) as ToolExample[]
    
    return tool
  } finally {
    db.close()
  }
}

export function getToolBySlug(slug: string): Tool | null {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Get tool ID by slug
    const idStmt = db.prepare('SELECT id FROM tools WHERE slug = ?')
    const result = idStmt.get(slug) as { id: string } | undefined
    
    if (!result) return null
    
    return getToolById(result.id)
  } finally {
    db.close()
  }
}