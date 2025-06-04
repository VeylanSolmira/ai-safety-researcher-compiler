import Database from 'better-sqlite3';
import * as path from 'path';

const db = new Database(path.join(process.cwd(), 'journey.db'));

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Comprehensive mentor metadata for all mentors
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
  'buck-shlegeris-mats': {
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
  'eli-lifland-mats': {
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
  'ethan-perez-mats': {
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
  },
  'mauricio-baker': {
    mentorshipFocus: 'AI-Assisted Research and Research Design',
    researchAreas: [
      'AI-Assisted Research',
      'Research Methodology',
      'Evaluation Design',
      'Research Infrastructure'
    ],
    expertise: [
      'Research design',
      'AI research tools',
      'Methodology development',
      'Research evaluation'
    ],
    mentorshipStyle: 'Methodological with focus on research best practices',
    backgroundNote: 'Specializes in AI-assisted research methodologies'
  },
  'steven-basart': {
    mentorshipFocus: 'Multi-Agent AI Safety and Red Teaming',
    researchAreas: [
      'Multi-Agent AI Safety',
      'Red Teaming',
      'AI Security',
      'Robustness Testing'
    ],
    expertise: [
      'Multi-agent systems',
      'Security testing',
      'Adversarial evaluation',
      'Safety assessment'
    ],
    mentorshipStyle: 'Security-focused with emphasis on adversarial thinking',
    backgroundNote: 'Expert in multi-agent safety and security testing'
  },
  'david-bau-alex-loftus': {
    mentorshipFocus: 'Causality and Agency in AI Systems',
    researchAreas: [
      'Causal Analysis',
      'AI Agency',
      'Model Behavior',
      'Interpretability'
    ],
    expertise: [
      'Causal inference',
      'Agency detection',
      'Behavioral analysis',
      'Model understanding'
    ],
    mentorshipStyle: 'Analytical with focus on understanding AI behavior',
    backgroundNote: 'Researchers specializing in causality and agency'
  },
  'joseph-bloom': {
    mentorshipFocus: 'The Science of Deep Learning',
    researchAreas: [
      'Deep Learning Theory',
      'Neural Network Science',
      'Model Understanding',
      'Learning Dynamics'
    ],
    expertise: [
      'Deep learning fundamentals',
      'Neural network theory',
      'Training dynamics',
      'Model analysis'
    ],
    mentorshipStyle: 'Theory-focused with emphasis on deep understanding',
    backgroundNote: 'Expert in the theoretical foundations of deep learning'
  },
  'vicky-charisi': {
    mentorshipFocus: 'AI Ethics and Philosophical Foundations',
    researchAreas: [
      'AI Ethics',
      'Philosophy of AI',
      'Value Alignment',
      'Ethical AI Design'
    ],
    expertise: [
      'Ethical frameworks',
      'Philosophy of mind',
      'Value theory',
      'Ethical design principles'
    ],
    mentorshipStyle: 'Philosophical with focus on ethical considerations',
    backgroundNote: 'Specializes in AI ethics and philosophical aspects'
  },
  'michael-chen': {
    mentorshipFocus: 'When Training Goes Wrong',
    researchAreas: [
      'Training Failures',
      'Model Debugging',
      'Safety During Training',
      'Failure Mode Analysis'
    ],
    expertise: [
      'Training diagnostics',
      'Failure analysis',
      'Debugging techniques',
      'Safety monitoring'
    ],
    mentorshipStyle: 'Practical with focus on identifying and fixing problems',
    backgroundNote: 'Expert in training failure modes and debugging'
  },
  'joshua-clymer': {
    mentorshipFocus: 'Model Organisms of Misalignment',
    researchAreas: [
      'Model Organisms',
      'Misalignment Studies',
      'Behavioral Analysis',
      'Safety Research'
    ],
    expertise: [
      'Model organism design',
      'Misalignment detection',
      'Behavioral experiments',
      'Safety evaluation'
    ],
    mentorshipStyle: 'Experimental with focus on empirical studies',
    backgroundNote: 'Specializes in studying misaligned model behaviors'
  },
  'jason-lynch': {
    mentorshipFocus: 'Research Avoidance and Info Hazards',
    researchAreas: [
      'Information Hazards',
      'Research Ethics',
      'Responsible Disclosure',
      'Safety Protocols'
    ],
    expertise: [
      'Info hazard assessment',
      'Research ethics',
      'Safety protocols',
      'Risk management'
    ],
    mentorshipStyle: 'Cautious with focus on responsible research practices',
    backgroundNote: 'Expert in research safety and information hazards'
  },
  'samuel-marks': {
    mentorshipFocus: 'Scaling Laws for AI Control',
    researchAreas: [
      'Scaling Laws',
      'AI Control Methods',
      'Model Scaling',
      'Control Theory'
    ],
    expertise: [
      'Scaling analysis',
      'Control methods',
      'Performance prediction',
      'Scaling experiments'
    ],
    mentorshipStyle: 'Quantitative with focus on scaling relationships',
    backgroundNote: 'Researcher in scaling laws and control methods'
  },
  'cody-rushing': {
    mentorshipFocus: 'Information Theory and AI',
    researchAreas: [
      'Information Theory',
      'AI Communication',
      'Model Compression',
      'Information Flow'
    ],
    expertise: [
      'Information theoretic analysis',
      'Communication protocols',
      'Compression techniques',
      'Information measurement'
    ],
    mentorshipStyle: 'Mathematical with focus on information-theoretic approaches',
    backgroundNote: 'Applies information theory to AI safety problems'
  },
  'peter-slattery': {
    mentorshipFocus: 'Prioritization and Resource Allocation',
    researchAreas: [
      'Research Prioritization',
      'Resource Allocation',
      'Impact Assessment',
      'Strategic Planning'
    ],
    expertise: [
      'Priority setting',
      'Resource optimization',
      'Impact evaluation',
      'Strategic thinking'
    ],
    mentorshipStyle: 'Strategic with focus on maximizing research impact',
    backgroundNote: 'Expert in research prioritization and planning'
  },
  'asa-cooper-stickland': {
    mentorshipFocus: 'Scaling Laws for AI Control',
    researchAreas: [
      'Scaling Laws',
      'Model Control',
      'Performance Analysis',
      'Control Mechanisms'
    ],
    expertise: [
      'Scaling relationships',
      'Control design',
      'Performance metrics',
      'Empirical analysis'
    ],
    mentorshipStyle: 'Data-driven with focus on empirical scaling studies',
    backgroundNote: 'Researcher in scaling laws and control'
  },
  'tyler-tracy': {
    mentorshipFocus: 'Infrastructure and Best Practices',
    researchAreas: [
      'Research Infrastructure',
      'Best Practices',
      'Tool Development',
      'Workflow Optimization'
    ],
    expertise: [
      'Infrastructure design',
      'Tool development',
      'Workflow management',
      'Best practice implementation'
    ],
    mentorshipStyle: 'Practical with focus on effective research practices',
    backgroundNote: 'Specializes in research infrastructure and tooling'
  },
  'jonathan-zittrain': {
    mentorshipFocus: 'AI Law and Governance',
    researchAreas: [
      'AI Law',
      'Technology Governance',
      'Legal Frameworks',
      'Policy Development'
    ],
    expertise: [
      'Legal analysis',
      'Governance design',
      'Policy development',
      'Regulatory frameworks'
    ],
    mentorshipStyle: 'Interdisciplinary with focus on law and policy',
    backgroundNote: 'Harvard Law professor, expert in technology law'
  }
};

// Update all mentors with comprehensive metadata
const updateAllMentors = db.transaction(() => {
  console.log('Updating all mentors with comprehensive metadata...\n');
  
  let updatedCount = 0;
  let notFoundCount = 0;
  
  for (const [mentorId, details] of Object.entries(mentorDetails)) {
    // Get current mentor data
    const mentor = db.prepare('SELECT * FROM entities WHERE id = ?').get(mentorId) as any;
    
    if (!mentor) {
      console.log(`Mentor ${mentorId} not found, skipping...`);
      notFoundCount++;
      continue;
    }
    
    const currentProps = JSON.parse(mentor.properties);
    
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
      conductResearch: true,
      // Preserve other existing fields
      affiliation: currentProps.affiliation,
      organization: currentProps.organization,
      location: currentProps.location,
      website: currentProps.website,
      email: currentProps.email,
      matsProfile: currentProps.matsProfile
    };
    
    // Update the mentor
    const updateStmt = db.prepare(`
      UPDATE entities 
      SET properties = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    updateStmt.run(JSON.stringify(enhancedProps), mentorId);
    console.log(`✓ Updated: ${mentor.name}`);
    updatedCount++;
  }
  
  console.log(`\nSummary: Updated ${updatedCount} mentors, ${notFoundCount} not found`);
});

// Execute the update
updateAllMentors();

// Display final statistics
console.log('\n=== Final Mentor Statistics ===\n');

const allMentors = db.prepare(`
  SELECT id, name, properties 
  FROM entities 
  WHERE type = 'researcher' 
  AND tags LIKE '%mentor%'
  ORDER BY name
`).all() as any[];

console.log(`Total mentors in database: ${allMentors.length}`);

// Count mentors with enhanced metadata
let enhancedCount = 0;
allMentors.forEach(mentor => {
  const props = JSON.parse(mentor.properties);
  if (props.mentorshipFocus && props.researchAreas && props.expertise) {
    enhancedCount++;
  }
});

console.log(`Mentors with enhanced metadata: ${enhancedCount}`);
console.log(`Mentors needing enhancement: ${allMentors.length - enhancedCount}`);

// Show sample of enhanced mentors
console.log('\n=== Sample Enhanced Mentors ===\n');
const sampleMentors = allMentors
  .filter(m => {
    const props = JSON.parse(m.properties);
    return props.mentorshipFocus && props.researchAreas && props.expertise;
  })
  .slice(0, 3);

sampleMentors.forEach(mentor => {
  const props = JSON.parse(mentor.properties);
  console.log(`${mentor.name}:`);
  console.log(`  Focus: ${props.mentorshipFocus}`);
  console.log(`  Areas: ${props.researchAreas.slice(0, 3).join(', ')}...`);
  console.log(`  Style: ${props.mentorshipStyle || 'Not specified'}`);
  console.log();
});

db.close();
console.log('Comprehensive mentor metadata update complete!');