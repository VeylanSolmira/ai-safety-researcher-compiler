#!/usr/bin/env npx tsx

import { getDb } from '../lib/db/index';
import { topics } from '../lib/db/schema';
import { or, like, eq, sql } from 'drizzle-orm';

async function checkResearchTopics() {
  const db = getDb();
  
  // Query for research-related topics
  const researchTopics = await db
    .select({
      id: topics.id,
      title: topics.title,
      categoryId: topics.categoryId,
      academicStatus: sql<string>`CASE 
        WHEN ${topics.contentAcademic} IS NOT NULL AND LENGTH(${topics.contentAcademic}) > 0 THEN 'Has content'
        ELSE 'No content'
      END`,
      personalStatus: sql<string>`CASE 
        WHEN ${topics.contentPersonal} IS NOT NULL AND LENGTH(${topics.contentPersonal}) > 0 THEN 'Has content'
        ELSE 'No content'
      END`,
      academicLength: sql<number>`LENGTH(${topics.contentAcademic})`,
      personalLength: sql<number>`LENGTH(${topics.contentPersonal})`
    })
    .from(topics)
    .where(
      or(
        like(topics.id, '%research%'),
        like(topics.id, '%iterative%'),
        like(topics.id, '%problem-decomposition%'),
        like(topics.id, '%disrupting%'),
        like(topics.id, '%methodology%'),
        like(topics.id, '%scoping%'),
        eq(topics.categoryId, 13)
      )
    )
    .orderBy(topics.categoryId, topics.id);

  console.log('Topics potentially related to Research Methods (Category 13):');
  console.log('='.repeat(80));

  researchTopics.forEach(topic => {
    console.log(`
ID: ${topic.id}
Title: ${topic.title}
Category: ${topic.categoryId}
Academic Content: ${topic.academicStatus} (${topic.academicLength || 0} chars)
Personal Content: ${topic.personalStatus} (${topic.personalLength || 0} chars)
`);
  });

  // Also check what's currently in category 13
  const cat13Topics = await db
    .select({
      id: topics.id,
      title: topics.title
    })
    .from(topics)
    .where(eq(topics.categoryId, 13))
    .orderBy(topics.id);
    
  console.log('\n\nCurrent Category 13 topics:');
  console.log('='.repeat(50));
  cat13Topics.forEach(t => console.log(`- ${t.id}: ${t.title}`));

  // Show specific topics mentioned
  const specificIds = ['research-project-mgmt', 'disrupting-safety-research', 'iterative-research', 'problem-decomposition'];
  console.log('\n\nSpecific topics mentioned in query:');
  console.log('='.repeat(50));

  for (const id of specificIds) {
    const [topic] = await db
      .select()
      .from(topics)
      .where(eq(topics.id, id))
      .limit(1);
      
    if (topic) {
      console.log(`\nFound: ${id} - ${topic.title} (Category ${topic.categoryId})`);
      console.log(`Academic content: ${topic.contentAcademic ? topic.contentAcademic.substring(0, 100) + '...' : 'None'}`);
      console.log(`Personal content: ${topic.contentPersonal ? topic.contentPersonal.substring(0, 100) + '...' : 'None'}`);
    } else {
      console.log(`\nNot found: ${id}`);
    }
  }
}

checkResearchTopics();