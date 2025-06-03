# Citation Validation Project

## Overview
This document tracks the progress of validating all citations across the AI Safety Research Compiler. The goal is to identify all unlinked citations (e.g., "Cool Science Paper" (2002)) and either:
1. Find and add proper citations with links
2. Flag citations that cannot be verified with prominent warnings

## Citation Patterns We Detect

The validation script uses intelligent pattern matching to find various types of claimed papers and research:

### 1. Standard Format
- `"Paper Title" (2002)` - Traditional academic citation format

### 2. Author-Year Format  
- `Smith et al. (2020)` - Author-based citations
- `Jones and Brown (2019)` - Multi-author citations

### 3. Paper Mentions
- `"the Attention is All You Need paper"` - Named papers without formal citation
- `(see "Paper Title")` - Parenthetical references
- `demonstrated in "Title"` - Papers referenced in context

### 4. Work References
- `work by Anthropic` - Research from organizations
- `research from DeepMind (2023)` - Dated organizational research
- `study by [Author/Org]` - General research references

The script intelligently filters out false positives like common words, URLs, and code snippets.

## Progress Tracking

### Phase 1: Infrastructure Setup
- [ ] Create citation scanning script
- [ ] Implement citation validation logic
- [ ] Add flagging system for unverified citations

### Phase 2: Content Scanning
- [ ] Scan all academic content
- [ ] Scan all personal content
- [ ] Generate comprehensive report

### Phase 3: Citation Resolution
- [ ] Research and verify flagged citations
- [ ] Update content with proper links
- [ ] Mark unverifiable citations with warnings

## Citation Issues Found

### Academic Content
<!-- Will be populated by the scanning script -->

### Personal Content
<!-- Will be populated by the scanning script -->

## Statistics
- Total topics scanned: 0
- Total citations found: 0
- Citations verified: 0
- Citations flagged: 0
- Success rate: 0%

## Flagging Format
Unverified citations will be marked as:
```markdown
⚠️ **UNVERIFIED CITATION** ⚠️ "Paper Title" (Year) - *Could not find a reliable source for this citation*
```

## Script Location
- Main validation script: `/scripts/validate-citations.ts`
- Report generator: `/scripts/generate-citation-report.ts`