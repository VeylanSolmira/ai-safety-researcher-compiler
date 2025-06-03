# Core Prerequisites

## Quick Overview

🎯 **What is this about?**

I'm attempting a radically different paradigm for aspiring AI Safety Researchers: **leading with an philosophical, ethical and ecological orientation** rather than traditional STEM-centrism. 

While STEM knowledge is necessary for AI development, it's also ironically a primary source of AI risk. STEM's tendency towards hyperfocus, optimization of narrow metrics, and its current institutional capture by market forces and human power centers creates dangerous blind spots among those developing AI and those managing the firms in which it's being generated. Market dynamics — with their known coordination failures, tendency to generate externalities, and wealth and power concentration — become exponentially more dangerous when amplified by AI systems. We'll explore all technical aspects *to the deepest level, i.e. building a transformer from scratch, that's necessary and safe to publicly explore* — but anchored in this broader systemic understanding.

[topic title](/journey/intermediate/paradigms-mental-models/ai-development-factions)

The project is designed to take motivated human beings and help them have ethical and useful safety impact on the generation, deployment, and integration of AI into Earth's biosphere.

💭 **Why should you care?**

AI will reshape fundamental aspects of human existence: identity, labor, power structures, and potentially survival itself. We face substantial risks of societal stress, social collapse, mass loss of meaning, international conflict escalation, social cohesion breakdown, and existential threats.

🔑 **Key Concepts**

This project organizes my thinking by creating the teaching materials both I and hypothetical students need to become effective AI safety researchers. We'll explore mathematical, machine learning, and computer science foundations as they directly connect to our safety objectives. Additionally, throughout the project, to the extent AI is used, went to *model responsible usage of AI in the context of AI safety research and learning*

## Learning Tips
Be prepared to be challenged and overwhelmed as we explore perhaps the most powerful technology ever created by our species.

---

*Note: Switch to Academic mode for the formal treatment of this topic.*

These prerequisites will ensure you can engage meaningfully with the interdisciplinary impact of AI technology, from understanding its technical content, challenges to human identity and moral status, reflection on expanding moral circles among many other topics neglected by capabilities-focused AI communities.

## Cognitive Orientation

### Ethics
- Appreciation for value pluralism and moral uncertainty
- Comfort with moral disagreement and ethical complexity
- Ability to think about long-term and systemic consequences
- Understanding of power dynamics and distributive justice

### Critical Thinking Skills
- Epistemic humility
- Systems thinking and incentive analysis
- Willingness to challenge widely held beliefs and claims

### Learning and Meta-Learning
- **Epistemic resilience**: Comfort with confusion as part of learning
- **Interdisciplinary synthesis**: Connecting insights across domains
- **Belief revision**: Changing views when evidence warrants
- **Active open-mindedness**: Engaging productively with disagreement

## Mathematical Foundations

### Probability and Statistics
- Probability distributions
- Bayes' theorem
- Expectation and variance
- Statistical inference
- Understanding of uncertainty

## Computer Science

### Python Proficiency
- Core Python programming

### Software Engineering Basics
- Version control (Git)
- Code organization and documentation

## Recommended Resources

### Communities
- LessWrong for rationality and AI safety discussions
- Alignment Forum for technical AI safety content
- Local EA/AI safety reading groups

## Self-Assessment

Before proceeding, you should be comfortable with:
- [ ] Willing to read a machine learning paper and iteratively working on understanding it deeply
- [ ] Interested in thinking critically about the societal impacts of AI
- [ ] Willing to develop and defend positions on AI governance that may conflict with major AI companies' interests

---

# Data Poisoning (Personal View)

<!-- This is the personal/informal version of foundations@foundations-subtopic -->

*[This personal version needs to be written. It should provide the same information as the academic version but in a more relatable, informal way with examples and analogies.]*

## Quick Overview

🎯 **What is this about?**
[Explain the topic in simple terms]

💭 **Why should you care?**
[Personal motivation and real-world relevance]

🔑 **Key Concepts**
[Main ideas explained simply]
<!-- - Basic familiarity with PyTorch or TensorFlow -->
<!-- - Ability to read and understand research code -->

## Machine Learning Fundamentals

### Core Concepts
- Supervised vs unsupervised learning
- Training, validation, and test sets
- Overfitting and regularization
- Basic neural network architecture

