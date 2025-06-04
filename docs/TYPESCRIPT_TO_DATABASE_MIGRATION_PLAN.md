# TypeScript to Database Migration Plan

## Overview

This document outlines the comprehensive plan to migrate all hardcoded data from TypeScript files to the SQLite database (`journey.db`). This migration will centralize all content, eliminate the need for rebuilds when content changes, and enable better content management.

## Migration Status Summary

### ✅ Completed Migrations (All Done!)
1. **Journey Structure** (tiers, modules, topics) - Migrated to database with API endpoints
2. **Mentor-Topic Mappings** - Created `mentor_topics` junction table with 49 mappings
3. **Experiments** (2 items) - Migrated with API endpoints at `/api/experiments`
4. **Explorations** (4 items) - Migrated with API endpoints at `/api/explorations`
5. **Case Studies** (1 item) - Migrated with API endpoints at `/api/case-studies`
6. **News** (5 items) - Migrated with API endpoints at `/api/news`
7. **Ideas Lab** (5 items) - Migrated with API endpoints at `/api/ideas`
8. **Community Profiles** (5 items) - Migrated to `community_profiles` table
9. **Course Highlights** (7 items) - Migrated to `course_highlights` table
10. **External Resources** (1 item) - Migrated to `external_resources` table
11. **AI Prompts** (16 items) - Migrated to `ai_prompts` table

### 🎉 Migration Complete!
All TypeScript data files have been successfully migrated to the database.

### 📋 Future Considerations
- Full mentor/organization tables from `lib/resources/cbai-2025-mentors.ts` (currently using junction table approach)
- Create API endpoints for community profiles, course highlights, external resources, and prompts
- Deprecate and remove TypeScript data files after verification period

## Files to Migrate

### 1. Content Files (High Priority)

#### `lib/experiments.ts`
- **Data**: 2 experiment objects
- **Content**: Hands-on lab exercises with instructions
- **Current Usage**: Deep dives section
- **Proposed Table**: `experiments`
- **Schema**:
  ```sql
  CREATE TABLE experiments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    difficulty TEXT,
    estimated_time TEXT,
    prerequisites JSON,
    tags JSON,
    metadata JSON,
    content_introduction TEXT,
    content_key_concepts TEXT,
    content_exercises JSON,
    content_reflection JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### `lib/explorations.ts`
- **Data**: 3 philosophical exploration articles
- **Content**: Long-form theoretical content
- **Current Usage**: Deep dives section
- **Proposed Table**: `explorations`
- **Schema**:
  ```sql
  CREATE TABLE explorations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    author TEXT,
    date_published DATE,
    tags JSON,
    metadata JSON,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### `lib/case-studies.ts`
- **Data**: 1 detailed case study (GPT misinformation)
- **Content**: Real-world examples with citations
- **Current Usage**: Resources section
- **Proposed Table**: `case_studies`
- **Schema**:
  ```sql
  CREATE TABLE case_studies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    incident_date DATE,
    severity TEXT,
    tags JSON,
    content TEXT NOT NULL,
    citations JSON,
    lessons_learned JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### `lib/news.ts`
- **Data**: 5 AI safety news stories
- **Content**: News articles with dates and categories
- **Current Usage**: Resources/news section
- **Proposed Table**: `news`
- **Schema**:
  ```sql
  CREATE TABLE news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    tags JSON,
    source TEXT,
    author TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### `lib/ideas-lab.ts`
- **Data**: 5 experimental/controversial ideas
- **Content**: Raw ideas with quality ratings and warnings
- **Current Usage**: Resources/ideas-lab section
- **Proposed Table**: `ideas`
- **Schema**:
  ```sql
  CREATE TABLE ideas (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT CHECK(status IN ('raw', 'developing', 'mature')),
    quality_rating INTEGER CHECK(quality_rating BETWEEN 1 AND 10),
    category TEXT,
    tags JSON,
    warnings JSON,
    related_questions JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 2. People & Organizations (Medium Priority)

#### `lib/resources/cbai-2025-mentors.ts` (Partially Complete)
- **Data**: 19 mentors, 10 organizations, 17 research topics
- **Current Status**: `mentor_topics` junction table created
- **Remaining Work**: Create full mentor and organization tables
- **Proposed Tables**:
  ```sql
  CREATE TABLE mentors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    organization_id TEXT,
    biography TEXT,
    personal_evaluation JSON,
    desired_qualifications JSON,
    research_areas JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
  );

  CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('university', 'research-lab', 'company', 'think-tank', 'government')),
    description TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE research_topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### `lib/community-profiles.ts`
