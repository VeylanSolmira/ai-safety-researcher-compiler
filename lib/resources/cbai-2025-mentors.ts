export interface Mentor {
  id: string
  name: string
  organization?: string
  biography: string
  mentorTopics: string[]
  desiredQualifications: string[]
  quickEvaluation?: {
    rating: string
    notes?: string
  }
  researchAreas: string[]
  relatedJourneyTopics?: string[]
}

export interface Organization {
  id: string
  name: string
  type: 'university' | 'research-lab' | 'company' | 'think-tank' | 'government'
  mentors: string[]
}

export interface ResearchTopic {
  id: string
  name: string
  category: 'interpretability' | 'alignment' | 'governance' | 'control' | 'evaluation' | 'formal-methods' | 'policy'
  mentors: string[]
  relatedJourneyTopics?: string[]
}

export const cbai2025Mentors: Mentor[] = [
  {
    id: 'adria-garriga-alonso',
    name: 'Adria Garriga-Alonso',
    organization: 'Redwood Research',
    biography: 'Researching how neural networks internally work, including evaluating interpretability explanations, finding NN algorithm explanations at lower costs, and understanding agent-like AI behavior. PhD in ML from University of Cambridge focused on Bayesian uncertainty quantification.',
    mentorTopics: [
      'Measuring limitations of post-training with robust lie-detection models',
      'SAEs: fixing absorption and hedging problems, feature-splitting',
      'LLM psychology: measuring LLMs from talking to them',
      'Extending planning work in Sokoban models to LLMs'
    ],
    desiredQualifications: [
      'ML knowledge: basic algorithms and transformer architecture',
      'Enthusiasm about the subject',
      'Ability to try things until they work',
      'Decent writing and software engineering skills',
      'Good at using AI to improve skills'
    ],
    quickEvaluation: {
      rating: '8-9/10'
    },
    researchAreas: ['interpretability', 'uncertainty-quantification', 'llm-psychology'],
    relatedJourneyTopics: ['mechanistic-interp', 'interpretability-subtopic']
  },
  {
    id: 'mauricio-baker',
    name: 'Mauricio Baker',
    organization: 'RAND',
    biography: 'AI policy researcher at RAND focusing on AI hardware governance, export controls, and verification of international AI agreements. Previously at OpenAI, MS in CS from Stanford.',
    mentorTopics: [
      'Developing methods to verify compliance with international AI agreements',
      'Identifying effective R&D structures for AI safety and governance',
      'Improving government visibility into AI economic impacts',
      'Under-explored topics in technical AI governance'
    ],
    desiredQualifications: [
      'Knowledge in relevant area (CS/EE for technical verification)',
      'Strong writing and analytical reasoning skills'
    ],
    quickEvaluation: {
      rating: '6/10'
    },
    researchAreas: ['hardware-governance', 'international-verification', 'policy'],
    relatedJourneyTopics: ['hardware-controls-subtopic', 'international-coordination-subtopic']
  },
  {
    id: 'steven-basart',
    name: 'Steven Basart',
    organization: 'Independent',
    biography: 'Software engineer, Python aficionado & AI/ML Researcher. Experience with data processing, training large ML models, leading teams. Former SpaceX engineer.',
    mentorTopics: [
      'Extending Honesty methods (MASK benchmark)',
      'Extending Utility engineering (emergent values)',
      'Dataset and benchmark creation'
    ],
    desiredQualifications: [
      'Published at least one ML paper',
      'Language proficiency for clear communication'
    ],
    quickEvaluation: {
      rating: '4/10'
    },
    researchAreas: ['benchmarks', 'honesty', 'evaluation'],
    relatedJourneyTopics: ['safety-benchmarks-subtopic']
  },
  {
    id: 'david-bau-alex-loftus',
    name: 'David Bau & Alex Loftus',
    organization: 'Northeastern University',
    biography: 'David Bau: Assistant Professor studying structure and interpretation of deep networks. Alex Loftus: PhD student, background in computational neuroscience and ML for drug discovery.',
    mentorTopics: [
      'Mechanistic interpretations of LLM generalization capabilities',
      'Analysis of chain of thought in reasoning models',
      'Training methods for faithful explanation generation',
      'Experiments bridging human-AI knowledge gap'
    ],
    desiredQualifications: [
      'Interest in interpretability',
      'Demonstrated research proficiency',
      'Strong programming fundamentals',
      'Ability to own and execute projects',
      'Quick scholarly comprehension'
    ],
    quickEvaluation: {
      rating: '7.5/10'
    },
    researchAreas: ['mechanistic-interpretability', 'chain-of-thought', 'faithful-explanations'],
    relatedJourneyTopics: ['mechanistic-interp', 'explainability-subtopic']
  },
  {
    id: 'joseph-bloom',
    name: 'Joseph Bloom',
    organization: 'UK AI Security Institute (AISI)',
    biography: 'Head of White Box Evaluations at UK AISI. Co-founded Decode Research/Neuronpedia, created SAE Lens library. Background in computational biology and statistics.',
    mentorTopics: [
      'Interpretability and control intersection',
      'Blue team strategies (probes, CoT monitors)',
      'Red team strategies for deceptive model organisms',
      'Gears-level models of detection methods'
    ],
    desiredQualifications: [
      'Comfortable with technical AI safety experimental techniques',
      'Agentic and independent',
      'Disciplined and structured communication'
    ],
    quickEvaluation: {
      rating: '7/10'
    },
    researchAreas: ['interpretability', 'control', 'evaluation-sabotage'],
    relatedJourneyTopics: ['red-teaming-protocols-subtopic', 'interpretability-subtopic']
  },
  {
    id: 'vicky-charisi',
    name: 'Vicky Charisi',
    organization: 'Harvard Law School & MIT',
    biography: 'Research Fellow at Harvard Berkman Klein Center, incoming MIT Research Scientist. Focus on Human-AI/Robot Interaction, AI safety, privacy, fairness. Previously at European Commission JRC.',
    mentorTopics: [
      'Systematic literature review on AGI risks in decision-making systems',
      'Safety in multi-agentic systems and human-AI teaming',
      'Legal frameworks for embodied AI and robotics safety',
      'Comparative analysis of AI safety regulations',
      'Multi-stakeholder approaches for AGI governance'
    ],
    desiredQualifications: [
      'Independent research capability',
      'Interest in AI and public policy',
      'Literature review experience',
      'Familiarity with legal texts',
      'Human-AI interaction research experience'
    ],
    quickEvaluation: {
      rating: '5/10'
    },
    researchAreas: ['human-ai-interaction', 'policy', 'multi-agent-safety'],
    relatedJourneyTopics: ['multi-agent-subtopic', 'regulatory-approaches-subtopic']
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    organization: 'METR',
    biography: 'Works on evaluations-based AI governance at METR. Advised Amazon, Google DeepMind, G42 on frontier safety policies. Research on AI deception and hazardous knowledge.',
    mentorTopics: [
      'Frontier AI safety policies',
      'Third-party oversight',
      'Safety cases',
      'International coordination',
      'Loss of control evaluations',
      'EU AI Act Code of Practice',
      'Observational scaling laws for dangerous capabilities',
      'Extending RE-Bench for AI R&D evaluation'
    ],
    desiredQualifications: [
      'ML knowledge and transformer understanding',
      'Enthusiasm',
      'Persistence',
      'Writing and software engineering skills',
      'AI-augmented skill improvement'
    ],
    quickEvaluation: {
      rating: '8/10'
    },
    researchAreas: ['safety-policies', 'evaluations', 'governance'],
    relatedJourneyTopics: ['capability-assessments-subtopic', 'safety-oversight-bodies-subtopic']
  },
  {
    id: 'joshua-clymer',
    name: 'Joshua Clymer',
    organization: 'Redwood Research',
    biography: 'Technical AI Safety Researcher at Redwood Research. Previously researched AI threat models and self-improvement evaluations at METR.',
    mentorTopics: [
      'Red team/blue team capture the flag for alignment faking detection',
      'Creating realistic alignment faking models',
      'Detection evasion techniques'
    ],
    desiredQualifications: [
      'Strong software engineering',
      'ML engineering experience (bonus)',
      'Vision or curiosity for research directions'
    ],
    quickEvaluation: {
      rating: '8.5/10'
    },
    researchAreas: ['alignment-faking', 'adversarial-techniques', 'control'],
    relatedJourneyTopics: ['deceptive-alignment', 'red-teaming-protocols-subtopic']
  },
  {
    id: 'jason-lynch',
    name: 'Jason Lynch',
    organization: 'MIT FutureTech Lab',
    biography: 'Head of Algorithms at MIT FutureTech Lab. PhD from MIT under Erik Demaine on computational complexity. Works on predicting algorithm progress and computing limitations.',
    mentorTopics: [
      'Progress in Algorithms Project - historic algorithmic progress rates',
      'Mechanistic interpretability for LLM code generation',
      'LLM adaptation to esoteric programming languages'
    ],
    desiredQualifications: [
      'Algorithms and algorithmic analysis background',
      'Quantum algorithms or algorithmic statistics experience',
      'Mechanistic interpretability techniques',
      'LLM code generation familiarity'
    ],
    quickEvaluation: {
      rating: '6.5/10',
      notes: 'Seems harder/higher standard'
    },
    researchAreas: ['algorithms', 'code-generation', 'mechanistic-interpretability'],
    relatedJourneyTopics: ['mechanistic-interp', 'interpretability-subtopic']
  },
  {
    id: 'samuel-marks',
    name: 'Samuel Marks',
    organization: 'Anthropic',
    biography: 'Leads cognitive oversight subteam at Anthropic alignment science. Focus on overseeing AI based on cognitive processes rather than I/O behavior, including lie detection.',
    mentorTopics: [
      'Overseeing models without ground-truth supervision',
      'Downstream applications of interpretability',
      'Cognitive process monitoring'
    ],
    desiredQualifications: [
      'Can drive research with minimal supervision',
      'Strong coding skills',
      'Empirical ML research experience'
    ],
    quickEvaluation: {
      rating: '8.5/10'
    },
    researchAreas: ['cognitive-oversight', 'interpretability', 'deception-detection'],
    relatedJourneyTopics: ['interpretability-subtopic', 'deceptive-alignment']
  },
  {
    id: 'dylan-hadfield-menell',
    name: 'Dylan Hadfield-Menell',
    organization: 'MIT CSAIL',
    biography: 'Tenenbaum Career Development Assistant Professor at MIT. Runs Algorithmic Alignment Group. Schmidt Sciences AI2050 Early Career Fellow. Focus on multi-agent systems and human-AI teams.',
    mentorTopics: [],
    desiredQualifications: [],
    quickEvaluation: {
      rating: '5/10',
      notes: 'Little and generic information'
    },
    researchAreas: ['multi-agent-systems', 'human-ai-teams', 'alignment'],
    relatedJourneyTopics: ['multi-agent-subtopic', 'alignment-subtopic']
  },
  {
    id: 'cody-rushing',
    name: 'Cody Rushing',
    organization: 'Redwood Research',
    biography: 'Works on high-stakes control at Redwood Research.',
    mentorTopics: [
      'AI Control projects',
      'Extending Ctrl-Z paper work',
      'Attack policy prediction across models',
      'Novel high-stakes control settings',
      'Model schelling points and goals'
    ],
    desiredQualifications: [
      'Fast empirical research execution',
      'Python proficiency',
      'Earnest and motivated',
      'Cool project experience'
    ],
    quickEvaluation: {
      rating: '7.5/10'
    },
    researchAreas: ['ai-control', 'high-stakes-safety'],
    relatedJourneyTopics: ['control-subtopic']
  },
  {
    id: 'aaron-scher',
    name: 'Aaron Scher',
    organization: 'MIRI',
    biography: 'Research focused on International Coordination on AI with emphasis on Verification Mechanisms. Background in psychology, transitioned to AI safety through MATS program.',
    mentorTopics: [
      'Survey of LLMs on consumer hardware approaches',
      'Historical case studies of research avoidance',
      'Hardware-dependent AI model development',
      'Alignment benchmarks leaderboard',
      'Chinese LLM capability evaluations'
    ],
    desiredQualifications: [
      'Interest in AI governance/policy',
      'Experience reading AI papers',
      'AI Safety Fundamentals completion',
      'Self-directed research comfort'
    ],
    quickEvaluation: {
      rating: '6.5/10'
    },
    researchAreas: ['international-coordination', 'verification', 'governance'],
    relatedJourneyTopics: ['international-coordination-subtopic', 'hardware-controls-subtopic']
  },
  {
    id: 'chandan-singh',
    name: 'Chandan Singh',
    organization: 'Microsoft Research',
    biography: 'Senior researcher at Microsoft Research deep learning group. PhD from Berkeley with Prof. Bin Yu.',
    mentorTopics: [
      'Making reasoning models more interpretable',
      'Natural-language explanations from LLMs',
      'Mechanistic interpretability'
    ],
    desiredQualifications: [
      'Experience with LLM inference and finetuning',
      'Strong ML knowledge',
      'Interpretability familiarity'
    ],
    quickEvaluation: {
      rating: '8/10'
    },
    researchAreas: ['interpretability', 'reasoning', 'explanations'],
    relatedJourneyTopics: ['interpretability-subtopic', 'explainability-subtopic']
  },
  {
    id: 'peter-slattery',
    name: 'Peter Slattery',
    organization: 'MIT FutureTech',
    biography: 'Researcher at MIT FutureTech leading research on AI risks. Leads AI Risk Repository project. PhD in Information Systems from UNSW.',
    mentorTopics: [
      'Developing control taxonomy for AI risk mitigations',
      'Literature synthesis on mitigation strategies'
    ],
    desiredQualifications: [
      'Strong literature review experience',
      'AI governance familiarity',
      'PhD or equivalent preferred',
      'U.S. work authorization (plus)'
    ],
    quickEvaluation: {
      rating: '5.5/10'
    },
    researchAreas: ['risk-assessment', 'governance', 'mitigation-strategies'],
    relatedJourneyTopics: ['risk-assessment-methodologies-subtopic']
  },
  {
    id: 'asa-cooper-stickland',
    name: 'Asa Cooper Stickland',
    organization: 'Unknown',
    biography: '',
    mentorTopics: [
      'AI control and model organisms',
      'Scaling laws for control',
      'Training models to evade monitors'
    ],
    desiredQualifications: [
      'Excellent engineering skills',
      'Familiarity with AI control, agents, model organisms'
    ],
    quickEvaluation: {
      rating: '6/10'
    },
    researchAreas: ['ai-control', 'model-organisms'],
    relatedJourneyTopics: ['control-subtopic']
  },
  {
    id: 'max-tegmark',
    name: 'Max Tegmark',
    organization: 'MIT',
    biography: 'Professor at MIT researching AI and physics. Author of "Life 3.0" and "Our Mathematical Universe". Founded Future of Life Institute. Research on mechanistic interpretability and guaranteed safe AI.',
    mentorTopics: [
      'Formal verification research'
    ],
    desiredQualifications: [],
    quickEvaluation: {
      rating: '7/10'
    },
    researchAreas: ['formal-verification', 'guaranteed-safety'],
    relatedJourneyTopics: ['formal-verification']
  },
  {
    id: 'tyler-tracy',
    name: 'Tyler Tracy',
    organization: 'Redwood Research',
    biography: 'Member of Technical Staff at Redwood Research working on AI control. Former software engineer.',
    mentorTopics: [
      'Build new control settings',
      'Design control protocols and red/blue team games',
      'Training attack policies or monitors',
      'Incrimination strategies for scheming detection'
    ],
    desiredQualifications: [
      'Technical skills in evaluating models',
      'Inspect framework experience (plus)',
      'Knowledge of AI control field',
      'Good AI safety takes'
    ],
    quickEvaluation: {
      rating: '8-8.5/10'
    },
    researchAreas: ['ai-control', 'red-teaming', 'scheming-detection'],
    relatedJourneyTopics: ['control-subtopic', 'red-teaming-protocols-subtopic']
  },
  {
    id: 'jonathan-zittrain',
    name: 'Jonathan Zittrain',
    organization: 'Harvard Law School',
    biography: 'George Bemis Professor of International Law at Harvard. Director of Berkman Klein Center for Internet & Society. Works on AI ethics, governance, and agentic AI protocols.',
    mentorTopics: [
      'Ethics and governance of AI',
      'Agentic AI protocols and risk mitigations',
      'Privacy frameworks',
      'AI in education'
    ],
    desiredQualifications: [
      'Degree in related field or relevant experience',
      'Strong writing and editing skills',
      'Project management experience',
      'Digital law/policy experience'
    ],
    quickEvaluation: {
      rating: '5.5/10'
    },
    researchAreas: ['ai-ethics', 'governance', 'agentic-ai'],
    relatedJourneyTopics: ['ethics-subtopic', 'agency-subtopic']
  }
]

