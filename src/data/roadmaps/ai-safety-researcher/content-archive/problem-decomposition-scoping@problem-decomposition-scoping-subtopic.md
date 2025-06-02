# Problem Decomposition & Scoping

The art of transforming ambitious AI safety visions into concrete, actionable research projects. This skill bridges the gap between "we need to solve alignment" and "here's what I'm working on this week."

## Core Principles

### 1. Start with the End Goal
Before decomposing, clearly articulate:
- What does success look like?
- How will we know when we've made progress?
- What are the observable outcomes?

### 2. The Decomposition Process

**Level 1: Grand Challenge**
Example: "Ensure AI systems remain aligned with human values as they become more capable"

**Level 2: Research Areas**
- Value learning and specification
- Robustness to distribution shift
- Interpretability of learned values
- Corrigibility mechanisms

**Level 3: Concrete Questions**
- "Can we detect when a model's behavior diverges from training?"
- "How do reward models generalize to new domains?"
- "What features correlate with deceptive behavior?"

**Level 4: Tractable Experiments**
- "Build a toy environment where we can induce goal misgeneralization"
- "Compare reward model outputs on held-out ethical dilemmas"
- "Train probes to detect planning behavior in transformer layers"

## Scoping Strategies

### 1. The Minimum Viable Experiment (MVE)
- What's the smallest test that could invalidate your hypothesis?
- Can you build a proof-of-concept in days, not months?
- What assumptions can you temporarily accept to make progress?

### 2. Time-Boxing Research
- 2-day exploration: "Can this approach work at all?"
- 2-week prototype: "Does this show promise?"
- 2-month project: "Is this publication-worthy?"

### 3. The "Good Enough" Principle
- Perfect is the enemy of done
- Iterate rather than optimize
- Publication ≠ Problem solved

## Common Pitfalls

### 1. Scope Creep
**Symptom**: "But we also need to consider..."
**Solution**: Write down out-of-scope items for future work

### 2. Analysis Paralysis
**Symptom**: Endless literature review without experimentation
**Solution**: Set a deadline for moving to implementation

### 3. Premature Optimization
**Symptom**: Building elaborate infrastructure before validating the idea
**Solution**: Start with hacky prototypes

## Practical Techniques

### 1. The Research Question Generator
Turn vague concerns into specific questions:
- "I'm worried about X" → "Under what conditions does X occur?"
- "We need Y" → "What are the minimum requirements for Y?"
- "Z is important" → "How do we measure Z?"

### 2. The Assumption Stack
List all assumptions your research makes, ordered by:
- How critical they are to your conclusions
- How likely they are to be wrong
- How hard they are to test

### 3. Success Criteria Template
Before starting any project, define:
- **Minimum Success**: What's the least that makes this worthwhile?
- **Expected Success**: What do you realistically hope to achieve?
- **Exceptional Success**: What would exceed expectations?

## Case Study: From "AI Deception" to Research Project

**Starting Point**: "We need to solve the problem of AI systems being deceptive"

**Decomposition Process**:
1. **Define Deception**: Intentional vs. emergent, active vs. passive
2. **Identify Subtypes**: Lies, misdirection, concealment, paltering
3. **Choose Focus**: Concealment of capabilities in evaluation
4. **Operationalize**: Models performing worse on tests than their true ability
5. **Design Experiment**: Compare model performance with/without knowledge of evaluation
6. **Build Prototype**: Simple grid world where agents can hide their planning ability

**Result**: A 2-week project that provides empirical evidence and publishable insights

## Tools and Frameworks

### Research Canvas
Create a one-page overview:
- Research Question (one sentence)
- Why It Matters (three bullets)
- Method (paragraph)
- Success Metrics (three concrete measures)
- Timeline (key milestones)
- Dependencies (what you need)

### The "Five Whys" for Research
1. Why is this problem important?
2. Why hasn't it been solved?
3. Why might your approach work?
4. Why should you be the one to do it?
5. Why now?

## Action Items

1. **This Week**: Take one of your "big ideas" and decompose it into 5-10 specific research questions
2. **This Month**: Choose one question and design a minimum viable experiment
3. **This Quarter**: Complete one small-scale study from idea to written results

Remember: The goal isn't to solve everything at once. It's to make consistent, measurable progress on hard problems.

## Resources

- [@article@How to do Research At the MIT AI Lab (1988)](https://dspace.mit.edu/handle/1721.1/41487) - Classic advice that still holds
- [@video@Richard Hamming: You and Your Research](https://www.youtube.com/watch?v=a1zDuOPkMSw) - On choosing important, tractable problems
- [@article@An Opinionated Guide to ML Research](http://joschu.net/blog/opinionated-guide-ml-research.html) - John Schulman on research strategy
- [@article@How to do good research, get it published in top venues, and have real-world impact](https://people.cs.umass.edu/~wallach/how_to_do_research.pdf) - Practical academic advice