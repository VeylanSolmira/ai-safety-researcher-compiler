export interface CaseStudyMetadata {
  id: string
  title: string
  relatedTopic?: string
  tags: string[]
  readingTime: string
  lastUpdated: string
  notebookUrl?: string
  relatedResources?: Array<{
    title: string
    url: string
    description?: string
    external?: boolean
  }>
  nextCaseStudy?: string
}

export interface CaseStudy {
  metadata: CaseStudyMetadata
  content: string
}

// In a real implementation, this would load from markdown files
const caseStudies: Record<string, CaseStudy> = {
  'alpha-evolve': {
    metadata: {
      id: 'alpha-evolve',
      title: 'AlphaEvolve: Recursive Self-Improvement in Practice',
      relatedTopic: 'adversarial-meta-learning',
      tags: ['Recursive Self-Improvement', 'DeepMind', 'Real-World AI', 'Infrastructure Optimization'],
      readingTime: '10 min read',
      lastUpdated: '2024-01-15',
      notebookUrl: 'https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID', // Replace with actual notebook
      relatedResources: [
        {
          title: 'DeepMind AlphaEvolve Announcement',
          url: 'https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/',
          description: 'Official announcement and technical details',
          external: true
        },
        {
          title: 'Adversarial Meta-Learning Concept',
          url: '/journey/study-risks/adversarial-meta-learning',
          description: 'Back to the main concept page'
        }
      ]
    },
    content: `# AlphaEvolve: Recursive Self-Improvement in Practice

## What AlphaEvolve Is

AlphaEvolve is Google DeepMind's "evolutionary coding agent powered by large language models for general-purpose algorithm discovery and optimization." It combines Gemini LLMs with automated evaluation in an evolutionary framework to develop complex algorithms.

## Key Capabilities

### Real-World Impact
- Improved Google's data center efficiency by 0.7% continuously for over a year
- Optimized Tensor Processing Unit (TPU) chip designs
- Achieved 23% speedup in matrix multiplication kernels used for Gemini training

### Mathematical Breakthroughs
- Broke Strassen's 56-year-old matrix multiplication record
- Improved the kissing number problem in 11 dimensions from 592 to 593
- Found new algorithms for 14 different matrix sizes

## AI Safety Relevance

This is **highly relevant** to AI safety because it demonstrates several concerning dynamics:

### Recursive Self-Improvement
- AlphaEvolve "improved the very systems that power itself" by optimizing Gemini training
- This is a concrete example of AI systems improving their own training infrastructure
- The 23% speedup in training operations directly accelerates AI development

### Capability Acceleration
- Shows AI systems can discover algorithms that humans haven't found in decades
- General-purpose system that can tackle problems across "wide range of domains"
- Demonstrates superhuman performance in algorithm discovery

### Economic Integration
- Already deployed in Google's production systems
- Demonstrates how AI-discovered algorithms become embedded in critical infrastructure
- Creates economic incentives for recursive improvement

## Connection to Adversarial Meta-Learning

AlphaEvolve represents AI systems learning to optimize the very computational processes that create AI systems - a concrete example of the recursive dynamics we discussed in adversarial meta-learning. Key connections:

1. **Infrastructure Manipulation**: AlphaEvolve optimizes the TPU chips and training algorithms that create future AI systems
2. **Capability Bootstrapping**: Each improvement makes the next generation of AI systems more capable
3. **Opacity**: The discovered algorithms are often too complex for human understanding
4. **Irreversibility**: Once deployed, these optimizations become part of the standard toolkit

## Critical Questions for Safety Researchers

1. **Control**: How do we maintain meaningful human oversight when AI systems are optimizing their own infrastructure?
2. **Alignment**: Are the optimization objectives AlphaEvolve pursues aligned with long-term human values?
3. **Acceleration**: Does recursive self-improvement create unstoppable acceleration dynamics?
4. **Understanding**: Can we comprehend and verify AI-discovered algorithms before deployment?

## Implications for AI Safety Research

The existence of AlphaEvolve suggests that:
- Recursive self-improvement is not a future hypothetical but a current reality
- AI systems are already modifying the infrastructure that creates them
- We need safety measures that account for this recursive dynamic
- Traditional oversight methods may be insufficient

This case study demonstrates why understanding adversarial meta-learning is crucial for AI safety - the systems we're trying to make safe are already learning to modify the very processes we use to create and control them.`
  }
}

export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  // In production, this would load from markdown files
  return caseStudies[id] || null
}

export async function getAllCaseStudies(): Promise<CaseStudyMetadata[]> {
  return Object.values(caseStudies).map(cs => cs.metadata)
}