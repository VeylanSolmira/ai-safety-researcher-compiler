import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'journey.db');

export type Idea = PercolatingIdea; // alias for compatibility

export interface PercolatingIdea {
  id: string
  title: string
  summary: string
  description: string // alias for summary
  content: string
  status: 'raw' | 'developing' | 'promising' | 'mature'
  quality: number // alias for qualityRating
  qualityRating: number
  category?: string
  tags: string[]
  warnings: string[]
  warning?: string // singular form
  relatedQuestions: string[]
  questions?: string[] // alias for relatedQuestions
  author?: string
  date?: string
  relatedIdeas?: string[]
}

interface IdeaRow {
  id: string
  title: string
  summary: string
  content: string
  status: string
  quality_rating: number
  category: string | null
  tags: string
  warnings: string
  related_questions: string
  created_at: string
  updated_at: string
}

export function getAllIdeas(): PercolatingIdea[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM ideas
      ORDER BY quality_rating DESC, created_at DESC
    `;
    
    const rows = db.prepare(query).all() as IdeaRow[];
    
    return rows.map((row: any) => {
      const warnings = JSON.parse(row.warnings || '[]');
      const questions = JSON.parse(row.related_questions || '[]');
      return {
        id: row.id,
        title: row.title,
        summary: row.summary,
        description: row.summary, // alias
        content: row.content,
        status: row.status as PercolatingIdea['status'],
        quality: row.quality_rating, // alias
        qualityRating: row.quality_rating,
        category: row.category || undefined,
        tags: JSON.parse(row.tags || '[]'),
        warnings: warnings,
        warning: warnings[0], // singular form
        relatedQuestions: questions,
        questions: questions, // alias
        author: row.author,
        date: row.created_at,
        relatedIdeas: []
      };
    });
  } finally {
    db.close();
  }
}

export function getIdea(id: string): PercolatingIdea | null {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM ideas WHERE id = ?
    `;
    
    const row = db.prepare(query).get(id) as IdeaRow | undefined;
    
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      summary: row.summary,
      description: row.summary, // Alias for UI compatibility
      content: row.content,
      status: row.status as PercolatingIdea['status'],
      qualityRating: row.quality_rating,
      quality: row.quality_rating, // Alias for UI compatibility
      category: row.category || undefined,
      tags: JSON.parse(row.tags || '[]'),
      warnings: JSON.parse(row.warnings || '[]'),
      relatedQuestions: JSON.parse(row.related_questions || '[]')
    };
  } finally {
    db.close();
  }
}

export function getIdeasByStatus(status: string): PercolatingIdea[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM ideas
      WHERE status = ?
      ORDER BY quality_rating DESC, created_at DESC
    `;
    
    const rows = db.prepare(query).all(status) as IdeaRow[];
    
    return rows.map((row: any) => {
      const warnings = JSON.parse(row.warnings || '[]');
      const questions = JSON.parse(row.related_questions || '[]');
      return {
        id: row.id,
        title: row.title,
        summary: row.summary,
        description: row.summary, // alias
        content: row.content,
        status: row.status as PercolatingIdea['status'],
        quality: row.quality_rating, // alias
        qualityRating: row.quality_rating,
        category: row.category || undefined,
        tags: JSON.parse(row.tags || '[]'),
        warnings: warnings,
        warning: warnings[0], // singular form
        relatedQuestions: questions,
        questions: questions, // alias
        author: row.author,
        date: row.created_at,
        relatedIdeas: []
      };
    });
  } finally {
    db.close();
  }
}

export function getIdeasByQuality(minQuality: number): PercolatingIdea[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM ideas
      WHERE quality_rating >= ?
      ORDER BY quality_rating DESC, created_at DESC
    `;
    
    const rows = db.prepare(query).all(minQuality) as IdeaRow[];
    
    return rows.map((row: any) => {
      const warnings = JSON.parse(row.warnings || '[]');
      const questions = JSON.parse(row.related_questions || '[]');
      return {
        id: row.id,
        title: row.title,
        summary: row.summary,
        description: row.summary, // alias
        content: row.content,
        status: row.status as PercolatingIdea['status'],
        quality: row.quality_rating, // alias
        qualityRating: row.quality_rating,
        category: row.category || undefined,
        tags: JSON.parse(row.tags || '[]'),
        warnings: warnings,
        warning: warnings[0], // singular form
        relatedQuestions: questions,
        questions: questions, // alias
        author: row.author,
        date: row.created_at,
        relatedIdeas: []
      };
    });
  } finally {
    db.close();
  }
}

export function getIdeasByTag(tag: string): PercolatingIdea[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM ideas
      WHERE json_extract(tags, '$') LIKE ?
      ORDER BY quality_rating DESC, created_at DESC
    `;
    
    const rows = db.prepare(query).all(`%"${tag}"%`) as IdeaRow[];
    
    return rows.map((row: any) => {
      const warnings = JSON.parse(row.warnings || '[]');
      const questions = JSON.parse(row.related_questions || '[]');
      return {
        id: row.id,
        title: row.title,
        summary: row.summary,
        description: row.summary, // alias
        content: row.content,
        status: row.status as PercolatingIdea['status'],
        quality: row.quality_rating, // alias
        qualityRating: row.quality_rating,
        category: row.category || undefined,
        tags: JSON.parse(row.tags || '[]'),
        warnings: warnings,
        warning: warnings[0], // singular form
        relatedQuestions: questions,
        questions: questions, // alias
        author: row.author,
        date: row.created_at,
        relatedIdeas: []
      };
    });
  } finally {
    db.close();
  }
}