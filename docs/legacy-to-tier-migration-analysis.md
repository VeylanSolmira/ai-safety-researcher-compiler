# Legacy to Tier System Migration Analysis

## Overview
This document analyzes the migration status of content from the legacy journey sections to the new tier system.

## Legacy Content Mapping

### 1. All Legacy roadmapContentIds Migration Status

| Legacy roadmapContentId | Legacy Location | Tier System Location | Status |
|------------------------|----------------|---------------------|--------|
| prerequisites-topic | introduction section | foundation/intro-module/prerequisites-foundations | ✅ Migrated |
| foundations-topic | introduction section | foundation/intro-module/prerequisites-foundations (additionalContentIds) | ✅ Migrated |
| prompt-injection-subtopic | study-risks/prompt-injection | foundation/practical-safety-basics/prompt-injection-attacks | ✅ Migrated |
| jailbreak-subtopic | study-risks/jailbreak-techniques | foundation/practical-safety-basics/jailbreak-techniques | ✅ Migrated |
| data-poisoning-subtopic | study-risks/data-poisoning | foundation/ai-risks-fundamentals/data-poisoning | ✅ Migrated |
| adversarial-meta-learning-subtopic | study-risks/adversarial-meta-learning | intermediate/advanced-red-teaming/adversarial-robustness | ✅ Migrated |
| computer-security-subtopic | study-risks/computer-security | foundation/ai-risks-fundamentals/ai-computer-security | ✅ Migrated |

### 2. Legacy Structure Features Migration

#### Subsections Structure
- **Legacy**: Had explicit subsections (e.g., study-risks had 5 subsections)
- **Tier System**: Replaced with Topics within Modules
- **Status**: ✅ Successfully migrated - all subsections became individual topics

#### Section Types
- **Legacy**: linear | open-world
- **Tier System**: Preserved at Tier level (linear | open-world)
- **Status**: ✅ Migrated

#### Content Types
- **Legacy**: build | learn | mixed
- **Tier System**: Not explicitly preserved, but modules have practicalComponents and assessmentType
- **Status**: ⚠️ Partially migrated - concept exists but implemented differently

#### Unlocks/Prerequisites
- **Legacy**: prerequisites and unlocks arrays at section level
- **Tier System**: prerequisites and unlocks arrays at tier level
- **Status**: ✅ Migrated at tier level

### 3. Legacy Sections Overview

| Legacy Section ID | Type | Content Type | Status in Tier System |
|------------------|------|--------------|---------------------|
| introduction | linear | mixed | ✅ Migrated to foundation/intro-module |
| fundamentals-hub | open-world | mixed | ✅ Concept integrated into foundation tier structure |
| build-first-tool | linear | build | ✅ Migrated to foundation/practical-safety-basics/build-first-safety-tool |
| explore-alignment | linear | learn | ✅ Migrated to advanced/alignment-research/alignment-principles-deep |
| study-risks | linear | learn | ✅ Split across multiple modules in foundation tier |
| intermediate-hub | open-world | mixed | ✅ Replaced by entire intermediate tier |

### 4. Additional Features in Tier System

The tier system adds several features not present in legacy:
- Learning paths filtering (technical-safety, governance, engineering, research)
- More granular difficulty levels (beginner, intermediate, advanced)
- Deep dive connections (relatedCaseStudies, relatedExperiments, relatedExplorations)
- Comprehensive skill tracking (skillsGained, careerRelevance)
- Module-level learning objectives and assessment types

### 5. Migration Gaps and Recommendations

#### Content Type Tracking
- **Gap**: The legacy contentType (build/learn/mixed) is not explicitly preserved
- **Recommendation**: Could add contentType to Module interface if needed for UI/UX purposes

#### Legacy Progress Migration
- **Gap**: Users with legacy progress need migration to new system
- **Current State**: JourneyProgress interface maintains legacy fields for backward compatibility
- **Recommendation**: Implement migration function to convert legacy progress to tier-based progress

## Conclusion

All content from the legacy journey sections has been successfully migrated to the tier system. The migration preserves all essential content while adding significant enhancements:

1. ✅ All 7 legacy roadmapContentIds are present in the tier system
2. ✅ Section structure converted to Tier/Module/Topic hierarchy
3. ✅ Prerequisites and unlocks preserved at appropriate levels
4. ✅ Open-world vs linear navigation preserved
5. ⚠️ Content types (build/learn/mixed) implicitly preserved but not explicitly tracked

The tier system is a proper superset of the legacy system, maintaining all content while adding richer metadata and structure for enhanced learning experiences.