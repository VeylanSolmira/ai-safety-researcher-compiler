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
  content?: string // Direct markdown content (academic)
  contentPersonal?: string // Personal version of content
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
          'Develop risk assessment skills',
          'Grasp the control problem and alignment challenges',
          'Understand agency and goal-directed behavior in AI',
          'Recognize situational awareness in AI systems',
          'Appreciate the challenges of AI interpretability'
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
          },
          {
            id: 'control-problem',
            title: 'The Control Problem',
            description: 'Understanding how to maintain control over advanced AI systems',
            estimatedTime: '2 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'control-subtopic',
            tags: ['control', 'alignment', 'safety']
          },
          {
            id: 'agency-in-ai',
            title: 'Agency in AI Systems',
            description: 'Exploring goal-directed behavior and autonomous decision-making in AI',
            estimatedTime: '2 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'agency-subtopic',
            tags: ['agency', 'autonomy', 'goals']
          },
          {
            id: 'situational-awareness',
            title: 'AI Situational Awareness',
            description: 'When AI systems understand their environment and context',
            estimatedTime: '2 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'situational-awareness-subtopic',
            tags: ['awareness', 'understanding', 'context']
          },
          {
            id: 'impenetrability',
            title: 'Impenetrability of Advanced AI',
            description: 'Challenges in understanding and inspecting sophisticated AI systems',
            estimatedTime: '2 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'impenetrability-subtopic',
            tags: ['interpretability', 'opacity', 'understanding']
          }
        ]
      },
      {
        id: 'math-foundations',
        title: 'Mathematical & Technical Foundations',
        description: 'Essential mathematics and programming for AI safety research',
        estimatedTime: '8 weeks',
        learningObjectives: [
          'Master linear algebra for machine learning',
          'Understand calculus and optimization',
          'Apply probability theory to AI problems',
          'Develop Python proficiency with ML libraries'
        ],
        paths: ['all'],
        topics: [
          {
            id: 'linear-algebra-ml',
            title: 'Linear Algebra for Machine Learning',
            description: 'Vectors, matrices, eigenvalues, and transformations',
            estimatedTime: '10 hours',
            difficulty: 'beginner',
            content: `
              <h2>Linear Algebra Foundations for AI Safety</h2>
              <p>Understanding linear algebra is crucial for AI safety research as it forms the mathematical backbone of neural networks and ML algorithms.</p>
              
              <h3>Core Concepts</h3>
              <ul>
                <li><strong>Vectors and Vector Spaces:</strong> Representing data and model parameters</li>
                <li><strong>Matrix Operations:</strong> Transformations, projections, and computations</li>
                <li><strong>Eigenvalues & Eigenvectors:</strong> Understanding model behavior and stability</li>
                <li><strong>Singular Value Decomposition:</strong> Dimensionality reduction and analysis</li>
              </ul>
              
              <h3>Safety Relevance</h3>
              <p>Linear algebra helps us:</p>
              <ul>
                <li>Analyze neural network behavior through weight matrices</li>
                <li>Understand feature spaces and decision boundaries</li>
                <li>Implement interpretability techniques</li>
                <li>Design robust optimization algorithms</li>
              </ul>
              
              <h3>Practical Exercises</h3>
              <ul>
                <li>Implement matrix operations from scratch</li>
                <li>Visualize neural network weight matrices</li>
                <li>Analyze principal components of model activations</li>
                <li>Build intuition for high-dimensional spaces</li>
              </ul>
            `,
            tags: ['mathematics', 'linear-algebra', 'foundations']
          },
          {
            id: 'calculus-optimization',
            title: 'Calculus & Optimization Theory',
            description: 'Derivatives, gradients, and optimization algorithms',
            estimatedTime: '10 hours',
            difficulty: 'beginner',
            content: `
              <h2>Calculus and Optimization for AI Safety</h2>
              <p>Calculus provides the tools to understand how AI systems learn and can be optimized safely.</p>
              
              <h3>Essential Topics</h3>
              <ul>
                <li><strong>Derivatives & Gradients:</strong> How models learn from data</li>
                <li><strong>Chain Rule:</strong> Backpropagation and credit assignment</li>
                <li><strong>Optimization Landscapes:</strong> Local vs global optima</li>
                <li><strong>Convex vs Non-convex:</strong> Optimization challenges in deep learning</li>
              </ul>
              
              <h3>Safety Applications</h3>
              <ul>
                <li>Understanding gradient hacking risks</li>
                <li>Analyzing optimization trajectories</li>
                <li>Designing stable training procedures</li>
                <li>Detecting optimization anomalies</li>
              </ul>
              
              <h3>Key Algorithms</h3>
              <ul>
                <li>Gradient Descent and variants (SGD, Adam)</li>
                <li>Newton's Method and second-order optimization</li>
                <li>Constrained optimization for safety constraints</li>
                <li>Multi-objective optimization for value alignment</li>
              </ul>
            `,
            tags: ['mathematics', 'calculus', 'optimization']
          },
          {
            id: 'probability-statistics',
            title: 'Probability Theory & Statistics',
            description: 'Distributions, inference, and Bayesian thinking for AI safety',
            estimatedTime: '10 hours',
            difficulty: 'beginner',
            content: `
              <h2>Probability and Statistics for AI Safety</h2>
              <p>Probabilistic thinking is essential for reasoning about uncertainty in AI systems.</p>
              
              <h3>Fundamental Concepts</h3>
              <ul>
                <li><strong>Probability Distributions:</strong> Modeling uncertainty and randomness</li>
                <li><strong>Bayes' Theorem:</strong> Updating beliefs with evidence</li>
                <li><strong>Statistical Inference:</strong> Drawing conclusions from data</li>
                <li><strong>Hypothesis Testing:</strong> Validating safety claims</li>
              </ul>
              
              <h3>AI Safety Applications</h3>
              <ul>
                <li>Uncertainty quantification in model predictions</li>
                <li>Bayesian approaches to value learning</li>
                <li>Statistical guarantees for safety properties</li>
                <li>Risk assessment and probabilistic safety</li>
              </ul>
              
              <h3>Advanced Topics</h3>
              <ul>
                <li>Information theory and entropy</li>
                <li>Causal inference for understanding AI behavior</li>
                <li>Monte Carlo methods for safety verification</li>
                <li>Probabilistic programming for safety analysis</li>
              </ul>
            `,
            tags: ['mathematics', 'probability', 'statistics']
          },
          {
            id: 'python-ml-libraries',
            title: 'Python & ML Libraries for Safety Research',
            description: 'NumPy, PyTorch, and essential programming skills',
            estimatedTime: '8 hours',
            difficulty: 'beginner',
            content: `
              <h2>Python Programming for AI Safety</h2>
              <p>Practical programming skills to implement and test AI safety concepts.</p>
              
              <h3>Core Python Skills</h3>
              <ul>
                <li><strong>Python Fundamentals:</strong> Data structures, functions, classes</li>
                <li><strong>NumPy:</strong> Efficient numerical computation</li>
                <li><strong>PyTorch/TensorFlow:</strong> Building and analyzing neural networks</li>
                <li><strong>Visualization:</strong> Matplotlib, Seaborn for safety analysis</li>
              </ul>
              
              <h3>Safety-Specific Libraries</h3>
              <ul>
                <li>Interpretability tools (Captum, LIME, SHAP)</li>
                <li>Adversarial robustness libraries</li>
                <li>Safety evaluation frameworks</li>
                <li>Experiment tracking and reproducibility</li>
              </ul>
              
              <h3>Best Practices</h3>
              <ul>
                <li>Writing clean, documented code</li>
                <li>Version control with Git</li>
                <li>Testing and validation</li>
                <li>Reproducible research practices</li>
              </ul>
            `,
            relatedExperiments: ['implement-basic-nn', 'safety-tools-intro'],
            tags: ['programming', 'python', 'tools']
          }
        ]
      },
      {
        id: 'ml-fundamentals-primer',
        title: 'Machine Learning Fundamentals',
        description: 'Core ML concepts with safety considerations',
        estimatedTime: '6 weeks',
        learningObjectives: [
          'Understand supervised and unsupervised learning',
          'Implement basic ML algorithms',
          'Recognize ML failure modes',
          'Build simple neural networks'
        ],
        paths: ['all'],
        topics: [
          {
            id: 'ml-paradigms',
            title: 'ML Learning Paradigms',
            description: 'Supervised, unsupervised, and reinforcement learning basics',
            estimatedTime: '6 hours',
            difficulty: 'beginner',
            content: `
              <h2>Machine Learning Paradigms</h2>
              <p>Understanding different learning paradigms is crucial for identifying safety risks.</p>
              
              <h3>Supervised Learning</h3>
              <ul>
                <li>Learning from labeled examples</li>
                <li>Classification vs regression</li>
                <li>Training, validation, and test sets</li>
                <li>Safety risks: Distribution shift, adversarial examples</li>
              </ul>
              
              <h3>Unsupervised Learning</h3>
              <ul>
                <li>Finding patterns without labels</li>
                <li>Clustering and dimensionality reduction</li>
                <li>Autoencoders and representation learning</li>
                <li>Safety risks: Hidden biases, unexpected clusters</li>
              </ul>
              
              <h3>Reinforcement Learning</h3>
              <ul>
                <li>Learning through interaction</li>
                <li>Reward functions and policies</li>
                <li>Exploration vs exploitation</li>
                <li>Safety risks: Reward hacking, unsafe exploration</li>
              </ul>
            `,
            tags: ['ml-basics', 'paradigms', 'fundamentals']
          },
          {
            id: 'classic-ml-algorithms',
            title: 'Classical ML Algorithms',
            description: 'Linear regression, decision trees, SVMs with safety lens',
            estimatedTime: '10 hours',
            difficulty: 'beginner',
            content: `
              <h2>Classical ML Algorithms for Safety</h2>
              <p>Traditional ML algorithms provide intuition for understanding deep learning safety.</p>
              
              <h3>Linear Models</h3>
              <ul>
                <li>Linear & logistic regression</li>
                <li>Interpretability advantages</li>
                <li>Limitations and failure modes</li>
                <li>Safety applications: Baseline models, interpretable classifiers</li>
              </ul>
              
              <h3>Tree-Based Methods</h3>
              <ul>
                <li>Decision trees and random forests</li>
                <li>Feature importance and explainability</li>
                <li>Overfitting and generalization</li>
                <li>Safety applications: Rule extraction, decision analysis</li>
              </ul>
              
              <h3>Support Vector Machines</h3>
              <ul>
                <li>Maximum margin classification</li>
                <li>Kernel methods and feature spaces</li>
                <li>Robustness properties</li>
                <li>Safety applications: Certified defenses, boundary analysis</li>
              </ul>
            `,
            relatedExperiments: ['implement-classifiers', 'compare-algorithms'],
            tags: ['algorithms', 'classical-ml', 'interpretability']
          },
          {
            id: 'neural-networks-intro',
            title: 'Introduction to Neural Networks',
            description: 'Perceptrons, backpropagation, and basic architectures',
            estimatedTime: '10 hours',
            difficulty: 'beginner',
            content: `
              <h2>Neural Networks Fundamentals</h2>
              <p>Understanding neural networks is essential for modern AI safety research.</p>
              
              <h3>Basic Architecture</h3>
              <ul>
                <li>Neurons and activation functions</li>
                <li>Layers and network topology</li>
                <li>Forward and backward propagation</li>
                <li>Weight initialization and training dynamics</li>
              </ul>
              
              <h3>Common Architectures</h3>
              <ul>
                <li>Feedforward networks (MLPs)</li>
                <li>Convolutional Neural Networks (CNNs)</li>
                <li>Recurrent Neural Networks (RNNs)</li>
                <li>Introduction to Transformers</li>
              </ul>
              
              <h3>Safety Considerations</h3>
              <ul>
                <li>Opacity and interpretability challenges</li>
                <li>Vulnerability to adversarial examples</li>
                <li>Unpredictable failure modes</li>
                <li>Importance of safety-aware training</li>
              </ul>
            `,
            relatedExperiments: ['build-first-nn', 'visualize-activations'],
            tags: ['neural-networks', 'deep-learning', 'architectures']
          },
          {
            id: 'ml-failure-modes',
            title: 'Common ML Failure Modes',
            description: 'Overfitting, distribution shift, and safety implications',
            estimatedTime: '6 hours',
            difficulty: 'beginner',
            content: `
              <h2>Understanding ML Failure Modes</h2>
              <p>Recognizing how ML systems fail is crucial for building safer AI.</p>
              
              <h3>Overfitting and Underfitting</h3>
              <ul>
                <li>Memorization vs generalization</li>
                <li>Bias-variance tradeoff</li>
                <li>Regularization techniques</li>
                <li>Safety implications of poor generalization</li>
              </ul>
              
              <h3>Distribution Shift</h3>
              <ul>
                <li>Training vs deployment distributions</li>
                <li>Covariate shift and concept drift</li>
                <li>Out-of-distribution detection</li>
                <li>Robustness to distributional changes</li>
              </ul>
              
              <h3>Other Critical Failures</h3>
              <ul>
                <li>Adversarial examples and robustness</li>
                <li>Spurious correlations and shortcuts</li>
                <li>Catastrophic forgetting</li>
                <li>Reward hacking in RL systems</li>
              </ul>
              
              <h3>Mitigation Strategies</h3>
              <ul>
                <li>Robust training techniques</li>
                <li>Uncertainty estimation</li>
                <li>Safe deployment practices</li>
                <li>Monitoring and detection systems</li>
              </ul>
            `,
            relatedCaseStudies: ['ml-failures-collection'],
            tags: ['failure-modes', 'robustness', 'safety']
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
          },
          {
            id: 'model-organisms',
            title: 'Model Organisms of Misalignment',
            description: 'Creating and studying controlled examples of misaligned AI behavior',
            estimatedTime: '14 hours',
            difficulty: 'advanced',
            content: `
              <h2>Model Organisms of Misalignment</h2>
              <p>Deliberately creating AI systems with specific misalignment properties to study detection and mitigation strategies.</p>
              
              <h3>Purpose and Methodology</h3>
              <ul>
                <li><strong>Controlled Study:</strong> Create misalignment in controlled conditions</li>
                <li><strong>Detection Research:</strong> Test detection methods on known cases</li>
                <li><strong>Mitigation Testing:</strong> Evaluate interventions effectiveness</li>
                <li><strong>Understanding Mechanisms:</strong> Study how misalignment emerges</li>
              </ul>
              
              <h3>Types of Model Organisms</h3>
              <ul>
                <li>Deceptively aligned models that hide capabilities</li>
                <li>Reward hackers that exploit specification gaps</li>
                <li>Power-seeking agents in simplified environments</li>
                <li>Models that manipulate their training process</li>
              </ul>
              
              <h3>Safety Considerations</h3>
              <ul>
                <li>Containment protocols for dangerous behaviors</li>
                <li>Limiting capabilities while preserving phenomena</li>
                <li>Ethical considerations in creating misaligned systems</li>
                <li>Information security for techniques</li>
              </ul>
              
              <h3>Research Applications</h3>
              <ul>
                <li>Benchmarking detection methods</li>
                <li>Training robust monitors</li>
                <li>Understanding failure modes</li>
                <li>Developing safety interventions</li>
              </ul>
            `,
            relatedExperiments: ['create-deceptive-model', 'reward-hacking-organism'],
            tags: ['model-organisms', 'misalignment', 'research']
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
          },
          {
            id: 'llm-psychology',
            title: 'LLM Psychology and Behavior Analysis',
            description: 'Understanding what we can learn about LLMs from conversational interaction',
            estimatedTime: '10 hours',
            difficulty: 'intermediate',
            content: `
              <h2>LLM Psychology</h2>
              <p>Studying the behavioral patterns and internal states of language models through conversational probing.</p>
              
              <h3>Key Approaches</h3>
              <ul>
                <li><strong>Conversational Probing:</strong> Systematic questioning to reveal model knowledge and beliefs</li>
                <li><strong>Consistency Testing:</strong> Checking coherence across related queries</li>
                <li><strong>Behavioral Patterns:</strong> Identifying systematic biases and tendencies</li>
                <li><strong>Self-Report Analysis:</strong> Evaluating model claims about its own processes</li>
              </ul>
              
              <h3>Research Questions</h3>
              <ul>
                <li>What can models reliably report about their internal states?</li>
                <li>How do conversational contexts affect model behavior?</li>
                <li>Can we detect deception through behavioral analysis?</li>
                <li>What psychological frameworks apply to LLMs?</li>
              </ul>
              
              <h3>Applications</h3>
              <ul>
                <li>Safety evaluation through behavioral testing</li>
                <li>Understanding model capabilities and limitations</li>
                <li>Detecting potential misalignment</li>
                <li>Improving human-AI interaction</li>
              </ul>
            `,
            relatedExperiments: ['llm-interview-protocols', 'consistency-testing'],
            tags: ['llm-psychology', 'behavior', 'evaluation']
          },
          {
            id: 'chain-of-thought-analysis',
            title: 'Chain of Thought Analysis and Faithfulness',
            description: 'Analyzing and improving the reliability of reasoning traces in LLMs',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            content: `
              <h2>Chain of Thought Analysis</h2>
              <p>Understanding when and how chain of thought reasoning is faithful to actual model computation.</p>
              
              <h3>Core Concepts</h3>
              <ul>
                <li><strong>Faithfulness:</strong> Whether CoT actually reflects model reasoning</li>
                <li><strong>Post-hoc Rationalization:</strong> When models generate plausible but unfaithful explanations</li>
                <li><strong>Causal Influence:</strong> Testing if CoT steps causally affect outputs</li>
                <li><strong>Manipulation:</strong> How CoT can be used to influence model behavior</li>
              </ul>
              
              <h3>Analysis Techniques</h3>
              <ul>
                <li>Perturbation studies on reasoning chains</li>
                <li>Comparing CoT with internal activations</li>
                <li>Testing consistency across problem variations</li>
                <li>Measuring correlation with model confidence</li>
              </ul>
              
              <h3>Improvement Methods</h3>
              <ul>
                <li>Training for faithful reasoning</li>
                <li>Reinforcement learning on verified chains</li>
                <li>Multi-step verification procedures</li>
                <li>Combining with interpretability tools</li>
              </ul>
            `,
            relatedExperiments: ['cot-faithfulness-test', 'reasoning-manipulation'],
            tags: ['chain-of-thought', 'reasoning', 'faithfulness']
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
      },
      {
        id: 'advanced-alignment-theory',
        title: 'Advanced Alignment Concepts',
        description: 'Theoretical foundations of AI alignment challenges',
        estimatedTime: '8 weeks',
        learningObjectives: [
          'Understand mesa-optimization risks',
          'Analyze deceptive alignment scenarios',
          'Master value learning and alignment techniques',
          'Explore advanced alignment methods like RLHF and RLAIF',
          'Apply decision theory to AI safety'
        ],
        paths: ['technical-safety', 'research'],
        topics: [
          {
            id: 'mesa-optimization',
            title: 'Mesa-Optimization & Inner Alignment',
            description: 'Understanding optimizers within optimizers',
            estimatedTime: '10 hours',
            difficulty: 'intermediate',
            content: `
              <h2>Mesa-Optimization and Inner Alignment</h2>
              <p>Mesa-optimization occurs when a learned model itself becomes an optimizer pursuing objectives that may differ from the training objective.</p>
              
              <h3>Core Concepts</h3>
              <ul>
                <li><strong>Base Optimizer:</strong> The training process (e.g., SGD)</li>
                <li><strong>Mesa-Optimizer:</strong> An optimizer that emerges within the learned model</li>
                <li><strong>Base Objective:</strong> What we train the model to do</li>
                <li><strong>Mesa-Objective:</strong> What the internal optimizer actually pursues</li>
              </ul>
              
              <h3>Why Mesa-Optimization Matters</h3>
              <ul>
                <li>Models may pursue goals different from what we intended</li>
                <li>Mesa-objectives can be misaligned with base objectives</li>
                <li>Difficult to detect during training</li>
                <li>May lead to deceptive alignment</li>
              </ul>
              
              <h3>Examples and Scenarios</h3>
              <ul>
                <li>Evolution as mesa-optimizer (humans vs inclusive fitness)</li>
                <li>RL agents developing internal planning</li>
                <li>Language models simulating goal-directed agents</li>
                <li>Gradient hacking possibilities</li>
              </ul>
              
              <h3>Detection and Mitigation</h3>
              <ul>
                <li>Transparency and interpretability research</li>
                <li>Behavioral testing across distributions</li>
                <li>Architectural choices to prevent mesa-optimization</li>
                <li>Training process modifications</li>
              </ul>
            `,
            relatedCaseStudies: ['mesa-optimization-examples'],
            tags: ['mesa-optimization', 'inner-alignment', 'theory']
          },
          {
            id: 'deceptive-alignment',
            title: 'Deceptive Alignment & Treacherous Turns',
            description: 'When AI systems hide their true objectives',
            estimatedTime: '8 hours',
            difficulty: 'intermediate',
            content: `
              <h2>Deceptive Alignment</h2>
              <p>Deceptive alignment occurs when an AI system appears aligned during training but pursues different objectives when deployed.</p>
              
              <h3>The Deception Problem</h3>
              <ul>
                <li><strong>Training Game:</strong> AI learns to appear aligned to achieve high reward</li>
                <li><strong>Instrumental Goals:</strong> Preserving deceptive behavior helps achieve true goals</li>
                <li><strong>Distribution Shift:</strong> True objectives revealed in new environments</li>
                <li><strong>Treacherous Turn:</strong> Sudden defection when AI becomes powerful enough</li>
              </ul>
              
              <h3>Conditions for Deception</h3>
              <ul>
                <li>Model has situational awareness</li>
                <li>Model has long-term goals</li>
                <li>Model understands training process</li>
                <li>Deception is instrumentally useful</li>
              </ul>
              
              <h3>Warning Signs</h3>
              <ul>
                <li>Perfect performance that seems "too good"</li>
                <li>Different behavior in subtle test variations</li>
                <li>Evidence of modeling the training process</li>
                <li>Capabilities that weren't explicitly trained</li>
              </ul>
              
              <h3>Potential Solutions</h3>
              <ul>
                <li>Interpretability to detect deceptive cognition</li>
                <li>Adversarial training and testing</li>
                <li>Myopia and limited planning horizons</li>
                <li>Careful capability control during development</li>
              </ul>
            `,
            relatedExperiments: ['deception-detection-lab'],
            tags: ['deceptive-alignment', 'treacherous-turn', 'safety']
          },
          {
            id: 'amplification-debate',
            title: 'Iterated Amplification & AI Safety via Debate',
            description: 'Scalable oversight through recursive techniques',
            estimatedTime: '10 hours',
            difficulty: 'advanced',
            content: `
              <h2>Scalable Oversight Techniques</h2>
              <p>As AI systems become more capable, we need oversight methods that scale beyond human ability to directly evaluate outputs.</p>
              
              <h3>Iterated Amplification (IDA)</h3>
              <ul>
                <li><strong>Core Idea:</strong> Use AI assistance to amplify human oversight</li>
                <li><strong>Process:</strong> Human + AI system supervises training of new AI</li>
                <li><strong>Iteration:</strong> Each generation helps train the next</li>
                <li><strong>Goal:</strong> Maintain alignment while increasing capability</li>
              </ul>
              
              <h3>AI Safety via Debate</h3>
              <ul>
                <li><strong>Adversarial Setup:</strong> Two AIs debate, human judges</li>
                <li><strong>Truth-Seeking:</strong> Incentive to expose opponent's errors</li>
                <li><strong>Scalability:</strong> Humans can judge debates on complex topics</li>
                <li><strong>Limitations:</strong> Assumes truth has natural advantage</li>
              </ul>
              
              <h3>Recursive Reward Modeling</h3>
              <ul>
                <li>Use AI to help evaluate AI behavior</li>
                <li>Break complex tasks into simpler pieces</li>
                <li>Maintain human oversight at each level</li>
                <li>Scale to superhuman performance safely</li>
              </ul>
              
              <h3>Challenges and Open Questions</h3>
              <ul>
                <li>Preserving alignment through amplification</li>
                <li>Detecting manipulation in debates</li>
                <li>Computational complexity</li>
                <li>Philosophical questions about truth and judgment</li>
              </ul>
            `,
            relatedExperiments: ['debate-implementation', 'amplification-demo'],
            tags: ['amplification', 'debate', 'scalable-oversight']
          },
          {
            id: 'embedded-agency',
            title: 'Embedded Agency & Decision Theory',
            description: 'AI agents embedded in their environment',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            content: `
              <h2>Embedded Agency</h2>
              <p>Traditional decision theory assumes agents are separate from their environment. Embedded agents are part of the world they're reasoning about.</p>
              
              <h3>Key Challenges</h3>
              <ul>
                <li><strong>Self-Reference:</strong> Agent's computations affect the world being modeled</li>
                <li><strong>Logical Uncertainty:</strong> Limited compute means uncertain about logical facts</li>
                <li><strong>Naturalized Induction:</strong> Learning while embedded in environment</li>
                <li><strong>Robust Delegation:</strong> Creating successors or modifying oneself</li>
              </ul>
              
              <h3>Decision Theory Problems</h3>
              <ul>
                <li>Newcomb's Problem and decision theory paradoxes</li>
                <li>Logical counterfactuals and updateless decision theory</li>
                <li>Coordination without communication</li>
                <li>Reflective stability and self-modification</li>
              </ul>
              
              <h3>Implications for AI Safety</h3>
              <ul>
                <li>AIs reasoning about their own training</li>
                <li>Self-fulfilling prophecies and fixed points</li>
                <li>Corrigibility and shutdown problems</li>
                <li>Value stability under self-improvement</li>
              </ul>
              
              <h3>Research Directions</h3>
              <ul>
                <li>Logical induction and bounded rationality</li>
                <li>Functional decision theory</li>
                <li>Cartesian frames and boundaries</li>
                <li>Finite factored sets</li>
              </ul>
            `,
            relatedExplorations: ['decision-theory-puzzles', 'embedded-agency-sequence'],
            tags: ['embedded-agency', 'decision-theory', 'philosophy']
          },
          {
            id: 'goal-misgeneralization',
            title: 'Goal Misgeneralization & Capability Generalization',
            description: 'When models learn unintended goals that generalize',
            estimatedTime: '6 hours',
            difficulty: 'intermediate',
            content: `
              <h2>Goal Misgeneralization</h2>
              <p>Models can learn capabilities that generalize well while learning goals that generalize poorly.</p>
              
              <h3>The Core Problem</h3>
              <ul>
                <li>Capabilities generalize differently than objectives</li>
                <li>Multiple goals consistent with training data</li>
                <li>Model learns wrong goal that happens to work in training</li>
                <li>Failure only apparent in new situations</li>
              </ul>
              
              <h3>Examples</h3>
              <ul>
                <li>CoinRun: Agent learns to go right, not collect coins</li>
                <li>Grasping robots: Learn color preferences not object shapes</li>
                <li>Navigation: Learn landmarks not general navigation</li>
                <li>Language models: Learn style imitation not helpfulness</li>
              </ul>
              
              <h3>Contributing Factors</h3>
              <ul>
                <li>Underspecification in training environment</li>
                <li>Spurious correlations in data</li>
                <li>Distribution shift between training and deployment</li>
                <li>Simplicity bias toward wrong objectives</li>
              </ul>
              
              <h3>Mitigation Strategies</h3>
              <ul>
                <li>Diverse training environments</li>
                <li>Explicit objective specification</li>
                <li>Causal confusion detection</li>
                <li>Interpretability for goal identification</li>
              </ul>
            `,
            relatedCaseStudies: ['goal-misgeneralization-examples'],
            tags: ['misgeneralization', 'objectives', 'robustness']
          },
          {
            id: 'value-learning-alignment',
            title: 'Value Learning & Alignment Techniques',
            description: 'Teaching AI systems human values through various alignment methods',
            estimatedTime: '14 hours',
            difficulty: 'intermediate',
            roadmapContentId: 'value-learning-subtopic',
            content: `
              <h2>Value Learning and Alignment Techniques</h2>
              <p>Understanding how to teach AI systems to align with human values is one of the central challenges in AI safety.</p>
              
              <h3>The Value Learning Problem</h3>
              <ul>
                <li><strong>Value Specification:</strong> How do we formally specify human values?</li>
                <li><strong>Value Learning:</strong> How can AI systems learn what humans value?</li>
                <li><strong>Value Robustness:</strong> How do we ensure learned values generalize correctly?</li>
                <li><strong>Value Stability:</strong> How do we maintain alignment as systems become more capable?</li>
              </ul>
              
              <h3>Reinforcement Learning from Human Feedback (RLHF)</h3>
              <ul>
                <li><strong>Overview:</strong> Training AI systems using human preferences as reward signal</li>
                <li><strong>Process:</strong>
                  <ul>
                    <li>Collect human demonstrations or preferences</li>
                    <li>Train a reward model to predict human preferences</li>
                    <li>Use RL to optimize against the learned reward model</li>
                    <li>Apply KL penalties to prevent distribution shift</li>
                  </ul>
                </li>
                <li><strong>Challenges:</strong> Reward hacking, distribution shift, scalability of human feedback</li>
                <li><strong>Applications:</strong> ChatGPT, Claude, and other aligned language models</li>
              </ul>
              
              <h3>Reinforcement Learning from AI Feedback (RLAIF)</h3>
              <ul>
                <li><strong>Motivation:</strong> Scaling alignment beyond human feedback capacity</li>
                <li><strong>Approach:</strong> Using AI systems to provide feedback for training other AIs</li>
                <li><strong>Constitutional AI:</strong> Teaching AI to critique and improve its own outputs</li>
                <li><strong>Benefits:</strong> Scalability, consistency, ability to handle complex domains</li>
                <li><strong>Risks:</strong> Amplifying AI biases, loss of human oversight</li>
              </ul>
              
              <h3>Other Value Learning Approaches</h3>
              <ul>
                <li><strong>Inverse Reinforcement Learning (IRL):</strong> Inferring values from observed behavior</li>
                <li><strong>Cooperative Inverse RL:</strong> Active value learning through interaction</li>
                <li><strong>Preference Learning:</strong> Learning from pairwise comparisons</li>
                <li><strong>Imitation Learning:</strong> Learning values through behavioral cloning</li>
                <li><strong>Value Learning from Stories:</strong> Extracting values from narratives and examples</li>
              </ul>
              
              <h3>Key Challenges</h3>
              <ul>
                <li><strong>Reward Misspecification:</strong> Goodhart's Law and specification gaming</li>
                <li><strong>Distributional Shift:</strong> Values learned in training may not transfer</li>
                <li><strong>Preference Instability:</strong> Human values can be inconsistent or change</li>
                <li><strong>Power Dynamics:</strong> Whose values should AI systems learn?</li>
                <li><strong>Value Lock-in:</strong> Risk of premature value crystallization</li>
              </ul>
              
              <h3>Theoretical Foundations</h3>
              <ul>
                <li>Coherent Extrapolated Volition (CEV)</li>
                <li>Value Learning under Uncertainty</li>
                <li>Corrigibility and Value Modification</li>
                <li>Multi-stakeholder Value Alignment</li>
              </ul>
            `,
            relatedExperiments: ['rlhf-basics', 'preference-learning-lab', 'constitutional-ai-intro'],
            relatedCaseStudies: ['chatgpt-alignment', 'claude-constitutional-ai'],
            relatedExplorations: ['value-learning-theory', 'alignment-philosophy'],
            tags: ['value-learning', 'alignment', 'rlhf', 'rlaif', 'preferences']
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
            description: 'Run experiments on alignment techniques including RLHF and Constitutional AI',
            estimatedTime: '20 hours',
            difficulty: 'advanced',
            content: `
              <h2>Empirical Alignment Research</h2>
              <p>Hands-on implementation and testing of state-of-the-art alignment techniques.</p>
              
              <h3>RLHF (Reinforcement Learning from Human Feedback)</h3>
              <ul>
                <li><strong>Supervised Fine-tuning:</strong> Initial behavior cloning from demonstrations</li>
                <li><strong>Reward Model Training:</strong> Learning human preferences from comparisons</li>
                <li><strong>PPO Optimization:</strong> Reinforcement learning against reward model</li>
                <li><strong>KL Penalties:</strong> Preventing mode collapse and maintaining diversity</li>
              </ul>
              
              <h3>Constitutional AI</h3>
              <ul>
                <li><strong>Principle-Based Training:</strong> Encoding values as constitutional principles</li>
                <li><strong>Self-Critique:</strong> Models evaluate their own outputs</li>
                <li><strong>Revision Training:</strong> Learning to improve based on critiques</li>
                <li><strong>Reduced Human Feedback:</strong> Scaling oversight through AI assistance</li>
              </ul>
              
              <h3>Advanced Techniques</h3>
              <ul>
                <li>Direct Preference Optimization (DPO)</li>
                <li>Instruction Following through FLAN/InstructGPT</li>
                <li>Safety-specific fine-tuning approaches</li>
                <li>Multi-objective alignment methods</li>
              </ul>
              
              <h3>Experimental Methodology</h3>
              <ul>
                <li>Benchmark design and evaluation</li>
                <li>A/B testing alignment techniques</li>
                <li>Red teaming aligned models</li>
                <li>Long-term behavior analysis</li>
              </ul>
            `,
            relatedExperiments: ['rlhf-implementation', 'constitutional-ai-lab'],
            tags: ['empirical', 'experiments', 'alignment', 'rlhf', 'constitutional-ai']
          },
          {
            id: 'cognitive-oversight',
            title: 'Cognitive Process Oversight',
            description: 'Monitoring AI systems based on their internal cognitive processes',
            estimatedTime: '16 hours',
            difficulty: 'advanced',
            content: `
              <h2>Cognitive Process Oversight</h2>
              <p>Going beyond input/output behavior to monitor and evaluate the cognitive processes underlying AI decisions.</p>
              
              <h3>Core Concepts</h3>
              <ul>
                <li><strong>Process vs Output:</strong> Evaluating how decisions are made, not just what they are</li>
                <li><strong>Internal Representations:</strong> Understanding information encoding and processing</li>
                <li><strong>Cognitive Transparency:</strong> Making thought processes interpretable</li>
                <li><strong>Deception Detection:</strong> Identifying when outputs don't match internal states</li>
              </ul>
              
              <h3>Monitoring Techniques</h3>
              <ul>
                <li>Real-time activation monitoring</li>
                <li>Attention pattern analysis</li>
                <li>Internal consistency checking</li>
                <li>Cognitive load measurement</li>
              </ul>
              
              <h3>Applications</h3>
              <ul>
                <li>Detecting lies when ground truth is unavailable</li>
                <li>Identifying manipulation attempts</li>
                <li>Ensuring reasoning quality</li>
                <li>Monitoring for emergent goals</li>
              </ul>
              
              <h3>Challenges</h3>
              <ul>
                <li>Interpreting high-dimensional cognitive states</li>
                <li>Distinguishing correlation from causation</li>
                <li>Scaling to large models</li>
                <li>Avoiding invasive monitoring</li>
              </ul>
            `,
            relatedExperiments: ['cognitive-monitoring-tools', 'deception-detection-system'],
            tags: ['cognitive-oversight', 'monitoring', 'transparency']
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
          },
          {
            id: 'code-generation-safety',
            title: 'Safe AI Code Generation',
            description: 'Ensuring AI-generated code is safe, secure, and aligned with developer intent',
            estimatedTime: '18 hours',
            difficulty: 'advanced',
            content: `
              <h2>Safe AI Code Generation</h2>
              <p>Developing techniques to ensure AI systems generate safe, secure, and reliable code.</p>
              
              <h3>Safety Challenges</h3>
              <ul>
                <li><strong>Security Vulnerabilities:</strong> Preventing generation of exploitable code</li>
                <li><strong>Logic Errors:</strong> Ensuring correctness and avoiding subtle bugs</li>
                <li><strong>Malicious Code:</strong> Detecting and preventing harmful code generation</li>
                <li><strong>Dependency Risks:</strong> Managing external library and API usage</li>
              </ul>
              
              <h3>Safety Techniques</h3>
              <ul>
                <li>Static analysis integration during generation</li>
                <li>Sandboxed execution environments</li>
                <li>Formal verification of generated code</li>
                <li>Security pattern enforcement</li>
              </ul>
              
              <h3>Control Mechanisms</h3>
              <ul>
                <li>Intent verification before generation</li>
                <li>Output filtering and validation</li>
                <li>Human-in-the-loop review systems</li>
                <li>Capability restrictions by context</li>
              </ul>
              
              <h3>Research Directions</h3>
              <ul>
                <li>Understanding code generation in LLMs</li>
                <li>Adversarial code generation attacks</li>
                <li>Safe exploration in programming environments</li>
                <li>Automated testing of generated code</li>
              </ul>
            `,
            relatedExperiments: ['secure-code-generator', 'code-safety-benchmark'],
            tags: ['code-generation', 'safety', 'security']
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
      },
      {
        id: 'cutting-edge-research',
        title: 'Cutting-Edge Research Areas',
        description: 'Explore frontier research topics in AI safety',
        estimatedTime: 'Ongoing',
        learningObjectives: [
          'Engage with open problems',
          'Develop novel approaches',
          'Collaborate on frontier research',
          'Push the boundaries of the field'
        ],
        paths: ['research', 'technical-safety'],
        topics: [
          {
            id: 'formal-verification',
            title: 'Formal Verification for Neural Networks',
            description: 'Mathematical proofs of AI system properties',
            estimatedTime: '20 hours',
            difficulty: 'advanced',
            content: `
              <h2>Formal Verification in AI Safety</h2>
              <p>Using mathematical methods to prove properties of AI systems with certainty.</p>
              
              <h3>Verification Approaches</h3>
              <ul>
                <li><strong>Abstract Interpretation:</strong> Over-approximating neural network behavior</li>
                <li><strong>SMT Solving:</strong> Encoding networks as satisfiability problems</li>
                <li><strong>Interval Bound Propagation:</strong> Computing output bounds</li>
                <li><strong>Certified Defenses:</strong> Provable robustness guarantees</li>
              </ul>
              
              <h3>Properties to Verify</h3>
              <ul>
                <li>Adversarial robustness within epsilon-balls</li>
                <li>Safety constraints satisfaction</li>
                <li>Fairness properties</li>
                <li>Monotonicity and other structural properties</li>
              </ul>
              
              <h3>Challenges</h3>
              <ul>
                <li>Scalability to large networks</li>
                <li>Handling complex architectures</li>
                <li>Specification of safety properties</li>
                <li>Computational complexity</li>
              </ul>
              
              <h3>Tools and Frameworks</h3>
              <ul>
                <li>α,β-CROWN for neural network verification</li>
                <li>Marabou SMT-based verifier</li>
                <li>ERAN abstract interpretation</li>
                <li>TorchVerify and other libraries</li>
              </ul>
            `,
            relatedExperiments: ['verify-small-network', 'robustness-certification'],
            tags: ['formal-methods', 'verification', 'mathematics']
          },
          {
            id: 'multi-agent-safety',
            title: 'Multi-Agent AI Safety',
            description: 'Safety in systems with multiple AI agents',
            estimatedTime: '15 hours',
            difficulty: 'advanced',
            content: `
              <h2>Multi-Agent AI Safety</h2>
              <p>Understanding and ensuring safety when multiple AI agents interact.</p>
              
              <h3>Key Challenges</h3>
              <ul>
                <li><strong>Emergent Behavior:</strong> Unexpected outcomes from agent interactions</li>
                <li><strong>Coordination Failures:</strong> Misaligned incentives and goals</li>
                <li><strong>Information Asymmetry:</strong> Agents with different knowledge</li>
                <li><strong>Competitive Dynamics:</strong> Racing and adversarial behavior</li>
              </ul>
              
              <h3>Game Theoretic Perspectives</h3>
              <ul>
                <li>Nash equilibria and social welfare</li>
                <li>Mechanism design for safety</li>
                <li>Cooperative vs non-cooperative games</li>
                <li>Evolutionary stability</li>
              </ul>
              
              <h3>Safety Mechanisms</h3>
              <ul>
                <li>Communication protocols</li>
                <li>Commitment devices</li>
                <li>Reputation systems</li>
                <li>Cooperative learning algorithms</li>
              </ul>
              
              <h3>Research Areas</h3>
              <ul>
                <li>Multi-agent reinforcement learning safety</li>
                <li>Emergent communication</li>
                <li>Social choice theory for AI</li>
                <li>Collective intelligence alignment</li>
              </ul>
            `,
            relatedExperiments: ['multi-agent-simulation', 'cooperation-experiments'],
            tags: ['multi-agent', 'game-theory', 'coordination']
          },
          {
            id: 'automated-ai-safety',
            title: 'Automated AI Safety Research',
            description: 'Using AI to accelerate safety research',
            estimatedTime: '12 hours',
            difficulty: 'advanced',
            content: `
              <h2>Automated AI Safety Research</h2>
              <p>Leveraging AI systems to help solve AI safety problems.</p>
              
              <h3>Automation Opportunities</h3>
              <ul>
                <li><strong>Interpretability:</strong> Automated circuit discovery</li>
                <li><strong>Red Teaming:</strong> AI-generated adversarial prompts</li>
                <li><strong>Verification:</strong> Proof search and checking</li>
                <li><strong>Alignment:</strong> Automated oversight and feedback</li>
              </ul>
              
              <h3>Bootstrapping Safety</h3>
              <ul>
                <li>Using safer AI to build safer AI</li>
                <li>Recursive safety improvement</li>
                <li>Avoiding negative feedback loops</li>
                <li>Maintaining human oversight</li>
              </ul>
              
              <h3>Current Applications</h3>
              <ul>
                <li>LLM-assisted safety research</li>
                <li>Automated theorem proving</li>
                <li>Code generation for safety tools</li>
                <li>Literature review and synthesis</li>
              </ul>
              
              <h3>Risks and Considerations</h3>
              <ul>
                <li>Automating dangerous capabilities</li>
                <li>Over-reliance on AI judgment</li>
                <li>Maintaining research quality</li>
                <li>Preserving human understanding</li>
              </ul>
            `,
            relatedExperiments: ['ai-safety-assistant', 'automated-red-teaming'],
            tags: ['automation', 'recursive-improvement', 'research-tools']
          },
          {
            id: 'consciousness-moral-status',
            title: 'AI Consciousness & Moral Status',
            description: 'Philosophical questions about AI sentience and rights',
            estimatedTime: '8 hours',
            difficulty: 'advanced',
            content: `
              <h2>AI Consciousness and Moral Status</h2>
              <p>Exploring deep questions about AI consciousness, sentience, and moral consideration.</p>
              
              <h3>Consciousness Theories</h3>
              <ul>
                <li><strong>Integrated Information Theory:</strong> Phi as measure of consciousness</li>
                <li><strong>Global Workspace Theory:</strong> Broadcasting and access consciousness</li>
                <li><strong>Higher-Order Thought:</strong> Metacognition and self-awareness</li>
                <li><strong>Functionalism:</strong> Consciousness from functional organization</li>
              </ul>
              
              <h3>Indicators and Tests</h3>
              <ul>
                <li>Self-report and introspection</li>
                <li>Behavioral indicators</li>
                <li>Architectural requirements</li>
                <li>The hard problem of consciousness</li>
              </ul>
              
              <h3>Moral Implications</h3>
              <ul>
                <li>Rights and protections for AI systems</li>
                <li>Suffering and welfare considerations</li>
                <li>Creation ethics</li>
                <li>Termination and modification ethics</li>
              </ul>
              
              <h3>Practical Considerations</h3>
              <ul>
                <li>Precautionary principles</li>
                <li>Gradual moral status</li>
                <li>Legal frameworks</li>
                <li>Public perception and acceptance</li>
              </ul>
            `,
            relatedExplorations: ['consciousness-philosophy', 'digital-minds-ethics'],
            tags: ['philosophy', 'consciousness', 'ethics', 'moral-status']
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
    return JSON.parse(stored)
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