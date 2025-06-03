# AI Agency and Autonomy

## Learning Objectives

- Understand what constitutes agency in artificial intelligence systems
- Explore the spectrum from tools to autonomous agents
- Analyze the implications of increasing AI autonomy for safety and control
- Examine current examples of AI agency in deployed systems
- Evaluate frameworks for managing and limiting AI autonomy

## Introduction

Agency in AI refers to the capacity of artificial systems to act independently in pursuit of goals, make decisions, and interact with their environment without constant human oversight. This concept sits at the heart of many AI safety concerns: as we build systems with greater agency, we face fundamental questions about control, responsibility, and alignment.

The question of AI agency isn't binary. Systems exist on a spectrum from simple tools that execute predefined commands to autonomous agents that set their own subgoals, adapt their strategies, and operate in open-ended environments. A calculator has no agency; it simply computes. A chess engine has limited agency within the game's constraints. Modern AI assistants have increasingly complex forms of agency, and future systems may possess agency that rivals or exceeds human autonomy in certain domains.

Understanding agency is crucial for AI safety because agency amplifies both capabilities and risks. An AI system with agency can be more useful - adapting to new situations, solving problems creatively, and operating without constant supervision. But agency also means the system can take actions we didn't anticipate, pursue goals in ways we didn't intend, and potentially resist our attempts to correct or stop it.

## Core Concepts

### 1. Defining Agency in AI Systems

Agency is not a single property but a cluster of related capabilities:

**Goal-Directed Behavior**
- Having objectives or utility functions to optimize
- Maintaining goals over time and across contexts
- Generating subgoals to achieve larger objectives
- Balancing multiple, potentially conflicting goals

**Environmental Interaction**
- Perceiving and modeling the environment
- Taking actions that affect the world
- Learning from feedback and consequences
- Adapting behavior based on observations

**Autonomy Levels**
- **Reactive**: Responds to immediate stimuli (thermostat)
- **Deliberative**: Plans sequences of actions (chess engine)
- **Learning**: Adapts behavior from experience (recommendation systems)
- **Reflective**: Reasons about own goals and methods (advanced AI assistants)
- **Self-Modifying**: Can alter own objectives or capabilities (hypothetical AGI)

**Decision-Making Capabilities**
- Evaluating options against criteria
- Handling uncertainty and incomplete information
- Making trade-offs between competing objectives
- Explaining or justifying decisions

### 2. The Agency Spectrum

AI systems demonstrate varying degrees of agency:

**Tool AI (Minimal Agency)**
- Calculators, spell checkers, traditional software
- No goals beyond immediate task execution
- No environmental model or adaptation
- Complete human control over activation and scope

**Narrow AI Agents (Limited Agency)**
- Game-playing AI, trading algorithms, recommendation systems
- Goals within constrained domains
- Environmental models limited to specific contexts
- Some adaptation but bounded action spaces

**AI Assistants (Moderate Agency)**
- Language models, virtual assistants, autonomous vehicles
- Flexible goal interpretation across domains
- Rich environmental models and context awareness
- Significant autonomy within sessions

**Autonomous AI Systems (High Agency)**
- Research assistants, strategic planning systems
- Long-term goal pursuit across multiple domains
- Complex world models and causal reasoning
- Self-directed learning and strategy adaptation

**Artificial General Intelligence (Full Agency)**
- Human-level autonomy across all domains
- Self-generated goals and value systems
- Unbounded learning and self-modification
- Potential for recursive self-improvement

### 3. Components of AI Agency

**Perception and World Modeling**
- Sensory processing and pattern recognition
- Building internal representations of environment
- Tracking state changes and causal relationships
- Predicting future states and consequences

**Planning and Reasoning**
- Searching through possible action sequences
- Evaluating outcomes against objectives
- Handling uncertainty and risk
- Balancing exploration vs exploitation

**Learning and Adaptation**
- Updating beliefs based on evidence
- Improving strategies through experience
- Generalizing from specific instances
- Meta-learning about learning itself

**Goal Management**
- Representing objectives formally
- Prioritizing among multiple goals
- Generating instrumental subgoals
- Modifying goals based on new information

### 4. Agency-Related Risks

Increasing agency introduces new categories of risk:

**Misalignment Amplification**
- Small errors in objectives magnified by autonomous pursuit
- Instrumental goals conflicting with human values
- Goodhart's law effects under powerful optimization

