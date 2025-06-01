# Data Architecture Proposal: Single Source of Truth

## Requirements

### Primary Requirements (This Project)
1. Efficient token usage when accessing curriculum data
2. Support for academic/personal view modes
3. Rich relationships between topics, experiments, case studies
4. Fast queries for navigation and search
5. Easy content updates and management

### Secondary Requirements (roadmaps.sh export)
1. Generate ai-safety-researcher.json with node positions
2. Generate markdown content files in specific format
3. Maintain compatibility with roadmaps.sh structure

## Architecture Decision: SQLite with Export Layer

### Why SQLite (not MongoDB)
1. **Already integrated** - Phase 1-3 complete with 44 tables
2. **Sufficient flexibility** - JSON columns for metadata
3. **Lightweight** - No additional infrastructure
4. **Relational benefits** - Foreign keys, joins for relationships
5. **Good enough** - Avoids overengineering

### Schema Enhancements Needed

```sql
-- Add fields to support roadmap export
ALTER TABLE topics ADD COLUMN roadmap_position JSON; -- {"x": 520, "y": 400}
ALTER TABLE topics ADD COLUMN roadmap_style JSON;    -- {"fontSize": 17, ...}
ALTER TABLE topics ADD COLUMN roadmap_type TEXT;     -- "topic" or "subtopic"
ALTER TABLE topics ADD COLUMN roadmap_parent_id TEXT; -- for section grouping

-- Track which content needs export
ALTER TABLE topics ADD COLUMN export_to_roadmap BOOLEAN DEFAULT TRUE;
ALTER TABLE topics ADD COLUMN last_exported_at TIMESTAMP;
```

## Single Source of Truth Flow

```
┌─────────────────┐
│  SQLite Database │ ← Single Source of Truth
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ Web App │ │ Export Scripts│
└─────────┘ └──────┬───────┘
                   │
            ┌──────┴──────┐
            ▼             ▼
    ┌──────────────┐ ┌─────────────┐
    │ roadmap.json │ │ content/*.md│
    └──────────────┘ └─────────────┘
```

## Export Script Design

### 1. Generate roadmap JSON
```typescript
// scripts/export-to-roadmap.ts
export async function exportToRoadmapFormat() {
  const topics = await db.select().from(topics).where(eq(topics.exportToRoadmap, true));
  
  const nodes = topics.map(topic => ({
    id: topic.roadmapId || topic.id,
    type: topic.roadmapType || 'topic',
    position: topic.roadmapPosition || calculatePosition(topic),
    data: {
      label: topic.title,
      parentId: topic.roadmapParentId,
      style: topic.roadmapStyle || defaultStyle,
      viewMode: 'both'
    }
  }));
  
  // Add label nodes, sections, etc.
  const roadmapJson = {
    nodes,
    edges: generateEdges(nodes)
  };
  
  await fs.writeFile('src/data/roadmaps/ai-safety-researcher/ai-safety-researcher.json', 
    JSON.stringify(roadmapJson, null, 2));
}
```

### 2. Generate content files
```typescript
export async function exportContentFiles() {
  const topicsWithContent = await db.query.topics.findMany({
    with: { content: true }
  });
  
  for (const topic of topicsWithContent) {
    // Generate both academic and personal versions
    const academicContent = topic.content.academic;
    const personalContent = topic.content.personal;
    
    await fs.writeFile(
      `src/data/roadmaps/ai-safety-researcher/content/${topic.roadmapId}@${topic.roadmapId}-subtopic.md`,
      formatForRoadmap(academicContent)
    );
    
    await fs.writeFile(
      `src/data/roadmaps/ai-safety-researcher/content/${topic.roadmapId}@${topic.roadmapId}-subtopic.personal.md`,
      formatForRoadmap(personalContent)
    );
  }
}
```

## Migration Strategy

### Phase 1: Complete Current Upsert
1. Import all roadmap content into journey structure
2. Maintain roadmapContentId links
3. Ensure all content is accessible

### Phase 2: Add Export Metadata
1. Add roadmap position/style columns
2. Map existing nodes to their roadmap positions
3. Set export flags

### Phase 3: Build Export Pipeline
1. Create export scripts
2. Add npm scripts for export
3. Test round-trip (DB → Export → Verify)

### Phase 4: Maintain Sync
1. Add hooks to track content changes
2. Show "pending export" indicator
3. Batch export on demand

## Benefits

1. **Single source of truth** - Database is authoritative
2. **Efficient for app** - 97% token reduction maintained  
3. **Flexible export** - Can generate any format needed
4. **No overengineering** - Uses existing infrastructure
5. **Future-proof** - Can add more export formats later

## Alternative Considered: Document Store

MongoDB/Document store would be good if:
- Schema changed frequently (it doesn't)
- Needed complex nested documents (JSON columns suffice)
- Had massive scale requirements (we don't)

SQLite is the right choice for this project's scope.

## Next Steps

1. Complete the roadmap → journey upsert
2. Add export metadata fields to schema
3. Build export scripts
4. Test full pipeline
5. Document the process

This gives us the best of both worlds: optimized for our primary use case while maintaining roadmaps.sh compatibility.