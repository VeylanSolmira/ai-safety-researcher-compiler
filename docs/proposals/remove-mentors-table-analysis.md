# Analysis: Removing the Mentors Table

## Current State

### Database Structure
1. **mentors table**: Contains 24 mentors with fields like name, organization_id, biography, etc.
2. **entities table**: Contains 57 researchers (type='researcher'), which includes some/all mentors
3. **Related tables that reference mentors**:
   - `mentor_qualifications` (foreign key to mentors.id)
   - `mentor_research_areas` (foreign key to mentors.id)
   - `mentor_research_topics` (foreign key to mentors.id)
   - `mentor_topics` (foreign key to mentors.id) - This is the main junction table linking mentors to topics
4. **View**: `v_mentor_details` depends on the mentors table

### Code Usage
The mentors table is actively used in:
1. **API Routes**:
   - `/api/mentors` - Lists all mentors with their details
   - `/api/mentors/[mentorId]` - Gets a specific mentor
   - `/api/topics/[topicId]/mentors` - Gets mentors for a specific topic

2. **Database Queries**:
   - `lib/db/mentor-queries.ts` - Contains helper functions for mentor data
   - `lib/api/journey.ts` - Uses mentor_topics to show mentors on topic pages

3. **Components**:
   - Topic pages display mentor information through the mentor_topics junction table

## Migration Status
According to the consolidation plan in `docs/proposals/consolidate-entities-migration.md`:
- 19 researchers from mentors were already migrated to entities
- The entities table is intended to be the single source of truth
- However, the mentors table is still actively used

### Current Data Status
- **mentors table**: 24 entries
- **entities table**: 57 researchers (includes 23 of the 24 mentors)
- **Missing**: Only 1 mentor not in entities: `adria-garriga-alonso-mats` (which is a duplicate of `adria-garriga-alonso` already in entities)

## Issues with Removing Mentors Table

1. **Active Dependencies**: 
   - 3 API routes directly query the mentors table
   - The mentor_topics junction table is crucial for showing which mentors work on which topics
   - The v_mentor_details view would break

2. **Data Loss Risk**:
   - mentor-specific fields (biography, quick_eval_rating, quick_eval_notes) may not exist in entities
   - The relationship between mentors and topics (mentor_topics table) would be lost

3. **Functionality Impact**:
   - Topic pages currently show relevant CBAI 2025 Fellowship mentors
   - This feature would break without the mentor_topics table

## Important Data to Preserve

The mentors table contains evaluation data that needs to be migrated:
- `quick_eval_rating`: Ratings like "8-9/10", "6/10", etc.
- `quick_eval_notes`: Additional evaluation notes
- These fields appear to be used for CBAI Fellowship mentor evaluations

## Recommended Approach

### Option 1: Complete Migration (Recommended)
1. **Migrate remaining data**:
   - Ensure all 24 mentors exist in entities table with type='researcher'
   - Migrate mentor-specific fields to entities.properties JSON field
   - Create entity_topics junction table to replace mentor_topics

2. **Update code**:
   - Update all API routes to query entities instead of mentors
   - Update mentor-queries.ts to use entities table
   - Update journey.ts to use entity_topics instead of mentor_topics

3. **Database changes**:
   - Create entity_topics table with same structure as mentor_topics
   - Migrate data from mentor_topics to entity_topics
   - Drop the view v_mentor_details
   - Drop tables: mentor_qualifications, mentor_research_areas, mentor_research_topics, mentor_topics
   - Finally drop mentors table

### Option 2: Keep Minimal Structure
- Keep mentor_topics as a junction table but reference entities.id instead
- Drop the mentors table but keep the relationship data
- Less work but maintains some legacy structure

## Decision Needed
Before proceeding, we need to decide:
1. Should we fully migrate to entities (Option 1) or keep minimal structure (Option 2)?
2. How to handle mentor-specific fields in the entities structure?
3. Timeline for updating all dependent code?

## Next Steps
1. Verify all 24 mentors exist in entities table
2. Design entity_topics table schema
3. Create migration script
4. Update all API routes and queries
5. Test thoroughly before dropping tables