export const organizations: Organization[] = [
  {
    id: 'redwood-research',
    name: 'Redwood Research',
    type: 'research-lab',
    mentors: ['adria-garriga-alonso', 'joshua-clymer', 'cody-rushing', 'tyler-tracy']
  },
  {
    id: 'rand',
    name: 'RAND Corporation',
    type: 'think-tank',
    mentors: ['mauricio-baker']
  },
  {
    id: 'northeastern-university',
    name: 'Northeastern University',
    type: 'university',
    mentors: ['david-bau-alex-loftus']
  },
  {
    id: 'uk-aisi',
    name: 'UK AI Security Institute',
    type: 'government',
    mentors: ['joseph-bloom']
  },
  {
    id: 'harvard-law',
    name: 'Harvard Law School',
    type: 'university',
    mentors: ['vicky-charisi', 'jonathan-zittrain']
  },
  {
    id: 'mit',
    name: 'MIT',
    type: 'university',
    mentors: ['vicky-charisi', 'jason-lynch', 'dylan-hadfield-menell', 'peter-slattery', 'max-tegmark']
  },
  {
    id: 'metr',
    name: 'METR',
    type: 'research-lab',
    mentors: ['michael-chen']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'company',
    mentors: ['samuel-marks']
  },
  {
    id: 'miri',
    name: 'Machine Intelligence Research Institute',
    type: 'research-lab',
    mentors: ['aaron-scher']
  },
  {
    id: 'microsoft-research',
    name: 'Microsoft Research',
    type: 'company',
    mentors: ['chandan-singh']
  }
]

