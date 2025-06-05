import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'journey.db');

export interface ExperimentMetadata {
  id: string
  title: string
  description: string
  relatedTopic?: string
  prerequisites?: string[]
  estimatedTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
  notebookUrl?: string
  githubUrl?: string
  nextExperiment?: string
}

export interface ExperimentContent {
  introduction: string
  keyConcepts?: Array<{
    title: string
    description: string
  }>
  exercises?: Array<{
    title: string
    description: string
    hint?: string
  }>
  reflectionQuestions?: string[]
}

export interface Experiment {
  metadata: ExperimentMetadata
  content: ExperimentContent
}

interface ExperimentRow {
  id: string
  title: string
  description: string
  related_topic: string | null
  prerequisites: string
  estimated_time: string
  difficulty: string
  tags: string
  notebook_url: string | null
  github_url: string | null
  next_experiment: string | null
  content_introduction: string
  content_key_concepts: string
  content_exercises: string
  content_reflection_questions: string
  created_at: string
  updated_at: string
}

export function getAllExperiments(): ExperimentMetadata[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT id, title, description, related_topic, prerequisites,
             estimated_time, difficulty, tags, notebook_url, github_url,
             next_experiment
      FROM experiments
      ORDER BY created_at DESC
    `;
    
    const rows = db.prepare(query).all() as ExperimentRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      relatedTopic: row.related_topic || undefined,
      prerequisites: JSON.parse(row.prerequisites || '[]'),
      estimatedTime: row.estimated_time,
      difficulty: row.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      tags: JSON.parse(row.tags || '[]'),
      notebookUrl: row.notebook_url || undefined,
      githubUrl: row.github_url || undefined,
      nextExperiment: row.next_experiment || undefined
    }));
  } finally {
    db.close();
  }
}

export function getExperiment(id: string): Experiment | null {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT * FROM experiments WHERE id = ?
    `;
    
    const row = db.prepare(query).get(id) as ExperimentRow | undefined;
    
    if (!row) return null;
    
    return {
      metadata: {
        id: row.id,
        title: row.title,
        description: row.description,
        relatedTopic: row.related_topic || undefined,
        prerequisites: JSON.parse(row.prerequisites || '[]'),
        estimatedTime: row.estimated_time,
        difficulty: row.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        tags: JSON.parse(row.tags || '[]'),
        notebookUrl: row.notebook_url || undefined,
        githubUrl: row.github_url || undefined,
        nextExperiment: row.next_experiment || undefined
      },
      content: {
        introduction: row.content_introduction,
        keyConcepts: JSON.parse(row.content_key_concepts || '[]'),
        exercises: JSON.parse(row.content_exercises || '[]'),
        reflectionQuestions: JSON.parse(row.content_reflection_questions || '[]')
      }
    };
  } finally {
    db.close();
  }
}

export function getExperimentsByDifficulty(difficulty: string): ExperimentMetadata[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT id, title, description, related_topic, prerequisites,
             estimated_time, difficulty, tags, notebook_url, github_url,
             next_experiment
      FROM experiments
      WHERE difficulty = ?
      ORDER BY created_at DESC
    `;
    
    const rows = db.prepare(query).all(difficulty) as ExperimentRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      relatedTopic: row.related_topic || undefined,
      prerequisites: JSON.parse(row.prerequisites || '[]'),
      estimatedTime: row.estimated_time,
      difficulty: row.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      tags: JSON.parse(row.tags || '[]'),
      notebookUrl: row.notebook_url || undefined,
      githubUrl: row.github_url || undefined,
      nextExperiment: row.next_experiment || undefined
    }));
  } finally {
    db.close();
  }
}

export function getExperimentsByTag(tag: string): ExperimentMetadata[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT id, title, description, related_topic, prerequisites,
             estimated_time, difficulty, tags, notebook_url, github_url,
             next_experiment
      FROM experiments
      WHERE json_extract(tags, '$') LIKE ?
      ORDER BY created_at DESC
    `;
    
    const rows = db.prepare(query).all(`%"${tag}"%`) as ExperimentRow[];
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      relatedTopic: row.related_topic || undefined,
      prerequisites: JSON.parse(row.prerequisites || '[]'),
      estimatedTime: row.estimated_time,
      difficulty: row.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
      tags: JSON.parse(row.tags || '[]'),
      notebookUrl: row.notebook_url || undefined,
      githubUrl: row.github_url || undefined,
      nextExperiment: row.next_experiment || undefined
    }));
  } finally {
    db.close();
  }
}