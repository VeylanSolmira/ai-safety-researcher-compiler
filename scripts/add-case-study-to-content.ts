import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const caseStudySection = `

## Case Study: When Writing About Injection Causes Injection

During the development of this very course, we encountered a perfect example of why injection attacks are so fundamental. While writing content about prompt injection attacks (including the text you're reading now), the code generation system crashed with a template literal injection vulnerability.

**What Happened**: The educational examples of injection attacks contained triple backticks (\`\`\`), which broke the TypeScript template literal system being used to generate the content. The content about code injection literally became a code injection.

**The Beautiful Irony**: 
- We couldn't write about prompt injection without causing an injection
- The defensive examples became attack vectors
- The education material compromised the education system

**Why This Matters**: This demonstrates that the code/data boundary problem isn't just theoretical - it's so fundamental that it affects the very systems we use to teach about it. If we can't even safely write about these vulnerabilities, how can we expect AI systems to safely process arbitrary inputs?

> "Everything on the internet is now executable code" - and this includes educational content about why everything being executable is dangerous.

For the full analysis, see: [Template Literal Injection Case Study](/development-resources/case-studies/template-literal-injection.md)

This real-world example shows why Simon Willison's observation that prompt injection is unsolvable isn't hyperbole - it's a fundamental property of systems that process symbolic information.
`

async function addCaseStudy() {
  const dbPath = path.join(process.cwd(), 'journey.db')
  const db = new Database(dbPath)
  
  try {
    // Get current content for prompt-injection-attacks
    const topic = db.prepare(`
      SELECT content_academic, content_personal 
      FROM topics 
      WHERE id = 'prompt-injection-attacks'
    `).get()
    
    if (topic && topic.content_academic) {
      // Find a good place to insert the case study (after real-world examples)
      const academicContent = topic.content_academic
      const insertPoint = academicContent.indexOf('### Detection Strategies')
      
      if (insertPoint > -1) {
        const updatedAcademic = 
          academicContent.slice(0, insertPoint) + 
          caseStudySection + '\n' +
          academicContent.slice(insertPoint)
        
        // Update the database
        const updateStmt = db.prepare(`
          UPDATE topics 
          SET content_academic = ?
          WHERE id = 'prompt-injection-attacks'
        `)
        
        updateStmt.run(updatedAcademic)
        
        console.log('✅ Successfully added case study to prompt-injection-attacks topic')
        
        // Also update the markdown file
        const contentDir = path.join(
          process.cwd(),
          'src/data/roadmaps/ai-safety-researcher/content'
        )
        const mdPath = path.join(contentDir, 'prompt-injection-attacks@prompt-injection-attacks-subtopic.md')
        
        if (fs.existsSync(mdPath)) {
          fs.writeFileSync(mdPath, updatedAcademic)
          console.log('📄 Updated markdown file')
        }
      } else {
        console.log('⚠️  Could not find insertion point in content')
      }
    } else {
      console.log('❌ prompt-injection-attacks topic not found or has no content')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    db.close()
  }
}

// Add to content creation plan as well
async function updateContentPlan() {
  const planPath = path.join(process.cwd(), 'development-resources/content-creation-plan.md')
  const plan = fs.readFileSync(planPath, 'utf8')
  
  // Add case study reference to the structure template
  const caseStudyNote = `\n### Content Structure Template
Each topic will include:
- **Learning Objectives** (3-5 bullet points)
- **Introduction** (200-300 words)
- **Core Concepts** (3-4 main sections, 400-500 words each)
- **Practical Applications** (real-world examples)
- **Case Studies** (when relevant - e.g., Template Literal Injection for prompt injection topic)
- **Common Pitfalls** (what to avoid)
- **Hands-on Exercise** (practical activity)
- **Further Reading** (3-5 curated resources)
- **Connections** (links to related topics, people, tools)`
  
  const updatedPlan = plan.replace('### Content Structure Template', caseStudyNote)
  
  if (updatedPlan !== plan) {
    fs.writeFileSync(planPath, updatedPlan)
    console.log('✅ Updated content creation plan to include case studies')
  }
}

// Run both updates
async function main() {
  console.log('🔧 Adding template literal injection case study...\n')
  await addCaseStudy()
  await updateContentPlan()
  console.log('\n✨ Done!')
}

main()