export const researchTopics: ResearchTopic[] = [
  {
    id: 'sparse-autoencoders',
    name: 'Sparse Autoencoders (SAEs)',
    category: 'interpretability',
    mentors: ['adria-garriga-alonso', 'joseph-bloom'],
    relatedJourneyTopics: ['mechanistic-interp']
  },
  {
    id: 'llm-psychology',
    name: 'LLM Psychology and Behavior',
    category: 'interpretability',
    mentors: ['adria-garriga-alonso'],
    relatedJourneyTopics: ['llm-psychology'] // New topic needed
  },
  {
    id: 'lie-detection',
    name: 'AI Lie Detection and Deception',
    category: 'alignment',
    mentors: ['adria-garriga-alonso', 'samuel-marks'],
    relatedJourneyTopics: ['deceptive-alignment']
  },
  {
    id: 'hardware-governance',
    name: 'AI Hardware Governance',
    category: 'governance',
    mentors: ['mauricio-baker', 'aaron-scher'],
    relatedJourneyTopics: ['hardware-controls-subtopic']
  },
  {
    id: 'international-verification',
    name: 'International AI Agreement Verification',
    category: 'governance',
    mentors: ['mauricio-baker', 'aaron-scher'],
    relatedJourneyTopics: ['international-coordination-subtopic']
  },
  {
    id: 'benchmarks-datasets',
    name: 'AI Safety Benchmarks and Datasets',
    category: 'evaluation',
    mentors: ['steven-basart', 'aaron-scher'],
    relatedJourneyTopics: ['safety-benchmarks-subtopic']
  },
  {
    id: 'chain-of-thought',
    name: 'Chain of Thought Analysis',
    category: 'interpretability',
    mentors: ['david-bau-alex-loftus', 'joseph-bloom'],
    relatedJourneyTopics: ['chain-of-thought'] // New topic needed
  },
  {
    id: 'alignment-faking',
    name: 'Alignment Faking Detection',
    category: 'control',
    mentors: ['joshua-clymer', 'joseph-bloom'],
    relatedJourneyTopics: ['deceptive-alignment']
  },
  {
    id: 'ai-control',
    name: 'AI Control Methods',
    category: 'control',
    mentors: ['cody-rushing', 'tyler-tracy', 'asa-cooper-stickland'],
    relatedJourneyTopics: ['control-subtopic']
  },
  {
    id: 'multi-agent-safety',
    name: 'Multi-Agent AI Safety',
    category: 'alignment',
    mentors: ['vicky-charisi', 'dylan-hadfield-menell'],
    relatedJourneyTopics: ['multi-agent-safety']
  },
  {
    id: 'safety-policies',
    name: 'AI Safety Policies and Governance',
    category: 'policy',
    mentors: ['michael-chen', 'vicky-charisi', 'jonathan-zittrain'],
    relatedJourneyTopics: ['regulatory-approaches-subtopic', 'safety-oversight-bodies-subtopic']
  },
  {
    id: 'code-generation-safety',
    name: 'Safe Code Generation',
    category: 'alignment',
    mentors: ['jason-lynch'],
    relatedJourneyTopics: ['code-generation-safety'] // New topic needed
  },
  {
    id: 'cognitive-oversight',
    name: 'Cognitive Process Oversight',
    category: 'interpretability',
    mentors: ['samuel-marks'],
    relatedJourneyTopics: ['cognitive-oversight'] // New topic needed
  },
  {
    id: 'formal-verification',
    name: 'Formal Verification for AI',
    category: 'formal-methods',
    mentors: ['max-tegmark'],
    relatedJourneyTopics: ['formal-verification']
  },
  {
    id: 'model-organisms',
    name: 'Model Organisms of Misalignment',
    category: 'evaluation',
    mentors: ['joseph-bloom', 'asa-cooper-stickland'],
    relatedJourneyTopics: ['model-organisms'] // New topic needed
  },
  {
    id: 'risk-taxonomies',
    name: 'AI Risk Taxonomies and Assessment',
    category: 'governance',
    mentors: ['peter-slattery', 'vicky-charisi'],
    relatedJourneyTopics: ['risk-assessment-methodologies-subtopic']
  }
]

// Helper functions
export function getMentorsByOrganization(orgId: string): Mentor[] {
  const org = organizations.find(o => o.id === orgId)
  if (!org) return []
  return cbai2025Mentors.filter(m => org.mentors.includes(m.id))
}

export function getMentorsByTopic(topicId: string): Mentor[] {
  const topic = researchTopics.find(t => t.id === topicId)
  if (!topic) return []
  return cbai2025Mentors.filter(m => topic.mentors.includes(m.id))
}

export function getTopicsByCategory(category: ResearchTopic['category']): ResearchTopic[] {
  return researchTopics.filter(t => t.category === category)
}