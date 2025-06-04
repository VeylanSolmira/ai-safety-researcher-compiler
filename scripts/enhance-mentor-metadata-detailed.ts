import Database from 'better-sqlite3';
import * as path from 'path';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Detailed mentor metadata based on their known expertise
const mentorDetails: Record<string, {
  mentorshipFocus: string;
  researchAreas: string[];
  expertise: string[];
  mentorshipStyle?: string;
  backgroundNote?: string;
}> = {
  'adria-garriga-alonso': {
    mentorshipFocus: 'Mechanistic Interpretability and Deceptive Alignment',
    researchAreas: [
      'Mechanistic Interpretability',
      'Deceptive Alignment',
      'AI Planning and Reasoning',
      'LLM Psychology and Behavior Analysis'
    ],
    expertise: [
      'Neural network interpretability',
      'Treacherous turns detection',
      'Model behavior analysis',
      'Safety evaluation methods'
    ],
    mentorshipStyle: 'Research-focused with emphasis on empirical investigation',
    backgroundNote: 'Researcher at FAR AI, previously at Redwood Research'
  },
  'neel-nanda': {
    mentorshipFocus: 'Mechanistic Interpretability Research',
    researchAreas: [
      'Mechanistic Interpretability',
      'Transformer Circuits',
      'Neural Network Analysis',
      'Interpretability Tools Development'
    ],
    expertise: [
      'TransformerLens development',
      'Circuit discovery',
      'Attention pattern analysis',
      'Interpretability tutorials'
    ],
    mentorshipStyle: 'Hands-on with focus on building interpretability skills',
    backgroundNote: 'Leading researcher in mechanistic interpretability, creator of TransformerLens'
  },
  'buck-shlegeris': {
    mentorshipFocus: 'AI Control and Alignment Research',
    researchAreas: [
      'AI Control',
      'Alignment Research',
      'Red Teaming',
      'Safety Evaluations'
    ],
    expertise: [
      'Control evaluations',
      'Adversarial testing',
      'Safety research methodology',
      'Alignment theory'
    ],
    mentorshipStyle: 'Problem-solving oriented with focus on practical safety work',
    backgroundNote: 'Researcher at Redwood Research, MATS mentor'
  },
  'eli-lifland': {
    mentorshipFocus: 'Evaluations and Multi-Agent Safety',
    researchAreas: [
      'AI Evaluations',
      'Multi-Agent Systems',
      'Safety Benchmarks',
      'Model Capabilities Assessment'
    ],
    expertise: [
      'Evaluation design',
      'Benchmark creation',
      'Multi-agent coordination',
      'Capability elicitation'
    ],
    mentorshipStyle: 'Empirical and evaluation-focused',
    backgroundNote: 'MATS mentor specializing in evaluations'
  },
  'ethan-perez': {
    mentorshipFocus: 'Language Model Alignment and Evaluation',
    researchAreas: [
      'Language Model Alignment',
      'Red Teaming',
      'Model Evaluations',
      'Adversarial Robustness'
    ],
    expertise: [
      'Prompt engineering',
      'Model behavior analysis',
      'Alignment techniques',
      'Safety evaluation protocols'
    ],
    mentorshipStyle: 'Research-oriented with focus on empirical methods',
    backgroundNote: 'Researcher in AI alignment and safety'
  },
  'max-tegmark': {
    mentorshipFocus: 'AI Safety Strategy and Existential Risk',
    researchAreas: [
      'AI Existential Risk',
      'AI Governance',
      'Long-term AI Safety',
      'Physics-informed AI Safety'
    ],
    expertise: [
      'Existential risk analysis',
      'AI safety strategy',
      'Public communication',
      'Interdisciplinary approaches'
    ],
    mentorshipStyle: 'Big-picture thinking with focus on long-term impact',
    backgroundNote: 'MIT professor, Future of Life Institute founder'
  },
  'dylan-hadfield-menell': {
    mentorshipFocus: 'AI Governance and Cooperative AI',
    researchAreas: [
      'AI Governance',
      'Cooperative AI',
      'Value Alignment',
      'Human-AI Interaction'
    ],
    expertise: [
      'Governance mechanisms',
      'Cooperative game theory',
      'Value learning',
      'Policy design'
    ],
    mentorshipStyle: 'Interdisciplinary with focus on human-AI cooperation',
    backgroundNote: 'MIT professor specializing in AI governance'
  },
  'chandan-singh': {
    mentorshipFocus: 'Explainable AI and Interpretability',
    researchAreas: [
      'Explainable AI',
      'Mechanistic Interpretability',
      'Model Transparency',
      'Interpretability Methods'
    ],
    expertise: [
      'Explanation methods',
      'Model visualization',
      'Feature attribution',
      'Interpretability evaluation'
    ],
    mentorshipStyle: 'Practical with focus on building interpretable systems',
    backgroundNote: 'Researcher in explainable AI'
  },
  'aaron-scher': {
    mentorshipFocus: 'AI Safety Infrastructure and Containerization',
    researchAreas: [
      'AI Safety Infrastructure',
      'Containerization for Research',
      'International AI Assessment',
      'Research Security'
    ],
    expertise: [
      'Research infrastructure',
      'Container security',
      'Capability assessment',
      'Information security'
    ],
    mentorshipStyle: 'Technical and infrastructure-focused',
    backgroundNote: 'Specializes in AI safety research infrastructure'
  }
};

