import Database from 'better-sqlite3';
import * as fs from 'fs';
import path from 'path';

// Use local database file
const dbPath = path.join(process.cwd(), 'journey.db');
const db = new Database(dbPath);

// Read the full paradigms content
const paradigmsContent = fs.readFileSync('/Users/infinitespire/ai_dev/ai-safety-research-compiler/docs/paradigms-updated.md', 'utf-8');

// Convert to collapsible sections
function convertToCollapsible(content: string): string {
  // Split content into sections
  const lines = content.split('\n');
  let result: string[] = [];
  let inParadigm = false;
  let paradigmContent: string[] = [];
  let currentParadigmTitle = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Main category headers (## 1. Competition/Conflict Paradigms, etc.)
    if (line.match(/^## \d+\./)) {
      if (inParadigm && paradigmContent.length > 0) {
        result.push('</details>');
        result.push('');
      }
      result.push(line);
      inParadigm = false;
      paradigmContent = [];
      continue;
    }
    
    // Individual paradigm headers (### 1.1 The Race, etc.)
    if (line.match(/^### \d+\.\d+/)) {
      // Close previous paradigm if open
      if (inParadigm && paradigmContent.length > 0) {
        result.push('</details>');
        result.push('');
      }
      
      // Start new collapsible section
      currentParadigmTitle = line.replace(/^### \d+\.\d+ /, '');
      result.push('<details>');
      result.push(`<summary><strong>${currentParadigmTitle}</strong></summary>`);
      result.push('');
      inParadigm = true;
      paradigmContent = [];
      continue;
    }
    
    // Add content to current section
    if (inParadigm) {
      result.push(line);
    } else {
      result.push(line);
    }
  }
  
  // Close last paradigm if needed
  if (inParadigm) {
    result.push('</details>');
  }
  
  return result.join('\n');
}

const academicContent = convertToCollapsible(paradigmsContent);

const personalContent = `# My Journey Through AI Paradigms

Hey there! So you want to understand the different ways people think about AI? Buckle up, because this is a wild ride through 40+ different paradigms that shape how we approach AI safety.

## Why This Matters to You

Before we dive in, let me tell you why this isn't just academic navel-gazing. The paradigm you adopt (consciously or not) will literally shape:
- What you build
- What risks you see (or miss)
- What solutions seem obvious (or impossible)
- Whether you think we're doomed or destined for greatness

I've seen brilliant researchers completely talk past each other because they're operating from different paradigmatic frameworks. It's like watching people argue about whether a cylinder is a circle or a rectangle - they're both right from their perspective!

## The Assessment: Finding Your Paradigm

Before reading through all these paradigms, take our assessment to see which ones resonate with you. You might be surprised! Most of us operate from 2-3 dominant paradigms without realizing it.

## My Personal Take on Each Paradigm

<details>
<summary><strong>The Race (Competition Paradigm)</strong></summary>

This is the Silicon Valley default - everything is a race, winner takes all. I used to be fully bought into this until I realized... what exactly are we racing toward? And what happens to the "losers"? 

The race paradigm creates urgency (good!) but also reckless corner-cutting (very bad!). It's useful for fundraising pitches but toxic for actual safety work.

</details>

<details>
<summary><strong>Birth/Parenthood (Developmental Paradigm)</strong></summary>

This one hits different if you're actually a parent. The idea that we're raising AI like children is both comforting and terrifying. Comforting because we know how to raise kids (sort of). Terrifying because... have you met teenagers?

What really gets me is the responsibility angle. If AI is our "child," we can't just abandon it when it gets difficult.

</details>

<details>
<summary><strong>Fancy Tool (Artifact Paradigm)</strong></summary>

The "it's just a tool" crowd drives me up the wall, but I get it. It's psychologically comfortable to think we're in control. I used to think this way about GPT-2. Then GPT-3 happened. Then GPT-4. At some point, your hammer starts making its own decisions about what needs nailing.

</details>

<details>
<summary><strong>Metamorphosis (Transformation Paradigm)</strong></summary>

This is my dark horse favorite. What if we're not being replaced but transformed? Like, humanity is the caterpillar and whatever comes next is the butterfly? 

The upload folks love this paradigm, but I'm more interested in the gradual cyborg angle. We're already part machine (hello, smartphone addiction). The question is whether we're steering the transformation or just along for the ride.

</details>

## How to Use These Paradigms

1. **Recognize your default**: Which 2-3 paradigms do you instinctively use?
2. **Try on others**: Deliberately think through a problem using a paradigm that feels foreign
3. **Mix and match**: The best insights often come from combining paradigms
4. **Stay flexible**: Different problems need different paradigmatic lenses

## The Meta-Game

Here's the thing nobody tells you: paradigm choice is political. Funding follows paradigms. If you frame AI as a race, you get defense funding. Frame it as child-rearing, you get education grants. Frame it as infrastructure, you get government contracts.

But here's the real kicker: the paradigm you choose might become self-fulfilling. If enough people believe AI is a predator, we might build it to be one.

Choose wisely.`;

function main() {
  try {
    // Use the existing paradigms module
    const moduleId = 'paradigms-mental-models';

    // Check if the topic exists
    const existingTopic = db.prepare('SELECT id FROM topics WHERE id = ?').get('comprehensive-paradigms-analysis');

    if (existingTopic) {
      // Update existing topic
      const updateStmt = db.prepare(`
        UPDATE topics 
        SET content_academic = ?, 
            content_personal = ?,
            module_id = ?,
            title = ?,
            description = ?,
            difficulty = ?,
            estimated_time = ?
        WHERE id = ?
      `);
      
      updateStmt.run(
        academicContent,
        personalContent,
        moduleId,
        'Comprehensive AI Paradigms Analysis',
        'A complete analysis of 40+ paradigms shaping AI safety discourse, with detailed examples, proponents, and implications for safety research',
        'intermediate',
        '8 hours',
        'comprehensive-paradigms-analysis'
      );
      console.log('Updated existing comprehensive paradigms topic');
    } else {
      // Create new topic
      const insertStmt = db.prepare(`
        INSERT INTO topics (
          id, 
          title, 
          module_id, 
          content_academic,
          content_personal,
          description,
          difficulty,
          estimated_time,
          position
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      insertStmt.run(
        'comprehensive-paradigms-analysis',
        'Comprehensive AI Paradigms Analysis',
        moduleId,
        academicContent,
        personalContent,
        'A complete analysis of 40+ paradigms shaping AI safety discourse, with detailed examples, proponents, and implications for safety research',
        'intermediate',
        '8 hours',
        10  // Position it after other topics
      );
      console.log('Created new comprehensive paradigms topic');
    }

    console.log('Comprehensive paradigms topic creation complete!');
    db.close();
  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
}

main();