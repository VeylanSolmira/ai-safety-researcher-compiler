import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'journey.db'));

// Helper function to generate entity ID
function generateEntityId(name: string, type: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${type}`;
}

// Helper function to safely insert entity
function insertEntity(entity: {
  id: string;
  name: string;
  type: 'researcher' | 'organization' | 'platform';
  description: string;
  tags: string[];
  properties: Record<string, any>;
  personal_note?: string;
}) {
  try {
    const stmt = db.prepare(`
      INSERT INTO entities (id, name, type, description, tags, properties, personal_note, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `);
    
    stmt.run(
      entity.id,
      entity.name,
      entity.type,
      entity.description,
      JSON.stringify(entity.tags),
      JSON.stringify(entity.properties),
      entity.personal_note || null
    );
    
    console.log(`✓ Added ${entity.type}: ${entity.name}`);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      console.log(`⏭ Skipped ${entity.type}: ${entity.name} (already exists)`);
    } else {
      console.error(`✗ Error adding ${entity.name}:`, error.message);
    }
  }
}

// Researchers to add
const researchers = [
  // Anthropic
  {
    name: 'Dario Amodei',
    description: 'CEO and Co-founder of Anthropic, leading AI safety and alignment research',
    tags: ['technical-safety', 'alignment', 'leadership'],
    properties: { affiliation: 'Anthropic', role: 'CEO', focus: 'AI safety and alignment' }
  },
  {
    name: 'Daniela Amodei',
    description: 'President and Co-founder of Anthropic, focused on AI safety operations',
    tags: ['governance', 'leadership', 'operations'],
    properties: { affiliation: 'Anthropic', role: 'President', focus: 'AI safety operations' }
  },
  {
    name: 'Chris Olah',
    description: 'Pioneering researcher in neural network interpretability and mechanistic understanding',
    tags: ['interpretability', 'technical-safety', 'ml-theory'],
    properties: { affiliation: 'Anthropic', role: 'Research Scientist', focus: 'Interpretability' }
  },
  {
    name: 'Catherine Olsson',
    description: 'AI safety and alignment researcher at Anthropic',
    tags: ['technical-safety', 'alignment'],
    properties: { affiliation: 'Anthropic', role: 'Research Scientist', focus: 'AI safety' }
  },
  {
    name: 'Sam McCandlish',
    description: 'Technical AI safety researcher at Anthropic',
    tags: ['technical-safety', 'ml-theory'],
    properties: { affiliation: 'Anthropic', role: 'Research Scientist', focus: 'Technical safety' }
  },
  {
    name: 'Jared Kaplan',
    description: 'Researcher on scaling laws and AI safety at Anthropic',
    tags: ['technical-safety', 'ml-theory', 'scaling'],
    properties: { affiliation: 'Anthropic', role: 'Research Scientist', focus: 'Scaling laws' }
  },
  
  // OpenAI
  {
    name: 'Jan Leike',
    description: 'Former Head of Alignment team at OpenAI, leading alignment research',
    tags: ['alignment', 'technical-safety', 'leadership'],
    properties: { affiliation: 'Formerly OpenAI', role: 'Head of Alignment', focus: 'AI alignment' }
  },
  {
    name: 'Ilya Sutskever',
    description: 'Co-founder and former Chief Scientist at OpenAI, deep learning pioneer',
    tags: ['technical-safety', 'ml-theory', 'leadership'],
    properties: { affiliation: 'Formerly OpenAI', role: 'Chief Scientist', focus: 'AGI safety' }
  },
  {
    name: 'John Schulman',
    description: 'Co-founder of OpenAI, reinforcement learning and alignment researcher',
    tags: ['alignment', 'reinforcement-learning', 'technical-safety'],
    properties: { affiliation: 'OpenAI', role: 'Research Scientist', focus: 'RL and alignment' }
  },
  {
    name: 'Lilian Weng',
    description: 'Safety researcher at OpenAI, focusing on AI safety and alignment',
    tags: ['technical-safety', 'alignment'],
    properties: { affiliation: 'OpenAI', role: 'Research Scientist', focus: 'Safety research' }
  },
  
  // DeepMind
  {
    name: 'Shane Legg',
    description: 'Co-founder and Chief AGI Scientist at DeepMind, AGI safety pioneer',
    tags: ['technical-safety', 'agi', 'leadership'],
    properties: { affiliation: 'DeepMind', role: 'Chief AGI Scientist', focus: 'AGI safety' }
  },
  {
    name: 'Demis Hassabis',
    description: 'CEO and Co-founder of DeepMind, leading AGI development with safety focus',
    tags: ['leadership', 'agi', 'technical-safety'],
    properties: { affiliation: 'DeepMind', role: 'CEO', focus: 'AGI development' }
  },
  {
    name: 'Pushmeet Kohli',
    description: 'VP of Research at DeepMind, AI safety and robustness research',
    tags: ['technical-safety', 'robustness', 'leadership'],
    properties: { affiliation: 'DeepMind', role: 'VP Research', focus: 'AI safety' }
  },
  {
    name: 'Victoria Krakovna',
    description: 'AI safety researcher at DeepMind, specification and side effects',
    tags: ['technical-safety', 'alignment', 'specification'],
    properties: { affiliation: 'DeepMind', role: 'Research Scientist', focus: 'AI safety' }
  },
  {
    name: 'Rohin Shah',
    description: 'AI alignment researcher at DeepMind, value learning and alignment',
    tags: ['alignment', 'technical-safety', 'value-learning'],
    properties: { affiliation: 'DeepMind', role: 'Research Scientist', focus: 'AI alignment' }
  },
  
  // Academics
  {
    name: 'Stuart Russell',
    description: 'Professor at UC Berkeley, AI safety pioneer and author of "Human Compatible"',
    tags: ['technical-safety', 'philosophy', 'value-alignment'],
    properties: { affiliation: 'UC Berkeley', role: 'Professor', focus: 'Human-compatible AI' }
  },
  {
    name: 'Pieter Abbeel',
    description: 'Professor at UC Berkeley, robotics and AI safety researcher',
    tags: ['robotics', 'technical-safety', 'ml-theory'],
    properties: { affiliation: 'UC Berkeley', role: 'Professor', focus: 'Robotics and AI safety' }
  },
  {
    name: 'Max Tegmark',
    description: 'Professor at MIT, founder of Future of Life Institute',
    tags: ['existential-risk', 'governance', 'philosophy'],
    properties: { affiliation: 'MIT', role: 'Professor', focus: 'AI existential safety' }
  },
  {
    name: 'Dylan Hadfield-Menell',
    description: 'Professor at MIT, value alignment and cooperative AI',
    tags: ['alignment', 'value-alignment', 'technical-safety'],
    properties: { affiliation: 'MIT', role: 'Professor', focus: 'Value alignment' }
  },
  {
    name: 'Nick Bostrom',
    description: 'Director of Future of Humanity Institute, existential risk researcher',
    tags: ['existential-risk', 'philosophy', 'governance'],
    properties: { affiliation: 'Oxford University', role: 'Professor', focus: 'Existential risk' }
  },
  {
    name: 'Toby Ord',
    description: 'Senior Research Fellow at FHI, author of "The Precipice"',
    tags: ['existential-risk', 'philosophy', 'longtermism'],
    properties: { affiliation: 'Oxford University', role: 'Senior Research Fellow', focus: 'Existential risk' }
  },
  
  // Independent/Other Organizations
  {
    name: 'Dan Hendrycks',
    description: 'Director of Center for AI Safety, AI safety benchmarks and evaluation',
    tags: ['benchmarks', 'technical-safety', 'evaluation'],
    properties: { affiliation: 'CAIS', role: 'Director', focus: 'Safety benchmarks' }
  },
  {
    name: 'Ajeya Cotra',
    description: 'Senior Research Analyst at Open Philanthropy, AI timelines and safety',
    tags: ['forecasting', 'technical-safety', 'policy'],
    properties: { affiliation: 'Open Philanthropy', role: 'Senior Research Analyst', focus: 'AI timelines' }
  },
  {
    name: 'Adam Gleave',
    description: 'CEO of FAR AI, adversarial policies and AI safety',
    tags: ['adversarial', 'technical-safety', 'robustness'],
    properties: { affiliation: 'FAR AI / UC Berkeley', role: 'CEO / Researcher', focus: 'Adversarial robustness' }
  },
  {
    name: 'Jacob Steinhardt',
    description: 'Assistant Professor at UC Berkeley, AI safety and robustness',
    tags: ['robustness', 'technical-safety', 'ml-theory'],
    properties: { affiliation: 'UC Berkeley', role: 'Assistant Professor', focus: 'AI robustness' }
  },
  {
    name: 'Allan Dafoe',
    description: 'Head of Long-term Strategy and Governance at DeepMind',
    tags: ['governance', 'policy', 'strategy'],
    properties: { affiliation: 'DeepMind', role: 'Head of Governance', focus: 'AI governance' }
  },
  {
    name: 'Helen Toner',
    description: 'Director of Strategy at Georgetown CSET, AI policy and governance',
    tags: ['governance', 'policy', 'strategy'],
    properties: { affiliation: 'Georgetown CSET', role: 'Director of Strategy', focus: 'AI policy' }
  },
  {
    name: 'Miles Brundage',
    description: 'Head of Policy Research at OpenAI',
    tags: ['policy', 'governance', 'safety-standards'],
    properties: { affiliation: 'OpenAI', role: 'Head of Policy Research', focus: 'AI policy' }
  },
  {
    name: 'Collin Burns',
    description: 'PhD student at UC Berkeley, interpretability and alignment research',
    tags: ['interpretability', 'alignment', 'technical-safety'],
    properties: { affiliation: 'UC Berkeley', role: 'PhD Student', focus: 'Interpretability' }
  },
  {
    name: 'John Wentworth',
    description: 'Independent researcher on natural abstractions and alignment',
    tags: ['alignment', 'theory', 'natural-abstractions'],
    properties: { affiliation: 'Independent', role: 'Researcher', focus: 'Natural abstractions' }
  },
  {
    name: 'Steve Byrnes',
    description: 'Independent researcher on brain-like AGI safety',
    tags: ['neuroscience', 'agi', 'technical-safety'],
    properties: { affiliation: 'Independent', role: 'Researcher', focus: 'Brain-like AGI safety' }
  }
];

// Organizations to add
const organizations = [
  // Research Organizations
  {
    name: 'Center for AI Safety',
    description: 'Non-profit organization focused on reducing societal-scale risks from AI',
    tags: ['research', 'non-profit', 'existential-risk'],
    properties: { 
      type: 'Research Organization',
      founded: 2022,
      focus: 'AI existential safety',
      website: 'https://www.safe.ai'
    }
  },
  {
    name: 'Conjecture',
    description: 'AI safety company focused on alignment research and interpretability tools',
    tags: ['research', 'interpretability', 'alignment'],
    properties: { 
      type: 'Research Company',
      founded: 2022,
      focus: 'Applied alignment research',
      website: 'https://conjecture.dev'
    }
  },
  {
    name: 'FAR AI',
    description: 'AI safety research organization and incubator for safety projects',
    tags: ['research', 'incubator', 'technical-safety'],
    properties: { 
      type: 'Research Organization',
      founded: 2023,
      focus: 'AI safety research and incubation',
      website: 'https://far.ai'
    }
  },
  {
    name: 'Apollo Research',
    description: 'Research organization focused on deception and interpretability in AI systems',
    tags: ['research', 'interpretability', 'deception'],
    properties: { 
      type: 'Research Organization',
      founded: 2023,
      focus: 'Deceptive AI detection',
      website: 'https://apolloresearch.ai'
    }
  },
  {
    name: 'Timaeus',
    description: 'Research organization focused on developmental interpretability',
    tags: ['research', 'interpretability', 'development'],
    properties: { 
      type: 'Research Organization',
      founded: 2023,
      focus: 'Developmental interpretability',
      website: 'https://timaeus.co'
    }
  },
  {
    name: 'Ought',
    description: 'Research organization developing AI-assisted research and oversight tools',
    tags: ['research', 'tools', 'oversight'],
    properties: { 
      type: 'Research Organization',
      founded: 2018,
      focus: 'Process-based oversight',
      website: 'https://ought.org'
    }
  },
  
  // Academic Institutions
  {
    name: 'Center for Human-Compatible AI',
    description: 'UC Berkeley research center focused on beneficial AI development',
    tags: ['academic', 'research', 'value-alignment'],
    properties: { 
      type: 'Academic Center',
      founded: 2016,
      institution: 'UC Berkeley',
      focus: 'Human-compatible AI',
      website: 'https://humancompatible.ai'
    }
  },
  {
    name: 'Cambridge Centre for Existential Risk',
    description: 'Cambridge University center studying global catastrophic risks including AI',
    tags: ['academic', 'existential-risk', 'research'],
    properties: { 
      type: 'Academic Center',
      founded: 2012,
      institution: 'Cambridge University',
      focus: 'Existential risk research',
      website: 'https://www.cser.ac.uk'
    }
  },
  {
    name: 'MIT AI Alignment',
    description: 'MIT research group focused on technical AI safety and alignment',
    tags: ['academic', 'research', 'alignment'],
    properties: { 
      type: 'Academic Group',
      institution: 'MIT',
      focus: 'Technical AI safety',
      website: 'https://alignment.mit.edu'
    }
  },
  
  // Governance Organizations
  {
    name: 'Centre for the Governance of AI',
    description: 'Research institution focused on AI governance and policy',
    tags: ['governance', 'policy', 'research'],
    properties: { 
      type: 'Think Tank',
      founded: 2018,
      focus: 'AI governance research',
      website: 'https://www.governance.ai'
    }
  },
  {
    name: 'AI Now Institute',
    description: 'Research institute examining social implications of AI',
    tags: ['governance', 'policy', 'social-impact'],
    properties: { 
      type: 'Research Institute',
      founded: 2017,
      focus: 'Social implications of AI',
      website: 'https://ainowinstitute.org'
    }
  },
  {
    name: 'Partnership on AI',
    description: 'Multi-stakeholder organization developing AI best practices',
    tags: ['governance', 'industry', 'standards'],
    properties: { 
      type: 'Multi-stakeholder Organization',
      founded: 2016,
      focus: 'AI best practices',
      website: 'https://partnershiponai.org'
    }
  },
  {
    name: 'Institute for AI Policy and Strategy',
    description: 'Organization focused on AI policy research and education',
    tags: ['governance', 'policy', 'education'],
    properties: { 
      type: 'Policy Institute',
      founded: 2023,
      focus: 'AI policy and strategy',
      website: 'https://www.iaps.ai'
    }
  },
  
  // Funding Organizations
  {
    name: 'Open Philanthropy',
    description: 'Major philanthropic organization funding AI safety research and initiatives',
    tags: ['funding', 'philanthropy', 'non-profit'],
    properties: { 
      type: 'Funding Organization',
      founded: 2017,
      focus: 'AI safety funding',
      website: 'https://www.openphilanthropy.org'
    }
  },
  {
    name: 'Survival and Flourishing Fund',
    description: 'Fund supporting projects that improve humanity\'s long-term prospects',
    tags: ['funding', 'existential-risk', 'longtermism'],
    properties: { 
      type: 'Funding Organization',
      focus: 'Existential risk reduction',
      website: 'https://survivalandflourishing.fund'
    }
  },
  {
    name: 'Long-Term Future Fund',
    description: 'EA Funds program supporting AI safety and longtermist projects',
    tags: ['funding', 'effective-altruism', 'longtermism'],
    properties: { 
      type: 'Funding Program',
      parent: 'EA Funds',
      focus: 'AI safety and longtermism',
      website: 'https://funds.effectivealtruism.org'
    }
  },
  
  // Community Organizations
  {
    name: 'AI Safety Camp',
    description: 'Organization running research camps to train new AI safety researchers',
    tags: ['education', 'community', 'training'],
    properties: { 
      type: 'Training Organization',
      founded: 2018,
      focus: 'AI safety education',
      website: 'https://aisafety.camp'
    }
  },
  {
    name: 'AI Safety Support',
    description: 'Organization providing career support and resources for AI safety',
    tags: ['community', 'careers', 'support'],
    properties: { 
      type: 'Support Organization',
      focus: 'Career development',
      website: 'https://aisafety.support'
    }
  },
  {
    name: 'EleutherAI',
    description: 'Open-source AI research collective with safety considerations',
    tags: ['research', 'open-source', 'community'],
    properties: { 
      type: 'Research Collective',
      founded: 2020,
      focus: 'Open AI research',
      website: 'https://www.eleuther.ai'
    }
  },
  {
    name: 'Apart Research',
    description: 'Organization running AI safety research hackathons and sprints',
    tags: ['research', 'community', 'hackathons'],
    properties: { 
      type: 'Research Organization',
      founded: 2022,
      focus: 'Research acceleration',
      website: 'https://apartresearch.com'
    }
  }
];

// Platforms to add
const platforms = [
  // Educational Platforms
  {
    name: 'SERI ML Alignment',
    description: 'Summer research program focused on machine learning alignment theory',
    tags: ['education', 'research', 'summer-program'],
    properties: { 
      type: 'Educational Program',
      duration: '3 months',
      format: 'Remote',
      website: 'https://www.serimats.org'
    }
  },
  {
    name: 'BlueDot Impact',
    description: 'Organization running AI safety fundamentals courses and programs',
    tags: ['education', 'courses', 'fundamentals'],
    properties: { 
      type: 'Educational Platform',
      format: 'Cohort-based',
      focus: 'AI safety education',
      website: 'https://bluedot.org'
    }
  },
  {
    name: 'AGI Safety Fundamentals',
    description: 'Introductory course and reading group for AI safety concepts',
    tags: ['education', 'fundamentals', 'reading-group'],
    properties: { 
      type: 'Educational Program',
      format: 'Reading groups',
      duration: '8 weeks',
      website: 'https://www.agisafetyfundamentals.com'
    }
  },
  {
    name: 'ARENA',
    description: 'Alignment Research Engineer Accelerator - technical AI safety training',
    tags: ['education', 'technical', 'engineering'],
    properties: { 
      type: 'Training Program',
      focus: 'Technical alignment',
      format: 'Intensive bootcamp',
      website: 'https://www.arena.education'
    }
  },
  
  // Research/Publication Platforms
  {
    name: 'arXiv AI Safety',
    description: 'Section of arXiv dedicated to AI safety research papers',
    tags: ['research', 'publications', 'preprints'],
    properties: { 
      type: 'Publication Platform',
      parent: 'arXiv',
      access: 'Open',
      website: 'https://arxiv.org'
    }
  },
  {
    name: 'Distill',
    description: 'Interactive machine learning research publication platform',
    tags: ['research', 'publications', 'interactive'],
    properties: { 
      type: 'Publication Platform',
      format: 'Interactive articles',
      focus: 'ML research clarity',
      website: 'https://distill.pub'
    }
  },
  {
    name: 'AI Safety Papers',
    description: 'Curated database of AI safety research papers',
    tags: ['research', 'database', 'curation'],
    properties: { 
      type: 'Research Database',
      access: 'Open',
      focus: 'AI safety literature'
    }
  },
  
  // Tools and Benchmarks
  {
    name: 'OpenAI Evals',
    description: 'Framework for evaluating AI model capabilities and safety properties',
    tags: ['tools', 'evaluation', 'benchmarks'],
    properties: { 
      type: 'Evaluation Framework',
      access: 'Open-source',
      focus: 'Model evaluation',
      website: 'https://github.com/openai/evals'
    }
  },
  {
    name: 'TruthfulQA',
    description: 'Benchmark for measuring truthfulness in language models',
    tags: ['benchmarks', 'evaluation', 'truthfulness'],
    properties: { 
      type: 'Benchmark',
      focus: 'Model truthfulness',
      questions: 817,
      website: 'https://github.com/sylinrl/TruthfulQA'
    }
  },
  {
    name: 'Elicit',
    description: 'AI research assistant tool by Ought with safety considerations',
    tags: ['tools', 'research', 'ai-assistant'],
    properties: { 
      type: 'Research Tool',
      developer: 'Ought',
      focus: 'Research automation',
      website: 'https://elicit.org'
    }
  },
  
  // Media Platforms
  {
    name: 'Import AI',
    description: 'Weekly newsletter on AI developments by Jack Clark',
    tags: ['media', 'newsletter', 'news'],
    properties: { 
      type: 'Newsletter',
      frequency: 'Weekly',
      author: 'Jack Clark',
      website: 'https://importai.substack.com'
    }
  },
  {
    name: 'The Gradient',
    description: 'AI research magazine covering safety and technical topics',
    tags: ['media', 'magazine', 'research'],
    properties: { 
      type: 'Online Magazine',
      focus: 'AI research',
      format: 'Long-form articles',
      website: 'https://thegradient.pub'
    }
  },
  {
    name: '80000 Hours Podcast',
    description: 'Podcast on high-impact careers including AI safety',
    tags: ['media', 'podcast', 'careers'],
    properties: { 
      type: 'Podcast',
      host: 'Rob Wiblin',
      focus: 'High-impact careers',
      website: 'https://80000hours.org/podcast'
    }
  },
  {
    name: 'AXRP',
    description: 'AI X-risk Research Podcast featuring technical safety discussions',
    tags: ['media', 'podcast', 'technical'],
    properties: { 
      type: 'Podcast',
      host: 'Daniel Filan',
      focus: 'Technical AI safety',
      website: 'https://axrp.net'
    }
  },
  
  // Career Platforms
  {
    name: '80000 Hours Job Board',
    description: 'Job board for high-impact careers including AI safety positions',
    tags: ['careers', 'jobs', 'impact'],
    properties: { 
      type: 'Job Board',
      focus: 'High-impact careers',
      parent: '80000 Hours',
      website: 'https://80000hours.org/job-board'
    }
  },
  {
    name: 'Alignment Jobs',
    description: 'Specialized job board for AI alignment positions',
    tags: ['careers', 'jobs', 'alignment'],
    properties: { 
      type: 'Job Board',
      focus: 'AI alignment roles',
      website: 'https://alignmentjobs.com'
    }
  },
  {
    name: 'EA Jobs',
    description: 'Effective altruism job board with AI safety section',
    tags: ['careers', 'jobs', 'effective-altruism'],
    properties: { 
      type: 'Job Board',
      focus: 'EA organizations',
      website: 'https://ea.jobs'
    }
  },
  
  // Conference Platforms
  {
    name: 'NeurIPS AI Safety Workshop',
    description: 'Annual workshop on AI safety at the NeurIPS conference',
    tags: ['conferences', 'workshop', 'research'],
    properties: { 
      type: 'Workshop',
      frequency: 'Annual',
      parent: 'NeurIPS',
      focus: 'AI safety research'
    }
  },
  {
    name: 'EA Global',
    description: 'Conference series for effective altruism with AI safety tracks',
    tags: ['conferences', 'effective-altruism', 'networking'],
    properties: { 
      type: 'Conference Series',
      frequency: 'Multiple per year',
      focus: 'EA and AI safety',
      website: 'https://eaglobal.org'
    }
  },
  {
    name: 'ICML Safety Workshop',
    description: 'Safety-focused workshop at the ICML conference',
    tags: ['conferences', 'workshop', 'research'],
    properties: { 
      type: 'Workshop',
      frequency: 'Annual',
      parent: 'ICML',
      focus: 'ML safety research'
    }
  },
  {
    name: 'AI Safety Newsletter',
    description: 'Newsletter by Center for AI Safety covering safety developments',
    tags: ['media', 'newsletter', 'news'],
    properties: { 
      type: 'Newsletter',
      frequency: 'Monthly',
      publisher: 'CAIS',
      focus: 'AI safety updates'
    }
  }
];

// Main execution
console.log('Starting comprehensive entity import...\n');

console.log('=== Adding Researchers ===');
researchers.forEach(researcher => {
  insertEntity({
    ...researcher,
    type: 'researcher',
    id: generateEntityId(researcher.name, 'researcher')
  });
});

console.log('\n=== Adding Organizations ===');
organizations.forEach(org => {
  insertEntity({
    ...org,
    type: 'organization',
    id: generateEntityId(org.name, 'organization')
  });
});

console.log('\n=== Adding Platforms ===');
platforms.forEach(platform => {
  insertEntity({
    ...platform,
    type: 'platform',
    id: generateEntityId(platform.name, 'platform')
  });
});

// Summary
const totalBefore = db.prepare('SELECT COUNT(*) as count FROM entities WHERE active = 1').get() as { count: number };
console.log('\n=== Import Complete ===');
console.log(`Total active entities in database: ${totalBefore.count}`);

// Show breakdown by type
const breakdown = db.prepare(`
  SELECT type, COUNT(*) as count 
  FROM entities 
  WHERE active = 1 
  GROUP BY type
`).all() as Array<{ type: string; count: number }>;

console.log('\nBreakdown by type:');
breakdown.forEach(({ type, count }) => {
  console.log(`- ${type}: ${count}`);
});

db.close();