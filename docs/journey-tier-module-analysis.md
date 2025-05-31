# Journey Mode: Tier → Module → Topic Structure Analysis

## Current Structure

The journey mode currently uses a **Section → Subsection** structure:

### Data Structure (from `/lib/journey.ts`)
```typescript
JourneySection {
  id: string
  title: string
  type: 'linear' | 'open-world'
  contentType: 'build' | 'learn' | 'mixed'
  subsections?: JourneySubsection[]
}

JourneySubsection {
  id: string
  title: string
  roadmapContentId: string
  estimatedTime: string
}
```

### Routing Structure
- `/journey` - Overview page showing all sections
- `/journey/[sectionId]` - Section page (shows subsections or content)
- `/journey/[sectionId]/[subsectionId]` - Subsection page (shows content)
- `/journey/deep-dives/case-studies/[caseId]` - Case study pages
- `/journey/deep-dives/experiments/[experimentId]` - Experiment pages
- `/journey/deep-dives/explorations/[explorationId]` - Exploration pages

### Current Implementation
1. **Sections** can be:
   - Linear (mandatory progression)
   - Open-world (user chooses path)
   
2. **Subsections** are:
   - Optional within sections
   - Link to roadmap content via `roadmapContentId`
   - Track completion independently

3. **Deep Dives** are separate:
   - Case Studies
   - Experiments
   - Explorations

## Proposed Tier → Module → Topic Structure

### Option 1: Extend Current Structure (Recommended)

**Mapping:**
- Tier = Section (keep current structure)
- Module = Subsection (rename and enhance)
- Topic = New level (add as sub-subsection)

**Benefits:**
- Minimal refactoring needed
- Preserves existing progress tracking
- Routing stays similar: `/journey/[tierId]/[moduleId]/[topicId]`

**Changes Needed:**
1. Rename interfaces for clarity:
   - `JourneySection` → `JourneyTier`
   - `JourneySubsection` → `JourneyModule`
   - Add new `JourneyTopic` interface

2. Update data structure:
```typescript
JourneyTier {
  id: string
  title: string
  type: 'linear' | 'open-world'
  description: string
  modules: JourneyModule[]
}

JourneyModule {
  id: string
  title: string
  description: string
  topics: JourneyTopic[]
}

JourneyTopic {
  id: string
  title: string
  roadmapContentId: string
  estimatedTime: string
  deepDives?: {
    caseStudies?: string[]
    experiments?: string[]
    explorations?: string[]
  }
}
```

3. Update routing:
   - Keep existing routes working
   - Add new topic level route

### Option 2: Complete Refactor

**Benefits:**
- Clean slate design
- Perfect terminology match
- More flexibility

**Drawbacks:**
- Major refactoring required
- Break existing progress
- More development time

## Deep Dives Integration

Current deep dives (case studies, experiments, explorations) could be:

1. **Attached to Topics**: Each topic can have associated deep dives
2. **Module-Level**: Some deep dives span multiple topics
3. **Tier-Level**: High-level explorations for entire tiers

## Recommended Approach

1. **Phase 1: Terminology Update**
   - Rename Section → Tier
   - Rename Subsection → Module
   - Update UI labels

2. **Phase 2: Add Topic Level**
   - Create JourneyTopic interface
   - Update Module to contain Topics
   - Add topic routing

3. **Phase 3: Integrate Deep Dives**
   - Link deep dives to appropriate topics
   - Add navigation between content and deep dives
   - Update progress tracking

4. **Phase 4: Content Reorganization**
   - Reorganize existing content into new structure
   - Create clear tier → module → topic hierarchy
   - Ensure smooth learning progression

## Example Structure

```
Tier 1: Foundations
├── Module 1: Understanding AI
│   ├── Topic 1: How LLMs Work
│   ├── Topic 2: Types of AI Systems
│   └── Topic 3: Current Capabilities
├── Module 2: Introduction to Safety
│   ├── Topic 1: Why AI Safety Matters
│   ├── Topic 2: Key Concepts
│   └── Topic 3: Historical Context
└── Module 3: First Experiments
    ├── Topic 1: Prompt Engineering Basics
    ├── Topic 2: Simple Safety Checks
    └── Topic 3: Building Intuition

Tier 2: Core Concepts
├── Module 1: Alignment Fundamentals
│   ├── Topic 1: Value Alignment
│   │   └── Exploration: "Value Alignment Paradox"
│   ├── Topic 2: Goal Specification
│   └── Topic 3: Reward Hacking
└── Module 2: Safety Techniques
    ├── Topic 1: Interpretability
    ├── Topic 2: Robustness
    │   └── Experiment: "Adversarial Prompting Lab"
    └── Topic 3: Verification
```

## Technical Requirements

1. **Database/Storage Changes**:
   - Update progress tracking for three levels
   - Maintain backward compatibility

2. **Component Updates**:
   - Navigation components for three levels
   - Progress indicators for tiers/modules/topics
   - Breadcrumb updates

3. **Content Mapping**:
   - Map existing sections to tiers
   - Split subsections into modules/topics
   - Preserve all existing content

## Benefits of This Structure

1. **Clearer Learning Path**: Three levels provide better granularity
2. **Flexible Pacing**: Complete topics → modules → tiers
3. **Better Organization**: Natural grouping of related concepts
4. **Integrated Deep Dives**: Contextual experiments and explorations
5. **Progress Tracking**: More detailed progress indicators

## Next Steps

1. Review and approve the structure
2. Create migration plan for existing content
3. Update interfaces and types
4. Implement new routing
5. Update UI components
6. Migrate content
7. Test progression and tracking