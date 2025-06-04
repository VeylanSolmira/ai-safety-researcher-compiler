import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'journey.db'));

// Function to read content from files
function readContent(filename: string): string {
  try {
    return readFileSync(join(__dirname, filename), 'utf-8');
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return '';
  }
}

// Topics to import
const topics = [
  {
    id: 'research-methodology',
    title: 'AI Safety Research Methodology',
    description: 'Master systematic approaches to AI safety research design, execution, and collaboration',
    module_id: 'advanced-interpretability',
    position: 164,
    difficulty: 'advanced',
    estimated_time: '4-6 hours',
    academic_file: 'research-methodology-academic.md',
    personal_file: 'research-methodology-personal.md'
  },
  {
    id: 'circuit-discovery',
    title: 'Novel Circuit Discovery',
    description: 'Techniques for discovering and analyzing computational circuits in neural networks for safety insights',
    module_id: 'advanced-interpretability',
    position: 165,
    difficulty: 'advanced',
    estimated_time: '4-6 hours',
    academic_file: 'circuit-discovery-academic.md',
    personal_file: 'circuit-discovery-personal.md'
  },
  {
    id: 'scalable-interpretability',
    title: 'Scalable Interpretability Methods',
    description: 'Modern techniques for interpreting large-scale AI systems efficiently using automated and distributed approaches',
    module_id: 'advanced-interpretability',
    position: 166,
    difficulty: 'advanced',
    estimated_time: '4-6 hours',
    academic_file: 'scalable-interpretability-academic.md',
    personal_file: 'scalable-interpretability-personal.md'
  }
];

// Prepare insert statement
const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO topics (
    id, title, description, module_id, position,
    difficulty, estimated_time,
    content_academic, content_personal,
    has_journey_extras, has_interactive_transition,
    created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?,
    ?, ?,
    ?, ?,
    1, 0,
    datetime('now'), datetime('now')
  )
`);

// Import each topic
console.log('Importing Category 16 topics...\n');

let successCount = 0;
for (const topic of topics) {
  try {
    // Read content from files
    const academicContent = readContent(topic.academic_file);
    const personalContent = readContent(topic.personal_file);
    
    if (!academicContent || !personalContent) {
      console.error(`⚠️  Skipping ${topic.id} - missing content files`);
      continue;
    }
    
    // Insert into database
    insertStmt.run(
      topic.id,
      topic.title,
      topic.description,
      topic.module_id,
      topic.position,
      topic.difficulty,
      topic.estimated_time,
      academicContent,
      personalContent
    );
    
    console.log(`✅ Imported: ${topic.title}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Error importing ${topic.id}:`, error);
  }
}

console.log(`\n✅ Successfully imported ${successCount}/${topics.length} topics`);

// Verify the import
const verifyStmt = db.prepare(`
  SELECT id, title, 
    LENGTH(content_academic) as academic_length,
    LENGTH(content_personal) as personal_length
  FROM topics 
  WHERE id IN (?, ?, ?)
`);

const results = verifyStmt.all('research-methodology', 'circuit-discovery', 'scalable-interpretability');

console.log('\nVerification:');
results.forEach(row => {
  console.log(`- ${row.title}: ${row.academic_length} chars (academic), ${row.personal_length} chars (personal)`);
});

db.close();