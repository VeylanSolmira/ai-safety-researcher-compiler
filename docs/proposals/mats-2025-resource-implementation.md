# MATS 2025 Resource Implementation Proposal

## Overview
Implementation plan for adding MATS (Machine Learning Alignment & Theory Scholars) 2025 Summer Program as an external resource, following the new entities table structure.

## Current State
- CBAI Fellowship exists as an external resource with TypeScript data files
- New unified entities table structure is implemented
- Entities table contains researchers, organizations, and platforms
- Entity-topics relationships are managed through entity_topics table

## Data Gathered from MATS Website

### Available Information
1. **4 Confirmed Mentors for Summer 2025**:
   - Buck Shlegeris (Redwood Research) - Control, Red-teaming, Alignment evals/demos
   - Adrià Garriga-Alonso (FAR AI) - Mechanistic interpretability  
   - Eli Lifland (AI Futures Project) - AI governance, policy, National security
   - Ethan Perez (Anthropic) - AI control, red-teaming, scalable oversight

2. **Program Details**:
   - Duration: 10 weeks (June 16 - August 22, 2025)
   - Location: Berkeley, California
   - 6 research tracks: Oversight & Control, Evaluations, Interpretability, Governance & Strategy, Agency, Security

3. **Organization Info**:
   - 501(c)(3) public charity
   - Funded by: Open Philanthropy, Survival and Flourishing Fund, Foresight Institute, etc.
   - 361 scholars supported since late 2021

## Implementation Design

### 1. Database Entries (entities table)

#### Researchers (type: 'researcher')
```json
{
  "id": "buck-shlegeris-mats",
  "name": "Buck Shlegeris", 
  "type": "researcher",
  "description": "MATS 2025 mentor focusing on AI control, red-teaming, and alignment evaluations/demos",
  "tags": ["ai-safety", "control", "red-teaming", "mats-mentor-2025"],
  "properties": {
    "organization": "Redwood Research",
    "location": "SF Bay Area",
    "mentorshipProgram": "MATS Summer 2025",
    "researchFocus": "Control, Red-teaming, Alignment evals/demos",
    "track": "Oversight/control"
  }
}
```

#### Organizations (type: 'organization')
```json
{
  "id": "mats-program",
  "name": "MATS (Machine Learning Alignment & Theory Scholars)",
  "type": "organization",
  "description": "Independent research and educational seminar program for AI alignment, connecting scholars with top mentors",
  "tags": ["educational-program", "ai-safety", "mentorship", "berkeley"],
  "properties": {
    "website": "https://matsprogram.org",
    "legalStatus": "501(c)(3) public charity",
    "founded": "2021",
    "location": "Berkeley, California",
    "alumniCount": 361,
    "mentorCount": 75,
    "programDuration": "10 weeks",
    "fundingSources": ["Open Philanthropy", "Survival and Flourishing Fund", "Foresight Institute"]
  }
}
```

### 2. Entity-Topic Relationships (entity_topics table)
Link MATS entities to relevant journey topics:
- buck-shlegeris-mats → control-subtopic (relationship_type: 'mentors-on')
- adria-garriga-alonso-mats → mechanistic-interp (relationship_type: 'mentors-on')
- eli-lifland-mats → policy-analysis-subtopic (relationship_type: 'mentors-on')
- mats-program → various alignment topics (relationship_type: 'provides-training')

### 3. External Resource Page
Create `/app/resources/external/mats-2025/page.tsx` similar to CBAI structure

### 4. API Integration
Use existing `/api/entities/` endpoints to fetch MATS data dynamically

## Implementation Steps

### Phase 1: Database Population ✅ COMPLETE
1. ✅ Created script to insert MATS entities into database
2. ✅ Created 10 entity-topic relationships
3. ✅ Verified data integrity - 7 entities added (1 MATS org, 2 supporting orgs, 4 mentors)
4. ✅ Updated all mentors with generic "mentor" tag and isMentor property

### Phase 2: UI Implementation ✅ COMPLETE
1. ✅ Created MATS resource page at `/resources/external/mats-2025`
2. ✅ Added navigation from main external resources page
3. ✅ Implemented expandable mentor cards with related topics

### Phase 3: API Integration ✅ COMPLETE
1. ✅ Entity API endpoints work with MATS data
2. ✅ Used existing entity-topics endpoints

### Phase 4: Future Updates 🔄
Structure allows easy updates:
- Add new mentors as entities
- Update properties JSON with new information
- Add new entity-topic relationships
- All changes reflected immediately in UI

## Benefits of This Approach
1. **Consistent with new architecture** - Uses entities table instead of separate TypeScript files
2. **Easy to update** - Just update database records when new info available
3. **Searchable** - Tags allow finding MATS-related content easily
4. **Extensible** - Properties JSON can hold any additional metadata
5. **Integrated** - Links to journey topics through entity_topics table

## Implementation Summary

### What Was Created
1. **Database Entities**:
   - 7 new entities (1 MATS org, 2 supporting orgs, 4 mentors)
   - All mentors tagged with both specific "mats-mentor-2025" and generic "mentor" tags
   - Added `isMentor: true` property to all mentor entities (MATS and CBAI)

2. **UI Components**:
   - `/app/resources/external/mats-2025/page.tsx` - Dedicated MATS page
   - Added MATS card to external resources landing page
   - Expandable mentor profiles with organization and research details
   - Links to related journey topics

3. **Easy Update Path**:
   - Simply run `scripts/add-mats-2025-entities.ts` with new mentor data
   - Or use API endpoints to add/update entities
   - All changes immediately reflected in UI

## Next Steps for Additional Information
When you gather more information from the MATS website:
1. Add new mentors to the `matsMentors` array in the script
2. Update organization details in the properties
3. Add more specific research topics and relationships
4. Consider adding alumni success stories as separate entities

---
*Created: January 2025 - Initial proposal and implementation for MATS 2025 resource*
*Updated: January 2025 - Completed implementation with mentor tagging improvements*