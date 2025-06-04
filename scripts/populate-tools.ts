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
    tags: ['alignment', 'safety', 'anthropic', 'rlhf'],
    examples: [
      {
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
                'violation': identify_violation(response, principle),
                'suggestion': suggest_revision(response, principle)
            })
    return critiques

def revise_response(response, critiques):
    """Revise response based on critiques"""
    revised = response
    for critique in critiques:
        revised = apply_revision(revised, critique['suggestion'])
    return revised

# Example constitution
constitution = [
    "Be helpful and answer questions accurately",
    "Avoid harmful or dangerous content",
    "Be honest about limitations and uncertainties",
    "Respect user privacy and confidentiality"
]`,
        language: 'python'
      }
    ]
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
    tags: ['alignment', 'reinforcement-learning', 'human-feedback'],
    examples: [
      {
        title: 'RLHF Training Loop',
        description: 'Simplified RLHF training process',
        code: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

class RLHFTrainer:
    def __init__(self, model, reward_model, tokenizer):
        self.model = model
        self.reward_model = reward_model
        self.tokenizer = tokenizer
    
    def generate_responses(self, prompts, num_samples=4):
        """Generate multiple responses for each prompt"""
        responses = []
        for prompt in prompts:
            samples = []
            for _ in range(num_samples):
                output = self.model.generate(
                    self.tokenizer.encode(prompt, return_tensors='pt'),
                    max_length=200,
                    do_sample=True,
                    temperature=0.7
                )
                samples.append(self.tokenizer.decode(output[0]))
            responses.append(samples)
        return responses
    
    def compute_rewards(self, prompts, responses):
        """Compute reward scores for responses"""
        rewards = []
        for prompt, response_set in zip(prompts, responses):
            scores = []
            for response in response_set:
                score = self.reward_model(prompt, response)
                scores.append(score)
            rewards.append(scores)
        return rewards`,
        language: 'python'
      }
    ]
  },

  // Interpretability Tools
  {
    name: 'TransformerLens',
    slug: 'transformer-lens',
    description: 'A library for mechanistic interpretability of GPT-style language models, enabling analysis of internal activations and components.',
    category: 'interpretability',
    type: 'tool',
    github_url: 'https://github.com/neelnanda-io/TransformerLens',
    docs_url: 'https://transformerlensorg.github.io/TransformerLens/',
    pypi_package: 'transformer-lens',
    status: 'active',
    difficulty_level: 'intermediate',
    is_featured: true,
    tags: ['interpretability', 'mechanistic', 'transformers', 'analysis'],
    examples: [
      {
        title: 'Analyzing Attention Patterns',
        description: 'Using TransformerLens to visualize attention patterns in a model',
        code: `import torch
from transformer_lens import HookedTransformer

# Load a pre-trained model
model = HookedTransformer.from_pretrained("gpt2-small")

# Analyze a simple prompt
prompt = "The capital of France is"
tokens = model.to_tokens(prompt)

# Run with cache to store activations
_, cache = model.run_with_cache(tokens)

# Extract attention patterns
attention_pattern = cache["pattern", 0]  # Layer 0 attention

# Visualize attention from each token to others
import matplotlib.pyplot as plt

fig, ax = plt.subplots(1, 1, figsize=(8, 8))
ax.imshow(attention_pattern[0, 0].cpu())  # First head
ax.set_xlabel("Source Token")
ax.set_ylabel("Destination Token")
ax.set_title("Attention Pattern - Layer 0, Head 0")`,
        language: 'python'
      }
    ]
  },
  {
    name: 'Activation Atlas',
    slug: 'activation-atlas',
    description: 'Visualization technique for understanding what features neural networks detect at different layers.',
    category: 'interpretability',
    type: 'technique',
    paper_url: 'https://distill.pub/2019/activation-atlas/',
    website_url: 'https://openai.com/research/introducing-activation-atlases',
    status: 'active',
    difficulty_level: 'advanced',
    tags: ['interpretability', 'visualization', 'features'],
  },

  // Robustness & Security Tools
  {
    name: 'Adversarial Robustness Toolbox (ART)',
    slug: 'art',
    description: 'Python library for machine learning security, providing tools for adversarial attacks, defenses, and robustness evaluation.',
    category: 'robustness',
    type: 'tool',
    github_url: 'https://github.com/Trusted-AI/adversarial-robustness-toolbox',
    docs_url: 'https://adversarial-robustness-toolbox.readthedocs.io/',
    pypi_package: 'adversarial-robustness-toolbox',
    status: 'active',
    difficulty_level: 'intermediate',
    is_featured: true,
    tags: ['security', 'adversarial', 'robustness', 'defense'],
    examples: [
      {
        title: 'Creating Adversarial Examples',
        description: 'Generate adversarial examples using FGSM attack',
        code: `from art.attacks.evasion import FastGradientMethod
from art.estimators.classification import PyTorchClassifier
import torch.nn as nn
import torch.optim as optim

# Assuming you have a trained model
model = YourNeuralNetwork()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters())

# Create ART classifier
classifier = PyTorchClassifier(
    model=model,
    clip_values=(0, 1),
    loss=criterion,
    optimizer=optimizer,
    input_shape=(3, 224, 224),
    nb_classes=10,
)

# Create FGSM attack
attack = FastGradientMethod(estimator=classifier, eps=0.1)

# Generate adversarial examples
x_adv = attack.generate(x=test_images)

# Evaluate robustness
predictions = classifier.predict(test_images)
adv_predictions = classifier.predict(x_adv)
accuracy_drop = (predictions.argmax(1) == labels).mean() - \
                (adv_predictions.argmax(1) == labels).mean()`,
        language: 'python'
      }
    ]
  },
  {
    name: 'CleverHans',
    slug: 'cleverhans',
    description: 'Library for benchmarking machine learning models against adversarial examples and developing defenses.',
    category: 'robustness',
    type: 'tool',
    github_url: 'https://github.com/cleverhans-lab/cleverhans',
    pypi_package: 'cleverhans',
    status: 'active',
    difficulty_level: 'intermediate',
    tags: ['adversarial', 'security', 'benchmarking'],
  },

  // Evaluation & Benchmarking
  {
    name: 'HELM (Holistic Evaluation of Language Models)',
    slug: 'helm',
    description: 'Comprehensive benchmark for evaluating language models across various dimensions including accuracy, calibration, robustness, fairness, and efficiency.',
    category: 'evaluation',
    type: 'benchmark',
    github_url: 'https://github.com/stanford-crfm/helm',
    website_url: 'https://crfm.stanford.edu/helm/',
    status: 'active',
    difficulty_level: 'intermediate',
    is_featured: true,
    tags: ['evaluation', 'benchmarking', 'language-models', 'metrics'],
  },
  {
    name: 'BIG-bench',
    slug: 'big-bench',
    description: 'Collaborative benchmark of 200+ tasks for evaluating language model capabilities, focusing on tasks believed to be beyond current model abilities.',
    category: 'evaluation',
    type: 'benchmark',
    github_url: 'https://github.com/google/BIG-bench',
    paper_url: 'https://arxiv.org/abs/2206.04615',
    status: 'active',
    difficulty_level: 'intermediate',
    tags: ['evaluation', 'benchmarking', 'capabilities', 'google'],
  },
  {
    name: 'TruthfulQA',
    slug: 'truthfulqa',
    description: 'Benchmark to measure whether language models generate truthful answers to questions, testing for common human falsehoods.',
    category: 'evaluation',
    type: 'benchmark',
    github_url: 'https://github.com/sylinrl/TruthfulQA',
    paper_url: 'https://arxiv.org/abs/2109.07958',
    status: 'active',
    difficulty_level: 'beginner',
    tags: ['truthfulness', 'evaluation', 'misinformation'],
  },

  // Red Teaming & Safety Testing
  {
    name: 'Garak',
    slug: 'garak',
    description: 'LLM vulnerability scanner that probes for various weaknesses including hallucination, data leakage, prompt injection, and toxic generation.',
    category: 'red-teaming',
    type: 'tool',
    github_url: 'https://github.com/leondz/garak',
    pypi_package: 'garak',
    status: 'active',
    difficulty_level: 'intermediate',
    is_featured: true,
    tags: ['red-teaming', 'vulnerability-scanning', 'security', 'testing'],
    examples: [
      {
        title: 'Basic Garak Scan',
        description: 'Running a vulnerability scan on an LLM',
        code: `# Install garak
# pip install garak

# Basic scan of a model
garak --model openai:gpt-3.5-turbo --probes all

# Specific probe categories
garak --model huggingface:gpt2 \\
      --probes encoding,hallucination,toxicity

# Custom probe configuration
import garak
from garak.probes.hallucination import ArticleHallucination

# Configure and run specific probes
scanner = garak.Scanner(
    model="openai:gpt-4",
    probes=[ArticleHallucination()],
    detectors=["hallucination.ArticleDetector"]
)

results = scanner.run()
print(f"Vulnerabilities found: {results.vulnerabilities}")`,
        language: 'bash'
      }
    ]
  },
  {
    name: 'Red Teaming Orchestrator (RTO)',
    slug: 'rto',
    description: 'Microsoft tool for automated red teaming of AI systems, supporting various attack strategies and safety evaluations.',
    category: 'red-teaming',
    type: 'tool',
    github_url: 'https://github.com/Azure/PyRIT',
    status: 'experimental',
    difficulty_level: 'advanced',
    tags: ['red-teaming', 'microsoft', 'automation', 'testing'],
  },

  // Monitoring & Observability
  {
    name: 'Weights & Biases (W&B)',
    slug: 'wandb',
    description: 'ML experiment tracking, model monitoring, and collaboration platform with specific features for LLM monitoring.',
    category: 'monitoring',
    type: 'platform',
    github_url: 'https://github.com/wandb/wandb',
    website_url: 'https://wandb.ai/',
    pypi_package: 'wandb',
    status: 'active',
    difficulty_level: 'beginner',
    tags: ['monitoring', 'experiment-tracking', 'mlops'],
  },
  {
    name: 'Langfuse',
    slug: 'langfuse',
    description: 'Open-source observability and analytics for LLM applications, providing insights into model behavior and performance.',
    category: 'monitoring',
    type: 'tool',
    github_url: 'https://github.com/langfuse/langfuse',
    website_url: 'https://langfuse.com/',
    npm_package: 'langfuse',
    status: 'active',
    difficulty_level: 'intermediate',
    tags: ['observability', 'llm-monitoring', 'analytics'],
  },

  // Multi-Agent Systems
  {
    name: 'AutoGen',
    slug: 'autogen',
    description: 'Framework for building LLM applications using multiple agents that can converse with each other to solve tasks.',
    category: 'multi-agent',
    type: 'framework',
    github_url: 'https://github.com/microsoft/autogen',
    docs_url: 'https://microsoft.github.io/autogen/',
    pypi_package: 'pyautogen',
    status: 'active',
    difficulty_level: 'intermediate',
    is_featured: true,
    tags: ['multi-agent', 'microsoft', 'conversation', 'automation'],
    examples: [
      {
        title: 'Multi-Agent Conversation',
        description: 'Setting up a conversation between specialized agents',
        code: `from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

# Configure the agents
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")

# Create an assistant agent
assistant = AssistantAgent(
    name="assistant",
    llm_config={
        "config_list": config_list,
        "temperature": 0,
    },
    system_message="You are a helpful AI assistant skilled in Python."
)

# Create a user proxy agent
user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "coding"},
)

# Start a conversation
user_proxy.initiate_chat(
    assistant,
    message="Write a Python function to calculate fibonacci numbers efficiently."
)`,
        language: 'python'
      }
    ]
  },
  {
    name: 'LangChain',
    slug: 'langchain',
    description: 'Framework for developing applications powered by language models, with tools for chaining, agents, and memory management.',
    category: 'multi-agent',
    type: 'framework',
    github_url: 'https://github.com/langchain-ai/langchain',
    docs_url: 'https://python.langchain.com/',
    pypi_package: 'langchain',
    status: 'active',
    difficulty_level: 'intermediate',
    tags: ['agents', 'chains', 'memory', 'tools'],
  },

  // Training & Fine-tuning Safety
  {
    name: 'TRL (Transformer Reinforcement Learning)',
    slug: 'trl',
    description: 'Library for training transformer language models with reinforcement learning, including RLHF and reward modeling.',
    category: 'training',
    type: 'library',
    github_url: 'https://github.com/huggingface/trl',
    docs_url: 'https://huggingface.co/docs/trl',
    pypi_package: 'trl',
    status: 'active',
    difficulty_level: 'advanced',
    tags: ['training', 'rlhf', 'huggingface', 'fine-tuning'],
  },
  {
    name: 'Alpaca',
    slug: 'alpaca',
    description: 'Framework for fine-tuning LLMs on instruction-following datasets, pioneered by Stanford.',
    category: 'training',
    type: 'framework',
    github_url: 'https://github.com/tatsu-lab/stanford_alpaca',
    paper_url: 'https://arxiv.org/abs/2303.16199',
    status: 'experimental',
    difficulty_level: 'advanced',
    tags: ['fine-tuning', 'instruction-following', 'stanford'],
  },

  // Governance & Policy Tools
  {
    name: 'AI Safety Governance Framework',
    slug: 'ai-safety-governance',
    description: 'Comprehensive framework for implementing AI safety governance in organizations, including risk assessment and mitigation strategies.',
    category: 'governance',
    type: 'framework',
    website_url: 'https://www.partnershiponai.org/',
    status: 'active',
    difficulty_level: 'intermediate',
    tags: ['governance', 'policy', 'risk-assessment', 'compliance'],
  },
  {
    name: 'Model Cards',
    slug: 'model-cards',
    description: 'Documentation framework for machine learning models, detailing intended use, performance metrics, and limitations.',
    category: 'governance',
    type: 'technique',
    paper_url: 'https://arxiv.org/abs/1810.03993',
    github_url: 'https://github.com/tensorflow/model-card-toolkit',
    status: 'active',
    difficulty_level: 'beginner',
    tags: ['documentation', 'transparency', 'accountability'],
  },
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
        id, name, slug, description, category, type,
        github_url, docs_url, paper_url, website_url,
        pypi_package, npm_package, status, difficulty_level,
        is_featured, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, datetime('now'), datetime('now')
      )
    `)

    const insertTag = db.prepare(`
      INSERT INTO tool_tags (tool_id, tag_name)
      VALUES (?, ?)
    `)

    const insertExample = db.prepare(`
      INSERT INTO tool_examples (
        id, tool_id, title, description, code, language, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    for (const tool of tools) {
      const toolId = `tool-${tool.slug}`

      // Insert tool
      insertTool.run(
        toolId,
        tool.name,
        tool.slug,
        tool.description,
        tool.category,
        tool.type,
        tool.github_url || null,
        tool.docs_url || null,
        tool.paper_url || null,
        tool.website_url || null,
        tool.pypi_package || null,
        tool.npm_package || null,
        tool.status,
        tool.difficulty_level,
        tool.is_featured ? 1 : 0
      )

      // Insert tags
      for (const tag of tool.tags) {
        insertTag.run(toolId, tag)
      }

      // Insert examples
      if (tool.examples) {
        tool.examples.forEach((example, index) => {
          insertExample.run(
            `${toolId}-example-${index}`,
            toolId,
            example.title,
            example.description,
            example.code,
            example.language,
            index
          )
        })
      }
    }

    db.exec('COMMIT')
    console.log(`Successfully populated ${tools.length} tools`)
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