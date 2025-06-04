#!/usr/bin/env npx tsx

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'journey.db');
const db = new Database(dbPath, { readonly: true });

async function checkBlobContent() {
  console.log('Checking for topics with BLOB content...\n');

  try {
    // Get all topics from the database
    const topics = db.prepare(`
      SELECT 
        id, 
        title, 
        module_id,
        content_academic,
        content_personal
      FROM topics
      ORDER BY id
    `).all();

    console.log(`Total topics in database: ${topics.length}\n`);

    let blobCount = 0;
    const blobTopics: any[] = [];

    // Check each topic for BLOB content
    topics.forEach((topic: any) => {
      const hasAcademicBlob = topic.content_academic instanceof Buffer;
      const hasPersonalBlob = topic.content_personal instanceof Buffer;
      
      if (hasAcademicBlob || hasPersonalBlob) {
        blobCount++;
        blobTopics.push({
          id: topic.id,
          title: topic.title,
          module_id: topic.module_id,
          hasAcademicBlob,
          hasPersonalBlob,
          // Convert first 200 chars of BLOB to string for preview
          academicPreview: hasAcademicBlob && topic.content_academic 
            ? topic.content_academic.toString('utf-8').substring(0, 200) 
            : null,
          personalPreview: hasPersonalBlob && topic.content_personal
            ? topic.content_personal.toString('utf-8').substring(0, 200)
            : null
        });
      }
    });

    console.log(`Topics with BLOB content: ${blobCount} out of ${topics.length} (${(blobCount/topics.length*100).toFixed(1)}%)\n`);

    if (blobCount > 0) {
      console.log('Topics with BLOB content:');
      console.log('========================\n');
      
      blobTopics.forEach((topic, index) => {
        console.log(`${index + 1}. Topic ID: ${topic.id}`);
        console.log(`   Title: ${topic.title}`);
        console.log(`   Module ID: ${topic.module_id}`);
        console.log(`   Has Academic BLOB: ${topic.hasAcademicBlob}`);
        console.log(`   Has Personal BLOB: ${topic.hasPersonalBlob}`);
        
        if (topic.academicPreview) {
          console.log(`   Academic content preview:`);
          console.log(`   "${topic.academicPreview}..."`);
        }
        
        if (topic.personalPreview) {
          console.log(`   Personal content preview:`);
          console.log(`   "${topic.personalPreview}..."`);
        }
        
        console.log();
      });

      // Group by module for summary
      const moduleStats = blobTopics.reduce((acc: any, topic: any) => {
        if (!acc[topic.module_id]) {
          acc[topic.module_id] = { count: 0, topics: [] };
        }
        acc[topic.module_id].count++;
        acc[topic.module_id].topics.push(topic.title);
        return acc;
      }, {});

      console.log('\nBLOB content by module:');
      console.log('=====================\n');
      Object.entries(moduleStats).forEach(([moduleId, stats]: [string, any]) => {
        console.log(`Module ${moduleId}: ${stats.count} topics with BLOB content`);
        console.log(`Topics: ${stats.topics.join(', ')}`);
        console.log();
      });
    }

    // Also check for topics with null/empty content
    const emptyTopics = topics.filter((topic: any) => 
      (!topic.content_academic || topic.content_academic === '') && 
      (!topic.content_personal || topic.content_personal === '')
    );

    console.log(`\nTopics with no content: ${emptyTopics.length}`);
    if (emptyTopics.length > 0) {
      console.log('Topics without content:');
      emptyTopics.slice(0, 10).forEach((topic: any) => {
        console.log(`- ${topic.title} (ID: ${topic.id}, Module: ${topic.module_id})`);
      });
      if (emptyTopics.length > 10) {
        console.log(`... and ${emptyTopics.length - 10} more`);
      }
    }

  } catch (error) {
    console.error('Error checking BLOB content:', error);
  }
}

// Run the check
checkBlobContent();