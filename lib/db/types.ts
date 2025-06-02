// Database types matching the SQL schema
// These would be auto-generated with a tool like Drizzle ORM or Prisma

export interface Tier {
  id: string
  title: string
  level: 'foundation' | 'intermediate' | 'advanced' | 'expert'
  description: string | null
  estimatedDuration: string | null
  type: 'linear' | 'open-world' | null
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  tierId: string
  title: string
  description: string | null
  estimatedTime: string | null
  assessmentType: 'quiz' | 'project' | 'peer-review' | 'self-assessment' | null
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface Topic {
  id: string
  moduleId: string
  title: string
  description: string | null
  estimatedTime: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null
  roadmapContentId: string | null
  contentAcademic: string | null
  contentPersonal: string | null
  hasJourneyExtras: boolean
  hasInteractiveTransition: boolean
  assessmentId: string | null
  position: number
  createdAt: Date
  updatedAt: Date
}

export interface Mentor {
  id: string
  name: string
  organizationId: string | null
  biography: string | null
  email: string | null
  website: string | null
  quickEvalRating: string | null
  quickEvalNotes: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  type: 'university' | 'research-lab' | 'company' | 'think-tank' | 'government'
  description: string | null
  website: string | null
  createdAt: Date
}

export interface UserProgress {
  userId: string
  currentTierId: string | null
  currentModuleId: string | null
  currentTopicId: string | null
  totalTimeSpent: number
  lastActivityType: string | null
  lastActivityId: string | null
  lastActivityTimestamp: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserCompletion {
  id: number
  userId: string
  itemType: 'tier' | 'module' | 'topic' | 'case_study' | 'experiment' | 'exploration'
  itemId: string
  completedAt: Date
  timeSpent: number
  score: number | null
}

// Joined types for common queries
export interface TopicWithRelations extends Topic {
  module?: Module & { tier?: Tier }
  tags?: string[]
  caseStudies?: string[]
  experiments?: string[]
  explorations?: string[]
}

export interface ModuleWithTopics extends Module {
  topics: Topic[]
  learningObjectives?: string[]
  practicalComponents?: string[]
}

export interface TierWithModules extends Tier {
  modules: ModuleWithTopics[]
  prerequisites?: string[]
  skills?: string[]
  careers?: string[]
}

export interface MentorWithDetails extends Mentor {
  organization?: Organization
  topics?: string[]
  qualifications?: string[]
  researchAreas?: string[]
}