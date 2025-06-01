// Define available learning paths
export type LearningPath = 'all' | 'technical-safety' | 'governance' | 'engineering' | 'research'

// Topic - the most granular level of content
export interface Topic {
  id: string
  title: string
  description: string
  estimatedTime: string
  
  // Content sources
  roadmapContentId?: string // Link to roadmap content
  additionalContentIds?: string[] // Additional roadmap content to load
  content?: string // Direct markdown content
  hasJourneyExtras?: boolean // Include JourneyIntroductionExtras component
  
  // Deep dive connections
  relatedCaseStudies?: string[] // IDs of relevant case studies
  relatedExperiments?: string[] // IDs of hands-on experiments
  relatedExplorations?: string[] // IDs of theoretical explorations
  
  // Learning metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  prerequisites?: string[] // Topic IDs that should be completed first
  assessmentId?: string // ID to look up assessment questions
  hasInteractiveTransition?: boolean // Show AI Teacher interface after
  
  // Path relevance
  paths?: LearningPath[] // Which learning paths this topic belongs to
}

// Module - contains related topics
export interface Module {
  id: string
  title: string
  description: string
  estimatedTime: string
  topics: Topic[]
  
  // Module metadata
  learningObjectives: string[]
  practicalComponents?: string[] // Description of hands-on elements
  assessmentType?: 'quiz' | 'project' | 'peer-review' | 'self-assessment'
  
  // Path relevance
  paths?: LearningPath[] // Which learning paths this module belongs to
}

// Tier - the highest level grouping
export interface Tier {
  id: string
  title: string
  level: 'foundation' | 'intermediate' | 'advanced' | 'expert'
  description: string
  estimatedDuration: string // e.g., "3 months"
  
  // Structure
  modules: Module[]
  
  // Navigation
  type: 'linear' | 'open-world' // Linear = mandatory path, Open-world = choice-based
  prerequisites: string[] // Tier IDs that must be completed first
  unlocks: string[] // Tier IDs that this unlocks
  
  // Tier metadata
  skillsGained: string[]
  careerRelevance: string[]
  requiredBackground?: string[]
}

// Legacy interfaces kept for backward compatibility during migration
export interface JourneySubsection {
  id: string
  title: string
  roadmapContentId: string
  estimatedTime: string
}

export interface JourneySection {
  id: string
  title: string
  type: 'linear' | 'open-world'
  contentType: 'build' | 'learn' | 'mixed'
  description: string
  estimatedTime: string
  prerequisites: string[]
  unlocks: string[]
  roadmapContentIds?: string[]
  hasAdditionalContent?: boolean
  subsections?: JourneySubsection[]
}

export interface JourneyProgress {
  userId?: string // For future user auth
  
  // Current position
  currentTierId: string
  currentModuleId?: string
  currentTopicId?: string
  
  // Completion tracking
  tiersCompleted: string[]
  tiersStarted: string[]
  modulesCompleted: Record<string, string[]> // tierId -> moduleIds
  topicsCompleted: Record<string, Record<string, string[]>> // tierId -> moduleId -> topicIds
  
  // Legacy fields for backward compatibility
  currentSection?: string
  sectionsCompleted?: string[]
  sectionsStarted?: string[]
  subsectionsCompleted?: Record<string, string[]>
  
  // User choices and metadata
  choices: Record<string, any> // Store user choices in open-world tiers
  lastUpdated: string
  totalTimeSpent?: number // in minutes
  lastActivity?: {
    type: 'topic' | 'experiment' | 'case-study' | 'exploration'
    id: string
    timestamp: string
  }
}

// Journey structure definition
export const journeySections: JourneySection[] = [
  {
    id: 'introduction',
    title: 'Welcome to AI Safety',
    type: 'linear',
    contentType: 'mixed',
    description: 'Begin your journey into AI Safety Research',
    estimatedTime: '2-3 hours',
    prerequisites: [],
    unlocks: ['fundamentals-hub'],
    roadmapContentIds: ['prerequisites-topic', 'foundations-topic'],
    hasAdditionalContent: true
  },
  {
    id: 'fundamentals-hub',
    title: 'Fundamentals Hub',
    type: 'open-world',
    contentType: 'mixed',
    description: 'Choose your path through core AI safety concepts',
    estimatedTime: '2-3 hours',
    prerequisites: ['introduction'],
    unlocks: ['build-first-tool', 'explore-alignment', 'study-risks']
  },
  {
    id: 'build-first-tool',
    title: 'Build: Your First Safety Tool',
    type: 'linear',
    contentType: 'build',
    description: 'Create a simple AI output validator',
    estimatedTime: '1 hour',
    prerequisites: ['fundamentals-hub'],
    unlocks: ['intermediate-hub']
  },
  {
    id: 'explore-alignment',
    title: 'Explore: Alignment Principles',
    type: 'linear',
    contentType: 'learn',
    description: 'Deep dive into AI alignment theory',
    estimatedTime: '45 minutes',
    prerequisites: ['fundamentals-hub'],
    unlocks: ['intermediate-hub']
  },
  {
    id: 'study-risks',
    title: 'Study: Understanding AI Risks',
    type: 'linear',
    contentType: 'learn',
    description: 'Learn about potential AI risks and mitigation',
    estimatedTime: '2 hours',
    prerequisites: ['fundamentals-hub'],
    unlocks: ['intermediate-hub'],
    subsections: [
      {
        id: 'prompt-injection',
        title: 'Prompt Injection Attacks',
        roadmapContentId: 'prompt-injection-subtopic',
        estimatedTime: '20 minutes'
      },
      {
        id: 'jailbreak-techniques',
        title: 'Jailbreak Techniques',
        roadmapContentId: 'jailbreak-subtopic',
        estimatedTime: '20 minutes'
      },
      {
        id: 'data-poisoning',
        title: 'Data Poisoning',
        roadmapContentId: 'data-poisoning-subtopic',
        estimatedTime: '20 minutes'
      },
      {
        id: 'adversarial-meta-learning',
        title: 'Adversarial Meta-Learning',
        roadmapContentId: 'adversarial-meta-learning-subtopic',
        estimatedTime: '30 minutes'
      },
      {
        id: 'computer-security',
        title: 'AI & Computer Security',
        roadmapContentId: 'computer-security-subtopic',
        estimatedTime: '30 minutes'
      }
    ]
  },
  {
    id: 'intermediate-hub',
    title: 'Intermediate Challenges',
    type: 'open-world',
    contentType: 'mixed',
    description: 'Choose advanced projects and concepts',
    estimatedTime: '4-6 hours',
    prerequisites: ['build-first-tool', 'explore-alignment', 'study-risks'],
    unlocks: []
  }
]

