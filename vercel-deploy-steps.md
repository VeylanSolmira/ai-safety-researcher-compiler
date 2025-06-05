# Vercel Deployment Steps

After logging in with `vercel login`, follow these steps:

## 1. Link your project
```bash
vercel link
```

When prompted:
- "Set up and deploy": Choose this for new project
- Select your scope (your username)
- "Link to existing project?": No (create new)
- "What's your project's name?": ai-safety-research-compiler (or your choice)
- "In which directory is your code located?": ./ (current directory)
- Auto-detected framework: Next.js

## 2. Deploy to production
```bash
vercel --prod
```

This will:
- Upload your files (including journey-public.db)
- Build your Next.js app
- Deploy to production

## 3. Your app will be available at:
- `https://[project-name].vercel.app`
- You'll see the URL in the terminal output

## 4. Set up automatic deployments (optional)
```bash
vercel git
```

This connects your GitHub repo for automatic deployments on push.

## Troubleshooting

If you see database errors:
1. Make sure `journey-public.db` exists
2. Check that `lib/db/index.ts` uses the right path
3. Verify NODE_ENV is set to 'production' on Vercel

## Environment Variables (if needed)
```bash
vercel env add NODE_ENV
# Enter: production
```