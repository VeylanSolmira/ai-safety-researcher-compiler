# MATS Mentor Topic Mapping Proposal

## Current State
- Total MATS 2025 mentors: 55
- Mentors with topic connections: 4 (7%)
- Mentors without topics: 51 (93%)

## Issues Identified
1. **Duplicate entries** for Buck Shlegeris, Eli Lifland, and Ethan Perez
2. **Missing topic connections** for 93% of mentors
3. **Inconsistent naming convention** (some use `name-mats`, others use `mats-2025-name`)

## Proposed Solution

### Step 1: Merge Duplicates
Merge the following duplicate entries:
- `buck-shlegeris-mats` → keep (has topics)
- `mats-2025-buck-shlegeris` → remove
- `eli-lifland-mats` → keep (has topics)
- `mats-2025-eli-lifland` → remove
- `ethan-perez-mats` → keep (has topics)
- `mats-2025-ethan-perez` → remove

### Step 2: Research Area to Topic Mapping
Based on mentor descriptions and research areas, create topic connections. Here's a sample mapping:

#### Neel Nanda
- Mechanistic Interpretability Practice
- Basic Interpretability
- Understanding How LLMs Work

#### Evan Hubinger
- Deceptive Alignment & Treacherous Turns
- Goal Misgeneralization
- Mesa-Optimization

#### Richard Ngo
- Agent Safety Fundamentals
- Multi-Agent Coordination
- AI Philosophy and Consciousness

#### Sam Bowman
- Language Model Safety
- Safety Evaluation Methods
- Automated AI Safety Research

### Step 3: Implementation
1. Create a script to add entity_topics entries
2. Use relationship_type = 'research_focus' for primary areas
3. Use relationship_type = 'teaches' for topics they mentor on
4. Add descriptive context for each connection

## Status
- [x] Merge duplicate entries
- [x] Complete mentor research area analysis
- [x] Create topic mapping script
- [x] Execute database updates
- [x] Verify all mentors have connections

## Implementation Results
- Merged 3 duplicate entries
- Added topic connections for all 52 MATS mentors
- Average of 4.2 topics per mentor
- Enhanced specific mappings for 10 key mentors
- Optimized API calls with batch endpoint (reduced from ~50 calls to 3)