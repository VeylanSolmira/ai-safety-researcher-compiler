#!/usr/bin/env npx tsx

import { getDb, eq } from '../lib/db';
import { topics } from '../lib/db/schema';

const academicContent = `# Core Prerequisites

<!-- This is the academic/formal version of prerequisites@prerequisites -->

## Overview

This section outlines the essential foundational knowledge and skills required to engage meaningfully with AI safety research. While the field is inherently interdisciplinary, certain core competencies form the basis for effective contribution.

## Mathematical Foundations

### Probability and Statistics
- Probability distributions and density functions
- Bayes' theorem and Bayesian inference
- Expectation, variance, and covariance
- Statistical hypothesis testing
- Understanding of uncertainty quantification

### Linear Algebra
- Vector spaces and linear transformations
- Matrix operations and decompositions
- Eigenvalues and eigenvectors
- Understanding of high-dimensional geometry

### Calculus and Optimization
- Multivariate calculus
- Partial derivatives and gradients
- Chain rule (essential for backpropagation)
- Constrained and unconstrained optimization
- Lagrange multipliers

## Computer Science Fundamentals

### Programming Proficiency
- Strong command of Python
- Familiarity with scientific computing libraries (NumPy, SciPy)
- Basic software engineering practices
- Version control systems (Git)

### Machine Learning Frameworks
- Working knowledge of PyTorch or TensorFlow
- Understanding of computational graphs
- Experience with model training and evaluation

### Algorithmic Thinking
- Complexity analysis
- Data structures
- Basic understanding of distributed systems

## Machine Learning Foundations

### Core Concepts
- Supervised, unsupervised, and reinforcement learning paradigms
- Bias-variance tradeoff
- Regularization techniques
- Cross-validation and model selection

### Deep Learning
- Neural network architectures
- Backpropagation algorithm
- Common architectures (CNNs, RNNs, Transformers)
- Training dynamics and optimization

### Practical Experience
- Implementation of basic ML algorithms
- Debugging and troubleshooting models
- Interpreting experimental results
- Reproducing research findings

## Research Skills

### Literature Comprehension
- Ability to read and understand technical papers
- Critical evaluation of research claims
- Identifying limitations and assumptions
- Synthesizing information from multiple sources

### Scientific Methodology
- Hypothesis formulation
- Experimental design
- Statistical analysis of results
- Clear technical writing

### Collaboration
- Communication with interdisciplinary teams
- Code review and pair programming
- Constructive peer review
- Project management basics

## Recommended Preparation

### Courses
- Linear Algebra (MIT 18.06 or equivalent)
- Probability and Statistics (university level)
- Machine Learning (Andrew Ng's course or similar)
- Deep Learning (fast.ai or deeplearning.ai)

### Textbooks
- *Pattern Recognition and Machine Learning* by Christopher Bishop
- *The Elements of Statistical Learning* by Hastie, Tibshirani, and Friedman
- *Deep Learning* by Ian Goodfellow, Yoshua Bengio, and Aaron Courville
- *Artificial Intelligence: A Modern Approach* by Stuart Russell and Peter Norvig

### Practical Projects
- Implement a neural network from scratch
- Reproduce a simple ML paper
- Contribute to an open-source ML project
- Complete a Kaggle competition

## Assessment Checklist

Before proceeding, ensure you can:
- [ ] Implement gradient descent from first principles
- [ ] Explain backpropagation mathematically
- [ ] Debug a failing neural network
- [ ] Read and understand a recent ML conference paper
- [ ] Design and conduct a simple ML experiment
- [ ] Write clear documentation for technical code

## Note on Prerequisites

While this list may seem extensive, remember that AI safety research often involves learning on the job. A strong foundation in these areas will accelerate your progress, but perfect mastery is not required before beginning. Focus on building a solid understanding of the fundamentals and developing the ability to learn quickly and independently.

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

Remember: AI safety is a pre-paradigmatic field. Stay curious, question assumptions, and contribute your unique perspective to this crucial challenge.`;

async function restoreContent() {
  const db = getDb();
  
  console.log('Restoring prerequisites-foundations content...');
  
  try {
    const result = await db
      .update(topics)
      .set({
        contentAcademic: academicContent,
        updatedAt: new Date()
      })
      .where(eq(topics.id, 'prerequisites-foundations'))
      .returning();
    
    if (result.length > 0) {
      console.log('✓ Successfully restored content');
      console.log('Content preview:', result[0].contentAcademic?.substring(0, 100) + '...');
    } else {
      console.log('✗ Topic not found');
    }
  } catch (error) {
    console.error('Error restoring content:', error);
  }
}

restoreContent();