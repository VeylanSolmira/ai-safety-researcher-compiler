# AI Safety Research Compiler

A comprehensive, interactive curriculum for systematically developing AI safety research capabilities - from foundations to advanced technical contributions.

## Overview

This project provides a structured learning pathway for becoming an AI Safety Researcher, featuring:

- 🎯 **Solution-oriented approach** - Focus on actionable research directions
- 🌍 **Value pluralism** - Acknowledging multiple valid approaches to AI safety
- 🔨 **Hands-on implementation** - Build transformers and alignment techniques from scratch
- 📊 **Progressive competency** - Embedded assessments verify understanding
- 🌱 **Ecological perspective** - Understanding AI systems within broader contexts

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VeylanSolmira/ai-safety-researcher-compiler.git
cd ai-safety-research-compiler
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── src/data/roadmaps/     # Roadmap content and structure
│   └── ai-safety-researcher/
│       ├── ai-safety-researcher.json    # Visual roadmap definition
│       ├── ai-safety-researcher.md      # Roadmap metadata
│       ├── content/                     # Individual topic content
│       └── faqs.astro                   # Frequently asked questions
└── styles/                # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap

### Complete AI Safety Curriculum Content

Current curriculum structure with implementation status:

#### Prerequisites
- [ ] ML basics
- [ ] Python programming
- [ ] Linear algebra & calculus
- [ ] Basic statistics

#### 1. Foundations
- [ ] **Core Computer Science**
  - [ ] Docker & Containerization
  - [ ] Distributed Systems
  - [ ] Version Control
- [ ] **AI Safety Paradigms**
  - [ ] Control
  - [ ] Alignment
  - [ ] Value Learning
- [ ] **AI Systems & Training**
  - [ ] Types of AI Systems
  - [ ] LLMs
  - [ ] How LLMs are Trained
  - [ ] Pretraining
  - [ ] Fine-tuning
- [ ] **Philosophy & Ethics**
  - [ ] Ethics & Philosophy

#### 2. Alignment Fundamentals
- [ ] **Sources of AI Risk**
  - [ ] Agency
  - [ ] Impenetrability
  - [ ] Situational awareness
- [ ] **AI Risk Areas**
  - [ ] Existential Risk
- [ ] **Core Concepts**
  - [ ] Core Methodology
  - [ ] Teacher vs. Trainer
  - [ ] Multi-Agent Environments
  - [ ] Hallucinations
  - [X] Foundational Papers
  - [X] Key Figures

#### 3. Technical Alignment
- [ ] **Testing Contexts**
  - [ ] White Box Testing
  - [ ] Black Box Testing
  - [ ] Grey Box Testing
- [ ] **Interpretability Techniques**
  - [ ] Explainability
  - [ ] Interpretability
  - [ ] Transparency
- [ ] **Security & Attacks**
  - [ ] Prompt Injection
  - [ ] Jailbreak Techniques
  - [ ] Data Poisoning
  - [ ] Computer Security

#### 4. AI Governance
- [ ] **Policy Frameworks**
  - [ ] National AI Strategies
  - [ ] International Coordination
  - [ ] Regulatory Approaches
- [ ] **Institutional Design**
  - [ ] Safety Oversight Bodies
  - [ ] Assessment Frameworks
  - [ ] Enforcement Mechanisms
- [ ] **Strategic Interventions**
  - [ ] Risk Assessment Methodologies
  - [ ] Timeline Considerations
  - [ ] Resource Allocation

#### 5. Technical Governance
- [ ] **Compute Governance**
  - [ ] Training Run Monitoring
  - [ ] Hardware Controls
  - [ ] Resource Tracking
- [ ] **Model Evaluations**
  - [ ] Safety Benchmarks
  - [ ] Capability Assessments
  - [ ] Red Teaming Protocols
- [ ] **Institutional Mechanisms**
  - [ ] API Access Controls
  - [ ] Deployment Gates
  - [ ] Safety-Capability Balance

#### 6. Advanced Research
- [ ] **Organizations**
  - [ ] Constellation
  - [ ] FAR (Fund for Alignment Research)
- [ ] **Research Methods**
  - [ ] Red Teaming
  - [ ] AI Agents
  - [ ] Disrupting AI Safety Research
  - [ ] Collaboration

### Other Development Goals

- [ ] Add interactive assessments
- [ ] Implement progress tracking
- [ ] Add more learning pathways
- [ ] Create community features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [roadmap.sh](https://roadmap.sh) visualization approach
- Built with Next.js, React, and ReactFlow