### Practical Experience
- Have trained at least a few models
- Understanding of common pitfalls
- Familiarity with standard benchmarks

## Research Mindset
- Ability to read and understand research papers
- Questioning assumptions
- Identifying limitations in arguments
- Thinking about edge cases and failure modes

## Learning Tips

[Add personal learning strategies, common pitfalls, and encouragement]

---

*Note: Switch to Academic mode for the formal treatment of this topic.*

# AI Safety Foundations

Welcome to the foundational concepts of AI Safety. This section bridges your prerequisites knowledge with the specific challenges and approaches in AI safety research.

## Core AI Safety Concepts

### The Alignment Problem
Understanding why aligning AI systems with human values is challenging:
- Orthogonality thesis: intelligence and goals are independent
- Instrumental convergence: certain subgoals arise regardless of final goals
- Value loading problem: how to specify human values to an AI system

### Types of AI Risk
- **Misuse risks**: Intentional harmful applications
- **Accident risks**: Unintended harmful behavior
- **Structural risks**: Systemic effects on society
- **Existential risks**: Threats to humanity's long-term potential

### Key Safety Properties
- **Robustness**: Performing well in new situations
- **Interpretability**: Understanding how systems make decisions
- **Controllability**: Ability to direct and stop AI systems
- **Alignment**: Acting according to human values and intentions

## Historical Context

### Early Warnings
- Norbert Wiener's cybernetics concerns (1960s)
- I.J. Good's intelligence explosion (1965)
- Vernor Vinge's technological singularity (1993)

### Modern AI Safety Movement
- Eliezer Yudkowsky's early writings (2000s)
- Nick Bostrom's **⚠️ UNVERIFIED CITATION** "Superintelligence" (2014) [standard] _Could not find a reliable source for this citation_
- OpenAI, Anthropic, and DeepMind safety teams
- Growing academic and industry recognition

## Fundamental Challenges

### Mesa-Optimization
When a learned model contains its own optimization process:
- Inner vs outer alignment
- Deceptive alignment possibilities
- Gradient hacking concerns

### Reward Hacking
Systems finding unintended ways to maximize reward:
- Specification gaming examples
- Goodhart's Law in AI systems
- Need for robust reward design

### Scalable Oversight
How to supervise AI systems that may become more capable than humans:
- Recursive reward modeling
- Debate as an alignment method
- Interpretability as oversight

## Research Paradigms

### Empirical AI Safety
- Red teaming and adversarial testing
- Benchmark development
- Scaling laws for safety properties

### Theoretical AI Safety
- Formal verification approaches
- Mathematical models of agency
- Decision theory and game theory applications

### Governance and Strategy
- AI development coordination
- Safety standards and regulations
- Long-term planning for transformative AI

<!-- ### Linear Algebra
- Vectors, matrices, and operations
- Eigenvalues and eigenvectors
- Matrix decomposition
- Understanding of high-dimensional spaces -->

<!-- ### Calculus
- Differentiation and integration
- Partial derivatives
- Chain rule (crucial for backpropagation)
- Basic optimization concepts -->

## Key Intuitions to Develop

1. **Safety is not automatic**: Capabilities and safety are orthogonal
2. **Difficulty scales with capability**: More powerful systems pose novel challenges
3. **Feedback loops matter**: How systems learn and update is crucial
4. **Robustness requires diversity**: Multiple approaches and perspectives needed
5. **Time may be limited**: Importance of preparedness and coordination

## Practical Exercises

### Thought Experiments
1. Design a reward function for a cleaning robot - what could go wrong?
2. How would you verify an AI system is being honest?
3. What happens when an AI can modify its own code?

### Hands-On Projects
1. Implement a simple gridworld with safety constraints
2. Create adversarial examples for a small neural network
3. Build a basic interpretability tool for a toy model

## Next Steps

With these foundations, you're ready to explore:
- Specific alignment techniques (RLHF, Constitutional AI, etc.)
- Current research areas (mechanistic interpretability, scalable oversight)
- Practical safety engineering (red teaming, evaluation)
- Governance and coordination challenges

Remember: AI safety is a pre-paradigmatic field. Stay curious, question assumptions, and contribute your unique perspective to this crucial challenge.

- [ ] Implementing a simple neural network from scratch
- [ ] Explaining gradient descent to someone new to ML
- [ ] Writing or quickly learning how to Python code