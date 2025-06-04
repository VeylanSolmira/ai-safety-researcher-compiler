#!/usr/bin/env tsx

/**
 * Script to remove duplicate TOCs from all topics
 */

import Database from 'better-sqlite3';
import path from 'path';
import { hasToc } from '../lib/utils/generate-toc';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Get all topics
const topics = db.prepare(`
  SELECT id, title, content_academic, content_personal
  FROM topics
  WHERE content_academic IS NOT NULL OR content_personal IS NOT NULL
`).all() as any[];

console.log(`Checking ${topics.length} topics for duplicate TOCs\n`);

let updatedCount = 0;

topics.forEach(topic => {
  let updated = false;

  // Function to remove all TOCs from content
  const removeAllTocs = (content: string): string => {
    if (!content) return content;
    
    let cleaned = content;
    
    // Remove standard markdown TOCs
    cleaned = cleaned.replace(/^## Table of Contents\s*\n((?:[ \t]*[-*]\s+\[.*?\]\(#.*?\)\s*\n)+)/gm, '');
    
    // Remove styled TOCs with separators
    cleaned = cleaned.replace(/---\s*\n\s*📑\s*\*\*Table of Contents\*\*[\s\S]*?\n---/g, '');
    
    // Remove HTML details TOCs
    cleaned = cleaned.replace(/<details>[\s\S]*?Table of Contents[\s\S]*?<\/details>/gi, '');
    
    // Clean up extra newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
  };

  // Check and clean academic content
  if (topic.content_academic && hasToc(topic.content_academic)) {
    console.log(`Removing TOCs from academic content for: ${topic.title}`);
    const cleanedContent = removeAllTocs(topic.content_academic);

    db.prepare(`
      UPDATE topics 
      SET content_academic = ?
      WHERE id = ?
    `).run(cleanedContent, topic.id);

    updated = true;
  }

  // Check and clean personal content
  if (topic.content_personal && hasToc(topic.content_personal)) {
    console.log(`Removing TOCs from personal content for: ${topic.title}`);
    const cleanedContent = removeAllTocs(topic.content_personal);

    db.prepare(`
      UPDATE topics 
      SET content_personal = ?
      WHERE id = ?
    `).run(cleanedContent, topic.id);

    updated = true;
  }

  if (updated) {
    updatedCount++;
  }
});

db.close();

console.log(`\n✅ Cleaned TOCs from ${updatedCount} topics`);
console.log('\nTOCs will be auto-generated for long content when displayed.');