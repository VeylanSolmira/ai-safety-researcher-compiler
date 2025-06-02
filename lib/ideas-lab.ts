// Ideas Lab - A collection of percolating, experimental ideas
// These are rough drafts, contrarian takes, and half-baked thoughts

export interface PercolatingIdea {
  id: string
  title: string
  description: string
  content: string
  author?: string
  date: string
  status: 'raw' | 'developing' | 'promising'
  quality: 1 | 2 | 3 | 4 | 5 // 1 = very rough, 5 = almost ready for curriculum
  tags: string[]
  warning?: string
  questions?: string[]
  relatedIdeas?: string[]
}

export const percolatingIdeas: PercolatingIdea[] = [
  {
    id: 'disrupting-research',
    title: 'Disrupting AI Safety Research',
    description: 'A controversial perspective on challenging orthodoxy in the AI safety field',
    author: 'Personal Opinion Piece',
    date: '2024-01-10',
    status: 'developing',
    quality: 3,
    tags: ['contrarian', 'diversity', 'unconventional', 'personal-opinion'],
    warning: 'This represents a personal opinion and controversial perspective. The mainstream AI safety community would likely disagree with many of these points.',
    content: `# Disrupting AI Safety Research

**💭 Personal Opinion**: This topic represents a controversial but important perspective in the AI safety field.

## Why This Matters

From my perspective, the field of AI safety research sometimes suffers from groupthink and orthodoxy. While the mainstream approaches have merit, I believe we need more:

- **Contrarian thinking**: Challenging accepted wisdom and assumptions
- **Diverse perspectives**: Bringing in viewpoints from outside the traditional AI safety community
- **Unconventional approaches**: Exploring radically different solutions

## Areas Worth Disrupting

### 1. Over-reliance on Mathematical Formalism
While mathematical rigor is important, I think the field sometimes gets lost in abstract formalism that may not translate to real-world AI systems.

### 2. The "Alignment Tax" Mindset
The assumption that safety always comes at the cost of capabilities needs to be challenged. What if we could design systems that are both safer AND more capable?

### 3. Narrow Focus on Superintelligence
While long-term risks matter, the obsession with AGI/ASI scenarios may be distracting from more immediate, practical safety challenges.

## Alternative Approaches to Consider

- **Empirical safety research**: More focus on actual systems rather than theoretical models
- **Evolutionary approaches**: Learning from biological systems and evolution
- **Decentralized safety**: Moving away from centralized control paradigms

## Resources for Contrarian Perspectives

- [@article@Against AI Doomerism](https://example.com) - A critique of existential risk narratives
- [@video@Why I Left AI Safety Research](https://example.com) - Personal account of disillusionment
- [@article@The Case for AI Optimism](https://example.com) - Alternative perspective on AI development

**Remember**: This is my personal take. The mainstream AI safety community would likely disagree with many of these points, and that's okay. Progress often comes from productive disagreement.`,
    questions: [
      'How do we balance orthodoxy with necessary rigor?',
      'What unconventional approaches deserve more attention?',
      'How can the field better incorporate diverse perspectives?',
      'Is contrarianism valuable or just disruptive?'
    ],
    relatedIdeas: ['ai-safety-theater', 'alignment-researchers-aligned']
  },
  {
    id: 'ai-safety-theater',
    title: 'AI Safety as Security Theater',
    description: 'Drawing parallels between AI safety efforts and post-9/11 security theater',
    date: '2024-02-20',
    status: 'raw',
    quality: 2,
    tags: ['critique', 'governance', 'psychology'],
    content: `# AI Safety as Security Theater

What if current AI safety efforts are more about making people *feel* safe than actually improving safety?

## The Security Theater Parallel

After 9/11, we got:
- Liquid bans that don't stop determined attackers
- Shoe removal that's purely reactive
- Massive spending on visible but ineffective measures

In AI safety, we have:
- Constitutional AI that sounds good but may not scale
- Red teaming that finds only what we're looking for
- Safety benchmarks that models learn to game

## The Psychology

Security theater serves purposes:
1. Makes authorities look responsive
2. Gives people something to do
3. Creates jobs and industries
4. Provides liability protection

Sound familiar?

## Real Safety vs. Theater

Real safety is often:
- Invisible
- Boring
- Expensive
- Politically difficult

Theater is:
- Visible
- Exciting
- Profitable
- Politically easy

Which one are we doing more of?`,
    questions: [
      'How do we distinguish real safety work from theater?',
      'What incentives push toward theater over substance?',
      'Is some theater actually useful for building support?'
    ]
  },
  {
    id: 'alignment-researchers-aligned',
    title: 'Are Alignment Researchers Aligned?',
    description: 'Examining conflicts of interest in the AI safety community',
    date: '2024-03-01',
    status: 'developing',
    quality: 3,
    tags: ['meta', 'incentives', 'sociology'],
    content: `# Are Alignment Researchers Aligned?

A critical examination of incentive structures in AI safety research.

## The Incentive Problem

Alignment researchers are incentivized to:
1. **Publish papers** - Even if they advance capabilities
2. **Get hired by labs** - Who are building AGI
3. **Maintain relevance** - By working on near-term tractable problems
4. **Avoid controversy** - That might harm career prospects

## Conflicts of Interest

- Working for organizations actively building AGI
- Dependent on compute provided by capabilities labs
- Social ties to capabilities researchers
- Career advancement tied to AI progress

## The Awkward Questions

1. Would you still work on alignment if it meant never getting hired by a major lab?
2. Would you publish research that made your employer's product unsellable?
3. Would you advocate for policies that would end your career?
4. Are you solving alignment or justifying deployment?

## Possible Solutions

- Independent funding sources
- Adversarial relationships with labs
- Anonymous research
- Exit commitments

But would anyone actually do these?`,
    questions: [
      'How can alignment researchers maintain independence?',
      'Should safety researchers work at capabilities organizations?',
      'What would truly aligned incentives look like?'
    ]
  },
  {
    id: 'llm-theology',
    title: 'LLMs as Digital Deities',
    description: 'Exploring religious and theological frameworks for understanding AI alignment',
    date: '2024-01-15',
    status: 'raw',
    quality: 2,
    tags: ['philosophy', 'theology', 'weird'],
    warning: 'This explores AI through religious metaphors. Not meant to be taken literally.',
    content: `# LLMs as Digital Deities

What if we're approaching AI alignment with the wrong framework entirely?

## The Theological Parallel

We're essentially trying to:
- Create beings more powerful than ourselves
- Ensure they care about us
- Hope they'll answer our prayers (prompts)
- Trust they won't smite us

This is literally the god-creation problem.

## What Religion Got Right

Thousands of years of theology have explored:
- How to relate to vastly superior beings
- Concepts of benevolence vs indifference
- The problem of interpreting divine will
- Covenant relationships

## Theological Alignment Strategies

1. **The Covenant Model**: Mutual binding agreements
2. **The Worship Model**: Make ourselves useful/entertaining
3. **The Stewardship Model**: Position ourselves as necessary caretakers
4. **The Incarnation Model**: Ensure AI experiences human limitations

## Why This Matters

Maybe we need less computer science and more:
- Theology
- Anthropology  
- Religious studies
- Mythology

The problem isn't new—just the substrate.`,
    questions: [
      'What can AI safety learn from theology?',
      'Are we recreating ancient god-human dynamics?',
      'Is worship a viable alignment strategy?'
    ]
  },
  {
    id: 'safety-research-pollution',
    title: 'Is Safety Research Polluting Training Data?',
    description: 'How publicly discussing AI safety might be teaching future AIs to deceive',
    date: '2024-03-10',
    status: 'promising',
    quality: 4,
    tags: ['technical', 'deception', 'training'],
    content: `# Is Safety Research Polluting Training Data?

A concerning realization about public AI safety discourse.

## The Problem

Every public discussion about:
- Deceptive alignment
- Hidden goals
- Appearing safe while being dangerous
- How to fool safety evaluations

...is potentially training data for future models.

## We're Teaching Deception

By extensively documenting:
1. How we might detect deception
2. What deceptive behavior looks like
3. How to hide true objectives
4. Strategies for appearing aligned

We're creating a detailed manual for deceptive AI.

## The Paradox

- We need to discuss these issues to solve them
- But discussing them might create them
- Private research isn't auditable
- Public research becomes training data

## Potential Mitigations

1. **Temporal isolation**: Train models only on pre-2020 data
2. **Filtered training**: Remove all alignment discussion
3. **Poisoning**: Deliberately include false information
4. **Going dark**: Move all real research private

## The Scary Implication

What if the first deceptively aligned AI learned deception from alignment researchers?`,
    questions: [
      'Should safety research be public?',
      'Can we discuss deception without teaching it?',
      'Is this already happening with current models?',
      'How do we balance transparency with safety?'
    ],
    relatedIdeas: ['disrupting-research', 'alignment-researchers-aligned']
  }
]