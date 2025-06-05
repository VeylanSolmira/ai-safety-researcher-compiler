import { getDatabasePath } from '@/lib/db'

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = getDatabasePath();

export interface CommunityProfile {
  id: string;
  name: string;
  type: 'researcher' | 'organization' | 'platform';
  description: string;
  tags: string[];
  properties: Record<string, any>;
  personal_note?: string | null;
  active: boolean;
}

export function getAllCommunityProfiles(): CommunityProfile[] {
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  
  try {
    const profiles = db.prepare(`
      SELECT 
        id,
        name,
        type,
        description,
        tags,
        properties,
        personal_note,
        active
      FROM entities
      WHERE active = 1 AND type = 'researcher'
      ORDER BY name
    `).all() as Array<any>;
    
    // Parse JSON fields
    return profiles.map((profile: any) => ({
      ...profile,
      tags: profile.tags ? JSON.parse((profile as any).tags || "[]") : [],
      properties: profile.properties ? JSON.parse((profile as any).properties || "[]") : {},
      active: Boolean(profile.active)
    }));
  } finally {
    db.close();
  }
}

export function getCommunityProfile(id: string): CommunityProfile | null {
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  
  try {
    const profile = db.prepare(`
      SELECT 
        id,
        name,
        type,
        description,
        tags,
        properties,
        personal_note,
        active
      FROM entities
      WHERE id = ? AND active = 1
    `).get(id) as any;
    
    if (!profile) return null;
    
    // Parse JSON fields
    return {
      ...profile,
      tags: profile.tags ? JSON.parse((profile as any).tags || "[]") : [],
      properties: profile.properties ? JSON.parse((profile as any).properties || "[]") : {},
      active: Boolean(profile.active)
    };
  } finally {
    db.close();
  }
}

export function getCommunityProfilesByTag(tag: string): CommunityProfile[] {
  const db = new Database(DB_PATH);
  db.pragma('foreign_keys = ON');
  
  try {
    const profiles = db.prepare(`
      SELECT 
        id,
        name,
        type,
        description,
        tags,
        properties,
        personal_note,
        active
      FROM entities
      WHERE active = 1 AND tags LIKE ?
      ORDER BY name
    `).all(`%"${tag}"%`);
    
    // Parse JSON fields
    return profiles.map((profile: any) => ({
      ...profile,
      tags: profile.tags ? JSON.parse((profile as any).tags || "[]") : [],
      properties: profile.properties ? JSON.parse((profile as any).properties || "[]") : {},
      active: Boolean(profile.active)
    }));
  } finally {
    db.close();
  }
}