// Update mentors with detailed metadata
const updateMentorDetails = db.transaction(() => {
  console.log('Updating mentors with detailed metadata...\n');
  
  for (const [mentorId, details] of Object.entries(mentorDetails)) {
    // Get current mentor data
    const mentor = db.prepare('SELECT * FROM entities WHERE id = ?').get(mentorId) as any;
    
    if (!mentor) {
      console.log(`Mentor ${mentorId} not found, skipping...`);
      continue;
    }
    
    const currentProps = JSON.parse(mentor.properties);
    const currentTags = JSON.parse(mentor.tags);
    
    // Enhance properties with detailed metadata
    const enhancedProps = {
      ...currentProps,
      mentorshipFocus: details.mentorshipFocus,
      researchAreas: details.researchAreas,
      expertise: details.expertise,
      mentorshipStyle: details.mentorshipStyle,
      backgroundNote: details.backgroundNote,
      // Preserve existing properties
      mentorshipPrograms: currentProps.mentorshipPrograms || [],
      isMentor: true,
      offersmentorship: true,
      acceptingStudents: currentProps.acceptingStudents ?? true,
      conductResearch: true
    };
    
    // Update the mentor
    const updateStmt = db.prepare(`
      UPDATE entities 
      SET properties = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    updateStmt.run(JSON.stringify(enhancedProps), mentorId);
    console.log(`Updated detailed metadata for: ${mentor.name}`);
  }
});

// Execute the update
updateMentorDetails();

// Display results
console.log('\n=== Enhanced Mentor Details ===\n');
const enhancedMentors = db.prepare(`
  SELECT id, name, properties 
  FROM entities 
  WHERE type = 'researcher' 
  AND id IN (${Object.keys(mentorDetails).map(() => '?').join(',')})
  ORDER BY name
`).all(...Object.keys(mentorDetails)) as any[];

enhancedMentors.forEach(mentor => {
  const props = JSON.parse(mentor.properties);
  console.log(`${mentor.name}:`);
  console.log(`  Mentorship Focus: ${props.mentorshipFocus}`);
  console.log(`  Research Areas: ${props.researchAreas.join(', ')}`);
  console.log(`  Expertise: ${props.expertise.join(', ')}`);
  if (props.mentorshipStyle) {
    console.log(`  Mentorship Style: ${props.mentorshipStyle}`);
  }
  if (props.backgroundNote) {
    console.log(`  Background: ${props.backgroundNote}`);
  }
  console.log();
});

db.close();
console.log('Detailed mentor metadata update complete!');