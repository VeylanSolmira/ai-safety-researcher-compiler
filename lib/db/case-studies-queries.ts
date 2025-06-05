import { getDatabasePath } from '@/lib/db'

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = getDatabasePath();

export interface Citation {
  title: string
  source: string
  url?: string
  date: string
  finding: string
}

export interface CaseStudy {
  id: string
  title: string
  summary: string
  content: string
  date: string
  category: 'misinformation' | 'security' | 'alignment' | 'policy' | 'accident' | 'adversarial'
  severity: 'critical' | 'high' | 'medium' | 'low'
  tags: string[]
  citations: Citation[]
  lessons: string[]
}

interface CaseStudyRow {
  id: string
  title: string
  summary: string
  content: string
  date: string
  category: string | null
  severity: string | null
  tags: string
  citations: string
  lessons: string
  created_at: string
  updated_at: string
}

export function getAllCaseStudies(): CaseStudy[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM case_studies
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all() as CaseStudyRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as CaseStudy['category'],
      severity: row.severity as CaseStudy['severity'],
      tags: JSON.parse(row.tags || '[]'),
      citations: JSON.parse(row.citations || '[]'),
      lessons: JSON.parse(row.lessons || '[]')
    }));
  } finally {
    db.close();
  }
}

export function getCaseStudy(id: string): CaseStudy | null {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM case_studies WHERE id = ?
    `;
    
    const row = db.prepare(query).get(id) as CaseStudyRow | undefined;
    
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as CaseStudy['category'],
      severity: row.severity as CaseStudy['severity'],
      tags: JSON.parse(row.tags || '[]'),
      citations: JSON.parse(row.citations || '[]'),
      lessons: JSON.parse(row.lessons || '[]')
    };
  } finally {
    db.close();
  }
}

export function getCaseStudiesByCategory(category: string): CaseStudy[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM case_studies
      WHERE category = ?
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all(category) as CaseStudyRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as CaseStudy['category'],
      severity: row.severity as CaseStudy['severity'],
      tags: JSON.parse(row.tags || '[]'),
      citations: JSON.parse(row.citations || '[]'),
      lessons: JSON.parse(row.lessons || '[]')
    }));
  } finally {
    db.close();
  }
}

export function getCaseStudiesBySeverity(severity: string): CaseStudy[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM case_studies
      WHERE severity = ?
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all(severity) as CaseStudyRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as CaseStudy['category'],
      severity: row.severity as CaseStudy['severity'],
      tags: JSON.parse(row.tags || '[]'),
      citations: JSON.parse(row.citations || '[]'),
      lessons: JSON.parse(row.lessons || '[]')
    }));
  } finally {
    db.close();
  }
}

export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM case_studies
      WHERE json_extract(tags, '$') LIKE ?
      ORDER BY date DESC
    `;
    
    const rows = db.prepare(query).all(`%"${tag}"%`) as CaseStudyRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      date: row.date,
      category: row.category as CaseStudy['category'],
      severity: row.severity as CaseStudy['severity'],
      tags: JSON.parse(row.tags || '[]'),
      citations: JSON.parse(row.citations || '[]'),
      lessons: JSON.parse(row.lessons || '[]')
    }));
  } finally {
    db.close();
  }
}