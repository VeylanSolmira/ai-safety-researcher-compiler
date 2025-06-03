#!/usr/bin/env npx tsx

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'journey.db');
const db = new Database(dbPath, { readonly: true });

// Query for research-related topics
const researchTopics = db.prepare(`
  SELECT 
    id,
    title,
    category_id,
    CASE 
      WHEN content_academic IS NOT NULL AND LENGTH(content_academic) > 0 THEN 'Has content'
      ELSE 'No content'
    END as academic_status,
    CASE 
      WHEN content_personal IS NOT NULL AND LENGTH(content_personal) > 0 THEN 'Has content'
      ELSE 'No content'
    END as personal_status,
    LENGTH(content_academic) as academic_length,
    LENGTH(content_personal) as personal_length
  FROM topics
  WHERE 
    id LIKE '%research%' OR
    id LIKE '%iterative%' OR
    id LIKE '%problem-decomposition%' OR
    id LIKE '%disrupting%' OR
    id LIKE '%methodology%' OR
    id LIKE '%scoping%' OR
    category_id = 13
  ORDER BY category_id, id
`).all();

console.log('Topics potentially related to Research Methods (Category 13):');
console.log('='.repeat(80));

researchTopics.forEach(topic => {
  console.log(`
ID: ${topic.id}
Title: ${topic.title}
Category: ${topic.category_id}
Academic Content: ${topic.academic_status} (${topic.academic_length || 0} chars)
Personal Content: ${topic.personal_status} (${topic.personal_length || 0} chars)
`);
});

// Also check what's currently in category 13
const cat13Topics = db.prepare('SELECT id, title FROM topics WHERE category_id = 13 ORDER BY id').all();
console.log('\n\nCurrent Category 13 topics:');
console.log('='.repeat(50));
cat13Topics.forEach(t => console.log(`- ${t.id}: ${t.title}`));

// Show specific topics mentioned
const specificIds = ['research-project-mgmt', 'disrupting-safety-research', 'iterative-research', 'problem-decomposition'];
console.log('\n\nSpecific topics mentioned in query:');
console.log('='.repeat(50));

specificIds.forEach(id => {
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
  if (topic) {
    console.log(`\nFound: ${id} - ${topic.title} (Category ${topic.category_id})`);
    console.log(`Academic content: ${topic.content_academic ? topic.content_academic.substring(0, 100) + '...' : 'None'}`);
    console.log(`Personal content: ${topic.content_personal ? topic.content_personal.substring(0, 100) + '...' : 'None'}`);
  } else {
    console.log(`\nNot found: ${id}`);
  }
});

db.close();