# Consolidate All Entities Migration Plan

## Current State

### Data Sources
1. **entities table** (already has):
   - 19 researchers (from mentors)
   - 10 organizations
   
2. **community_profiles table** (needs migration):
   - 4 individuals: Neel Nanda, Paul Christiano, Eliezer Yudkowsky, Stuart Russell
   - 1 organization: Anthropic (might be duplicate)

3. **TypeScript files** (needs migration):
   - `lib/community-profiles.ts` - Contains platform data (LessWrong, EA Forum, etc.)
   - Various other TS files with static entity data

## Migration Steps

### Step 1: Migrate community_profiles table
- Neel Nanda, Paul Christiano, Eliezer Yudkowsky, Stuart Russell → type: 'researcher'
- Anthropic → Check if duplicate, if not → type: 'organization'

### Step 2: Import TypeScript platforms
- LessWrong, Alignment Forum, EA Forum → type: 'platform'
- Any other community platforms from TS files

### Step 3: Clean up
- Drop community_profiles table
- Remove/deprecate TypeScript files
- Update all imports to use database queries

## Benefits
- Single source of truth for all entities
- Consistent data structure
- Easier to maintain and query
- No more sync issues between TS and DB

## Migration Results

### Completed ✅
1. **Migrated from community_profiles table**:
   - 4 researchers: Neel Nanda, Paul Christiano, Eliezer Yudkowsky, Stuart Russell
   - Skipped Anthropic (already existed in entities)

2. **Added platform entities**:
   - LessWrong
   - Alignment Forum  
   - EA Forum

3. **Final entity counts**:
   - 23 researchers (19 original + 4 from community_profiles)
   - 10 organizations
   - 3 platforms

4. **Cleanup**:
   - Dropped community_profiles table ✅
   - TypeScript files can now be deprecated

### Total: 36 entities in unified system