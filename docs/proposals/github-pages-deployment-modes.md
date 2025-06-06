# GitHub Pages Deployment Modes Explained

## The Two GitHub Pages Deployment Modes

### 1. "Deploy from a branch" (What you configured)
- Serves files directly from your repository
- Expects static HTML/CSS/JS files already in the repo
- Works great for Jekyll sites or pre-built static files
- **Problem**: Your repo contains Next.js source code, not built static files

### 2. "GitHub Actions" (What we need)
- Builds your site first, then deploys
- Allows for build steps (npm install, next build, etc.)
- Deploys the built output, not source code
- **Solution**: Builds your Next.js app into static files, then serves those

## Why Your Current Setup Won't Work

Your repository structure:
```
/
├── app/          ← Next.js source code (not deployable)
├── components/   ← React components (need compilation)
├── package.json  ← Needs npm install & build
└── ...
```

What GitHub Pages needs:
```
/
├── index.html    ← Ready-to-serve HTML
├── styles.css    ← Compiled CSS
├── script.js     ← Bundled JavaScript
└── ...
```

## The Workflow's Purpose

The GitHub Actions workflow:
1. Checks out your code
2. Installs dependencies (`npm install`)
3. Builds the static site (`npm run export`)
4. Creates the `/out` folder with static HTML/CSS/JS
5. Deploys that `/out` folder to GitHub Pages

Without the workflow, GitHub Pages would try to serve your raw source code, resulting in errors.

## Alternative: Manual Build & Commit

Without a workflow, you'd have to:
1. Run `npm run export` locally
2. Commit the entire `/out` folder to your repo
3. Configure GitHub Pages to serve from `/out` directory
4. Repeat this manually for every change

This is impractical and bloats your repository with generated files.

## Summary

**You need the workflow because:**
- Your code needs to be built before it can be served
- GitHub Pages "Deploy from branch" mode doesn't build anything
- The workflow automates: install → build → deploy
- Without it, visitors would see Next.js source code, not a working website