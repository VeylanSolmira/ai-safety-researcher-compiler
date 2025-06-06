# Dual Deployment Strategy: Vercel + GitHub Pages

## Why Two Deployments?

### 1. Vercel Deployment (Primary)
- **Full-featured**: API routes, dynamic content, server-side rendering
- **Database queries**: Real-time data from SQLite
- **URL**: Your custom domain or Vercel URL
- **Use case**: Main production site with all features

### 2. GitHub Pages (Secondary)
- **Static only**: Pre-rendered content, no API routes
- **Free hosting**: No usage limits for public repos
- **URL**: https://veylansolmira.github.io/ai-safety-researcher-compiler/
- **Use cases**:
  - Backup/mirror site
  - Read-only version for high traffic
  - Archival purposes
  - Cost reduction (free vs Vercel's limits)

## Benefits of Dual Deployment

1. **Redundancy**: If Vercel is down, static version still accessible
2. **Cost optimization**: Static content served free from GitHub
3. **Performance**: GitHub Pages CDN for static assets
4. **Development preview**: Test static export without affecting main site

## How They Work Together

```
Push to main branch
    ↓
┌─────────────────┬──────────────────┐
│ Vercel (Auto)   │ GitHub Actions   │
│ - Full build    │ - Static export  │
│ - All features  │ - Content only   │
│ - example.com   │ - github.io/...  │
└─────────────────┴──────────────────┘
```

## Alternatives

If you only want ONE deployment:

### Option A: Vercel Only (Current)
- Delete `.github/workflows/deploy-static.yml`
- Keep using Vercel for everything
- No changes needed

### Option B: GitHub Pages Only
- Disconnect Vercel integration
- Lose API routes and dynamic features
- Free hosting but limited functionality

### Option C: Conditional Deployment
- Modify workflow to only deploy to GitHub Pages on tags/releases
- Keep Vercel for main development
- Use GitHub Pages for stable versions

## Recommendation

Keep both if:
- You want a free backup/mirror
- You might exceed Vercel's free tier
- You want to test static export regularly

Remove GitHub Pages workflow if:
- You're happy with Vercel alone
- You don't need static export
- You want simpler deployment