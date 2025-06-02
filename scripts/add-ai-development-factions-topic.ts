#!/usr/bin/env node

import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Database path
const DB_PATH = path.join(process.cwd(), 'journey.db')

// Create database instance
const db = new Database(DB_PATH)
db.pragma('foreign_keys = ON')

// Read the content from the markdown file
const mdContent = fs.readFileSync(
  path.join(process.cwd(), 'docs/ai-development-factions.md'),
  'utf-8'
)

// First, check the current max position in the paradigms module
const maxPositionResult = db.prepare(`
  SELECT MAX(position) as max_pos 
  FROM topics 
  WHERE module_id = 'paradigms-mental-models'
`).get() as { max_pos: number }

const nextPosition = (maxPositionResult?.max_pos || 0) + 1

// Create the new topic
const newTopic = {
  id: 'ai-development-factions',
  module_id: 'paradigms-mental-models',
  title: 'AI Development Factions & Paradigm Analysis',
  description: 'Analyzing how major AI organizations operate under different paradigmatic frameworks and the strategic implications',
  estimated_time: '45 minutes',
  difficulty: 'intermediate',
  position: nextPosition,
  content_academic: `# AI Development Factions & Paradigm Analysis

## Learning Objectives

- Map major AI development organizations to their dominant paradigmatic frameworks
- Analyze the gap between paradigm importance and actual representation in the field
- Understand how organizational paradigms shape AI development trajectories
- Identify critical missing perspectives in current AI development
- Apply paradigm analysis to predict and influence AI futures

## Introduction

The development of artificial intelligence is not happening in a vacuum - it's being shaped by organizations with specific worldviews, incentives, and conceptual frameworks. This topic examines how major AI development entities operate under different paradigmatic frameworks, revealing both the diversity and concerning gaps in how we collectively think about AI.

Understanding these paradigmatic positions is crucial for several reasons. First, paradigms shape what questions get asked, what solutions get explored, and what risks get ignored. Second, the dominance of certain paradigms (like "The Race") and absence of others (like "Symbiogenesis") may be creating the very risks we fear. Third, strategic intervention at the paradigm level may be more effective than technical solutions alone.

This analysis reveals a troubling concentration in competitive, adversarial, and control-based paradigms while showing a desperate lack of ecological, symbiotic, and balance-based thinking. By mapping this landscape, we can identify where paradigm interventions are most urgently needed.

${mdContent}

## Practical Exercise: Paradigm Influence Mapping

Select an AI development decision (e.g., open-sourcing models, safety testing requirements, international cooperation) and analyze how different paradigms would approach it:

1. **Identify stakeholders** and their dominant paradigms
2. **Predict positions** based on paradigmatic thinking
3. **Find paradigm bridges** that could enable agreement
4. **Design interventions** that shift paradigmatic framing
5. **Test robustness** against paradigm lock-in

## Further Reading

### Research and Analysis
- "The AI Paradigm Race" - Analysis of competitive dynamics
- "Symbiotic Intelligence" - Alternative development models
- "Cultural Paradigms in AI Development" - Cross-cultural analysis
- "Missing Voices in AI" - Paradigmatic exclusions

### Organizations and Movements
- Partnership on AI - Multi-stakeholder governance
- Indigenous AI Working Group - Alternative frameworks
- AI for Good - Shifting paradigm narratives
- Long-term AI Safety - Paradigm intervention strategies

## Connections

### Prerequisites
- **introduction-ai-paradigms**: Understanding paradigm concepts
- **cultural-paradigms-ai**: How culture shapes AI thinking
- **paradigm-driven-research**: Research implications

### Related Topics
- **creating-new-paradigms**: Developing alternative frameworks
- **ai-governance**: How paradigms shape policy
- **international-ai-competition**: Race dynamics analysis
- **symbiotic-ai**: Alternative development paths

### Applications
- Strategic planning for AI labs
- Policy intervention design
- Safety advocacy messaging
- Research priority setting`,

  content_personal: `# AI Development Factions: The Real Paradigm Wars

Holy shit, when you actually map out who's building AI and what mental models they're using, it's terrifying. Not because they're evil (mostly), but because they're trapped in paradigms that might doom us all.

Let me break this down in a way that will probably piss off everyone.

## The Current Clusterfuck

We've got the most powerful technology in human history being developed by:
- Governments thinking it's a weapon
- Companies thinking it's a product  
- Researchers thinking it's a theorem
- VCs thinking it's an exit

And almost NOBODY thinking it might be a new form of life we need to coexist with.

${mdContent.split('\n').slice(3).join('\n')}

## What This Actually Means

The paradigm analysis isn't just academic masturbation. It reveals that:

1. **We're fucked if nothing changes** - The dominant paradigms (Race, Military, Tool) are precisely the ones most likely to create catastrophic outcomes

2. **The solutions already exist** - Symbiogenesis, ecological thinking, balance paradigms could work, they're just not profitable or glory-generating

3. **It's not about the tech** - We could build beneficial AI tomorrow if we could escape our conceptual prisons

4. **The missing voices matter most** - Indigenous wisdom about relating to non-human intelligence, disability perspectives on symbiosis, Global South liberation thinking - these aren't nice-to-haves, they're necessities

## The Real Power Moves

Forget safety techniques. The real safety work is paradigm hacking:

1. **Infiltrate competitive labs with ecological thinkers**
2. **Fund symbiotic AI research at 100x current levels**  
3. **Create high-status alternatives to race dynamics**
4. **Platform voices from outside the Silicon Valley bubble**
5. **Make balance-based metrics as important as capability metrics**

But this requires admitting that a bunch of computer science bros in hoodies might not have the conceptual toolkit to birth a new form of intelligence safely.

Good luck with that.

## The Bottom Line

We're building god-like AI with stone-age paradigms. The tech isn't the problem - our thinking is. And until we fix that, all the alignment research in the world won't save us from our own conceptual poverty.

The factions analysis shows we're in a paradigm emergency. Not enough time to evolve better thinking naturally. We need a conceptual revolution, yesterday.

Time to start one.`
}

try {
  // Check if topic already exists
  const existing = db.prepare('SELECT id FROM topics WHERE id = ?').get(newTopic.id)
  
  if (existing) {
    // Update existing topic
    const stmt = db.prepare(`
      UPDATE topics 
      SET module_id = ?, title = ?, description = ?, estimated_time = ?, 
          difficulty = ?, position = ?, content_academic = ?, content_personal = ?
      WHERE id = ?
    `)
    
    stmt.run(
      newTopic.module_id,
      newTopic.title,
      newTopic.description,
      newTopic.estimated_time,
      newTopic.difficulty,
      newTopic.position,
      newTopic.content_academic,
      newTopic.content_personal,
      newTopic.id
    )
    
    console.log(`✅ Updated existing topic: ${newTopic.id}`)
  } else {
    // Insert new topic
    const stmt = db.prepare(`
      INSERT INTO topics (
        id, module_id, title, description, estimated_time, 
        difficulty, position, content_academic, content_personal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      newTopic.id,
      newTopic.module_id,
      newTopic.title,
      newTopic.description,
      newTopic.estimated_time,
      newTopic.difficulty,
      newTopic.position,
      newTopic.content_academic,
      newTopic.content_personal
    )
    
    console.log(`✅ Created new topic: ${newTopic.id}`)
  }
  
  console.log(`Topic "${newTopic.title}" has been added to the Paradigms & Mental Models module at position ${newTopic.position}`)
} catch (error) {
  console.error('Error adding topic:', error)
}

db.close()