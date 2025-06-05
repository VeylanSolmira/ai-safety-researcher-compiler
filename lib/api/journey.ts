// API functions for journey data
// These replace direct imports of the large journey.ts file

import { getDb, eq, and, asc, desc, sql } from '../db'
import * as schema from '../db/schema'
import type { Topic } from '../journey'
import { getMentorsForTopic, getMentorDisplayName, getMentorOrganization } from '../db/mentor-queries'

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
          const rawTopics = await db
            .select()
            .from(schema.topics)
            .where(eq(schema.topics.moduleId, module.id))
            .orderBy(asc(schema.topics.position))
            .all()
          
          // Map database fields to Topic interface
          const topics = rawTopics.map(topic => {
            const { contentAcademic, ...topicWithoutContentAcademic } = topic
            return {
              ...topicWithoutContentAcademic,
              content: contentAcademic || undefined,
              contentPersonal: topic.contentPersonal || undefined,
            }
          })
          
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
          
          // Get module paths
          const paths = await db
            .select({ pathId: schema.modulePaths.pathId })
            .from(schema.modulePaths)
            .where(eq(schema.modulePaths.moduleId, module.id))
            .all()
          
          return {
            ...module,
            topics,
            learningObjectives: objectives.map(o => o.objective),
            practicalComponents: practicals.map(p => p.component),
            paths: paths.map(p => p.pathId)
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
      
      // Get module paths
      const paths = await db
        .select({ pathId: schema.modulePaths.pathId })
        .from(schema.modulePaths)
        .where(eq(schema.modulePaths.moduleId, module.id))
        .all()
      
      return {
        ...module,
        topics,
        learningObjectives: objectives.map(o => o.objective),
        practicalComponents: [], // Add if needed
        paths: paths.map(p => p.pathId)
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
      
      const { contentAcademic, ...topicWithoutContentAcademic } = topic
      
      return {
        ...topicWithoutContentAcademic,
        tags: tags.map((t: any) => t.tag),
        // Map contentAcademic to content (as expected by Topic interface)
        // Handle Buffer conversion if content was stored as BLOB
        content: contentAcademic ? 
          (Buffer.isBuffer(contentAcademic) ? contentAcademic.toString('utf-8') : contentAcademic) : 
          undefined,
        contentPersonal: topic.contentPersonal ? 
          (Buffer.isBuffer(topic.contentPersonal) ? topic.contentPersonal.toString('utf-8') : topic.contentPersonal) : 
          undefined,
        relatedCaseStudies: [], // Would need to query these
        relatedExperiments: [],
        relatedExplorations: []
      }
    })
  )
}

// Get a single topic with all details
export async function getTopicById(topicId: string) {
  // Use raw SQLite for now due to Drizzle issues
  const Database = require('better-sqlite3')
  const path = require('path')
  // Use the same database selection logic as the main db module
  const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'journey-public.db')
    : path.join(process.cwd(), 'journey-dev.db')
  const sqlite = new Database(dbPath)
  sqlite.pragma('foreign_keys = ON')
  
  try {
    const topic = sqlite.prepare(`
      SELECT 
        t.*,
        m.id as module_id,
        m.title as module_title,
        tier.id as tier_id,
        tier.title as tier_title
      FROM topics t
      LEFT JOIN modules m ON t.module_id = m.id
      LEFT JOIN tiers tier ON m.tier_id = tier.id
      WHERE t.id = ?
    `).get(topicId)
    
    if (!topic) return null
  
    // Get tags
    const tags = sqlite.prepare(`
      SELECT tag FROM topic_tags WHERE topic_id = ?
    `).all(topicId)
    
    // Get mentor data for this topic using the same connection
    let mentors = []
    try {
      const mentorMappings = sqlite.prepare(`
        SELECT 
          et.entity_id as mentorId,
          et.description as mentorTopicDescription,
          et.context
        FROM entity_topics et
        JOIN entities e ON et.entity_id = e.id
        WHERE et.topic_id = ? AND e.type = 'researcher'
        ORDER BY et.entity_id
      `).all(topicId)
      
      mentors = mentorMappings.map((mapping: any) => ({
        id: mapping.mentorId,
        name: getMentorDisplayName(mapping.mentorId),
        organization: getMentorOrganization(mapping.mentorId),
        researchDescription: mapping.mentorTopicDescription,
        context: mapping.context
      }))
    } catch (mentorError) {
      console.error('Error getting mentors for topic:', mentorError)
      // Continue without mentors
    }
    
    // Map database fields
    const { content_academic, content_personal, module_id, ...topicData } = topic
    
    // Debug logging for production
    if (process.env.NODE_ENV === 'production') {
      console.log(`Topic ${topicId} content check:`, {
        has_content_academic: !!content_academic,
        academic_length: content_academic?.length || 0,
        has_content_personal: !!content_personal,
        personal_length: content_personal?.length || 0
      })
    }
    
    return {
      ...topicData,
      moduleId: module_id,
      tags: tags.map((t: any) => t.tag),
      module: topic.module_id ? {
        id: topic.module_id,
        title: topic.module_title
      } : undefined,
      tier: topic.tier_id ? {
        id: topic.tier_id,
        title: topic.tier_title  
      } : undefined,
      mentors: mentors.length > 0 ? mentors : undefined,
      content: content_academic || undefined,
      contentAcademic: content_academic || undefined,
      contentPersonal: content_personal || undefined,
    }
  } finally {
    sqlite.close()
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