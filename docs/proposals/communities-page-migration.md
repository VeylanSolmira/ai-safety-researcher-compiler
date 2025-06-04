# Communities Page Migration Plan

## Current State
1. **Static data in component** - Hardcoded `communitiesStaticData` array
2. **Mock API** - Returns hardcoded data from `community-profiles-queries.ts`
3. **Duplicated data** - Same entities exist in multiple places

## Target State
1. **Single source** - All data from entities table
2. **Real API** - Query entities table for all types
3. **No static data** - Component fetches everything from API

## Migration Steps

### 1. Update API route to use entities table
- Modify `/api/community-profiles/route.ts` to query entities
- Return all entity types (researchers, organizations, platforms)

### 2. Update communities page component
- Remove `communitiesStaticData` 
- Fetch all entities from API
- Map entity types to UI types:
  - 'researcher' → 'researcher'
  - 'organization' → 'organization' or 'lab'
  - 'platform' → 'community' or 'forum'

### 3. Clean up
- Delete `lib/community-profiles.ts` (TypeScript profiles)
- Delete `lib/db/community-profiles-queries.ts` (mock data)

## Benefits
- Single source of truth (entities table)
- No more data duplication
- Easy to add/edit entities in one place
- Consistent data across the app