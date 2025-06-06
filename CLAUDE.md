# Important Architecture Principles for Claude

## TypeScript Best Practices

**CRITICAL**: Always use full typing, even in early development stages to avoid technical debt.

### Why this matters:
1. **Type debt compounds quickly** - What seems like a quick `any` type becomes technical debt that's harder to fix later
2. **Catches errors at compile time** - Not at runtime when users encounter them
3. **Makes the codebase self-documenting** - Types explain what data structures are expected
4. **Prevents API mismatches** - Ensures components use the correct property names and structures

### Rules:
- **Never use `any` type** - use `unknown` if type is truly unknown and narrow it down
- **Always type function parameters and return values** - No implicit any
- **Create interfaces for all data structures** - Even temporary ones during development
- **When importing from database queries** - Ensure types match actual schema
- **Use strict TypeScript settings** - Keep strict mode enabled in tsconfig.json
- **Fix type errors immediately** - Don't let them accumulate

### Examples:
```typescript
// ❌ Bad - using any
const processData = (data: any) => data.someProperty

// ✅ Good - proper typing
interface DataStructure {
  someProperty: string
}
const processData = (data: DataStructure): string => data.someProperty

// ❌ Bad - no return type
function calculateScore(items) {
  return items.reduce((a, b) => a + b.score, 0)
}

// ✅ Good - fully typed
interface ScoredItem {
  score: number
}
function calculateScore(items: ScoredItem[]): number {
  return items.reduce((a, b) => a + b.score, 0)
}
```

## Database is the Source of Truth

**CRITICAL**: The SQLite database (`journey-dev.db`) is the SINGLE SOURCE OF TRUTH for all content and structure.

### What this means:
1. **Content lives in the database** - specifically in the `content_academic` and `content_personal` fields of the topics table
2. **Markdown files are EXPORTS** - they are generated FROM the database, not sources TO import
3. **Never import from markdown to database** - this is backwards! The flow is: Database → Markdown files
4. **The `roadmap_content_id` field is LEGACY** - it's from before the database was the source of truth and should be deleted

### Correct Flow:
```
Database (journey-dev.db) 
    ↓ (export scripts)
Markdown files in src/data/roadmaps/
    ↓ (build process)  
roadmap.sh JSON format
```

### Key Scripts:
- **Export from DB to Markdown**: `scripts/export-db-content-to-markdown.ts`
- **Export from DB to roadmap.sh JSON**: `scripts/export-to-roadmap-json.ts`
- **Export from DB to CURRICULUM.md**: `scripts/export-to-curriculum-md.ts`

### What about orphaned markdown files?
Files like `adversarial-meta-learning@adversarial-meta-learning-subtopic.md` that don't correspond to database topics are artifacts from the old system. They should be:
1. Reviewed to see if their content should become new topics in the database
2. Archived if not needed
3. NEVER automatically imported

## View Modes
- **Academic**: Objective, educational content (stored in `content_academic`)
- **Personal**: Casual, personal perspective (stored in `content_personal`)

## Component Architecture
- `JourneyTopicContent` reads directly from the `topic.contentAcademic` or `topic.contentPersonal` fields
- No external file loading for journey topics
- ReactMarkdown renders all content
- Both content types are stored as markdown in the database

Remember: When in doubt, the database is the authority!

## Database Interaction Patterns

When writing scripts or API routes that interact with the database, follow the patterns in [`docs/DATABASE_PATTERNS.md`](docs/DATABASE_PATTERNS.md). This guide includes:
- Correct import patterns for better-sqlite3
- Common query examples
- Solutions for foreign key constraints
- Proper column naming (use underscores, not camelCase)
- Tier ID values (strings like 'intermediate', not numbers)

## LLM-Assisted Development Patterns

### Hardcoded Values vs Constants

In LLM-assisted development, certain patterns that violate traditional best practices may actually be more practical:

**When hardcoding makes sense with LLM assistance:**
- Database IDs and enum values (e.g., `'foundation'`, `'intermediate'`, `'advanced'`)
- Consistent strings used across multiple files
- SQL queries with inline values
- Route paths and navigation strings

**Why this works for LLMs but not humans:**
- LLMs have perfect recall of all instances
- No cognitive load from tracking multiple values
- Can instantly find and update all occurrences
- Pattern matching across entire codebase is trivial

**Still use constants for:**
- External API endpoints and configuration
- Business rules that might change
- Values that cross package boundaries
- Anything that could cause runtime errors if typo'd

**Example:**
```typescript
// OK with LLM assistance - easy to find/replace all
const moduleData = db.prepare(`
  SELECT * FROM modules WHERE tier_id = 'foundation'
`).all()

// Still better as constant - critical external dependency
const API_ENDPOINT = process.env.API_URL || 'https://api.example.com'
```

**Principle:** Optimize for LLM strengths (pattern matching, consistency) while protecting against human errors (typos in critical values).

## Proposal Documentation Pattern

When providing architectural proposals, migration plans, or design decisions:
1. **Always create a markdown file** in the `docs/proposals/` directory with a descriptive name (e.g., `entity-topics-migration-proposal.md`)
2. **Update the file as work proceeds** - add status updates, decisions made, and implementation progress
3. **Include in the file**:
   - Current state analysis
   - Proposed design/architecture
   - Implementation steps
   - Status tracking (what's done, what's pending)
   - Any blockers or decisions needed
4. **This applies to any significant proposal** that would normally be explained in chat - document it in a file instead

## Development Server Management
Before running `npm run dev`, ALWAYS check if the server is already running:
```bash
lsof -i :3000
```
If a process is already listening on port 3000, the server is running. Don't start a new one.