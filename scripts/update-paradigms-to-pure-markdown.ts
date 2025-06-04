import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'journey.db');
const db = new Database(dbPath);

// Read the original paradigms content
const paradigmsContent = fs.readFileSync('/Users/infinitespire/ai_dev/ai-safety-research-compiler/docs/paradigms-updated.md', 'utf-8');

// Remove HTML tags and keep pure markdown
function convertToPureMarkdown(content: string): string {
  // Remove <details> and </details> tags
  let cleanContent = content.replace(/<details>/g, '');
  cleanContent = cleanContent.replace(/<\/details>/g, '');
  
  // Remove <summary> tags but keep the content inside as a heading
  cleanContent = cleanContent.replace(/<summary><strong>(.*?)<\/strong><\/summary>/g, '### $1');
  
  return cleanContent;
}

const academicContent = convertToPureMarkdown(paradigmsContent);

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

[Take the Paradigms Assessment](/journey/paradigms-assessment)

## My Personal Take on Each Paradigm

### The Race (Competition Paradigm)

This is the Silicon Valley default - everything is a race, winner takes all. I used to be fully bought into this until I realized... what exactly are we racing toward? And what happens to the "losers"? 

The race paradigm creates urgency (good!) but also reckless corner-cutting (very bad!). It's useful for fundraising pitches but toxic for actual safety work.

### Birth/Parenthood (Developmental Paradigm)

This one hits different if you're actually a parent. The idea that we're raising AI like children is both comforting and terrifying. Comforting because we know how to raise kids (sort of). Terrifying because... have you met teenagers?

What really gets me is the responsibility angle. If AI is our "child," we can't just abandon it when it gets difficult.

### Fancy Tool (Artifact Paradigm)

The "it's just a tool" crowd drives me up the wall, but I get it. It's psychologically comfortable to think we're in control. I used to think this way about GPT-2. Then GPT-3 happened. Then GPT-4. At some point, your hammer starts making its own decisions about what needs nailing.

### Metamorphosis (Transformation Paradigm)

This is my dark horse favorite. What if we're not being replaced but transformed? Like, humanity is the caterpillar and whatever comes next is the butterfly? 

The upload folks love this paradigm, but I'm more interested in the gradual cyborg angle. We're already part machine (hello, smartphone addiction). The question is whether we're steering the transformation or just along for the ride.

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
    // Update the topic with pure markdown content
    const updateStmt = db.prepare(`
      UPDATE topics 
      SET content_academic = ?, 
          content_personal = ?
      WHERE id = ?
    `);
    
    updateStmt.run(
      academicContent,
      personalContent,
      'comprehensive-paradigms-analysis'
    );
    
    console.log('Updated comprehensive paradigms topic to use pure markdown');
    
    // Verify the update
    const topic = db.prepare('SELECT id, title, LENGTH(content_academic) as ac_len, LENGTH(content_personal) as pc_len FROM topics WHERE id = ?')
      .get('comprehensive-paradigms-analysis');
    
    console.log('Verification:', topic);
    
    db.close();
  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
}

main();