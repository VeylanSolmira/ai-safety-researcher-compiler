#!/usr/bin/env tsx

/**
 * Script to automatically add table of contents to long articles in the database
 */

import Database from 'better-sqlite3';
import { insertTocIntoMarkdown, shouldAddToc } from '../lib/utils/generate-toc';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Configuration
const MIN_CONTENT_LENGTH = 5000; // Characters
const MIN_HEADINGS = 5; // Minimum number of headings to warrant a TOC

// Get all topics with substantial content
const topics = db.prepare(`
  SELECT id, title, content_academic, content_personal
  FROM topics
  WHERE 
    (LENGTH(content_academic) > ? OR LENGTH(content_personal) > ?)
    AND content_academic IS NOT NULL
`).all(MIN_CONTENT_LENGTH, MIN_CONTENT_LENGTH) as any[];

console.log(`Found ${topics.length} topics with substantial content\n`);

let updatedCount = 0;
const updatedTopics: string[] = [];

topics.forEach(topic => {
  let updated = false;

  // Check and update academic content
  if (topic.content_academic && shouldAddToc(topic.content_academic)) {
    // Check if TOC already exists
    if (!topic.content_academic.includes('<!-- TOC -->')) {
      console.log(`Adding TOC to academic content for: ${topic.title}`);
      const updatedContent = insertTocIntoMarkdown(topic.content_academic, {
        title: '## Table of Contents',
        minLevel: 2,
        maxLevel: 3,
        ordered: false
      });

      db.prepare(`
        UPDATE topics 
        SET content_academic = ?
        WHERE id = ?
      `).run(updatedContent, topic.id);

      updated = true;
    }
  }

  // Check and update personal content
  if (topic.content_personal && shouldAddToc(topic.content_personal)) {
    // Check if TOC already exists
    if (!topic.content_personal.includes('<!-- TOC -->')) {
      console.log(`Adding TOC to personal content for: ${topic.title}`);
      const updatedContent = insertTocIntoMarkdown(topic.content_personal, {
        title: '## Table of Contents',
        minLevel: 2,
        maxLevel: 3,
        ordered: false
      });

      db.prepare(`
        UPDATE topics 
        SET content_personal = ?
        WHERE id = ?
      `).run(updatedContent, topic.id);

      updated = true;
    }
  }

  if (updated) {
    updatedCount++;
    updatedTopics.push(topic.title);
  }
});

db.close();

console.log(`\n✅ Updated ${updatedCount} topics with table of contents`);
if (updatedTopics.length > 0) {
  console.log('\nUpdated topics:');
  updatedTopics.forEach(title => console.log(`  - ${title}`));
}