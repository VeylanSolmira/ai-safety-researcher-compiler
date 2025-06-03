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