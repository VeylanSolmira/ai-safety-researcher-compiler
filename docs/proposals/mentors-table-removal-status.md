# Mentors Table Removal Status Report

## Executive Summary

The mentors table removal is **partially complete**. While the data has been successfully migrated to the entities system, the old tables still exist and are actively used by several API routes.

## Current State

### Database Tables

#### Still Existing (Not Removed)
- **mentors** table: 24 entries
- **mentor_topics** table: 49 relationships 
- **mentor_research_topics** table
- **mentor_research_areas** table
- **mentor_qualifications** table
- **v_mentor_details** view

#### Successfully Created
- **entities** table: 115 total (58 researchers, 33 organizations, 24 platforms)
- **entity_topics** table: 139 relationships (109 for researchers)
- **v_mentors_from_entities** view (for backward compatibility)

### Migration Status

✅ **Completed**:
1. All 24 mentors migrated to entities table as 'researcher' type
2. Entity_topics table created with all mentor-topic relationships
3. Backward compatibility view created
4. Migration scripts exist (`cleanup-old-mentor-tables.ts`)

❌ **Not Completed**:
1. Old mentor tables NOT dropped
2. API routes still query mentors table directly
3. No deprecation warnings added
4. Some components still expect mentor structure

### Active Dependencies

#### API Routes Still Using Mentors Table
1. `/api/mentors/route.ts` - Queries mentors table directly
2. `/api/mentors/[mentorId]/route.ts` - Queries mentors table directly
3. `/api/topics/[topicId]/mentors/route.ts` - Dual support (checks both tables)

#### Code Using Mentor Tables
1. `lib/api/journey.ts` - Uses mentor_topics for topic pages
2. `lib/db/mentor-queries.ts` - Helper functions for mentor data
3. Various components expecting mentor data structure

## Why Tables Haven't Been Removed

1. **Active Usage**: Multiple API routes still query the mentors table
2. **Risk Aversion**: Fear of breaking existing functionality
3. **Incomplete Migration**: Not all code updated to use entities
4. **Data Validation**: Need to ensure all relationships preserved

## What Needs to Be Done

### Phase 1: Update API Routes
1. Update `/api/mentors/route.ts` to query entities table
2. Update `/api/mentors/[mentorId]/route.ts` to use entities
3. Remove dual table support from `/api/topics/[topicId]/mentors/route.ts`

### Phase 2: Update Code References
1. Update `lib/api/journey.ts` to use entity_topics
2. Update or remove `lib/db/mentor-queries.ts`
3. Update any components using mentor data

### Phase 3: Run Cleanup Script
1. Create fresh database backup
2. Run `npx tsx scripts/cleanup-old-mentor-tables.ts --confirm`
3. Verify all functionality still works

### Phase 4: Clean Up
1. Remove migration scripts
2. Update documentation
3. Remove backward compatibility code

## Risk Assessment

**Low Risk**:
- Data is already migrated
- Backward compatibility exists
- Can rollback from backup

**Medium Risk**:
- Some API routes may break if not properly updated
- UI components may need adjustment

**High Risk**:
- None identified - migration path is clear

## Recommendation

**Proceed with removal** but follow the phased approach:
1. First update all API routes (test each one)
2. Then update internal code references
3. Finally run the cleanup script
4. Keep backup for at least 1 week after removal

## Timeline Estimate

- Phase 1: 1-2 hours (update APIs)
- Phase 2: 1-2 hours (update code)
- Phase 3: 30 minutes (run cleanup)
- Phase 4: 30 minutes (documentation)

**Total: 3-5 hours of focused work**

## Next Immediate Step

Start with updating `/api/mentors/route.ts` to query the entities table instead of mentors table. This is the safest first step to validate the approach.

---
*Created: January 3, 2025*