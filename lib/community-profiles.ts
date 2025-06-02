// Detailed profiles for community members
// These contain the full information from markdown files and other sources

export interface CommunityProfile {
  id: string
  name: string
  role: string
  website?: string
  tags: string[]
  personalNote?: string
  overview: string
  contributions?: Record<string, string[]>
  assessment?: {
    strengths?: Record<string, string>
    concerns?: Record<string, string>
  }
  criticalQuestions?: Array<{
    question: string
    context?: string
  }>
  alternativePerspectives?: string[]
  resources?: Array<{
    type: 'video' | 'article' | 'course' | 'paper' | 'tool' | 'blog'
    title: string
    url: string
  }>
  disclaimer?: string
}

export const profiles: Record<string, CommunityProfile> = {
  'neel-nanda': {
    id: 'neel-nanda',
    name: 'Neel Nanda',
    role: 'Mechanistic Interpretability Researcher at Anthropic',
    website: 'https://www.neelnanda.io',
    tags: ['Mechanistic Interpretability', 'Transformer Circuits', 'Education', 'TransformerLens'],
    personalNote: 'While I respect Neel\'s work on mechanistic interpretability, I have some nuanced views on his approach and influence.',
    overview: 'Neel Nanda is a prominent researcher in mechanistic interpretability at Anthropic. He\'s known for making interpretability research more accessible through his tutorials and educational content.',
    contributions: {
      'Mechanistic Interpretability': [
        'Pioneered accessible tutorials on transformer circuits',
        'Created the TransformerLens library',
        'Advocates for understanding AI systems at a mechanistic level'
      ],
      'Educational Impact': [
        'His "200 Concrete Open Problems in Mechanistic Interpretability" post',
        'Regular educational threads on Twitter/X',
        'Mentorship of new researchers'
      ]
    },
    assessment: {
      strengths: {
        'Accessibility': 'Neel has done more than almost anyone to make interpretability approachable',
        'Practical focus': 'His work emphasizes concrete, implementable techniques',
        'Community building': 'He\'s created a vibrant community around mech interp'
      },
      concerns: {
        'Over-optimism': 'I think he sometimes underestimates the difficulty of scaling interpretability',
        'Narrow focus': 'The emphasis on transformers may miss important aspects of other architectures',
        'Hype vs. Reality': 'The excitement around mech interp sometimes outpaces actual progress'
      }
    },
    criticalQuestions: [
      {
        question: 'Scalability',
        context: 'Will these techniques work on frontier models, or only toy problems?'
      },
      {
        question: 'Relevance',
        context: 'Does understanding circuits actually help with alignment?'
      },
      {
        question: 'Resource allocation',
        context: 'Is mech interp getting too much attention relative to other approaches?'
      }
    ],
    alternativePerspectives: [
      'Black-box methods might be more practical for real-world safety',
      'Behavioral testing could be more scalable than mechanistic understanding',
      'The interpretability agenda might be a distraction from more direct safety work'
    ],
    resources: [
      {
        type: 'video',
        title: 'Neel\'s Introduction to Mechanistic Interpretability',
        url: 'https://www.youtube.com/watch?v=example'
      },
      {
        type: 'tool',
        title: 'TransformerLens',
        url: 'https://github.com/neelnanda-io/TransformerLens'
      },
      {
        type: 'blog',
        title: '200 Concrete Open Problems in Mechanistic Interpretability',
        url: 'https://www.alignmentforum.org/posts/LbrPTJ4fmABEdEnLf/200-concrete-open-problems-in-mechanistic-interpretability'
      },
      {
        type: 'course',
        title: 'ARENA - Mechanistic Interpretability',
        url: 'https://arena3-chapter1-transformer-interp.streamlit.app/'
      }
    ],
    disclaimer: 'These are my personal opinions. Neel\'s work has undeniably advanced the field, and reasonable people can disagree about priorities and approaches in AI safety.'
  },
  
  'paul-christiano': {
    id: 'paul-christiano',
    name: 'Paul Christiano',
    role: 'Founder of Alignment Research Center',
    website: 'https://paulfchristiano.com',
    tags: ['Alignment Theory', 'RLHF', 'IDA', 'Prosaic AI Alignment'],
    overview: 'Paul Christiano is one of the most influential alignment researchers, known for developing RLHF (Reinforcement Learning from Human Feedback) and IDA (Iterated Distillation and Amplification). He founded the Alignment Research Center and previously led the safety team at OpenAI.',
    contributions: {
      'Technical Contributions': [
        'Co-invented RLHF, now widely used in language models',
        'Developed Iterated Distillation and Amplification (IDA)',
        'Pioneered work on AI Safety via Debate',
        'Contributed to prosaic AI alignment approaches'
      ],
      'Conceptual Work': [
        'Formalized many alignment problems',
        'Developed frameworks for thinking about AI safety',
        'Bridge between theoretical and practical alignment work'
      ]
    },
    resources: [
      {
        type: 'paper',
        title: 'AI Safety via Debate',
        url: 'https://arxiv.org/abs/1805.00899'
      },
      {
        type: 'blog',
        title: 'Paul Christiano\'s AI Alignment Blog',
        url: 'https://ai-alignment.com/'
      }
    ]
  },
  
  'eliezer-yudkowsky': {
    id: 'eliezer-yudkowsky',
    name: 'Eliezer Yudkowsky',
    role: 'Founder of MIRI',
    website: 'https://yudkowsky.net',
    tags: ['AI Risk', 'Alignment Theory', 'Rationality', 'AGI Safety'],
    personalNote: 'Eliezer\'s work has been foundational to the field, though his views on AI doom are controversial.',
    overview: 'Eliezer Yudkowsky is a foundational figure in AI safety, having founded the Machine Intelligence Research Institute (MIRI) and written extensively about AI existential risk. He\'s known for his work on rationality and his pessimistic views on humanity\'s chances of solving alignment.',
    contributions: {
      'Foundational Work': [
        'Founded MIRI (formerly SIAI) in 2000',
        'Popularized AI existential risk concerns',
        'Developed early alignment theory concepts',
        'Created the LessWrong community'
      ],
      'Writing and Outreach': [
        'Wrote the Sequences on rationality',
        'Author of "Harry Potter and the Methods of Rationality"',
        'AGI Ruin: A List of Lethalities',
        'Extensive writing on AI alignment challenges'
      ]
    },
    assessment: {
      strengths: {
        'Prescience': 'Identified AI safety as crucial decades before mainstream acceptance',
        'Theoretical depth': 'Deep thinking about fundamental alignment challenges',
        'Community building': 'Created intellectual communities around rationality and AI safety'
      },
      concerns: {
        'Pessimism': 'His extreme pessimism might be counterproductive',
        'Accessibility': 'Writing style can be dense and off-putting to newcomers',
        'Rigidity': 'Sometimes dismissive of approaches outside his paradigm'
      }
    },
    criticalQuestions: [
      {
        question: 'Doom probability',
        context: 'Are his >90% doom estimates justified or harmful to the field?'
      },
      {
        question: 'Strategic approach',
        context: 'Is his focus on fundamental theory vs. prosaic alignment correct?'
      }
    ],
    resources: [
      {
        type: 'article',
        title: 'AGI Ruin: A List of Lethalities',
        url: 'https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities'
      },
      {
        type: 'blog',
        title: 'The Sequences',
        url: 'https://www.lesswrong.com/sequences'
      }
    ]
  },
  
  'stuart-russell': {
    id: 'stuart-russell',
    name: 'Stuart Russell',
    role: 'UC Berkeley Professor',
    website: 'https://people.eecs.berkeley.edu/~russell/',
    tags: ['Human-Compatible AI', 'AI Governance', 'Value Alignment', 'AI Textbook Author'],
    overview: 'Stuart Russell is a professor of Computer Science at UC Berkeley and co-author of "Artificial Intelligence: A Modern Approach", the leading AI textbook. He\'s a prominent advocate for AI safety and author of "Human Compatible: AI and the Problem of Control".',
    contributions: {
      'Academic Contributions': [
        'Co-authored the standard AI textbook used globally',
        'Developed the concept of human-compatible AI',
        'Founded the Center for Human-Compatible AI (CHAI)',
        'Influential work on value alignment and uncertainty'
      ],
      'Public Advocacy': [
        'Testified to Congress about AI risks',
        'BBC Reith Lectures on AI',
        'Public speaking on AI safety to mainstream audiences',
        'Bridges academic AI and safety communities'
      ]
    },
    resources: [
      {
        type: 'course',
        title: 'Human Compatible: AI and the Problem of Control',
        url: 'https://www.humancompatible.ai/book'
      },
      {
        type: 'video',
        title: 'BBC Reith Lectures 2021',
        url: 'https://www.bbc.co.uk/programmes/m001216w'
      }
    ]
  },
  
  // Add more detailed profiles as needed
  'anthropic': {
    id: 'anthropic',
    name: 'Anthropic',
    role: 'AI Safety Company',
    website: 'https://www.anthropic.com',
    tags: ['Constitutional AI', 'Claude', 'Interpretability', 'RLHF', 'AI Safety'],
    overview: 'Anthropic is an AI safety company founded by former OpenAI executives Dario and Daniela Amodei. The company focuses on building reliable, interpretable, and steerable AI systems, with their flagship product being Claude.',
    contributions: {
      'Technical Innovations': [
        'Developed Constitutional AI (CAI)',
        'Advanced work on mechanistic interpretability',
        'Created Claude using safety-first principles',
        'Published influential safety research'
      ],
      'Safety Culture': [
        'Demonstrated commercial viability of safety-focused AI',
        'Open publication of safety research',
        'Collaboration with academic safety researchers',
        'Focus on empirical safety work'
      ]
    },
    resources: [
      {
        type: 'paper',
        title: 'Constitutional AI: Harmlessness from AI Feedback',
        url: 'https://arxiv.org/abs/2212.08073'
      },
      {
        type: 'tool',
        title: 'Claude',
        url: 'https://claude.ai'
      },
      {
        type: 'blog',
        title: 'Anthropic Research Blog',
        url: 'https://www.anthropic.com/research'
      }
    ]
  }
}