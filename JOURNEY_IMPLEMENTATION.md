# 🎮 Interactive Journey Feature

An interactive, game-like learning experience for AI Safety Research with exploration elements and a mix of building (60-70%) and learning (30-40%) activities.

## Overview

The Journey feature transforms the AI Safety Research Compiler from a static roadmap into an interactive adventure where users progress through content like exploring a land. Some sections are mandatory (linear navigation), while others offer open-world exploration where users choose their own path.

## Current Implementation (MVP)

### Key Components

1. **Journey Button** (`components/RoadmapViewer.tsx`)
   - Added "Start Journey" button in top-right corner of roadmap
   - Routes to `/journey` when clicked
   - Styled with blue gradient and arrow icon

2. **Journey Overview Page** (`app/journey/page.tsx`)
   - Entry point to the journey system
   - Shows current progress and completed sections
   - Displays journey overview with Build vs Learn split
   - "Start Journey" or "Continue Journey" based on progress

3. **Dynamic Section Pages** (`app/journey/[sectionId]/page.tsx`)
   - Handles both linear and open-world section types
   - Shows section content with appropriate UI based on type
   - Manages navigation between sections
   - Tracks completion and choices

4. **Journey State Management** (`lib/journey.ts`)
   - Defines journey structure and section types
   - Manages progress persistence in localStorage
   - Handles section prerequisites and unlocking logic
   - Tracks user choices in open-world sections

### Data Structure

```typescript
interface JourneySection {
  id: string
  title: string
  type: 'linear' | 'open-world'
  contentType: 'build' | 'learn' | 'mixed'
  description: string
  estimatedTime: string
  prerequisites: string[]
  unlocks: string[]
}

interface JourneyProgress {
  currentSection: string
  sectionsCompleted: string[]
  sectionsStarted: string[]
  choices: Record<string, any>
  lastUpdated: string
}
```

### Journey Flow (MVP)

```
Introduction (Linear)
    ↓
Fundamentals Hub (Open-World)
    ├── Build First Tool (Linear)
    ├── Explore Alignment (Linear)
    └── Study Risks (Linear)
              ↓
    Intermediate Hub (Open-World)
```

### Key Features

- **Mixed Content Types**: 
  - 🔨 Build: Hands-on project creation
  - 📚 Learn: Conceptual understanding
  - 🎯 Mixed: Combination of both

- **Two Navigation Modes**:
  - **Linear**: Sequential progression through mandatory content
  - **Open-World**: Choose your own path through available options

- **Progress Tracking**: 
  - Persists in local
  - Tracks completed and started sections
  - Remembers choices in open-world sections

- **Visual Feedback**: 
  - Color-coded content types
  - Progress indicators
  - Estimated time for each section

## Usage

1. Click "Start Journey" button on the roadmap
2. Begin with the Introduction section
3. Progress through linear sections or make choices in open-world hubs
4. Complete sections to unlock new content
5. Return to journey overview to see overall progress

## Future Enhancements

### Content Development
- [ ] Create actual content for each section (currently placeholders)
- [ ] Develop interactive code editors for build sections
- [ ] Design quizzes and assessments for learn sections
- [ ] Add real AI safety projects and exercises

### Features
- [ ] Achievement/badge system for completing sections
- [ ] Save points within longer sections
- [ ] Branching storylines based on user choices
- [X] Difficulty levels (beginner/intermediate/advanced paths)
- [ ] Time tracking and study streaks
- [ ] Collaborative features (share progress, compete with others)

### Technical Improvements
- [ ] Backend integration for user authentication
- [ ] Cloud storage for progress (currently localStorage only)
- [ ] Analytics to track learning patterns
- [ ] Mobile-responsive journey interface
- [ ] Offline support for content access

### Content Expansion
- [ ] More diverse open-world hubs
- [ ] Side quests for optional deep dives
- [ ] Boss challenges (major projects)
- [ ] Hidden content/easter eggs
- [ ] Community-contributed sections

## Development Guidelines

### Adding New Sections

1. Add section definition to `journeySections` array in `lib/journey.ts`
2. Define prerequisites and what it unlocks
3. Choose appropriate type (linear/open-world) and content type
4. Create content in the section page component

### Content Type Balance

Maintain the 60-70% build vs 30-40% learn ratio:
- Build sections: Practical implementations, tools, projects
- Learn sections: Theory, concepts, case studies
- Mixed sections: Combine theory with immediate practice

### Navigation Design

- Linear sections: Use for foundational concepts that build on each other
- Open-world hubs: Place after completing a set of prerequisites
- Always provide clear indication of section type and expected time

## Technical Stack

- Next.js App Router for routing
- React hooks for state management
- localStorage for progress persistence
- TypeScript for type safety
- Tailwind CSS for styling