#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

console.log('🔧 Fixing journey-generated.ts type issues...\n')

const filePath = './lib/journey-generated.ts'
let content = fs.readFileSync(filePath, 'utf-8')

// Fix 1: Remove all occurrences of estimatedTime from topics
// Convert it to duration_minutes with a parsed value
content = content.replace(/"estimatedTime": "(\d+) hours?"/g, (match, hours) => {
  const minutes = parseInt(hours) * 60
  return `"duration_minutes": ${minutes}`
})

// Handle "X minutes" format
content = content.replace(/"estimatedTime": "(\d+) minutes?"/g, (match, mins) => {
  return `"duration_minutes": ${parseInt(mins)}`
})

// Remove any remaining estimatedTime fields that don't match patterns
content = content.replace(/,?\s*"estimatedTime": "[^"]+"/g, '')

// Fix 2: Add missing required fields to topics
// Add position if missing (based on array index)
let moduleIndex = 0
content = content.replace(/"topics": \[([^\]]+)\]/g, (match, topicsContent) => {
  let topics = topicsContent.trim().split(/\},\s*\{/)
  topics = topics.map((topic, index) => {
    let t = topic.replace(/^\s*\{/, '{').replace(/\}\s*$/, '}')
    
    // Ensure it has required fields
    if (!t.includes('"module_id"')) {
      t = t.replace(/\}$/, ', "module_id": "unknown"}')
    }
    if (!t.includes('"position"')) {
      t = t.replace(/\}$/, `, "position": ${index}}`)
    }
    if (!t.includes('"duration_minutes"')) {
      t = t.replace(/\}$/, ', "duration_minutes": 60}')
    }
    if (!t.includes('"prerequisites"')) {
      t = t.replace(/\}$/, ', "prerequisites": []}')
    }
    if (!t.includes('"learning_outcomes"')) {
      t = t.replace(/\}$/, ', "learning_outcomes": []}')
    }
    if (!t.includes('"tags"')) {
      t = t.replace(/\}$/, ', "tags": []}')
    }
    
    return t
  })
  
  return `"topics": [\n          ${topics.join(',\n          ')}\n        ]`
})

// Fix 3: Add position to modules if missing
let tierIndex = 0
content = content.replace(/"modules": \[([^\]]+)\]/g, (match, modulesContent) => {
  let modules = modulesContent.trim().split(/\},\s*\{/)
  modules = modules.map((module, index) => {
    let m = module.replace(/^\s*\{/, '{').replace(/\}\s*$/, '}')
    
    if (!m.includes('"position"')) {
      m = m.replace(/\}$/, `, "position": ${index}}`)
    }
    if (!m.includes('"tier_id"')) {
      m = m.replace(/\}$/, ', "tier_id": "unknown"}')
    }
    
    return m
  })
  
  return `"modules": [\n      ${modules.join(',\n      ')}\n    ]`
})

// Fix 4: Add position to tiers if missing
content = content.replace(/export const journeyTiers: Tier\[\] = \[([^\]]+)\]/s, (match, tiersContent) => {
  let tiers = tiersContent.trim().split(/\},\s*\{/)
  tiers = tiers.map((tier, index) => {
    let t = tier.replace(/^\s*\{/, '{').replace(/\}\s*$/, '}')
    
    if (!t.includes('"position"')) {
      t = t.replace(/\}$/, `, "position": ${index}}`)
    }
    
    return t
  })
  
  return `export const journeyTiers: Tier[] = [\n  ${tiers.join(',\n  ')}\n]`
})

// Fix 5: Remove any properties that aren't in the interface
content = content.replace(/,?\s*"roadmapContentId": "[^"]+"/g, '')
content = content.replace(/,?\s*"hasJourneyExtras": \w+/g, '')

// Fix 6: Clean up any double commas or trailing commas
content = content.replace(/,\s*,/g, ',')
content = content.replace(/,\s*\}/g, '}')
content = content.replace(/,\s*\]/g, ']')

fs.writeFileSync(filePath, content)
console.log('✅ Fixed journey-generated.ts')

// Export the structure to verify
console.log('\n📊 Verifying structure...')
try {
  const { journeyTiers } = require(path.join(process.cwd(), filePath))
  console.log(`✅ ${journeyTiers.length} tiers found`)
  journeyTiers.forEach((tier: any) => {
    console.log(`  - ${tier.title}: ${tier.modules?.length || 0} modules`)
  })
} catch (error) {
  console.log('❌ Error verifying structure:', error)
}

console.log('\n🎉 Journey structure fixes complete!')