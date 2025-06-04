import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'journey.db');

async function createMentorTopicsTable() {
  const db = new Database(DB_PATH);
  
  try {
    // Drop existing table if it exists (to fix schema)
    db.exec(`DROP TABLE IF EXISTS mentor_topics;`);
    
    // Create the mentor_topics junction table
    db.exec(`
      CREATE TABLE mentor_topics (
        mentor_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        mentor_topic_description TEXT NOT NULL,
        context TEXT DEFAULT 'CBAI 2025 Fellowship',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (mentor_id, topic_id, mentor_topic_description)
      );
    `);

    console.log('✅ Created mentor_topics table');

    // Insert existing topic mappings
    const mentorTopicMappings = [
      // Adria Garriga-Alonso
      {
        mentor_id: 'adria-garriga-alonso',
        topic_id: 'deceptive-alignment',
        description: 'Measuring limitations of post-training with robust lie-detection models'
      },
      {
        mentor_id: 'adria-garriga-alonso',
        topic_id: 'mechanistic-interp',
        description: 'SAEs: fixing absorption and hedging problems, feature-splitting'
      },
      {
        mentor_id: 'adria-garriga-alonso',
        topic_id: 'llm-psychology',
        description: 'LLM psychology: measuring LLMs from talking to them'
      },

      // Mauricio Baker
      {
        mentor_id: 'mauricio-baker',
        topic_id: 'international-coordination',
        description: 'Developing methods to verify compliance with international AI agreements'
      },
      {
        mentor_id: 'mauricio-baker',
        topic_id: 'hardware-controls',
        description: 'Under-explored topics in technical AI governance'
      },

      // Steven Basart
      {
        mentor_id: 'steven-basart',
        topic_id: 'safety-benchmarks',
        description: 'Extending Honesty methods (MASK benchmark)'
      },
      {
        mentor_id: 'steven-basart',
        topic_id: 'safety-benchmarks',
        description: 'Dataset and benchmark creation'
      },

      // David Bau & Alex Loftus
      {
        mentor_id: 'david-bau-alex-loftus',
        topic_id: 'mechanistic-interp',
        description: 'Mechanistic interpretations of LLM generalization capabilities'
      },
      {
        mentor_id: 'david-bau-alex-loftus',
        topic_id: 'chain-of-thought-analysis',
        description: 'Analysis of chain of thought in reasoning models'
      },
      {
        mentor_id: 'david-bau-alex-loftus',
        topic_id: 'explainable-ai',
        description: 'Training methods for faithful explanation generation'
      },

      // Joseph Bloom
      {
        mentor_id: 'joseph-bloom',
        topic_id: 'mechanistic-interp',
        description: 'Interpretability and control intersection'
      },
      {
        mentor_id: 'joseph-bloom',
        topic_id: 'control-problem',
        description: 'Interpretability and control intersection'
      },
      {
        mentor_id: 'joseph-bloom',
        topic_id: 'safety-monitoring',
        description: 'Blue team strategies (probes, CoT monitors)'
      },
      {
        mentor_id: 'joseph-bloom',
        topic_id: 'model-organisms',
        description: 'Red team strategies for deceptive model organisms'
      },

      // Vicky Charisi
      {
        mentor_id: 'vicky-charisi',
        topic_id: 'risk-assessment-intro',
        description: 'Systematic literature review on AGI risks in decision-making systems'
      },
      {
        mentor_id: 'vicky-charisi',
        topic_id: 'multi-agent-coordination',
        description: 'Safety in multi-agentic systems and human-AI teaming'
      },
      {
        mentor_id: 'vicky-charisi',
        topic_id: 'policy-analysis',
        description: 'Comparative analysis of AI safety regulations'
      },
      {
        mentor_id: 'vicky-charisi',
        topic_id: 'institutional-design',
        description: 'Multi-stakeholder approaches for AGI governance'
      },

      // Michael Chen
      {
        mentor_id: 'michael-chen',
        topic_id: 'deployment-gates',
        description: 'Frontier AI safety policies'
      },
      {
        mentor_id: 'michael-chen',
        topic_id: 'international-coordination',
        description: 'International coordination'
      },
      {
        mentor_id: 'michael-chen',
        topic_id: 'control-problem',
        description: 'Loss of control evaluations'
      },
      {
        mentor_id: 'michael-chen',
        topic_id: 'policy-analysis',
        description: 'EU AI Act Code of Practice'
      },
      {
        mentor_id: 'michael-chen',
        topic_id: 'safety-evaluation-101',
        description: 'Extending RE-Bench for AI R&D evaluation'
      },

      // Joshua Clymer
      {
        mentor_id: 'joshua-clymer',
        topic_id: 'red-teaming-protocols',
        description: 'Red team/blue team capture the flag for alignment faking detection'
      },
      {
        mentor_id: 'joshua-clymer',
        topic_id: 'deceptive-alignment',
        description: 'Creating realistic alignment faking models'
      },
      {
        mentor_id: 'joshua-clymer',
        topic_id: 'adversarial-robustness',
        description: 'Detection evasion techniques'
      },

      // Jason Lynch
      {
        mentor_id: 'jason-lynch',
        topic_id: 'code-generation-safety',
        description: 'Mechanistic interpretability for LLM code generation'
      },

      // Samuel Marks
      {
        mentor_id: 'samuel-marks',
        topic_id: 'cognitive-oversight',
        description: 'Overseeing models without ground-truth supervision'
      },
      {
        mentor_id: 'samuel-marks',
        topic_id: 'basic-interpretability',
        description: 'Downstream applications of interpretability'
      },
      {
        mentor_id: 'samuel-marks',
        topic_id: 'cognitive-oversight',
        description: 'Cognitive process monitoring'
      },

      // Dylan Hadfield-Menell
      {
        mentor_id: 'dylan-hadfield-menell',
        topic_id: 'multi-agent-coordination',
        description: 'Research on multi-agent systems and human-AI teams'
      },
      {
        mentor_id: 'dylan-hadfield-menell',
        topic_id: 'human-agent-interaction',
        description: 'Research on multi-agent systems and human-AI teams'
      },

      // Cody Rushing
      {
        mentor_id: 'cody-rushing',
        topic_id: 'control-problem',
        description: 'AI Control projects'
      },
      {
        mentor_id: 'cody-rushing',
        topic_id: 'adversarial-robustness',
        description: 'Attack policy prediction across models'
      },

      // Aaron Scher
      {
        mentor_id: 'aaron-scher',
        topic_id: 'containerization-research',
        description: 'Hardware-dependent AI model development'
      },
      {
        mentor_id: 'aaron-scher',
        topic_id: 'safety-benchmarks',
        description: 'Alignment benchmarks leaderboard'
      },

      // Chandan Singh
      {
        mentor_id: 'chandan-singh',
        topic_id: 'mechanistic-interp',
        description: 'Making reasoning models more interpretable'
      },
      {
        mentor_id: 'chandan-singh',
        topic_id: 'explainable-ai',
        description: 'Natural-language explanations from LLMs'
      },
      {
        mentor_id: 'chandan-singh',
        topic_id: 'mechanistic-interp',
        description: 'Mechanistic interpretability'
      },

      // Peter Slattery
      {
        mentor_id: 'peter-slattery',
        topic_id: 'risk-assessment-intro',
        description: 'Developing control taxonomy for AI risk mitigations'
      },
      {
        mentor_id: 'peter-slattery',
        topic_id: 'risk-landscape',
        description: 'Literature synthesis on mitigation strategies'
      },

      // Asa Cooper Stickland
      {
        mentor_id: 'asa-cooper-stickland',
        topic_id: 'model-organisms',
        description: 'AI control and model organisms'
      },
      {
        mentor_id: 'asa-cooper-stickland',
        topic_id: 'training-failure-modes',
        description: 'Training models to evade monitors'
      },

      // Max Tegmark
      {
        mentor_id: 'max-tegmark',
        topic_id: 'formal-verification',
        description: 'Formal verification research'
      },

      // Tyler Tracy
      {
        mentor_id: 'tyler-tracy',
        topic_id: 'control-problem',
        description: 'Build new control settings'
      },
      {
        mentor_id: 'tyler-tracy',
        topic_id: 'red-teaming-protocols',
        description: 'Design control protocols and red/blue team games'
      },
      {
        mentor_id: 'tyler-tracy',
        topic_id: 'automated-red-teaming',
        description: 'Training attack policies or monitors'
      },

      // Jonathan Zittrain
      {
        mentor_id: 'jonathan-zittrain',
        topic_id: 'ethics-fundamentals',
        description: 'Ethics and governance of AI'
      },
      {
        mentor_id: 'jonathan-zittrain',
        topic_id: 'agent-safety-fundamentals',
        description: 'Agentic AI protocols and risk mitigations'
      }
    ];

    // Insert all mappings
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO mentor_topics (mentor_id, topic_id, mentor_topic_description, context)
      VALUES (?, ?, ?, 'CBAI 2025 Fellowship')
    `);

    for (const mapping of mentorTopicMappings) {
      stmt.run(mapping.mentor_id, mapping.topic_id, mapping.description);
    }

    console.log(`✅ Inserted ${mentorTopicMappings.length} mentor-topic mappings`);

    // Create index for efficient queries
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_mentor_topics_topic_id ON mentor_topics(topic_id);
      CREATE INDEX IF NOT EXISTS idx_mentor_topics_mentor_id ON mentor_topics(mentor_id);
    `);

    console.log('✅ Created indexes for mentor_topics table');

  } catch (error) {
    console.error('Error creating mentor_topics table:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Run the migration
createMentorTopicsTable()
  .then(() => {
    console.log('✅ Mentor topics table created successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to create mentor topics table:', error);
    process.exit(1);
  });