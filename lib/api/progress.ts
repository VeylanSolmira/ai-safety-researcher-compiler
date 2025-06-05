// Database-backed progress tracking functions

import { getDb } from '@/lib/db'
import { sql } from 'drizzle-orm'
import * as schema from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// Mark a topic as complete in the database
export async function markTopicCompleteDb(
  userId: string,
  topicId: string,
  tierId: string,
  moduleId: string,
  completed: boolean = true
) {
  const db = getDb()
  
  if (completed) {
    // Insert or update completion record
    const existing = db
      .select()
      .from(schema.userCompletions)
      .where(
        and(
          eq(schema.userCompletions.userId, userId),
          eq(schema.userCompletions.itemId, topicId),
          eq(schema.userCompletions.itemType, 'topic')
        )
      )
      .get()
    
    if (existing) {
      // Update existing record
      db.update(schema.userCompletions)
        .set({
          completedAt: new Date()
        })
        .where(eq(schema.userCompletions.id, existing.id))
        .run()
    } else {
      // Insert new record
      db.insert(schema.userCompletions)
        .values({
          userId,
          itemType: 'topic',
          itemId: topicId,
          completedAt: new Date()
        })
        .run()
    }
    
    // Update user progress summary
    updateProgressSummary(userId, tierId, moduleId)
  } else {
    // Remove completion record
    db.delete(schema.userCompletions)
      .where(
        and(
          eq(schema.userCompletions.userId, userId),
          eq(schema.userCompletions.itemId, topicId),
          eq(schema.userCompletions.itemType, 'topic')
        )
      )
      .run()
    
    updateProgressSummary(userId, tierId, moduleId)
  }
}

// Get user progress from database
export function getUserProgressDb(userId: string) {
  const db = getDb()
  
  // Get all completions
  const completions = db
    .select()
    .from(schema.userCompletions)
    .where(eq(schema.userCompletions.userId, userId))
    .all()
  
  // Get progress summary
  const progressSummary = db
    .select()
    .from(schema.userProgress)
    .where(eq(schema.userProgress.userId, userId))
    .get()
  
  // Transform into journey progress format
  const topicsCompleted: Record<string, Record<string, string[]>> = {}
  const modulesCompleted: Record<string, string[]> = {}
  const tiersCompleted: string[] = []
  
  completions.forEach(completion => {
    if (completion.itemType === 'topic') {
      // TODO: Without metadata, we need to look up the topic's tier/module
      // For now, we'll skip topic completions in the progress summary
    } else if (completion.itemType === 'module') {
      // TODO: Without metadata, we need to look up the module's tier
      // For now, we'll skip module completions in the progress summary
    } else if (completion.itemType === 'tier') {
      tiersCompleted.push(completion.itemId)
    }
  })
  
  return {
    userId,
    currentTierId: progressSummary?.currentTierId || 'foundation',
    currentModuleId: progressSummary?.currentModuleId,
    currentTopicId: progressSummary?.currentTopicId,
    tiersCompleted,
    tiersStarted: [], // Not stored in current schema
    modulesCompleted,
    topicsCompleted,
    choices: {}, // Not stored in current schema
    lastUpdated: progressSummary?.updatedAt?.toISOString() || new Date().toISOString()
  }
}

