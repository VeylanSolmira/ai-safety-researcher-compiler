import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'journey.db');

export interface ExplorationMetadata {
  id: string
  title: string
  description: string
  relatedTopic?: string
  keyQuestions?: string[]
  readingTime: string
  lastUpdated: string
  tags: string[]
  discussionPrompts?: string[]
  relatedResources?: Array<{
    title: string
    url: string
    description?: string
    external?: boolean
  }>
  nextExploration?: string
}

export interface Exploration {
  metadata: ExplorationMetadata
  content: string
}

interface ExplorationRow {
  id: string
  title: string
  description: string
  related_topic: string | null
  key_questions: string
  reading_time: string
  last_updated: string
  tags: string
  discussion_prompts: string
  related_resources: string
  next_exploration: string | null
  content: string
  created_at: string
  updated_at: string
}

export function getAllExplorations(): ExplorationMetadata[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT id, title, description, related_topic, key_questions,
             reading_time, last_updated, tags, discussion_prompts,
             related_resources, next_exploration
      FROM explorations
      ORDER BY last_updated DESC
    `;
    
    const rows = db.prepare(query).all() as ExplorationRow[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      relatedTopic: row.related_topic || undefined,
      keyQuestions: JSON.parse(row.key_questions || '[]'),
      readingTime: row.reading_time,
      lastUpdated: row.last_updated,
      tags: JSON.parse(row.tags || '[]'),
      discussionPrompts: JSON.parse(row.discussion_prompts || '[]'),
      relatedResources: JSON.parse(row.related_resources || '[]'),
      nextExploration: row.next_exploration || undefined
    }));
  } finally {
    db.close();
  }
}

export function getExploration(id: string): Exploration | null {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM explorations WHERE id = ?
    `;
    
    const row = db.prepare(query).get(id) as ExplorationRow | undefined;
    
    if (!row) return null;
    
    return {
      metadata: {
        id: row.id,
        title: row.title,
        description: row.description,
        relatedTopic: row.related_topic || undefined,
        keyQuestions: JSON.parse(row.key_questions || '[]'),
        readingTime: row.reading_time,
        lastUpdated: row.last_updated,
        tags: JSON.parse(row.tags || '[]'),
        discussionPrompts: JSON.parse(row.discussion_prompts || '[]'),
        relatedResources: JSON.parse(row.related_resources || '[]'),
        nextExploration: row.next_exploration || undefined
      },
      content: row.content
    };
  } finally {
    db.close();
  }
}

export function getExplorationsByTag(tag: string): ExplorationMetadata[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT id, title, description, related_topic, key_questions,
             reading_time, last_updated, tags, discussion_prompts,
             related_resources, next_exploration
      FROM explorations
      WHERE json_extract(tags, '$') LIKE ?
      ORDER BY last_updated DESC
    `;
    
    const rows = db.prepare(query).all(`%"${tag}"%`) as ExplorationRow[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      relatedTopic: row.related_topic || undefined,
      keyQuestions: JSON.parse(row.key_questions || '[]'),
      readingTime: row.reading_time,
      lastUpdated: row.last_updated,
      tags: JSON.parse(row.tags || '[]'),
      discussionPrompts: JSON.parse(row.discussion_prompts || '[]'),
      relatedResources: JSON.parse(row.related_resources || '[]'),
      nextExploration: row.next_exploration || undefined
    }));
  } finally {
    db.close();
  }
}

export function searchExplorations(searchTerm: string): ExplorationMetadata[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT id, title, description, related_topic, key_questions,
             reading_time, last_updated, tags, discussion_prompts,
             related_resources, next_exploration
      FROM explorations
      WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
      ORDER BY last_updated DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const rows = db.prepare(query).all(searchPattern, searchPattern, searchPattern) as ExplorationRow[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      relatedTopic: row.related_topic || undefined,
      keyQuestions: JSON.parse(row.key_questions || '[]'),
      readingTime: row.reading_time,
      lastUpdated: row.last_updated,
      tags: JSON.parse(row.tags || '[]'),
      discussionPrompts: JSON.parse(row.discussion_prompts || '[]'),
      relatedResources: JSON.parse(row.related_resources || '[]'),
      nextExploration: row.next_exploration || undefined
    }));
  } finally {
    db.close();
  }
}