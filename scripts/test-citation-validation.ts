import { getDb } from '../lib/db';
import { topics } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function testValidation() {
  const db = getDb();
  
  // Get just one topic for testing
  const testTopics = await db.select()
    .from(topics)
    .where(eq(topics.id, 'why-ai-safety'))
    .limit(1);
  
  if (testTopics.length === 0) {
    console.log('No topic found');
    return;
  }
  
  const topic = testTopics[0];
  console.log('Testing with topic:', topic.title);
  console.log('Content available:');
  console.log('- Academic:', !!topic.contentAcademic);
  console.log('- Personal:', !!topic.contentPersonal);
  
  // Test citation patterns
  const testPatterns = [
    /(?<!\[)"([^"]+)"\s*\((\d{4})\)(?!\])/g,
    /(?<!\[)([A-Z][a-z]+(?:\s+(?:et\s+al\.|and\s+[A-Z][a-z]+))?)\s*\((\d{4})\)(?!\])/g,
  ];
  
  if (topic.contentAcademic) {
    console.log('\nTesting academic content...');
    testPatterns.forEach((pattern, i) => {
      const matches = [...topic.contentAcademic.matchAll(pattern)];
      console.log(`Pattern ${i + 1} found ${matches.length} matches`);
      matches.forEach(match => {
        console.log(`  - "${match[1]}" (${match[2]})`);
      });
    });
  }
}

testValidation().catch(console.error);