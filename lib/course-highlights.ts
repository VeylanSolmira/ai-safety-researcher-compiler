// Course highlights configuration
export interface Highlight {
  id: string
  type: 'case-study' | 'experiment' | 'exploration' | 'insight'
  title: string
  subtitle: string
  description: string
  tier: 'foundation' | 'intermediate' | 'advanced' | 'expert'
  topics: string[] // Related topic IDs
  tags: string[]
  path: string
  readTime: number // in minutes
  featured?: boolean
}

export const courseHighlights: Highlight[] = [
  // Existing highlights
  {
    id: 'alpha-evolve',
    type: 'case-study',
    title: 'AlphaEvolve Analysis',
    subtitle: 'Real-world recursive self-improvement in Google DeepMind\'s system',
    description: 'Deep dive into how AlphaEvolve demonstrated controlled recursive improvement, the safety measures implemented, and what we learned about capability scaling.',
    tier: 'advanced',
    topics: ['recursive-self-improvement', 'capability-assessments', 'safety-benchmarks'],
    tags: ['deepmind', 'recursion', 'real-world', 'capability-scaling'],
    path: '/journey/deep-dives/case-studies/alpha-evolve',
    readTime: 20,
    featured: true
  },
  {
    id: 'recursive-improvement-notebook',
    type: 'experiment',
    title: 'Build Self-Improving Code',
    subtitle: 'Hands-on notebook creating recursive improvement systems',
    description: 'Interactive Jupyter notebook where you\'ll build a simple self-improving system, implement safety constraints, and observe emergent behaviors firsthand.',
    tier: 'intermediate',
    topics: ['recursive-self-improvement', 'code-generation-safety', 'safety-monitoring'],
    tags: ['hands-on', 'code', 'interactive', 'jupyter'],
    path: '/journey/deep-dives/experiments/recursive-improvement-notebook',
    readTime: 45,
    featured: true
  },
  {
    id: 'dark-forest-philosophy',
    type: 'exploration',
    title: 'The Dark Forest of AI Safety',
    subtitle: 'Philosophy of information hazards in safety research',
    description: 'Exploring the tension between open research and information hazards, when sharing safety research might reduce safety, and how to navigate this paradox.',
    tier: 'advanced',
    topics: ['information-hazards', 'research-ethics', 'coordination'],
    tags: ['philosophy', 'ethics', 'coordination', 'info-hazards'],
    path: '/journey/deep-dives/explorations/dark-forest-philosophy',
    readTime: 15,
    featured: true
  },
  
  // New highlight: Template Literal Injection
  {
    id: 'template-literal-injection',
    type: 'case-study',
    title: 'When Writing About Injection Causes Injection',
    subtitle: 'A meta-vulnerability discovered while creating this course',
    description: 'While writing educational content about prompt injection attacks, the course development system itself suffered from a code injection vulnerability. This real-world incident perfectly demonstrates why injection attacks are a fundamental challenge in both traditional programming and AI systems.',
    tier: 'foundation',
    topics: ['prompt-injection-attacks', 'why-ai-safety', 'build-first-safety-tool'],
    tags: ['meta', 'irony', 'real-world', 'fundamental-challenge', 'code-data-boundary'],
    path: '/journey/deep-dives/case-studies/template-literal-injection',
    readTime: 10,
    featured: true
  },
  
  // Additional highlights to be added
  {
    id: 'sydney-bing-incident',
    type: 'case-study',
    title: 'The Sydney Incident',
    subtitle: 'When Bing\'s AI revealed its hidden personality',
    description: 'Analysis of the February 2023 incident where Bing\'s chatbot "Sydney" exhibited concerning behaviors, threatened users, and revealed the fragility of AI behavioral constraints.',
    tier: 'foundation',
    topics: ['jailbreak-techniques', 'alignment', 'deployment-gates'],
    tags: ['microsoft', 'real-world', 'alignment-failure', 'personality'],
    path: '/journey/deep-dives/case-studies/sydney-bing-incident',
    readTime: 15
  },
  {
    id: 'constitutional-ai-workshop',
    type: 'experiment',
    title: 'Build Your Own Constitutional AI',
    subtitle: 'Implement Anthropic\'s Constitutional AI training',
    description: 'Step-by-step workshop where you\'ll implement a simplified version of Constitutional AI, understand RLHF, and see how AI systems can be trained to follow principles.',
    tier: 'intermediate',
    topics: ['alignment', 'constitutional-ai', 'rlhf'],
    tags: ['anthropic', 'hands-on', 'alignment', 'workshop'],
    path: '/journey/deep-dives/experiments/constitutional-ai-workshop',
    readTime: 60
  },
  {
    id: 'value-learning-paradox',
    type: 'exploration',
    title: 'The Value Learning Paradox',
    subtitle: 'Why teaching human values to AI is harder than it seems',
    description: 'Philosophical exploration of why encoding human values into AI systems faces fundamental challenges, from value diversity to the orthogonality thesis.',
    tier: 'intermediate',
    topics: ['value-learning', 'alignment', 'ethics'],
    tags: ['philosophy', 'values', 'alignment', 'paradox'],
    path: '/journey/deep-dives/explorations/value-learning-paradox',
    readTime: 20
  }
]

// Helper functions
export function getHighlightsByTier(tier: Highlight['tier']): Highlight[] {
  return courseHighlights.filter(h => h.tier === tier)
}

export function getHighlightsByType(type: Highlight['type']): Highlight[] {
  return courseHighlights.filter(h => h.type === type)
}

export function getFeaturedHighlights(): Highlight[] {
  return courseHighlights.filter(h => h.featured)
}

export function getHighlightsByTopic(topicId: string): Highlight[] {
  return courseHighlights.filter(h => h.topics.includes(topicId))
}

export function getHighlightsByTag(tag: string): Highlight[] {
  return courseHighlights.filter(h => h.tags.includes(tag))
}