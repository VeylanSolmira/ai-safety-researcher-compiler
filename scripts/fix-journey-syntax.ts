#!/usr/bin/env tsx

import fs from 'fs'

console.log('🔧 Fixing journey-generated.ts syntax errors...\n')

const filePath = './lib/journey-generated.ts'
let content = fs.readFileSync(filePath, 'utf-8')

// Fix all instances of ",\n          \n            " pattern with "},\n          {\n            "
content = content.replace(/,\s*\n\s*"id":/g, '},\n          {\n            "id":')

// Fix missing required fields by parsing and rebuilding
// First, let's add all missing fields to topics
const topicDefaults = {
  module_id: "unknown",
  position: 0,
  prerequisites: [],
  learning_outcomes: [],
  tags: []
}

// Fix topics that end with incomplete fields
content = content.replace(/, "module_id": "unknown", "position": \d+, "prerequisites": \[\], "learning_outcomes": \[\], "tags": \[\]\}/g, '}')

// Now let's properly close all topic objects
let lines = content.split('\n')
let inTopic = false
let braceCount = 0
let fixedLines: string[] = []

for (let i = 0; i < lines.length; i++) {
  let line = lines[i]
  
  // Track if we're inside a topic object
  if (line.includes('"id":') && line.includes('"title":')) {
    inTopic = true
  }
  
  if (inTopic) {
    // Count braces
    braceCount += (line.match(/{/g) || []).length
    braceCount -= (line.match(/}/g) || []).length
    
    // If we're at the end of a topic (next line starts a new topic or ends topics array)
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1]
      if ((nextLine.includes('"id":') || nextLine.includes(']')) && braceCount > 0) {
        // Add missing fields if not present
        if (!line.includes('module_id')) {
          const indent = line.match(/^\s*/)?.[0] || ''
          line = line.replace(/}?\s*$/, '')
          if (!line.endsWith(',')) line += ','
          line += `\n${indent}  "module_id": "unknown",`
          line += `\n${indent}  "position": 0,`
          line += `\n${indent}  "prerequisites": [],`
          line += `\n${indent}  "learning_outcomes": [],`
          line += `\n${indent}  "tags": []`
          line += `\n${indent}}`
        }
        inTopic = false
        braceCount = 0
      }
    }
  }
  
  fixedLines.push(line)
}

content = fixedLines.join('\n')

// Fix module positions
let moduleCount = 0
content = content.replace(/"modules": \[([^]*?)\]/g, (match, modulesContent) => {
  const modules = modulesContent.split(/\}\s*,\s*\{/).map((m: string, idx: number) => {
    let module = m.trim()
    if (!module.startsWith('{')) module = '{' + module
    if (!module.endsWith('}')) module = module + '}'
    
    // Add position if missing
    if (!module.includes('"position"')) {
      module = module.replace(/}$/, `, "position": ${idx}}`)
    }
    
    // Add tier_id if missing
    if (!module.includes('"tier_id"')) {
      module = module.replace(/}$/, `, "tier_id": "unknown"}`)
    }
    
    return module
  })
  
  return `"modules": [\n      ${modules.join(',\n      ')}\n    ]`
})

// Clean up any remaining syntax issues
content = content.replace(/,\s*,/g, ',')
content = content.replace(/,\s*}/g, '}')
content = content.replace(/,\s*]/g, ']')
content = content.replace(/}\s*"/g, '},\n          "')

fs.writeFileSync(filePath, content)
console.log('✅ Fixed journey-generated.ts syntax')

console.log('\n🎉 Syntax fixes complete!')