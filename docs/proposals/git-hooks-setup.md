# Git Hooks Setup Proposal

## Problem

The package.json has `pre-push` script defined but it doesn't actually run before pushing because git hooks aren't configured.

## Current State

```json
"scripts": {
  "pre-push": "npm run lint && npm run type-check && npm run build",
  // This exists but doesn't run automatically
}
```

## Solution: Install Husky

### Option 1: Full Husky Setup (Recommended)

```bash
# Install husky
npm install --save-dev husky

# Initialize husky (creates .husky directory)
npx husky init

# Add pre-push hook
npx husky add .husky/pre-push "npm run pre-push"
```

This will create `.husky/pre-push` file that runs before every push.

### Option 2: Lighter Weight - Simple Git Hook

Create `.git/hooks/pre-push`:
```bash
#!/bin/sh
echo "🔍 Running pre-push checks..."
npm run lint || exit 1
npm run type-check || exit 1
npm run build || exit 1
echo "✅ All checks passed!"
```

### Option 3: Just Pre-commit (Faster)

Instead of pre-push, use pre-commit for faster feedback:

```bash
npx husky add .husky/pre-commit "npm run lint && npm run type-check"
npx husky add .husky/pre-push "npm run build"
```

## Why Pre-push vs Pre-commit vs Pre-deploy

- **Pre-commit**: Runs on every commit (fast checks only - lint, types)
- **Pre-push**: Runs before push (can include build - slower but catches more)
- **Pre-deploy**: Only runs when YOU run `npm run deploy`

## Recommendation

1. Use pre-commit for lint/type-check (fast feedback)
2. Use pre-push for build (catch issues before CI/CD)
3. Let CI/CD be the final safety net

## Implementation

```bash
# Quick setup
npm install --save-dev husky
npx husky init
echo "npm run lint && npm run type-check" > .husky/pre-commit
echo "npm run build" > .husky/pre-push
chmod +x .husky/pre-commit .husky/pre-push
```

## Testing

```bash
# Test pre-commit
git add .
git commit -m "test" # Should run lint and type-check

# Test pre-push  
git push # Should run build
```