# Valuable Orphaned Content Review

This document tracks the 12 valuable orphaned markdown files that contain substantial content and should be reviewed for import into the database.

## Summary
- **Total valuable files**: 12 (representing 9 topics, some with both academic and personal versions)
- **Total content size**: ~70KB of meaningful content
- **Status**: These files predate the database-as-source-of-truth architecture

## Detailed Review

### 1. Adversarial Meta-Learning
- **Files**: 
  - `adversarial-meta-learning@adversarial-meta-learning-subtopic.md` (5.8KB) - academic
  - `adversarial-meta-learning@adversarial-meta-learning-subtopic.personal.md` (4.5KB) - personal
- **Current DB Status**: No matching topic exists
- **Content Summary**: Critical AI safety risks where AI systems learn about and manipulate safety processes. Includes Dark Forest analogy, recursive deception, AI-as-teacher manipulation, and AlphaEvolve case study
- **Recommendation**: Create new topic `adversarial-meta-learning` in Advanced Red Teaming & Adversarial ML module
- **Priority**: HIGH - unique and important content

### 2. Foundational Papers
- **Files**: 
  - `foundational-papers@foundational-papers-subtopic.md` (2.7KB)
- **Current DB Status**: No matching topic exists
- **Content Summary**: Essential papers every AI safety researcher should understand
- **Recommendation**: Create new topic `foundational-papers` in Foundation tier, part of Research Papers Hub
- **Priority**: HIGH - core knowledge for safety researchers

### 3. Foundations (Prerequisites & Foundations)
- **Files**: 
  - `foundations@foundations-topic.md` (3.7KB) - academic
  - `foundations@foundations-topic.personal.md` (5.5KB) - personal
  - `prerequisites@prerequisites-topic.md` (2.8KB) - academic
  - `prerequisites@prerequisites-topic.personal.md` (4.2KB) - personal
- **Current DB Status**: Topic `prerequisites-foundations` exists but has NO content
- **Content Summary**: Foundational AI safety concepts and prerequisites overview
- **Recommendation**: Import both foundations and prerequisites content into the existing `prerequisites-foundations` topic
- **Priority**: HIGH - fills empty existing topic

### 4. Iterative Research Design
- **Files**: 
  - `iterative-research-design@iterative-research-design-subtopic.md` (6.7KB)
- **Current DB Status**: Topic `iterative-research` exists but has NO content
- **Content Summary**: Making rapid progress through hypothesis/experiment/revision cycles
- **Recommendation**: Import into existing `iterative-research` topic in Research Methods module
- **Priority**: HIGH - fills empty existing topic

### 5. Key Figures
- **Files**: 
  - `key-figures@key-figures-subtopic.md` (8.6KB) - academic
  - `key-figures@key-figures-subtopic.personal.md` (5.8KB) - personal (includes "Yud" and other informal references)
- **Current DB Status**: Topic `key-figures-safety` exists but has NO content
- **Content Summary**: Important people in AI safety, their contributions, and research approaches
- **Recommendation**: Import both versions into existing `key-figures-safety` topic
- **Priority**: MEDIUM - useful reference content

### 6. Problem Decomposition & Scoping
- **Files**: 
  - `problem-decomposition-scoping@problem-decomposition-scoping-subtopic.md` (5.1KB)
- **Current DB Status**: Topic `problem-decomposition` exists but has NO content
- **Content Summary**: Transforming ambitious AI safety visions into concrete research projects
- **Recommendation**: Import into existing `problem-decomposition` topic
- **Priority**: HIGH - core research skill

### 7. Research Project Management
- **Files**: 
  - `research-project-management@research-project-management-subtopic.md` (7.8KB)
- **Current DB Status**: Topic `research-project-mgmt` exists but has NO content
- **Content Summary**: Systems and practices for productive research momentum
- **Recommendation**: Import into existing `research-project-mgmt` topic
- **Priority**: HIGH - practical research skills

### 8. Value Learning
- **Files**: 
  - `value-learning@value-learning-subtopic.md` (7.5KB)
- **Current DB Status**: Already has content in database (updated with RLHF content)
- **Content Summary**: Fundamental approach to AI alignment via teaching human values
- **Recommendation**: Review if orphaned file has unique content worth merging
- **Priority**: LOW - database already has content

## Import Strategy

### Immediate Actions (HIGH Priority)
1. Import foundations/prerequisites content → `prerequisites-foundations`
2. Import iterative research design → `iterative-research`
3. Import problem decomposition → `problem-decomposition`
4. Import research project management → `research-project-mgmt`

### Secondary Actions (MEDIUM Priority)
1. Import key figures content → `key-figures-safety`
2. Decide on foundational papers placement
3. Decide on adversarial meta-learning placement

### Review Actions (LOW Priority)
1. Compare value-learning file with existing database content

## Notes
- All imports should preserve both academic and personal versions where they exist
- Personal versions often contain more informal language and personal opinions (e.g., "Yud" for Yudkowsky)
- After import, these files should be archived or removed to prevent confusion
- Database remains the single source of truth