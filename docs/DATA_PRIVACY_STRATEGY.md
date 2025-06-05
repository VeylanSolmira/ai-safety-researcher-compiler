# Data Privacy Strategy for Development vs Production

## Sensitive Data Identified

### High Sensitivity (Complete Exclusion)
- **User tables**: `users`, `user_progress`, `user_completions`, `user_choices`
- **Internal prompts**: `ai_prompts` table

### Medium Sensitivity (Field-level Exclusion)
- **`entities.personal_note`**: Your personal ratings/evaluations of mentors
- **`topics.content_personal`**: Personal perspective content (if not a public feature)
- **`ideas.quality_rating`**: Internal quality scores
- **`ideas.warnings`**: Internal warning notes

## Recommended Approach: Dev + Prod Database Strategy

### Option 1: Overlay Database (Recommended)
Keep your personal data in a separate overlay database that's only used in development:

```
journey-dev.db (main database - can be published after sanitization)
journey-personal.db (personal overlay - gitignored)
```

**Implementation:**
1. Move sensitive data to overlay database
2. Use ATTACH in development to merge data
3. Production uses only main database

### Option 2: Environment-based Data Loading
Use environment variables to conditionally load personal data:

```typescript
// Only load personal notes in development
const includePersonalData = process.env.NODE_ENV === 'development'
```

### Option 3: Separate Config Files
Store personal evaluations in gitignored JSON/YAML files:

```
data/
  mentors.json (public data)
  mentors.personal.json (gitignored)
```

## Implementation Plan

### Step 1: Create Production Database Sanitizer

```typescript
// scripts/create-production-db.ts
import Database from 'better-sqlite3'
import fs from 'fs'

const TABLES_TO_EXCLUDE = [
  'users',
  'user_progress', 
  'user_completions',
  'user_choices',
  'ai_prompts'
]

const FIELDS_TO_NULLIFY = {
  'entities': ['personal_note'],
  'ideas': ['quality_rating', 'warnings'],
  // Keep content_personal if it's a public feature
}

export function createProductionDatabase() {
  // Copy database
  fs.copyFileSync('./journey-dev.db', './journey-public.db')
  
  const db = new Database('./journey-public.db')
  
  // Drop sensitive tables
  for (const table of TABLES_TO_EXCLUDE) {
    db.prepare(`DROP TABLE IF EXISTS ${table}`).run()
  }
  
  // Nullify sensitive fields
  for (const [table, fields] of Object.entries(FIELDS_TO_NULLIFY)) {
    for (const field of fields) {
      db.prepare(`UPDATE ${table} SET ${field} = NULL`).run()
    }
  }
  
  // Vacuum to reduce file size
  db.prepare('VACUUM').run()
  db.close()
}
```

### Step 2: Create Personal Data Overlay

```typescript
// scripts/extract-personal-data.ts
import Database from 'better-sqlite3'

export function extractPersonalData() {
  const source = new Database('./journey-dev.db')
  const personal = new Database('./journey-personal.db')
  
  // Create personal_evaluations table
  personal.prepare(`
    CREATE TABLE IF NOT EXISTS personal_evaluations (
      entity_id TEXT PRIMARY KEY,
      personal_note TEXT,
      quality_rating INTEGER,
      warnings TEXT,
      custom_data TEXT
    )
  `).run()
  
  // Extract personal data
  const entities = source.prepare(`
    SELECT id, personal_note 
    FROM entities 
    WHERE personal_note IS NOT NULL
  `).all()
  
  const stmt = personal.prepare(`
    INSERT OR REPLACE INTO personal_evaluations (entity_id, personal_note)
    VALUES (?, ?)
  `)
  
  for (const entity of entities) {
    stmt.run(entity.id, entity.personal_note)
  }
  
  personal.close()
  source.close()
}
```

### Step 3: Update Database Access Layer

```typescript
// lib/db/with-personal-data.ts
import Database from 'better-sqlite3'
import path from 'path'

export function getDatabaseWithPersonal() {
  const db = new Database('./journey-dev.db')
  
  if (process.env.NODE_ENV === 'development') {
    const personalDbPath = './journey-personal.db'
    if (fs.existsSync(personalDbPath)) {
      // Attach personal database
      db.prepare('ATTACH DATABASE ? AS personal').run(personalDbPath)
      
      // Create view that merges data
      db.prepare(`
        CREATE TEMP VIEW entities_with_personal AS
        SELECT 
          e.*,
          COALESCE(p.personal_note, e.personal_note) as personal_note
        FROM entities e
        LEFT JOIN personal.personal_evaluations p ON e.id = p.entity_id
      `).run()
    }
  }
  
  return db
}
```

### Step 4: Git Configuration

Update `.gitignore`:
```gitignore
# Personal/sensitive data
journey-personal.db
*.personal.json
*-personal.db

# Keep production database
!journey-public.db
```

### Step 5: Development Workflow

```json
// package.json
{
  "scripts": {
    // Development
    "dev": "next dev",
    "dev:setup": "npm run db:extract-personal",
    
    // Production preparation
    "db:extract-personal": "tsx scripts/extract-personal-data.ts",
    "db:create-prod": "tsx scripts/create-production-db.ts",
    "db:verify-prod": "tsx scripts/verify-no-sensitive-data.ts",
    
    // Deployment
    "predeploy": "npm run db:create-prod && npm run db:verify-prod",
    "deploy": "vercel --prod"
  }
}
```

## Quick Start Commands

```bash
# First time setup - extract your personal data
npm run db:extract-personal

# Create production database (removes sensitive data)
npm run db:create-prod

# Verify production database is clean
npm run db:verify-prod

# Deploy
npm run deploy
```

## Benefits of This Approach

1. **Simple**: Your dev experience remains unchanged
2. **Safe**: Personal data never enters git or production
3. **Flexible**: Easy to add more personal fields later
4. **Reversible**: Can always regenerate from source
5. **Maintainable**: Clear separation of concerns

## Alternative: Simple JSON Overlay

If the database approach seems complex, store personal notes in a simple JSON file:

```json
// data/personal-notes.json (gitignored)
{
  "entities": {
    "neel-nanda": {
      "personal_note": "Rating: 10/10 - Excellent explanations",
      "custom_tags": ["favorite", "must-watch"]
    }
  }
}
```

Then load in your API routes when in development mode.