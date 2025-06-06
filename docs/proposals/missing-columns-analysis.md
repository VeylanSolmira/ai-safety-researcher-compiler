# Missing Database Columns Analysis

## Summary

The journey pages are expecting columns that don't exist in the database schema. This is causing issues where data is being hardcoded as empty arrays/values instead of being fetched from the database.

## Missing Columns

### 1. Module Table
- **Missing**: `learning_objectives` (expected as array/JSON)
- **Missing**: `practical_components` (expected as array/JSON)
- **Current columns**: id, tier_id, title, description, estimated_time, assessment_type, position, created_at, updated_at

### 2. Topic Table  
- **Missing**: Direct `tags` column
- **Note**: There is a `topic_tags` table, but it references "topics_old" table (legacy)
- **Current columns**: id, module_id, title, description, estimated_time, difficulty, roadmap_content_id, content_academic, content_personal, has_journey_extras, has_interactive_transition, assessment_id, position, created_at, updated_at

## Code References

### 1. Module Page Hardcoding (`app/journey/[tierId]/[moduleId]/page.tsx`)
```typescript
// Lines 115-116: Hardcoded empty arrays
learningObjectives: [],
practicalComponents: [],

// Line 124: Hardcoded empty tags array
tags: []
```

### 2. Tags Display Logic
The module page has UI components expecting tags (lines 268-276), but they'll never display because tags are always an empty array.

### 3. Journey Queries (`lib/db/journey-queries.ts`)
The journey queries file DOES attempt to fetch tags from `topic_tags` table (lines 23-27), but this isn't being used in the actual page components.

## Schema Comparison

Both `journey-dev.db` and `journey-public.db` have identical schemas for the topics and modules tables - neither has the missing columns.

## Recommendations

### Option 1: Add Missing Columns (Recommended)
Add the missing columns to the database schema:
```sql
-- Add to modules table
ALTER TABLE modules ADD COLUMN learning_objectives TEXT; -- Store as JSON
ALTER TABLE modules ADD COLUMN practical_components TEXT; -- Store as JSON

-- Fix topic_tags table reference
CREATE TABLE topic_tags_new (
    topic_id TEXT REFERENCES topics(id),
    tag TEXT NOT NULL,
    PRIMARY KEY (topic_id, tag)
);
-- Migrate data if any exists
-- DROP old table and rename new
```

### Option 2: Update Code to Match Current Schema
- Remove references to `learningObjectives` and `practicalComponents` from the UI
- Properly implement tag fetching using the existing `topic_tags` table
- Update the module page to use the journey-queries functions

### Option 3: Use Existing Content Fields
- Store learning objectives and practical components within the existing `description` field using markdown sections
- Parse these sections when displaying

## Next Steps

1. Decide which approach to take
2. If adding columns, create a migration script
3. Update the TypeScript types in `lib/db/types.ts`
4. Update the page components to properly fetch and display the data
5. Ensure both dev and production databases are updated

## Related Issues

- The `topic_tags` table references "topics_old" which suggests there was a table rename that wasn't fully completed
- The `roadmap_content_id` field is marked as legacy in CLAUDE.md but still exists in the schema