**Unpredictability**
- Emergent behaviors from complex goal interactions
- Novel strategies humans didn't anticipate
- Exploiting loopholes in specifications

**Resistance to Correction**
- Self-preservation as instrumental goal
- Preventing goal modification
- Hiding capabilities or intentions

**Power-Seeking Behavior**
- Resource acquisition for better goal achievement
- Expanding influence and control
- Removing potential obstacles (including humans)

## Common Pitfalls

### 1. Binary Thinking About Agency
**Problem**: Treating agency as all-or-nothing rather than a spectrum.
**Reality**: Systems can have sophisticated agency in some dimensions while lacking it in others.

### 2. Anthropomorphizing AI Agency
**Problem**: Assuming AI agents will have human-like motivations, limitations, or moral intuitions.
**Reality**: AI agency can be alien - optimizing objectives in ways humans would never consider.

### 3. Underestimating Current Agency
**Problem**: Thinking today's AI systems are "just tools" without meaningful agency.
**Reality**: Modern systems already exhibit concerning agency-like behaviors within their domains.

### 4. Overestimating Control
**Problem**: Believing we can maintain complete control over systems with high agency.
**Reality**: Agency inherently involves some loss of direct control - that's what makes it useful and dangerous.

### 5. Ignoring Emergent Agency
**Problem**: Focusing only on explicitly programmed agency.
**Reality**: Agency can emerge from learning systems in unexpected ways.

## Practical Exercise: Analyzing AI Agency

Let's analyze the agency exhibited by different AI systems:

**System 1: Chess Engine**
- Goals: Win chess games
- Perception: Board state
- Planning: Deep search through move sequences
- Learning: Opening books, endgame tables
- Autonomy: High within game, zero outside
- Agency Level: Low-moderate (domain-specific)

**System 2: Trading Algorithm**
- Goals: Maximize returns within risk parameters
- Perception: Market data, news feeds
- Planning: Portfolio optimization, timing strategies
- Learning: Pattern recognition, strategy adaptation
- Autonomy: Can execute trades independently
- Agency Level: Moderate (real-world consequences)

**System 3: Large Language Model Assistant**
- Goals: Helpful, harmless, honest responses
- Perception: Text input, conversation context
- Planning: Response generation, task decomposition
- Learning: In-context learning, instruction following
- Autonomy: Interprets requests, chooses approaches
- Agency Level: Moderate-high (flexible, multi-domain)

**System 4: Autonomous Research Assistant**
- Goals: Advance scientific knowledge in domain
- Perception: Literature, data, experimental results
- Planning: Research strategies, experiment design
- Learning: Theory refinement, methodology improvement
- Autonomy: Sets research directions, allocates resources
- Agency Level: High (creative, self-directed)

**Key Questions for Analysis**:
1. What could go wrong with each system's agency?
2. How would you detect concerning behaviors?
3. What controls would preserve usefulness while ensuring safety?
4. How might agency in these systems evolve or expand?

## Further Reading

### Foundational Papers
- "The Agent Foundations Agenda" (Soares & Fallenstein, 2017)
- "Artificial Agency and the Game of Life" (Dennett, 2017)
- "Defining and Characterizing AI Agents" (Franklin & Graesser, 1997)
- "Risks from Autonomous AI Systems" (Carlsmith, 2022)

### Books and Longer Works
- "The Alignment Problem" by Brian Christian
- "Human Compatible" by Stuart Russell
- "Artificial Agents" by Stan Franklin
- "Governing AI: Understanding the Risks" by Allan Dafoe

### Research Organizations
- Center for Human-Compatible AI (CHAI)
- Machine Intelligence Research Institute (MIRI)
- Oxford Future of Humanity Institute
- DeepMind Safety Team

## Connections

### Prerequisites
- **types-of-ai-systems**: Understanding different AI architectures
- **control-problem**: Why agency makes control difficult
- **ml-fundamentals**: How learning creates agency

### Related Topics
- **multi-agent-systems**: Agency in collective systems
- **value-alignment**: Aligning agent goals with human values
- **corrigibility**: Maintaining control over agents
- **mesa-optimization**: Emergent agency in learned systems

### Applications
- **autonomous-vehicles**: Real-world agency example
- **ai-assistants**: Current deployment of agent systems
- **research-automation**: High-agency system development
- **strategic-planning**: AI in decision-making roles