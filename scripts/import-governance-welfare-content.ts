import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('journey.db');

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

const contentToImport = [
  {
    id: 'governance-basics',
    academicFile: 'governance-basics-academic.md',
    personalFile: 'governance-basics-personal.md'
  },
  {
    id: 'ai-welfare-patienthood',
    academicFile: 'ai-welfare-patienthood-academic.md',
    personalFile: 'ai-welfare-patienthood-personal.md'
  }
];

// Prepare update statement
const updateStmt = db.prepare(`
  UPDATE topics 
  SET content_academic = ?, content_personal = ?
  WHERE id = ?
`);

// Import content for each topic
for (const topic of contentToImport) {
  try {
    // Read academic content
    const academicPath = path.join(__dirname, topic.academicFile);
    const academicContent = fs.readFileSync(academicPath, 'utf-8');
    
    // Read personal content
    const personalPath = path.join(__dirname, topic.personalFile);
    const personalContent = fs.readFileSync(personalPath, 'utf-8');
    
    // Update database
    const result = updateStmt.run(academicContent, personalContent, topic.id);
    
    if (result.changes > 0) {
      console.log(`✓ Updated content for ${topic.id}`);
    } else {
      console.log(`✗ No topic found with id: ${topic.id}`);
    }
  } catch (error) {
    console.error(`Error importing content for ${topic.id}:`, error);
  }
}

// Verify the updates
const verifyStmt = db.prepare(`
  SELECT id, title, 
    CASE WHEN content_academic IS NOT NULL AND content_academic != '' THEN 'Yes' ELSE 'No' END as has_academic,
    CASE WHEN content_personal IS NOT NULL AND content_personal != '' THEN 'Yes' ELSE 'No' END as has_personal
  FROM topics 
  WHERE id IN (?, ?)
`);

console.log('\nVerification:');
const results = verifyStmt.all('governance-basics', 'ai-welfare-patienthood');
for (const topic of results) {
  console.log(`${topic.id}: Academic=${topic.has_academic}, Personal=${topic.has_personal}`);
}

db.close();