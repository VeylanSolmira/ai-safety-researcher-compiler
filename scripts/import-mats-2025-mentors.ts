import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('journey.db');

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Read the mats-1.txt file
const filePath = path.join(__dirname, '..', 'development-resources', 'mats-1.txt');
const content = fs.readFileSync(filePath, 'utf-8');

// Parse the mentor data
interface Mentor {
  name: string;
  title: string;
  researchArea: string;
  location?: string;
  stream: string;
  streamDetails: string;
  personalWebsite?: string;
  websiteUrl?: string;
  about: string;
}

function parseMentorData(text: string): Mentor[] {
  const mentors: Mentor[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  let i = 0;
  while (i < lines.length) {
    // Each mentor entry starts with a name
    if (lines[i] && !lines[i].startsWith('About') && !lines[i].startsWith('Personal Website') && !lines[i].startsWith('Stream')) {
      const mentor: Partial<Mentor> = {};
      
      // Name is first line
      mentor.name = lines[i].trim();
      i++;
      
      // Title is second line
      if (i < lines.length) {
        mentor.title = lines[i].trim();
        i++;
      }
      
      // Research area is third line
      if (i < lines.length) {
        mentor.researchArea = lines[i].trim();
        i++;
      }
      
      // Location is optional (not all have it)
      if (i < lines.length && !lines[i].startsWith('Stream')) {
        mentor.location = lines[i].trim();
        i++;
      }
      
      // Stream marker
      if (i < lines.length && lines[i] === 'Stream') {
        i++;
        if (i < lines.length) {
          mentor.stream = 'Stream';
          mentor.streamDetails = lines[i].trim();
          i++;
        }
      }
      
      // Personal Website (optional)
      if (i < lines.length && lines[i] === 'Personal Website') {
        i++;
        if (i < lines.length) {
          mentor.personalWebsite = 'Personal Website';
          mentor.websiteUrl = lines[i].trim();
          i++;
        }
      }
      
      // About section
      if (i < lines.length && lines[i] === 'About') {
        i++;
        const aboutLines: string[] = [];
        while (i < lines.length && lines[i] && 
               !lines[i].match(/^[A-Z][a-z]+ [A-Z][a-z]+$/) && // Not a new name
               lines[i] !== 'Stream' && 
               lines[i] !== 'Personal Website') {
          aboutLines.push(lines[i]);
          i++;
        }
        mentor.about = aboutLines.join('\n').trim();
      }
      
      if (mentor.name && mentor.title && mentor.researchArea && mentor.about) {
        mentors.push(mentor as Mentor);
      }
    } else {
      i++;
    }
  }
  
  return mentors;
}

const mentors = parseMentorData(content);

console.log(`Parsed ${mentors.length} mentors from mats-1.txt`);

// Prepare insert statement
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

// Insert each mentor
let successCount = 0;
let errorCount = 0;

for (const mentor of mentors) {
  try {
    // Generate ID from name
    const id = `mats-2025-${mentor.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Extract organization from title
    const titleParts = mentor.title.split(',');
    const position = titleParts[0]?.trim() || mentor.title;
    const organization = titleParts.slice(1).join(',').trim() || 'Independent';
    
    // Create tags array
    const tags = ['mats-mentor-2025', 'mats-2025', 'mentor', mentor.researchArea.toLowerCase()];
    if (mentor.location) {
      tags.push(mentor.location.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
    
    // Create properties object with all metadata
    const properties = {
      title: position,
      organization: organization,
      research_areas: mentor.researchArea,
      track: mentor.researchArea, // For display on MATS page
      researchFocus: mentor.researchArea,
      location: mentor.location || null,
      personal_website: mentor.websiteUrl || null,
      stream_details: mentor.streamDetails || null
    };
    
    // Create description combining bio and key info
    const description = `${position} at ${organization}. Research area: ${mentor.researchArea}. ${mentor.about}` + 
      (mentor.streamDetails ? `\n\nMATS Stream: ${mentor.streamDetails}` : '');
    
    const now = new Date().toISOString();
    
    insertStmt.run(
      id,
      mentor.name,
      'researcher',
      description,
      JSON.stringify(tags),
      JSON.stringify(properties),
      now,
      now
    );
    
    successCount++;
    console.log(`✓ Imported: ${mentor.name}`);
  } catch (error) {
    errorCount++;
    console.error(`✗ Error importing ${mentor.name}:`, error);
  }
}

console.log(`\nImport complete:`);
console.log(`- Success: ${successCount}`);
console.log(`- Errors: ${errorCount}`);

// Verify the imports
const verifyStmt = db.prepare(`
  SELECT COUNT(*) as count 
  FROM entities 
  WHERE tags LIKE '%"mats-2025"%'
`);

const result = verifyStmt.get() as { count: number };
console.log(`\nTotal MATS 2025 mentors in database: ${result.count}`);

// Show a few examples
const exampleStmt = db.prepare(`
  SELECT name, type, description, tags
  FROM entities 
  WHERE tags LIKE '%"mats-2025"%'
  LIMIT 5
`);

console.log(`\nExample entries:`);
const examples = exampleStmt.all();
for (const example of examples) {
  const desc = example.description.split('.')[0]; // First sentence
  console.log(`- ${example.name}: ${desc}`);
}

db.close();