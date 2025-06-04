# TypeScript Data Files Status Report

## Current Situation

All data has been successfully migrated to the database, BUT the TypeScript files still contain the original hardcoded data and are actively being used by the application.

## Status of Each File

### 1. **lib/experiments.ts**
- **Status**: Still contains hardcoded data (2 experiments)
- **Migration**: ✅ Data migrated to `experiments` table
- **API**: ✅ Available at `/api/experiments`
- **Usage**: Still imported by journey pages
- **Note**: Has deprecation comment but still provides fallback functions

### 2. **lib/explorations.ts**
- **Status**: Still contains hardcoded data (4 explorations)
- **Migration**: ✅ Data migrated to `explorations` table
- **API**: ✅ Available at `/api/explorations`
- **Usage**: Still imported by journey pages

### 3. **lib/case-studies.ts**
- **Status**: Still contains hardcoded data (1 case study)
- **Migration**: ✅ Data migrated to `case_studies` table
- **API**: ✅ Available at `/api/case-studies`
- **Usage**: ✅ UPDATED - resources pages now use database/API

### 4. **lib/news.ts**
- **Status**: Still contains hardcoded data (5 news items)
- **Migration**: ✅ Data migrated to `news` table
- **API**: ✅ Available at `/api/news`
- **Usage**: ✅ UPDATED - news pages now use database/API

### 5. **lib/ideas-lab.ts**
- **Status**: Still contains hardcoded data (5 ideas)
- **Migration**: ✅ Data migrated to `ideas` table
- **API**: ✅ Available at `/api/ideas`
- **Usage**: ✅ UPDATED - ideas lab page now uses database/API

### 6. **lib/community-profiles.ts**
- **Status**: Still contains hardcoded data (5 profiles)
- **Migration**: ✅ Data migrated to `community_profiles` table
- **API**: ✅ Available at `/api/community-profiles`
- **Usage**: ⚠️ PARTIALLY UPDATED - communities listing page uses API for profile check

### 7. **lib/course-highlights.ts**
- **Status**: Still contains hardcoded data (7 highlights)
- **Migration**: ✅ Data migrated to `course_highlights` table
- **API**: ✅ Available at `/api/course-highlights`
- **Usage**: ✅ UPDATED - highlights page now uses database/API

### 8. **lib/external-resources.ts**
- **Status**: Still contains configuration data
- **Migration**: ✅ Data migrated to `external_resources` table
- **API**: ❌ No API created yet
- **Usage**: Still imported by multiple components

### 9. **lib/prompts.ts**
- **Status**: Still contains prompt templates
- **Migration**: ✅ Data migrated to `ai_prompts` table
- **API**: ❌ No API created yet
- **Usage**: Still imported by UnifiedAIAssistant

### 10. **lib/resources/cbai-2025-mentors.ts**
- **Status**: Still contains full mentor data
- **Migration**: ⚠️ Partial - only mentor-topic mappings migrated
- **API**: ❌ No API created
- **Usage**: Not directly imported by pages

## Why This Matters

1. **Dual Source of Truth**: Data exists in both TypeScript files AND database
2. **No Performance Benefits Yet**: Still loading from bundled JS files
3. **Content Updates Still Require Rebuilds**: Changes to TS files need app rebuild
4. **Potential Data Drift**: Risk of database and TS files getting out of sync

## Required Actions

### Phase 1: Update Components to Use APIs (High Priority)
1. Update all page components to fetch from APIs instead of importing TS files
2. Convert client components to use fetch() or SWR/React Query
3. Convert server components to use database query functions

### Phase 2: Create Missing APIs
1. ✅ Community profiles API endpoints (DONE)
2. ✅ Course highlights API endpoints (DONE)
3. External resources API endpoints
4. AI prompts API endpoints

### Phase 3: Deprecate TypeScript Files
1. Add clear deprecation warnings to all TS data files
2. Remove hardcoded data after verification period
3. Keep only type definitions and utility functions

### Phase 4: Complete Mentor Migration
1. Create full `mentors` and `organizations` tables
2. Migrate complete mentor data (not just mappings)
3. Create mentor API endpoints

## Example Migration Pattern

### Current (Bad):
```typescript
// In a page component
import { getCaseStudy } from '@/lib/case-studies';

const caseStudy = await getCaseStudy(id);
```

### Should Be (Good):
```typescript
// Client Component
const response = await fetch(`/api/case-studies/${id}`);
const caseStudy = await response.json();

// OR Server Component
import { getCaseStudy } from '@/lib/db/case-studies-queries';
const caseStudy = getCaseStudy(id);
```

## Conclusion

While the database migration is technically complete, the application is not yet benefiting from it. The TypeScript files remain the active source of data, defeating the purpose of the migration. Immediate action is needed to update components to use the database-backed APIs and query functions.