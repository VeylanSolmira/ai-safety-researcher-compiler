// News and updates data model and utilities

export interface NewsStory {
  id: string
  title: string
  summary: string
  content: string // Markdown content
  date: string // Story date (not publish date)
  category: 'research' | 'policy' | 'community' | 'technical' | 'opportunity' | 'general'
  tags: string[]
  author?: string
  source?: {
    name: string
    url?: string
  }
  featured?: boolean
  image?: {
    url: string
    alt: string
  }
}

// Example news stories
export const newsStories: NewsStory[] = [
  {
    id: 'cbai-fellowship-2025',
    title: 'CBAI Fellowship 2025 Opens Applications',
    summary: 'The Centre for Beneficial AI announces its 2025 fellowship program with 19+ mentors from leading AI safety organizations.',
    content: `The Centre for Beneficial AI (CBAI) has opened applications for its 2025 Fellowship program, offering an unprecedented opportunity for aspiring AI safety researchers.

## Key Details

- **19+ mentors** from organizations including Anthropic, DeepMind, MIRI, and more
- **Research areas** spanning interpretability, alignment, governance, and policy
- **Duration**: 3-6 months with flexible start dates
- **Format**: Remote-first with optional in-person components

## Application Timeline

- Applications open: January 2025
- Deadline: February 15, 2025
- Decisions: March 1, 2025

The fellowship provides mentorship, research resources, and connections to the broader AI safety community.`,
    date: '2025-01-15',
    category: 'opportunity',
    tags: ['fellowship', 'cbai', 'mentorship', 'research'],
    featured: true
  },
  {
    id: 'claude-3-safety-paper',
    title: 'Anthropic Publishes Claude 3 Safety Research',
    summary: 'New paper details constitutional AI improvements and safety evaluations for Claude 3 model family.',
    content: `Anthropic has released a comprehensive paper on the safety measures implemented in Claude 3...`,
    date: '2025-01-12',
    category: 'research',
    tags: ['anthropic', 'claude', 'constitutional-ai', 'safety-research'],
    source: {
      name: 'Anthropic Blog',
      url: 'https://anthropic.com/research/claude-3-safety'
    }
  },
  {
    id: 'eu-ai-act-implementation',
    title: 'EU AI Act Implementation Guidelines Released',
    summary: 'European Commission publishes detailed implementation guidelines for the AI Act, with specific provisions for high-risk AI systems.',
    content: `The European Commission has released comprehensive implementation guidelines for the EU AI Act...`,
    date: '2025-01-10',
    category: 'policy',
    tags: ['eu', 'regulation', 'ai-act', 'governance'],
    source: {
      name: 'European Commission',
      url: 'https://ec.europa.eu/ai-act-implementation'
    }
  },
  {
    id: 'mats-winter-2025',
    title: 'MATS Winter 2025 Cohort Begins',
    summary: 'The ML Alignment & Theory Scholars program welcomes its largest cohort yet with 40 researchers.',
    content: `The Machine Learning Alignment & Theory Scholars (MATS) program has begun its Winter 2025 cohort...`,
    date: '2025-01-08',
    category: 'community',
    tags: ['mats', 'training', 'alignment', 'research-program']
  },
  {
    id: 'openai-superalignment-update',
    title: 'OpenAI Announces Superalignment Research Progress',
    summary: 'New techniques for scalable oversight show promising results in early experiments.',
    content: `OpenAI's Superalignment team has shared updates on their research into scalable oversight methods...`,
    date: '2025-01-05',
    category: 'research',
    tags: ['openai', 'superalignment', 'scalable-oversight'],
    source: {
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog/superalignment-progress'
    }
  }
]

// Get all news stories sorted by date (newest first)
export function getAllNewsStories(): NewsStory[] {
  return [...newsStories].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// Get news by category
export function getNewsByCategory(category: NewsStory['category']): NewsStory[] {
  return getAllNewsStories().filter(story => story.category === category)
}

// Get featured news
export function getFeaturedNews(): NewsStory[] {
  return getAllNewsStories().filter(story => story.featured)
}

// Get news by tag
export function getNewsByTag(tag: string): NewsStory[] {
  return getAllNewsStories().filter(story => 
    story.tags.includes(tag.toLowerCase())
  )
}

// Get recent news (last 30 days)
export function getRecentNews(days: number = 30): NewsStory[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  return getAllNewsStories().filter(story => 
    new Date(story.date) >= cutoffDate
  )
}

// Get news story by ID
export function getNewsStoryById(id: string): NewsStory | undefined {
  return newsStories.find(story => story.id === id)
}

// Format date for display
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>()
  newsStories.forEach(story => {
    story.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

// Get all categories with counts
export function getCategoriesWithCounts(): { category: NewsStory['category']; count: number }[] {
  const counts = new Map<NewsStory['category'], number>()
  
  newsStories.forEach(story => {
    counts.set(story.category, (counts.get(story.category) || 0) + 1)
  })
  
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}