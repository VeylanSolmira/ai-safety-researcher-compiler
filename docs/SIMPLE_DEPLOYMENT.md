# Simple Deployment Options

## Option 1: Vercel with SQLite (Quickest Start)

Since you already have a GitHub repo, you can deploy to Vercel in minutes:

### Limitations
- SQLite database resets on each deployment (not persistent)
- Good for demo/preview, not for production with user data

### Steps
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Deploy!

### Make it Work Better
Add a build step to initialize your database:

```json
// package.json
{
  "scripts": {
    "build": "npm run db:init && npm run db:migrate && next build"
  }
}
```

## Option 2: GitHub Codespaces (Development Preview)

Perfect for sharing with collaborators:

1. Add devcontainer config:
```json
// .devcontainer/devcontainer.json
{
  "name": "AI Safety Research Compiler",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "postCreateCommand": "npm install && npm run db:setup",
  "forwardPorts": [3000]
}
```

2. Collaborators can run your app in browser via Codespaces

## Option 3: Render.com (Free Tier with Persistent SQLite)

Best free option for SQLite persistence:

1. Create account at [render.com](https://render.com)
2. New > Web Service > Connect GitHub repo
3. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. Add Disk:
   - Mount Path: `/var/data`
   - Size: 1GB (free tier)
5. Update your database path:
   ```javascript
   const DB_PATH = process.env.NODE_ENV === 'production' 
     ? '/var/data/journey-public.db'
     : './journey-dev.db'
   ```

## Option 4: Keep It Simple - Ship the Database

For an educational tool where data doesn't change often:

1. **Include a pre-built database in your repo:**
   ```bash
   # Create a production database
   cp journey-dev.db journey-public.db
   git add journey-public.db
   git commit -m "Add production database"
   ```

2. **Update your database code:**
   ```javascript
   // lib/db/index.ts
   const DB_PATH = process.env.NODE_ENV === 'production'
     ? path.join(process.cwd(), 'journey-public.db')
     : path.join(process.cwd(), 'journey-dev.db')
   ```

3. **Remove journey-public.db from .gitignore**

4. **Deploy to Vercel normally**

### Pros:
- Super simple
- No external database needed
- Perfect for read-heavy educational content
- Version control for your content

### Cons:
- Can't save user data persistently
- Database updates require new deployment
- Larger repository size

## My Recommendation

For your use case (educational platform with mostly static content):

1. **Start with Option 4** (ship the database)
   - Fastest to deploy
   - No external dependencies
   - Perfect for getting feedback

2. **Later, upgrade to Turso/PlanetScale** when you need:
   - User accounts
   - Progress tracking
   - Dynamic content updates
   - Multiple contributors

Would you like me to help you implement any of these options?