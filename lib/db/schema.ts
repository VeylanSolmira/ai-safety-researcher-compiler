import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

// =====================================================
// JOURNEY STRUCTURE TABLES
// =====================================================

export const tiers = sqliteTable('tiers', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  level: text('level', { enum: ['foundation', 'intermediate', 'advanced', 'expert'] }),
  description: text('description'),
  estimatedDuration: text('estimated_duration'),
  type: text('type', { enum: ['linear', 'open-world'] }),
  position: integer('position').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const tierPrerequisites = sqliteTable('tier_prerequisites', {
  tierId: text('tier_id').references(() => tiers.id),
  prerequisiteId: text('prerequisite_id').references(() => tiers.id),
})

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  tierId: text('tier_id').references(() => tiers.id),
  title: text('title').notNull(),
  description: text('description'),
  estimatedTime: text('estimated_time'),
  assessmentType: text('assessment_type', { 
    enum: ['quiz', 'project', 'peer-review', 'self-assessment'] 
  }),
  position: integer('position').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const topics = sqliteTable('topics', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').references(() => modules.id),
  title: text('title').notNull(),
  description: text('description'),
  estimatedTime: text('estimated_time'),
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }),
  roadmapContentId: text('roadmap_content_id'),
  contentMarkdown: text('content_markdown'),
  hasJourneyExtras: integer('has_journey_extras', { mode: 'boolean' }).default(false),
  hasInteractiveTransition: integer('has_interactive_transition', { mode: 'boolean' }).default(false),
  assessmentId: text('assessment_id'),
  position: integer('position').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const topicTags = sqliteTable('topic_tags', {
  topicId: text('topic_id').references(() => topics.id),
  tag: text('tag').notNull(),
})

export const learningPaths = sqliteTable('learning_paths', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
})

export const modulePaths = sqliteTable('module_paths', {
  moduleId: text('module_id').references(() => modules.id),
  pathId: text('path_id').references(() => learningPaths.id),
})

// =====================================================
// RESOURCES TABLES
// =====================================================

export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { 
    enum: ['university', 'research-lab', 'company', 'think-tank', 'government'] 
  }),
  description: text('description'),
  website: text('website'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const mentors = sqliteTable('mentors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  organizationId: text('organization_id').references(() => organizations.id),
  biography: text('biography'),
  email: text('email'),
  website: text('website'),
  quickEvalRating: text('quick_eval_rating'),
  quickEvalNotes: text('quick_eval_notes'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const mentorTopics = sqliteTable('mentor_topics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mentorId: text('mentor_id').references(() => mentors.id),
  topic: text('topic').notNull(),
  description: text('description'),
  position: integer('position').default(0)
})

export const mentorQualifications = sqliteTable('mentor_qualifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mentorId: text('mentor_id').references(() => mentors.id),
  qualification: text('qualification').notNull(),
  position: integer('position').default(0)
})

export const mentorResearchAreas = sqliteTable('mentor_research_areas', {
  mentorId: text('mentor_id').references(() => mentors.id),
  area: text('area').notNull(),
})

export const researchTopics = sqliteTable('research_topics', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category', {
    enum: ['interpretability', 'alignment', 'governance', 'control', 'evaluation', 'formal-methods', 'policy']
  }),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const mentorResearchTopics = sqliteTable('mentor_research_topics', {
  mentorId: text('mentor_id').references(() => mentors.id),
  researchTopicId: text('research_topic_id').references(() => researchTopics.id),
})

export const researchJourneyMapping = sqliteTable('research_journey_mapping', {
  researchTopicId: text('research_topic_id').references(() => researchTopics.id),
  journeyTopicId: text('journey_topic_id').references(() => topics.id),
})

export const tierSkills = sqliteTable('tier_skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tierId: text('tier_id').references(() => tiers.id),
  skill: text('skill').notNull(),
  position: integer('position').default(0)
})

export const tierCareers = sqliteTable('tier_careers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tierId: text('tier_id').references(() => tiers.id),
  careerPath: text('career_path').notNull(),
  position: integer('position').default(0)
})

export const moduleObjectives = sqliteTable('module_objectives', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  moduleId: text('module_id').references(() => modules.id),
  objective: text('objective').notNull(),
  position: integer('position').default(0)
})

export const modulePracticals = sqliteTable('module_practicals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  moduleId: text('module_id').references(() => modules.id),
  component: text('component').notNull(),
  position: integer('position').default(0)
})

export const topicPaths = sqliteTable('topic_paths', {
  topicId: text('topic_id').references(() => topics.id),
  pathId: text('path_id').references(() => learningPaths.id),
})

// =====================================================
// USER PROGRESS TABLES
// =====================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  lastActive: integer('last_active', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const userProgress = sqliteTable('user_progress', {
  userId: text('user_id').primaryKey().references(() => users.id),
  currentTierId: text('current_tier_id').references(() => tiers.id),
  currentModuleId: text('current_module_id').references(() => modules.id),
  currentTopicId: text('current_topic_id').references(() => topics.id),
  totalTimeSpent: integer('total_time_spent').default(0),
  lastActivityType: text('last_activity_type'),
  lastActivityId: text('last_activity_id'),
  lastActivityTimestamp: integer('last_activity_timestamp', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
})

export const userCompletions = sqliteTable('user_completions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => users.id),
  itemType: text('item_type', { 
    enum: ['tier', 'module', 'topic', 'case_study', 'experiment', 'exploration'] 
  }),
  itemId: text('item_id').notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  timeSpent: integer('time_spent').default(0),
  score: real('score')
})

// =====================================================
// RELATIONS
// =====================================================

export const tiersRelations = relations(tiers, ({ many }) => ({
  modules: many(modules),
  prerequisites: many(tierPrerequisites, { relationName: 'tier' }),
  prerequisiteFor: many(tierPrerequisites, { relationName: 'prerequisite' }),
}))

export const modulesRelations = relations(modules, ({ one, many }) => ({
  tier: one(tiers, {
    fields: [modules.tierId],
    references: [tiers.id],
  }),
  topics: many(topics),
  paths: many(modulePaths),
}))

export const topicsRelations = relations(topics, ({ one, many }) => ({
  module: one(modules, {
    fields: [topics.moduleId],
    references: [modules.id],
  }),
  tags: many(topicTags),
}))

export const mentorsRelations = relations(mentors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [mentors.organizationId],
    references: [organizations.id],
  }),
  topics: many(mentorTopics),
  qualifications: many(mentorQualifications),
  researchAreas: many(mentorResearchAreas),
}))

export const organizationsRelations = relations(organizations, ({ many }) => ({
  mentors: many(mentors),
}))

