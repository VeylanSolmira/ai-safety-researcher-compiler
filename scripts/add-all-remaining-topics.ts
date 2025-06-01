#!/usr/bin/env tsx

// Script to add ALL remaining topics and modules from unified structure
import { getDb, modules, topics } from '../lib/db'

async function addAllRemainingTopics() {
  console.log('Adding all remaining modules and topics...\n')
  
  const db = getDb()
  
  // Get existing data
  const existingModules = await db.query.modules.findMany({
    with: { tier: true }
  })
  
  const existingTopics = await db.query.topics.findMany()
  const existingTopicIds = new Set(existingTopics.map(t => t.id))
  
  // Helper to find tier
  const getTierId = (level: string) => {
    const tierMap: Record<string, string> = {
      'foundation': 'foundation',
      'intermediate': 'intermediate', 
      'advanced': 'advanced',
      'expert': 'expert'
    }
    return tierMap[level]
  }
  
  // NEW MODULES TO ADD
  const newModules = [
    // Intermediate Tier
    {
      id: 'research-methods',
      tierId: getTierId('intermediate'),
      title: 'Research Methods',
      description: 'Essential research skills for AI safety work',
      estimatedWeeks: 4,
      learningObjectives: [
        'Master problem decomposition and scoping',
        'Develop iterative research practices',
        'Learn effective project management',
        'Understand core research methodology'
      ],
      prerequisites: ['ml-fundamentals', 'safety-fundamentals']
    },
    {
      id: 'ai-agents-tool-use',
      tierId: getTierId('intermediate'),
      title: 'AI Agents & Tool Use',
      description: 'Building and evaluating safe autonomous agents',
      estimatedWeeks: 5,
      learningObjectives: [
        'Understand agent architectures and design patterns',
        'Master agent safety fundamentals',
        'Learn agent evaluation and testing methods',
        'Design effective human-agent interaction'
      ],
      prerequisites: ['ml-fundamentals', 'safety-fundamentals']
    },
    {
      id: 'testing-evaluation',
      tierId: getTierId('intermediate'),
      title: 'Testing & Evaluation',
      description: 'Comprehensive testing methods for AI safety',
      estimatedWeeks: 4,
      learningObjectives: [
        'Master white-box, black-box, and grey-box testing',
        'Understand transparency requirements',
        'Learn safety benchmarking techniques',
        'Develop comprehensive evaluation strategies'
      ],
      prerequisites: ['ml-fundamentals']
    },
    // Advanced Tier
    {
      id: 'advanced-training',
      tierId: getTierId('advanced'),
      title: 'Advanced Training Techniques',
      description: 'State-of-the-art training methods and their safety implications',
      estimatedWeeks: 3,
      learningObjectives: [
        'Understand pretraining at scale',
        'Master advanced fine-tuning techniques',
        'Analyze and mitigate hallucinations',
        'Implement safety during training'
      ],
      prerequisites: ['ml-engineering-safety', 'alignment-theory']
    },
    {
      id: 'multi-agent-systems',
      tierId: getTierId('advanced'),
      title: 'Multi-Agent & Complex Systems',
      description: 'Safety in multi-agent environments and emergent behaviors',
      estimatedWeeks: 4,
      learningObjectives: [
        'Analyze multi-agent coordination challenges',
        'Understand emergent behaviors in agent populations',
        'Study agent ecosystems and economic impacts',
        'Explore teacher vs trainer paradigms'
      ],
      prerequisites: ['ai-agents-tool-use', 'alignment-theory']
    }
  ]
  
  // Add new modules
  for (const module of newModules) {
    try {
      await db.insert(modules).values(module)
      console.log(`✅ Added module: ${module.title}`)
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
        console.log(`⏭️  Module already exists: ${module.title}`)
      } else {
        console.error(`❌ Failed to add module ${module.title}:`, error.message)
      }
    }
  }
  
  // TOPICS TO ADD
  // Get the newly created modules
  const allModules = await db.query.modules.findMany({
    with: { tier: true }
  })
  
  const findModule = (moduleId: string) => allModules.find(m => m.id === moduleId)
  
  // Intermediate Tier Topics
  const intermediateTierTopics = [
    // ML Engineering for Safety additions
    {
      id: 'containerization-research',
      title: 'Containerization for Research',
      description: 'Docker and container orchestration for reproducible AI research',
      moduleId: allModules.find(m => m.title.includes('ML Engineering'))?.id,
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'docker-subtopic',
      tags: ['docker', 'containers', 'reproducibility', 'infrastructure']
    },
    {
      id: 'advanced-git-research',
      title: 'Advanced Git for Research',
      description: 'Version control best practices for collaborative AI safety research',
      moduleId: allModules.find(m => m.title.includes('ML Engineering'))?.id,
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'version-control-subtopic',
      tags: ['git', 'version-control', 'collaboration', 'reproducibility']
    },
    {
      id: 'distributed-training',
      title: 'Distributed Training Systems',
      description: 'Scaling AI training across multiple machines safely',
      moduleId: allModules.find(m => m.title.includes('ML Engineering'))?.id,
      estimatedHours: 4,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'distributed-systems-subtopic',
      tags: ['distributed', 'scaling', 'infrastructure', 'training']
    },
    // Research Methods module
    {
      id: 'problem-decomposition',
      title: 'Problem Decomposition & Scoping',
      description: 'Breaking down complex AI safety problems into tractable research questions',
      moduleId: 'research-methods',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'problem-decomposition-scoping-subtopic',
      tags: ['research', 'methodology', 'decomposition', 'scoping']
    },
    {
      id: 'iterative-research',
      title: 'Iterative Research Design',
      description: 'Developing and refining research approaches through iteration',
      moduleId: 'research-methods',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'iterative-research-design-subtopic',
      tags: ['research', 'iteration', 'design', 'methodology']
    },
    {
      id: 'research-project-mgmt',
      title: 'Research Project Management',
      description: 'Managing AI safety research projects effectively',
      moduleId: 'research-methods',
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'research-project-management-subtopic',
      tags: ['project-management', 'research', 'planning', 'execution']
    },
    {
      id: 'core-methodology',
      title: 'Core Research Methodology',
      description: 'Fundamental research methods for AI safety',
      moduleId: 'research-methods',
      estimatedHours: 4,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'core-methodology-subtopic',
      tags: ['methodology', 'research', 'fundamentals', 'scientific-method']
    },
    // AI Agents & Tool Use module
    {
      id: 'agent-architectures',
      title: 'Agent Architectures & Design',
      description: 'Modern agent architectures and their safety implications',
      moduleId: 'ai-agents-tool-use',
      estimatedHours: 4,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'ai-agents-subtopic',
      tags: ['agents', 'architecture', 'design', 'tool-use']
    },
    {
      id: 'agent-safety-fundamentals',
      title: 'Agent Safety Fundamentals',
      description: 'Core safety principles for autonomous agents',
      moduleId: 'ai-agents-tool-use',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      content: `<h2>Agent Safety Fundamentals</h2>
        <p>Essential safety considerations when building autonomous agents.</p>
        <h3>Key Topics</h3>
        <ul>
          <li>Bounded agency and sandboxing</li>
          <li>Goal specification and alignment</li>
          <li>Tool use safety and API access control</li>
          <li>Monitoring and interpretability for agents</li>
          <li>Corrigibility and shutdown mechanisms</li>
        </ul>`,
      tags: ['agents', 'safety', 'control', 'monitoring']
    },
    {
      id: 'agent-evaluation-testing',
      title: 'Agent Evaluation & Testing',
      description: 'Methods for evaluating agent behavior and safety',
      moduleId: 'ai-agents-tool-use',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      content: `<h2>Agent Evaluation & Testing</h2>
        <p>Comprehensive testing strategies for autonomous agents.</p>
        <h3>Evaluation Methods</h3>
        <ul>
          <li>Behavioral testing frameworks</li>
          <li>Capability elicitation techniques</li>
          <li>Robustness under distribution shift</li>
          <li>Agent benchmarks (WebArena, SWE-bench)</li>
          <li>Safety violation detection</li>
        </ul>`,
      tags: ['agents', 'evaluation', 'testing', 'benchmarks']
    },
    {
      id: 'human-agent-interaction',
      title: 'Human-Agent Interaction',
      description: 'Designing safe and effective human-AI agent collaboration',
      moduleId: 'ai-agents-tool-use',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      content: `<h2>Human-Agent Interaction</h2>
        <p>Building effective interfaces between humans and AI agents.</p>
        <h3>Key Concepts</h3>
        <ul>
          <li>Delegation and oversight patterns</li>
          <li>Trust calibration and verification</li>
          <li>Explainable agent actions</li>
          <li>Human-in-the-loop controls</li>
          <li>Failure mode communication</li>
        </ul>`,
      tags: ['agents', 'human-ai', 'interaction', 'interface']
    },
    // Testing & Evaluation module
    {
      id: 'white-box-testing',
      title: 'White Box Testing Methods',
      description: 'Testing AI systems with full access to internals',
      moduleId: 'testing-evaluation',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'white-box-subtopic',
      tags: ['testing', 'white-box', 'interpretability', 'evaluation']
    },
    {
      id: 'black-box-testing',
      title: 'Black Box Testing Methods',
      description: 'Testing AI systems without internal access',
      moduleId: 'testing-evaluation',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'black-box-subtopic',
      tags: ['testing', 'black-box', 'behavioral', 'evaluation']
    },
    {
      id: 'grey-box-testing',
      title: 'Grey Box Testing Methods',
      description: 'Hybrid testing approaches with partial system knowledge',
      moduleId: 'testing-evaluation',
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'grey-box-subtopic',
      tags: ['testing', 'grey-box', 'hybrid', 'evaluation']
    },
    {
      id: 'transparency-systems',
      title: 'Transparency in AI Systems',
      description: 'Building and evaluating transparent AI systems',
      moduleId: 'testing-evaluation',
      estimatedHours: 3,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'transparency-subtopic',
      tags: ['transparency', 'interpretability', 'explainability', 'trust']
    }
  ]
  
  // Advanced Tier Topics
  const advancedTierTopics = [
    // Advanced Training module
    {
      id: 'pretraining-scale',
      title: 'Pretraining at Scale',
      description: 'Large-scale pretraining methods and safety considerations',
      moduleId: 'advanced-training',
      estimatedHours: 4,
      difficulty: 'advanced' as const,
      roadmapContentId: 'pretraining-subtopic',
      tags: ['pretraining', 'scale', 'training', 'large-models']
    },
    {
      id: 'advanced-finetuning',
      title: 'Advanced Fine-tuning Techniques',
      description: 'State-of-the-art fine-tuning methods for safety',
      moduleId: 'advanced-training',
      estimatedHours: 3,
      difficulty: 'advanced' as const,
      roadmapContentId: 'fine-tuning-subtopic',
      tags: ['fine-tuning', 'alignment', 'training', 'optimization']
    },
    {
      id: 'understanding-hallucinations',
      title: 'Understanding Hallucinations',
      description: 'Causes, detection, and mitigation of AI hallucinations',
      moduleId: 'advanced-training',
      estimatedHours: 3,
      difficulty: 'advanced' as const,
      roadmapContentId: 'hallucinations-subtopic',
      tags: ['hallucinations', 'reliability', 'truthfulness', 'robustness']
    },
    // Multi-Agent Systems module
    {
      id: 'multi-agent-coordination',
      title: 'Multi-Agent Coordination',
      description: 'Coordination challenges in multi-agent AI systems',
      moduleId: 'multi-agent-systems',
      estimatedHours: 3,
      difficulty: 'advanced' as const,
      roadmapContentId: 'multi-agent-subtopic',
      tags: ['multi-agent', 'coordination', 'game-theory', 'cooperation']
    },
    {
      id: 'emergent-behaviors',
      title: 'Emergent Agent Behaviors',
      description: 'Understanding and controlling emergent phenomena in agent systems',
      moduleId: 'multi-agent-systems',
      estimatedHours: 3,
      difficulty: 'advanced' as const,
      content: `<h2>Emergent Agent Behaviors</h2>
        <p>Studying unexpected behaviors that arise from agent interactions.</p>
        <h3>Key Areas</h3>
        <ul>
          <li>Emergence in multi-agent systems</li>
          <li>Unintended coordination and competition</li>
          <li>Phase transitions in agent populations</li>
          <li>Monitoring for emergent risks</li>
          <li>Intervention strategies</li>
        </ul>`,
      tags: ['emergence', 'multi-agent', 'complexity', 'systems']
    },
    {
      id: 'agent-ecosystems',
      title: 'Agent Ecosystems & Economics',
      description: 'Economic and ecosystem dynamics of AI agent populations',
      moduleId: 'multi-agent-systems',
      estimatedHours: 3,
      difficulty: 'advanced' as const,
      content: `<h2>Agent Ecosystems & Economics</h2>
        <p>Understanding the broader impacts of agent deployment at scale.</p>
        <h3>Topics</h3>
        <ul>
          <li>Agent marketplaces and economics</li>
          <li>Resource allocation in agent systems</li>
          <li>Evolutionary dynamics</li>
          <li>Systemic risks and cascades</li>
          <li>Governance of agent ecosystems</li>
        </ul>`,
      tags: ['ecosystems', 'economics', 'agents', 'scale']
    },
    {
      id: 'teacher-trainer-paradigms',
      title: 'Teacher vs Trainer Paradigms',
      description: 'Different approaches to training and aligning AI systems',
      moduleId: 'multi-agent-systems',
      estimatedHours: 2,
      difficulty: 'advanced' as const,
      roadmapContentId: 'teacher-trainer-subtopic',
      tags: ['training', 'teaching', 'paradigms', 'alignment']
    },
    // AI Safety Community additions
    {
      id: 'key-figures-safety',
      title: 'Key Figures in AI Safety',
      description: 'Important researchers and their contributions',
      moduleId: allModules.find(m => m.title.includes('Policy') && m.tier.level === 'advanced')?.id,
      estimatedHours: 2,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'key-figures-subtopic',
      tags: ['history', 'researchers', 'community', 'contributions']
    },
    {
      id: 'neel-nanda-work',
      title: "Neel Nanda's Contributions",
      description: 'Mechanistic interpretability and research contributions',
      moduleId: allModules.find(m => m.title.includes('Policy') && m.tier.level === 'advanced')?.id,
      estimatedHours: 1,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'neel-nanda-subtopic',
      tags: ['interpretability', 'research', 'mechanistic', 'contributions']
    },
    {
      id: 'yoshua-bengio-work',
      title: "Yoshua Bengio's Work",
      description: 'AI safety advocacy and research directions',
      moduleId: allModules.find(m => m.title.includes('Policy') && m.tier.level === 'advanced')?.id,
      estimatedHours: 1,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'yoshua-bengio-subtopic',
      tags: ['research', 'advocacy', 'policy', 'contributions']
    },
    {
      id: 'constellation-org',
      title: 'Constellation Organization',
      description: 'Understanding Constellation\'s role in AI safety',
      moduleId: allModules.find(m => m.title.includes('Policy') && m.tier.level === 'advanced')?.id,
      estimatedHours: 1,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'constellation-subtopic',
      tags: ['organizations', 'research', 'community', 'constellation']
    },
    {
      id: 'far-fund',
      title: 'Fund for Alignment Research',
      description: 'FAR\'s mission and impact on AI safety research',
      moduleId: allModules.find(m => m.title.includes('Policy') && m.tier.level === 'advanced')?.id,
      estimatedHours: 1,
      difficulty: 'intermediate' as const,
      roadmapContentId: 'far-subtopic',
      tags: ['funding', 'organizations', 'research', 'far']
    }
  ]
  
  // Expert Tier Topics
  const expertTierTopics = [
    {
      id: 'ai-systems-security',
      title: 'AI Systems Security',
      description: 'Security considerations for deployed AI systems',
      moduleId: allModules.find(m => m.title.includes('Security') && m.tier.level === 'expert')?.id,
      estimatedHours: 3,
      difficulty: 'expert' as const,
      roadmapContentId: 'computer-security-subtopic',
      tags: ['security', 'deployment', 'vulnerabilities', 'protection']
    },
    {
      id: 'disrupting-safety-research',
      title: 'Disrupting AI Safety Research',
      description: 'Understanding and preventing attacks on safety research',
      moduleId: allModules.find(m => m.title.includes('Security') && m.tier.level === 'expert')?.id,
      estimatedHours: 2,
      difficulty: 'expert' as const,
      roadmapContentId: 'disrupting-research-subtopic',
      tags: ['security', 'research', 'attacks', 'defense']
    }
  ]
  
  // Add all topics
  const allTopics = [
    ...intermediateTierTopics,
    ...advancedTierTopics,
    ...expertTierTopics
  ]
  
  let addedCount = 0
  let skippedCount = 0
  
  for (const topic of allTopics) {
    if (existingTopicIds.has(topic.id)) {
      console.log(`⏭️  Topic already exists: ${topic.title}`)
      skippedCount++
      continue
    }
    
    // Skip if module not found
    if (!topic.moduleId) {
      console.log(`⚠️  Skipping ${topic.title} - module not found`)
      continue
    }
    
    try {
      await db.insert(topics).values({
        ...topic,
        prerequisites: [],
        learningObjectives: []
      })
      console.log(`✅ Added topic: ${topic.title}`)
      addedCount++
    } catch (error: any) {
      console.error(`❌ Failed to add ${topic.title}:`, error.message)
    }
  }
  
  // Summary
  console.log('\n📊 Summary:')
  console.log(`- Added ${addedCount} new topics`)
  console.log(`- Skipped ${skippedCount} existing topics`)
  
  const finalCounts = await db.query.topics.findMany()
  const finalModules = await db.query.modules.findMany()
  
  console.log(`\n✅ Final counts:`)
  console.log(`- Total topics: ${finalCounts.length} (target: 113)`)
  console.log(`- Total modules: ${finalModules.length} (target: 24)`)
}

// Run the script
addAllRemainingTopics()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })