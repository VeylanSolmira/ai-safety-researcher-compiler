#!/usr/bin/env tsx

/**
 * Script to remove visible TOC markers from all topics in the database
 */

import Database from 'better-sqlite3';
import path from 'path';
import { removeTocMarkers } from '../lib/utils/generate-toc';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Get all topics that might have TOC markers
const topics = db.prepare(`
  SELECT id, title, content_academic, content_personal
  FROM topics
  WHERE 
    (content_academic LIKE '%<!-- TOC -->%' OR content_personal LIKE '%<!-- TOC -->%')
`).all() as any[];

console.log(`Found ${topics.length} topics with TOC markers to clean\n`);

let updatedCount = 0;

topics.forEach(topic => {
  let updated = false;

  // Clean academic content
  if (topic.content_academic && topic.content_academic.includes('<!-- TOC -->')) {
    console.log(`Cleaning TOC markers from academic content for: ${topic.title}`);
    const cleanedContent = removeTocMarkers(topic.content_academic);

    db.prepare(`
      UPDATE topics 
      SET content_academic = ?
      WHERE id = ?
    `).run(cleanedContent, topic.id);

    updated = true;
  }

  // Clean personal content
  if (topic.content_personal && topic.content_personal.includes('<!-- TOC -->')) {
    console.log(`Cleaning TOC markers from personal content for: ${topic.title}`);
    const cleanedContent = removeTocMarkers(topic.content_personal);

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

console.log(`\n✅ Cleaned TOC markers from ${updatedCount} topics`);