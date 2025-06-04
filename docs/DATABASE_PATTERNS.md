# Database Interaction Patterns

This guide contains the correct patterns for interacting with the SQLite database in scripts and API routes.

## Script Pattern (using better-sqlite3)

```typescript
import Database from 'better-sqlite3';
import path from 'path';

// Always use the local database file
const dbPath = path.join(process.cwd(), 'journey.db');
const db = new Database(dbPath);

// Basic query patterns
function example() {
  try {
    // SELECT - single row
    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get('topic-id');
    
    // SELECT - multiple rows
    const topics = db.prepare('SELECT * FROM topics WHERE module_id = ?').all('module-id');
    
    // INSERT
    const insertStmt = db.prepare(`
      INSERT INTO topics (id, title, module_id, content_academic, content_personal, difficulty)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run('new-id', 'Title', 'module-id', 'Academic content', 'Personal content', 'intermediate');
    
    // UPDATE
    const updateStmt = db.prepare(`
      UPDATE topics 
      SET content_academic = ?, content_personal = ?
      WHERE id = ?
    `);
    updateStmt.run('New academic content', 'New personal content', 'topic-id');
    
    // DELETE
    const deleteStmt = db.prepare('DELETE FROM topics WHERE id = ?');
    deleteStmt.run('topic-id');
    
    // Always close the database when done
    db.close();
  } catch (error) {
    console.error('Database error:', error);
    db.close();
    throw error;
  }
}
```

## Common Issues and Solutions

### 1. Foreign Key Constraints
```typescript
// Check that referenced records exist before inserting
const moduleExists = db.prepare('SELECT id FROM modules WHERE id = ?').get('module-id');
if (!moduleExists) {
  console.error('Module does not exist!');
  return;
}
```

### 2. Column Names
Remember the actual database schema uses underscores, not camelCase:
- ✅ `content_academic` (correct)
- ❌ `contentAcademic` (incorrect)
- ✅ `module_id` (correct)
- ❌ `moduleId` (incorrect)

### 3. Table Primary Keys
- `topics` table: Primary key is `id` (not `topic_id`)
- `modules` table: Primary key is `id` (not `module_id`)
- `tiers` table: Primary key is `id` (examples: 'foundation', 'intermediate', 'advanced', 'expert')

### 4. Tier IDs
The tier IDs are strings, not numbers:
- ✅ `'foundation'`, `'intermediate'`, `'advanced'`, `'expert'`
- ❌ `1`, `2`, `3`, `4`

## API Route Pattern (Next.js App Router)

```typescript
import { db } from '@/lib/db';
import { topics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, params.topicId),
      with: {
        module: true,
        tags: true
      }
    });
    
    if (!topic) {
      return Response.json({ error: 'Topic not found' }, { status: 404 });
    }
    
    return Response.json(topic);
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Checking Schema

To check the actual database schema:
```bash
sqlite3 journey.db ".schema topics"
sqlite3 journey.db ".schema modules"
sqlite3 journey.db ".tables"
```

## Common Queries

### List all modules with their tiers
```sql
SELECT m.id, m.title, m.tier_id, t.title as tier_title 
FROM modules m 
JOIN tiers t ON m.tier_id = t.id 
ORDER BY t.position, m.position;
```

### Find topics by content search
```sql
SELECT id, title, module_id 
FROM topics 
WHERE content_academic LIKE '%search term%' 
   OR content_personal LIKE '%search term%';
```

### Count topics per module
```sql
SELECT module_id, COUNT(*) as topic_count 
FROM topics 
GROUP BY module_id;
```

## Migration Script Template

```typescript
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'journey.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Use transactions for bulk operations
const insertMany = db.transaction((items) => {
  const stmt = db.prepare(`
    INSERT INTO topics (id, title, module_id, content_academic, content_personal)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  for (const item of items) {
    stmt.run(item.id, item.title, item.moduleId, item.academic, item.personal);
  }
});

// Execute transaction
try {
  insertMany(topicsArray);
  console.log('Migration successful');
} catch (error) {
  console.error('Migration failed:', error);
}

db.close();
```

## Testing Database Operations

```typescript
// Test connection
const testDb = () => {
  const db = new Database('journey.db');
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM topics').get();
    console.log('Topics count:', result.count);
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    db.close();
  }
};
```