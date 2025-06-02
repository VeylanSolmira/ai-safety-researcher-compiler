// API functions for journey data
// These replace direct imports of the large journey.ts file

import { getDb, eq, and, asc, desc, sql } from '../db'
import * as schema from '../db/schema'
import type { Topic } from '../journey'

const db = getDb()

// Get all tiers with their modules and topics
export async function getAllTiers() {
  const tiers = await db
    .select()
    .from(schema.tiers)
    .orderBy(asc(schema.tiers.position))
    .all()
  
  // For each tier, get modules
  const tiersWithModules = await Promise.all(
    tiers.map(async (tier) => {
      const modules = await db
        .select()
        .from(schema.modules)
        .where(eq(schema.modules.tierId, tier.id))
        .orderBy(asc(schema.modules.position))
        .all()
      
      // For each module, get topics
      const modulesWithTopics = await Promise.all(
        modules.map(async (module) => {
          const topics = await db
            .select()
            .from(schema.topics)
            .where(eq(schema.topics.moduleId, module.id))
            .orderBy(asc(schema.topics.position))
            .all()
          
          // Get objectives and practicals
          const objectives = await db
            .select({ objective: schema.moduleObjectives.objective })
            .from(schema.moduleObjectives)
            .where(eq(schema.moduleObjectives.moduleId, module.id))
            .orderBy(asc(schema.moduleObjectives.position))
            .all()
          
          const practicals = await db
            .select({ component: schema.modulePracticals.component })
            .from(schema.modulePracticals)
            .where(eq(schema.modulePracticals.moduleId, module.id))
            .orderBy(asc(schema.modulePracticals.position))
            .all()
          
          return {
            ...module,
            topics,
            learningObjectives: objectives.map(o => o.objective),
            practicalComponents: practicals.map(p => p.component)
          }
        })
      )
      
      // Get tier metadata
      const skills = await db
        .select({ skill: schema.tierSkills.skill })
        .from(schema.tierSkills)
        .where(eq(schema.tierSkills.tierId, tier.id))
        .orderBy(asc(schema.tierSkills.position))
        .all()
      
      const careers = await db
        .select({ careerPath: schema.tierCareers.careerPath })
        .from(schema.tierCareers)
        .where(eq(schema.tierCareers.tierId, tier.id))
        .orderBy(asc(schema.tierCareers.position))
        .all()
      
      const prerequisites = await db
        .select({ prerequisiteId: schema.tierPrerequisites.prerequisiteId })
        .from(schema.tierPrerequisites)
        .where(eq(schema.tierPrerequisites.tierId, tier.id))
        .all()
      
      return {
        ...tier,
        modules: modulesWithTopics,
        skillsGained: skills.map(s => s.skill),
        careerRelevance: careers.map(c => c.careerPath),
        prerequisites: prerequisites.map(p => p.prerequisiteId),
        unlocks: [] // Would need another table for this
      }
    })
  )
  
  return tiersWithModules
}

// Get a specific tier with all data
export async function getTierById(tierId: string) {
  const tier = await db
    .select()
    .from(schema.tiers)
    .where(eq(schema.tiers.id, tierId))
    .get()
  
  if (!tier) return null
  
  // Get modules for this tier
  const modules = await getModulesByTierId(tierId)
  
  // Get metadata
  const skills = await db
    .select({ skill: schema.tierSkills.skill })
    .from(schema.tierSkills)
    .where(eq(schema.tierSkills.tierId, tierId))
    .orderBy(asc(schema.tierSkills.position))
    .all()
  
  return {
    ...tier,
    modules,
    skillsGained: skills.map(s => s.skill),
    // Add other metadata as needed
  }
}

// Get modules for a tier
export async function getModulesByTierId(tierId: string) {
  const modules = await db
    .select()
    .from(schema.modules)
    .where(eq(schema.modules.tierId, tierId))
    .orderBy(asc(schema.modules.position))
    .all()
  
  return Promise.all(
    modules.map(async (module) => {
      const topics = await getTopicsByModuleId(module.id)
      const objectives = await db
        .select({ objective: schema.moduleObjectives.objective })
        .from(schema.moduleObjectives)
        .where(eq(schema.moduleObjectives.moduleId, module.id))
        .all()
      
      return {
        ...module,
        topics,
        learningObjectives: objectives.map(o => o.objective),
        practicalComponents: [] // Add if needed
      }
    })
  )
}

