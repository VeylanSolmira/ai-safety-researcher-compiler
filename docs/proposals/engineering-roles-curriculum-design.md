# Engineering Track for AI Safety - Simplified Design

## Overview

This proposal adds a single "AI Safety Engineer" track to the curriculum, covering the technical skills needed to build infrastructure and tools for AI safety work.

## The AI Safety Engineer Role

**Definition**: Engineers who build the infrastructure, tools, and systems that enable safe AI development and evaluation.

**Target Employers**: METR, Anthropic, OpenAI, DeepMind, Redwood Research, ARC Evals, and other safety-focused organizations.

**Core Philosophy**: One engineering track that covers the full stack needed for AI safety work, from infrastructure to tools to security

## Implementation Strategy

### 1. Simple Track System

```sql
-- Add track field to topics (simpler than role tags)
ALTER TABLE topics ADD COLUMN track TEXT DEFAULT 'general';
-- Values: 'general', 'engineering', 'research', 'governance'

-- Add user track preference
ALTER TABLE user_progress ADD COLUMN selected_track TEXT DEFAULT 'general';
```

### 2. Engineering Track Curriculum

#### Core Engineering Module (Added to Intermediate Tier)

**Production Infrastructure for AI Safety**
- Cloud Platforms & ML Infrastructure
- Containerization & Orchestration (Docker → Kubernetes)
- CI/CD for Safety-Critical Systems
- Monitoring & Observability

**Data Engineering for Safety Evaluation**
- Building Evaluation Pipelines
- Experiment Tracking & Versioning
- Data Storage & Processing at Scale
- Real-time Safety Metrics

#### Advanced Engineering Module (Added to Advanced Tier)

**Platform Engineering for AI Safety**
- Advanced Kubernetes for Model Isolation
- Multi-tenant Evaluation Platforms
- Cost Optimization for GPU Workloads
- Infrastructure as Code (Terraform/Pulumi)

**Security & Reliability Engineering**
- Sandboxing Untrusted Models
- Zero-trust Architecture for AI Systems
- Incident Response & Forensics
- Chaos Engineering for AI Infrastructure

**Full-Stack Safety Tools**
- TypeScript/React for Research Interfaces
- API Design for Safety Systems
- Real-time Monitoring Dashboards
- Integration with Research Tools

## UI/UX Changes

### 1. Track Selection (Simple Toggle)
```typescript
interface TrackToggleProps {
  tracks: [
    { id: 'general', label: 'General Path', icon: '📚' },
    { id: 'engineering', label: 'Engineering Track', icon: '⚙️' },
    { id: 'research', label: 'Research Track', icon: '🔬' },
    { id: 'governance', label: 'Governance Track', icon: '🏛️' }
  ]
}
```

### 2. Smart Content Display
- Engineering track shows additional engineering topics
- Other tracks hide deep technical implementation details
- All tracks see core AI safety concepts

### 3. Visual Cues
- Small track badge on engineering-specific topics: ⚙️
- "Engineering Track" label in module headers
- Different color accent for engineering content

## Why One Engineering Track?

**Advantages**:
- Simpler for users (no analysis paralysis)
- Covers full stack needed for any AI safety engineering role
- Easier to maintain and update
- Natural progression from basics to specialization

**Flexibility**: 
- Engineering track includes all key skills (platform, tools, security)
- Users can skip sections not relevant to their specific job
- Optional "deep dives" for specialized topics

## Content Mapping to METR Requirements

| METR Requirement | Engineering Track Coverage |
|------------------|---------------------------|
| Large-scale systems | ✅ Production Infrastructure module |
| Containerization | ✅ Docker → Kubernetes progression |
| Cloud (AWS) | ✅ Cloud Platforms section |
| Python | ✅ Already in core + engineering context |
| TypeScript | ✅ Full-Stack Safety Tools |
| Data pipelines | ✅ Data Engineering module |
| Security | ✅ Security & Reliability module |
| CI/CD | ✅ CI/CD for Safety-Critical Systems |

## Implementation Plan

### Phase 1: Add Track System (Week 1)
1. Add `track` column to topics table
2. Create track toggle UI component
3. Update topic queries to filter by track

### Phase 2: Core Engineering Content (Weeks 2-4)
1. Production Infrastructure for AI Safety
2. Data Engineering for Safety Evaluation
3. Tag as `track: 'engineering'`

### Phase 3: Advanced Engineering (Weeks 5-6)
1. Platform Engineering topics
2. Security & Reliability topics
3. Full-Stack Safety Tools

## Example Topics Structure

```typescript
// Core topic everyone sees
{
  title: "Docker & Containerization",
  track: "general",
  tier: "foundations"
}

// Engineering-specific extension
{
  title: "Kubernetes for Model Evaluation",
  track: "engineering", 
  tier: "intermediate",
  prerequisites: ["docker-containerization"]
}
```

## Next Steps

1. Get approval on single engineering track approach
2. Implement simple track system in database
3. Create first METR-aligned engineering topics
4. Add track toggle to UI
5. Test with engineering-focused users