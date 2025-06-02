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
- Nick Bostrom's "Superintelligence" (2014)
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