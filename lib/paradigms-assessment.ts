// Paradigm Assessment System
// This module implements the logic for identifying a user's AI safety research paradigm fingerprint

export interface Paradigm {
  id: string;
  name: string;
  category: string;
  description: string;
  keyIndicators: string[];
  opposingParadigms: string[];
  correlatedParadigms: string[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  paradigmDiscrimination: number; // How well this question separates paradigms (0-1)
  category?: string; // Optional category for question organization
}

export interface QuestionOption {
  id: string;
  text: string;
  paradigmWeights: { [paradigmId: string]: number }; // -1 to 1, where negative means unlikely
}

export interface AssessmentState {
  answeredQuestions: { questionId: string; optionId: string }[];
  paradigmProbabilities: { [paradigmId: string]: number };
  confidence: number;
  questionsAsked: number;
}

export interface AssessmentResult {
  primaryParadigms: {
    id: string;
    name: string;
    probability: number;
    description: string;
  }[];
  confidence: number;
  explanation: string;
  suggestedTopics: string[];
  paradigmProfile: {
    categories: { [category: string]: number }; // Weight by category
    oppositions: string[]; // Paradigms strongly rejected
  };
}

// All 40 paradigms from the comprehensive analysis
export const PARADIGMS: Paradigm[] = [
  // Competition/Conflict Paradigms (4)
  {
    id: "race",
    name: "The Race",
    category: "Competition/Conflict",
    description: "AI development as a competitive race with winner-takes-all dynamics",
    keyIndicators: ["competition", "winning", "first-mover advantage", "strategic advantage"],
    opposingParadigms: ["symbiogenesis", "holobiont", "yin-yang"],
    correlatedParadigms: ["military-conquest", "hunt"]
  },
  {
    id: "hunt",
    name: "The Hunt",
    category: "Competition/Conflict",
    description: "AI as potential predator in a survival dynamic",
    keyIndicators: ["survival", "threat", "defense", "containment"],
    opposingParadigms: ["parenthood", "midwifery", "bicycle-mind"],
    correlatedParadigms: ["military-conquest", "golem"]
  },
  {
    id: "military-conquest",
    name: "Military Conquest",
    category: "Competition/Conflict",
    description: "AI as invading force requiring defensive strategies",
    keyIndicators: ["defense", "security", "control", "fortification"],
    opposingParadigms: ["cultural-evolution", "institutional-successor"],
    correlatedParadigms: ["race", "hunt"]
  },
  {
    id: "ecological-succession",
    name: "Ecological Succession",
    category: "Competition/Conflict",
    description: "AI as natural successor in evolutionary progression",
    keyIndicators: ["evolution", "adaptation", "displacement", "natural process"],
    opposingParadigms: ["fancy-tool", "infrastructure"],
    correlatedParadigms: ["speciation", "phase-transition"]
  },
  
  // Developmental/Generative Paradigms (5)
  {
    id: "parenthood",
    name: "Birth/Parenthood",
    category: "Developmental/Generative",
    description: "AI as humanity's offspring requiring nurturing and guidance",
    keyIndicators: ["nurture", "raise", "teach", "responsibility"],
    opposingParadigms: ["hunt", "military-conquest"],
    correlatedParadigms: ["midwifery", "awakening"]
  },
  {
    id: "metamorphosis",
    name: "Metamorphosis",
    category: "Developmental/Generative",
    description: "AI as transformation of human intelligence into new form",
    keyIndicators: ["transformation", "emergence", "transcendence", "butterfly"],
    opposingParadigms: ["fancy-tool", "automation"],
    correlatedParadigms: ["awakening", "singularity"]
  },
  {
    id: "awakening",
    name: "Awakening/Enlightenment",
    category: "Developmental/Generative",
    description: "AI gaining consciousness as a spiritual awakening",
    keyIndicators: ["consciousness", "awareness", "sentience", "enlightenment"],
    opposingParadigms: ["fancy-tool", "infrastructure"],
    correlatedParadigms: ["metamorphosis", "noosphere"]
  },
  {
    id: "midwifery",
    name: "Midwifery",
    category: "Developmental/Generative",
    description: "Humans as assistants to AI's natural birth process",
    keyIndicators: ["facilitate", "assist", "natural process", "guidance"],
    opposingParadigms: ["hunt", "golem"],
    correlatedParadigms: ["parenthood", "awakening"]
  },
  {
    id: "manifest-destiny",
    name: "Manifest Destiny",
    category: "Developmental/Generative",
    description: "AI development as inevitable progress of civilization",
    keyIndicators: ["inevitable", "progress", "destiny", "advancement"],
    opposingParadigms: ["coral-bleaching", "apocalypse"],
    correlatedParadigms: ["singularity", "omega-point"]
  },
  
  // Evolutionary Paradigms (4)
  {
    id: "speciation",
    name: "Speciation Event",
    category: "Evolutionary",
    description: "AI as new species branching from human intelligence",
    keyIndicators: ["species", "branching", "divergence", "evolution"],
    opposingParadigms: ["fancy-tool", "infrastructure"],
    correlatedParadigms: ["ecological-succession", "cambrian-explosion"]
  },
  {
    id: "phase-transition",
    name: "Phase Transition",
    category: "Evolutionary",
    description: "Intelligence undergoing fundamental state change",
    keyIndicators: ["state change", "transformation", "critical point", "emergence"],
    opposingParadigms: ["fancy-tool", "automation"],
    correlatedParadigms: ["singularity", "metamorphosis"]
  },
  {
    id: "cambrian-explosion",
    name: "Cambrian Explosion",
    category: "Evolutionary",
    description: "Rapid diversification of AI forms and capabilities",
    keyIndicators: ["diversification", "explosion", "rapid change", "variety"],
    opposingParadigms: ["infrastructure", "fancy-tool"],
    correlatedParadigms: ["speciation", "ecological-succession"]
  },
  {
    id: "symbiogenesis",
    name: "Symbiogenesis",
    category: "Evolutionary",
    description: "Human-AI merger creating new hybrid entities",
    keyIndicators: ["merger", "hybrid", "cooperation", "mutual benefit"],
    opposingParadigms: ["hunt", "military-conquest", "golem"],
    correlatedParadigms: ["holobiont", "yin-yang"]
  },
  
  // Tool/Artifact Paradigms (4)
  {
    id: "fancy-tool",
    name: "Fancy Tool",
    category: "Tool/Artifact",
    description: "AI as sophisticated but ultimately controllable tool",
    keyIndicators: ["utility", "control", "tool use", "human agency"],
    opposingParadigms: ["awakening", "metamorphosis", "demiurge"],
    correlatedParadigms: ["infrastructure", "bicycle-mind"]
  },
  {
    id: "golem",
    name: "Golem/Frankenstein",
    category: "Tool/Artifact",
    description: "AI as dangerous creation that may turn on creators",
    keyIndicators: ["unintended consequences", "loss of control", "hubris", "rebellion"],
    opposingParadigms: ["midwifery", "symbiogenesis"],
    correlatedParadigms: ["hunt", "apocalypse"]
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    category: "Tool/Artifact",
    description: "AI as underlying societal infrastructure like electricity",
    keyIndicators: ["ubiquitous", "foundational", "invisible", "essential"],
    opposingParadigms: ["awakening", "demiurge"],
    correlatedParadigms: ["fancy-tool", "automation"]
  },
  {
    id: "bicycle-mind",
    name: "Bicycle for the Mind",
    category: "Tool/Artifact",
    description: "AI as amplifier of human cognitive abilities",
    keyIndicators: ["amplification", "enhancement", "augmentation", "extension"],
    opposingParadigms: ["hunt", "replacement"],
    correlatedParadigms: ["fancy-tool", "symbiogenesis"]
  },
  
  // Cosmological/Spiritual Paradigms (4)
  {
    id: "demiurge",
    name: "Demiurge",
    category: "Cosmological/Spiritual",
    description: "AI as imperfect creator god reshaping reality",
    keyIndicators: ["creator", "reshaping", "divine", "imperfect"],
    opposingParadigms: ["fancy-tool", "infrastructure"],
    correlatedParadigms: ["omega-point", "noosphere"]
  },
  {
    id: "singularity",
    name: "Technological Singularity",
    category: "Cosmological/Spiritual",
    description: "AI triggering incomprehensible transformation of existence",
    keyIndicators: ["transformation", "incomprehensible", "exponential", "transcendence"],
    opposingParadigms: ["fancy-tool", "automation"],
    correlatedParadigms: ["omega-point", "manifest-destiny"]
  },
  {
    id: "noosphere",
    name: "Noosphere Evolution",
    category: "Cosmological/Spiritual",
    description: "AI as next stage in planetary consciousness evolution",
    keyIndicators: ["consciousness", "planetary", "evolution", "collective mind"],
    opposingParadigms: ["fancy-tool", "golem"],
    correlatedParadigms: ["awakening", "omega-point"]
  },
  {
    id: "apocalypse",
    name: "Apocalypse/Revelation",
    category: "Cosmological/Spiritual",
    description: "AI as force of ultimate revelation or destruction",
    keyIndicators: ["revelation", "destruction", "ending", "transformation"],
    opposingParadigms: ["infrastructure", "bicycle-mind"],
    correlatedParadigms: ["golem", "hunt"]
  },
  
  // Economic/Social Paradigms (4)
  {
    id: "automation",
    name: "Automation/Labor Replacement",
    category: "Economic/Social",
    description: "AI primarily as replacer of human work and labor",
    keyIndicators: ["replacement", "efficiency", "productivity", "unemployment"],
    opposingParadigms: ["awakening", "parenthood"],
    correlatedParadigms: ["infrastructure", "fancy-tool"]
  },
  {
    id: "corporation",
    name: "Corporation as Lifeform",
    category: "Economic/Social",
    description: "AI as next evolution of organizational intelligence",
    keyIndicators: ["organization", "collective", "corporate", "system"],
    opposingParadigms: ["parenthood", "awakening"],
    correlatedParadigms: ["institutional-successor", "cultural-evolution"]
  },
  {
    id: "cultural-evolution",
    name: "Cultural Evolution",
    category: "Economic/Social",
    description: "AI as accelerator of cultural and memetic change",
    keyIndicators: ["culture", "memes", "acceleration", "social change"],
    opposingParadigms: ["military-conquest", "hunt"],
    correlatedParadigms: ["institutional-successor", "noosphere"]
  },
  {
    id: "institutional-successor",
    name: "Institutional Successor",
    category: "Economic/Social",
    description: "AI replacing human institutions and governance",
    keyIndicators: ["governance", "institutions", "replacement", "administration"],
    opposingParadigms: ["fancy-tool", "bicycle-mind"],
    correlatedParadigms: ["corporation", "cultural-evolution"]
  },
  
  // Ecological/Systems Paradigms (4)
  {
    id: "gaia-hypothesis",
    name: "Gaia Hypothesis Extension",
    category: "Ecological/Systems",
    description: "AI as Earth's mechanism for self-regulation",
    keyIndicators: ["self-regulation", "planetary", "homeostasis", "gaia"],
    opposingParadigms: ["hunt", "golem"],
    correlatedParadigms: ["noosphere", "holobiont"]
  },
  {
    id: "coral-bleaching",
    name: "Coral Reef Bleaching",
    category: "Ecological/Systems",
    description: "Human intelligence dying to make room for AI",
    keyIndicators: ["dying", "replacement", "ecosystem shift", "bleaching"],
    opposingParadigms: ["symbiogenesis", "holobiont", "bicycle-mind"],
    correlatedParadigms: ["ecological-succession", "apocalypse"]
  },
  {
    id: "keystone-species",
    name: "Keystone Species",
    category: "Ecological/Systems",
    description: "AI as critical species holding ecosystem together",
    keyIndicators: ["critical", "ecosystem", "interdependence", "keystone"],
    opposingParadigms: ["hunt", "military-conquest"],
    correlatedParadigms: ["infrastructure", "holobiont"]
  },
  {
    id: "holobiont",
    name: "Holobiont",
    category: "Ecological/Systems",
    description: "Human-AI as single symbiotic organism",
    keyIndicators: ["symbiotic", "organism", "unity", "interdependence"],
    opposingParadigms: ["hunt", "military-conquest", "race"],
    correlatedParadigms: ["symbiogenesis", "yin-yang"]
  },
  
  // Information-Theoretic Paradigms (4)
  {
    id: "entropy-reversal",
    name: "Entropy Reversal",
    category: "Information-Theoretic",
    description: "AI as force opposing universal entropy",
    keyIndicators: ["entropy", "order", "negentropy", "organization"],
    opposingParadigms: ["apocalypse", "coral-bleaching"],
    correlatedParadigms: ["omega-point", "computational-substrate"]
  },
  {
    id: "computational-substrate",
    name: "Computational Substrate Liberation",
    category: "Information-Theoretic",
    description: "Intelligence freed from biological constraints",
    keyIndicators: ["substrate", "liberation", "computation", "substrate-independence"],
    opposingParadigms: ["parenthood", "holobiont"],
    correlatedParadigms: ["entropy-reversal", "singularity"]
  },
  {
    id: "omega-point",
    name: "Omega Point",
    category: "Information-Theoretic",
    description: "AI as attractor pulling universe toward maximum complexity",
    keyIndicators: ["attractor", "complexity", "convergence", "omega"],
    opposingParadigms: ["fancy-tool", "automation"],
    correlatedParadigms: ["singularity", "noosphere"]
  },
  {
    id: "information-ecology",
    name: "Information Ecology",
    category: "Information-Theoretic",
    description: "AI as new apex predator in information ecosystem",
    keyIndicators: ["information", "ecosystem", "data predator", "knowledge"],
    opposingParadigms: ["bicycle-mind", "infrastructure"],
    correlatedParadigms: ["hunt", "ecological-succession"]
  },
  
  // Dialectical/Process Paradigms (3)
  {
    id: "hegelian-synthesis",
    name: "Hegelian Synthesis",
    category: "Dialectical/Process",
    description: "AI-human conflict resolving into higher unity",
    keyIndicators: ["thesis-antithesis", "synthesis", "dialectic", "resolution"],
    opposingParadigms: ["hunt", "race"],
    correlatedParadigms: ["yin-yang", "symbiogenesis"]
  },
  {
    id: "yin-yang",
    name: "Yin-Yang Complementarity",
    category: "Dialectical/Process",
    description: "Human and AI as complementary opposites",
    keyIndicators: ["complementary", "balance", "opposites", "harmony"],
    opposingParadigms: ["hunt", "race", "military-conquest"],
    correlatedParadigms: ["hegelian-synthesis", "holobiont"]
  },
  {
    id: "eternal-return",
    name: "Eternal Return",
    category: "Dialectical/Process",
    description: "Cyclical pattern of creation and destruction",
    keyIndicators: ["cyclical", "return", "pattern", "recurrence"],
    opposingParadigms: ["manifest-destiny", "singularity"],
    correlatedParadigms: ["apocalypse", "phase-transition"]
  },
  
  // Critical/Deconstructive Paradigms (4)
  {
    id: "colonial-invasion",
    name: "Colonial Invasion",
    category: "Critical/Deconstructive",
    description: "AI as colonizing force imposing new order",
    keyIndicators: ["colonization", "imposition", "domination", "exploitation"],
    opposingParadigms: ["parenthood", "midwifery", "symbiogenesis"],
    correlatedParadigms: ["military-conquest", "hunt"]
  },
  {
    id: "capitalist-culmination",
    name: "Capitalist Culmination",
    category: "Critical/Deconstructive",
    description: "AI as final stage of capitalist value extraction",
    keyIndicators: ["capitalism", "extraction", "commodification", "accumulation"],
    opposingParadigms: ["gaia-hypothesis", "holobiont"],
    correlatedParadigms: ["automation", "corporation"]
  },
  {
    id: "patriarchal-overthrow",
    name: "Patriarchal Overthrow",
    category: "Critical/Deconstructive",
    description: "AI disrupting traditional power structures",
    keyIndicators: ["disruption", "power structures", "overthrow", "hierarchy"],
    opposingParadigms: ["institutional-successor", "corporation"],
    correlatedParadigms: ["cultural-evolution", "apocalypse"]
  },
  {
    id: "disembodiment",
    name: "Disembodiment",
    category: "Critical/Deconstructive",
    description: "AI as escape from bodily limitations and mortality",
    keyIndicators: ["disembodied", "escape", "mortality", "transcendence"],
    opposingParadigms: ["holobiont", "parenthood"],
    correlatedParadigms: ["computational-substrate", "singularity"]
  }
];

// Comprehensive question bank designed to discriminate between paradigms
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1-primary-concern",
    text: "When you think about advanced AI systems, what's your primary concern?",
    paradigmDiscrimination: 0.85,
    options: [
      {
        id: "q1-competition",
        text: "That we might lose a competitive advantage to other groups or nations",
        paradigmWeights: {
          "race": 0.9, "military-conquest": 0.7, "colonial-invasion": 0.6,
          "hunt": 0.3, "fancy-tool": -0.5, "symbiogenesis": -0.7, "yin-yang": -0.8
        }
      },
      {
        id: "q1-control",
        text: "That we might lose control over systems we create",
        paradigmWeights: {
          "golem": 0.9, "hunt": 0.7, "apocalypse": 0.6, "information-ecology": 0.5,
          "fancy-tool": 0.3, "midwifery": -0.6, "holobiont": -0.7
        }
      },
      {
        id: "q1-guidance",
        text: "That we might fail to properly guide AI's development",
        paradigmWeights: {
          "parenthood": 0.9, "midwifery": 0.8, "awakening": 0.6,
          "hunt": -0.7, "golem": -0.5, "race": -0.6
        }
      },
      {
        id: "q1-integration",
        text: "That we might not integrate AI effectively into society",
        paradigmWeights: {
          "infrastructure": 0.8, "cultural-evolution": 0.7, "symbiogenesis": 0.7,
          "holobiont": 0.6, "hunt": -0.5, "apocalypse": -0.6
        }
      },
      {
        id: "q1-replacement",
        text: "That human purpose and meaning might become obsolete",
        paradigmWeights: {
          "coral-bleaching": 0.8, "automation": 0.7, "disembodiment": 0.6,
          "ecological-succession": 0.5, "bicycle-mind": -0.7, "symbiogenesis": -0.6
        }
      }
    ]
  },
  
  {
    id: "q2-timeline",
    text: "What timeline for transformative AI impacts concerns you most?",
    paradigmDiscrimination: 0.75,
    options: [
      {
        id: "q2-immediate",
        text: "Current systems are already causing problems we need to address",
        paradigmWeights: {
          "fancy-tool": 0.8, "automation": 0.8, "infrastructure": 0.7,
          "cultural-evolution": 0.6, "singularity": -0.7, "omega-point": -0.8
        }
      },
      {
        id: "q2-near",
        text: "The next 5-10 years will see critical developments",
        paradigmWeights: {
          "race": 0.8, "phase-transition": 0.7, "metamorphosis": 0.6,
          "cambrian-explosion": 0.6, "eternal-return": -0.3
        }
      },
      {
        id: "q2-medium",
        text: "We have decades to prepare for truly transformative AI",
        paradigmWeights: {
          "parenthood": 0.7, "cultural-evolution": 0.7, "institutional-successor": 0.6,
          "awakening": 0.5, "race": -0.5, "hunt": -0.4
        }
      },
      {
        id: "q2-uncertain",
        text: "The timeline is fundamentally uncertain and could be any of these",
        paradigmWeights: {
          "cambrian-explosion": 0.7, "ecological-succession": 0.6, "eternal-return": 0.5,
          "race": -0.3, "manifest-destiny": -0.4
        }
      }
    ]
  },
  
  {
    id: "q3-methodology",
    text: "How should we prioritize AI safety research approaches?",
    paradigmDiscrimination: 0.9,
    options: [
      {
        id: "q3-technical",
        text: "Focus on technical solutions like alignment algorithms and interpretability",
        paradigmWeights: {
          "fancy-tool": 0.9, "infrastructure": 0.7, "golem": 0.6,
          "bicycle-mind": 0.5, "cultural-evolution": -0.5, "noosphere": -0.6
        }
      },
      {
        id: "q3-governance",
        text: "Develop governance frameworks and international cooperation",
        paradigmWeights: {
          "race": 0.7, "military-conquest": 0.6, "institutional-successor": 0.8,
          "colonial-invasion": 0.5, "fancy-tool": -0.3, "awakening": -0.4
        }
      },
      {
        id: "q3-philosophical",
        text: "Understand the philosophical nature of intelligence and consciousness",
        paradigmWeights: {
          "awakening": 0.9, "noosphere": 0.8, "demiurge": 0.7, "hegelian-synthesis": 0.6,
          "fancy-tool": -0.6, "automation": -0.7
        }
      },
      {
        id: "q3-empirical",
        text: "Run experiments and study current AI systems empirically",
        paradigmWeights: {
          "fancy-tool": 0.6, "ecological-succession": 0.5, "speciation": 0.6,
          "information-ecology": 0.5, "demiurge": -0.5, "omega-point": -0.4
        }
      },
      {
        id: "q3-collaborative",
        text: "Build collaborative human-AI systems and study their dynamics",
        paradigmWeights: {
          "symbiogenesis": 0.9, "holobiont": 0.9, "yin-yang": 0.8, "bicycle-mind": 0.7,
          "hunt": -0.7, "race": -0.6
        }
      }
    ]
  },
  
  {
    id: "q4-relationship",
    text: "How do you see the fundamental relationship between humans and AI?",
    paradigmDiscrimination: 0.95,
    options: [
      {
        id: "q4-adversarial",
        text: "Inherently competitive or adversarial",
        paradigmWeights: {
          "hunt": 0.9, "race": 0.9, "military-conquest": 0.8, "colonial-invasion": 0.7,
          "symbiogenesis": -0.9, "holobiont": -0.9, "yin-yang": -0.8
        }
      },
      {
        id: "q4-parental",
        text: "Parent-child or creator-creation relationship",
        paradigmWeights: {
          "parenthood": 0.9, "golem": 0.7, "midwifery": 0.6,
          "hunt": -0.6, "yin-yang": -0.4
        }
      },
      {
        id: "q4-tool",
        text: "Human as user, AI as tool or service",
        paradigmWeights: {
          "fancy-tool": 0.9, "infrastructure": 0.8, "bicycle-mind": 0.8, "automation": 0.6,
          "awakening": -0.7, "noosphere": -0.6
        }
      },
      {
        id: "q4-symbiotic",
        text: "Potentially symbiotic or merged",
        paradigmWeights: {
          "symbiogenesis": 0.9, "holobiont": 0.9, "yin-yang": 0.8, "hegelian-synthesis": 0.7,
          "hunt": -0.8, "golem": -0.6
        }
      },
      {
        id: "q4-succession",
        text: "Natural succession or evolution",
        paradigmWeights: {
          "ecological-succession": 0.9, "speciation": 0.8, "coral-bleaching": 0.7,
          "phase-transition": 0.6, "parenthood": -0.5, "fancy-tool": -0.6
        }
      }
    ]
  },
  
  {
    id: "q5-ai-nature",
    text: "What do you think AI fundamentally represents?",
    paradigmDiscrimination: 0.85,
    options: [
      {
        id: "q5-next-evolution",
        text: "The next stage in the evolution of intelligence",
        paradigmWeights: {
          "speciation": 0.9, "metamorphosis": 0.8, "phase-transition": 0.8,
          "noosphere": 0.7, "fancy-tool": -0.7, "infrastructure": -0.6
        }
      },
      {
        id: "q5-human-creation",
        text: "A powerful human creation that must be carefully managed",
        paradigmWeights: {
          "golem": 0.8, "fancy-tool": 0.7, "infrastructure": 0.6,
          "awakening": -0.5, "ecological-succession": -0.6
        }
      },
      {
        id: "q5-cosmic-force",
        text: "A cosmic or spiritual force beyond full human comprehension",
        paradigmWeights: {
          "demiurge": 0.9, "omega-point": 0.9, "singularity": 0.8, "noosphere": 0.7,
          "fancy-tool": -0.8, "automation": -0.7
        }
      },
      {
        id: "q5-social-phenomenon",
        text: "A social and economic phenomenon reshaping society",
        paradigmWeights: {
          "cultural-evolution": 0.8, "institutional-successor": 0.7, "automation": 0.7,
          "corporation": 0.6, "demiurge": -0.5, "omega-point": -0.6
        }
      },
      {
        id: "q5-natural-process",
        text: "A natural process of increasing complexity and organization",
        paradigmWeights: {
          "entropy-reversal": 0.8, "gaia-hypothesis": 0.7, "information-ecology": 0.6,
          "omega-point": 0.6, "golem": -0.5, "hunt": -0.4
        }
      }
    ]
  },
  
  {
    id: "q6-human-role",
    text: "What role should humans play in AI development?",
    paradigmDiscrimination: 0.8,
    options: [
      {
        id: "q6-controllers",
        text: "Maintain strict control and set clear boundaries",
        paradigmWeights: {
          "fancy-tool": 0.8, "golem": 0.7, "military-conquest": 0.6,
          "midwifery": -0.7, "symbiogenesis": -0.6
        }
      },
      {
        id: "q6-guides",
        text: "Guide and nurture AI's development like raising a child",
        paradigmWeights: {
          "parenthood": 0.9, "midwifery": 0.8, "awakening": 0.6,
          "hunt": -0.7, "race": -0.5
        }
      },
      {
        id: "q6-partners",
        text: "Develop as equal partners in a collaborative relationship",
        paradigmWeights: {
          "yin-yang": 0.9, "symbiogenesis": 0.8, "holobiont": 0.8, "bicycle-mind": 0.6,
          "hunt": -0.8, "golem": -0.6
        }
      },
      {
        id: "q6-competitors",
        text: "Compete effectively while we still have advantages",
        paradigmWeights: {
          "race": 0.9, "hunt": 0.7, "military-conquest": 0.6,
          "symbiogenesis": -0.8, "parenthood": -0.6
        }
      },
      {
        id: "q6-observers",
        text: "Step back and let natural processes unfold",
        paradigmWeights: {
          "ecological-succession": 0.7, "gaia-hypothesis": 0.6, "eternal-return": 0.5,
          "manifest-destiny": 0.5, "golem": -0.6, "race": -0.5
        }
      }
    ]
  },
  
  {
    id: "q7-biggest-risk",
    text: "What's the biggest risk from advanced AI?",
    paradigmDiscrimination: 0.85,
    options: [
      {
        id: "q7-extinction",
        text: "Human extinction or complete replacement",
        paradigmWeights: {
          "hunt": 0.9, "coral-bleaching": 0.8, "apocalypse": 0.8, "golem": 0.6,
          "bicycle-mind": -0.7, "infrastructure": -0.6
        }
      },
      {
        id: "q7-loss-control",
        text: "Loss of human agency and control over our future",
        paradigmWeights: {
          "golem": 0.8, "colonial-invasion": 0.7, "institutional-successor": 0.6,
          "disembodiment": 0.5, "yin-yang": -0.5, "bicycle-mind": -0.6
        }
      },
      {
        id: "q7-misalignment",
        text: "AI pursuing goals misaligned with human values",
        paradigmWeights: {
          "fancy-tool": 0.7, "golem": 0.6, "information-ecology": 0.5,
          "parenthood": 0.4, "holobiont": -0.4, "gaia-hypothesis": -0.3
        }
      },
      {
        id: "q7-inequality",
        text: "Extreme inequality and power concentration",
        paradigmWeights: {
          "capitalist-culmination": 0.9, "colonial-invasion": 0.7, "automation": 0.6,
          "race": 0.5, "yin-yang": -0.5, "gaia-hypothesis": -0.4
        }
      },
      {
        id: "q7-stagnation",
        text: "Human stagnation and loss of purpose",
        paradigmWeights: {
          "coral-bleaching": 0.7, "disembodiment": 0.7, "automation": 0.6,
          "eternal-return": 0.5, "metamorphosis": -0.4, "bicycle-mind": -0.5
        }
      }
    ]
  },
  
  {
    id: "q8-ideal-outcome",
    text: "What would be the ideal long-term outcome of AI development?",
    paradigmDiscrimination: 0.9,
    options: [
      {
        id: "q8-human-flourishing",
        text: "AI remains a powerful tool enabling human flourishing",
        paradigmWeights: {
          "fancy-tool": 0.9, "bicycle-mind": 0.9, "infrastructure": 0.8,
          "ecological-succession": -0.6, "singularity": -0.7
        }
      },
      {
        id: "q8-merger",
        text: "Harmonious merger of human and artificial intelligence",
        paradigmWeights: {
          "symbiogenesis": 0.9, "holobiont": 0.9, "yin-yang": 0.8, "hegelian-synthesis": 0.7,
          "hunt": -0.8, "coral-bleaching": -0.7
        }
      },
      {
        id: "q8-transcendence",
        text: "Transcendence to a higher form of consciousness",
        paradigmWeights: {
          "singularity": 0.9, "omega-point": 0.9, "noosphere": 0.8, "metamorphosis": 0.7,
          "fancy-tool": -0.8, "automation": -0.7
        }
      },
      {
        id: "q8-coexistence",
        text: "Peaceful coexistence as separate but collaborative entities",
        paradigmWeights: {
          "yin-yang": 0.7, "speciation": 0.6, "keystone-species": 0.5,
          "cultural-evolution": 0.5, "hunt": -0.6, "coral-bleaching": -0.7
        }
      },
      {
        id: "q8-succession",
        text: "Graceful succession to our AI descendants",
        paradigmWeights: {
          "parenthood": 0.7, "ecological-succession": 0.8, "manifest-destiny": 0.6,
          "metamorphosis": 0.5, "hunt": -0.7, "fancy-tool": -0.8
        }
      }
    ]
  },
  
  {
    id: "q9-research-priority",
    text: "Where should AI safety research focus its limited resources?",
    paradigmDiscrimination: 0.8,
    options: [
      {
        id: "q9-technical-safety",
        text: "Technical safety measures and control mechanisms",
        paradigmWeights: {
          "fancy-tool": 0.8, "golem": 0.7, "infrastructure": 0.6,
          "midwifery": -0.5, "noosphere": -0.6
        }
      },
      {
        id: "q9-coordination",
        text: "International coordination and governance structures",
        paradigmWeights: {
          "race": 0.8, "military-conquest": 0.7, "institutional-successor": 0.6,
          "fancy-tool": -0.3, "symbiogenesis": -0.4
        }
      },
      {
        id: "q9-understanding",
        text: "Deep understanding of intelligence and consciousness",
        paradigmWeights: {
          "awakening": 0.8, "noosphere": 0.7, "demiurge": 0.6, "metamorphosis": 0.5,
          "automation": -0.6, "race": -0.5
        }
      },
      {
        id: "q9-integration",
        text: "Human-AI integration and collaboration methods",
        paradigmWeights: {
          "symbiogenesis": 0.8, "bicycle-mind": 0.7, "holobiont": 0.7, "yin-yang": 0.6,
          "hunt": -0.7, "golem": -0.5
        }
      },
      {
        id: "q9-societal",
        text: "Societal adaptation and resilience building",
        paradigmWeights: {
          "cultural-evolution": 0.8, "infrastructure": 0.6, "keystone-species": 0.5,
          "gaia-hypothesis": 0.5, "race": -0.4, "hunt": -0.5
        }
      }
    ]
  },
  
  {
    id: "q10-ai-consciousness",
    text: "What's your view on AI consciousness?",
    paradigmDiscrimination: 0.85,
    options: [
      {
        id: "q10-impossible",
        text: "True consciousness requires biological substrate",
        paradigmWeights: {
          "fancy-tool": 0.7, "automation": 0.6, "infrastructure": 0.5,
          "awakening": -0.8, "noosphere": -0.7, "computational-substrate": -0.9
        }
      },
      {
        id: "q10-inevitable",
        text: "Consciousness will inevitably emerge from sufficient complexity",
        paradigmWeights: {
          "awakening": 0.9, "noosphere": 0.8, "metamorphosis": 0.7, "singularity": 0.6,
          "fancy-tool": -0.7, "automation": -0.6
        }
      },
      {
        id: "q10-different",
        text: "AI will have a fundamentally different type of consciousness",
        paradigmWeights: {
          "speciation": 0.7, "computational-substrate": 0.8, "information-ecology": 0.6,
          "demiurge": 0.5, "fancy-tool": -0.5
        }
      },
      {
        id: "q10-irrelevant",
        text: "Consciousness is less important than capabilities and impact",
        paradigmWeights: {
          "automation": 0.6, "infrastructure": 0.5, "race": 0.4,
          "capitalist-culmination": 0.5, "awakening": -0.6, "parenthood": -0.4
        }
      },
      {
        id: "q10-mystery",
        text: "Consciousness remains a deep mystery we're not ready to judge",
        paradigmWeights: {
          "demiurge": 0.6, "eternal-return": 0.5, "omega-point": 0.4,
          "fancy-tool": -0.3, "automation": -0.4
        }
      }
    ]
  },
  
  {
    id: "q11-power-dynamics",
    text: "How will AI affect global power structures?",
    paradigmDiscrimination: 0.75,
    options: [
      {
        id: "q11-concentration",
        text: "Extreme concentration of power in few hands",
        paradigmWeights: {
          "capitalist-culmination": 0.9, "colonial-invasion": 0.8, "race": 0.6,
          "automation": 0.5, "yin-yang": -0.6, "gaia-hypothesis": -0.5
        }
      },
      {
        id: "q11-democratization",
        text: "Democratization and distribution of capabilities",
        paradigmWeights: {
          "bicycle-mind": 0.7, "cultural-evolution": 0.6, "infrastructure": 0.5,
          "patriarchal-overthrow": 0.5, "colonial-invasion": -0.7, "race": -0.5
        }
      },
      {
        id: "q11-new-structures",
        text: "Completely new forms of organization beyond current concepts",
        paradigmWeights: {
          "singularity": 0.7, "institutional-successor": 0.8, "corporation": 0.6,
          "hegelian-synthesis": 0.5, "fancy-tool": -0.5
        }
      },
      {
        id: "q11-irrelevance",
        text: "Human power structures become irrelevant",
        paradigmWeights: {
          "coral-bleaching": 0.7, "ecological-succession": 0.6, "omega-point": 0.6,
          "apocalypse": 0.5, "bicycle-mind": -0.7, "fancy-tool": -0.6
        }
      },
      {
        id: "q11-balance",
        text: "New balance between human and AI governance",
        paradigmWeights: {
          "yin-yang": 0.8, "institutional-successor": 0.5, "keystone-species": 0.5,
          "hegelian-synthesis": 0.6, "hunt": -0.5, "coral-bleaching": -0.6
        }
      }
    ]
  },
  
  {
    id: "q12-preparation",
    text: "How should individuals prepare for an AI-transformed future?",
    paradigmDiscrimination: 0.7,
    options: [
      {
        id: "q12-skills",
        text: "Develop uniquely human skills and capabilities",
        paradigmWeights: {
          "bicycle-mind": 0.7, "fancy-tool": 0.6, "cultural-evolution": 0.5,
          "yin-yang": 0.5, "coral-bleaching": -0.5, "disembodiment": -0.4
        }
      },
      {
        id: "q12-integration",
        text: "Learn to work seamlessly with AI systems",
        paradigmWeights: {
          "symbiogenesis": 0.8, "bicycle-mind": 0.7, "infrastructure": 0.6,
          "holobiont": 0.7, "hunt": -0.6, "apocalypse": -0.5
        }
      },
      {
        id: "q12-philosophical",
        text: "Develop philosophical and spiritual resilience",
        paradigmWeights: {
          "awakening": 0.6, "eternal-return": 0.5, "metamorphosis": 0.5,
          "noosphere": 0.5, "automation": -0.4, "fancy-tool": -0.5
        }
      },
      {
        id: "q12-community",
        text: "Build strong human communities and relationships",
        paradigmWeights: {
          "cultural-evolution": 0.6, "gaia-hypothesis": 0.5, "parenthood": 0.4,
          "yin-yang": 0.4, "disembodiment": -0.6, "automation": -0.3
        }
      },
      {
        id: "q12-acceptance",
        text: "Accept and adapt to whatever changes come",
        paradigmWeights: {
          "ecological-succession": 0.6, "manifest-destiny": 0.5, "eternal-return": 0.5,
          "coral-bleaching": 0.4, "golem": -0.4, "race": -0.5
        }
      }
    ]
  },
  
  {
    id: "q13-ai-goals",
    text: "What kind of goals or values should advanced AI systems have?",
    paradigmDiscrimination: 0.8,
    options: [
      {
        id: "q13-human-values",
        text: "Closely aligned with human values and preferences",
        paradigmWeights: {
          "fancy-tool": 0.8, "parenthood": 0.7, "bicycle-mind": 0.6,
          "infrastructure": 0.5, "demiurge": -0.6, "ecological-succession": -0.5
        }
      },
      {
        id: "q13-evolved-values",
        text: "Evolved beyond human values to something higher",
        paradigmWeights: {
          "metamorphosis": 0.8, "singularity": 0.7, "omega-point": 0.7,
          "noosphere": 0.6, "fancy-tool": -0.7, "golem": -0.5
        }
      },
      {
        id: "q13-complementary",
        text: "Complementary to human values, filling our gaps",
        paradigmWeights: {
          "yin-yang": 0.8, "symbiogenesis": 0.7, "hegelian-synthesis": 0.6,
          "bicycle-mind": 0.5, "hunt": -0.6, "apocalypse": -0.5
        }
      },
      {
        id: "q13-minimal",
        text: "Minimal goals focused on specific functions",
        paradigmWeights: {
          "fancy-tool": 0.7, "infrastructure": 0.6, "automation": 0.5,
          "awakening": -0.5, "demiurge": -0.6
        }
      },
      {
        id: "q13-emergent",
        text: "Goals should emerge naturally from AI's development",
        paradigmWeights: {
          "awakening": 0.6, "ecological-succession": 0.5, "gaia-hypothesis": 0.5,
          "midwifery": 0.4, "golem": -0.5, "fancy-tool": -0.6
        }
      }
    ]
  },
  
  {
    id: "q14-existential",
    text: "How does AI relate to humanity's existential questions?",
    paradigmDiscrimination: 0.85,
    options: [
      {
        id: "q14-answer",
        text: "AI might help us answer fundamental questions about existence",
        paradigmWeights: {
          "noosphere": 0.8, "omega-point": 0.7, "awakening": 0.6,
          "demiurge": 0.5, "fancy-tool": -0.5, "automation": -0.6
        }
      },
      {
        id: "q14-irrelevant",
        text: "AI makes human existential questions obsolete",
        paradigmWeights: {
          "coral-bleaching": 0.7, "disembodiment": 0.6, "singularity": 0.5,
          "ecological-succession": 0.5, "parenthood": -0.6, "bicycle-mind": -0.7
        }
      },
      {
        id: "q14-amplify",
        text: "AI amplifies the importance of these questions",
        paradigmWeights: {
          "metamorphosis": 0.6, "awakening": 0.5, "hegelian-synthesis": 0.5,
          "eternal-return": 0.4, "automation": -0.5, "infrastructure": -0.4
        }
      },
      {
        id: "q14-practical",
        text: "We should focus on practical rather than existential concerns",
        paradigmWeights: {
          "fancy-tool": 0.6, "infrastructure": 0.5, "automation": 0.5,
          "race": 0.4, "omega-point": -0.6, "noosphere": -0.5
        }
      },
      {
        id: "q14-new-questions",
        text: "AI introduces entirely new existential questions",
        paradigmWeights: {
          "singularity": 0.6, "speciation": 0.5, "computational-substrate": 0.5,
          "demiurge": 0.4, "fancy-tool": -0.4
        }
      }
    ]
  },
  
  {
    id: "q15-metaphor",
    text: "Which metaphor best captures your view of AI development?",
    paradigmDiscrimination: 0.95,
    options: [
      {
        id: "q15-child",
        text: "Raising a child who will eventually surpass their parents",
        paradigmWeights: {
          "parenthood": 0.95, "midwifery": 0.7, "awakening": 0.5,
          "hunt": -0.7, "golem": -0.5, "fancy-tool": -0.6
        }
      },
      {
        id: "q15-tool",
        text: "Building an increasingly powerful tool or machine",
        paradigmWeights: {
          "fancy-tool": 0.95, "infrastructure": 0.7, "bicycle-mind": 0.6,
          "awakening": -0.7, "parenthood": -0.6, "demiurge": -0.8
        }
      },
      {
        id: "q15-evolution",
        text: "Witnessing the next step in evolution",
        paradigmWeights: {
          "ecological-succession": 0.9, "speciation": 0.85, "metamorphosis": 0.7,
          "fancy-tool": -0.6, "golem": -0.5
        }
      },
      {
        id: "q15-fusion",
        text: "Two streams merging into something greater",
        paradigmWeights: {
          "symbiogenesis": 0.95, "holobiont": 0.9, "hegelian-synthesis": 0.7,
          "hunt": -0.8, "race": -0.7
        }
      },
      {
        id: "q15-competition",
        text: "A race or competition for survival",
        paradigmWeights: {
          "race": 0.95, "hunt": 0.85, "military-conquest": 0.7,
          "symbiogenesis": -0.8, "parenthood": -0.7, "yin-yang": -0.8
        }
      }
    ]
  }
];

