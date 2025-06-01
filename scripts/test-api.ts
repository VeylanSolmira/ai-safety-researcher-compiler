#!/usr/bin/env node

// Test that topics are accessible through the API

import { getTopicById } from '../lib/api/journey'

const testTopics = [
  'llm-psychology',
  'chain-of-thought-analysis', 
  'model-organisms',
  'cognitive-oversight',
  'code-generation-safety'
]

console.log('Testing topic access from database:\n')

testTopics.forEach(topicId => {
  try {
    const topic = getTopicById(topicId)
    if (topic) {
      console.log(`✅ ${topicId}: ${topic.title} (in module: ${topic.moduleId})`)
    } else {
      console.log(`❌ ${topicId}: NOT FOUND`)
    }
  } catch (error) {
    console.log(`❌ ${topicId}: ERROR - ${error}`)
  }
})

// Also test through the journey structure
console.log('\nTesting through journey structure:')
import { journeyTiers } from '../lib/journey'

testTopics.forEach(topicId => {
  let found = false
  for (const tier of journeyTiers) {
    for (const module of tier.modules) {
      const topic = module.topics.find(t => t.id === topicId)
      if (topic) {
        console.log(`✅ ${topicId}: Found in ${tier.id}/${module.id}`)
        found = true
        break
      }
    }
    if (found) break
  }
  if (!found) {
    console.log(`❌ ${topicId}: Not found in journey structure`)
  }
})