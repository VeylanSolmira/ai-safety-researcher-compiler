# Mentor-Topic Mapping Plan

This document outlines the mapping between CBAI 2025 Fellowship mentor topics and the existing project topic structure.

## Implementation Status

✅ **Phase 1 Complete**: Created `mentor_topics` junction table with the following schema:
```sql
CREATE TABLE mentor_topics (
  mentor_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  mentor_topic_description TEXT NOT NULL,
  context TEXT DEFAULT 'CBAI 2025 Fellowship',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (mentor_id, topic_id, mentor_topic_description)
);
```

✅ **Phase 1 Complete**: Populated 49 mentor-topic mappings for existing topics

🔄 **Phase 2 Pending**: Review and potentially create new topics (see "Proposed New Topics" section below)

## Existing Topic Mappings (Implemented)

The following mentor research areas have been successfully mapped to existing topics in the database:

### Topics Successfully Mapped
- `deceptive-alignment` - 2 mentors
- `mechanistic-interp` - 6 mentors  
- `llm-psychology` - 1 mentor
- `international-coordination` - 2 mentors
- `hardware-controls` - 1 mentor
- `safety-benchmarks` - 3 mentors
- `chain-of-thought-analysis` - 1 mentor
- `explainable-ai` - 2 mentors
- `control-problem` - 5 mentors
- `safety-monitoring` - 1 mentor
- `model-organisms` - 2 mentors
- `risk-assessment-intro` - 2 mentors
- `multi-agent-coordination` - 2 mentors
- `policy-analysis` - 2 mentors
- `institutional-design` - 1 mentor
- `deployment-gates` - 1 mentor
- `safety-evaluation-101` - 1 mentor
- `red-teaming-protocols` - 2 mentors
- `adversarial-robustness` - 2 mentors
- `code-generation-safety` - 1 mentor
- `cognitive-oversight` - 2 mentors
- `basic-interpretability` - 1 mentor
- `human-agent-interaction` - 1 mentor
- `containerization-research` - 1 mentor
- `risk-landscape` - 1 mentor
- `training-failure-modes` - 1 mentor
- `formal-verification` - 1 mentor
- `automated-red-teaming` - 1 mentor
- `ethics-fundamentals` - 1 mentor
- `agent-safety-fundamentals` - 1 mentor

## Detailed Mentor Mappings

### Adria Garriga-Alonso (Redwood Research)
- Rating: **8-9/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Measuring limitations of post-training with robust lie-detection models" → `deceptive-alignment`
2. "SAEs: fixing absorption and hedging problems, feature-splitting" → `mechanistic-interp`
3. "LLM psychology: measuring LLMs from talking to them" → `llm-psychology` ✓
4. "Extending planning work in Sokoban models to LLMs" → **NEW: `ai-planning-reasoning`**

### Mauricio Baker (RAND)
- Rating: **6/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Developing methods to verify compliance with international AI agreements" → `international-coordination-subtopic`
2. "Identifying effective R&D structures for AI safety and governance" → **NEW: `ai-rd-governance`**
3. "Improving government visibility into AI economic impacts" → **NEW: `ai-economic-impacts`**
4. "Under-explored topics in technical AI governance" → `hardware-controls-subtopic`

### Steven Basart (Independent)
- Rating: **4/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Extending Honesty methods (MASK benchmark)" → `safety-benchmarks-subtopic`
2. "Extending Utility engineering (emergent values)" → **NEW: `emergent-values-alignment`**
3. "Dataset and benchmark creation" → `safety-benchmarks-subtopic`

### David Bau & Alex Loftus (Northeastern)
- Rating: **7.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Mechanistic interpretations of LLM generalization capabilities" → `mechanistic-interp`
2. "Analysis of chain of thought in reasoning models" → `chain-of-thought-analysis` ✓
3. "Training methods for faithful explanation generation" → `explainable-ai`
4. "Experiments bridging human-AI knowledge gap" → **NEW: `human-ai-knowledge-transfer`**

### Joseph Bloom (UK AISI)
- Rating: **7/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Interpretability and control intersection" → `mechanistic-interp` + `control-problem`
2. "Blue team strategies (probes, CoT monitors)" → `safety-monitoring`
3. "Red team strategies for deceptive model organisms" → `model-organisms` ✓
4. "Gears-level models of detection methods" → **NEW: `mechanistic-detection-methods`**

### Vicky Charisi (Harvard/MIT)
- Rating: **5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Systematic literature review on AGI risks in decision-making systems" → `risk-assessment-intro`
2. "Safety in multi-agentic systems and human-AI teaming" → `multi-agent-coordination`
3. "Legal frameworks for embodied AI and robotics safety" → **NEW: `embodied-ai-safety`**
4. "Comparative analysis of AI safety regulations" → `policy-analysis`
5. "Multi-stakeholder approaches for AGI governance" → `institutional-design`

### Michael Chen (METR)
- Rating: **8/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Frontier AI safety policies" → `deployment-gates`
2. "Third-party oversight" → **NEW: `third-party-evaluation`**
3. "Safety cases" → **NEW: `safety-cases`**
4. "International coordination" → `international-coordination-subtopic`
5. "Loss of control evaluations" → `control-problem`
6. "EU AI Act Code of Practice" → `policy-analysis`
7. "Observational scaling laws for dangerous capabilities" → **NEW: `capability-scaling-laws`**
8. "Extending RE-Bench for AI R&D evaluation" → `safety-evaluation-101`

### Joshua Clymer (Redwood Research)
- Rating: **8.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Red team/blue team capture the flag for alignment faking detection" → `red-teaming-protocols-subtopic`
2. "Creating realistic alignment faking models" → `deceptive-alignment`
3. "Detection evasion techniques" → `adversarial-robustness`

### Jason Lynch (MIT FutureTech)
- Rating: **6.5/10** (Notes: "Seems harder/higher standard")
- Personal Evaluation Field: `quickEvaluation`

1. "Progress in Algorithms Project - historic algorithmic progress rates" → **NEW: `algorithmic-progress-forecasting`**
2. "Mechanistic interpretability for LLM code generation" → `code-generation-safety` ✓
3. "LLM adaptation to esoteric programming languages" → **NEW: `llm-code-adaptation`**

### Samuel Marks (Anthropic)
- Rating: **8.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Overseeing models without ground-truth supervision" → `cognitive-oversight` ✓
2. "Downstream applications of interpretability" → `basic-interpretability`
3. "Cognitive process monitoring" → `cognitive-oversight` ✓

### Dylan Hadfield-Menell (MIT)
- Rating: **5/10** (Notes: "Little and generic information")
- Personal Evaluation Field: `quickEvaluation`

- No specific topics listed, but research areas map to:
  - `multi-agent-coordination`
  - `human-agent-interaction`

### Cody Rushing (Redwood Research)
- Rating: **7.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "AI Control projects" → `control-problem`
2. "Extending Ctrl-Z paper work" → **NEW: `control-rollback-mechanisms`**
3. "Attack policy prediction across models" → `adversarial-robustness`
4. "Novel high-stakes control settings" → **NEW: `high-stakes-control`**
5. "Model schelling points and goals" → **NEW: `model-coordination-goals`**

### Aaron Scher (MIRI)
- Rating: **6.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Survey of LLMs on consumer hardware approaches" → **NEW: `consumer-hardware-ai`**
2. "Historical case studies of research avoidance" → **NEW: `research-avoidance-patterns`**
3. "Hardware-dependent AI model development" → `containerization-research`
4. "Alignment benchmarks leaderboard" → `safety-benchmarks-subtopic`
5. "Chinese LLM capability evaluations" → **NEW: `international-ai-capabilities`**

### Chandan Singh (Microsoft Research)
- Rating: **8/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Making reasoning models more interpretable" → `mechanistic-interp`
2. "Natural-language explanations from LLMs" → `explainable-ai`
3. "Mechanistic interpretability" → `mechanistic-interp`

### Peter Slattery (MIT FutureTech)
- Rating: **5.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Developing control taxonomy for AI risk mitigations" → `risk-assessment-intro`
2. "Literature synthesis on mitigation strategies" → `risk-landscape`

### Asa Cooper Stickland
- Rating: **6/10**
- Personal Evaluation Field: `quickEvaluation`

1. "AI control and model organisms" → `model-organisms` ✓
2. "Scaling laws for control" → **NEW: `control-scaling-laws`**
3. "Training models to evade monitors" → `training-failure-modes`

### Max Tegmark (MIT)
- Rating: **7/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Formal verification research" → `formal-verification`

### Tyler Tracy (Redwood Research)
- Rating: **8-8.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Build new control settings" → `control-problem`
2. "Design control protocols and red/blue team games" → `red-teaming-protocols-subtopic`
3. "Training attack policies or monitors" → `automated-red-teaming`
4. "Incrimination strategies for scheming detection" → **NEW: `scheming-detection`**

### Jonathan Zittrain (Harvard)
- Rating: **5.5/10**
- Personal Evaluation Field: `quickEvaluation`

1. "Ethics and governance of AI" → `ethics-fundamentals`
2. "Agentic AI protocols and risk mitigations" → `agent-safety-fundamentals`
3. "Privacy frameworks" → **NEW: `ai-privacy-frameworks`**
4. "AI in education" → **NEW: `ai-education-safety`**

## Proposed New Topics (Phase 2 - Pending Review)

The following mentor research areas do not map to existing topics. They are organized by potential actions:

### Category 1: Clear Candidates for New Topics (10 topics)
These are distinct concepts that don't overlap with existing topics:

1. **third-party-evaluation** - Third-Party AI Evaluation Systems (Michael Chen)
2. **safety-cases** - AI Safety Cases and Documentation (Michael Chen)
3. **capability-scaling-laws** - Capability Scaling Laws and Predictions (Michael Chen)
4. **algorithmic-progress-forecasting** - Algorithmic Progress Forecasting (Jason Lynch)
5. **control-rollback-mechanisms** - Control and Rollback Mechanisms (Cody Rushing)
6. **high-stakes-control** - High-Stakes AI Control Settings (Cody Rushing)
7. **consumer-hardware-ai** - AI on Consumer Hardware (Aaron Scher)
8. **research-avoidance-patterns** - Research Avoidance and Information Hazards (Aaron Scher)
9. **international-ai-capabilities** - International AI Capability Assessment (Aaron Scher)
10. **embodied-ai-safety** - Embodied AI and Robotics Safety (Vicky Charisi)

### Category 2: Potentially Mergeable with Existing Topics (7 topics)
These might fit into existing topics with some expansion:

1. **ai-planning-reasoning** - Could merge with existing AI agent topics or reasoning topics
2. **emergent-values-alignment** - Could fit under existing alignment topics
3. **human-ai-knowledge-transfer** - Might fit with interpretability or human-AI interaction
4. **mechanistic-detection-methods** - Could be part of mechanistic interpretability
5. **llm-code-adaptation** - Could merge with code-generation-safety
6. **model-coordination-goals** - Might fit with multi-agent topics
7. **scheming-detection** - Could be part of deceptive-alignment

### Category 3: Governance/Policy Topics (5 topics)
These are governance-focused and might warrant a new module:

1. **ai-rd-governance** - AI R&D Governance Structures
2. **ai-economic-impacts** - AI Economic Impact Analysis  
3. **ai-privacy-frameworks** - AI Privacy and Data Protection Frameworks
4. **ai-education-safety** - AI in Education Safety Considerations
5. **control-scaling-laws** - Scaling Laws for AI Control Methods

## Database Schema Considerations

### Completed Schema (Phase 1)
```sql
-- Junction table linking mentors to topics
CREATE TABLE mentor_topics (
  mentor_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  mentor_topic_description TEXT NOT NULL,
  context TEXT DEFAULT 'CBAI 2025 Fellowship',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (mentor_id, topic_id, mentor_topic_description)
);
```

### Proposed Schema (Phase 2)
For the full implementation, consider adding:

**mentors table:**
- `id` (string, primary key)
- `name` (string)
- `organization_id` (string, foreign key)
- `biography` (text)
- `personal_evaluation` (JSON) - stores rating and notes from `quickEvaluation`
- `desired_qualifications` (JSON array)

**organizations table:**
- `id` (string, primary key)
- `name` (string)
- `type` (enum: university, research-lab, company, think-tank, government)

**mentor_research_areas table:**
- `mentor_id` (string, foreign key)
- `research_area` (string)

## Querying Mentor-Topic Relationships

### To display mentors on a topic page:
```sql
SELECT m.mentor_id, m.mentor_topic_description, m.context
FROM mentor_topics m
WHERE m.topic_id = ?
ORDER BY m.mentor_id;
```

### To find all topics for a mentor:
```sql
SELECT DISTINCT t.*, m.mentor_topic_description
FROM topics t
JOIN mentor_topics m ON t.id = m.topic_id
WHERE m.mentor_id = ?
ORDER BY t.tier_order, t.module_order, t.order_index;
```

### UI Integration Suggestion
When viewing a topic page, add a section like:
```markdown
## CBAI 2025 Fellowship Mentors
Researchers working on this topic:
- **[Mentor Name]** ([Organization]) - "[Their specific research description]"
```