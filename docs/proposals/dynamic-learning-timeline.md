# Dynamic Learning Timeline Feature Proposal

## Overview

A flexible, user-defined hierarchical timeline system for AI safety researchers to structure their learning journey. Unlike traditional calendars, this tool allows users to create custom time blocks (days, weeks, sprints, phases) that match their actual learning patterns and project needs.

## Core Concept

Users build their own time hierarchy dynamically:
- Start with any time unit (not forced into weeks/months)
- Nest time blocks within each other as needed
- Create semantic periods ("MATS Prep" not just "January")
- Expand/collapse to manage complexity

## Motivation

### User Needs
1. **Flexible Planning**: Research doesn't follow calendar weeks
2. **Application Tracking**: Deadlines for MATS, fellowships, conferences
3. **Learning Pacing**: Sustainable progress without burnout
4. **Personal Structure**: Everyone plans differently
5. **Project Management**: Research sprints, writing phases, etc.

### Why This Over Traditional Tools?
- **No Imposed Structure**: You define what a "phase" means
- **Learning-Focused**: Built for research/study, not meetings
- **Semantic Time**: "Deep Dive Week" more meaningful than "Week 3"
- **Growth-Oriented**: Structure evolves with understanding

## Design

### Core Interaction Flow

1. **Start Empty**
   ```
   [+ Add Time Block]
   ```

2. **User Creates First Block**
   ```
   Create new time block:
   Name: [MATS Application Sprint]
   Type: ○ Day ○ Week ● Sprint ○ Custom: [____]
   ```

3. **Build Hierarchy**
   ```
   ▼ MATS Application Sprint
     ▼ Research Phase (3 days)
       ├─ Day 1: Review all mentors
       ├─ Day 2: Read mentor papers
       └─ Day 3: Shortlist matches
     ▼ Writing Phase
       [+ Add Time Block]
     [+ Add Time Block]
   ```

### Data Model

```typescript
interface TimeBlock {
  id: string
  name: string              // User-defined: "Deep Dive Week"
  type: TimeBlockType       // 'day' | 'week' | 'sprint' | 'phase' | 'custom'
  customType?: string       // If type is 'custom'
  parentId: string | null
  children: TimeBlock[]
  position: number          // Order within parent
  collapsed: boolean
  metadata: {
    emoji?: string          // 🎯, 📚, 🧪
    color?: string          // For visual distinction
    duration?: string       // "3 days", "2 weeks" (optional)
    deadline?: Date         // For time-sensitive blocks
  }
  items: TimelineItem[]
}

interface TimelineItem {
  id: string
  blockId: string           // Which time block this belongs to
  type: 'task' | 'deadline' | 'milestone' | 'note'
  title: string
  description?: string
  completed: boolean
  relatedTopics?: string[]  // Link to learning content
  url?: string              // For applications, resources
  reminder?: {
    type: 'before' | 'on'
    amount: number
    unit: 'hours' | 'days' | 'weeks'
  }
}

enum TimeBlockType {
  DAY = 'day',
  WEEK = 'week', 
  SPRINT = 'sprint',
  PHASE = 'phase',
  MONTH = 'month',
  QUARTER = 'quarter',
  CUSTOM = 'custom'
}
```

### UI Components

```tsx
// Main timeline view
<DynamicTimeline>
  <TimeBlock 
    id="mats-prep"
    name="MATS Application Sprint"
    type="sprint"
  >
    <TimeBlock 
      id="research-phase"
      name="Research Phase"
      type="phase"
      duration="3 days"
    >
      <TimelineItem type="task" title="Review all mentors" />
      <TimelineItem type="task" title="Read key papers" />
    </TimeBlock>
  </TimeBlock>
  
  <AddTimeBlockButton />
</DynamicTimeline>
```

### Key Features

1. **Flexible Hierarchy**
   - Any level can contain any other level
   - No forced week→month→year structure
   - Custom time units ("Sprint", "Deep Dive", "Recovery")

2. **Smart Templates**
   - Save successful structures
   - Share with community
   - "MATS Prep Template", "Paper Writing Sprint"

3. **Progress Tracking**
   - Completion rolls up through hierarchy
   - Visual progress indicators
   - Time spent vs. planned

4. **Deadline Integration**
   - Pull from entities database
   - Attach to any time block
   - Smart reminders based on hierarchy

