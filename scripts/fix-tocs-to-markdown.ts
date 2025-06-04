#!/usr/bin/env tsx

/**
 * Script to fix all TOCs to use pure markdown format
 */

import Database from 'better-sqlite3';
import path from 'path';
import { insertTocIntoMarkdown } from '../lib/utils/generate-toc';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Get all topics that have HTML-style TOCs
const topics = db.prepare(`
  SELECT id, title, content_academic, content_personal
  FROM topics
  WHERE 
    content_academic LIKE '%<details>%Table of Contents%</details>%' 
    OR content_personal LIKE '%<details>%Table of Contents%</details>%'
    OR content_academic LIKE '%📑%Table of Contents%'
    OR content_personal LIKE '%📑%Table of Contents%'
`).all() as any[];

console.log(`Found ${topics.length} topics with TOCs to fix\n`);

let updatedCount = 0;

topics.forEach(topic => {
  let updated = false;

  // Fix academic content
  if (topic.content_academic && 
      (topic.content_academic.includes('<details>') || 
       topic.content_academic.includes('📑'))) {
    console.log(`Fixing TOC to pure markdown for academic content: ${topic.title}`);
    
    // Use the standard markdown format (not collapsible)
    const updatedContent = insertTocIntoMarkdown(topic.content_academic, {
      title: '## Table of Contents',
      minLevel: 2,
      maxLevel: 3,
      ordered: false,
      collapsible: false  // Use standard markdown format
    });

    db.prepare(`
      UPDATE topics 
      SET content_academic = ?
      WHERE id = ?
    `).run(updatedContent, topic.id);

    updated = true;
  }

  // Fix personal content
  if (topic.content_personal && 
      (topic.content_personal.includes('<details>') || 
       topic.content_personal.includes('📑'))) {
    console.log(`Fixing TOC to pure markdown for personal content: ${topic.title}`);
    
    const updatedContent = insertTocIntoMarkdown(topic.content_personal, {
      title: '## Table of Contents',
      minLevel: 2,
      maxLevel: 3,
      ordered: false,
      collapsible: false  // Use standard markdown format
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

console.log(`\n✅ Fixed ${updatedCount} topics to use pure markdown TOCs`);