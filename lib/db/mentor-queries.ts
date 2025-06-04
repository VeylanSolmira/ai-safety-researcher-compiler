import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'journey.db');

export interface MentorTopicMapping {
  mentorId: string;
  mentorTopicDescription: string;
  context: string;
}

export function getMentorsForTopic(topicId: string): MentorTopicMapping[] {
  const db = new Database(DB_PATH);
  
  try {
    const query = `
      SELECT 
        mentor_id as mentorId,
        mentor_topic_description as mentorTopicDescription,
        context
      FROM mentor_topics
      WHERE topic_id = ?
      ORDER BY mentor_id
    `;
    
    const mentors = db.prepare(query).all(topicId) as MentorTopicMapping[];
    return mentors;
  } finally {
    db.close();
  }
}

// Helper to get mentor display names (for now, just format the ID)
export function getMentorDisplayName(mentorId: string): string {
  // Convert kebab-case ID to Title Case
  // e.g., "adria-garriga-alonso" -> "Adria Garriga-Alonso"
  return mentorId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper to get mentor organization (temporary until we have full mentor table)
export function getMentorOrganization(mentorId: string): string {
  // Hardcoded mapping for now based on cbai-2025-mentors.ts
  const orgMap: Record<string, string> = {
    'adria-garriga-alonso': 'Redwood Research',
    'mauricio-baker': 'RAND',
    'steven-basart': 'Independent',
    'david-bau-alex-loftus': 'Northeastern University',
    'joseph-bloom': 'UK AI Security Institute',
    'vicky-charisi': 'Harvard Law School & MIT',
    'michael-chen': 'METR',
    'joshua-clymer': 'Redwood Research',
    'jason-lynch': 'MIT FutureTech Lab',
    'samuel-marks': 'Anthropic',
    'dylan-hadfield-menell': 'MIT CSAIL',
    'cody-rushing': 'Redwood Research',
    'aaron-scher': 'MIRI',
    'chandan-singh': 'Microsoft Research',
    'peter-slattery': 'MIT FutureTech',
    'asa-cooper-stickland': 'Unknown',
    'max-tegmark': 'MIT',
    'tyler-tracy': 'Redwood Research',
    'jonathan-zittrain': 'Harvard Law School'
  };
  
  return orgMap[mentorId] || 'Unknown';
}