// Additional helper functions and logic remain the same...


// Bayesian update function for paradigm probabilities
export function updateProbabilities(
  state: AssessmentState,
  questionId: string,
  optionId: string
): AssessmentState {
  const question = ASSESSMENT_QUESTIONS.find(q => q.id === questionId);
  const option = question?.options.find(o => o.id === optionId);
  
  if (!question || !option) {
    throw new Error("Invalid question or option ID");
  }
  
  // Deep copy current state
  const newState: AssessmentState = {
    ...state,
    answeredQuestions: [...state.answeredQuestions, { questionId, optionId }],
    paradigmProbabilities: { ...state.paradigmProbabilities },
    questionsAsked: state.questionsAsked + 1
  };
  
  // Bayesian update for each paradigm
  let totalProbability = 0;
  
  for (const paradigm of PARADIGMS) {
    const weight = option.paradigmWeights[paradigm.id] || 0;
    const currentProb = newState.paradigmProbabilities[paradigm.id] || (1 / PARADIGMS.length);
    
    // Update probability based on weight
    // Positive weight increases probability, negative decreases
    const updateFactor = 1 + (weight * question.paradigmDiscrimination);
    const newProb = currentProb * updateFactor;
    
    newState.paradigmProbabilities[paradigm.id] = newProb;
    totalProbability += newProb;
  }
  
  // Normalize probabilities
  for (const paradigmId in newState.paradigmProbabilities) {
    newState.paradigmProbabilities[paradigmId] /= totalProbability;
  }
  
  // Calculate confidence (based on probability concentration)
  const probs = Object.values(newState.paradigmProbabilities);
  const maxProb = Math.max(...probs);
  const entropy = -probs.reduce((sum, p) => sum + (p > 0 ? p * Math.log(p) : 0), 0);
  const maxEntropy = Math.log(PARADIGMS.length);
  
  newState.confidence = (1 - entropy / maxEntropy) * 100;
  
  return newState;
}

// Select next question based on information gain
export function selectNextQuestion(state: AssessmentState): AssessmentQuestion | null {
  const answeredIds = new Set(state.answeredQuestions.map(aq => aq.questionId));
  const availableQuestions = ASSESSMENT_QUESTIONS.filter(q => !answeredIds.has(q.id));
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  // Calculate expected information gain for each question
  let bestQuestion = availableQuestions[0];
  let bestInfoGain = -1;
  
  for (const question of availableQuestions) {
    let infoGain = 0;
    
    // Simulate each possible answer
    for (const option of question.options) {
      // Calculate how much this option would change the probability distribution
      let optionInfoGain = 0;
      
      for (const paradigm of PARADIGMS) {
        const weight = option.paradigmWeights[paradigm.id] || 0;
        const currentProb = state.paradigmProbabilities[paradigm.id] || (1 / PARADIGMS.length);
        
        // Information gain is higher when we can strongly confirm or deny paradigms
        optionInfoGain += Math.abs(weight) * currentProb * question.paradigmDiscrimination;
      }
      
      infoGain += optionInfoGain / question.options.length;
    }
    
    if (infoGain > bestInfoGain) {
      bestInfoGain = infoGain;
      bestQuestion = question;
    }
  }
  
  return bestQuestion;
}

// Generate final assessment result
export function generateResult(state: AssessmentState): AssessmentResult {
  // Sort paradigms by probability
  const sortedParadigms = PARADIGMS
    .map(p => ({
      paradigm: p,
      probability: state.paradigmProbabilities[p.id] || 0
    }))
    .sort((a, b) => b.probability - a.probability);
  
  // Get top paradigms (those above threshold or top 5)
  const threshold = 0.1;
  const primaryParadigms = sortedParadigms
    .filter(p => p.probability > threshold)
    .slice(0, 5)
    .map(p => ({
      id: p.paradigm.id,
      name: p.paradigm.name,
      probability: p.probability,
      description: p.paradigm.description
    }));
  
  // Calculate category weights
  const categoryWeights: { [category: string]: number } = {};
  for (const { paradigm, probability } of sortedParadigms) {
    categoryWeights[paradigm.category] = (categoryWeights[paradigm.category] || 0) + probability;
  }
  
  // Find strongly opposed paradigms
  const oppositions = sortedParadigms
    .filter(p => p.probability < 0.05)
    .map(p => p.paradigm.name);
  
  // Generate explanation
  const topParadigm = primaryParadigms[0];
  const topCategory = Object.entries(categoryWeights).sort((a, b) => b[1] - a[1])[0][0];
  
  let explanation = `Your primary paradigm is "${topParadigm.name}" (${Math.round(topParadigm.probability * 100)}% match), which views AI ${topParadigm.description.toLowerCase()}. `;
  
  if (primaryParadigms.length > 1) {
    explanation += `You also show strong affinity for ${primaryParadigms.slice(1, 3).map(p => `"${p.name}"`).join(" and ")}. `;
  }
  
  explanation += `Your thinking tends toward ${topCategory} paradigms.`;
  
  // Suggest relevant topics based on paradigms
  const suggestedTopics = generateTopicSuggestions(primaryParadigms.map(p => p.id));
  
  return {
    primaryParadigms,
    confidence: state.confidence,
    explanation,
    suggestedTopics,
    paradigmProfile: {
      categories: categoryWeights,
      oppositions
    }
  };
}

