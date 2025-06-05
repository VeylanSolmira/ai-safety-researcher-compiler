#!/usr/bin/env tsx

import fs from 'fs'

console.log('🔧 Final fix for journey-generated.ts...\n')

const filePath = './lib/journey-generated.ts'
let content = fs.readFileSync(filePath, 'utf-8')

// Fix all instances where position and tier_id were added incorrectly to learningObjectives
content = content.replace(/, "position": \d+, "tier_id": "[^"]+"\}/g, '"')
content = content.replace(/", "position": \d+, "tier_id": "[^"]+"\}\s*\]/g, '"\n        ]')

// Now add position and tier_id properly to each module
let moduleIndex = 0
let currentTierId = 'foundation'

// Track tier changes
content = content.replace(/"id": "(foundation|intermediate|advanced|expert)"/g, (match, tierId) => {
  currentTierId = tierId
  moduleIndex = 0
  return match
})

// Fix each module to have proper structure
content = content.replace(/(\s*\{\s*"id":\s*"[^"]+",\s*"title":\s*"[^"]+",\s*"description":\s*"[^"]+",\s*"learningObjectives":\s*\[[^\]]+\])\s*,\s*"topics"/g, (match, moduleStart) => {
  const result = moduleStart + ',\n        "position": ' + (moduleIndex++) + ',\n        "tier_id": "' + currentTierId + '",\n        "topics"'
  return result
})

// Add missing fields to all topics
let topicIndex = 0
content = content.replace(/"topics":\s*\[/g, (match) => {
  topicIndex = 0
  return match
})

// Fix topics to have all required fields
content = content.replace(/(\{\s*"id":\s*"[^"]+",\s*"title":\s*"[^"]+",\s*"description":\s*"[^"]+",\s*"duration_minutes":\s*\d+,\s*"difficulty":\s*"[^"]+")\s*(\}|,)/g, (match, topicContent, ending) => {
  const position = topicIndex++
  return topicContent + ',\n            "module_id": "unknown",\n            "position": ' + position + ',\n            "prerequisites": [],\n            "learning_outcomes": [],\n            "tags": []\n          ' + ending
})

// Remove any fields that don't belong
content = content.replace(/,?\s*"hasInteractiveTransition":\s*\w+/g, '')
content = content.replace(/,?\s*"roadmapContentId":\s*"[^"]+"/g, '')
content = content.replace(/,?\s*"hasJourneyExtras":\s*\w+/g, '')

// Clean up tier properties
content = content.replace(/"type":\s*"[^"]+",/g, '')
content = content.replace(/"prerequisites":\s*\[\],/g, '')
content = content.replace(/"unlocks":\s*\[\],/g, '')
content = content.replace(/"skillsGained":\s*\[\],/g, '')
content = content.replace(/"careerRelevance":\s*\[\]/g, '')

// Add position to tiers
let tierPosition = 0
content = content.replace(/(\{\s*"id":\s*"(foundation|intermediate|advanced|expert)",\s*"title":\s*"[^"]+",\s*"level":\s*"[^"]+",\s*"description":\s*"[^"]+",\s*"estimatedDuration":\s*"[^"]+")\s*,/g, (match, tierStart) => {
  return tierStart + ',\n    "position": ' + (tierPosition++) + ','
})

// Final cleanup
content = content.replace(/,\s*,/g, ',')
content = content.replace(/,\s*\}/g, '}')
content = content.replace(/,\s*\]/g, ']')

fs.writeFileSync(filePath, content)
console.log('✅ Fixed journey-generated.ts')

console.log('\n🎉 Final fixes complete!')