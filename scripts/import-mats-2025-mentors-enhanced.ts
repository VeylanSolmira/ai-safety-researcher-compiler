import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('journey.db');
db.exec('PRAGMA foreign_keys = ON');

interface Education {
  degree: string;
  institution: string;
  year?: string;
  advisor?: string;
  field?: string;
}

interface MentorshipHistory {
  cohorts: string[];
  highlightedOutputs: string[];
  papers: string[];
  techniques: string[];
}

interface EnhancedMentor {
  // Basic info
  name: string;
  title: string;
  organization: string;
  researchArea: string;
  location?: string;
  website?: string;
  
  // Stream data
  streamScore?: number;
  streamMentors: string[];
  isPrimaryMentor: boolean;
  coMentors: string[];
  
  // Parsed bio data
  education: Education[];
  previousPositions: string[];
  currentRoles: string[];
  awards: string[];
  researchInterests: string[];
  mentorshipHistory: MentorshipHistory;
  
  // Metadata
  seniorityLevel: string;
  sector: string;
  companies: string[];
  fullBio: string;
}

// Extraction patterns
const patterns = {
  education: {
    phd: /PhD\s+(?:from|at|in)\s+([^,.\n]+)(?:,?\s+(?:in|studying)\s+([^,.\n]+))?/gi,
    degree: /(Bachelor's?|Master's?|MSc|BSc|BA|MA)\s+(?:degree\s+)?(?:in\s+)?([^,.\n]+)\s+(?:from|at)\s+([^,.\n]+)/gi,
    advisor: /(?:advised|supervised)\s+by\s+([^,.\n]+)/gi,
    year: /(?:earned|completed|graduated)\s+(?:in\s+)?(\d{4})/gi
  },
  positions: {
    current: /(?:is|currently)\s+(?:a|an|the)\s+([^,.\n]+)\s+(?:at|with)\s+([^,.\n]+)/gi,
    previous: /(?:was|previously|formerly)\s+(?:a|an|the)?\s*([^,.\n]+)\s+(?:at|with)\s+([^,.\n]+)/gi,
    worked: /worked\s+(?:as\s+)?(?:a|an|the)?\s*([^,.\n]+)\s+(?:at|with)\s+([^,.\n]+)/gi
  },
  awards: /(?:recipient|winner|awarded|won|received)\s+(?:of\s+)?(?:the\s+)?([^,.\n]+(?:Award|Prize|Fellowship|Grant))/gi,
  companies: /(Google DeepMind|DeepMind|Anthropic|OpenAI|Microsoft|Meta|Amazon|Apple|Redwood Research|MIRI|FHI|CHAI|GovAI|Mila)/gi,
  matsHistory: {
    cohort: /MATS\s+(\d+(?:\.\d+)?)/gi,
    outputs: /Highlighted outputs[^:]*:\s*([^]+?)(?=\n\n|$)/i,
    papers: /"([^"]+)"/g,
    techniques: /(?:introduced|developed|proposed)\s+(?:the\s+)?([^,.\n]+(?:technique|method|approach))/gi
  }
};

function extractEducation(text: string): Education[] {
  const education: Education[] = [];
  
  // Extract PhDs
  let match;
  const phdRegex = new RegExp(patterns.education.phd);
  while ((match = phdRegex.exec(text)) !== null) {
    education.push({
      degree: 'PhD',
      institution: match[1].trim(),
      field: match[2]?.trim()
    });
  }
  
  // Extract other degrees
  const degreeRegex = new RegExp(patterns.education.degree);
  while ((match = degreeRegex.exec(text)) !== null) {
    education.push({
      degree: match[1].trim(),
      field: match[2].trim(),
      institution: match[3].trim()
    });
  }
  
  // Extract advisors
  const advisorRegex = new RegExp(patterns.education.advisor);
  while ((match = advisorRegex.exec(text)) !== null) {
    const advisor = match[1].trim();
    // Try to match advisor to most recent degree
    if (education.length > 0) {
      education[education.length - 1].advisor = advisor;
    }
  }
  
  return education;
}

function extractPositions(text: string): { current: string[], previous: string[] } {
  const positions = { current: [], previous: [] };
  
  let match;
  // Current positions
  const currentRegex = new RegExp(patterns.positions.current);
  while ((match = currentRegex.exec(text)) !== null) {
    positions.current.push(`${match[1].trim()} at ${match[2].trim()}`);
  }
  
  // Previous positions
  const previousRegex = new RegExp(patterns.positions.previous);
  while ((match = previousRegex.exec(text)) !== null) {
    positions.previous.push(`${match[1].trim()} at ${match[2].trim()}`);
  }
  
  // Worked at positions
  const workedRegex = new RegExp(patterns.positions.worked);
  while ((match = workedRegex.exec(text)) !== null) {
    positions.previous.push(`${match[1].trim()} at ${match[2].trim()}`);
  }
  
  return positions;
}

function extractAwards(text: string): string[] {
  const awards: string[] = [];
  let match;
  const awardsRegex = new RegExp(patterns.awards);
  while ((match = awardsRegex.exec(text)) !== null) {
    awards.push(match[1].trim());
  }
  return awards;
}

function extractCompanies(text: string): string[] {
  const companies = new Set<string>();
  let match;
  const companyRegex = new RegExp(patterns.companies);
  while ((match = companyRegex.exec(text)) !== null) {
    companies.add(match[1].trim());
  }
  return Array.from(companies);
}

function extractMentorshipHistory(text: string): MentorshipHistory {
  const history: MentorshipHistory = {
    cohorts: [],
    highlightedOutputs: [],
    papers: [],
    techniques: []
  };
  
  // Extract MATS cohorts
  let match;
  const cohortRegex = new RegExp(patterns.matsHistory.cohort);
  while ((match = cohortRegex.exec(text)) !== null) {
    history.cohorts.push(`MATS ${match[1]}`);
  }
  
  // Extract highlighted outputs section
  const outputsMatch = patterns.matsHistory.outputs.exec(text);
  if (outputsMatch) {
    const outputsText = outputsMatch[1];
    // Split by bullet points or numbers
    const outputs = outputsText.split(/\n\s*[-•]\s*|\n\s*\d+\.\s*/).filter(o => o.trim());
    history.highlightedOutputs = outputs.map(o => o.trim());
    
    // Extract papers from outputs
    const paperRegex = new RegExp(patterns.matsHistory.papers);
    while ((match = paperRegex.exec(outputsText)) !== null) {
      history.papers.push(match[1]);
    }
  }
  
  // Extract techniques
  const techniqueRegex = new RegExp(patterns.matsHistory.techniques);
  while ((match = techniqueRegex.exec(text)) !== null) {
    history.techniques.push(match[1].trim());
  }
  
  return history;
}

function determineSeniorityLevel(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('professor')) return 'professor';
  if (titleLower.includes('phd student') || titleLower.includes('doctoral')) return 'phd_student';
  if (titleLower.includes('postdoc')) return 'postdoc';
  if (titleLower.includes('research scientist') || titleLower.includes('researcher')) return 'research_scientist';
  if (titleLower.includes('fellow')) return 'research_fellow';
  if (titleLower.includes('ceo') || titleLower.includes('director')) return 'leadership';
  if (titleLower.includes('independent')) return 'independent';
  return 'other';
}

function determineSector(organization: string): string {
  const orgLower = organization.toLowerCase();
  if (orgLower.includes('university') || orgLower.includes('mit') || orgLower.includes('berkeley') || 
      orgLower.includes('stanford') || orgLower.includes('oxford')) return 'academia';
  if (orgLower.includes('deepmind') || orgLower.includes('anthropic') || orgLower.includes('openai') ||
      orgLower.includes('google') || orgLower.includes('meta') || orgLower.includes('microsoft')) return 'industry';
  if (orgLower.includes('redwood') || orgLower.includes('miri') || orgLower.includes('governance') ||
      orgLower.includes('institute')) return 'nonprofit';
  if (orgLower.includes('independent')) return 'independent';
  return 'other';
}