5. **Export/Import**
   - Share timeline structures
   - Export to traditional calendar
   - Backup/restore timelines

## Implementation Plan

### Phase 1: Core Hierarchy (MVP)
- Basic time block creation
- Nesting and reordering
- Simple item management
- Local storage only

### Phase 2: Integration
- Connect to topics/progress
- Pull deadlines from entities
- Basic templates
- User accounts

### Phase 3: Intelligence
- Suggested structures based on goals
- Pacing recommendations
- Overcommitment warnings
- Community templates

### Phase 4: Collaboration
- Share timelines with mentors
- Team/cohort views
- Commenting on blocks
- Public timeline gallery

## Database Schema

```sql
-- Time blocks table
CREATE TABLE time_blocks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  parent_id TEXT REFERENCES time_blocks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  custom_type TEXT,
  position INTEGER NOT NULL,
  collapsed BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timeline items within blocks
CREATE TABLE timeline_items (
  id TEXT PRIMARY KEY,
  block_id TEXT REFERENCES time_blocks(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  related_topics JSONB,
  url TEXT,
  reminder JSONB,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved templates
CREATE TABLE timeline_templates (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  structure JSONB NOT NULL, -- Serialized time block hierarchy
  is_public BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_time_blocks_user_parent ON time_blocks(user_id, parent_id);
CREATE INDEX idx_timeline_items_block ON timeline_items(block_id);
CREATE INDEX idx_timeline_items_completed ON timeline_items(completed);
```

## Example Use Cases

### 1. Fellowship Application
```
▼ MATS 2025 Application
  ▼ Preparation (1 week)
    ├─ Day 1-2: Research mentors
    ├─ Day 3-4: Read key papers
    └─ Day 5-7: Outline ideas
  ▼ Writing Sprint (5 days)
    ├─ Monday: Draft research proposal
    ├─ Tuesday-Wednesday: Personal statement
    ├─ Thursday: Revisions
    └─ Friday: Final review
  ▼ Submission Day
    └─ Submit by 11:59 PM PST ⚠️
```

### 2. Research Project
```
▼ Interpretability Research Sprint
  ▼ Literature Review Phase
    ▼ Week 1: Foundational Papers
    ▼ Week 2: Recent Advances
  ▼ Experimentation Phase
    ▼ Setup Sprint (3 days)
    ▼ Main Experiments (2 weeks)
    ▼ Analysis Week
  ▼ Writing Phase
    [Structure to be determined]
```

### 3. Self-Paced Learning
```
▼ AI Safety Fundamentals Journey
  ▼ Orientation
    ├─ Day 1: Why AI Safety
    ├─ Day 2: Risk Landscape
    └─ Choose Focus Area
  ▼ Technical Foundations
    ▼ Math Refresher (flexible)
    ▼ ML Basics Sprint (2 weeks)
  ▼ First Deep Dive
    [Plan after foundations complete]
```

## Success Metrics

1. **Adoption**: Users creating custom structures (not just using defaults)
2. **Retention**: Continued use over multiple months
3. **Completion**: % of planned items completed
4. **Structure Evolution**: How timelines change over time
5. **Template Sharing**: Community engagement

## Risks and Mitigations

### Risk: Over-Complexity
**Mitigation**: Strong defaults, templates, progressive disclosure

### Risk: Analysis Paralysis
**Mitigation**: "Quick start" templates, AI suggestions

### Risk: Abandonment
**Mitigation**: Low friction, email reminders, progress celebration

## Connection to Project Mission

This tool embodies key principles:
- **User Agency**: You control your learning structure
- **Anti-Manipulation**: No AI telling you what/when to learn
- **Sustainable Progress**: Encourages healthy pacing
- **Community Learning**: Share successful patterns

## Technical Considerations

- **Performance**: Lazy load deep hierarchies
- **Offline**: Local-first with sync
- **Mobile**: Responsive design essential
- **Undo/Redo**: For structural changes
- **Search**: Find items across all blocks

## Next Steps

1. Build MVP with core hierarchy features
2. User testing with 5-10 AI safety researchers  
3. Iterate based on feedback
4. Add integration features
5. Launch to community

## Decision

**Recommendation**: Proceed with Phase 1 implementation. This feature offers unique value for AI safety researchers and aligns with project values of user agency and sustainable learning.