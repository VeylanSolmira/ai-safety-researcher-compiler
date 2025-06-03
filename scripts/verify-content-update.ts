#!/usr/bin/env npx tsx

import { getDb } from '../lib/db/index';
import { topics } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function verifyUpdate() {
  const db = getDb();
  const topic = await db
    .select()
    .from(topics)
    .where(eq(topics.id, 'prerequisites-foundations'))
    .limit(1);
  
  if (topic[0]) {
    console.log('✓ Topic found in database');
    console.log('Content preview:', topic[0].contentAcademic?.substring(0, 100) + '...');
    console.log('Last updated:', topic[0].updatedAt);
  } else {
    console.log('✗ Topic not found');
  }
}

verifyUpdate();