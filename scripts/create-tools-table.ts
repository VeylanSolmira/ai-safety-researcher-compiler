#!/usr/bin/env tsx

import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'journey.db')
const db = new Database(dbPath)

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON')

try {
  // Create tools table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT,
      url TEXT,
      github_url TEXT,
      documentation_url TEXT,
      research_areas TEXT NOT NULL, -- JSON array of research areas
      use_cases TEXT, -- JSON array of use cases
      difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
      tool_type TEXT CHECK(tool_type IN ('library', 'framework', 'platform', 'dataset', 'benchmark', 'evaluation', 'visualization')),
      programming_languages TEXT, -- JSON array
      is_open_source BOOLEAN DEFAULT true,
      maintained BOOLEAN DEFAULT true,
      last_updated DATE,
      created_by TEXT,
      key_papers TEXT, -- JSON array of paper URLs/titles
      related_tools TEXT, -- JSON array of tool IDs
      installation_guide TEXT,
      quick_start TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create tool_tags table for better categorization
  db.exec(`
    CREATE TABLE IF NOT EXISTS tool_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
      UNIQUE(tool_id, tag)
    )
  `)

  // Create tool_examples table for code examples
  db.exec(`
    CREATE TABLE IF NOT EXISTS tool_examples (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      code TEXT NOT NULL,
      language TEXT NOT NULL,
      example_type TEXT CHECK(example_type IN ('basic', 'intermediate', 'advanced', 'real-world')),
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
    )
  `)

  // Create indices for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
    CREATE INDEX IF NOT EXISTS idx_tools_type ON tools(tool_type);
    CREATE INDEX IF NOT EXISTS idx_tool_tags_tag ON tool_tags(tag);
  `)

  console.log('✅ Tools tables created successfully')

  // Insert initial categories as a reference
  const categories = [
    'Alignment Techniques',
    'Interpretability',
    'Robustness & Security',
    'Evaluation & Benchmarking',
    'Governance & Policy',
    'Multi-Agent Systems',
    'Training & Fine-tuning',
    'Monitoring & Observability'
  ]

  console.log('\nAvailable categories:', categories.join(', '))

} catch (error) {
  console.error('Error creating tools tables:', error)
  process.exit(1)
} finally {
  db.close()
}