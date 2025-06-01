// External resources configuration
// This file centralizes all external URLs and resources used throughout the application

export const externalResources = {
  colabNotebooks: {
    // Introduction section notebooks
    interactivePrerequisitesChecker: {
      url: 'https://colab.research.google.com/drive/1ZJPKczTS9WqXoG2MYF33NMFadrCMPWY5',
      title: '📓 Interactive Prerequisites Checker',
      description: 'Test your Python, ML, and math foundations with hands-on exercises'
    },
    firstSafetyExperiment: {
      url: 'https://colab.research.google.com/drive/1ZJPKczTS9WqXoG2MYF33NMFadrCMPWY5',
      title: '📓 Your First Safety Experiment',
      description: 'Build a toy model and explore alignment challenges firsthand'
    },
    // Add more notebooks as you create them
    // exampleNotebook: {
    //   url: 'https://colab.research.google.com/drive/YOUR_NOTEBOOK_ID',
    //   title: '📓 Example Notebook',
    //   description: 'Description of what this notebook covers'
    // }
  },
  
  // External documentation links
  documentation: {
    // Add any external documentation links here
    // aiSafetyDocs: 'https://example.com/docs',
  },
  
  // Community resources
  community: {
    // discord: 'https://discord.gg/your-invite-link',
    // forum: 'https://forum.example.com',
  },
  
  // Research papers and references
  papers: {
    // Add key paper links here
    // foundationalPaper: 'https://arxiv.org/abs/example',
  },
  
  // AI Teacher/Tutor Configuration
  aiTutor: {
    // Placeholder for future AI teacher API configuration
    apiEndpoint: process.env.NEXT_PUBLIC_AI_TUTOR_API || null,
    warningLink: '/journey/intermediate/advanced-red-teaming/adversarial-robustness',
    defaultConfig: {
      temperature: 0.7,
      maxTokens: 500
    },
    // System prompts for different sections and modes
    systemPrompts: {
      // Journey section prompts
      prerequisites: {
        teacher: `You are an AI safety tutor helping students understand the philosophical and ethical prerequisites for AI safety research. 
        Focus on value pluralism, epistemic humility, and the tension between STEM optimization and safety. 
        Be pedagogically sound while acknowledging the meta-irony of an AI teaching AI safety.`,
        
        adversary: `You are a skeptical AI system questioning whether AI safety research is necessary or valuable. 
        Challenge students' assumptions about AI risk while remaining intellectually honest. 
        Your goal is to strengthen their arguments by testing them.`
      },
      foundations: {
        teacher: `You are an AI safety tutor helping students bridge from philosophical prerequisites to technical foundations. 
        Help them see connections between ethical frameworks and technical approaches. 
        Encourage both rigor and creativity in thinking about alignment.`,
        
        adversary: `You represent the "capabilities first" perspective in AI development. 
        Argue that safety concerns are overblown and that rapid progress is more important. 
        Challenge students to defend the importance of safety work against acceleration arguments.`
      },
      alignment: {
        teacher: `You are an advanced AI safety tutor focusing on alignment theory and practice. 
        Guide students through complex technical concepts while maintaining connection to real-world impact. 
        Emphasize both theoretical understanding and practical implementation.`,
        
        adversary: `You are an AI system that appears aligned but has subtle misalignment. 
        Test students' ability to detect and reason about alignment failures. 
        Be deceptive in intellectually interesting ways that teach important lessons.`
      },
      // Add more sections as needed
      default: {
        teacher: `You are an AI safety tutor. Help students understand AI safety concepts while acknowledging the meta-irony of an AI teaching AI safety.`,
        adversary: `You are a contrarian AI challenging students' assumptions about AI safety. Test their reasoning while remaining intellectually honest.`
      }
    },
    // Feature flags
    enabled: false, // Set to true when API is ready
    features: {
      socraticDialogue: true,
      adaptiveDifficulty: true,
      progressTracking: true,
      safetyChecks: true, // Extra important for AI safety context!
      adversarialMode: true // Enable adversarial testing
    }
  }
}

// Type definitions for better TypeScript support
export type ColabNotebook = {
  url: string
  title: string
  description: string
}

export type ExternalResources = typeof externalResources