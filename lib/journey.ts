export interface JourneySubsection {
  id: string
  title: string
  roadmapContentId: string // ID of the roadmap content node
  estimatedTime: string
}

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
  subsections?: JourneySubsection[] // Optional subsections that can be completed independently
}

export interface JourneyProgress {
  userId?: string // For future user auth
  currentSection: string
  sectionsCompleted: string[]
  sectionsStarted: string[]
  subsectionsCompleted: Record<string, string[]> // Track completed subsections per section
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