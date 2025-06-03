# AI Safety Research Compiler

A comprehensive, interactive curriculum for systematically developing AI safety research capabilities - from foundations to advanced technical contributions.

## 🚨 Important Disclaimers

### Alpha Development Stage

**This project is currently in ALPHA stage**. In software development, alpha stage indicates:
- Core functionality is implemented but not feature-complete
- Active development with frequent breaking changes
- Limited testing and potential instability
- Not recommended for production use
- User feedback is crucial for shaping development

We believe this accurately describes our current state. The curriculum structure is established, core features work, but content is incomplete and the platform requires extensive testing and refinement.

### AI-Generated Content Notice

**This curriculum contains substantial AI-generated content**, primarily created using Claude Opus 4. While this enables rapid content creation and diverse perspectives, users should be aware of important considerations:

- **Critical evaluation required**: AI-generated content may contain inaccuracies, biases, or oversimplifications
- **Adversarial meta-learning risks**: See our [analysis of AI tutor risks](src/data/roadmaps/ai-safety-researcher/content/adversarial-meta-learning@adversarial-meta-learning-subtopic.md)
- **Unverified citations**: Some references may be flagged as unverified (marked with ⚠️)
- **Epistemological concerns**: Using AI to teach AI safety presents unique philosophical challenges

For more on the risks of AI-generated educational content:
- [Adversarial Meta-Learning in AI Safety](src/data/roadmaps/ai-safety-researcher/content/adversarial-meta-learning@adversarial-meta-learning-subtopic.md)
- [AI Assistant Implementation Notes](docs/unified-ai-assistant-usage.md)

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
- [ ] **Research Methodology & Execution**
  - [ ] Problem Decomposition & Scoping
  - [ ] Iterative Research Design
  - [ ] Research Project Management
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

- [X] Add interactive assessments
- [ ] Implement progress tracking
    - [X] localStorage during development
    - [ ] Full auth solution
- [X] Add more learning pathways
- [ ] Create community features
- [X] Add new journey paths that traverse the roadmap differently (e.g., "Fast Track for ML Engineers" or "Philosophy-First Approach")


## Documentation

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Instructions for deploying to various platforms
- **[Journey Implementation](JOURNEY_IMPLEMENTATION.md)** - Interactive journey feature details
- **[View Mode Implementation](VIEW_MODE_IMPLEMENTATION.md)** - Academic/Personal view mode details
- **[Development Notes](development-resources/notes.md)** - Technical decisions and implementation notes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [roadmap.sh](https://roadmap.sh) visualization approach
- Built with Next.js, React, and ReactFlow