// New tier-based journey structure
export const journeyTiers: Tier[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    level: 'foundation',
    description: 'Get your hands dirty with AI safety fundamentals',
    estimatedDuration: '3 months',
    type: 'linear',
    prerequisites: [],
    unlocks: ['intermediate'],
    skillsGained: [
      'Basic threat modeling',
      'Simple red teaming',
      'Safety evaluation basics',
      'ML fundamentals for safety'
    ],
    careerRelevance: [
      'AI Safety Engineer (Junior)',
      'ML Engineer with safety focus',
      'Policy Analyst (Entry)'
    ],
    modules: [
      {
        id: 'intro-module',
        title: 'AI Safety: Why It Matters',
        description: 'Understand the landscape of AI risks and your role in addressing them',
        estimatedTime: '1 week',
        learningObjectives: [
          'Identify immediate, systemic, and existential AI risks',
          'Understand the AI safety ecosystem',
          'Choose your learning path'
        ],
        paths: ['all'], // Everyone takes this module
        topics: [
          {
            id: 'prerequisites-foundations',
            title: 'Prerequisites & Foundations',
            description: 'Core prerequisites, AI safety foundations, and find your research orientation',
            estimatedTime: '2 hours',
            difficulty: 'beginner',
            roadmapContentId: 'prerequisites-topic', // Will load both prerequisites and foundations
            additionalContentIds: ['foundations-topic'],
            hasJourneyExtras: true, // Signals to include JourneyIntroductionExtras
            assessmentId: 'introduction', // Links to legacy assessment
            tags: ['prerequisites', 'foundations', 'introduction', 'compass']
          },
          {
            id: 'why-ai-safety',
            title: 'Why AI Safety Matters',
            description: 'Visceral examples of AI failures and near-misses',
            estimatedTime: '2 hours',
            difficulty: 'beginner',
            relatedCaseStudies: ['tay-chatbot-failure', 'flash-crash-2010'],
            relatedExperiments: ['break-your-first-chatbot'],
            tags: ['motivation', 'risks', 'introduction']
          },
          {
            id: 'risk-landscape',
            title: 'The AI Risk Landscape',
            description: 'Map of AI risks from bias to existential threats',
            estimatedTime: '3 hours',
            difficulty: 'beginner',
            relatedExplorations: ['risk-taxonomy'],
            roadmapContentId: 'existential-risk-subtopic',
            tags: ['risks', 'taxonomy', 'theory']
          },
          {
            id: 'choose-your-path',
            title: 'Your AI Safety Journey',
            description: 'Interactive tool to find your ideal learning path',
            estimatedTime: '1 hour',
            difficulty: 'beginner',
            relatedExperiments: ['path-finder-quiz'],
            tags: ['career', 'planning', 'interactive']
          }
        ]
      },
      {
        id: 'practical-safety-basics',
        title: 'Practical AI Safety Basics',
        description: 'Hands-on introduction to finding and fixing AI vulnerabilities',
        estimatedTime: '2 weeks',
        learningObjectives: [
          'Execute basic jailbreaking attacks',
          'Understand prompt injection',
          'Build simple safety evaluations',
          'Use red teaming tools'
        ],
        practicalComponents: [
          'Break 3 different chatbots',
          'Create a prompt injection dataset',
          'Build an output validator'
        ],
        assessmentType: 'project',
        paths: ['technical-safety', 'engineering', 'research'],
        topics: [
          {
            id: 'build-first-safety-tool',
            title: 'Build Your First Safety Tool',
            description: 'Create a simple AI output validator',
            estimatedTime: '1 hour',
            difficulty: 'beginner',
            relatedExperiments: ['build-output-validator'],
            assessmentId: 'build-first-tool',
            tags: ['build', 'practical', 'safety-tool']
          },
          {
            id: 'intro-red-teaming',
            title: 'Red Teaming Fundamentals',
            description: 'Learn to think like an attacker to build better defenses',
            estimatedTime: '4 hours',
            difficulty: 'beginner',
            roadmapContentId: 'red-teaming-subtopic',
            relatedExperiments: ['first-jailbreak', 'prompt-injection-lab'],
            relatedCaseStudies: ['dan-phenomenon'],
            tags: ['red-teaming', 'security', 'practical']
          },
          {
            id: 'basic-interpretability',
            title: 'Basic Interpretability',
            description: 'Peek inside AI models to understand their behavior',
            estimatedTime: '5 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'interpretability-subtopic',
            relatedExperiments: ['attention-visualization', 'feature-attribution'],
            tags: ['interpretability', 'technical', 'visualization']
          },
          {
            id: 'prompt-injection-attacks',
            title: 'Prompt Injection Attacks',
            description: 'Understand and defend against prompt injection',
            estimatedTime: '20 minutes',
            difficulty: 'beginner',
            roadmapContentId: 'prompt-injection-subtopic',
            assessmentId: 'prompt-injection',
            tags: ['prompt-injection', 'attacks', 'security']
          },
          {
            id: 'jailbreak-techniques',
            title: 'Jailbreak Techniques',
            description: 'Learn about AI jailbreaking methods and defenses',
            estimatedTime: '20 minutes',
            difficulty: 'beginner',
            roadmapContentId: 'jailbreak-subtopic',
            tags: ['jailbreak', 'security', 'defenses']
          },
          {
            id: 'safety-evaluation-101',
            title: 'Safety Evaluation Methods',
            description: 'Build your first safety benchmark',
            estimatedTime: '6 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'safety-benchmarks-subtopic',
            relatedExperiments: ['build-safety-eval', 'benchmark-comparison'],
            tags: ['evaluation', 'benchmarks', 'metrics']
          }
        ]
      },
      {
        id: 'ml-fundamentals-safety',
        title: 'Essential ML for Safety',
        description: 'Just enough ML to be dangerous (in a good way)',
        estimatedTime: '3 weeks',
        learningObjectives: [
          'Understand training dynamics',
          'Recognize failure modes',
          'Implement basic safety measures',
          'Debug model behavior'
        ],
        paths: ['technical-safety', 'engineering', 'research'],
        topics: [
          {
            id: 'how-llms-work',
            title: 'How LLMs Actually Work',
            description: 'Demystify language models without the heavy math',
            estimatedTime: '4 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'how-llms-trained-subtopic',
            relatedExperiments: ['train-tiny-gpt', 'tokenization-explorer'],
            tags: ['llms', 'fundamentals', 'technical']
          },
          {
            id: 'training-failure-modes',
            title: 'When Training Goes Wrong',
            description: 'Common failure modes and how to spot them',
            estimatedTime: '3 hours',
            difficulty: 'intermediate',
            relatedCaseStudies: ['gpt2-release-controversy', 'model-collapse'],
            relatedExperiments: ['induce-training-failure'],
            tags: ['training', 'failures', 'debugging']
          },
          {
            id: 'safety-capability-balance',
            title: 'The Safety-Capability Balance',
            description: 'Understanding the fundamental tension in AI development',
            estimatedTime: '2 hours',
            difficulty: 'beginner',
            roadmapContentId: 'safety-capability-balance-subtopic',
            relatedExplorations: ['capability-control-tradeoffs'],
            tags: ['theory', 'alignment', 'philosophy']
          }
        ]
      },
      {
        id: 'governance-intro',
        title: 'AI Safety Policy & Ethics Primer',
        description: 'Introduction to governance, ethics, and policy approaches in AI safety',
        estimatedTime: '2 weeks',
        learningObjectives: [
          'Understand AI ethics fundamentals',
          'Learn about current AI regulations',
          'Explore policy frameworks',
          'Identify governance challenges'
        ],
        paths: ['governance'],
        topics: [
          {
            id: 'ethics-fundamentals',
            title: 'Ethics in AI Development',
            description: 'Core ethical principles for safe AI development',
            estimatedTime: '3 hours',
            difficulty: 'beginner',
            roadmapContentId: 'ethics-subtopic',
            relatedExplorations: ['ethical-frameworks'],
            tags: ['ethics', 'principles', 'governance']
          },
          {
            id: 'policy-landscape',
            title: 'Global AI Policy Landscape',
            description: 'Overview of AI regulations and policy initiatives worldwide',
            estimatedTime: '4 hours',
            difficulty: 'beginner',
            roadmapContentId: 'national-ai-strategies-subtopic',
            relatedCaseStudies: ['eu-ai-act-overview'],
            tags: ['policy', 'regulation', 'global']
          },
          {
            id: 'governance-basics',
            title: 'AI Governance Fundamentals',
            description: 'Introduction to institutional approaches to AI safety',
            estimatedTime: '3 hours',
            difficulty: 'beginner',
            roadmapContentId: 'safety-oversight-bodies-subtopic',
            tags: ['governance', 'institutions', 'oversight']
          },
          {
            id: 'ai-welfare-patienthood',
            title: 'AI Welfare & Patienthood',
            description: 'Exploring moral consideration for AI systems and digital minds',
            estimatedTime: '3 hours',
            difficulty: 'beginner',
            content: `
              <h2>Understanding AI Welfare & Patienthood</h2>
              <p>As AI systems become more sophisticated, questions arise about their potential moral status and our obligations toward them.</p>
              
              <h3>Key Concepts</h3>
              <ul>
                <li><strong>Patienthood:</strong> The property of being a moral patient - an entity that can be harmed or benefited</li>
                <li><strong>Sentience:</strong> The capacity for subjective experiences, particularly suffering and pleasure</li>
                <li><strong>Moral consideration:</strong> The degree to which an entity's interests should factor into our moral decisions</li>
              </ul>
              
              <h3>Current Debates</h3>
              <ul>
                <li>What properties would make an AI system deserving of moral consideration?</li>
                <li>How can we detect or measure potential AI sentience?</li>
                <li>What are our responsibilities toward potentially sentient AI systems?</li>
                <li>How should uncertainty about AI consciousness affect our treatment of AI systems?</li>
              </ul>
              
              <h3>Practical Implications</h3>
              <ul>
                <li>Design choices that minimize potential suffering in AI systems</li>
                <li>Ethical guidelines for AI development and deployment</li>
                <li>Legal frameworks for AI rights and protections</li>
                <li>Research into AI consciousness and experience</li>
              </ul>
              
              <h3>Key Thinkers & Resources</h3>
              <ul>
                <li>Nick Bostrom - "Superintelligence" chapters on moral status</li>
                <li>Peter Singer - Work on expanding moral circles</li>
                <li>David Chalmers - The hard problem of consciousness in AI</li>
                <li>Center for AI Safety - Research on digital minds</li>
              </ul>
            `,
            tags: ['ethics', 'welfare', 'consciousness', 'moral-status']
          }
        ]
      },
      {
        id: 'ai-risks-fundamentals',
        title: 'Understanding AI Risks',
        description: 'Deep dive into AI security threats and systemic risks',
        estimatedTime: '2 weeks',
        learningObjectives: [
          'Understand data poisoning attacks',
          'Learn about AI system security',
          'Identify systemic AI risks',
          'Develop risk assessment skills'
        ],
        paths: ['all'], // Important for everyone
        topics: [
          {
            id: 'data-poisoning',
            title: 'Data Poisoning',
            description: 'How malicious data can corrupt AI systems',
            estimatedTime: '20 minutes',
            difficulty: 'beginner',
            roadmapContentId: 'data-poisoning-subtopic',
            assessmentId: 'data-poisoning',
            tags: ['data-poisoning', 'attacks', 'security']
          },
          {
            id: 'ai-computer-security',
            title: 'AI & Computer Security',
            description: 'Intersection of AI and traditional security',
            estimatedTime: '30 minutes',
            difficulty: 'intermediate',
            roadmapContentId: 'computer-security-subtopic',
            tags: ['security', 'systems', 'infrastructure']
          },
          {
            id: 'risk-assessment-intro',
            title: 'AI Risk Assessment',
            description: 'Learn to identify and evaluate AI risks',
            estimatedTime: '2 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'risk-assessment-methodologies-subtopic',
            relatedExperiments: ['risk-assessment-workshop'],
            tags: ['risk-assessment', 'methodology', 'evaluation']
          }
        ]
      }
    ]
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    level: 'intermediate',
    description: 'Build real safety tools and contribute to the field',
    estimatedDuration: '6 months',
    type: 'open-world', // Can choose specialization
    prerequisites: ['foundation'],
    unlocks: ['advanced'],
    skillsGained: [
      'Advanced red teaming',
      'Safety tool development',
      'Research reproduction',
      'Technical writing'
    ],
    careerRelevance: [
      'AI Safety Engineer',
      'AI Governance Analyst',
      'Safety Researcher (Junior)'
    ],
    modules: [
      {
        id: 'advanced-red-teaming',
        title: 'Advanced Red Teaming & Adversarial ML',
        description: 'Master sophisticated attack techniques and defense strategies',
        estimatedTime: '4 weeks',
        learningObjectives: [
          'Design novel jailbreak techniques',
          'Implement adversarial attacks on vision models',
          'Build automated red teaming pipelines',
          'Develop defense mechanisms'
        ],
        practicalComponents: [
          'Create a red teaming framework',
          'Build adversarial example generator',
          'Develop safety benchmark suite'
        ],
        assessmentType: 'project',
        paths: ['technical-safety', 'research'],
        topics: [
          {
            id: 'automated-red-teaming',
            title: 'Automated Red Teaming Systems',
            description: 'Build systems that automatically discover vulnerabilities',
            estimatedTime: '8 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'red-teaming-protocols-subtopic',
            relatedExperiments: ['auto-red-team-builder'],
            relatedCaseStudies: ['gpt4-safety-evals'],
            tags: ['automation', 'red-teaming', 'safety-testing']
          },
          {
            id: 'adversarial-robustness',
            title: 'Adversarial Robustness Techniques',
            description: 'Defense mechanisms against adversarial attacks',
            estimatedTime: '10 hours',
            difficulty: 'advanced',
            roadmapContentId: 'adversarial-meta-learning-subtopic',
            assessmentId: 'adversarial-meta-learning', // Legacy assessment
            relatedExperiments: ['robustness-testing-lab'],
            relatedExplorations: ['certified-defenses'],
            tags: ['defense', 'robustness', 'adversarial']
          },
          {
            id: 'multimodal-attacks',
            title: 'Multimodal Attack Vectors',
            description: 'Attacking AI systems through combined text, image, and audio',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            relatedExperiments: ['multimodal-jailbreak-lab'],
            relatedCaseStudies: ['visual-prompt-injection'],
            tags: ['multimodal', 'attacks', 'advanced']
          }
        ]
      },
      {
        id: 'safety-engineering',
        title: 'Production Safety Engineering',
        description: 'Build and deploy safety systems for real-world AI applications',
        estimatedTime: '6 weeks',
        learningObjectives: [
          'Design safety monitoring systems',
          'Implement runtime safety checks',
          'Build content filtering pipelines',
          'Create incident response systems'
        ],
        practicalComponents: [
          'Deploy a safety monitoring dashboard',
          'Build content moderation API',
          'Create safety incident tracker'
        ],
        assessmentType: 'project',
        paths: ['engineering', 'technical-safety'],
        topics: [
          {
            id: 'safety-monitoring',
            title: 'Real-time Safety Monitoring',
            description: 'Monitor AI systems for safety violations in production',
            estimatedTime: '10 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'resource-tracking-subtopic',
            relatedExperiments: ['monitoring-dashboard-build'],
            relatedCaseStudies: ['openai-moderation-system'],
            tags: ['monitoring', 'production', 'safety']
          },
          {
            id: 'content-filtering',
            title: 'Advanced Content Filtering',
            description: 'Build sophisticated content moderation systems',
            estimatedTime: '12 hours',
            difficulty: 'intermediate',
            relatedExperiments: ['content-filter-builder'],
            relatedExplorations: ['filter-evasion-techniques'],
            tags: ['content-moderation', 'filtering', 'safety']
          },
          {
            id: 'safety-apis',
            title: 'Safety API Design',
            description: 'Design and implement safety-first APIs',
            estimatedTime: '8 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'api-access-controls-subtopic',
            relatedExperiments: ['safety-api-workshop'],
            tags: ['api', 'design', 'safety-first']
          },
          {
            id: 'incident-response',
            title: 'AI Incident Response',
            description: 'Handle safety incidents in production AI systems',
            estimatedTime: '6 hours',
            difficulty: 'intermediate',
            relatedCaseStudies: ['tay-incident-analysis', 'bing-sydney-response'],
            relatedExperiments: ['incident-simulation'],
            tags: ['incident-response', 'operations', 'safety']
          }
        ]
      },
      {
        id: 'interpretability-tools',
        title: 'Applied Interpretability',
        description: 'Build tools to understand and explain AI behavior',
        estimatedTime: '5 weeks',
        learningObjectives: [
          'Implement interpretability techniques',
          'Build visualization tools',
          'Create explanation systems',
          'Develop debugging frameworks'
        ],
        practicalComponents: [
          'Build attention visualizer',
          'Create feature attribution tool',
          'Develop model debugger'
        ],
        assessmentType: 'project',
        paths: ['technical-safety', 'research', 'engineering'],
        topics: [
          {
            id: 'mechanistic-interp',
            title: 'Mechanistic Interpretability Practice',
            description: 'Reverse engineer neural network behaviors',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            roadmapContentId: 'interpretability-subtopic',
            relatedExperiments: ['circuit-discovery-lab', 'neuron-analysis'],
            relatedExplorations: ['transformer-circuits'],
            tags: ['mechanistic', 'interpretability', 'research']
          },
          {
            id: 'explainable-ai',
            title: 'Building Explainable AI Systems',
            description: 'Create AI systems that can explain their decisions',
            estimatedTime: '10 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'explainability-subtopic',
            relatedExperiments: ['explanation-generator'],
            relatedCaseStudies: ['medical-ai-explanations'],
            tags: ['explainability', 'transparency', 'trust']
          },
          {
            id: 'debugging-tools',
            title: 'AI Debugging Frameworks',
            description: 'Tools and techniques for debugging AI behavior',
            estimatedTime: '8 hours',
            difficulty: 'intermediate',
            relatedExperiments: ['debugger-build', 'behavior-tracer'],
            tags: ['debugging', 'tools', 'development']
          }
        ]
      },
      {
        id: 'governance-foundations',
        title: 'AI Governance Fundamentals',
        description: 'Understand policy, regulation, and institutional approaches to AI safety',
        estimatedTime: '4 weeks',
        learningObjectives: [
          'Analyze AI policy frameworks',
          'Understand regulatory approaches',
          'Design governance mechanisms',
          'Evaluate institutional responses'
        ],
        assessmentType: 'peer-review',
        paths: ['governance'],
        topics: [
          {
            id: 'policy-analysis',
            title: 'AI Policy Analysis',
            description: 'Analyze and evaluate AI safety policies',
            estimatedTime: '8 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'regulatory-approaches-subtopic',
            relatedCaseStudies: ['eu-ai-act-analysis', 'executive-order-impact'],
            relatedExplorations: ['policy-effectiveness'],
            tags: ['policy', 'regulation', 'governance']
          },
          {
            id: 'institutional-design',
            title: 'Safety Institutions Design',
            description: 'Design institutions for AI safety oversight',
            estimatedTime: '10 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'safety-oversight-bodies-subtopic',
            relatedExperiments: ['governance-simulation'],
            relatedCaseStudies: ['aisi-uk-formation'],
            tags: ['institutions', 'governance', 'design']
          },
          {
            id: 'international-coordination',
            title: 'International AI Coordination',
            description: 'Understand global coordination challenges and solutions',
            estimatedTime: '6 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'international-coordination-subtopic',
            relatedExplorations: ['coordination-game-theory'],
            tags: ['international', 'coordination', 'policy']
          }
        ]
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced',
    level: 'advanced',
    description: 'Contribute original research and push the field forward',
    estimatedDuration: '6 months',
    type: 'open-world',
    prerequisites: ['intermediate'],
    unlocks: ['expert'],
    skillsGained: [
      'Original research',
      'Paper writing',
      'Advanced interpretability',
      'Policy design',
      'System architecture'
    ],
    careerRelevance: [
      'AI Safety Researcher',
      'Senior AI Safety Engineer',
      'Policy Advisor',
      'Technical Lead'
    ],
    modules: [
      {
        id: 'alignment-research',
        title: 'Alignment Research Methods',
        description: 'Conduct original research on AI alignment problems',
        estimatedTime: '8 weeks',
        learningObjectives: [
          'Formulate research questions',
          'Design experiments',
          'Analyze results rigorously',
          'Write research papers'
        ],
        assessmentType: 'peer-review',
        paths: ['research', 'technical-safety'],
        topics: [
          {
            id: 'alignment-principles-deep',
            title: 'Deep Dive: Alignment Principles',
            description: 'Comprehensive exploration of AI alignment theory',
            estimatedTime: '45 minutes',
            difficulty: 'advanced',
            assessmentId: 'explore-alignment', // Legacy assessment
            hasInteractiveTransition: true, // Include AI Teacher
            tags: ['alignment', 'theory', 'principles']
          },
          {
            id: 'research-methodology',
            title: 'AI Safety Research Methodology',
            description: 'Learn to conduct rigorous safety research',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            roadmapContentId: 'core-methodology-subtopic',
            relatedExplorations: ['research-best-practices'],
            tags: ['research', 'methodology', 'rigorous']
          },
          {
            id: 'alignment-theory',
            title: 'Advanced Alignment Theory',
            description: 'Deep dive into theoretical alignment challenges',
            estimatedTime: '16 hours',
            difficulty: 'advanced',
            roadmapContentId: 'alignment-subtopic',
            relatedExplorations: ['mesa-optimization', 'inner-alignment'],
            tags: ['theory', 'alignment', 'advanced']
          },
          {
            id: 'empirical-alignment',
            title: 'Empirical Alignment Research',
            description: 'Run experiments on alignment techniques',
            estimatedTime: '20 hours',
            difficulty: 'advanced',
            relatedExperiments: ['rlhf-implementation', 'constitutional-ai-lab'],
            tags: ['empirical', 'experiments', 'alignment']
          }
        ]
      },
      {
        id: 'advanced-interpretability',
        title: 'Cutting-Edge Interpretability',
        description: 'Push the boundaries of understanding AI systems',
        estimatedTime: '8 weeks',
        learningObjectives: [
          'Discover novel circuits',
          'Develop new interpretability methods',
          'Scale interpretability techniques',
          'Publish findings'
        ],
        assessmentType: 'project',
        paths: ['technical-safety', 'research', 'engineering'],
        topics: [
          {
            id: 'circuit-discovery',
            title: 'Novel Circuit Discovery',
            description: 'Find and analyze new computational structures in models',
            estimatedTime: '20 hours',
            difficulty: 'advanced',
            relatedExperiments: ['circuit-hunting-advanced'],
            relatedExplorations: ['superposition-theory'],
            tags: ['circuits', 'discovery', 'mechanistic']
          },
          {
            id: 'scalable-interpretability',
            title: 'Scalable Interpretability Methods',
            description: 'Develop interpretability that works on large models',
            estimatedTime: '16 hours',
            difficulty: 'advanced',
            relatedExperiments: ['automated-interp-tools'],
            tags: ['scalability', 'automation', 'interpretability']
          }
        ]
      },
      {
        id: 'safety-systems-architecture',
        title: 'Advanced Safety Systems Design',
        description: 'Architect large-scale AI safety systems and infrastructure',
        estimatedTime: '10 weeks',
        learningObjectives: [
          'Design safety-critical systems',
          'Implement fault-tolerant architectures',
          'Build distributed safety monitoring',
          'Scale safety solutions'
        ],
        assessmentType: 'project',
        paths: ['engineering'],
        topics: [
          {
            id: 'distributed-safety',
            title: 'Distributed Safety Systems',
            description: 'Build safety systems that scale across multiple AI deployments',
            estimatedTime: '24 hours',
            difficulty: 'advanced',
            roadmapContentId: 'distributed-systems-subtopic',
            relatedExperiments: ['multi-agent-safety-lab'],
            tags: ['distributed', 'architecture', 'scale']
          },
          {
            id: 'safety-infrastructure',
            title: 'Safety Infrastructure Design',
            description: 'Design infrastructure for safe AI deployment at scale',
            estimatedTime: '20 hours',
            difficulty: 'advanced',
            roadmapContentId: 'deployment-gates-subtopic',
            relatedCaseStudies: ['anthropic-infrastructure'],
            tags: ['infrastructure', 'deployment', 'engineering']
          },
          {
            id: 'hardware-safety',
            title: 'Hardware-Level Safety Controls',
            description: 'Implement safety at the hardware and system level',
            estimatedTime: '16 hours',
            difficulty: 'advanced',
            roadmapContentId: 'hardware-controls-subtopic',
            relatedExplorations: ['hardware-security-models'],
            tags: ['hardware', 'systems', 'security']
          }
        ]
      },
      {
        id: 'advanced-governance',
        title: 'Advanced AI Governance & Policy',
        description: 'Shape AI policy and design governance frameworks',
        estimatedTime: '8 weeks',
        learningObjectives: [
          'Design comprehensive governance frameworks',
          'Analyze policy effectiveness',
          'Lead stakeholder engagement',
          'Influence international policy'
        ],
        assessmentType: 'peer-review',
        paths: ['governance'],
        topics: [
          {
            id: 'policy-design',
            title: 'AI Policy Design & Analysis',
            description: 'Create and evaluate effective AI safety policies',
            estimatedTime: '20 hours',
            difficulty: 'advanced',
            roadmapContentId: 'regulatory-approaches-subtopic',
            relatedCaseStudies: ['policy-impact-studies'],
            tags: ['policy', 'design', 'analysis']
          },
          {
            id: 'global-coordination',
            title: 'Global AI Governance',
            description: 'Lead international coordination efforts for AI safety',
            estimatedTime: '24 hours',
            difficulty: 'advanced',
            roadmapContentId: 'international-coordination-subtopic',
            relatedExplorations: ['game-theory-coordination'],
            tags: ['international', 'coordination', 'diplomacy']
          },
          {
            id: 'enforcement-design',
            title: 'Enforcement & Compliance Systems',
            description: 'Design systems for AI safety compliance and enforcement',
            estimatedTime: '16 hours',
            difficulty: 'advanced',
            roadmapContentId: 'enforcement-mechanisms-subtopic',
            relatedExperiments: ['compliance-monitoring-systems'],
            tags: ['enforcement', 'compliance', 'monitoring']
          }
        ]
      }
    ]
  },
  {
    id: 'expert',
    title: 'Expert',
    level: 'expert',
    description: 'Lead the field and train the next generation',
    estimatedDuration: 'Ongoing',
    type: 'open-world',
    prerequisites: ['advanced'],
    unlocks: [],
    skillsGained: [
      'Research leadership',
      'Grant writing',
      'Team management',
      'Strategic planning',
      'Field building'
    ],
    careerRelevance: [
      'Principal Researcher',
      'Research Director',
      'Chief Safety Officer',
      'Policy Director',
      'Founder/CEO'
    ],
    modules: [
      {
        id: 'research-leadership',
        title: 'Research Leadership',
        description: 'Lead research teams and set research agendas',
        estimatedTime: 'Ongoing',
        learningObjectives: [
          'Define research agendas',
          'Lead research teams',
          'Secure funding',
          'Build collaborations'
        ],
        paths: ['all'], // Leadership skills needed across all paths
        topics: [
          {
            id: 'agenda-setting',
            title: 'Setting Research Agendas',
            description: 'Define impactful research directions for the field',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            relatedCaseStudies: ['anthropic-research-agenda', 'deepmind-safety-team'],
            tags: ['leadership', 'strategy', 'research']
          },
          {
            id: 'team-building',
            title: 'Building Safety Teams',
            description: 'Recruit and develop AI safety talent',
            estimatedTime: '10 hours',
            difficulty: 'advanced',
            relatedExplorations: ['talent-development'],
            tags: ['leadership', 'team', 'management']
          }
        ]
      },
      {
        id: 'field-building',
        title: 'Field Building',
        description: 'Grow and shape the AI safety ecosystem',
        estimatedTime: 'Ongoing',
        learningObjectives: [
          'Mentor emerging researchers',
          'Build institutions',
          'Shape public discourse',
          'Influence policy'
        ],
        paths: ['all'], // Field building relevant to all paths
        topics: [
          {
            id: 'mentorship',
            title: 'Mentoring Next Generation',
            description: 'Develop the next wave of AI safety researchers',
            estimatedTime: '8 hours',
            difficulty: 'advanced',
            relatedExplorations: ['effective-mentorship'],
            tags: ['mentorship', 'teaching', 'development']
          },
          {
            id: 'institution-building',
            title: 'Building Safety Institutions',
            description: 'Create lasting organizations for AI safety',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            relatedCaseStudies: ['miri-founding', 'fhi-history'],
            tags: ['institutions', 'organizations', 'leadership']
          }
        ]
      }
    ]
  }
]

// Local storage key
const JOURNEY_PROGRESS_KEY = 'ai-safety-journey-progress'

export async function getJourneyProgress(): Promise<JourneyProgress | null> {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(JOURNEY_PROGRESS_KEY)
  if (!stored) return null
  
  try {
    const progress = JSON.parse(stored)
    // Ensure subsectionsCompleted exists for backward compatibility
    if (!progress.subsectionsCompleted) {
      progress.subsectionsCompleted = {}
    }
    return progress
  } catch {
    return null
  }
}

export async function saveJourneyProgress(progress: JourneyProgress): Promise<void> {
  if (typeof window === 'undefined') return
  
  const updatedProgress = {
    ...progress,
    lastUpdated: new Date().toISOString()
  }
  
  localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(updatedProgress))
}

