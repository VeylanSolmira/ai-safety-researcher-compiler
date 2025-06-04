import Database from 'better-sqlite3';
import * as path from 'path';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Begin transaction
const mergeDuplicates = db.transaction(() => {
  console.log('Starting merge of duplicate entries and mentor metadata enhancement...\n');

  // 1. First, let's check the entity_topics table for references
  const checkReferences = db.prepare(`
    SELECT topic_id, entity_id 
    FROM entity_topics 
    WHERE entity_id IN ('adria-garriga-alonso', 'adria-garriga-alonso-mats')
  `).all();
  
  console.log('References found:', checkReferences);

  // 2. Update entity_topics references to point to the main entry
  const updateReferences = db.prepare(`
    UPDATE entity_topics 
    SET entity_id = 'adria-garriga-alonso' 
    WHERE entity_id = 'adria-garriga-alonso-mats'
  `);
  
  const refResult = updateReferences.run();
  console.log(`Updated ${refResult.changes} entity_topics references\n`);

  // 3. Merge the properties from both entries
  const mainEntry = db.prepare('SELECT * FROM entities WHERE id = ?').get('adria-garriga-alonso') as any;
  const matsEntry = db.prepare('SELECT * FROM entities WHERE id = ?').get('adria-garriga-alonso-mats') as any;
  
  const mainProps = JSON.parse(mainEntry.properties);
  const matsProps = JSON.parse(matsEntry.properties);
  const mainTags = JSON.parse(mainEntry.tags);
  const matsTags = JSON.parse(matsEntry.tags);
  
  // Merge properties
  const mergedProps = {
    ...mainProps,
    ...matsProps,
    // Keep the more detailed info
    affiliation: matsProps.organization || mainProps.affiliation,
    organization: matsProps.organization,
    location: matsProps.location,
    mentorshipProgram: matsProps.mentorshipProgram,
    mentorshipFocus: matsProps.researchFocus || mainProps.researchAreas?.[0],
    researchAreas: [...new Set([...(mainProps.researchAreas || []), ...(matsProps.researchFocus ? [matsProps.researchFocus] : [])])],
    track: matsProps.track,
    matsProfile: matsProps.matsProfile,
    website: mainProps.website || matsProps.website,
    email: mainProps.email || matsProps.email,
    offersmentorship: true,
    acceptingStudents: mainProps.acceptingStudents ?? true,
    conductResearch: mainProps.conductResearch ?? true,
    isMentor: true
  };
  
  // Merge tags
  const mergedTags = [...new Set([...mainTags, ...matsTags])];
  
  // Update the main entry with merged data
  const updateMain = db.prepare(`
    UPDATE entities 
    SET name = 'Adrià Garriga-Alonso',
        tags = ?,
        properties = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 'adria-garriga-alonso'
  `);
  
  updateMain.run(JSON.stringify(mergedTags), JSON.stringify(mergedProps));
  console.log('Updated main entry with merged data');
  
  // 4. Delete the duplicate entry
  const deleteDuplicate = db.prepare('DELETE FROM entities WHERE id = ?');
  deleteDuplicate.run('adria-garriga-alonso-mats');
  console.log('Deleted duplicate entry\n');
});

// Execute the merge
mergeDuplicates();

// Now enhance all mentor metadata
const enhanceMentorMetadata = db.transaction(() => {
  console.log('Enhancing mentor metadata...\n');
  
  // Get all mentors
  const mentors = db.prepare(`
    SELECT id, name, tags, properties, description 
    FROM entities 
    WHERE type = 'researcher' 
    AND tags LIKE '%mentor%'
  `).all() as any[];
  
  for (const mentor of mentors) {
    const tags = JSON.parse(mentor.tags);
    const props = JSON.parse(mentor.properties);
    
    // Skip if already has good metadata
    if (props.mentorshipFocus && props.researchAreas && props.mentorshipPrograms) {
      continue;
    }
    
    // Enhance properties based on tags and description
    const enhancedProps = { ...props };
    
    // Infer research areas from tags
    const researchAreas = new Set(props.researchAreas || []);
    
    if (tags.includes('interpretability') || tags.includes('mechanistic-interpretability')) {
      researchAreas.add('Mechanistic Interpretability');
    }
    if (tags.includes('alignment') || tags.includes('ai-alignment')) {
      researchAreas.add('AI Alignment');
    }
    if (tags.includes('safety') || tags.includes('ai-safety')) {
      researchAreas.add('AI Safety');
    }
    if (tags.includes('robustness')) {
      researchAreas.add('Robustness and Reliability');
    }
    if (tags.includes('governance')) {
      researchAreas.add('AI Governance');
    }
    if (tags.includes('evaluations')) {
      researchAreas.add('AI Evaluations');
    }
    if (tags.includes('multi-agent')) {
      researchAreas.add('Multi-Agent Systems');
    }
    
    enhancedProps.researchAreas = Array.from(researchAreas);
    
    // Set mentorship focus if not present
    if (!enhancedProps.mentorshipFocus && enhancedProps.researchAreas.length > 0) {
      enhancedProps.mentorshipFocus = enhancedProps.researchAreas[0];
    }
    
    // Set mentorship programs
    const programs = new Set(enhancedProps.mentorshipPrograms || []);
    
    if (tags.includes('cbai-mentor')) {
      programs.add('Cambridge AI Safety Hub Fellowship');
    }
    if (tags.includes('mats-mentor-2025')) {
      programs.add('MATS Summer 2025');
    }
    if (tags.includes('seri-mats')) {
      programs.add('SERI MATS');
    }
    if (tags.includes('arena')) {
      programs.add('ARENA');
    }
    
    enhancedProps.mentorshipPrograms = Array.from(programs);
    
    // Ensure mentor flags are set
    enhancedProps.isMentor = true;
    enhancedProps.offersmentorship = enhancedProps.offersmentorship ?? true;
    
    // Update the mentor
    const updateMentor = db.prepare(`
      UPDATE entities 
      SET properties = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    updateMentor.run(JSON.stringify(enhancedProps), mentor.id);
    console.log(`Enhanced metadata for: ${mentor.name}`);
  }
});

// Execute mentor enhancement
enhanceMentorMetadata();

// Display final results
console.log('\n=== Final Results ===');
const finalMentors = db.prepare(`
  SELECT id, name, properties 
  FROM entities 
  WHERE type = 'researcher' 
  AND tags LIKE '%mentor%'
  ORDER BY name
`).all() as any[];

console.log(`\nTotal mentors: ${finalMentors.length}\n`);

// Show a sample of enhanced mentors
console.log('Sample of enhanced mentors:');
finalMentors.slice(0, 5).forEach(mentor => {
  const props = JSON.parse(mentor.properties);
  console.log(`\n${mentor.name}:`);
  console.log(`  - Mentorship Focus: ${props.mentorshipFocus || 'Not set'}`);
  console.log(`  - Research Areas: ${props.researchAreas?.join(', ') || 'Not set'}`);
  console.log(`  - Programs: ${props.mentorshipPrograms?.join(', ') || 'Not set'}`);
});

db.close();
console.log('\nMerge and enhancement complete!');