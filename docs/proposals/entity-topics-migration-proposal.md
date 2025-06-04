# Entity Topics Migration Proposal

## Current State Analysis

### What Exists Now
1. **mentor_topics table** - Links mentors to topics with descriptions
   - Schema: mentor_id, topic_id, mentor_topic_description (all part of primary key)
   - Contains 49 mentor-topic mappings
   
2. **Separate entity tables**:
   - `mentors` - Individual researchers/experts
   - `organizations` - Research organizations
   - `community_profiles` - Community resources/platforms
   - `research_topics` - Topics (the target of relationships)

3. **API routes expecting unified structure**:
   - `/api/entities/` routes already exist but expect tables that don't exist yet
   - This suggests the unified design was planned but not implemented

### Migration Scripts Ready but Not Executed
1. `create-unified-entities-table.ts` - Would create the initial entities table
2. `update-entity-topics-migration.ts` - Would rename mentor_topics to entity_topics
3. `create-unified-entities-migration.ts` - Comprehensive migration to unified system

## Proposed Design/Architecture

### Unified Entities System
The design consolidates all entity types (individuals, organizations, platforms) into a single flexible system:

1. **entities table**:
   - `id`: Primary key
   - `type`: 'researcher' | 'organization' | 'platform'
   - `name`: Entity name
   - `description`: Entity description
   - `tags`: JSON array for searchable categorization
   - `properties`: JSON object for all type-specific data and features
   - `personal_note`: Text field for internal notes/ratings (optional)
   - `active`: Boolean status
   - Common fields: created_at, updated_at

### Simplified Tagging System

The system uses two complementary fields:

#### 1. **tags** - Searchable categorization
- String array for categories and topics
- Examples:
  - Researchers: ["ai-safety", "interpretability", "cbai-mentor"]
  - Organizations: ["research-lab", "funding-provider", "uk-based"]
  - Platforms: ["community", "educational", "open-source"]

#### 2. **properties** - All entity-specific data
- Single JSON object combining features, metadata, and attributes
- Examples:
  - Researchers: 
    ```json
    {
      "website": "https://example.com",
      "affiliation": "MIT",
      "offersmentorship": true,
      "acceptingStudents": false,
      "researchAreas": ["interpretability", "mechanistic-interp"]
    }
    ```
  - Organizations:
    ```json
    {
      "website": "https://org.com",
      "organizationType": "research-lab",
      "hasOpenPositions": true,
      "provideFunding": false,
      "founded": 2020
    }
    ```

2. **entity_topics table** (renamed from mentor_topics):
   - `entity_id`: Foreign key to entities
   - `topic_id`: Foreign key to topics
   - `description`: How this entity relates to the topic
   - `relationship_type`: Type of relationship (e.g., 'expertise', 'research', 'teaching')
   - Primary key: (entity_id, topic_id)

3. **entity_relationships table** (new):
   - Captures relationships between entities
   - e.g., "Person A works at Organization B"

### Benefits
- Single source for all entity types
- Flexible metadata allows type-specific fields
- Consistent API patterns
- Easier to add new entity types in future

## Implementation Steps

### Phase 1: Create Base Tables ✅ Not Started
1. Run `create-unified-entities-table.ts`
2. Verify table structure in database

### Phase 2: Migrate Existing Data ⏳ Pending
1. Migrate mentors → entities (type: 'individual')
2. Migrate organizations → entities (type: 'organization')
3. Migrate community_profiles → entities (type: 'platform')
4. Update mentor_topics to entity_topics with new schema

### Phase 3: Update API and UI ⏳ Pending
1. Update API routes to use new tables
2. Update UI components to handle unified entity structure
3. Test all entity-related functionality

### Phase 4: Cleanup 🔄 Future
1. Remove old tables after verification
2. Update any remaining references

## Status Tracking

### Completed
- ✅ Analysis of current state
- ✅ Review of existing migration scripts
- ✅ Understanding of planned architecture
- ✅ Database backup created
- ✅ Unified entities table created with simplified structure
- ✅ All 24 mentors successfully migrated as 'researcher' entities (58 total researchers)
- ✅ 33 organizations successfully migrated as 'organization' entities
- ✅ 24 platforms successfully migrated as 'platform' entities
- ✅ Created mentor_topics table for backward compatibility
- ✅ 139 total entity-topic relationships created
- ✅ Created backward compatibility view (v_mentors_from_entities)
- ✅ Updated `/api/topics/[topicId]/mentors` route to support both tables

### Pending
- ⏳ Update remaining API routes (/api/mentors, /api/mentors/[mentorId])
- ⏳ Test all mentor-related functionality
- ⏳ Update UI components to use entities
- ⏳ Remove old tables after verification (mentors, mentor_research_topics, mentor_research_areas, mentor_qualifications)

### Migration Results Summary
The migration successfully created a unified entity system with:
- **entities table**: 115 total entities (58 researchers, 33 organizations, 24 platforms)
- **entity_topics table**: 139 relationships connecting entities to topics
- **mentor_topics table**: Created for backward compatibility with 49 mappings
- Simplified structure with just `tags` and `properties` JSON fields
- All data preserved from original tables
- Backward compatibility maintained through views and dual table support

## Blockers/Decisions Needed

1. **Data Verification**: Need to ensure all 49 mentor-topic relationships will migrate correctly
2. **API Compatibility**: Existing API routes expect the new structure - need to decide if we run migration immediately or update APIs to handle both
3. **Rollback Plan**: Should create backup before migration
4. **Community Profiles**: These might need special handling as they're more like resources than traditional entities

## Next Steps
1. Review and approve this migration plan
2. Create database backup
3. Execute Phase 1 migration scripts
4. Verify and proceed with subsequent phases

---
*Last Updated: June 3, 2025 - Migration completed with backward compatibility*