// Get topics for a module
export async function getTopicsByModuleId(moduleId: string) {
  const topics = await db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.moduleId, moduleId))
    .orderBy(asc(schema.topics.position))
    .all()
  
  return Promise.all(
    topics.map(async (topic) => {
      const tags = await db
        .select({ tag: schema.topicTags.tag })
        .from(schema.topicTags)
        .where(eq(schema.topicTags.topicId, topic.id))
        .all()
      
      return {
        ...topic,
        tags: tags.map(t => t.tag),
        content: topic.contentMarkdown || undefined,
        relatedCaseStudies: [], // Would need to query these
        relatedExperiments: [],
        relatedExplorations: []
      }
    })
  )
}

// Get a single topic with all details
export async function getTopicById(topicId: string) {
  const result = await db
    .select({
      topic: schema.topics,
      module: schema.modules,
      tier: schema.tiers
    })
    .from(schema.topics)
    .leftJoin(schema.modules, eq(schema.topics.moduleId, schema.modules.id))
    .leftJoin(schema.tiers, eq(schema.modules.tierId, schema.tiers.id))
    .where(eq(schema.topics.id, topicId))
    .get()
  
  if (!result || !result.topic) return null
  
  // Get tags
  const tags = await db
    .select({ tag: schema.topicTags.tag })
    .from(schema.topicTags)
    .where(eq(schema.topicTags.topicId, topicId))
    .all()
  
  return {
    ...result.topic,
    tags: tags.map(t => t.tag),
    module: result.module,
    tier: result.tier,
    content: result.topic.contentMarkdown || undefined,
    contentPersonal: result.topic.contentPersonal || undefined
  }
}

// Search topics
export async function searchTopics(query: string) {
  const results = await db
    .select({
      id: schema.topics.id,
      title: schema.topics.title,
      description: schema.topics.description,
      moduleTitle: schema.modules.title,
      tierTitle: schema.tiers.title
    })
    .from(schema.topics)
    .leftJoin(schema.modules, eq(schema.topics.moduleId, schema.modules.id))
    .leftJoin(schema.tiers, eq(schema.modules.tierId, schema.tiers.id))
    .where(
      sql`${schema.topics.title} LIKE ${`%${query}%`} OR ${schema.topics.description} LIKE ${`%${query}%`}`
    )
    .all()
  
  return results
}

// Get progress for a user
export async function getUserProgress(userId: string) {
  const progress = await db
    .select()
    .from(schema.userProgress)
    .where(eq(schema.userProgress.userId, userId))
    .get()
  
  if (!progress) {
    // Return default progress
    return {
      currentTierId: 'foundation',
      currentModuleId: undefined,
      currentTopicId: undefined,
      tiersCompleted: [],
      tiersStarted: [],
      modulesCompleted: {},
      topicsCompleted: {},
      choices: {},
      lastUpdated: new Date().toISOString()
    }
  }
  
  // Get completed items
  const completions = await db
    .select()
    .from(schema.userCompletions)
    .where(eq(schema.userCompletions.userId, userId))
    .all()
  
  // Organize completions by type
  const tiersCompleted = completions
    .filter(c => c.itemType === 'tier')
    .map(c => c.itemId)
  
  const modulesCompleted: Record<string, string[]> = {}
  const topicsCompleted: Record<string, Record<string, string[]>> = {}
  
  // This would need more complex organization logic
  
  return {
    ...progress,
    tiersCompleted,
    modulesCompleted,
    topicsCompleted,
    choices: {},
    lastUpdated: progress.updatedAt?.toISOString() || new Date().toISOString()
  }
}

// Mark topic complete
export async function markTopicComplete(userId: string, topicId: string, timeSpent = 0) {
  // Check if already completed
  const existing = await db
    .select()
    .from(schema.userCompletions)
    .where(
      and(
        eq(schema.userCompletions.userId, userId),
        eq(schema.userCompletions.itemType, 'topic'),
        eq(schema.userCompletions.itemId, topicId)
      )
    )
    .get()
  
  if (!existing) {
    await db
      .insert(schema.userCompletions)
      .values({
        userId,
        itemType: 'topic',
        itemId: topicId,
        timeSpent,
        completedAt: new Date()
      })
      .run()
  }
  
  // Update user progress
  await db
    .update(schema.userProgress)
    .set({
      lastActivityType: 'topic',
      lastActivityId: topicId,
      lastActivityTimestamp: new Date(),
      updatedAt: new Date()
    })
    .where(eq(schema.userProgress.userId, userId))
    .run()
}