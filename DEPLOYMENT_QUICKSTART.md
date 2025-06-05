# Deployment Quick Start

## First Time Setup

1. **Extract your personal data** (one time only):
   ```bash
   npm run db:extract-personal
   ```
   This saves your personal notes to `data/personal-data.json` (gitignored)

2. **Create production database**:
   ```bash
   npm run db:create-prod
   ```
   This creates `journey-public.db` with all personal data removed

3. **Verify the production database**:
   - The script automatically verifies no sensitive data remains
   - Check the console output for any warnings

## Deployment Steps

### Option A: Deploy with Shipped Database (Simplest)

1. **Add production database to git**:
   ```bash
   git add journey.prod.db
   git commit -m "Add production database"
   ```

2. **Update database path for production**:
   ```typescript
   // lib/db/index.ts
   const DB_PATH = process.env.NODE_ENV === 'production'
     ? './journey-public.db'  // Use production database
     : './journey-dev.db'       // Use dev database with personal data
   ```

3. **Deploy to Vercel**:
   - Connect GitHub repo to Vercel
   - Deploy!

### Option B: Deploy with Remote Database

See `docs/DEPLOYMENT_GUIDE.md` for Turso/PlanetScale setup

## Maintaining Your Dev Environment

After database updates or migrations:
```bash
# Re-extract personal data if needed
npm run db:extract-personal

# Or re-apply existing personal data
npm run db:apply-personal
```

## What Gets Removed

✅ **Completely removed:**
- All user tables (users, progress, completions)
- Any authentication data

✅ **Fields nullified:**
- `entities.personal_note` (your mentor ratings)
- `ideas.quality_rating` (internal scores)

✅ **Kept intact:**
- All public content
- Topic connections
- Journey structure
- Personal mode content (it's a feature!)
- AI prompts (helpful for understanding the assistant)
- Idea warnings (useful content disclaimers)

## Safety Checks

The production script automatically:
- Creates a timestamped backup
- Verifies all sensitive data is removed
- Checks for email patterns and personal keywords
- Shows before/after file sizes

## Questions?

- Personal data location: `data/personal-data.json`
- Production database: `journey-public.db`
- Backups: `journey-dev.db.backup-[timestamp]`