const fs = require('fs')
const path = require('path')

// Read the file with all the content
const fileContent = fs.readFileSync(path.join(__dirname, 'create-phase1-final-batch.ts'), 'utf8')

// Topics to extract
const topics = [
  'prompt-injection-attacks',
  'jailbreak-techniques', 
  'safety-evaluation-101',
  'how-llms-work',
  'training-failure-modes'
]

// Create output directory
const outputDir = path.join(__dirname, '..', 'temp-phase1-content')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('Extracting content from create-phase1-final-batch.ts...\n')

// For each topic, extract its content
for (const topicId of topics) {
  console.log(`Processing ${topicId}...`)
  
  // Find the topic in the file
  const topicPattern = new RegExp(`{\\s*id:\\s*'${topicId}'[^}]*academicContent:\\s*\`([^\`]*(?:\\\\\`[^\`]*)*)\`[^}]*personalContent:\\s*\`([^\`]*(?:\\\\\`[^\`]*)*)\``, 's')
  
  // Try a different approach - find the topic block
  const startIndex = fileContent.indexOf(`id: '${topicId}'`)
  if (startIndex === -1) {
    console.log(`  ❌ Topic ${topicId} not found`)
    continue
  }
  
  // Find academicContent after this topic
  const academicStart = fileContent.indexOf('academicContent: `', startIndex) + 'academicContent: `'.length
  const academicEnd = fileContent.indexOf('`,\n\n    personalContent:', academicStart)
  
  // Find personalContent  
  const personalStart = fileContent.indexOf('personalContent: `', academicEnd) + 'personalContent: `'.length
  const personalEnd = fileContent.indexOf('`\n  }', personalStart)
  
  if (academicStart > 0 && academicEnd > academicStart && personalStart > 0 && personalEnd > personalStart) {
    const academicContent = fileContent.substring(academicStart, academicEnd)
    const personalContent = fileContent.substring(personalStart, personalEnd)
    
    // Save to files
    const academicPath = path.join(outputDir, `${topicId}-academic.md`)
    const personalPath = path.join(outputDir, `${topicId}-personal.md`)
    
    fs.writeFileSync(academicPath, academicContent)
    fs.writeFileSync(personalPath, personalContent)
    
    console.log(`  ✅ Extracted and saved to temp files`)
    console.log(`     - ${academicPath}`)
    console.log(`     - ${personalPath}`)
  } else {
    console.log(`  ❌ Could not extract content boundaries`)
  }
}

console.log('\nExtraction complete!')