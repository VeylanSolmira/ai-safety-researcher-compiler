# Deployment Safety Guide

This guide consolidates all safety measures for protecting personal data during deployment.

## Overview

The AI Safety Research Compiler uses a dual-database approach:
- **`journey-dev.db`** - Development database containing all data including personal notes
- **`journey-public.db`** - Production database with personal data removed

## Related Documentation

- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) - Comprehensive deployment options
- [`SIMPLE_DEPLOYMENT.md`](./SIMPLE_DEPLOYMENT.md) - Quick deployment options
- [`DEPLOYMENT_QUICKSTART.md`](../DEPLOYMENT_QUICKSTART.md) - Quick reference guide
- [`DATA_PRIVACY_STRATEGY.md`](./DATA_PRIVACY_STRATEGY.md) - Detailed privacy strategy
- [`DATABASE_PATTERNS.md`](./DATABASE_PATTERNS.md) - Database interaction patterns

## Safety Measures Implemented

### 1. Pre-commit Hook (`.git/hooks/pre-commit`)

Automatically prevents committing sensitive databases:

```bash
# Blocks commits of:
- journey-dev.db (development database)
- journey.db (legacy name)

# Warns when committing any .db file
# Validates production database if being committed
```

**Location**: `.git/hooks/pre-commit`
**Status**: ✅ Active (created and made executable)

### 2. Database Sanitization Script

**Command**: `npm run db:create-prod`
**Script**: `scripts/create-production-db.ts`

#### What Gets Removed:
- ❌ **User tables**: `users`, `user_progress`, `user_completions`, `user_choices`
- ❌ **Personal notes**: `entities.personal_note` (your mentor ratings)
- ❌ **Quality ratings**: `ideas.quality_rating` (internal scores)
- ❌ **Timeline data**:
  - ALL rows from `time_blocks` (personal planning data)
  - ALL rows from `timeline_items` (personal tasks/notes)
  - Private rows from `timeline_templates` (where `is_public = 0`)

#### What Gets Kept:
- ✅ All public content
- ✅ AI prompts (helpful for users)
- ✅ Idea warnings (useful disclaimers)
- ✅ Personal mode content (it's a feature)
- ✅ Public timeline templates only (like MATS application template)

### 3. Production Database Validation

**Command**: `npm run db:validate-prod`
**Script**: `scripts/validate-prod-db.ts`

Validates that:
- Forbidden tables are removed
- Personal fields are nullified
- No real user IDs in timeline tables
- Checks for suspicious patterns (may have false positives)

### 4. Personal Data Extraction

**Command**: `npm run db:extract-personal`
**Script**: `scripts/extract-personal-data.ts`

Extracts your personal data to:
- `data/personal-data.json` (gitignored)
- `journey-personal.db` (gitignored)

Can be re-applied with: `npm run db:apply-personal`

### 5. GitHub Actions Workflow

**Location**: `.github/workflows/deploy.yml`
**Status**: Created but not active until pushed

Automated deployment that:
- Creates production database
- Validates it's clean
- Builds and deploys
- Optional: Auto-commits updated prod database

## Deployment Workflow

### Manual Deployment (Current Setup)

1. **Extract personal data** (one-time):
   ```bash
   npm run db:extract-personal
   ```

2. **Create production database**:
   ```bash
   npm run db:create-prod
   ```

3. **Validate it's clean**:
   ```bash
   npm run db:validate-prod
   ```

4. **Commit and deploy**:
   ```bash
   git add journey-public.db
   git commit -m "Update production database"
   git push
   ```

### Automated Deployment (When Ready)

Push `.github/workflows/deploy.yml` to activate automated:
- Testing
- Database sanitization
- Validation
- Deployment

## What Personal Data Is Protected

### From Entities Table
- **Personal notes/ratings**: "Rating: 8/10", personal evaluations
- Example: Mentor assessments and subjective opinions

### From Ideas Table  
- **Quality ratings**: Internal 1-5 scores
- **Warnings**: Now kept as they're useful disclaimers

### From Timeline Tables
- **ALL time_blocks**: Complete table wipe (contains user planning data)
- **ALL timeline_items**: Complete table wipe (contains personal tasks/notes)
- **Private timeline_templates**: Only private templates removed
- Keeps: Public templates only (is_public = 1)

### From User Tables
- **All user data**: Authentication, progress, completions
- These tables are completely removed

## Common Tasks

### Update Content Without Losing Personal Data
```bash
# Make content changes to journey-dev.db
npm run db:extract-personal    # Save personal data
npm run db:create-prod         # Create clean prod db
npm run db:apply-personal      # Restore personal data to dev
```

### Verify Production Database Is Safe
```bash
npm run db:validate-prod
```

### Check What Would Be Committed
```bash
git add journey-public.db
git diff --cached --stat
```

## Security Best Practices

1. **Never commit `journey-dev.db`** - The pre-commit hook blocks this
2. **Always validate before deploying** - Run `npm run db:validate-prod`
3. **Keep backups** - Script auto-creates timestamped backups
4. **Review warnings** - Some "personal" patterns are false positives (e.g., "personal AI assistant" in content)

## Troubleshooting

### Pre-commit Hook Not Working
```bash
chmod +x .git/hooks/pre-commit
```

### Validation Warnings About NOTE:/TODO:
These are usually false positives from content placeholders, not personal notes.

### Personal Data Not Restoring
Ensure `data/personal-data.json` exists and run:
```bash
npm run db:apply-personal
```

## Future Improvements

1. **Database Renaming** (Completed):
   - `journey.db` → `journey-dev.db`
   - `journey.prod.db` → `journey-public.db`

2. **Automated Testing**:
   - Add tests for sanitization completeness
   - Integrate with CI/CD pipeline

3. **Enhanced Validation**:
   - Reduce false positive warnings
   - Add content hash verification