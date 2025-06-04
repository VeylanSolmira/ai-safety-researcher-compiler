#!/usr/bin/env tsx

/**
 * Script to update all existing TOCs to be collapsible
 */

import Database from 'better-sqlite3';
import path from 'path';
import { insertTocIntoMarkdown } from '../lib/utils/generate-toc';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Get all topics with TOCs
const topics = db.prepare(`
  SELECT id, title, content_academic, content_personal
  FROM topics
  WHERE 
    (content_academic LIKE '%## Table of Contents%' OR content_personal LIKE '%## Table of Contents%')
`).all() as any[];

console.log(`Found ${topics.length} topics with TOCs to update\n`);

let updatedCount = 0;

topics.forEach(topic => {
  let updated = false;

  // Update academic content
  if (topic.content_academic && topic.content_academic.includes('## Table of Contents')) {
    console.log(`Updating TOC to collapsible for academic content: ${topic.title}`);
    const updatedContent = insertTocIntoMarkdown(topic.content_academic, {
      minLevel: 2,
      maxLevel: 3,
      ordered: false,
      collapsible: true
    });

    db.prepare(`
      UPDATE topics 
      SET content_academic = ?
      WHERE id = ?
    `).run(updatedContent, topic.id);

    updated = true;
  }

  // Update personal content
  if (topic.content_personal && topic.content_personal.includes('## Table of Contents')) {
    console.log(`Updating TOC to collapsible for personal content: ${topic.title}`);
    const updatedContent = insertTocIntoMarkdown(topic.content_personal, {
      minLevel: 2,
      maxLevel: 3,
      ordered: false,
      collapsible: true
    });

    db.prepare(`
      UPDATE topics 
      SET content_personal = ?
      WHERE id = ?
    `).run(updatedContent, topic.id);

    updated = true;
  }

  if (updated) {
    updatedCount++;
  }
});

db.close();

console.log(`\n✅ Updated ${updatedCount} topics with collapsible TOCs`);