function parseEnhancedMentorData(text: string): EnhancedMentor[] {
  const mentors: EnhancedMentor[] = [];
  const lines = text.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    // Skip empty lines
    if (!lines[i]?.trim()) {
      i++;
      continue;
    }
    
    // Check if this looks like a name (capitalized words, allowing for various name formats)
    const nameLine = lines[i].trim();
    if (nameLine.match(/^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+$/) && 
        !nameLine.includes('Stream') && 
        !nameLine.includes('Personal Website') && 
        !nameLine.includes('About') &&
        nameLine.split(' ').length <= 3) {
      const mentor: Partial<EnhancedMentor> = {
        name: nameLine,
        education: [],
        previousPositions: [],
        currentRoles: [],
        awards: [],
        researchInterests: [],
        mentorshipHistory: {
          cohorts: [],
          highlightedOutputs: [],
          papers: [],
          techniques: []
        },
        streamMentors: [],
        coMentors: [],
        companies: []
      };
      
      i++;
      
      // Title line
      if (i < lines.length) {
        mentor.title = lines[i].trim();
        i++;
      }
      
      // Research area
      if (i < lines.length) {
        mentor.researchArea = lines[i].trim();
        i++;
      }
      
      // Location (optional)
      if (i < lines.length && !lines[i].trim().startsWith('Stream')) {
        mentor.location = lines[i].trim();
        i++;
      }
      
      // Stream info
      if (i < lines.length && lines[i].trim() === 'Stream') {
        i++;
        if (i < lines.length) {
          const streamInfo = lines[i].trim();
          // Parse stream details like "Alex Turner, Alex Cloud - 8.0"
          const scoreMatch = streamInfo.match(/([^-]+)\s*-\s*([\d.]+)/);
          if (scoreMatch) {
            const mentorNames = scoreMatch[1].split(',').map(n => n.trim());
            mentor.streamMentors = mentorNames;
            mentor.streamScore = parseFloat(scoreMatch[2]);
            mentor.isPrimaryMentor = mentorNames[0] === mentor.name;
            mentor.coMentors = mentorNames.filter(n => n !== mentor.name);
          }
          i++;
        }
      }
      
      // Personal Website
      if (i < lines.length && lines[i].trim() === 'Personal Website') {
        i++;
        if (i < lines.length) {
          mentor.website = lines[i].trim();
          i++;
        }
      }
      
      // About section
      if (i < lines.length && lines[i].trim() === 'About') {
        i++;
        const bioLines: string[] = [];
        while (i < lines.length && lines[i].trim() !== '' && 
               !lines[i].match(/^[A-Z][a-z]+\s+[A-Z][a-z]+$/)) {
          bioLines.push(lines[i]);
          i++;
        }
        mentor.fullBio = bioLines.join('\n').trim();
        
        // Extract structured data from bio
        if (mentor.fullBio) {
          mentor.education = extractEducation(mentor.fullBio);
          const positions = extractPositions(mentor.fullBio);
          mentor.currentRoles = positions.current;
          mentor.previousPositions = positions.previous;
          mentor.awards = extractAwards(mentor.fullBio);
          mentor.companies = extractCompanies(mentor.fullBio);
          mentor.mentorshipHistory = extractMentorshipHistory(mentor.fullBio);
        }
      }
      
      // Extract organization from title
      const titleParts = mentor.title?.split(',') || [];
      const position = titleParts[0]?.trim() || mentor.title || '';
      mentor.organization = titleParts.slice(1).join(',').trim() || 'Independent';
      mentor.title = position;
      
      // Determine metadata
      mentor.seniorityLevel = determineSeniorityLevel(position);
      mentor.sector = determineSector(mentor.organization);
      
      if (mentor.name && mentor.title && mentor.researchArea && mentor.fullBio) {
        mentors.push(mentor as EnhancedMentor);
      }
    }
    
    i++;
  }
  
  return mentors;
}

// Read and parse the file
const filePath = path.join(__dirname, '..', 'development-resources', 'mats-1.txt');
const content = fs.readFileSync(filePath, 'utf-8');
const mentors = parseEnhancedMentorData(content);

