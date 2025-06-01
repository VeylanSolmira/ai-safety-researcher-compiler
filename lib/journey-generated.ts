// Auto-generated from database - DO NOT EDIT DIRECTLY
// Generated on: 2025-06-01T13:14:16.077Z
// Run 'npm run db:export' to regenerate from database

import type { Tier } from './types'

export const journeyTiers: Tier[] = [
  {
    "id": "foundation",
    "title": "Foundation",
    "level": "foundation",
    "description": "Get your hands dirty with AI safety fundamentals",
    "estimatedDuration": "3 months",
    "modules": [
      {
        "id": "intro-module",
        "title": "AI Safety: Why It Matters",
        "description": "Understand the landscape of AI risks and your role in addressing them",
        "estimatedTime": "1 week",
        "learningObjectives": [
          "Master ai safety: why it matters concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "prerequisites-foundations",
            "title": "Prerequisites & Foundations",
            "description": "Core prerequisites, AI safety foundations, and find your research orientation",
            "estimatedTime": "2 hours",
            "difficulty": "beginner",
            "roadmapContentId": "prerequisites-topic",
            "hasJourneyExtras": true
          },
          {
            "id": "why-ai-safety",
            "title": "Why AI Safety Matters",
            "description": "Visceral examples of AI failures and near-misses",
            "estimatedTime": "2 hours",
            "difficulty": "beginner"
          },
          {
            "id": "risk-landscape",
            "title": "The AI Risk Landscape",
            "description": "Map of AI risks from bias to existential threats",
            "estimatedTime": "3 hours",
            "difficulty": "beginner",
            "roadmapContentId": "existential-risk-subtopic"
          },
          {
            "id": "choose-your-path",
            "title": "Your AI Safety Journey",
            "description": "Interactive tool to find your ideal learning path",
            "estimatedTime": "1 hour",
            "difficulty": "beginner"
          }
        ]
      },
      {
        "id": "practical-safety-basics",
        "title": "Practical AI Safety Basics",
        "description": "Hands-on introduction to finding and fixing AI vulnerabilities",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master practical ai safety basics concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "build-first-safety-tool",
            "title": "Build Your First Safety Tool",
            "description": "Create a simple AI output validator",
            "estimatedTime": "1 hour",
            "difficulty": "beginner"
          },
          {
            "id": "intro-red-teaming",
            "title": "Red Teaming Fundamentals",
            "description": "Learn to think like an attacker to build better defenses",
            "estimatedTime": "4 hours",
            "difficulty": "beginner",
            "roadmapContentId": "red-teaming-subtopic"
          },
          {
            "id": "basic-interpretability",
            "title": "Basic Interpretability",
            "description": "Peek inside AI models to understand their behavior",
            "estimatedTime": "5 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "interpretability-subtopic"
          },
          {
            "id": "prompt-injection-attacks",
            "title": "Prompt Injection Attacks",
            "description": "Understand and defend against prompt injection",
            "estimatedTime": "20 minutes",
            "difficulty": "beginner",
            "roadmapContentId": "prompt-injection-subtopic"
          },
          {
            "id": "jailbreak-techniques",
            "title": "Jailbreak Techniques",
            "description": "Learn about AI jailbreaking methods and defenses",
            "estimatedTime": "20 minutes",
            "difficulty": "beginner",
            "roadmapContentId": "jailbreak-subtopic"
          },
          {
            "id": "safety-evaluation-101",
            "title": "Safety Evaluation Methods",
            "description": "Build your first safety benchmark",
            "estimatedTime": "6 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "safety-benchmarks-subtopic"
          }
        ]
      },
      {
        "id": "ml-fundamentals-safety",
        "title": "Essential ML for Safety",
        "description": "Just enough ML to be dangerous (in a good way)",
        "estimatedTime": "3 weeks",
        "learningObjectives": [
          "Master essential ml for safety concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "how-llms-work",
            "title": "How LLMs Actually Work",
            "description": "Demystify language models without the heavy math",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "how-llms-trained-subtopic"
          },
          {
            "id": "training-failure-modes",
            "title": "When Training Goes Wrong",
            "description": "Common failure modes and how to spot them",
            "estimatedTime": "3 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "safety-capability-balance",
            "title": "The Safety-Capability Balance",
            "description": "Understanding the fundamental tension in AI development",
            "estimatedTime": "2 hours",
            "difficulty": "beginner",
            "roadmapContentId": "safety-capability-balance-subtopic"
          }
        ]
      },
      {
        "id": "governance-intro",
        "title": "AI Safety Policy & Ethics Primer",
        "description": "Introduction to governance, ethics, and policy approaches in AI safety",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master ai safety policy & ethics primer concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "ethics-fundamentals",
            "title": "Ethics in AI Development",
            "description": "Core ethical principles for safe AI development",
            "estimatedTime": "3 hours",
            "difficulty": "beginner",
            "roadmapContentId": "ethics-subtopic"
          },
          {
            "id": "policy-landscape",
            "title": "Global AI Policy Landscape",
            "description": "Overview of AI regulations and policy initiatives worldwide",
            "estimatedTime": "4 hours",
            "difficulty": "beginner",
            "roadmapContentId": "national-ai-strategies-subtopic"
          },
          {
            "id": "governance-basics",
            "title": "AI Governance Fundamentals",
            "description": "Introduction to institutional approaches to AI safety",
            "estimatedTime": "3 hours",
            "difficulty": "beginner",
            "roadmapContentId": "safety-oversight-bodies-subtopic"
          },
          {
            "id": "ai-welfare-patienthood",
            "title": "AI Welfare & Patienthood",
            "description": "Exploring moral consideration for AI systems and digital minds",
            "estimatedTime": "3 hours",
            "difficulty": "beginner"
          }
        ]
      },
      {
        "id": "ai-risks-fundamentals",
        "title": "Understanding AI Risks",
        "description": "Deep dive into AI security threats and systemic risks",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master understanding ai risks concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "data-poisoning",
            "title": "Data Poisoning",
            "description": "How malicious data can corrupt AI systems",
            "estimatedTime": "20 minutes",
            "difficulty": "beginner",
            "roadmapContentId": "data-poisoning-subtopic"
          },
          {
            "id": "control-problem",
            "title": "The Control Problem",
            "description": "Understanding how to maintain control over advanced AI systems",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "control-subtopic"
          },
          {
            "id": "agency-in-ai",
            "title": "AI Agency and Autonomy",
            "description": "Exploring goal-directed behavior and autonomous decision-making in AI systems",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "agency-subtopic"
          },
          {
            "id": "situational-awareness",
            "title": "AI Situational Awareness",
            "description": "When AI systems understand their environment, context, and impact",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "situational-awareness-subtopic"
          },
          {
            "id": "impenetrability",
            "title": "The Impenetrability Problem",
            "description": "Challenges in understanding and inspecting advanced AI systems",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "impenetrability-subtopic"
          },
          {
            "id": "ai-computer-security",
            "title": "AI & Computer Security",
            "description": "Intersection of AI and traditional security",
            "estimatedTime": "30 minutes",
            "difficulty": "intermediate",
            "roadmapContentId": "computer-security-subtopic"
          },
          {
            "id": "risk-assessment-intro",
            "title": "AI Risk Assessment",
            "description": "Learn to identify and evaluate AI risks",
            "estimatedTime": "2 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "risk-assessment-methodologies-subtopic"
          }
        ]
      },
      {
        "id": "math-foundations",
        "title": "Mathematical & Technical Foundations",
        "description": "Essential mathematics and programming for AI safety research",
        "estimatedTime": "8 weeks",
        "learningObjectives": [
          "Master mathematical & technical foundations concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "linear-algebra-ml",
            "title": "Linear Algebra for Machine Learning",
            "description": "Vectors, matrices, eigenvalues, and transformations",
            "estimatedTime": "10 hours",
            "difficulty": "beginner"
          },
          {
            "id": "types-of-ai-systems",
            "title": "Types of AI Systems Overview",
            "description": "Survey of different AI architectures and their safety implications",
            "estimatedTime": "4 hours",
            "difficulty": "beginner",
            "roadmapContentId": "types-ai-systems-subtopic"
          },
          {
            "id": "understanding-llms",
            "title": "Understanding Large Language Models",
            "description": "Deep dive into how LLMs work and their unique safety considerations",
            "estimatedTime": "4 hours",
            "difficulty": "beginner",
            "roadmapContentId": "llms-subtopic"
          },
          {
            "id": "how-llms-trained",
            "title": "How LLMs are Trained",
            "description": "The training process, data requirements, and safety implications",
            "estimatedTime": "4 hours",
            "difficulty": "beginner",
            "roadmapContentId": "how-llms-trained-subtopic"
          },
          {
            "id": "calculus-optimization",
            "title": "Calculus & Optimization Theory",
            "description": "Derivatives, gradients, and optimization algorithms",
            "estimatedTime": "10 hours",
            "difficulty": "beginner"
          },
          {
            "id": "probability-statistics",
            "title": "Probability Theory & Statistics",
            "description": "Distributions, inference, and Bayesian thinking for AI safety",
            "estimatedTime": "10 hours",
            "difficulty": "beginner"
          },
          {
            "id": "python-ml-libraries",
            "title": "Python & ML Libraries for Safety Research",
            "description": "NumPy, PyTorch, and essential programming skills",
            "estimatedTime": "8 hours",
            "difficulty": "beginner"
          }
        ]
      },
      {
        "id": "ml-fundamentals-primer",
        "title": "Machine Learning Fundamentals",
        "description": "Core ML concepts with safety considerations",
        "estimatedTime": "6 weeks",
        "learningObjectives": [
          "Master machine learning fundamentals concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "ml-paradigms",
            "title": "ML Learning Paradigms",
            "description": "Supervised, unsupervised, and reinforcement learning basics",
            "estimatedTime": "6 hours",
            "difficulty": "beginner"
          },
          {
            "id": "classic-ml-algorithms",
            "title": "Classical ML Algorithms",
            "description": "Linear regression, decision trees, SVMs with safety lens",
            "estimatedTime": "10 hours",
            "difficulty": "beginner"
          },
          {
            "id": "neural-networks-intro",
            "title": "Introduction to Neural Networks",
            "description": "Perceptrons, backpropagation, and basic architectures",
            "estimatedTime": "10 hours",
            "difficulty": "beginner"
          },
          {
            "id": "ml-failure-modes",
            "title": "Common ML Failure Modes",
            "description": "Overfitting, distribution shift, and safety implications",
            "estimatedTime": "6 hours",
            "difficulty": "beginner"
          }
        ]
      }
    ],
    "type": "linear",
    "prerequisites": [],
    "unlocks": [],
    "skillsGained": [],
    "careerRelevance": []
  },
  {
    "id": "intermediate",
    "title": "Intermediate",
    "level": "intermediate",
    "description": "Build real safety tools and contribute to the field",
    "estimatedDuration": "6 months",
    "modules": [
      {
        "id": "advanced-red-teaming",
        "title": "Advanced Red Teaming & Adversarial ML",
        "description": "Master sophisticated attack techniques and defense strategies",
        "estimatedTime": "4 weeks",
        "learningObjectives": [
          "Master advanced red teaming & adversarial ml concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "automated-red-teaming",
            "title": "Automated Red Teaming Systems",
            "description": "Build systems that automatically discover vulnerabilities",
            "estimatedTime": "8 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "red-teaming-protocols-subtopic"
          },
          {
            "id": "ai-systems-security",
            "title": "AI Systems Security",
            "description": "Security considerations for deployed AI systems",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "computer-security-subtopic"
          },
          {
            "id": "disrupting-safety-research",
            "title": "Disrupting AI Safety Research",
            "description": "Understanding and preventing attacks on safety research",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "disrupting-research-subtopic"
          },
          {
            "id": "prompt-injection-defense",
            "title": "Prompt Injection & Defense",
            "description": "Understanding and defending against prompt injection attacks",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "prompt-injection-subtopic"
          },
          {
            "id": "adversarial-robustness",
            "title": "Adversarial Robustness Techniques",
            "description": "Defense mechanisms against adversarial attacks",
            "estimatedTime": "10 hours",
            "difficulty": "advanced",
            "roadmapContentId": "adversarial-meta-learning-subtopic"
          },
          {
            "id": "multimodal-attacks",
            "title": "Multimodal Attack Vectors",
            "description": "Attacking AI systems through combined text, image, and audio",
            "estimatedTime": "12 hours",
            "difficulty": "advanced"
          },
          {
            "id": "model-organisms",
            "title": "Model Organisms of Misalignment",
            "description": "Creating and studying controlled examples of misaligned AI behavior",
            "estimatedTime": "14 hours",
            "difficulty": "advanced"
          },
          {
            "id": "data-poisoning-defense",
            "title": "Data Poisoning & Defense",
            "description": "Understanding and preventing data poisoning attacks on AI systems",
            "estimatedTime": "2 hours",
            "difficulty": "advanced",
            "roadmapContentId": "data-poisoning-subtopic"
          }
        ]
      },
      {
        "id": "research-methods",
        "title": "Research Methods",
        "description": "Essential research skills for AI safety work",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master research methods concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "problem-decomposition",
            "title": "Problem Decomposition & Scoping",
            "description": "Breaking down complex AI safety problems into tractable research questions",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "problem-decomposition-scoping-subtopic"
          },
          {
            "id": "iterative-research",
            "title": "Iterative Research Design",
            "description": "Developing and refining research approaches through iteration",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "iterative-research-design-subtopic"
          },
          {
            "id": "research-project-mgmt",
            "title": "Research Project Management",
            "description": "Managing AI safety research projects effectively",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "research-project-management-subtopic"
          },
          {
            "id": "core-methodology",
            "title": "Core Research Methodology",
            "description": "Fundamental research methods for AI safety",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "core-methodology-subtopic"
          }
        ]
      },
      {
        "id": "ai-agents-tool-use",
        "title": "AI Agents & Tool Use",
        "description": "Building and evaluating safe autonomous agents",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master ai agents & tool use concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "agent-architectures",
            "title": "Agent Architectures & Design",
            "description": "Modern agent architectures and their safety implications",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "ai-agents-subtopic"
          },
          {
            "id": "agent-safety-fundamentals",
            "title": "Agent Safety Fundamentals",
            "description": "Core safety principles for autonomous agents",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "agent-evaluation-testing",
            "title": "Agent Evaluation & Testing",
            "description": "Methods for evaluating agent behavior and safety",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "human-agent-interaction",
            "title": "Human-Agent Interaction",
            "description": "Designing safe and effective human-AI agent collaboration",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate"
          }
        ]
      },
      {
        "id": "testing-evaluation",
        "title": "Testing & Evaluation",
        "description": "Comprehensive testing methods for AI safety",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master testing & evaluation concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "white-box-testing",
            "title": "White Box Testing Methods",
            "description": "Testing AI systems with full access to internals",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "white-box-subtopic"
          },
          {
            "id": "black-box-testing",
            "title": "Black Box Testing Methods",
            "description": "Testing AI systems without internal access",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "black-box-subtopic"
          },
          {
            "id": "grey-box-testing",
            "title": "Grey Box Testing Methods",
            "description": "Hybrid testing approaches with partial system knowledge",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "grey-box-subtopic"
          },
          {
            "id": "transparency-systems",
            "title": "Transparency in AI Systems",
            "description": "Building and evaluating transparent AI systems",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "transparency-subtopic"
          }
        ]
      },
      {
        "id": "safety-engineering",
        "title": "Production Safety Engineering",
        "description": "Build and deploy safety systems for real-world AI applications",
        "estimatedTime": "6 weeks",
        "learningObjectives": [
          "Master production safety engineering concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "safety-monitoring",
            "title": "Real-time Safety Monitoring",
            "description": "Monitor AI systems for safety violations in production",
            "estimatedTime": "10 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "resource-tracking-subtopic"
          },
          {
            "id": "containerization-research",
            "title": "Containerization for Research",
            "description": "Docker and container orchestration for reproducible AI research",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "docker-subtopic"
          },
          {
            "id": "advanced-git-research",
            "title": "Advanced Git for Research",
            "description": "Version control best practices for collaborative AI safety research",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "version-control-subtopic"
          },
          {
            "id": "distributed-training",
            "title": "Distributed Training Systems",
            "description": "Scaling AI training across multiple machines safely",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "distributed-systems-subtopic"
          },
          {
            "id": "deployment-gates",
            "title": "Deployment Gates & Safety Checks",
            "description": "Implementing safety gates before AI deployment",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "deployment-gates-subtopic"
          },
          {
            "id": "training-run-monitoring",
            "title": "Training Run Monitoring",
            "description": "Monitoring AI training for safety and alignment",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "training-run-monitoring-subtopic"
          },
          {
            "id": "content-filtering",
            "title": "Advanced Content Filtering",
            "description": "Build sophisticated content moderation systems",
            "estimatedTime": "12 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "safety-apis",
            "title": "Safety API Design",
            "description": "Design and implement safety-first APIs",
            "estimatedTime": "8 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "api-access-controls-subtopic"
          },
          {
            "id": "incident-response",
            "title": "AI Incident Response",
            "description": "Handle safety incidents in production AI systems",
            "estimatedTime": "6 hours",
            "difficulty": "intermediate"
          }
        ]
      },
      {
        "id": "interpretability-tools",
        "title": "Applied Interpretability",
        "description": "Build tools to understand and explain AI behavior",
        "estimatedTime": "5 weeks",
        "learningObjectives": [
          "Master applied interpretability concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "mechanistic-interp",
            "title": "Mechanistic Interpretability Practice",
            "description": "Reverse engineer neural network behaviors",
            "estimatedTime": "12 hours",
            "difficulty": "advanced",
            "roadmapContentId": "interpretability-subtopic"
          },
          {
            "id": "explainable-ai",
            "title": "Building Explainable AI Systems",
            "description": "Create AI systems that can explain their decisions",
            "estimatedTime": "10 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "explainability-subtopic"
          },
          {
            "id": "debugging-tools",
            "title": "AI Debugging Frameworks",
            "description": "Tools and techniques for debugging AI behavior",
            "estimatedTime": "8 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "llm-psychology",
            "title": "LLM Psychology and Behavior Analysis",
            "description": "Understanding what we can learn about LLMs from conversational interaction",
            "estimatedTime": "10 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "chain-of-thought-analysis",
            "title": "Chain of Thought Analysis and Faithfulness",
            "description": "Analyzing and improving the reliability of reasoning traces in LLMs",
            "estimatedTime": "12 hours",
            "difficulty": "advanced"
          }
        ]
      },
      {
        "id": "governance-foundations",
        "title": "AI Governance Fundamentals",
        "description": "Understand policy, regulation, and institutional approaches to AI safety",
        "estimatedTime": "4 weeks",
        "learningObjectives": [
          "Master ai governance fundamentals concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "policy-analysis",
            "title": "AI Policy Analysis",
            "description": "Analyze and evaluate AI safety policies",
            "estimatedTime": "8 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "regulatory-approaches-subtopic"
          },
          {
            "id": "institutional-design",
            "title": "Safety Institutions Design",
            "description": "Design institutions for AI safety oversight",
            "estimatedTime": "10 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "safety-oversight-bodies-subtopic"
          },
          {
            "id": "international-coordination",
            "title": "International AI Coordination",
            "description": "Understand global coordination challenges and solutions",
            "estimatedTime": "6 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "international-coordination-subtopic"
          }
        ]
      },
      {
        "id": "advanced-alignment-theory",
        "title": "Advanced Alignment Concepts",
        "description": "Theoretical foundations of AI alignment challenges",
        "estimatedTime": "8 weeks",
        "learningObjectives": [
          "Master advanced alignment concepts concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "mesa-optimization",
            "title": "Mesa-Optimization & Inner Alignment",
            "description": "Understanding optimizers within optimizers",
            "estimatedTime": "10 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "deceptive-alignment",
            "title": "Deceptive Alignment & Treacherous Turns",
            "description": "When AI systems hide their true objectives",
            "estimatedTime": "8 hours",
            "difficulty": "intermediate"
          },
          {
            "id": "amplification-debate",
            "title": "Iterated Amplification & AI Safety via Debate",
            "description": "Scalable oversight through recursive techniques",
            "estimatedTime": "10 hours",
            "difficulty": "advanced"
          },
          {
            "id": "embedded-agency",
            "title": "Embedded Agency & Decision Theory",
            "description": "AI agents embedded in their environment",
            "estimatedTime": "12 hours",
            "difficulty": "advanced"
          },
          {
            "id": "goal-misgeneralization",
            "title": "Goal Misgeneralization & Capability Generalization",
            "description": "When models learn unintended goals that generalize",
            "estimatedTime": "6 hours",
            "difficulty": "intermediate"
          }
        ]
      }
    ],
    "type": "open-world",
    "prerequisites": [],
    "unlocks": [],
    "skillsGained": [],
    "careerRelevance": []
  },
  {
    "id": "advanced",
    "title": "Advanced",
    "level": "advanced",
    "description": "Contribute original research and push the field forward",
    "estimatedDuration": "6 months",
    "modules": [
      {
        "id": "alignment-research",
        "title": "Alignment Research Methods",
        "description": "Conduct original research on AI alignment problems",
        "estimatedTime": "8 weeks",
        "learningObjectives": [
          "Master alignment research methods concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "alignment-principles-deep",
            "title": "Deep Dive: Alignment Principles",
            "description": "Comprehensive exploration of AI alignment theory",
            "estimatedTime": "45 minutes",
            "difficulty": "advanced",
            "hasInteractiveTransition": true
          },
          {
            "id": "research-methodology",
            "title": "AI Safety Research Methodology",
            "description": "Learn to conduct rigorous safety research",
            "estimatedTime": "12 hours",
            "difficulty": "advanced",
            "roadmapContentId": "core-methodology-subtopic"
          },
          {
            "id": "alignment-theory",
            "title": "Advanced Alignment Theory",
            "description": "Deep dive into theoretical alignment challenges",
            "estimatedTime": "16 hours",
            "difficulty": "advanced",
            "roadmapContentId": "alignment-subtopic"
          },
          {
            "id": "empirical-alignment",
            "title": "Empirical Alignment Research",
            "description": "Run experiments on alignment techniques including RLHF and Constitutional AI",
            "estimatedTime": "20 hours",
            "difficulty": "advanced"
          },
          {
            "id": "cognitive-oversight",
            "title": "Cognitive Process Oversight",
            "description": "Monitoring AI systems based on their internal cognitive processes",
            "estimatedTime": "16 hours",
            "difficulty": "advanced"
          }
        ]
      },
      {
        "id": "advanced-training",
        "title": "Advanced Training Techniques",
        "description": "State-of-the-art training methods and their safety implications",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master advanced training techniques concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "pretraining-scale",
            "title": "Pretraining at Scale",
            "description": "Large-scale pretraining methods and safety considerations",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "pretraining-subtopic"
          },
          {
            "id": "advanced-finetuning",
            "title": "Advanced Fine-tuning Techniques",
            "description": "State-of-the-art fine-tuning methods for safety",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "fine-tuning-subtopic"
          },
          {
            "id": "understanding-hallucinations",
            "title": "Understanding Hallucinations",
            "description": "Causes, detection, and mitigation of AI hallucinations",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "hallucinations-subtopic"
          }
        ]
      },
      {
        "id": "multi-agent-systems",
        "title": "Multi-Agent & Complex Systems",
        "description": "Safety in multi-agent environments and emergent behaviors",
        "estimatedTime": "2 weeks",
        "learningObjectives": [
          "Master multi-agent & complex systems concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "multi-agent-coordination",
            "title": "Multi-Agent Coordination",
            "description": "Coordination challenges in multi-agent AI systems",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "multi-agent-subtopic"
          },
          {
            "id": "emergent-behaviors",
            "title": "Emergent Agent Behaviors",
            "description": "Understanding and controlling emergent phenomena in agent systems",
            "estimatedTime": "4 hours",
            "difficulty": "advanced"
          },
          {
            "id": "agent-ecosystems",
            "title": "Agent Ecosystems & Economics",
            "description": "Economic and ecosystem dynamics of AI agent populations",
            "estimatedTime": "4 hours",
            "difficulty": "advanced"
          },
          {
            "id": "teacher-trainer-paradigms",
            "title": "Teacher vs Trainer Paradigms",
            "description": "Different approaches to training and aligning AI systems",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "teacher-trainer-subtopic"
          }
        ]
      },
      {
        "id": "advanced-interpretability",
        "title": "Cutting-Edge Interpretability",
        "description": "Push the boundaries of understanding AI systems",
        "estimatedTime": "8 weeks",
        "learningObjectives": [
          "Master cutting-edge interpretability concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "circuit-discovery",
            "title": "Novel Circuit Discovery",
            "description": "Find and analyze new computational structures in models",
            "estimatedTime": "20 hours",
            "difficulty": "advanced"
          },
          {
            "id": "scalable-interpretability",
            "title": "Scalable Interpretability Methods",
            "description": "Develop interpretability that works on large models",
            "estimatedTime": "16 hours",
            "difficulty": "advanced"
          }
        ]
      },
      {
        "id": "safety-systems-architecture",
        "title": "Advanced Safety Systems Design",
        "description": "Architect large-scale AI safety systems and infrastructure",
        "estimatedTime": "10 weeks",
        "learningObjectives": [
          "Master advanced safety systems design concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "distributed-safety",
            "title": "Distributed Safety Systems",
            "description": "Build safety systems that scale across multiple AI deployments",
            "estimatedTime": "24 hours",
            "difficulty": "advanced",
            "roadmapContentId": "distributed-systems-subtopic"
          },
          {
            "id": "safety-infrastructure",
            "title": "Safety Infrastructure Design",
            "description": "Design infrastructure for safe AI deployment at scale",
            "estimatedTime": "20 hours",
            "difficulty": "advanced",
            "roadmapContentId": "deployment-gates-subtopic"
          },
          {
            "id": "hardware-safety",
            "title": "Hardware-Level Safety Controls",
            "description": "Implement safety at the hardware and system level",
            "estimatedTime": "16 hours",
            "difficulty": "advanced",
            "roadmapContentId": "hardware-controls-subtopic"
          },
          {
            "id": "code-generation-safety",
            "title": "Safe AI Code Generation",
            "description": "Ensuring AI-generated code is safe, secure, and aligned with developer intent",
            "estimatedTime": "18 hours",
            "difficulty": "advanced"
          }
        ]
      },
      {
        "id": "advanced-governance",
        "title": "Advanced AI Governance & Policy",
        "description": "Shape AI policy and design governance frameworks",
        "estimatedTime": "8 weeks",
        "learningObjectives": [
          "Master advanced ai governance & policy concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "policy-design",
            "title": "AI Policy Design & Analysis",
            "description": "Create and evaluate effective AI safety policies",
            "estimatedTime": "20 hours",
            "difficulty": "advanced",
            "roadmapContentId": "regulatory-approaches-subtopic"
          },
          {
            "id": "key-figures-safety",
            "title": "Key Figures in AI Safety",
            "description": "Important researchers and their contributions",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "key-figures-subtopic"
          },
          {
            "id": "neel-nanda-work",
            "title": "Neel Nanda's Contributions",
            "description": "Mechanistic interpretability and research contributions",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "neel-nanda-subtopic"
          },
          {
            "id": "yoshua-bengio-work",
            "title": "Yoshua Bengio's Work",
            "description": "AI safety advocacy and research directions",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "yoshua-bengio-subtopic"
          },
          {
            "id": "constellation-org",
            "title": "Constellation Organization",
            "description": "Understanding Constellation's role in AI safety",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "constellation-subtopic"
          },
          {
            "id": "far-fund",
            "title": "Fund for Alignment Research",
            "description": "FAR's mission and impact on AI safety research",
            "estimatedTime": "4 hours",
            "difficulty": "intermediate",
            "roadmapContentId": "far-subtopic"
          },
          {
            "id": "resource-allocation",
            "title": "Resource Allocation in AI Safety",
            "description": "Strategic allocation of resources for maximum safety impact",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "resource-allocation-subtopic"
          },
          {
            "id": "resource-tracking",
            "title": "Resource Tracking & Management",
            "description": "Tracking and managing AI safety research resources",
            "estimatedTime": "4 hours",
            "difficulty": "advanced",
            "roadmapContentId": "resource-tracking-subtopic"
          },
          {
            "id": "global-coordination",
            "title": "Global AI Governance",
            "description": "Lead international coordination efforts for AI safety",
            "estimatedTime": "24 hours",
            "difficulty": "advanced",
            "roadmapContentId": "international-coordination-subtopic"
          },
          {
            "id": "enforcement-design",
            "title": "Enforcement & Compliance Systems",
            "description": "Design systems for AI safety compliance and enforcement",
            "estimatedTime": "16 hours",
            "difficulty": "advanced",
            "roadmapContentId": "enforcement-mechanisms-subtopic"
          }
        ]
      }
    ],
    "type": "open-world",
    "prerequisites": [],
    "unlocks": [],
    "skillsGained": [],
    "careerRelevance": []
  },
  {
    "id": "expert",
    "title": "Expert",
    "level": "expert",
    "description": "Lead the field and train the next generation",
    "estimatedDuration": "Ongoing",
    "modules": [
      {
        "id": "research-leadership",
        "title": "Research Leadership",
        "description": "Lead research teams and set research agendas",
        "estimatedTime": "Ongoing",
        "learningObjectives": [
          "Master research leadership concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "agenda-setting",
            "title": "Setting Research Agendas",
            "description": "Define impactful research directions for the field",
            "estimatedTime": "12 hours",
            "difficulty": "advanced"
          },
          {
            "id": "team-building",
            "title": "Building Safety Teams",
            "description": "Recruit and develop AI safety talent",
            "estimatedTime": "10 hours",
            "difficulty": "advanced"
          }
        ]
      },
      {
        "id": "field-building",
        "title": "Field Building",
        "description": "Grow and shape the AI safety ecosystem",
        "estimatedTime": "Ongoing",
        "learningObjectives": [
          "Master field building concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "mentorship",
            "title": "Mentoring Next Generation",
            "description": "Develop the next wave of AI safety researchers",
            "estimatedTime": "8 hours",
            "difficulty": "advanced"
          },
          {
            "id": "institution-building",
            "title": "Building Safety Institutions",
            "description": "Create lasting organizations for AI safety",
            "estimatedTime": "12 hours",
            "difficulty": "advanced"
          }
        ]
      },
      {
        "id": "cutting-edge-research",
        "title": "Cutting-Edge Research Areas",
        "description": "Explore frontier research topics in AI safety",
        "estimatedTime": "Ongoing",
        "learningObjectives": [
          "Master cutting-edge research areas concepts",
          "Apply knowledge to real-world scenarios",
          "Build practical implementations"
        ],
        "topics": [
          {
            "id": "formal-verification",
            "title": "Formal Verification for Neural Networks",
            "description": "Mathematical proofs of AI system properties",
            "estimatedTime": "20 hours",
            "difficulty": "advanced"
          },
          {
            "id": "multi-agent-safety",
            "title": "Multi-Agent AI Safety",
            "description": "Safety in systems with multiple AI agents",
            "estimatedTime": "15 hours",
            "difficulty": "advanced"
          },
          {
            "id": "automated-ai-safety",
            "title": "Automated AI Safety Research",
            "description": "Using AI to accelerate safety research",
            "estimatedTime": "12 hours",
            "difficulty": "advanced"
          },
          {
            "id": "consciousness-moral-status",
            "title": "AI Consciousness & Moral Status",
            "description": "Philosophical questions about AI sentience and rights",
            "estimatedTime": "8 hours",
            "difficulty": "advanced"
          }
        ]
      }
    ],
    "type": "open-world",
    "prerequisites": [],
    "unlocks": [],
    "skillsGained": [],
    "careerRelevance": []
  }
]
