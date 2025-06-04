import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'journey.db');

if (!existsSync(dbPath)) {
  console.error(`Database not found at ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');

  // 1. Update Neel Nanda to be marked as a mentor in entities
  console.log('Updating Neel Nanda as mentor in entities...');
  const neelUpdate = db.prepare(`
    UPDATE entities 
    SET 
      tags = json_insert(tags, '$[#]', 'mentor'),
      properties = json_set(
        properties,
        '$.isMentor', true,
        '$.offersmentorship', true,
        '$.researchAreas', json('["Mechanistic Interpretability", "Transformer Circuits", "AI Safety Education"]')
      )
    WHERE id = 'neel-nanda'
  `);
  const neelResult = neelUpdate.run();
  console.log(`Updated Neel Nanda: ${neelResult.changes} rows affected`);

  // 2. Add MATS mentors to mentors table
  const matsmentors = [
    {
      id: 'buck-shlegeris-mats',
      name: 'Buck Shlegeris',
      biography: 'Researcher at Redwood Research focusing on AI control, red-teaming, and alignment evaluations. MATS Summer 2025 mentor.',
      website: null,
      email: null
    },
    {
      id: 'adria-garriga-alonso-mats',
      name: 'Adrià Garriga-Alonso',
      biography: 'Researcher at FAR AI specializing in mechanistic interpretability. MATS Summer 2025 mentor.',
      website: null,
      email: null
    },
    {
      id: 'eli-lifland-mats',
      name: 'Eli Lifland',
      biography: 'Researcher at AI Futures Project working on AI governance, policy, and national security. MATS Summer 2025 mentor.',
      website: null,
      email: null
    },
    {
      id: 'ethan-perez-mats',
      name: 'Ethan Perez',
      biography: 'Researcher at Anthropic focusing on AI control, red-teaming, and scalable oversight. MATS Summer 2025 mentor.',
      website: null,
      email: null
    }
  ];

  const insertMentor = db.prepare(`
    INSERT OR IGNORE INTO mentors (id, name, biography, website, email, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  for (const mentor of matsmentors) {
    const result = insertMentor.run(mentor.id, mentor.name, mentor.biography, mentor.website, mentor.email);
    console.log(`Added ${mentor.name} to mentors table: ${result.changes} rows affected`);
  }

  // 3. Add Neel Nanda to mentors table
  console.log('Adding Neel Nanda to mentors table...');
  const neelMentorResult = insertMentor.run(
    'neel-nanda',
    'Neel Nanda',
    'Mechanistic Interpretability researcher at Anthropic. Creator of TransformerLens and prolific educator in the AI safety space through tutorials, workshops, and mentorship.',
    'https://www.neelnanda.io',
    null
  );
  console.log(`Added Neel Nanda to mentors table: ${neelMentorResult.changes} rows affected`);

  // 4. Verify all CBAI and MATS mentors have mentor tag in entities
  console.log('\nVerifying all mentors have proper tags...');
  const verifyMentors = db.prepare(`
    SELECT id, name, tags 
    FROM entities 
    WHERE (tags LIKE '%cbai-mentor%' OR tags LIKE '%mats-mentor%')
    AND tags NOT LIKE '%"mentor"%'
  `);
  const untaggedMentors = verifyMentors.all();
  
  if (untaggedMentors.length > 0) {
    console.log(`Found ${untaggedMentors.length} mentors without 'mentor' tag. Updating...`);
    const addMentorTag = db.prepare(`
      UPDATE entities 
      SET tags = json_insert(tags, '$[#]', 'mentor')
      WHERE id = ?
    `);
    
    for (const mentor of untaggedMentors) {
      addMentorTag.run(mentor.id);
      console.log(`Added 'mentor' tag to ${mentor.name}`);
    }
  }

  // 5. Final verification - count mentors
  const totalEntitiesWithMentorTag = db.prepare(`
    SELECT COUNT(*) as count FROM entities WHERE tags LIKE '%"mentor"%'
  `).get();
  
  const totalInMentorsTable = db.prepare(`
    SELECT COUNT(*) as count FROM mentors
  `).get();

  console.log('\n--- Final Statistics ---');
  console.log(`Total entities with 'mentor' tag: ${totalEntitiesWithMentorTag.count}`);
  console.log(`Total in mentors table: ${totalInMentorsTable.count}`);

  // List all mentors for verification
  console.log('\n--- All Mentors in Entities ---');
  const allMentors = db.prepare(`
    SELECT id, name, 
           CASE 
             WHEN tags LIKE '%cbai-mentor%' THEN 'CBAI'
             WHEN tags LIKE '%mats-mentor%' THEN 'MATS'
             ELSE 'Other'
           END as program
    FROM entities 
    WHERE tags LIKE '%"mentor"%'
    ORDER BY program, name
  `).all();

  for (const mentor of allMentors) {
    console.log(`${mentor.program}: ${mentor.name} (${mentor.id})`);
  }

  // Commit transaction
  db.exec('COMMIT');
  console.log('\n✅ Successfully updated all mentors!');

} catch (error) {
  console.error('Error updating mentors:', error);
  db.exec('ROLLBACK');
  process.exit(1);
} finally {
  db.close();
}