console.log(`Parsed ${mentors.length} mentors with enhanced data extraction`);

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
    // Generate ID
    const id = `mats-2025-${mentor.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Create comprehensive tags
    const tags = ['mats-2025', 'mentor'];
    
    // Add research area tag
    tags.push(mentor.researchArea.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    
    // Add location tag
    if (mentor.location) {
      tags.push(mentor.location.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
    
    // Add seniority tag
    tags.push(mentor.seniorityLevel);
    
    // Add sector tag
    tags.push(mentor.sector);
    
    // Add company tags
    mentor.companies.forEach(company => {
      tags.push(company.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    });
    
    // Add technique tags
    mentor.mentorshipHistory.techniques.forEach(technique => {
      tags.push(`technique-${technique.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    });
    
    // Create rich properties object
    const properties = {
      // Basic info
      title: mentor.title,
      organization: mentor.organization,
      research_area: mentor.researchArea,
      location: mentor.location || null,
      personal_website: mentor.website || null,
      
      // Stream data
      stream_score: mentor.streamScore || null,
      stream_mentors: mentor.streamMentors,
      is_primary_mentor: mentor.isPrimaryMentor,
      co_mentors: mentor.coMentors,
      
      // Academic background
      education: mentor.education,
      current_roles: mentor.currentRoles,
      previous_positions: mentor.previousPositions,
      awards: mentor.awards,
      
      // Research & mentorship
      companies: mentor.companies,
      mentorship_history: mentor.mentorshipHistory,
      
      // Metadata
      seniority_level: mentor.seniorityLevel,
      sector: mentor.sector,
      
      // Full bio for reference
      full_bio: mentor.fullBio
    };
    
    // Create enhanced description
    let description = `${mentor.title} at ${mentor.organization}. Research area: ${mentor.researchArea}.`;
    
    if (mentor.education.length > 0) {
      const highestDegree = mentor.education.find(e => e.degree === 'PhD') || mentor.education[0];
      description += ` ${highestDegree.degree} from ${highestDegree.institution}`;
      if (highestDegree.advisor) {
        description += ` (advised by ${highestDegree.advisor})`;
      }
      description += '.';
    }
    
    if (mentor.awards.length > 0) {
      description += ` Awards: ${mentor.awards.slice(0, 2).join(', ')}.`;
    }
    
    if (mentor.mentorshipHistory.cohorts.length > 0) {
      description += ` Past MATS mentor (${mentor.mentorshipHistory.cohorts.join(', ')}).`;
    }
    
    if (mentor.streamScore) {
      description += ` Stream score: ${mentor.streamScore}.`;
    }
    
    description += `\n\n${mentor.fullBio}`;
    
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
    console.log(`✓ Imported: ${mentor.name} (${mentor.seniorityLevel}, ${mentor.sector})`);
    
    // Log interesting extracted data
    if (mentor.education.length > 0) {
      console.log(`  Education: ${mentor.education.map(e => `${e.degree} from ${e.institution}`).join(', ')}`);
    }
    if (mentor.awards.length > 0) {
      console.log(`  Awards: ${mentor.awards.join(', ')}`);
    }
    if (mentor.mentorshipHistory.papers.length > 0) {
      console.log(`  Papers: ${mentor.mentorshipHistory.papers.slice(0, 2).join(', ')}...`);
    }
    
  } catch (error) {
    errorCount++;
    console.error(`✗ Error importing ${mentor.name}:`, error);
  }
}

console.log(`\nImport complete:`);
console.log(`- Success: ${successCount}`);
console.log(`- Errors: ${errorCount}`);

// Show statistics
const statsStmt = db.prepare(`
  SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT json_extract(properties, '$.sector')) as sectors,
    COUNT(DISTINCT json_extract(properties, '$.seniority_level')) as seniority_levels,
    COUNT(DISTINCT json_extract(properties, '$.research_area')) as research_areas
  FROM entities 
  WHERE tags LIKE '%"mats-2025"%'
`);

const stats = statsStmt.get();
console.log(`\nDatabase statistics:`);
console.log(`- Total MATS 2025 mentors: ${stats.total}`);
console.log(`- Unique sectors: ${stats.sectors}`);
console.log(`- Unique seniority levels: ${stats.seniority_levels}`);
console.log(`- Unique research areas: ${stats.research_areas}`);

// Show distribution by sector
const sectorStmt = db.prepare(`
  SELECT 
    json_extract(properties, '$.sector') as sector,
    COUNT(*) as count
  FROM entities 
  WHERE tags LIKE '%"mats-2025"%'
  GROUP BY sector
  ORDER BY count DESC
`);

console.log(`\nMentors by sector:`);
const sectors = sectorStmt.all();
for (const sector of sectors) {
  console.log(`- ${sector.sector}: ${sector.count}`);
}

// Show mentors with most MATS experience
const experienceStmt = db.prepare(`
  SELECT 
    name,
    json_extract(properties, '$.mentorship_history.cohorts') as cohorts
  FROM entities 
  WHERE tags LIKE '%"mats-2025"%'
    AND json_extract(properties, '$.mentorship_history.cohorts') != '[]'
  LIMIT 5
`);

console.log(`\nMentors with MATS experience:`);
const experienced = experienceStmt.all();
for (const mentor of experienced) {
  const cohorts = JSON.parse(mentor.cohorts);
  console.log(`- ${mentor.name}: ${cohorts.join(', ')}`);
}

db.close();