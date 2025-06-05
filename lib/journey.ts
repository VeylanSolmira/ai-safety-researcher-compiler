// Define available learning paths
export type LearningPath = 'all' | 'technical-safety' | 'governance' | 'engineering' | 'research'

// Topic - the most granular level of content
export interface Topic {
  id: string
  title: string
  description: string
  estimatedTime?: string | number
  
  // Content sources
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
  
  // Mentor connections
  mentors?: {
    id: string
    name: string
    organization: string
    researchDescription: string
    context: string
  }[]
}

// Module - contains related topics
export interface Module {
  id: string
  title: string
  description: string
  estimatedTime?: string
  topics: Topic[]
  
  // Module metadata
  learningObjectives?: string[]
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
  type?: 'linear' | 'open-world' // Linear = mandatory path, Open-world = choice-based
  prerequisites?: string[] // Tier IDs that must be completed first
  unlocks?: string[] // Tier IDs that this unlocks
  
  // Tier metadata
  skillsGained?: string[]
  careerRelevance?: string[]
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

// Legacy journey data removed - database is now the only source of truth
// Use API calls via hooks/useJourneyData.ts instead

// Utility functions for navigation
// DEPRECATED: These functions require static data that no longer exists
// Use hooks/useJourneyData.ts or API calls instead
export function getTier(tierId: string): Tier | undefined {
  console.warn('getTier is deprecated - use useJourneyData hook or API calls')
  return undefined
}

export function getModule(tierId: string, moduleId: string): Module | undefined {
  const tier = getTier(tierId)
  return tier?.modules.find(m => m.id === moduleId)
}

export function getTopic(tierId: string, moduleId: string, topicId: string): Topic | undefined {
  const foundModule = getModule(tierId, moduleId)
  return foundModule?.topics.find(topic => topic.id === topicId)
}

export function getNextTopic(tierId: string, moduleId: string, currentTopicId: string): Topic | undefined {
  const foundModule = getModule(tierId, moduleId)
  if (!foundModule) return undefined
  
  const currentIndex = foundModule.topics.findIndex(t => t.id === currentTopicId)
  if (currentIndex === -1 || currentIndex === foundModule.topics.length - 1) return undefined
  
  return foundModule.topics[currentIndex + 1]
}

export function getPreviousTopic(tierId: string, moduleId: string, currentTopicId: string): Topic | undefined {
  const foundModule = getModule(tierId, moduleId)
  if (!foundModule) return undefined
  
  const currentIndex = foundModule.topics.findIndex(t => t.id === currentTopicId)
  if (currentIndex <= 0) return undefined
  
  return foundModule.topics[currentIndex - 1]
}

export function getNextModule(tierId: string, currentModuleId: string): Module | undefined {
  const tier = getTier(tierId)
  if (!tier) return undefined
  
  const currentIndex = tier.modules.findIndex(m => m.id === currentModuleId)
  if (currentIndex === -1 || currentIndex === tier.modules.length - 1) return undefined
  
  return tier.modules[currentIndex + 1]
}

// Progress tracking utilities
export async function getJourneyProgress(): Promise<JourneyProgress | null> {
  // This will be replaced with actual progress tracking
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('journey-progress')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export async function saveJourneyProgress(progress: JourneyProgress): Promise<void> {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('journey-progress', JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save progress:', error)
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
  const foundModule = getModule(tierId, moduleId)
  if (foundModule) {
    const allTopicsComplete = foundModule.topics.every(topic =>
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
    const allModulesComplete = tier.modules.every(m =>
      progress.modulesCompleted[tierId].includes(m.id)
    )
    
    if (allModulesComplete && !progress.tiersCompleted.includes(tierId)) {
      progress.tiersCompleted.push(tierId)
    }
  }
  
  progress.lastUpdated = new Date().toISOString()
  await saveJourneyProgress(progress)
}

// Search functionality
// DEPRECATED: Use API endpoint /api/journey/search instead
export function searchTopics(query: string): Array<{topic: Topic; tierId: string; moduleId: string}> {
  console.warn('searchTopics is deprecated - use /api/journey/search endpoint')
  return []
}

// Progress calculation utilities
export function getTierProgress(tierId: string, progress: JourneyProgress): {
  completed: number
  total: number
  percentage: number
} {
  const tier = getTier(tierId)
  if (!tier) return { completed: 0, total: 0, percentage: 0 }
  
  let completed = 0
  let total = 0
  
  for (const mod of tier.modules) {
    total += mod.topics.length
    const moduleTopics = progress.topicsCompleted?.[tierId]?.[mod.id] || []
    completed += moduleTopics.length
  }
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}

export function getModuleProgress(tierId: string, moduleId: string, progress: JourneyProgress): {
  completed: number
  total: number
  percentage: number
} {
  const foundModule = getModule(tierId, moduleId)
  if (!foundModule) return { completed: 0, total: 0, percentage: 0 }
  
  const total = foundModule.topics.length
  const completed = progress.topicsCompleted?.[tierId]?.[moduleId]?.length || 0
  
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}