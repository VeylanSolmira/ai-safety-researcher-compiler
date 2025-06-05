#!/usr/bin/env tsx

import fs from 'fs'

console.log('🔧 Final fixes for journey-generated.ts...\n')

const filePath = './lib/journey-generated.ts'
let content = fs.readFileSync(filePath, 'utf-8')

// Fix 1: Some topics have empty field after position, add prerequisites
content = content.replace(/("position": \d+,)\s*\n\s*("learning_outcomes":)/g, '$1\n            "prerequisites": [],\n            $2')

// Fix 2: Add missing level, estimatedDuration to tiers 
const tierDefaults: Record<string, {level: string, estimatedDuration: string}> = {
  foundation: { level: 'foundation', estimatedDuration: '3 months' },
  intermediate: { level: 'intermediate', estimatedDuration: '6 months' },
  advanced: { level: 'advanced', estimatedDuration: '6 months' },
  expert: { level: 'expert', estimatedDuration: 'Ongoing' }
}

// Parse and fix tiers
let tierMatches = content.match(/\{\s*"id":\s*"(foundation|intermediate|advanced|expert)"[^}]+?"modules":\s*\[[^\]]*\]\s*\}/gs)
if (tierMatches) {
  tierMatches.forEach(tierMatch => {
    const idMatch = tierMatch.match(/"id":\s*"(foundation|intermediate|advanced|expert)"/)
    if (idMatch) {
      const tierId = idMatch[1]
      const defaults = tierDefaults[tierId]
      
      // Add missing fields
      if (!tierMatch.includes('"level"')) {
        tierMatch = tierMatch.replace(/"title":\s*"[^"]+",/, `$&\n    "level": "${defaults.level}",`)
      }
      if (!tierMatch.includes('"estimatedDuration"')) {
        tierMatch = tierMatch.replace(/"description":\s*"[^"]+",/, `$&\n    "estimatedDuration": "${defaults.estimatedDuration}",`)
      }
      
      content = content.replace(tierMatch, tierMatch)
    }
  })
}

// Fix 3: Topics estimatedTime -> duration_minutes if any remain
content = content.replace(/"estimatedTime":\s*(\d+)/g, '"duration_minutes": $1')

// Clean up
content = content.replace(/,\s*,/g, ',')
content = content.replace(/,\s*\}/g, '}')
content = content.replace(/,\s*\]/g, ']')

fs.writeFileSync(filePath, content)
console.log('✅ Applied final fixes to journey-generated.ts')

console.log('\n🎉 Final fixes complete!')