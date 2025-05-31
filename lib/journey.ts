export interface JourneySection {
  id: string
  title: string
  type: 'linear' | 'open-world' // Linear = mandatory path, Open-world = choice-based
  contentType: 'build' | 'learn' | 'mixed'
  description: string
  estimatedTime: string // e.g., "30 minutes"
  prerequisites: string[] // Section IDs that must be completed first
  unlocks: string[] // Section IDs that this unlocks
  roadmapContentIds?: string[] // IDs of roadmap content to include
  hasAdditionalContent?: boolean // Whether this section has journey-specific extras
}

export interface JourneyProgress {
  userId?: string // For future user auth
  currentSection: string
  sectionsCompleted: string[]
  sectionsStarted: string[]
  choices: Record<string, any> // Store user choices in open-world sections
  lastUpdated: string
}

// Journey structure definition
export const journeySections: JourneySection[] = [
  {
    id: 'introduction',
    title: 'Welcome to AI Safety',
    type: 'linear',
    contentType: 'mixed',
    description: 'Begin your journey into AI Safety Research',
    estimatedTime: '45 minutes',
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
    estimatedTime: '45 minutes',
    prerequisites: ['fundamentals-hub'],
    unlocks: ['intermediate-hub']
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
    choices: {},
    lastUpdated: new Date().toISOString()
  }
  
  if (!progress.choices[sectionId]) {
    progress.choices[sectionId] = {}
  }
  
  progress.choices[sectionId][choiceKey] = choiceValue
  
  await saveJourneyProgress(progress)
}