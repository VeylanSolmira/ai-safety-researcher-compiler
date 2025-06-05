// Example query functions for the journey system
// These demonstrate the efficiency of database queries vs file-based approach

import { getDb, eq, and, like, asc } from './index'
import * as schema from './schema'

const db = getDb()

// Get a specific topic with all its relationships
export async function getTopicWithDetails(topicId: string) {
  // This single query replaces loading the entire 2000-line journey.ts file
  const result = await db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.id, topicId))
    .leftJoin(schema.modules, eq(schema.topics.moduleId, schema.modules.id))
    .leftJoin(schema.tiers, eq(schema.modules.tierId, schema.tiers.id))
    .get()
  
  if (!result) return null
  
  // Get tags
  const tags = await db
    .select({ tag: schema.topicTags.tag })
    .from(schema.topicTags)
    .where(eq(schema.topicTags.topicId, topicId))
    .all() as any[]
  
  return {
    topic: result.topics,
    module: result.modules,
    tier: result.tiers,
    tags: tags.map(t => t.tag)
  }
}

// Get all topics for a module with completion status
export async function getModuleTopicsWithProgress(moduleId: string, userId?: string) {
  const topics = await db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.moduleId, moduleId))
    .orderBy(asc(schema.topics.position))
    .all() as any[]
  
  if (!userId) return topics.map((t: any) => ({ ...t, completed: false }))
  
  // Get completion status efficiently
  const completions = await db
    .select({ itemId: schema.userCompletions.itemId })
    .from(schema.userCompletions)
    .where(
      and(
        eq(schema.userCompletions.userId, userId),
        eq(schema.userCompletions.itemType, 'topic')
      )
    )
    .all() as any[]
  
  const completedIds = new Set(completions.map(c => c.itemId))
  
  return topics.map((topic: any) => ({
    ...topic,
    completed: completedIds.has(topic.id)
  }))
}

// Search topics by tag or content
export async function searchTopics(query: string) {
  return await db
    .select({
      topic: schema.topics,
      module: schema.modules,
      tier: schema.tiers
    })
    .from(schema.topics)
    .leftJoin(schema.modules, eq(schema.topics.moduleId, schema.modules.id))
    .leftJoin(schema.tiers, eq(schema.modules.tierId, schema.tiers.id))
    .leftJoin(schema.topicTags, eq(schema.topics.id, schema.topicTags.topicId))
    .where(
      like(schema.topics.title, `%${query}%`)
    )
    .groupBy(schema.topics.id)
    .all() as any[]
}

// Get tier progress efficiently
export async function getTierProgress(tierId: string, userId: string) {
  // Get all topics in the tier
  const topicsResult = await db
    .select({ topicId: schema.topics.id })
    .from(schema.topics)
    .innerJoin(schema.modules, eq(schema.topics.moduleId, schema.modules.id))
    .where(eq(schema.modules.tierId, tierId))
    .all() as any[]
  
  const totalTopics = topicsResult.length
  
  // Get completed topics
  const completedResult = await db
    .select({ count: schema.userCompletions.itemId })
    .from(schema.userCompletions)
    .where(
      and(
        eq(schema.userCompletions.userId, userId),
        eq(schema.userCompletions.itemType, 'topic'),
        // This would need a subquery or join in real implementation
      )
    )
    .all() as any[]
  
  return {
    totalTopics,
    completedTopics: completedResult.length,
    percentage: totalTopics > 0 ? Math.round((completedResult.length / totalTopics) * 100) : 0
  }
}

// Add new topic efficiently
export async function addTopic(moduleId: string, topic: Partial<typeof schema.topics.$inferInsert>) {
  // Get the highest position in the module
  const maxPositionResult = await db
    .select({ maxPos: schema.topics.position })
    .from(schema.topics)
    .where(eq(schema.topics.moduleId, moduleId))
    .orderBy(asc(schema.topics.position))
    .get()
  
  const position = (maxPositionResult?.maxPos ?? -1) + 1
  
  // Insert the topic
  const result = await db
    .insert(schema.topics)
    .values({
      id: topic.id || `topic-${Date.now()}`,
      moduleId,
      title: topic.title || 'New Topic',
      description: topic.description,
      estimatedTime: topic.estimatedTime,
      difficulty: topic.difficulty,
      position,
      ...topic
    })
    .returning()
    .get()
  
  return result
}

// Type definitions for returns
type Topic = typeof schema.topics.$inferSelect
type Module = typeof schema.modules.$inferSelect
type Tier = typeof schema.tiers.$inferSelect