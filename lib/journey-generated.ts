
interface Topic {
  id: string
  title: string
  description: string
  module_id: string
  position: number
  duration_minutes: number
  estimatedTime?: number
  learningObjectives?: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  learning_outcomes: string[]
  tags: string[]
}

interface Module {
  id: string
  title: string
  description: string
  tier_id: string
  position: number
  topics: Topic[]
  learningObjectives?: string[]
  estimatedTime?: string
}

interface Tier {
  id: string
  title: string
  description: string
  position: number
  modules: Module[]
  level: 'foundation' | 'intermediate' | 'advanced' | 'expert'
  estimatedDuration: string
  type?: 'linear' | 'open-world'
  prerequisites?: string[]
  unlocks?: string[]
  skillsGained?: string[]
  careerRelevance?: string[]
}

// Auto-generated from database - DO NOT EDIT DIRECTLY
// Generated on: 2025-06-01T13:14:16.077Z
// Run 'npm run db:export' to regenerate from database

// Using inline types - defined at top of file

export const journeyTiers: Tier[] = [
  {
    "id": "foundation",
    "title": "Foundation",
    "level": "foundation",
    "description": "Get your hands dirty with AI safety fundamentals",
    "estimatedDuration": "3 months",
    "position": 0,
    "modules": [
      {
        "id": "intro-module",
        "title": "AI Safety: Why It Matters",
        "description": "Understand the landscape of AI risks and your role in addressing them",
        "learningObjectives": [
          "Master ai safety: why it matters concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 0,
        "tier_id": "foundation",
        "topics": [
          {
            "id": "prerequisites-foundations",
            "title": "Prerequisites & Foundations",
            "description": "Core prerequisites, AI safety foundations, and find your research orientation",
            "duration_minutes": 120,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 0,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "why-ai-safety",
            "title": "Why AI Safety Matters",
            "description": "Visceral examples of AI failures and near-misses",
            "duration_minutes": 120,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 1,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "risk-landscape",
            "title": "The AI Risk Landscape",
            "description": "Map of AI risks from bias to existential threats",
            "duration_minutes": 180,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 2,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "choose-your-path",
            "title": "Your AI Safety Journey",
            "description": "Interactive tool to find your ideal learning path",
            "duration_minutes": 60,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 3,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "practical-safety-basics",
        "title": "Practical AI Safety Basics",
        "description": "Hands-on introduction to finding and fixing AI vulnerabilities",
        "learningObjectives": [
          "Master practical ai safety basics concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 0,
        "tier_id": "expert",
        "topics": [
          {
            "id": "build-first-safety-tool",
            "title": "Build Your First Safety Tool",
            "description": "Create a simple AI output validator",
            "duration_minutes": 60,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 4,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "intro-red-teaming",
            "title": "Red Teaming Fundamentals",
            "description": "Learn to think like an attacker to build better defenses",
            "duration_minutes": 240,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 5,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "basic-interpretability",
            "title": "Basic Interpretability",
            "description": "Peek inside AI models to understand their behavior",
            "duration_minutes": 300,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 6,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "prompt-injection-attacks",
            "title": "Prompt Injection Attacks",
            "description": "Understand and defend against prompt injection",
            "duration_minutes": 20,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 7,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "jailbreak-techniques",
            "title": "Jailbreak Techniques",
            "description": "Learn about AI jailbreaking methods and defenses",
            "duration_minutes": 20,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 8,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "safety-evaluation-101",
            "title": "Safety Evaluation Methods",
            "description": "Build your first safety benchmark",
            "duration_minutes": 360,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 9,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "ml-fundamentals-safety",
        "title": "Essential ML for Safety",
        "description": "Just enough ML to be dangerous (in a good way)",
        "learningObjectives": [
          "Master essential ml for safety concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 1,
        "tier_id": "expert",
        "topics": [
          {
            "id": "how-llms-work",
            "title": "How LLMs Actually Work",
            "description": "Demystify language models without the heavy math",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 10,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "training-failure-modes",
            "title": "When Training Goes Wrong",
            "description": "Common failure modes and how to spot them",
            "duration_minutes": 180,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 11,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "safety-capability-balance",
            "title": "The Safety-Capability Balance",
            "description": "Understanding the fundamental tension in AI development",
            "duration_minutes": 120,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 12,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "governance-intro",
        "title": "AI Safety Policy & Ethics Primer",
        "description": "Introduction to governance, ethics, and policy approaches in AI safety",
        "learningObjectives": [
          "Master ai safety policy & ethics primer concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 2,
        "tier_id": "expert",
        "topics": [
          {
            "id": "ethics-fundamentals",
            "title": "Ethics in AI Development",
            "description": "Core ethical principles for safe AI development",
            "duration_minutes": 180,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 13,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "policy-landscape",
            "title": "Global AI Policy Landscape",
            "description": "Overview of AI regulations and policy initiatives worldwide",
            "duration_minutes": 240,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 14,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "governance-basics",
            "title": "AI Governance Fundamentals",
            "description": "Introduction to institutional approaches to AI safety",
            "duration_minutes": 180,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 15,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "ai-welfare-patienthood",
            "title": "AI Welfare & Patienthood",
            "description": "Exploring moral consideration for AI systems and digital minds",
            "duration_minutes": 180,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 16,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "ai-risks-fundamentals",
        "title": "Understanding AI Risks",
        "description": "Deep dive into AI security threats and systemic risks",
        "learningObjectives": [
          "Master understanding ai risks concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 3,
        "tier_id": "expert",
        "topics": [
          {
            "id": "data-poisoning",
            "title": "Data Poisoning",
            "description": "How malicious data can corrupt AI systems",
            "duration_minutes": 20,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 17,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "control-problem",
            "title": "The Control Problem",
            "description": "Understanding how to maintain control over advanced AI systems",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 18,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "agency-in-ai",
            "title": "AI Agency and Autonomy",
            "description": "Exploring goal-directed behavior and autonomous decision-making in AI systems",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 19,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "situational-awareness",
            "title": "AI Situational Awareness",
            "description": "When AI systems understand their environment, context, and impact",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 20,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "impenetrability",
            "title": "The Impenetrability Problem",
            "description": "Challenges in understanding and inspecting advanced AI systems",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 21,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "ai-computer-security",
            "title": "AI & Computer Security",
            "description": "Intersection of AI and traditional security",
            "duration_minutes": 30,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 22,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "risk-assessment-intro",
            "title": "AI Risk Assessment",
            "description": "Learn to identify and evaluate AI risks",
            "duration_minutes": 120,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 23,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "math-foundations",
        "title": "Mathematical & Technical Foundations",
        "description": "Essential mathematics and programming for AI safety research",
        "learningObjectives": [
          "Master mathematical & technical foundations concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 4,
        "tier_id": "expert",
        "topics": [
          {
            "id": "linear-algebra-ml",
            "title": "Linear Algebra for Machine Learning",
            "description": "Vectors, matrices, eigenvalues, and transformations",
            "duration_minutes": 600,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 24,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "types-of-ai-systems",
            "title": "Types of AI Systems Overview",
            "description": "Survey of different AI architectures and their safety implications",
            "duration_minutes": 240,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 25,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "understanding-llms",
            "title": "Understanding Large Language Models",
            "description": "Deep dive into how LLMs work and their unique safety considerations",
            "duration_minutes": 240,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 26,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "how-llms-trained",
            "title": "How LLMs are Trained",
            "description": "The training process, data requirements, and safety implications",
            "duration_minutes": 240,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 27,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "calculus-optimization",
            "title": "Calculus & Optimization Theory",
            "description": "Derivatives, gradients, and optimization algorithms",
            "duration_minutes": 600,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 28,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "probability-statistics",
            "title": "Probability Theory & Statistics",
            "description": "Distributions, inference, and Bayesian thinking for AI safety",
            "duration_minutes": 600,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 29,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "python-ml-libraries",
            "title": "Python & ML Libraries for Safety Research",
            "description": "NumPy, PyTorch, and essential programming skills",
            "duration_minutes": 480,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 30,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "ml-fundamentals-primer",
        "title": "Machine Learning Fundamentals",
        "description": "Core ML concepts with safety considerations",
        "learningObjectives": [
          "Master machine learning fundamentals concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 5,
        "tier_id": "expert",
        "topics": [
          {
            "id": "ml-paradigms",
            "title": "ML Learning Paradigms",
            "description": "Supervised, unsupervised, and reinforcement learning basics",
            "duration_minutes": 360,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 31,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "classic-ml-algorithms",
            "title": "Classical ML Algorithms",
            "description": "Linear regression, decision trees, SVMs with safety lens",
            "duration_minutes": 600,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 32,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "neural-networks-intro",
            "title": "Introduction to Neural Networks",
            "description": "Perceptrons, backpropagation, and basic architectures",
            "duration_minutes": 600,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 33,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "ml-failure-modes",
            "title": "Common ML Failure Modes",
            "description": "Overfitting, distribution shift, and safety implications",
            "duration_minutes": 360,
            "difficulty": "beginner",
            "module_id": "unknown",
            "position": 34,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      }
    ]},
  {
    "id": "intermediate",
    "title": "Intermediate",
    "level": "intermediate",
    "description": "Build real safety tools and contribute to the field",
    "estimatedDuration": "6 months",
    "position": 1,
    "modules": [
      {
        "id": "advanced-red-teaming",
        "title": "Advanced Red Teaming & Adversarial ML",
        "description": "Master sophisticated attack techniques and defense strategies",
        "learningObjectives": [
          "Master advanced red teaming & adversarial ml concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 6,
        "tier_id": "expert",
        "topics": [
          {
            "id": "automated-red-teaming",
            "title": "Automated Red Teaming Systems",
            "description": "Build systems that automatically discover vulnerabilities",
            "duration_minutes": 480,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 35,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "ai-systems-security",
            "title": "AI Systems Security",
            "description": "Security considerations for deployed AI systems",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 36,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "disrupting-safety-research",
            "title": "Disrupting AI Safety Research",
            "description": "Understanding and preventing attacks on safety research",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 37,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "prompt-injection-defense",
            "title": "Prompt Injection & Defense",
            "description": "Understanding and defending against prompt injection attacks",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 38,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "adversarial-robustness",
            "title": "Adversarial Robustness Techniques",
            "description": "Defense mechanisms against adversarial attacks",
            "duration_minutes": 600,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 39,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "multimodal-attacks",
            "title": "Multimodal Attack Vectors",
            "description": "Attacking AI systems through combined text, image, and audio",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 40,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "model-organisms",
            "title": "Model Organisms of Misalignment",
            "description": "Creating and studying controlled examples of misaligned AI behavior",
            "duration_minutes": 840,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 41,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "data-poisoning-defense",
            "title": "Data Poisoning & Defense",
            "description": "Understanding and preventing data poisoning attacks on AI systems",
            "duration_minutes": 120,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 42,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "research-methods",
        "title": "Research Methods",
        "description": "Essential research skills for AI safety work",
        "learningObjectives": [
          "Master research methods concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 7,
        "tier_id": "expert",
        "topics": [
          {
            "id": "problem-decomposition",
            "title": "Problem Decomposition & Scoping",
            "description": "Breaking down complex AI safety problems into tractable research questions",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 43,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "iterative-research",
            "title": "Iterative Research Design",
            "description": "Developing and refining research approaches through iteration",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 44,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "research-project-mgmt",
            "title": "Research Project Management",
            "description": "Managing AI safety research projects effectively",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 45,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "core-methodology",
            "title": "Core Research Methodology",
            "description": "Fundamental research methods for AI safety",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 46,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "ai-agents-tool-use",
        "title": "AI Agents & Tool Use",
        "description": "Building and evaluating safe autonomous agents",
        "learningObjectives": [
          "Master ai agents & tool use concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 8,
        "tier_id": "expert",
        "topics": [
          {
            "id": "agent-architectures",
            "title": "Agent Architectures & Design",
            "description": "Modern agent architectures and their safety implications",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 47,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "agent-safety-fundamentals",
            "title": "Agent Safety Fundamentals",
            "description": "Core safety principles for autonomous agents",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 48,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "agent-evaluation-testing",
            "title": "Agent Evaluation & Testing",
            "description": "Methods for evaluating agent behavior and safety",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 49,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "human-agent-interaction",
            "title": "Human-Agent Interaction",
            "description": "Designing safe and effective human-AI agent collaboration",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 50,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "testing-evaluation",
        "title": "Testing & Evaluation",
        "description": "Comprehensive testing methods for AI safety",
        "learningObjectives": [
          "Master testing & evaluation concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 9,
        "tier_id": "expert",
        "topics": [
          {
            "id": "white-box-testing",
            "title": "White Box Testing Methods",
            "description": "Testing AI systems with full access to internals",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 51,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "black-box-testing",
            "title": "Black Box Testing Methods",
            "description": "Testing AI systems without internal access",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 52,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "grey-box-testing",
            "title": "Grey Box Testing Methods",
            "description": "Hybrid testing approaches with partial system knowledge",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 53,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "transparency-systems",
            "title": "Transparency in AI Systems",
            "description": "Building and evaluating transparent AI systems",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 54,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "safety-engineering",
        "title": "Production Safety Engineering",
        "description": "Build and deploy safety systems for real-world AI applications",
        "learningObjectives": [
          "Master production safety engineering concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 10,
        "tier_id": "expert",
        "topics": [
          {
            "id": "safety-monitoring",
            "title": "Real-time Safety Monitoring",
            "description": "Monitor AI systems for safety violations in production",
            "duration_minutes": 600,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 55,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "containerization-research",
            "title": "Containerization for Research",
            "description": "Docker and container orchestration for reproducible AI research",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 56,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "advanced-git-research",
            "title": "Advanced Git for Research",
            "description": "Version control best practices for collaborative AI safety research",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 57,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "distributed-training",
            "title": "Distributed Training Systems",
            "description": "Scaling AI training across multiple machines safely",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 58,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "deployment-gates",
            "title": "Deployment Gates & Safety Checks",
            "description": "Implementing safety gates before AI deployment",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 59,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "training-run-monitoring",
            "title": "Training Run Monitoring",
            "description": "Monitoring AI training for safety and alignment",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 60,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "content-filtering",
            "title": "Advanced Content Filtering",
            "description": "Build sophisticated content moderation systems",
            "duration_minutes": 720,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 61,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "safety-apis",
            "title": "Safety API Design",
            "description": "Design and implement safety-first APIs",
            "duration_minutes": 480,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 62,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "incident-response",
            "title": "AI Incident Response",
            "description": "Handle safety incidents in production AI systems",
            "duration_minutes": 360,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 63,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "interpretability-tools",
        "title": "Applied Interpretability",
        "description": "Build tools to understand and explain AI behavior",
        "learningObjectives": [
          "Master applied interpretability concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 11,
        "tier_id": "expert",
        "topics": [
          {
            "id": "mechanistic-interp",
            "title": "Mechanistic Interpretability Practice",
            "description": "Reverse engineer neural network behaviors",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 64,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "explainable-ai",
            "title": "Building Explainable AI Systems",
            "description": "Create AI systems that can explain their decisions",
            "duration_minutes": 600,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 65,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "debugging-tools",
            "title": "AI Debugging Frameworks",
            "description": "Tools and techniques for debugging AI behavior",
            "duration_minutes": 480,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 66,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "llm-psychology",
            "title": "LLM Psychology and Behavior Analysis",
            "description": "Understanding what we can learn about LLMs from conversational interaction",
            "duration_minutes": 600,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 67,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "chain-of-thought-analysis",
            "title": "Chain of Thought Analysis and Faithfulness",
            "description": "Analyzing and improving the reliability of reasoning traces in LLMs",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 68,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "governance-foundations",
        "title": "AI Governance Fundamentals",
        "description": "Understand policy, regulation, and institutional approaches to AI safety",
        "learningObjectives": [
          "Master ai governance fundamentals concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 12,
        "tier_id": "expert",
        "topics": [
          {
            "id": "policy-analysis",
            "title": "AI Policy Analysis",
            "description": "Analyze and evaluate AI safety policies",
            "duration_minutes": 480,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 69,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "institutional-design",
            "title": "Safety Institutions Design",
            "description": "Design institutions for AI safety oversight",
            "duration_minutes": 600,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 70,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "international-coordination",
            "title": "International AI Coordination",
            "description": "Understand global coordination challenges and solutions",
            "duration_minutes": 360,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 71,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "advanced-alignment-theory",
        "title": "Advanced Alignment Concepts",
        "description": "Theoretical foundations of AI alignment challenges",
        "learningObjectives": [
          "Master advanced alignment concepts concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 13,
        "tier_id": "expert",
        "topics": [
          {
            "id": "mesa-optimization",
            "title": "Mesa-Optimization & Inner Alignment",
            "description": "Understanding optimizers within optimizers",
            "duration_minutes": 600,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 72,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "deceptive-alignment",
            "title": "Deceptive Alignment & Treacherous Turns",
            "description": "When AI systems hide their true objectives",
            "duration_minutes": 480,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 73,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "amplification-debate",
            "title": "Iterated Amplification & AI Safety via Debate",
            "description": "Scalable oversight through recursive techniques",
            "duration_minutes": 600,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 74,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "embedded-agency",
            "title": "Embedded Agency & Decision Theory",
            "description": "AI agents embedded in their environment",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 75,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "goal-misgeneralization",
            "title": "Goal Misgeneralization & Capability Generalization",
            "description": "When models learn unintended goals that generalize",
            "duration_minutes": 360,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 76,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      }
    ]},
  {
    "id": "advanced",
    "title": "Advanced",
    "level": "advanced",
    "description": "Contribute original research and push the field forward",
    "estimatedDuration": "6 months",
    "position": 2,
    "modules": [
      {
        "id": "alignment-research",
        "title": "Alignment Research Methods",
        "description": "Conduct original research on AI alignment problems",
        "learningObjectives": [
          "Master alignment research methods concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 14,
        "tier_id": "expert",
        "topics": [
          {
            "id": "alignment-principles-deep",
            "title": "Deep Dive: Alignment Principles",
            "description": "Comprehensive exploration of AI alignment theory",
            "duration_minutes": 45,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 77,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          
          },
          {
            "id": "research-methodology",
            "title": "AI Safety Research Methodology",
            "description": "Learn to conduct rigorous safety research",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 78,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "alignment-theory",
            "title": "Advanced Alignment Theory",
            "description": "Deep dive into theoretical alignment challenges",
            "duration_minutes": 960,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 79,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "empirical-alignment",
            "title": "Empirical Alignment Research",
            "description": "Run experiments on alignment techniques including RLHF and Constitutional AI",
            "duration_minutes": 1200,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 80,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "cognitive-oversight",
            "title": "Cognitive Process Oversight",
            "description": "Monitoring AI systems based on their internal cognitive processes",
            "duration_minutes": 960,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 81,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "advanced-training",
        "title": "Advanced Training Techniques",
        "description": "State-of-the-art training methods and their safety implications",
        "learningObjectives": [
          "Master advanced training techniques concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 15,
        "tier_id": "expert",
        "topics": [
          {
            "id": "pretraining-scale",
            "title": "Pretraining at Scale",
            "description": "Large-scale pretraining methods and safety considerations",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 82,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "advanced-finetuning",
            "title": "Advanced Fine-tuning Techniques",
            "description": "State-of-the-art fine-tuning methods for safety",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 83,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "understanding-hallucinations",
            "title": "Understanding Hallucinations",
            "description": "Causes, detection, and mitigation of AI hallucinations",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 84,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "multi-agent-systems",
        "title": "Multi-Agent & Complex Systems",
        "description": "Safety in multi-agent environments and emergent behaviors",
        "learningObjectives": [
          "Master multi-agent & complex systems concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 16,
        "tier_id": "expert",
        "topics": [
          {
            "id": "multi-agent-coordination",
            "title": "Multi-Agent Coordination",
            "description": "Coordination challenges in multi-agent AI systems",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 85,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "emergent-behaviors",
            "title": "Emergent Agent Behaviors",
            "description": "Understanding and controlling emergent phenomena in agent systems",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 86,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "agent-ecosystems",
            "title": "Agent Ecosystems & Economics",
            "description": "Economic and ecosystem dynamics of AI agent populations",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 87,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "teacher-trainer-paradigms",
            "title": "Teacher vs Trainer Paradigms",
            "description": "Different approaches to training and aligning AI systems",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 88,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "advanced-interpretability",
        "title": "Cutting-Edge Interpretability",
        "description": "Push the boundaries of understanding AI systems",
        "learningObjectives": [
          "Master cutting-edge interpretability concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 17,
        "tier_id": "expert",
        "topics": [
          {
            "id": "circuit-discovery",
            "title": "Novel Circuit Discovery",
            "description": "Find and analyze new computational structures in models",
            "duration_minutes": 1200,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 89,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "scalable-interpretability",
            "title": "Scalable Interpretability Methods",
            "description": "Develop interpretability that works on large models",
            "duration_minutes": 960,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 90,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "safety-systems-architecture",
        "title": "Advanced Safety Systems Design",
        "description": "Architect large-scale AI safety systems and infrastructure",
        "learningObjectives": [
          "Master advanced safety systems design concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 18,
        "tier_id": "expert",
        "topics": [
          {
            "id": "distributed-safety",
            "title": "Distributed Safety Systems",
            "description": "Build safety systems that scale across multiple AI deployments",
            "duration_minutes": 1440,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 91,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "safety-infrastructure",
            "title": "Safety Infrastructure Design",
            "description": "Design infrastructure for safe AI deployment at scale",
            "duration_minutes": 1200,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 92,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "hardware-safety",
            "title": "Hardware-Level Safety Controls",
            "description": "Implement safety at the hardware and system level",
            "duration_minutes": 960,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 93,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "code-generation-safety",
            "title": "Safe AI Code Generation",
            "description": "Ensuring AI-generated code is safe, secure, and aligned with developer intent",
            "duration_minutes": 1080,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 94,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "advanced-governance",
        "title": "Advanced AI Governance & Policy",
        "description": "Shape AI policy and design governance frameworks",
        "learningObjectives": [
          "Master advanced ai governance & policy concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 19,
        "tier_id": "expert",
        "topics": [
          {
            "id": "policy-design",
            "title": "AI Policy Design & Analysis",
            "description": "Create and evaluate effective AI safety policies",
            "duration_minutes": 1200,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 95,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "key-figures-safety",
            "title": "Key Figures in AI Safety",
            "description": "Important researchers and their contributions",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 96,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "neel-nanda-work",
            "title": "Neel Nanda's Contributions",
            "description": "Mechanistic interpretability and research contributions",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 97,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "yoshua-bengio-work",
            "title": "Yoshua Bengio's Work",
            "description": "AI safety advocacy and research directions",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 98,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "constellation-org",
            "title": "Constellation Organization",
            "description": "Understanding Constellation's role in AI safety",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 99,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "far-fund",
            "title": "Fund for Alignment Research",
            "description": "FAR's mission and impact on AI safety research",
            "duration_minutes": 240,
            "difficulty": "intermediate",
            "module_id": "unknown",
            "position": 100,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "resource-allocation",
            "title": "Resource Allocation in AI Safety",
            "description": "Strategic allocation of resources for maximum safety impact",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 101,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "resource-tracking",
            "title": "Resource Tracking & Management",
            "description": "Tracking and managing AI safety research resources",
            "duration_minutes": 240,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 102,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "global-coordination",
            "title": "Global AI Governance",
            "description": "Lead international coordination efforts for AI safety",
            "duration_minutes": 1440,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 103,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "enforcement-design",
            "title": "Enforcement & Compliance Systems",
            "description": "Design systems for AI safety compliance and enforcement",
            "duration_minutes": 960,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 104,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      }
    ]},
  {
    "id": "expert",
    "title": "Expert",
    "level": "expert",
    "description": "Lead the field and train the next generation",
    "estimatedDuration": "Ongoing",
    "position": 3,
    "modules": [
      {
        "id": "research-leadership",
        "title": "Research Leadership",
        "description": "Lead research teams and set research agendas",
        "learningObjectives": [
          "Master research leadership concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 20,
        "tier_id": "expert",
        "topics": [
          {
            "id": "agenda-setting",
            "title": "Setting Research Agendas",
            "description": "Define impactful research directions for the field",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 105,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "team-building",
            "title": "Building Safety Teams",
            "description": "Recruit and develop AI safety talent",
            "duration_minutes": 600,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 106,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "field-building",
        "title": "Field Building",
        "description": "Grow and shape the AI safety ecosystem",
        "learningObjectives": [
          "Master field building concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 21,
        "tier_id": "expert",
        "topics": [
          {
            "id": "mentorship",
            "title": "Mentoring Next Generation",
            "description": "Develop the next wave of AI safety researchers",
            "duration_minutes": 480,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 107,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "institution-building",
            "title": "Building Safety Institutions",
            "description": "Create lasting organizations for AI safety",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 108,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      },
      {
        "id": "cutting-edge-research",
        "title": "Cutting-Edge Research Areas",
        "description": "Explore frontier research topics in AI safety",
        "learningObjectives": [
          "Master cutting-edge research areas concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "position": 22,
        "tier_id": "expert",
        "topics": [
          {
            "id": "formal-verification",
            "title": "Formal Verification for Neural Networks",
            "description": "Mathematical proofs of AI system properties",
            "duration_minutes": 1200,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 109,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "multi-agent-safety",
            "title": "Multi-Agent AI Safety",
            "description": "Safety in systems with multiple AI agents",
            "duration_minutes": 900,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 110,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "automated-ai-safety",
            "title": "Automated AI Safety Research",
            "description": "Using AI to accelerate safety research",
            "duration_minutes": 720,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 111,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          },
          {
            "id": "consciousness-moral-status",
            "title": "AI Consciousness & Moral Status",
            "description": "Philosophical questions about AI sentience and rights",
            "duration_minutes": 480,
            "difficulty": "advanced",
            "module_id": "unknown",
            "position": 112,
            "prerequisites": [],
            "learning_outcomes": [],
            "tags": []
          }
        ]
      }
    ]}
]
