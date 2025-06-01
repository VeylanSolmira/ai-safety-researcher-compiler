#!/usr/bin/env node

import { getDb, tiers, modules, topics, topicTags, modulePaths, tierPrerequisites, tierSkills, tierCareers, moduleObjectives, modulePracticals, topicPaths } from '../lib/db'
import { journeyTiers } from '../lib/journey'
import type { Tier, Module, Topic } from '../lib/journey'

const db = getDb()

async function migrateJourneyData() {
  console.log('Starting journey data migration...')
  
  try {
    // Use try-catch for error handling
    try {
      let tierCount = 0
      let moduleCount = 0
      let topicCount = 0
      
      // Migrate each tier
      journeyTiers.forEach((tier, tierIndex) => {
        // Insert tier
        db.insert(tiers).values({
          id: tier.id,
          title: tier.title,
          level: tier.level,
          description: tier.description,
          estimatedDuration: tier.estimatedDuration,
          type: tier.type,
          position: tierIndex
        }).run()
        tierCount++
        
        // Insert tier prerequisites
        tier.prerequisites.forEach(prereqId => {
          db.insert(tierPrerequisites).values({
            tierId: tier.id,
            prerequisiteId: prereqId
          }).run()
        })
        
        // Insert tier skills
        tier.skillsGained.forEach((skill, index) => {
          db.insert(tierSkills).values({
            tierId: tier.id,
            skill: skill,
            position: index
          }).run()
        })
        
        // Insert tier careers
        tier.careerRelevance.forEach((career, index) => {
          db.insert(tierCareers).values({
            tierId: tier.id,
            careerPath: career,
            position: index
          }).run()
        })
        
        // Migrate modules
        tier.modules.forEach((module, moduleIndex) => {
          // Insert module
          db.insert(modules).values({
            id: module.id,
            tierId: tier.id,
            title: module.title,
            description: module.description,
            estimatedTime: module.estimatedTime,
            assessmentType: module.assessmentType,
            position: moduleIndex
          }).run()
          moduleCount++
          
          // Insert module objectives
          module.learningObjectives.forEach((objective, index) => {
            db.insert(moduleObjectives).values({
              moduleId: module.id,
              objective: objective,
              position: index
            }).run()
          })
          
          // Insert module practical components
          if (module.practicalComponents) {
            module.practicalComponents.forEach((component, index) => {
              db.insert(modulePracticals).values({
                moduleId: module.id,
                component: component,
                position: index
              }).run()
            })
          }
          
          // Insert module paths
          if (module.paths) {
            module.paths.forEach(pathId => {
              db.insert(modulePaths).values({
                moduleId: module.id,
                pathId: pathId
              }).run()
            })
          }
          
          // Migrate topics
          module.topics.forEach((topic, topicIndex) => {
            // Insert topic
            db.insert(topics).values({
              id: topic.id,
              moduleId: module.id,
              title: topic.title,
              description: topic.description,
              estimatedTime: topic.estimatedTime,
              difficulty: topic.difficulty,
              roadmapContentId: topic.roadmapContentId || null,
              contentMarkdown: topic.content || null,
              hasJourneyExtras: topic.hasJourneyExtras || false,
              hasInteractiveTransition: topic.hasInteractiveTransition || false,
              assessmentId: topic.assessmentId || null,
              position: topicIndex
            }).run()
            topicCount++
            
            // Insert topic tags
            if (topic.tags) {
              topic.tags.forEach(tag => {
                db.insert(topicTags).values({
                  topicId: topic.id,
                  tag: tag
                }).run()
              })
            }
            
            // Insert topic paths
            if (topic.paths) {
              topic.paths.forEach(pathId => {
                db.insert(topicPaths).values({
                  topicId: topic.id,
                  pathId: pathId
                }).run()
              })
            }
          })
        })
      })
      
      console.log(`✅ Migration complete!`)
      console.log(`   - ${tierCount} tiers`)
      console.log(`   - ${moduleCount} modules`)
      console.log(`   - ${topicCount} topics`)
    } catch (innerError) {
      throw innerError
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateJourneyData()