# Roadmap → Journey Upsert Plan

## Overview
This document outlines the specific changes needed to merge all roadmap content into the journey structure, creating a single source of truth.

## Current State
- **Journey**: 4 tiers, 19 modules, 71 topics
- **Roadmap**: 72 topics/subtopics with content files
- **Already Linked**: 33 topics have roadmapContentId
- **Need to Add**: 39 topics from roadmap

## Upsert Strategy

### 1. Foundation Tier Additions

#### Module: Core Foundations
**Add these topics:**
- `types-ai-systems-subtopic` → "Types of AI Systems Overview"
- `llms-subtopic` → "Understanding Large Language Models"
- `how-llms-trained-subtopic` → "How LLMs are Trained"

#### Module: Safety Fundamentals  
**Add these topics:**
- `control-subtopic` → "The Control Problem"
- `agency-subtopic` → "AI Agency and Autonomy"
- `situational-awareness-subtopic` → "AI Situational Awareness"
- `impenetrability-subtopic` → "The Impenetrability Problem"

### 2. Intermediate Tier Additions

#### Module: ML Engineering for Safety
**Add these topics:**
- `docker-subtopic` → "Containerization for Research"
- `version-control-subtopic` → "Advanced Git for Research"
- `distributed-systems-subtopic` → "Distributed Training Systems"

#### Module: Research Methods
**Create new module with:**
- `problem-decomposition-scoping-subtopic` → "Problem Decomposition"
- `iterative-research-design-subtopic` → "Iterative Research Design"  
- `research-project-management-subtopic` → "Research Project Management"
- `core-methodology-subtopic` → "Core Research Methodology"

#### Module: AI Agents & Tool Use
**Create new module with:**
- `ai-agents-subtopic` → "Agent Architectures & Design"
- NEW: "Agent Safety Fundamentals" (create new content)
- NEW: "Agent Evaluation & Testing" (create new content)
- NEW: "Human-Agent Interaction" (create new content)

#### Module: Testing & Evaluation
**Add these topics:**
- `white-box-subtopic` → "White Box Testing Methods"
- `black-box-subtopic` → "Black Box Testing Methods"
- `grey-box-subtopic` → "Grey Box Testing Methods"
- `transparency-subtopic` → "Transparency in AI Systems"

### 3. Advanced Tier Additions

#### Module: Advanced Training
**Add these topics:**
- `pretraining-subtopic` → "Pretraining at Scale"
- `fine-tuning-subtopic` → "Advanced Fine-tuning Techniques"
- `hallucinations-subtopic` → "Understanding Hallucinations"

#### Module: Multi-Agent & Complex Systems
**Create new module with:**
- `multi-agent-subtopic` → "Multi-Agent Coordination"
- NEW: "Emergent Agent Behaviors" (create new content)
- NEW: "Agent Ecosystems & Economics" (create new content)
- `teacher-trainer-subtopic` → "Teacher vs Trainer Paradigms"

#### Module: AI Safety Community
**Add these topics:**
- `key-figures-subtopic` → "Key Figures in AI Safety"
- `neel-nanda-subtopic` → "Neel Nanda's Contributions"
- `yoshua-bengio-subtopic` → "Yoshua Bengio's Work"
- `constellation-subtopic` → "Constellation Organization"
- `far-subtopic` → "Fund for Alignment Research"

### 4. Expert Tier Additions

#### Module: Security & Adversarial
**Add these topics:**
- `computer-security-subtopic` → "AI Systems Security"
- `disrupting-research-subtopic` → "Disrupting AI Safety Research"

## Content Migration Details

### For Each Topic Addition:
1. Create topic entry in journey structure
2. Set `roadmapContentId` to link existing content
3. Add appropriate metadata (duration, difficulty, prerequisites)
4. Ensure both academic and personal content versions work
5. Link related experiments, case studies, explorations

### Special Handling:
- **Label nodes**: Convert to module descriptions
- **Section nodes**: Use for visual grouping in future roadmap export
- **Foundational papers**: Integrate into existing "Key Papers" topics

## Implementation Order

### Phase 1: Core Concepts (High Priority)
1. Control, Agency, Situational Awareness
2. Types of AI Systems, LLMs basics
3. Testing methods (white/black/grey box)

### Phase 2: Technical Skills
1. Docker, Version Control
2. Pretraining, Fine-tuning
3. Distributed Systems

### Phase 3: Research & Meta
1. Research Methods module
2. Key Figures & Organizations
3. Remaining advanced topics

## Validation Checklist
- [ ] All 72 roadmap topics mapped
- [ ] No duplicate content
- [ ] Proper tier/module placement
- [ ] Academic/personal versions handled
- [ ] Cross-references maintained
- [ ] Export metadata preserved

## Benefits of Unified Structure
1. **Single source of truth** - No more divergence
2. **Complete coverage** - All content accessible
3. **Better organization** - Logical module grouping
4. **Export ready** - Can generate roadmap format
5. **Token efficient** - Database-driven access