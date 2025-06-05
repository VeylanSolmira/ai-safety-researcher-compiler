import { getDatabasePath } from '@/lib/db'

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = getDatabasePath();

export interface NewsStory {
  id: string
  title: string
  summary: string
  content: string
  date: string
  category: 'research' | 'policy' | 'community' | 'technical' | 'opportunity' | 'general'
  tags: string[]
  source?: string
  author?: string
}

interface NewsRow {
  id: string
  title: string
  summary: string
  content: string
  date: string
  category: string | null
  tags: string
  source: string | null
  author: string | null
  created_at: string
  updated_at: string
}

export function getAllNews(): NewsStory[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM news
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all() as NewsRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as NewsStory['category'],
      tags: JSON.parse(row.tags || '[]'),
      source: row.source || undefined,
      author: row.author || undefined
    }));
  } finally {
    db.close();
  }
}

export function getNewsItem(id: string): NewsStory | null {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM news WHERE id = ?
    `;
    
    const row = db.prepare(query).get(id) as NewsRow | undefined;
    
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as NewsStory['category'],
      tags: JSON.parse(row.tags || '[]'),
      source: row.source || undefined,
      author: row.author || undefined
    };
  } finally {
    db.close();
  }
}

export function getNewsByCategory(category: string): NewsStory[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM news
      WHERE category = ?
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all(category) as NewsRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as NewsStory['category'],
      tags: JSON.parse(row.tags || '[]'),
      source: row.source || undefined,
      author: row.author || undefined
    }));
  } finally {
    db.close();
  }
}

export function getRecentNews(days: number = 30): NewsStory[] {
  const db = new Database(DB_PATH);
  
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const query = `
      SELECT * FROM news
      WHERE date >= ?
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all(cutoffDateStr) as NewsRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as NewsStory['category'],
      tags: JSON.parse(row.tags || '[]'),
      source: row.source || undefined,
      author: row.author || undefined
    }));
  } finally {
    db.close();
  }
}

export function getNewsByTag(tag: string): NewsStory[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM news
      WHERE json_extract(tags, '$') LIKE ?
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all(`%"${tag}"%`) as NewsRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as NewsStory['category'],
      tags: JSON.parse(row.tags || '[]'),
      source: row.source || undefined,
      author: row.author || undefined
    }));
  } finally {
    db.close();
  }
}

export function getNewsStory(id: string) {
  const db = new Database(DB_PATH, { readonly: true })
  
  try {
    const query = `
      SELECT 
        n.*,
        COUNT(DISTINCT nt.topic_id) as topic_count
      FROM news n
      LEFT JOIN news_topics nt ON n.id = nt.news_id
      WHERE n.id = ?
      GROUP BY n.id
    `
    
    const news = db.prepare(query).get(id) as any
    
    if (!news) return null
    
    // Get related topics
    const topics = db.prepare(`
      SELECT t.id, t.title
      FROM news_topics nt
      JOIN topics t ON nt.topic_id = t.id
      WHERE nt.news_id = ?
    `).all(id)
    
    return {
      ...news,
      topics
    }
  } finally {
    db.close()
  }
}