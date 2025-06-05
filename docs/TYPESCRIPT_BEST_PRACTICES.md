# TypeScript Best Practices for Small Projects

## Philosophy: Perfect is the Enemy of Shipped

This guide captures lessons learned from our alpha deployment. For small projects and prototypes, some type looseness is acceptable while exploring ideas. The key is knowing when to tighten things up.

## When to Be Strict vs. Loose

### During Prototyping (Loose is OK)
- Exploring new features
- Rapid iteration
- Learning new APIs
- One-off scripts

### When Deploying (Time to Tighten)
- First production deployment
- Adding team members
- Refactoring core systems
- Building reusable components

## Immediate Wins for Type Safety

### 1. Pre-commit Type Checking
Add to `package.json`:
```json
{
  "scripts": {
    "pre-commit": "npm run type-check && npm run lint",
    "pre-push": "npm run lint && npm run type-check && npm run build"
  }
}
```

Then set up git hooks:
```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run pre-commit
```

### 2. VS Code Real-time Feedback
Create `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 3. Gradual Strictness
Start loose, tighten over time in `tsconfig.json`:

```json
{
  "compilerOptions": {
    // Phase 1: Basics (Start here)
    "strict": false,
    "skipLibCheck": true,
    
    // Phase 2: Catch common errors (After MVP)
    "noImplicitAny": true,
    "strictNullChecks": true,
    
    // Phase 3: Code quality (Before team scaling)
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## Common Patterns to Prevent Type Errors

### 1. Type Database Queries
```typescript
// Bad
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id)

// Good
interface User {
  id: string
  name: string
  email: string
}
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
```

### 2. Type API Responses
```typescript
// Bad
const data = await response.json()

// Good
interface ApiResponse {
  users: User[]
  total: number
}
const data: ApiResponse = await response.json()
```

### 3. Use Unknown Instead of Any
```typescript
// Bad
catch (error: any) {
  console.error(error.message)
}

// Good
catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

## What We Did Right

- ✅ **Started with TypeScript** - Not adding it later
- ✅ **Caught issues before users** - This IS "sooner"
- ✅ **Have automated checks** - Infrastructure exists
- ✅ **Small codebase** - Easier to fix now than later

## Lessons Learned

1. **Move fast during exploration** - Don't let types slow down prototyping
2. **Tighten before deployment** - Add strictness when stabilizing
3. **Fix incrementally** - Don't try to fix all type errors at once
4. **Document patterns** - Share solutions for common type issues

## Quick Wins Checklist

When preparing for deployment:

- [ ] Run `npm run type-check` and fix errors
- [ ] Add type-check to pre-push hook
- [ ] Type all database queries
- [ ] Type all API routes
- [ ] Remove all `any` types (use `unknown` if needed)
- [ ] Enable `noImplicitAny` in tsconfig
- [ ] Set up VS Code for real-time feedback

## Remember

> "For an alpha/prototype, some type looseness is actually fine! You were moving fast, exploring ideas. Now that you're deploying, tightening up makes sense."

The goal is to ship and iterate, not to have perfect types from day one.