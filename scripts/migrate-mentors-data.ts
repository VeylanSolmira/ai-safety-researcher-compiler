#!/usr/bin/env node

import { getDb, organizations, mentors, mentorTopics, mentorQualifications, mentorResearchAreas, researchTopics, mentorResearchTopics, researchJourneyMapping } from '../lib/db'
import { cbai2025Mentors, organizations as orgsData, researchTopics as topicsData } from '../lib/resources/cbai-2025-mentors'

const db = getDb()

async function migrateMentorsData() {
  console.log('Starting mentors data migration...')
  
  try {
    try {
      let orgCount = 0
      let mentorCount = 0
      let topicCount = 0
      
      // Insert organizations
      orgsData.forEach(org => {
        db.insert(organizations).values({
          id: org.id,
          name: org.name,
          type: org.type,
          description: null,
          website: null
        }).run()
        orgCount++
      })
      
      // Insert research topics
      topicsData.forEach(topic => {
        db.insert(researchTopics).values({
          id: topic.id,
          name: topic.name,
          category: topic.category,
          description: null
        }).run()
        topicCount++
        
        // Map to journey topics if available
        if (topic.relatedJourneyTopics) {
          topic.relatedJourneyTopics.forEach(journeyTopicId => {
            try {
              db.insert(researchJourneyMapping).values({
                researchTopicId: topic.id,
                journeyTopicId: journeyTopicId
              }).run()
            } catch (e) {
              // Journey topic might not exist yet
              console.warn(`Skipping mapping for non-existent journey topic: ${journeyTopicId}`)
            }
          })
        }
      })
      
      // Insert mentors
      cbai2025Mentors.forEach(mentor => {
        db.insert(mentors).values({
          id: mentor.id,
          name: mentor.name,
          organizationId: mentor.organization ? 
            orgsData.find(o => o.name === mentor.organization)?.id || null : 
            null,
          biography: mentor.biography,
          email: null,
          website: null,
          quickEvalRating: mentor.quickEvaluation?.rating || null,
          quickEvalNotes: mentor.quickEvaluation?.notes || null,
          isActive: true
        }).run()
        mentorCount++
        
        // Insert mentor topics
        mentor.mentorTopics.forEach((topic, index) => {
          db.insert(mentorTopics).values({
            mentorId: mentor.id,
            topic: topic,
            description: null,
            position: index
          }).run()
        })
        
        // Insert qualifications
        mentor.desiredQualifications.forEach((qual, index) => {
          db.insert(mentorQualifications).values({
            mentorId: mentor.id,
            qualification: qual,
            position: index
          }).run()
        })
        
        // Insert research areas
        mentor.researchAreas.forEach(area => {
          db.insert(mentorResearchAreas).values({
            mentorId: mentor.id,
            area: area
          }).run()
        })
        
        // Map mentor to research topics
        topicsData.forEach(topic => {
          if (topic.mentors.includes(mentor.id)) {
            db.insert(mentorResearchTopics).values({
              mentorId: mentor.id,
              researchTopicId: topic.id
            }).run()
          }
        })
      })
      
      console.log(`✅ Mentors migration complete!`)
      console.log(`   - ${orgCount} organizations`)
      console.log(`   - ${mentorCount} mentors`)
      console.log(`   - ${topicCount} research topics`)
    } catch (innerError) {
      throw innerError
    }
    
  } catch (error) {
    console.error('❌ Mentors migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateMentorsData()