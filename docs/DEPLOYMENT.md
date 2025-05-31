# Deployment Guide

## GitHub Pages Deployment

This Next.js application is configured to be deployed as a static site on GitHub Pages.

### Prerequisites

1. A GitHub repository for your project
2. GitHub Pages enabled in your repository settings

### Deployment Options

#### Option 1: GitHub Pages (github.io)

**Pros:**
- Free hosting
- Automatic HTTPS
- Custom domain support
- GitHub Actions integration

**Cons:**
- Static sites only (no server-side features)
- Build time limitations
- 1GB storage limit

**Setup Steps:**

1. **Enable GitHub Pages in your repository:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: Select "gh-pages" (will be created by GitHub Actions)

2. **Configure base path (if needed):**
   If your site will be hosted at `https://username.github.io/repository-name/`:
   ```javascript
   // In next.config.js, uncomment these lines:
   basePath: '/ai-safety-research-compiler',
   assetPrefix: '/ai-safety-research-compiler',
   ```

3. **Push to main branch:**
   The GitHub Actions workflow will automatically:
   - Build the static site
   - Deploy to GitHub Pages

4. **Access your site:**
   - Personal/Org site: `https://username.github.io/`
   - Project site: `https://username.github.io/repository-name/`

### Alternative Hosting Options

#### Option 2: Vercel (Recommended for Next.js)

**Pros:**
- Built by Next.js creators
- Automatic deployments
- Preview deployments for PRs
- Serverless functions support
- Analytics included
- Free tier generous

**Setup:**
1. Connect GitHub repo to Vercel
2. Deploy with one click
3. Custom domain support

#### Option 3: Netlify

**Pros:**
- Easy setup
- Preview deployments
- Form handling
- Serverless functions
- Free tier available

**Setup:**
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `out`

#### Option 4: Cloudflare Pages

**Pros:**
- Fast global CDN
- Unlimited bandwidth
- Web analytics
- Free tier generous

**Setup:**
1. Connect GitHub repo
2. Build command: `npm run export`
3. Build output directory: `out`

### Current Configuration

The project uses conditional static export:
- **Development**: Regular Next.js with dynamic features
- **Production**: Static export when `STATIC_EXPORT=true`
- No API routes (all client-side)
- localStorage for data persistence
- Static roadmap data

This approach allows:
- Full Next.js features during development (rewrites, dynamic routes)
- Static export capability for GitHub Pages deployment
- Flexibility to deploy to any platform

### Build and Test Locally

```bash
# Build static site
npm run export

# Preview the static build
npx serve out

# The site will be available at http://localhost:3000
```

### Limitations of Static Export

1. **No dynamic routes with server-side logic**
   - Our dynamic routes work because they're pre-rendered

2. **No API routes**
   - All data must be available at build time

3. **No image optimization**
   - Images are served as-is (configured with `unoptimized: true`)

4. **Client-side only features**
   - Progress tracking uses localStorage
   - No user authentication
   - No server-side data fetching

### Troubleshooting

**404 errors on refresh:**
- GitHub Pages doesn't support client-side routing by default
- Solution: Use hash routing or create a custom 404.html

**Assets not loading:**
- Check if basePath is correctly configured
- Ensure all paths are relative

**Build failures:**
- Check GitHub Actions logs
- Ensure all dependencies are in package.json
- Test build locally first