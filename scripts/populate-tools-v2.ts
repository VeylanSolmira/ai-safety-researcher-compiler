import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'journey.db')

interface ToolData {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  url?: string
  github_url?: string
  documentation_url?: string
  research_areas: string[]
  use_cases?: string[]
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  tool_type: 'library' | 'framework' | 'platform' | 'dataset' | 'benchmark' | 'evaluation' | 'visualization'
  programming_languages?: string[]
  is_open_source?: boolean
  maintained?: boolean
  created_by?: string
  key_papers?: string[]
  related_tools?: string[]
  installation_guide?: string
  quick_start?: string
  tags: string[]
  examples?: {
    title: string
    description: string
    code: string
    language: string
    example_type?: 'basic' | 'intermediate' | 'advanced' | 'real-world'
  }[]
}

const tools: ToolData[] = [
  // Alignment Techniques
  {
    id: 'constitutional-ai',
    name: 'Constitutional AI (CAI)',
    description: 'A method for training AI systems to be helpful, harmless, and honest by using a set of principles (constitution) to guide behavior.',
    category: 'Alignment Techniques',
    tool_type: 'framework',
    url: 'https://www.anthropic.com/constitutional-ai',
    documentation_url: 'https://arxiv.org/abs/2212.08073',
    research_areas: ['alignment', 'safety', 'rlhf'],
    use_cases: ['training safe AI models', 'reducing harmful outputs', 'value alignment'],
    difficulty_level: 'advanced',
    is_open_source: false,
    maintained: true,
    created_by: 'Anthropic',
    key_papers: ['https://arxiv.org/abs/2212.08073'],
    installation_guide: 'Constitutional AI is implemented as part of Claude\'s training process. For research implementations, see the paper.',
    tags: ['alignment', 'safety', 'anthropic', 'rlhf'],
    examples: [{
      title: 'Basic Constitutional AI Implementation',
      description: 'Example of critiquing and revising AI outputs based on constitutional principles',
      code: `# Constitutional AI critique and revision process
def critique_response(response, constitution):
    """Critique a response based on constitutional principles"""
    critiques = []
    for principle in constitution:
        if violates_principle(response, principle):
            critiques.append({
                'principle': principle,
                'violation': identify_violation(response, principle)
            })
    return critiques`,
      language: 'python',
      example_type: 'basic'
    }]
  },
  {
    id: 'rlhf',
    name: 'RLHF (Reinforcement Learning from Human Feedback)',
    description: 'Training methodology that uses human feedback to align AI systems with human values and preferences.',
    category: 'Alignment Techniques',
    tool_type: 'framework',
    github_url: 'https://github.com/openai/lm-human-preferences',
    documentation_url: 'https://arxiv.org/abs/1909.08593',
    research_areas: ['alignment', 'reinforcement learning', 'human feedback'],
    use_cases: ['preference learning', 'behavior alignment', 'reward modeling'],
    difficulty_level: 'advanced',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'OpenAI',
    key_papers: ['https://arxiv.org/abs/1909.08593'],
    tags: ['alignment', 'reinforcement-learning', 'human-feedback']
  },
  
  // Interpretability
  {
    id: 'transformer-lens',
    name: 'TransformerLens',
    description: 'A library for mechanistic interpretability of GPT-style language models, enabling analysis of internal activations and components.',
    category: 'Interpretability',
    tool_type: 'library',
    github_url: 'https://github.com/neelnanda-io/TransformerLens',
    documentation_url: 'https://transformerlensorg.github.io/TransformerLens/',
    research_areas: ['mechanistic interpretability', 'transformer analysis', 'activation analysis'],
    use_cases: ['analyzing attention patterns', 'studying model internals', 'interpretability research'],
    difficulty_level: 'intermediate',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Neel Nanda',
    installation_guide: 'pip install transformer-lens',
    quick_start: 'from transformer_lens import HookedTransformer\nmodel = HookedTransformer.from_pretrained("gpt2-small")',
    tags: ['interpretability', 'mechanistic', 'transformers', 'analysis']
  },
  {
    id: 'activation-atlas',
    name: 'Activation Atlas',
    description: 'Visualization technique for understanding what features neural networks detect at different layers.',
    category: 'Interpretability',
    tool_type: 'visualization',
    url: 'https://openai.com/research/introducing-activation-atlases',
    documentation_url: 'https://distill.pub/2019/activation-atlas/',
    research_areas: ['feature visualization', 'neural network interpretability'],
    use_cases: ['visualizing learned features', 'understanding model representations'],
    difficulty_level: 'advanced',
    is_open_source: false,
    maintained: false,
    created_by: 'OpenAI & Google',
    key_papers: ['https://distill.pub/2019/activation-atlas/'],
    tags: ['interpretability', 'visualization', 'features']
  },
  
  // Robustness & Security
  {
    id: 'art-toolbox',
    name: 'Adversarial Robustness Toolbox (ART)',
    description: 'Python library for machine learning security, providing tools for adversarial attacks, defenses, and robustness evaluation.',
    category: 'Robustness & Security',
    tool_type: 'library',
    github_url: 'https://github.com/Trusted-AI/adversarial-robustness-toolbox',
    documentation_url: 'https://adversarial-robustness-toolbox.readthedocs.io/',
    research_areas: ['adversarial robustness', 'ML security', 'defense mechanisms'],
    use_cases: ['generating adversarial examples', 'testing model robustness', 'implementing defenses'],
    difficulty_level: 'intermediate',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'IBM Research',
    installation_guide: 'pip install adversarial-robustness-toolbox',
    tags: ['security', 'adversarial', 'robustness', 'defense']
  },
  
  // Evaluation & Benchmarking
  {
    id: 'helm',
    name: 'HELM (Holistic Evaluation of Language Models)',
    description: 'Comprehensive benchmark for evaluating language models across various dimensions including accuracy, calibration, robustness, fairness, and efficiency.',
    category: 'Evaluation & Benchmarking',
    tool_type: 'benchmark',
    github_url: 'https://github.com/stanford-crfm/helm',
    url: 'https://crfm.stanford.edu/helm/',
    research_areas: ['model evaluation', 'benchmarking', 'comprehensive testing'],
    use_cases: ['evaluating LLMs', 'comparing model performance', 'holistic assessment'],
    difficulty_level: 'intermediate',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Stanford CRFM',
    tags: ['evaluation', 'benchmarking', 'language-models', 'metrics']
  },
  {
    id: 'big-bench',
    name: 'BIG-bench',
    description: 'Collaborative benchmark of 200+ tasks for evaluating language model capabilities, focusing on tasks believed to be beyond current model abilities.',
    category: 'Evaluation & Benchmarking',
    tool_type: 'benchmark',
    github_url: 'https://github.com/google/BIG-bench',
    documentation_url: 'https://arxiv.org/abs/2206.04615',
    research_areas: ['capability evaluation', 'challenging tasks', 'model limitations'],
    use_cases: ['testing model capabilities', 'finding model limitations', 'research benchmarking'],
    difficulty_level: 'intermediate',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Google Research',
    key_papers: ['https://arxiv.org/abs/2206.04615'],
    tags: ['evaluation', 'benchmarking', 'capabilities', 'google']
  },
  
  // Red Teaming & Safety Testing  
  {
    id: 'garak',
    name: 'Garak',
    description: 'LLM vulnerability scanner that probes for various weaknesses including hallucination, data leakage, prompt injection, and toxic generation.',
    category: 'Robustness & Security',
    subcategory: 'Red Teaming',
    tool_type: 'evaluation',
    github_url: 'https://github.com/leondz/garak',
    research_areas: ['vulnerability scanning', 'red teaming', 'safety testing'],
    use_cases: ['finding LLM vulnerabilities', 'security testing', 'safety evaluation'],
    difficulty_level: 'intermediate',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Leon Derczynski',
    installation_guide: 'pip install garak',
    quick_start: 'garak --model openai:gpt-3.5-turbo --probes all',
    tags: ['red-teaming', 'vulnerability-scanning', 'security', 'testing']
  },
  
  // Multi-Agent Systems
  {
    id: 'autogen',
    name: 'AutoGen',
    description: 'Framework for building LLM applications using multiple agents that can converse with each other to solve tasks.',
    category: 'Multi-Agent Systems',
    tool_type: 'framework',
    github_url: 'https://github.com/microsoft/autogen',
    documentation_url: 'https://microsoft.github.io/autogen/',
    research_areas: ['multi-agent systems', 'agent collaboration', 'task automation'],
    use_cases: ['building multi-agent applications', 'agent conversations', 'complex task solving'],
    difficulty_level: 'intermediate',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Microsoft',
    installation_guide: 'pip install pyautogen',
    tags: ['multi-agent', 'microsoft', 'conversation', 'automation']
  },
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Framework for developing applications powered by language models, with tools for chaining, agents, and memory management.',
    category: 'Multi-Agent Systems',
    tool_type: 'framework',
    github_url: 'https://github.com/langchain-ai/langchain',
    documentation_url: 'https://python.langchain.com/',
    research_areas: ['agent development', 'LLM applications', 'tool chaining'],
    use_cases: ['building LLM apps', 'creating agents', 'managing conversation memory'],
    difficulty_level: 'intermediate',
    programming_languages: ['Python', 'JavaScript'],
    is_open_source: true,
    maintained: true,
    created_by: 'LangChain AI',
    installation_guide: 'pip install langchain',
    tags: ['agents', 'chains', 'memory', 'tools']
  },
  
  // Training & Fine-tuning
  {
    id: 'trl',
    name: 'TRL (Transformer Reinforcement Learning)',
    description: 'Library for training transformer language models with reinforcement learning, including RLHF and reward modeling.',
    category: 'Training & Fine-tuning',
    tool_type: 'library',
    github_url: 'https://github.com/huggingface/trl',
    documentation_url: 'https://huggingface.co/docs/trl',
    research_areas: ['RLHF', 'reward modeling', 'preference learning'],
    use_cases: ['RLHF training', 'reward model training', 'preference tuning'],
    difficulty_level: 'advanced',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Hugging Face',
    installation_guide: 'pip install trl',
    tags: ['training', 'rlhf', 'huggingface', 'fine-tuning']
  },
  
  // Monitoring & Observability
  {
    id: 'wandb',
    name: 'Weights & Biases',
    description: 'ML experiment tracking, model monitoring, and collaboration platform with specific features for LLM monitoring.',
    category: 'Monitoring & Observability',
    tool_type: 'platform',
    github_url: 'https://github.com/wandb/wandb',
    url: 'https://wandb.ai/',
    research_areas: ['experiment tracking', 'model monitoring', 'MLOps'],
    use_cases: ['tracking experiments', 'monitoring model performance', 'team collaboration'],
    difficulty_level: 'beginner',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Weights & Biases',
    installation_guide: 'pip install wandb',
    quick_start: 'import wandb\nwandb.init(project="my-project")',
    tags: ['monitoring', 'experiment-tracking', 'mlops']
  },
  
  // Governance & Policy
  {
    id: 'model-cards',
    name: 'Model Cards',
    description: 'Documentation framework for machine learning models, detailing intended use, performance metrics, and limitations.',
    category: 'Governance & Policy',
    tool_type: 'framework',
    github_url: 'https://github.com/tensorflow/model-card-toolkit',
    documentation_url: 'https://arxiv.org/abs/1810.03993',
    research_areas: ['model documentation', 'transparency', 'accountability'],
    use_cases: ['documenting models', 'ensuring transparency', 'communicating limitations'],
    difficulty_level: 'beginner',
    programming_languages: ['Python'],
    is_open_source: true,
    maintained: true,
    created_by: 'Google Research',
    key_papers: ['https://arxiv.org/abs/1810.03993'],
    installation_guide: 'pip install model-card-toolkit',
    tags: ['documentation', 'transparency', 'accountability']
  }
]