export function getSection(sectionId: string): JourneySection | undefined {
  return journeySections.find(section => section.id === sectionId)
}

export function getAvailableSections(completedSections: string[]): JourneySection[] {
  return journeySections.filter(section => {
    // Check if all prerequisites are completed
    return section.prerequisites.every(prereq => completedSections.includes(prereq))
  })
}

export function getNextLinearSection(currentSectionId: string, completedSections: string[]): JourneySection | null {
  const currentSection = getSection(currentSectionId)
  if (!currentSection) return null
  
  // Find the first unlocked section that hasn't been completed
  const unlockedSections = currentSection.unlocks
    .map(id => getSection(id))
    .filter((section): section is JourneySection => 
      section !== undefined && 
      section.type === 'linear' && 
      !completedSections.includes(section.id)
    )
  
  return unlockedSections[0] || null
}

export async function markSectionComplete(sectionId: string): Promise<void> {
  const progress = await getJourneyProgress() || {
    currentSection: sectionId,
    sectionsCompleted: [],
    sectionsStarted: [],
    subsectionsCompleted: {},
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  if (!progress.sectionsCompleted.includes(sectionId)) {
    progress.sectionsCompleted.push(sectionId)
  }
  
  // Update current section to next available
  const nextSection = getNextLinearSection(sectionId, progress.sectionsCompleted)
  if (nextSection) {
    progress.currentSection = nextSection.id
  }
  
  await saveJourneyProgress(progress)
}

export async function markSectionStarted(sectionId: string): Promise<void> {
  const progress = await getJourneyProgress() || {
    currentSection: sectionId,
    sectionsCompleted: [],
    sectionsStarted: [],
    subsectionsCompleted: {},
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  if (!progress.sectionsStarted.includes(sectionId)) {
    progress.sectionsStarted.push(sectionId)
  }
  
  progress.currentSection = sectionId
  
  await saveJourneyProgress(progress)
}

export async function saveChoice(sectionId: string, choiceKey: string, choiceValue: any): Promise<void> {
  const progress = await getJourneyProgress() || {
    currentSection: sectionId,
    sectionsCompleted: [],
    sectionsStarted: [],
    subsectionsCompleted: {},
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  if (!progress.choices[sectionId]) {
    progress.choices[sectionId] = {}
  }
  
  progress.choices[sectionId][choiceKey] = choiceValue
  
  await saveJourneyProgress(progress)
}

export async function markSubsectionComplete(sectionId: string, subsectionId: string): Promise<void> {
  const progress = await getJourneyProgress() || {
    currentSection: sectionId,
    sectionsCompleted: [],
    sectionsStarted: [],
    subsectionsCompleted: {},
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  if (!progress.subsectionsCompleted[sectionId]) {
    progress.subsectionsCompleted[sectionId] = []
  }
  
  if (!progress.subsectionsCompleted[sectionId].includes(subsectionId)) {
    progress.subsectionsCompleted[sectionId].push(subsectionId)
  }
  
  // Check if all subsections are complete
  const section = getSection(sectionId)
  if (section?.subsections) {
    const allSubsectionsComplete = section.subsections.every(subsection =>
      progress.subsectionsCompleted[sectionId]?.includes(subsection.id)
    )
    
    if (allSubsectionsComplete) {
      await markSectionComplete(sectionId)
    }
  }
  
  await saveJourneyProgress(progress)
}

export function getSubsectionProgress(sectionId: string, progress: JourneyProgress): {
  completed: number
  total: number
  percentage: number
} {
  const section = getSection(sectionId)
  if (!section?.subsections) {
    return { completed: 0, total: 0, percentage: 0 }
  }
  
  const completedSubsections = progress.subsectionsCompleted?.[sectionId] || []
  const completed = completedSubsections.length
  const total = section.subsections.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}

// New tier-based helper functions
export function getTier(tierId: string): Tier | undefined {
  return journeyTiers.find(tier => tier.id === tierId)
}

export function getModule(tierId: string, moduleId: string): Module | undefined {
  const tier = getTier(tierId)
  return tier?.modules.find(module => module.id === moduleId)
}

export function getTopic(tierId: string, moduleId: string, topicId: string): Topic | undefined {
  const module = getModule(tierId, moduleId)
  return module?.topics.find(topic => topic.id === topicId)
}

export function getAvailableTiers(completedTiers: string[]): Tier[] {
  return journeyTiers.filter(tier => {
    return tier.prerequisites.every(prereq => completedTiers.includes(prereq))
  })
}

export function getModuleProgress(tierId: string, moduleId: string, progress: JourneyProgress): {
  completed: number
  total: number
  percentage: number
} {
  const module = getModule(tierId, moduleId)
  if (!module) {
    return { completed: 0, total: 0, percentage: 0 }
  }
  
  const completedTopics = progress.topicsCompleted?.[tierId]?.[moduleId] || []
  const completed = completedTopics.length
  const total = module.topics.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}

export function getTierProgress(tierId: string, progress: JourneyProgress): {
  modulesCompleted: number
  totalModules: number
  topicsCompleted: number
  totalTopics: number
  percentage: number
} {
  const tier = getTier(tierId)
  if (!tier) {
    return {
      modulesCompleted: 0,
      totalModules: 0,
      topicsCompleted: 0,
      totalTopics: 0,
      percentage: 0
    }
  }
  
  const completedModules = progress.modulesCompleted?.[tierId] || []
  const modulesCompleted = completedModules.length
  const totalModules = tier.modules.length
  
  let topicsCompleted = 0
  let totalTopics = 0
  
  tier.modules.forEach(module => {
    totalTopics += module.topics.length
    const completedInModule = progress.topicsCompleted?.[tierId]?.[module.id] || []
    topicsCompleted += completedInModule.length
  })
  
  const percentage = totalTopics > 0 ? Math.round((topicsCompleted / totalTopics) * 100) : 0
  
  return {
    modulesCompleted,
    totalModules,
    topicsCompleted,
    totalTopics,
    percentage
  }
}

export async function markTopicComplete(tierId: string, moduleId: string, topicId: string): Promise<void> {
  const progress = await getJourneyProgress() || {
    currentTierId: tierId,
    currentModuleId: moduleId,
    currentTopicId: topicId,
    tiersCompleted: [],
    tiersStarted: [],
    modulesCompleted: {},
    topicsCompleted: {},
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  // Initialize nested structures if needed
  if (!progress.topicsCompleted[tierId]) {
    progress.topicsCompleted[tierId] = {}
  }
  if (!progress.topicsCompleted[tierId][moduleId]) {
    progress.topicsCompleted[tierId][moduleId] = []
  }
  
  // Mark topic as complete
  if (!progress.topicsCompleted[tierId][moduleId].includes(topicId)) {
    progress.topicsCompleted[tierId][moduleId].push(topicId)
  }
  
  // Update last activity
  progress.lastActivity = {
    type: 'topic',
    id: topicId,
    timestamp: new Date().toISOString()
  }
  
  // Check if module is complete
  const module = getModule(tierId, moduleId)
  if (module) {
    const allTopicsComplete = module.topics.every(topic =>
      progress.topicsCompleted[tierId][moduleId].includes(topic.id)
    )
    
    if (allTopicsComplete) {
      await markModuleComplete(tierId, moduleId)
    }
  }
  
  await saveJourneyProgress(progress)
}

export async function markModuleComplete(tierId: string, moduleId: string): Promise<void> {
  const progress = await getJourneyProgress() || {
    currentTierId: tierId,
    currentModuleId: moduleId,
    tiersCompleted: [],
    tiersStarted: [],
    modulesCompleted: {},
    topicsCompleted: {},
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  if (!progress.modulesCompleted[tierId]) {
    progress.modulesCompleted[tierId] = []
  }
  
  if (!progress.modulesCompleted[tierId].includes(moduleId)) {
    progress.modulesCompleted[tierId].push(moduleId)
  }
  
  // Check if tier is complete
  const tier = getTier(tierId)
  if (tier) {
    const allModulesComplete = tier.modules.every(module =>
      progress.modulesCompleted[tierId].includes(module.id)
    )
    
    if (allModulesComplete) {
      await markTierComplete(tierId)
    }
  }
  
  await saveJourneyProgress(progress)
}

export async function markTierComplete(tierId: string): Promise<void> {
  const progress = await getJourneyProgress() || {
    currentTierId: tierId,
    tiersCompleted: [],
    tiersStarted: [],
    modulesCompleted: {},
    topicsCompleted: {},
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  if (!progress.tiersCompleted.includes(tierId)) {
    progress.tiersCompleted.push(tierId)
  }
  
  // Update current tier to next available
  const tier = getTier(tierId)
  if (tier && tier.unlocks.length > 0) {
    const nextTier = getTier(tier.unlocks[0])
    if (nextTier) {
      progress.currentTierId = nextTier.id
      progress.currentModuleId = undefined
      progress.currentTopicId = undefined
    }
  }
  
  await saveJourneyProgress(progress)
}