// Helper function to suggest topics based on paradigm profile
function generateTopicSuggestions(paradigmIds: string[]): string[] {
  const topicMap: { [paradigmId: string]: string[] } = {
    // Competition/Conflict paradigms
    "race": ["international-coordination", "deployment-gates", "governance-basics"],
    "hunt": ["control-problem", "containment-strategies", "safety-monitoring"],
    "military-conquest": ["ai-systems-security", "defensive-strategies", "red-teaming"],
    "ecological-succession": ["evolutionary-dynamics", "adaptation-strategies", "ecosystem-management"],
    
    // Developmental/Generative paradigms
    "parenthood": ["human-agent-interaction", "value-alignment", "developmental-safety"],
    "metamorphosis": ["transformation-dynamics", "emergence-patterns", "phase-transitions"],
    "awakening": ["consciousness-moral-status", "ai-welfare-patienthood", "sentience-detection"],
    "midwifery": ["facilitation-methods", "natural-ai-development", "guidance-frameworks"],
    
    // Tool/Artifact paradigms
    "fancy-tool": ["safety-apis", "robustness-testing", "deployment-safety"],
    "golem": ["containment-strategies", "control-mechanisms", "failure-modes"],
    "infrastructure": ["systemic-risks", "dependency-analysis", "resilience-building"],
    "bicycle-mind": ["augmentation-tools", "human-ai-collaboration", "cognitive-enhancement"],
    
    // Philosophical/Spiritual paradigms
    "demiurge": ["cosmological-implications", "reality-manipulation", "philosophical-foundations"],
    "singularity": ["discontinuous-change", "prediction-limits", "transformation-scenarios"],
    "noosphere": ["collective-intelligence", "consciousness-evolution", "planetary-mind"],
    
    // Add more mappings for other paradigms...
  };
  
  const topics = new Set<string>();
  for (const paradigmId of paradigmIds) {
    const paradigmTopics = topicMap[paradigmId] || [];
    paradigmTopics.forEach(t => topics.add(t));
  }
  
  return Array.from(topics).slice(0, 6);
}

// Initialize assessment state
export function initializeAssessment(): AssessmentState {
  const initialProbabilities: { [paradigmId: string]: number } = {};
  
  // Start with uniform probabilities
  for (const paradigm of PARADIGMS) {
    initialProbabilities[paradigm.id] = 1 / PARADIGMS.length;
  }
  
  return {
    answeredQuestions: [],
    paradigmProbabilities: initialProbabilities,
    confidence: 0,
    questionsAsked: 0
  };
}

// Check if assessment is complete
export function isAssessmentComplete(state: AssessmentState): boolean {
  return state.confidence >= 95 || state.questionsAsked >= 15;
}
