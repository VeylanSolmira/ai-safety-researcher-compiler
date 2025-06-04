import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

interface ExternalResource {
  id: string
  name: string
  type: string
  url: string
  description?: string
  metadata?: any
}

const externalResources: ExternalResource[] = [
  // Courses
  {
    id: 'aisf-fundamentals',
    name: 'AI Safety Fundamentals',
    type: 'course',
    url: 'https://aisafetyfundamentals.com/',
    description: 'Comprehensive course covering AI alignment, governance, and technical safety',
    metadata: { provider: 'BlueDot Impact', duration: '8 weeks' }
  },
  {
    id: 'mlsafety-course',
    name: 'ML Safety Course',
    type: 'course',
    url: 'https://course.mlsafety.org/',
    description: 'Technical course on machine learning safety by Dan Hendrycks',
    metadata: { provider: 'Center for AI Safety', level: 'intermediate' }
  },
  
  // Blogs
  {
    id: 'alignment-forum',
    name: 'Alignment Forum',
    type: 'blog',
    url: 'https://alignmentforum.org/',
    description: 'High-quality technical AI alignment research and discussion',
    metadata: { type: 'research-focused' }
  },
  {
    id: 'lesswrong',
    name: 'LessWrong',
    type: 'blog',
    url: 'https://lesswrong.com/',
    description: 'Community blog featuring AI safety and rationality content',
    metadata: { type: 'community' }
  },
  {
    id: 'anthropic-research',
    name: 'Anthropic Research Blog',
    type: 'blog',
    url: 'https://www.anthropic.com/research',
    description: 'Research updates from Anthropic on AI safety and alignment',
    metadata: { organization: 'Anthropic' }
  },
  
  // Tools
  {
    id: 'openai-gym',
    name: 'OpenAI Gym',
    type: 'tool',
    url: 'https://gymnasium.farama.org/',
    description: 'Toolkit for developing and comparing reinforcement learning algorithms',
    metadata: { language: 'Python' }
  },
  {
    id: 'transformer-lens',
    name: 'TransformerLens',
    type: 'tool',
    url: 'https://github.com/neelnanda-io/TransformerLens',
    description: 'Library for mechanistic interpretability of GPT-style language models',
    metadata: { author: 'Neel Nanda', language: 'Python' }
  },
  
  // Podcasts
  {
    id: '80k-podcast',
    name: '80,000 Hours Podcast',
    type: 'podcast',
    url: 'https://80000hours.org/podcast/',
    description: 'In-depth interviews on AI safety, existential risk, and effective altruism',
    metadata: { host: 'Rob Wiblin' }
  },
  {
    id: 'future-of-life-podcast',
    name: 'Future of Life Institute Podcast',
    type: 'podcast',
    url: 'https://futureoflife.org/podcast/',
    description: 'Conversations about existential risk, AI safety, and the future of humanity',
    metadata: { organization: 'FLI' }
  },
  
  // Communities
  {
    id: 'aisafety-slack',
    name: 'AI Safety Slack',
    type: 'community',
    url: 'https://aisafety.com/slack',
    description: 'Active Slack community for AI safety researchers and practitioners',
    metadata: { members: '5000+' }
  },
  {
    id: 'ea-forum',
    name: 'EA Forum',
    type: 'community',
    url: 'https://forum.effectivealtruism.org/',
    description: 'Effective Altruism community discussing AI safety among other cause areas',
    metadata: { focus: 'EA community' }
  },
  
  // Papers/Research
  {
    id: 'arxiv-ai-safety',
    name: 'arXiv AI Safety Papers',
    type: 'paper',
    url: 'https://arxiv.org/list/cs.AI/recent',
    description: 'Latest AI research papers including safety-relevant work',
    metadata: { updated: 'daily' }
  },
  
  // Colab Notebooks
  {
    id: 'prerequisites-checker',
    name: 'Interactive Prerequisites Checker',
    type: 'colabNotebooks',
    url: 'https://colab.research.google.com/drive/1ZJPKczTS9WqXoG2MYF33NMFadrCMPWY5',
    description: 'Test your Python, ML, and math foundations with hands-on exercises'
  },
  {
    id: 'first-safety-experiment',
    name: 'Your First Safety Experiment',
    type: 'colabNotebooks',
    url: 'https://colab.research.google.com/drive/1ZJPKczTS9WqXoG2MYF33NMFadrCMPWY5',
    description: 'Build a toy model and explore alignment challenges firsthand'
  }
]

function populateExternalResources() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')
  
  try {
    // Start transaction
    db.prepare('BEGIN').run()
    
    const insert = db.prepare(`
      INSERT OR REPLACE INTO external_resources (id, name, type, url, description, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    for (const resource of externalResources) {
      insert.run(
        resource.id,
        resource.name,
        resource.type,
        resource.url,
        resource.description || null,
        resource.metadata ? JSON.stringify(resource.metadata) : null
      )
      console.log(`✅ Added ${resource.type}: ${resource.name}`)
    }
    
    // Commit transaction
    db.prepare('COMMIT').run()
    console.log(`\n✅ Successfully added ${externalResources.length} external resources!`)
    
  } catch (error) {
    // Rollback on error
    db.prepare('ROLLBACK').run()
    console.error('❌ Error adding resources:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the script
populateExternalResources()