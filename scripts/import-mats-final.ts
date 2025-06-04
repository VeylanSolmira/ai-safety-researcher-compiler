import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('journey.db');

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Read the mats-final.txt file
const filePath = path.join(__dirname, '..', 'development-resources', 'mats-final.txt');
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
  const lines = text.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    // Skip empty lines
    const line = lines[i]?.trim();
    if (!line) {
      i++;
      continue;
    }
    
    // Check if this looks like a name (start of a mentor entry)
    // Names are typically 2-3 words starting with capitals
    if (line.match(/^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,2}$/) && 
        !['Stream', 'Personal Website', 'About'].includes(line)) {
      
      const mentor: Partial<Mentor> = {};
      
      // Name is current line
      mentor.name = line;
      i++;
      
      // Title is next line
      if (i < lines.length && lines[i].trim()) {
        mentor.title = lines[i].trim();
        i++;
      }
      
      // Research area is next line
      if (i < lines.length && lines[i].trim()) {
        mentor.researchArea = lines[i].trim();
        i++;
      }
      
      // Location is optional
      if (i < lines.length && lines[i].trim() && lines[i].trim() !== 'Stream') {
        mentor.location = lines[i].trim();
        i++;
      }
      
      // Stream marker
      if (i < lines.length && lines[i].trim() === 'Stream') {
        i++;
        if (i < lines.length && lines[i].trim()) {
          mentor.stream = 'Stream';
          mentor.streamDetails = lines[i].trim();
          i++;
        }
      }
      
      // Personal Website (optional)
      if (i < lines.length && lines[i].trim() === 'Personal Website') {
        i++;
        if (i < lines.length && lines[i].trim()) {
          mentor.personalWebsite = 'Personal Website';
          mentor.websiteUrl = lines[i].trim();
          i++;
        }
      }
      
      // About section
      if (i < lines.length && lines[i].trim() === 'About') {
        i++;
        const aboutLines: string[] = [];
        
        // Collect all lines until we hit another mentor name or end of file
        while (i < lines.length) {
          const nextLine = lines[i]?.trim();
          
          // Check if this is a new mentor entry
          if (nextLine && 
              nextLine.match(/^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,2}$/) &&
              !['Stream', 'Personal Website', 'About'].includes(nextLine)) {
            break;
          }
          
          // Add non-empty lines to about section
          if (lines[i]?.trim()) {
            aboutLines.push(lines[i]);
          }
          i++;
        }
        
        mentor.about = aboutLines.join('\n').trim();
      }
      
      // Only add mentor if we have all required fields
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

console.log(`Parsed ${mentors.length} mentors from mats-final.txt`);

// Check for duplicates
const checkStmt = db.prepare(`
  SELECT id, name FROM entities 
  WHERE type = 'researcher' AND tags LIKE '%mats-mentor-2025%'
`);
const existingMentors = checkStmt.all() as { id: string, name: string }[];
const existingNames = new Set(existingMentors.map(m => m.name.toLowerCase()));

console.log(`Found ${existingMentors.length} existing MATS mentors in database`);

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
let duplicateCount = 0;
let errorCount = 0;

for (const mentor of mentors) {
  try {
    // Check if mentor already exists
    if (existingNames.has(mentor.name.toLowerCase())) {
      duplicateCount++;
      console.log(`⚠ Skipping duplicate: ${mentor.name}`);
      continue;
    }
    
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
console.log(`- Duplicates skipped: ${duplicateCount}`);
console.log(`- Errors: ${errorCount}`);

// Verify the total count
const verifyStmt = db.prepare(`
  SELECT COUNT(*) as count 
  FROM entities 
  WHERE tags LIKE '%"mats-mentor-2025"%'
`);

const result = verifyStmt.get() as { count: number };
console.log(`\nTotal MATS 2025 mentors in database: ${result.count}`);

// Show some statistics
const statsStmt = db.prepare(`
  SELECT 
    json_extract(properties, '$.research_areas') as research_area,
    COUNT(*) as count
  FROM entities 
  WHERE tags LIKE '%"mats-mentor-2025"%'
  GROUP BY research_area
  ORDER BY count DESC
`);

console.log(`\nMentors by research area:`);
const stats = statsStmt.all() as { research_area: string, count: number }[];
for (const stat of stats) {
  console.log(`- ${stat.research_area}: ${stat.count}`);
}

// Show location distribution
const locationStmt = db.prepare(`
  SELECT 
    json_extract(properties, '$.location') as location,
    COUNT(*) as count
  FROM entities 
  WHERE tags LIKE '%"mats-mentor-2025"%'
    AND json_extract(properties, '$.location') IS NOT NULL
  GROUP BY location
  ORDER BY count DESC
`);

console.log(`\nMentors by location:`);
const locations = locationStmt.all() as { location: string, count: number }[];
for (const loc of locations) {
  console.log(`- ${loc.location}: ${loc.count}`);
}

db.close();