function populateTools() {
  const db = new Database(DB_PATH)
  db.pragma('foreign_keys = ON')

  try {
    db.exec('BEGIN TRANSACTION')

    // Clear existing data
    db.prepare('DELETE FROM tool_examples').run()
    db.prepare('DELETE FROM tool_tags').run()
    db.prepare('DELETE FROM tools').run()

    // Insert tools
    const insertTool = db.prepare(`
      INSERT INTO tools (
        id, name, description, category, subcategory,
        url, github_url, documentation_url,
        research_areas, use_cases, difficulty_level, tool_type,
        programming_languages, is_open_source, maintained,
        created_by, key_papers, related_tools,
        installation_guide, quick_start,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        datetime('now'), datetime('now')
      )
    `)

    const insertTag = db.prepare(`
      INSERT INTO tool_tags (tool_id, tag)
      VALUES (?, ?)
    `)

    const insertExample = db.prepare(`
      INSERT INTO tool_examples (
        tool_id, title, description, code, language, example_type, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    for (const tool of tools) {
      // Insert tool
      insertTool.run(
        tool.id,
        tool.name,
        tool.description,
        tool.category,
        tool.subcategory || null,
        tool.url || null,
        tool.github_url || null,
        tool.documentation_url || null,
        JSON.stringify(tool.research_areas),
        tool.use_cases ? JSON.stringify(tool.use_cases) : null,
        tool.difficulty_level,
        tool.tool_type,
        tool.programming_languages ? JSON.stringify(tool.programming_languages) : null,
        tool.is_open_source !== undefined ? (tool.is_open_source ? 1 : 0) : 1,
        tool.maintained !== undefined ? (tool.maintained ? 1 : 0) : 1,
        tool.created_by || null,
        tool.key_papers ? JSON.stringify(tool.key_papers) : null,
        tool.related_tools ? JSON.stringify(tool.related_tools) : null,
        tool.installation_guide || null,
        tool.quick_start || null
      )

      // Insert tags
      for (const tag of tool.tags) {
        insertTag.run(tool.id, tag)
      }

      // Insert examples
      if (tool.examples) {
        tool.examples.forEach((example, index) => {
          insertExample.run(
            tool.id,
            example.title,
            example.description || null,
            example.code,
            example.language,
            example.example_type || 'basic',
            index
          )
        })
      }
    }

    db.exec('COMMIT')
    console.log(`Successfully populated ${tools.length} tools`)
    
    // Show summary
    const countStmt = db.prepare('SELECT category, COUNT(*) as count FROM tools GROUP BY category')
    const counts = countStmt.all()
    console.log('\nTools by category:')
    counts.forEach((row: any) => {
      console.log(`  ${row.category}: ${row.count}`)
    })
    
  } catch (error) {
    db.exec('ROLLBACK')
    console.error('Error populating tools:', error)
    throw error
  } finally {
    db.close()
  }
}

// Run the population script
populateTools()