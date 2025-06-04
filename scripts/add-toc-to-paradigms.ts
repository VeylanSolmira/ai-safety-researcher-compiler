#!/usr/bin/env tsx

/**
 * Script to add table of contents to the comprehensive paradigms analysis topic
 */

import Database from 'better-sqlite3';
import { insertTocIntoMarkdown } from '../lib/utils/generate-toc';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Get the comprehensive paradigms analysis topic
const topic = db.prepare(`
  SELECT id, title, content_academic, content_personal
  FROM topics
  WHERE id = ?
`).get('comprehensive-paradigms-analysis') as any;

if (!topic) {
  console.error('Topic not found: comprehensive-paradigms-analysis');
  process.exit(1);
}

console.log(`Processing topic: ${topic.title}`);

// Add TOC to academic content
if (topic.content_academic) {
  console.log('Adding TOC to academic content...');
  const updatedAcademic = insertTocIntoMarkdown(topic.content_academic, {
    title: '## Table of Contents',
    minLevel: 2,
    maxLevel: 3,
    ordered: false
  });

  // Update the database
  const updateStmt = db.prepare(`
    UPDATE topics 
    SET content_academic = ?
    WHERE id = ?
  `);

  updateStmt.run(updatedAcademic, topic.id);
  console.log('✓ Academic content updated with TOC');
}

// Add TOC to personal content if it's long enough
if (topic.content_personal && topic.content_personal.length > 2000) {
  console.log('Adding TOC to personal content...');
  const updatedPersonal = insertTocIntoMarkdown(topic.content_personal, {
    title: '## Table of Contents',
    minLevel: 2,
    maxLevel: 3,
    ordered: false
  });

  const updateStmt = db.prepare(`
    UPDATE topics 
    SET content_personal = ?
    WHERE id = ?
  `);

  updateStmt.run(updatedPersonal, topic.id);
  console.log('✓ Personal content updated with TOC');
} else {
  console.log('ℹ Personal content too short for TOC');
}

db.close();
console.log('\n✅ Table of contents added successfully!');