// Progress tracking system - designed to work with localStorage now, database later

export interface ProgressItem {
  completed: boolean
  completedAt?: string
  startedAt?: string
  notes?: string
}

export interface UserProgress {
  userId: string // 'local' for now, actual user ID later
  progress: Record<string, ProgressItem>
  lastUpdated: string
}

const PROGRESS_KEY = 'ai-safety-progress'

// Get progress from localStorage (or database in future)
export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return {
      userId: 'local',
      progress: {},
      lastUpdated: new Date().toISOString()
    }
  }

  const stored = localStorage.getItem(PROGRESS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Invalid data, start fresh
    }
  }

  return {
    userId: 'local',
    progress: {},
    lastUpdated: new Date().toISOString()
  }
}

// Save progress to localStorage (or database in future)
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  
  progress.lastUpdated = new Date().toISOString()
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

// Mark a topic as complete
export function markTopicComplete(topicId: string, completed: boolean = true): void {
  const progress = getProgress()
  
  if (completed) {
    progress.progress[topicId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      startedAt: progress.progress[topicId]?.startedAt || new Date().toISOString()
    }
  } else {
    // Uncomplete - keep the started date
    if (progress.progress[topicId]) {
      progress.progress[topicId].completed = false
      delete progress.progress[topicId].completedAt
    }
  }
  
  saveProgress(progress)
}

// Mark a topic as started (when first viewed)
export function markTopicStarted(topicId: string): void {
  const progress = getProgress()
  
  if (!progress.progress[topicId]) {
    progress.progress[topicId] = {
      completed: false,
      startedAt: new Date().toISOString()
    }
    saveProgress(progress)
  }
}

// Get completion stats
export function getProgressStats() {
  const progress = getProgress()
  const topics = Object.keys(progress.progress)
  const completed = topics.filter(id => progress.progress[id].completed)
  
  return {
    total: topics.length,
    completed: completed.length,
    percentage: topics.length > 0 ? Math.round((completed.length / topics.length) * 100) : 0
  }
}