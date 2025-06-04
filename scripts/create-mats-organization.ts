import Database from 'better-sqlite3';

const db = new Database('journey.db');
db.exec('PRAGMA foreign_keys = ON');

const insertStmt = db.prepare(`
  INSERT INTO entities (
    id,
    name,
    type,
    description,
    tags,
    properties,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    type = excluded.type,
    description = excluded.description,
    tags = excluded.tags,
    properties = excluded.properties,
    updated_at = excluded.updated_at
`);

const matsOrg = {
  id: 'mats-program',
  name: 'MATS - ML Alignment & Theory Scholars Program',
  type: 'organization',
  description: 'MATS is a 10-week research mentorship program aimed at connecting talented scholars with top AI safety researchers. The program provides intensive mentorship, research training, and career development support to help scholars contribute to reducing existential risks from advanced AI systems.',
  tags: ['mats', 'research-program', 'ai-safety', 'mentorship', 'berkeley'],
  properties: {
    website: 'https://matsprogram.org',
    location: 'Berkeley, CA',
    programDuration: '10 weeks',
    summerDates: 'June - August 2025',
    alumniCount: '200+',
    mentorCount: '50+',
    tracks: [
      'Interpretability',
      'Governance',
      'Oversight/Control',
      'Security',
      'Evaluations',
      'AI Agency'
    ],
    fundingSources: [
      'Open Philanthropy',
      'Survival and Flourishing Fund',
      'Individual donors'
    ],
    applicationDeadline: 'December 15, 2024',
    stipend: '$10,000',
    housingProvided: true,
    founded: 2022
  }
};

const now = new Date().toISOString();

try {
  insertStmt.run(
    matsOrg.id,
    matsOrg.name,
    matsOrg.type,
    matsOrg.description,
    JSON.stringify(matsOrg.tags),
    JSON.stringify(matsOrg.properties),
    now,
    now
  );
  
  console.log('✓ Created MATS organization entity');
  
  // Verify
  const verifyStmt = db.prepare('SELECT * FROM entities WHERE id = ?');
  const result = verifyStmt.get('mats-program');
  if (result) {
    console.log('✓ Verified: MATS organization exists in database');
  }
} catch (error) {
  console.error('Error creating MATS organization:', error);
}

db.close();