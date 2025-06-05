# Deployment Guide for AI Safety Research Compiler

## Overview
This guide covers deploying a Next.js application with a SQLite database. Since SQLite is a file-based database, special considerations are needed for production deployment.

## Deployment Options

### Option 1: Vercel + Remote Database (Recommended for Production)
**Pros:** Scalable, automatic deployments, serverless
**Cons:** Requires migrating from SQLite to a hosted database

1. **Database Migration Options:**
   - **Turso** (SQLite-compatible edge database)
   - **PlanetScale** (MySQL-compatible)
   - **Neon** (PostgreSQL-compatible)
   - **Supabase** (PostgreSQL with additional features)

2. **Steps:**
   ```bash
   # 1. Install Vercel CLI
   npm install -g vercel
   
   # 2. Link to GitHub repo
   vercel link
   
   # 3. Set up environment variables
   vercel env add DATABASE_URL
   ```

3. **Database Setup (Turso example):**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Create database
   turso db create ai-safety-journey
   
   # Get connection URL
   turso db show ai-safety-journey --url
   ```

### Option 2: Railway/Render with Persistent Storage
**Pros:** Supports SQLite with persistent volumes, easy deployment
**Cons:** Limited free tier, requires volume management

1. **Railway Setup:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Initialize project
   railway login
   railway init
   ```

2. **Add persistent volume for SQLite:**
   ```json
   // railway.json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm run start",
       "restartPolicyType": "ON_FAILURE"
     },
     "volumes": [
       {
         "mount": "/data",
         "name": "sqlite-data"
       }
     ]
   }
   ```

### Option 3: VPS Deployment (DigitalOcean, AWS EC2, etc.)
**Pros:** Full control, SQLite works natively
**Cons:** Requires server management

1. **Setup Script:**
   ```bash
   #!/bin/bash
   # deploy.sh
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repo
   git clone https://github.com/YOUR_USERNAME/ai-safety-research-compiler.git
   cd ai-safety-research-compiler
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "ai-safety" -- start
   pm2 save
   pm2 startup
   ```

### Option 4: GitHub Pages + Static Export (Limited Functionality)
**Pros:** Free, simple
**Cons:** No server-side functionality, no database queries

This would require converting to a fully static site, which isn't suitable for your dynamic content.

## Recommended Approach: Vercel + Turso

### Step-by-Step Implementation:

1. **Update database connection code:**
   ```typescript
   // lib/db/index.ts
   import { createClient } from '@libsql/client'
   
   const DB_URL = process.env.TURSO_DATABASE_URL || 'file:journey-dev.db'
   const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN
   
   export function getDatabase() {
     if (process.env.NODE_ENV === 'production') {
       return createClient({
         url: DB_URL,
         authToken: AUTH_TOKEN
       })
     }
     // Use local SQLite in development
     return new Database('./journey-dev.db')
   }
   ```

2. **Update package.json:**
   ```json
   {
     "scripts": {
       "db:push": "tsx scripts/push-to-turso.ts",
       "deploy": "npm run db:push && vercel --prod"
     }
   }
   ```

3. **Create migration script:**
   ```typescript
   // scripts/push-to-turso.ts
   import Database from 'better-sqlite3'
   import { createClient } from '@libsql/client'
   
   async function pushToTurso() {
     const local = new Database('./journey-dev.db')
     const remote = createClient({
       url: process.env.TURSO_DATABASE_URL!,
       authToken: process.env.TURSO_AUTH_TOKEN
     })
     
     // Export schema and data
     const dump = local.prepare('SELECT sql FROM sqlite_master').all()
     // ... migration logic
   }
   ```

## Environment Variables

Create `.env.production`:
```env
# Database
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Optional: Analytics, etc.
NEXT_PUBLIC_GA_ID=your-ga-id
```

## GitHub Actions for Continuous Deployment

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Data Management Strategy

### Option A: Include seed data in repo
1. Create `scripts/seed-production.ts`
2. Run during build process
3. Pros: Reproducible, version controlled
4. Cons: Large repo size

### Option B: Separate data repository
1. Create `ai-safety-journey-data` repo
2. Pull during deployment
3. Pros: Cleaner main repo
4. Cons: More complex deployment

### Option C: Admin interface
1. Build admin routes for content management
2. Deploy empty database
3. Populate via admin interface
4. Pros: Dynamic content management
5. Cons: More development work

## Next Steps

1. Choose deployment platform
2. Set up database solution
3. Update connection code
4. Configure CI/CD
5. Deploy!

## Quick Start (Vercel + Turso)

```bash
# 1. Create Turso database
turso db create ai-safety-journey

# 2. Get credentials
turso db show ai-safety-journey --url
turso db tokens create ai-safety-journey

# 3. Set up Vercel
vercel link
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN

# 4. Deploy
vercel --prod
```

## CI/CD Deployment Workflow

### Important Considerations

1. **Database Updates**: The production database needs to be regenerated whenever:
   - Content changes in `journey-dev.db`
   - New topics/entities are added
   - Structure changes

2. **CI/CD Note**: If using GitHub Actions with automatic database commits:
   - The action can automatically update `journey-public.db` in the repo
   - Use `[skip ci]` in commit messages to prevent infinite loops
   - Example: `git commit -m "Update production database [skip ci]"`

3. **Vercel Configuration**: If using Vercel with GitHub Actions, set these secrets in GitHub:
   - `VERCEL_TOKEN` - Get from Vercel dashboard
   - `VERCEL_ORG_ID` - Found in `.vercel/project.json` after `vercel link`
   - `VERCEL_PROJECT_ID` - Found in `.vercel/project.json` after `vercel link`

4. **Deployment Scripts**:
   - `npm run build:prod` - Creates production database and builds
   - `npm run deploy` - Runs the export process (for static sites)
   - Manual database update: `npm run db:create-prod`

### GitHub Actions Workflow
A GitHub Actions workflow is available at `.github/workflows/deploy.yml` that:
- Runs on pushes to main branch
- Creates sanitized production database
- Runs tests and type checking
- Deploys to Vercel (if configured)
- Optionally commits database updates back to repo