// Update progress summary
function updateProgressSummary(userId: string, tierId: string, moduleId: string) {
  const db = getDb()
  
  // Check if all topics in module are complete
  const moduleTopics = db
    .select()
    .from(schema.topics)
    .where(eq(schema.topics.moduleId, moduleId))
    .all()
  
  // Get all topic completions for this user
  // Note: We can't filter by moduleId directly as it's not stored in completions
  const allTopicCompletions = db
    .select()
    .from(schema.userCompletions)
    .where(
      and(
        eq(schema.userCompletions.userId, userId),
        eq(schema.userCompletions.itemType, 'topic')
      )
    )
    .all()
  
  // Filter to only completions for topics in this module
  const completedTopics = allTopicCompletions.filter(c => 
    moduleTopics.some(topic => topic.id === c.itemId)
  )
  
  // If all topics complete, mark module as complete
  if (completedTopics.length === moduleTopics.length && moduleTopics.length > 0) {
    const existing = db
      .select()
      .from(schema.userCompletions)
      .where(
        and(
          eq(schema.userCompletions.userId, userId),
          eq(schema.userCompletions.itemId, moduleId),
          eq(schema.userCompletions.itemType, 'module')
        )
      )
      .get()
    
    if (!existing) {
      db.insert(schema.userCompletions)
        .values({
          userId,
          itemType: 'module',
          itemId: moduleId,
          completedAt: new Date()
        })
        .run()
    }
    
    // Check if all modules in tier are complete
    const tierModules = db
      .select()
      .from(schema.modules)
      .where(eq(schema.modules.tierId, tierId))
      .all()
    
    // Get all module completions for this user
    const allModuleCompletions = db
      .select()
      .from(schema.userCompletions)
      .where(
        and(
          eq(schema.userCompletions.userId, userId),
          eq(schema.userCompletions.itemType, 'module')
        )
      )
      .all()
    
    // Filter to only completions for modules in this tier
    const completedModules = allModuleCompletions.filter(c => 
      tierModules.some(module => module.id === c.itemId)
    )
    
    if (completedModules.length === tierModules.length && tierModules.length > 0) {
      const tierExisting = db
        .select()
        .from(schema.userCompletions)
        .where(
          and(
            eq(schema.userCompletions.userId, userId),
            eq(schema.userCompletions.itemId, tierId),
            eq(schema.userCompletions.itemType, 'tier')
          )
        )
        .get()
      
      if (!tierExisting) {
        db.insert(schema.userCompletions)
          .values({
            userId,
            itemType: 'tier',
            itemId: tierId,
            completedAt: new Date()
          })
          .run()
      }
    }
  }
  
  // Update or create progress summary
  const existing = db
    .select()
    .from(schema.userProgress)
    .where(eq(schema.userProgress.userId, userId))
    .get()
  
  if (existing) {
    db.update(schema.userProgress)
      .set({
        currentTierId: tierId,
        currentModuleId: moduleId,
        updatedAt: new Date()
      })
      .where(eq(schema.userProgress.userId, userId))
      .run()
  } else {
    db.insert(schema.userProgress)
      .values({
        userId,
        currentTierId: tierId,
        currentModuleId: moduleId
      })
      .run()
  }
}

// Get progress statistics
export function getProgressStatsDb(userId: string) {
  const db = getDb()
  
  const stats = db
    .select({
      totalTopics: sql<number>`count(distinct ${schema.topics.id})`,
      completedTopics: sql<number>`count(distinct ${schema.userCompletions.itemId})`,
      totalModules: sql<number>`count(distinct ${schema.modules.id})`,
      completedModules: sql<number>`(
        select count(distinct item_id) 
        from user_completions 
        where user_id = ${userId} 
        and item_type = 'module'
      )`,
      totalTiers: sql<number>`count(distinct ${schema.tiers.id})`,
      completedTiers: sql<number>`(
        select count(distinct item_id) 
        from user_completions 
        where user_id = ${userId} 
        and item_type = 'tier'
      )`
    })
    .from(schema.topics)
    .leftJoin(
      schema.userCompletions,
      and(
        eq(schema.userCompletions.itemId, schema.topics.id),
        eq(schema.userCompletions.itemType, 'topic'),
        eq(schema.userCompletions.userId, userId)
      )
    )
    .leftJoin(schema.modules, eq(schema.topics.moduleId, schema.modules.id))
    .leftJoin(schema.tiers, eq(schema.modules.tierId, schema.tiers.id))
    .get()
  
  return {
    topics: {
      total: stats?.totalTopics || 0,
      completed: stats?.completedTopics || 0,
      percentage: stats?.totalTopics ? Math.round((stats.completedTopics / stats.totalTopics) * 100) : 0
    },
    modules: {
      total: stats?.totalModules || 0,
      completed: stats?.completedModules || 0,
      percentage: stats?.totalModules ? Math.round((stats.completedModules / stats.totalModules) * 100) : 0
    },
    tiers: {
      total: stats?.totalTiers || 0,
      completed: stats?.completedTiers || 0,
      percentage: stats?.totalTiers ? Math.round((stats.completedTiers / stats.totalTiers) * 100) : 0
    }
  }
}