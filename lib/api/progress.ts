// Database-backed progress tracking functions

import { getDb } from '@/lib/db'
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
          completedAt: new Date().toISOString(),
          metadata: JSON.stringify({ tierId, moduleId })
        })
        .where(eq(schema.userCompletions.id, existing.id))
        .run()
    } else {
      // Insert new record
      db.insert(schema.userCompletions)
        .values({
          id: `${userId}-${topicId}-${Date.now()}`,
          userId,
          itemType: 'topic',
          itemId: topicId,
          completedAt: new Date().toISOString(),
          metadata: JSON.stringify({ tierId, moduleId })
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
      const metadata = JSON.parse(completion.metadata || '{}')
      const { tierId, moduleId } = metadata
      
      if (!topicsCompleted[tierId]) {
        topicsCompleted[tierId] = {}
      }
      if (!topicsCompleted[tierId][moduleId]) {
        topicsCompleted[tierId][moduleId] = []
      }
      topicsCompleted[tierId][moduleId].push(completion.itemId)
    } else if (completion.itemType === 'module') {
      const metadata = JSON.parse(completion.metadata || '{}')
      const { tierId } = metadata
      
      if (!modulesCompleted[tierId]) {
        modulesCompleted[tierId] = []
      }
      modulesCompleted[tierId].push(completion.itemId)
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
    tiersStarted: progressSummary ? JSON.parse(progressSummary.tiersStarted || '[]') : [],
    modulesCompleted,
    topicsCompleted,
    choices: progressSummary ? JSON.parse(progressSummary.choices || '{}') : {},
    lastUpdated: progressSummary?.lastUpdated || new Date().toISOString()
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
  
  const completedTopics = db
    .select()
    .from(schema.userCompletions)
    .where(
      and(
        eq(schema.userCompletions.userId, userId),
        eq(schema.userCompletions.itemType, 'topic')
      )
    )
    .all()
    .filter(c => {
      const metadata = JSON.parse(c.metadata || '{}')
      return metadata.moduleId === moduleId
    })
  
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
          id: `${userId}-${moduleId}-${Date.now()}`,
          userId,
          itemType: 'module',
          itemId: moduleId,
          completedAt: new Date().toISOString(),
          metadata: JSON.stringify({ tierId })
        })
        .run()
    }
    
    // Check if all modules in tier are complete
    const tierModules = db
      .select()
      .from(schema.modules)
      .where(eq(schema.modules.tierId, tierId))
      .all()
    
    const completedModules = db
      .select()
      .from(schema.userCompletions)
      .where(
        and(
          eq(schema.userCompletions.userId, userId),
          eq(schema.userCompletions.itemType, 'module')
        )
      )
      .all()
      .filter(c => {
        const metadata = JSON.parse(c.metadata || '{}')
        return metadata.tierId === tierId
      })
    
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
            id: `${userId}-${tierId}-${Date.now()}`,
            userId,
            itemType: 'tier',
            itemId: tierId,
            completedAt: new Date().toISOString(),
            metadata: '{}'
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
        lastUpdated: new Date().toISOString()
      })
      .where(eq(schema.userProgress.userId, userId))
      .run()
  } else {
    db.insert(schema.userProgress)
      .values({
        id: `${userId}-${Date.now()}`,
        userId,
        currentTierId: tierId,
        currentModuleId: moduleId,
        tiersStarted: JSON.stringify([tierId]),
        choices: '{}',
        lastUpdated: new Date().toISOString()
      })
      .run()
  }
}

// Get progress statistics
export function getProgressStatsDb(userId: string) {
  const db = getDb()
  
  const stats = db
    .select({
      totalTopics: schema.sql<number>`count(distinct ${schema.topics.id})`,
      completedTopics: schema.sql<number>`count(distinct ${schema.userCompletions.itemId})`,
      totalModules: schema.sql<number>`count(distinct ${schema.modules.id})`,
      completedModules: schema.sql<number>`(
        select count(distinct item_id) 
        from user_completions 
        where user_id = ${userId} 
        and item_type = 'module'
      )`,
      totalTiers: schema.sql<number>`count(distinct ${schema.tiers.id})`,
      completedTiers: schema.sql<number>`(
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