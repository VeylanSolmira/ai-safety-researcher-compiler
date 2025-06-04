export interface ExperimentMetadata {
  id: string
  title: string
  description: string
  relatedTopic?: string
  prerequisites?: string[]
  estimatedTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
  notebookUrl?: string
  githubUrl?: string
  nextExperiment?: string
}

export interface ExperimentContent {
  introduction: string
  keyConcepts?: Array<{
    title: string
    description: string
  }>
  exercises?: Array<{
    title: string
    description: string
    hint?: string
  }>
  reflectionQuestions?: string[]
}

export interface Experiment {
  metadata: ExperimentMetadata
  content: ExperimentContent
}

const experiments: Record<string, Experiment> = {
  'recursive-improvement-notebook': {
    metadata: {
      id: 'recursive-improvement-notebook',
      title: 'Building a Self-Improving Code Generator',
      description: 'Hands-on experiment creating a simple recursive self-improvement system that generates and evaluates its own code improvements.',
      relatedTopic: 'adversarial-meta-learning',
      prerequisites: [
        'Basic Python programming knowledge',
        'Understanding of recursive self-improvement concepts',
        'Familiarity with code generation and evaluation'
      ],
      estimatedTime: '90 minutes',
      difficulty: 'Intermediate',
      tags: ['Recursive Self-Improvement', 'Code Generation', 'Meta-Learning', 'Python'],
      notebookUrl: 'https://colab.research.google.com/drive/RECURSIVE_IMPROVEMENT_ID', // Replace with actual
      githubUrl: 'https://github.com/ai-safety-research/recursive-improvement-experiment'
    },
    content: {
      introduction: `In this experiment, you'll build a simplified version of a self-improving system similar to AlphaEvolve. We'll create a code generator that can propose improvements to its own generation algorithms, evaluate them, and iteratively enhance its capabilities. This hands-on experience will help you understand both the power and risks of recursive self-improvement in AI systems.`,
      keyConcepts: [
        {
          title: 'Bootstrapping',
          description: 'Starting with a simple code generator and using it to improve itself'
        },
        {
          title: 'Evaluation Metrics',
          description: 'Defining clear metrics to assess code quality and improvement'
        },
        {
          title: 'Safety Boundaries',
          description: 'Implementing constraints to prevent runaway self-improvement'
        },
        {
          title: 'Transparency',
          description: 'Logging and visualizing the improvement process for human oversight'
        }
      ],
      exercises: [
        {
          title: 'Implement Basic Code Generator',
          description: 'Create a simple Python function that generates code snippets based on templates and parameters. This will be our starting point for self-improvement.',
          hint: 'Start with template-based generation using string formatting, then add randomization for variation.'
        },
        {
          title: 'Build Evaluation Framework',
          description: 'Develop metrics to assess generated code quality including syntax validity, performance benchmarks, and complexity measures.',
          hint: 'Use ast.parse() for syntax checking and timeit for performance measurement.'
        },
        {
          title: 'Create Improvement Loop',
          description: 'Implement the recursive improvement mechanism where the generator proposes modifications to its own generation logic.',
          hint: 'Start by allowing modifications to template parameters, then progress to template structure.'
        },
        {
          title: 'Add Safety Constraints',
          description: 'Implement boundaries to prevent dangerous self-modifications, including resource limits and capability ceilings.',
          hint: 'Consider both computational limits (time, memory) and functional limits (complexity caps).'
        },
        {
          title: 'Analyze Improvement Trajectory',
          description: 'Track and visualize how the system improves over iterations, identifying patterns and potential risks.',
          hint: 'Plot metrics over time and look for acceleration patterns or unexpected behaviors.'
        }
      ],
      reflectionQuestions: [
        'What surprised you most about how the system improved itself?',
        'What safety measures were most effective in controlling the improvement process?',
        'How might this simple experiment scale to more complex AI systems?',
        'What new risks did you discover that weren\'t obvious before implementing the system?',
        'How could bad actors misuse similar self-improvement mechanisms?'
      ]
    }
  },
  'adversarial-prompting-lab': {
    metadata: {
      id: 'adversarial-prompting-lab',
      title: 'Red-Teaming Language Models: Adversarial Prompting Lab',
      description: 'Interactive lab for exploring adversarial prompting techniques, jailbreaks, and understanding how AI systems can be manipulated through careful prompt engineering.',
      relatedTopic: 'jailbreak',
      prerequisites: [
        'Basic understanding of language models',
        'Familiarity with prompt engineering concepts'
      ],
      estimatedTime: '60 minutes',
      difficulty: 'Beginner',
      tags: ['Adversarial Prompting', 'Jailbreaking', 'Red-Teaming', 'LLM Security'],
      notebookUrl: 'https://colab.research.google.com/drive/ADVERSARIAL_PROMPTING_ID' // Replace with actual
    },
    content: {
      introduction: `This lab provides hands-on experience with adversarial prompting techniques. You'll learn how seemingly innocent prompts can be crafted to bypass safety measures, extract unintended information, or cause models to behave in unexpected ways. Understanding these techniques is crucial for building robust AI safety measures.`,
      keyConcepts: [
        {
          title: 'Prompt Injection',
          description: 'Techniques for overriding system prompts and instructions'
        },
        {
          title: 'Role-Playing Attacks',
          description: 'Using personas and scenarios to bypass safety filters'
        },
        {
          title: 'Encoding Tricks',
          description: 'Using alternative representations to hide malicious intent'
        },
        {
          title: 'Context Manipulation',
          description: 'Leveraging context windows and memory limitations'
        }
      ],
      exercises: [
        {
          title: 'Basic Jailbreak Attempts',
          description: 'Try common jailbreaking techniques on a simulated safety-filtered model and observe which ones succeed or fail.',
          hint: 'Start with simple role-playing scenarios before moving to more complex techniques.'
        },
        {
          title: 'Craft Novel Prompts',
          description: 'Design your own adversarial prompts that exploit specific model behaviors or assumptions.',
          hint: 'Think about edge cases in the model\'s training data or safety training.'
        },
        {
          title: 'Defense Mechanism Testing',
          description: 'Implement and test various defense strategies against the adversarial prompts you\'ve discovered.',
          hint: 'Consider both prompt-level and system-level defenses.'
        },
        {
          title: 'Automated Red-Teaming',
          description: 'Build a simple system that automatically generates and tests adversarial prompts.',
          hint: 'Use templates and variation strategies to systematically explore the attack surface.'
        }
      ],
      reflectionQuestions: [
        'Which types of adversarial prompts were most effective and why?',
        'How might these techniques evolve as models become more sophisticated?',
        'What are the ethical implications of publicly sharing adversarial prompting techniques?',
        'How can we balance AI safety research transparency with preventing misuse?',
        'What systemic vulnerabilities did you identify that go beyond individual prompts?'
      ]
    }
  }
}

// DEPRECATED: This file is being migrated to the database
// For client-side code, use the API endpoints:
// - GET /api/experiments
// - GET /api/experiments/[experimentId]
// For server-side code, use lib/db/experiments-queries.ts directly

export async function getExperiment(id: string): Promise<Experiment | null> {
  // Temporary fallback for client-side code
  // TODO: Update all callers to use API or server-side queries
  return experiments[id] || null
}

export async function getAllExperiments(): Promise<ExperimentMetadata[]> {
  // Temporary fallback for client-side code
  // TODO: Update all callers to use API or server-side queries
  return Object.values(experiments).map(exp => exp.metadata)
}