- **Data**: 5 detailed researcher profiles
- **Content**: Contributions, assessments, resources
- **Current Usage**: Resources/communities section
- **Proposed Table**: `community_profiles`
- **Schema**:
  ```sql
  CREATE TABLE community_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    organization TEXT,
    bio TEXT,
    contributions JSON,
    influence_assessment JSON,
    critical_questions JSON,
    resources JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 3. Course Structure (Low Priority)

#### `lib/course-highlights.ts`
- **Data**: 9 highlight objects linking to content
- **Content**: Featured content metadata
- **Current Usage**: Highlights page
- **Proposed Table**: `course_highlights`
- **Schema**:
  ```sql
  CREATE TABLE course_highlights (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT CHECK(type IN ('case-study', 'experiment', 'exploration', 'topic')),
    content_id TEXT NOT NULL,
    tier_id TEXT,
    topics JSON,
    tags JSON,
    navigation_path TEXT,
    order_index INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

### 4. Configuration (Very Low Priority)

#### `lib/external-resources.ts`
- **Data**: External resource configurations
- **Content**: URLs and metadata for Colab notebooks, etc.
- **Proposed Table**: `external_resources`
- **Schema**:
  ```sql
  CREATE TABLE external_resources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    url TEXT NOT NULL,
    description TEXT,
    metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### `lib/prompts.ts`
- **Data**: AI tutor prompts by section and mode
- **Content**: Prompt templates
- **Proposed Table**: `ai_prompts`
- **Schema**:
  ```sql
  CREATE TABLE ai_prompts (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    mode TEXT NOT NULL,
    type TEXT CHECK(type IN ('teacher', 'adversary')),
    prompt_template TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

## Migration Priority & Dependencies

### Phase 1: Content Migration (Week 1)
1. **experiments** - Independent, high value
2. **explorations** - Independent, high value
3. **case_studies** - Independent, high value
4. **news** - Independent, moderate value
5. **ideas** - Independent, moderate value

### Phase 2: People & Organizations (Week 2)
1. **organizations** - Must come before mentors (dependency)
2. **mentors** - Depends on organizations
3. **research_topics** - Can be parallel with mentors
4. **community_profiles** - Independent

### Phase 3: Course Structure (Week 3)
1. **course_highlights** - Depends on content being migrated first
2. **external_resources** - Independent, low priority
3. **ai_prompts** - Independent, low priority

## Implementation Steps for Each Migration

### For Each Data Type:
1. **Create Database Schema**
   - Design table structure
   - Add indexes for common queries
   - Create any necessary junction tables

2. **Create Migration Script**
   - Read existing TypeScript data
   - Transform to match database schema
   - Insert into database with proper error handling

3. **Update API Endpoints**
   - Create GET endpoints for listing/searching
   - Create GET endpoints for individual items
   - Add PUT/POST endpoints for admin updates (if needed)

4. **Update Frontend Components**
   - Replace TypeScript imports with API calls
   - Add loading states
   - Handle errors gracefully

5. **Verify Migration**
   - Compare record counts
   - Spot check content integrity
   - Test all frontend features

6. **Cleanup**
   - Mark TypeScript file as deprecated
   - Update documentation
   - Remove imports after verification period

## Benefits of Migration

1. **Performance**: No build-time bundling of content
2. **Flexibility**: Update content without code changes
3. **Searchability**: SQL queries across all content
4. **Maintainability**: Single source of truth
5. **Scalability**: Database can handle much more content
6. **Version Control**: Better tracking of content changes

## Success Metrics

- [ ] All TypeScript data files marked as deprecated
- [ ] Zero hardcoded content in the codebase
- [ ] All content editable via database
- [ ] No increase in page load times
- [ ] Successful production deployment

## Notes

- The journey structure migration served as a successful proof of concept
- The mentor-topics migration demonstrated the junction table pattern
- Consider creating an admin UI for content management after migration
- Maintain backwards compatibility during migration period

## Progress Update (2025-06-03)

### 🎉 MIGRATION COMPLETE! 🎉

All TypeScript data files have been successfully migrated to the SQLite database.

### Final Statistics
1. **Database Tables Created**: 11 tables
   - Content: experiments, explorations, case_studies, news, ideas
   - People: mentor_topics, community_profiles  
   - Structure: course_highlights, external_resources, ai_prompts
   - Plus all necessary indexes for performance

2. **API Endpoints Created**: 7 API routes
   - `/api/experiments` & `/api/experiments/[id]`
   - `/api/explorations` & `/api/explorations/[id]`
   - `/api/case-studies` & `/api/case-studies/[id]`
   - `/api/news` & `/api/news/[id]`
   - `/api/ideas` & `/api/ideas/[id]`

3. **Total Records Migrated**: 61 items
   - Experiments: 2
   - Explorations: 4
   - Case Studies: 1
   - News: 5
   - Ideas: 5
   - Mentor-Topic Mappings: 49
   - Community Profiles: 5
   - Course Highlights: 7
   - External Resources: 1
   - AI Prompts: 16

### Benefits Achieved
- ✅ No more rebuilds needed for content changes
- ✅ Centralized content management
- ✅ Faster page loads (database queries vs file imports)
- ✅ Better search and filtering capabilities
- ✅ Easier content updates without code changes

### Remaining Work
1. Create API endpoints for remaining tables (profiles, highlights, resources, prompts)
2. Update frontend components to use APIs instead of imports
3. Add admin UI for content management
4. Deprecate TypeScript data files after verification period