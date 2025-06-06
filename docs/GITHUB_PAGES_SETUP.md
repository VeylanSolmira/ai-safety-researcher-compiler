# GitHub Pages Setup Guide

## Current Configuration Status

✅ **Repository Settings**: You've already enabled GitHub Pages with `main` branch and `/root` directory
✅ **Next.js Config**: Updated with correct `basePath` and `assetPrefix` for your repository
✅ **GitHub Actions**: Workflow created to automatically build and deploy on push to main
✅ **Export Script**: Already exists in package.json (`npm run export`)

## What Happens Next

1. **Commit and Push** these changes:
   - Updated `next.config.js` with basePath
   - New `.github/workflows/deploy-static.yml` workflow

2. **GitHub Actions will automatically**:
   - Build your static site on every push to main
   - Deploy it to GitHub Pages

3. **Important**: After first deployment, update GitHub Pages settings:
   - Go to Settings → Pages
   - Change "Source" from "Deploy from a branch" to "GitHub Actions"
   - This enables the workflow-based deployment

## Your Site URL

Once deployed, your site will be available at:
```
https://veylansolmira.github.io/ai-safety-researcher-compiler/
```

## Limitations with Static Export

When using GitHub Pages (static export), these features won't work:
- API routes (they'll return 404)
- Dynamic routes with `getServerSideProps`
- Image optimization (using unoptimized images instead)
- Incremental Static Regeneration
- Authentication features

## Current Workarounds

The codebase already handles this with:
1. **Force-dynamic API routes**: Won't be included in static export
2. **Database content**: Pre-rendered at build time
3. **Feature flags**: Can disable dynamic features for static builds

## Monitoring Deployment

1. Check GitHub Actions tab for build status
2. First deployment might take 10-15 minutes to propagate
3. Subsequent deployments are usually faster (2-5 minutes)

## Rollback Strategy

If you need to continue using Vercel exclusively:
1. Delete `.github/workflows/deploy-static.yml`
2. Comment out `basePath` and `assetPrefix` in `next.config.js`
3. Keep GitHub Pages disabled or point it elsewhere