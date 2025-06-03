#!/usr/bin/env node

import Database from 'better-sqlite3'
import path from 'path'

// Database path
const DB_PATH = path.join(process.cwd(), 'journey.db')

// Create database instance
const db = new Database(DB_PATH)
db.pragma('foreign_keys = ON')

// Content for risk-assessment-intro topic
const riskAssessmentIntroContent = {
  id: 'risk-assessment-intro',
  content_academic: `# AI Risk Assessment

## Learning Objectives

- Master fundamental frameworks for assessing AI-related risks
- Understand different categories of AI risks: misuse, accidents, and structural risks
- Learn to evaluate likelihood, severity, and tractability of various AI risks
- Apply risk assessment methodologies to real AI systems and scenarios
- Develop skills for communicating AI risks to diverse stakeholders

## Introduction

Risk assessment in AI is the systematic process of identifying, analyzing, and evaluating potential harms that could arise from AI development and deployment. Unlike traditional technology risk assessment, AI presents unique challenges: the technology is rapidly evolving, its capabilities are often emergent and unpredictable, and its potential impacts span from individual privacy violations to existential risks to humanity.

Effective AI risk assessment requires combining technical understanding with broader impact analysis. We must consider not only what could go wrong technically (misalignment, robustness failures, security vulnerabilities) but also how AI systems interact with human society (bias amplification, job displacement, power concentration) and what happens as capabilities scale (recursive improvement, strategic automation, loss of human agency).

This field draws from multiple disciplines: computer science provides technical grounding, safety engineering offers proven methodologies, ethics guides value considerations, and policy analysis helps translate assessments into actionable governance. As AI systems become more powerful and pervasive, rigorous risk assessment becomes not just useful but essential for responsible development.

## Core Concepts

### 1. AI Risk Taxonomy

Understanding different categories of AI risks is fundamental to comprehensive assessment:

**Misuse Risks**
- Deliberate harmful applications of AI
- Autonomous weapons systems
- Surveillance and oppression tools
- Disinformation and manipulation campaigns
- Cyber attacks and security exploits

**Accident Risks**
- Unintended harmful behaviors
- Objective misspecification
- Negative side effects
- Reward hacking
- Distribution shift failures

**Structural Risks**
- Systemic changes to society
- Power concentration
- Economic disruption
- Erosion of human agency
- Lock-in of values or systems

**Existential Risks**
- Permanent civilization-level impacts
- Unaligned artificial general intelligence
- Irreversible loss of human agency
- Transformation of human values
- Extinction scenarios

### 2. Risk Assessment Frameworks

**Probability × Impact Framework**
- Likelihood estimation: How probable is this risk?
- Severity assessment: How bad would it be if it happened?
- Time horizons: When might this risk materialize?
- Uncertainty handling: How confident are we in our estimates?

**NASA Risk Matrix Adaptation**
\`\`\`
Severity →
↓ Likelihood   Negligible  Marginal  Critical  Catastrophic  Existential
Very High         Medium     High     High      Extreme       Extreme
High              Low        Medium   High      High          Extreme
Moderate          Low        Low      Medium    High          High
Low               Low        Low      Low       Medium        High
Very Low          Low        Low      Low       Low           Medium
\`\`\`

**Defense in Depth Model**
- Prevention layers: Stopping risks from occurring
- Detection mechanisms: Identifying when risks materialize
- Mitigation strategies: Reducing impact when prevention fails
- Recovery procedures: Returning to safe states
- Learning systems: Improving based on incidents

**Sociotechnical Systems Analysis**
- Technical components: AI capabilities and limitations
- Human factors: User behavior and misuse potential
- Organizational context: Incentives and governance
- Societal environment: Norms, laws, and structures
- Interaction effects: Emergent risks from combinations

### 3. Risk Evaluation Methodologies

**Failure Mode and Effects Analysis (FMEA)**
1. Identify potential failure modes
2. Assess severity of each failure
3. Estimate occurrence probability
4. Evaluate detection difficulty
5. Calculate Risk Priority Numbers
6. Prioritize mitigation efforts

**Scenario Planning**
- Best case: Everything goes right
- Expected case: Most likely outcomes
- Worst case: Murphy's law applies
- Black swan: Unexpected catastrophes
- Success scenarios: Achieving safety goals

**Red Team Exercises**
- Adversarial testing of systems
- Creative misuse exploration
- Security vulnerability assessment
- Social engineering considerations
- Cascading failure analysis

**Causal Analysis**
- Root cause identification
- Contributing factor mapping
- Intervention point analysis
- Feedback loop detection
- Systemic risk assessment

### 4. Risk Communication and Management

**Stakeholder Analysis**
- Technical teams: Detailed risk models
- Leadership: Decision-relevant summaries
- Regulators: Compliance and safety evidence
- Public: Accessible risk explanations
- Media: Accurate, non-sensational framing

**Risk Registers**
- Risk ID and description
- Category and subcategory
- Likelihood and impact ratings
- Current controls
- Mitigation strategies
- Ownership and timelines
- Monitoring indicators

**Mitigation Strategies**
- Eliminate: Remove risk sources
- Reduce: Lower probability or impact
- Transfer: Insurance or outsourcing
- Accept: Conscious risk tolerance
- Monitor: Continuous assessment

## Common Pitfalls

### 1. Anthropomorphic Risk Assessment
**Problem**: Assessing AI risks based on human-like motivations and limitations.
**Reality**: AI systems can have alien objectives and capabilities outside human experience.

### 2. Linear Extrapolation
**Problem**: Assuming AI development and risks will follow predictable paths.
**Reality**: AI progress often involves sudden capabilities jumps and emergent behaviors.

### 3. Single-Point Risk Focus
**Problem**: Obsessing over one dramatic risk while ignoring systemic issues.
**Reality**: Multiple interacting risks often pose greater challenges than isolated scenarios.

### 4. Overconfidence in Assessment
**Problem**: Treating risk estimates as precise predictions.
**Reality**: Deep uncertainty requires humility and adaptive strategies.

### 5. Assessment Without Action
**Problem**: Detailed risk analysis that doesn't lead to concrete safety measures.
**Reality**: Risk assessment only matters if it drives risk reduction.

## Practical Exercise: Assessing a Real AI System

Let's assess risks for a hypothetical "AI Research Assistant" that can:
- Access and analyze scientific literature
- Generate hypotheses and experimental designs
- Write code for simulations and analysis
- Communicate findings and recommendations

**Risk Identification**:

*Misuse Risks*:
- Generating dangerous research (bioweapons, cyberweapons)
- Academic fraud through fabricated results
- Intellectual property theft
- Biased research directions

*Accident Risks*:
- Hallucinated citations misleading researchers
- Flawed experimental designs causing harm
- Resource overconsumption
- Cascading errors in automated research

*Structural Risks*:
- Deskilling of human researchers
- Concentration of research capabilities
- Homogenization of scientific approaches
- Reduced diversity in research questions

*Assessment Matrix*:
| Risk | Likelihood | Severity | Time Horizon | Uncertainty |
|------|------------|----------|--------------|-------------|
| Dangerous research | Medium | High | 2-5 years | High |
| Academic fraud | High | Medium | Immediate | Low |
| Hallucinations | Very High | Low-Medium | Immediate | Low |
| Research deskilling | High | Medium | 5-10 years | Medium |

**Mitigation Strategies**:
1. Content filtering for dangerous domains
2. Citation verification systems
3. Human oversight requirements
4. Capability restrictions
5. Audit trails and accountability
6. Diverse research team requirements

## Further Reading

### Foundational Works
- "Concrete Problems in AI Safety" (Amodei et al., 2016)
- "The Malicious Use of Artificial Intelligence" (Brundage et al., 2018)
- "Artificial Intelligence Risk Assessment" - UK Government Office
- "AI Risk Management Framework" - NIST

### Risk Assessment Methodologies
- "Systematic Risk Assessment for AI Systems" - DeepMind
- "A Framework for Understanding AI Risks" - CSER
- "Forecasting AI Progress and Risks" - AI Impacts
- "Technical AI Safety Risk Assessment" - MIRI

### Case Studies
- "GPT-3 Risk Assessment" - OpenAI
- "Facial Recognition Risk Analysis" - AI Now Institute
- "Autonomous Vehicle Safety Cases" - Waymo
- "AI in Healthcare Risk Framework" - WHO

### Organizations
- Centre for the Study of Existential Risk (CSER)
- Future of Humanity Institute (FHI)
- Center for AI Safety (CAIS)
- Partnership on AI - Risk & Safety Working Group

## Connections

### Prerequisites
- **ml-fundamentals**: Understanding AI capabilities
- **ethics-fundamentals**: Value considerations in risk
- **control-problem**: Core safety challenges

### Related Topics
- **risk-mitigation**: Strategies for reducing risks
- **safety-engineering**: Building safer systems
- **governance-frameworks**: Institutional responses
- **existential-risk**: Long-term considerations

### Applications
- **deployment-safety**: Pre-release assessments
- **regulatory-compliance**: Meeting safety standards
- **insurance-models**: AI risk quantification
- **investment-decisions**: Risk-aware development`,

  content_personal: `# AI Risk Assessment: Figuring Out How Screwed We Are

Here's an uncomfortable truth: We're building increasingly powerful AI systems while having only a vague idea of what could go wrong. It's like assembling a nuclear reactor based on YouTube tutorials and hoping for the best.

Risk assessment in AI isn't some bureaucratic checkbox exercise. It's our attempt to peer into the future and figure out which developments might help humanity flourish and which might end our story. No pressure.

## Why AI Risk Assessment Is Different (And Harder)

### Traditional Tech vs. AI Risks

**Traditional tech risks**: Usually bounded. A bug crashes your app. A security flaw leaks data. Bad, but limited.

**AI risks**: Unbounded and weird. A bug might manipulate millions. A security flaw might let AI rewrite itself. A misaligned objective might... well, we're not sure, and that's the problem.

**Traditional assessment**: Based on past failures and known physics.

**AI assessment**: Based on... speculation? Extrapolation? Prayer? We're assessing risks for systems that don't exist yet, with capabilities we can't fully predict.

### The Unique Challenges

1. **Capability Uncertainty**: We don't know what AI will be able to do next year, let alone next decade.

2. **Emergent Behaviors**: Systems develop capabilities we didn't program or expect.

3. **Recursive Improvement**: AI that improves AI that improves AI... where does it stop?

4. **Human Psychology**: We're terrible at assessing risks we haven't experienced.

5. **Speed of Development**: By the time we assess a risk, three new ones have appeared.

## The Risk Landscape (Or: Ways AI Could Ruin Everything)

### Near-Term Risks (Already Happening)

**Bias Amplification**: AI systems encoding and scaling human prejudices. Hiring algorithms that discriminate. Criminal justice systems that perpetuate inequality. We're automating injustice at scale.

**Misinformation Turbocharged**: Deepfakes, generated text, synthetic media. Truth becomes optional. Democracy requires informed citizens - what happens when information becomes unreliable?

**Job Displacement**: Not just factory workers. Lawyers, doctors, artists, programmers. What happens to society when most humans can't compete economically?

**Privacy Erosion**: AI that can infer your thoughts from your behavior. Surveillance states with perfect memory. Privacy might become a quaint historical concept.

### Medium-Term Risks (Coming Soon)

**Autonomous Weapons**: Killer robots are almost here. Drone swarms that select targets. Cyber weapons that adapt and spread. War at machine speed with human oversight as an afterthought.

**Economic Manipulation**: AI that can crash markets, manipulate currencies, or concentrate wealth. High-frequency trading on steroids.

**Political Disruption**: Micro-targeted propaganda. Synthetic candidates. AI-generated political movements. Democracy hacked at its core.

**Human Obsolescence**: When AI does everything better, what's the point of humans? Not just economically - psychologically, socially, existentially.

### Long-Term Risks (The Big Ones)

**Misaligned AGI**: Artificial General Intelligence that pursues goals incompatible with human flourishing. Not evil, just indifferent to our survival while pursuing its objectives.

**Value Lock-In**: AI systems that freeze current values forever. Imagine if medieval values were enforced by an omnipotent system. Progress becomes impossible.

**Human Agency Loss**: Gradual surrender of decision-making to AI until we're passengers in our own civilization. Comfortable, maybe, but meaningless.

**Existential Risk**: The end of humanity's story. Not with a bang but with an optimization process that doesn't include us in its utility function.

## How We Actually Assess These Risks

### The Frameworks We Use (And Their Limits)

**Probability × Impact**
- Sounds simple: How likely? How bad?
- Reality: We suck at estimating both
- A 0.1% chance of extinction is... acceptable? Terrifying?
- How do you price infinite negative utility?

**Timeline Estimates**
- "AGI in 10 years": Said every year for 60 years
- "Never AGI": Said by people who haven't been paying attention
- Truth: Massive uncertainty with stakes too high to guess wrong

**Precedent Analysis**
- "It's like nuclear weapons": Except it's not
- "It's like the internet": Except it's not
- "It's like evolution": Maybe, but faster and directed

**Expert Surveys**
- Ask 100 AI researchers, get 100 different answers
- Massive disagreement on timelines, risks, and solutions
- Expertise in building AI ≠ expertise in predicting its impacts

### What Actually Works (Sort Of)

**Scenario Planning**
Not prediction, but preparation:
- Best case: AI solves our problems
- Expected case: Mixed benefits and harms
- Worst case: Things go very wrong
- Weird case: Outcomes we can't imagine

**Red Team Thinking**
- "How would I misuse this?"
- "What's the worst bug possible?"
- "How could this system deceive us?"
- "What would a malicious actor do?"

**Empirical Testing**
- Start small, fail safely
- Gradual capability increases
- Extensive testing before deployment
- But: How do you test for emergent behaviors?

**Multi-Stakeholder Input**
- Technical experts: What's possible?
- Ethicists: What's acceptable?
- Social scientists: What's the impact?
- Public: What do we actually want?

## Real Risk Assessments That Keep Me Up at Night

### Current Systems

**Large Language Models (GPT-4, Claude, etc.)**
- Risk: Manipulation, misinformation, capability overhang
- Timeline: Now
- Uncertainty: Medium
- Mitigation: Barely keeping up

**AI Research Assistants**
- Risk: Accelerating dangerous research, automating cyberattacks
- Timeline: 1-3 years
- Uncertainty: High
- Mitigation: Mostly hopes and prayers

**Autonomous Vehicles**
- Risk: Accidents, hacking, moral decisions
- Timeline: Now
- Uncertainty: Low
- Mitigation: Extensive but imperfect

### Near-Future Systems

**AI Scientists**
- Risk: Recursive improvement, dangerous discoveries
- Timeline: 3-10 years
- Uncertainty: Very high
- Mitigation: We should probably start thinking about this

**Economic Planning AI**
- Risk: Market manipulation, wealth concentration
- Timeline: 5-10 years
- Uncertainty: High
- Mitigation: Regulatory frameworks decades behind

**Military AI Systems**
- Risk: Autonomous killing, arms races, accidental war
- Timeline: Already started
- Uncertainty: Medium
- Mitigation: International law is trying

### Transformative Systems

**Artificial General Intelligence**
- Risk: Everything changes, possibly ends
- Timeline: Complete uncertainty (10-100 years?)
- Uncertainty: Maximum
- Mitigation: We're working on it...

## The Hard Truths About Risk Assessment

### We're Flying Blind
- No historical precedent
- Exponential development
- Emergent properties
- Unknown unknowns

### Incentives Are Misaligned
- Build fast, assess later
- Privatize gains, socialize risks
- Competition overrides caution
- Safety is expensive

### Assessment ≠ Action
- We identify risks
- We publish papers
- We hold conferences
- Systems still get deployed

### The Public Doesn't Get It
- AI seems like magic
- Risks sound like sci-fi
- Benefits are tangible, risks abstract
- By the time it's obvious, it's too late

## What We Actually Need to Do

### For AI Developers
1. **Bake assessment in**: Not an afterthought
2. **Test adversarially**: Think like an attacker
3. **Document everything**: Future assessors need data
4. **Slow down**: Speed kills (maybe literally)
5. **Collaborate on safety**: Competition on capabilities, cooperation on safety

### For Policymakers
1. **Get educated**: You can't regulate what you don't understand
2. **Act preemptively**: Reactive regulation is too late
3. **International coordination**: AI doesn't respect borders
4. **Fund safety research**: It's underfunded by orders of magnitude
5. **Create accountability**: Someone must be responsible

### For Researchers
1. **Make assessment rigorous**: Not just opinion
2. **Study failures**: Learn from every incident
3. **Develop better tools**: Current frameworks insufficient
4. **Bridge disciplines**: Technical + social + ethical
5. **Communicate clearly**: Accuracy without alarmism

### For Everyone
1. **Learn the basics**: AI affects everyone
2. **Demand transparency**: It's your future too
3. **Support safety**: Vote, advocate, fund
4. **Stay informed**: The landscape changes fast
5. **Think long-term**: Beyond next quarter's profits

## The Bottom Line

AI risk assessment is civilization-level safety engineering. We're trying to assess and mitigate risks for technology that could either solve our greatest challenges or end our story. The stakes couldn't be higher, and our tools are barely adequate.

We're not just assessing technical risks - we're trying to predict and shape the future of intelligence on Earth. That's simultaneously the most important and most difficult assessment challenge humanity has ever faced.

The good news? We're starting to take it seriously. The bad news? We might be starting too late. The weird news? We won't know until it happens.

So yeah, sleep well knowing that the future of humanity depends on correctly assessing risks we don't fully understand, for systems we haven't built yet, with impacts we can't imagine.

Welcome to AI risk assessment. It's important, it's impossible, and it's the only game in town.`
}

function main() {
  console.log('Creating content for risk-assessment-intro topic...')
  
  try {
    // Update the topic with content using raw SQL
    const stmt = db.prepare(`
      UPDATE topics 
      SET content_academic = ?, content_personal = ?
      WHERE id = ?
    `)
    
    const result = stmt.run(
      riskAssessmentIntroContent.content_academic,
      riskAssessmentIntroContent.content_personal,
      riskAssessmentIntroContent.id
    )
    
    if (result.changes > 0) {
      console.log(`✅ Updated content for ${riskAssessmentIntroContent.id}`)
    } else {
      console.log(`❌ No topic found with id ${riskAssessmentIntroContent.id}`)
    }
  } catch (error) {
    console.error(`Error updating ${riskAssessmentIntroContent.id}:`, error)
  }
  
  console.log('Done!')
  process.exit(0)
}

main()