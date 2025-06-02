# View Mode Implementation Summary

## Overview
Successfully implemented a dual-view mode system for the AI Safety Research Compiler:
- **Academic/Neutral View**: Standard, objective content about AI safety
- **Personal/Opinionated View**: Includes personal perspectives and controversial topics

## Key Components

### 1. ViewModeContext (`/contexts/ViewModeContext.tsx`)
- Global state management for view mode
- Persists selection in localStorage
- Provides `viewMode`, `setViewMode`, and `isPersonalMode`

### 2. ViewModeToggle (`/components/ViewModeToggle.tsx`)
- Toggle switch in the header
- Shows "🎓 Academic" and "💭 Personal" labels
- Uses amber color (#f59e0b) for personal mode

### 3. RoadmapViewer Updates
- Filters nodes based on `viewMode` property
- Shows only nodes marked for current mode or "both"
- Adds visual indicators (amber ring and 💭 badge) for opinionated content
- Filters edges to maintain graph integrity

### 4. TopicContent Updates
- Loads different content files based on view mode
- Supports `.personal.md` file variants
- Shows "Personal perspective" indicator

### 5. API Route Updates
- `/api/topic-content` now accepts `viewMode` parameter
- Prioritizes personal content files when in personal mode
- Falls back to standard content if no personal version exists

## Data Structure

### Node Properties
```json
{
  "data": {
    "viewMode": "both" | "academic" | "personal",
    "isOpinionated": true | false
  }
}
```

### Example Nodes
- **Personal-only**: "disrupting-research-subtopic" (viewMode: "personal")
- **Opinionated in both**: "neel-nanda-subtopic", "yoshua-bengio-subtopic"

## Content Files
- Standard: `topic-name@topic-id.md`
- Personal: `topic-name@topic-id.personal.md`

## Visual Styling
- Amber color scheme for personal/opinionated content
- Ring effect on opinionated nodes
- 💭 emoji badge for quick identification
- Consistent color: `#f59e0b` (amber-500)

## Usage
1. Toggle between modes using the switch in the header
2. In personal mode:
   - See additional topics (like "Disrupting AI Safety Research")
   - View personal takes on standard topics
   - Identify opinionated content via visual indicators
3. In academic mode:
   - See only neutral, field-standard content
   - No opinion markers or personal content

## Future Enhancements
- Add more personal content files
- Implement content warnings for controversial topics
- Add user preferences for default mode
- Create author attribution for personal views