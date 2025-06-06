# Dynamic API Routes Fix Proposal

## Problem Statement

The production build is failing because several API routes are trying to access request-specific data (`request.url`, `searchParams`) during the static generation phase. During build time, there's no actual HTTP request, causing these accesses to fail.

## Affected Routes

The following 8 API routes are causing build failures:

1. `/api/community-profiles` - accessing `request.url`
2. `/api/entities` - accessing `request.url`
3. `/api/experiments` - accessing `nextUrl.searchParams`
4. `/api/ideas` - accessing `nextUrl.searchParams`
5. `/api/explorations` - accessing `nextUrl.searchParams`
6. `/api/journey/search` - accessing `request.url`
7. `/api/case-studies` - accessing `nextUrl.searchParams`
8. `/api/news` - accessing `nextUrl.searchParams`

## Root Cause

Next.js 14's App Router attempts to optimize routes by pre-rendering them during build. When a page component calls an API route, Next.js tries to execute that API route at build time to generate static content. However, request-specific properties don't exist during this phase.

## Proposed Solutions

### Option 1: Force Dynamic Mode (Recommended - Short Term)
Add `export const dynamic = 'force-dynamic'` to each affected API route.

**Pros:**
- Simple, one-line fix per route
- Maintains current architecture
- Quick to implement and test
- No refactoring needed

**Cons:**
- Routes won't be optimized/cached
- Slightly slower response times
- Not the "Next.js way" long-term

### Option 2: Make Routes Static-Compatible
Add build-time checks and return default data when request properties are unavailable.

**Pros:**
- Allows some static optimization
- More control over build behavior

**Cons:**
- More complex implementation
- Need to handle edge cases
- May return unexpected data during build

### Option 3: Direct Database Access in Pages
Refactor pages to directly import and use database queries instead of calling API routes.

**Pros:**
- Best performance
- True static generation
- Most aligned with Next.js patterns
- Eliminates unnecessary API calls

**Cons:**
- Requires significant refactoring
- Changes application architecture
- More time-intensive

## Implementation Plan

### Phase 1: Immediate Fix (Today)
1. Add `export const dynamic = 'force-dynamic'` to all 8 affected routes
2. Test build locally
3. Deploy to production

### Phase 2: Analysis (Next Sprint)
1. Measure performance impact
2. Identify which routes could benefit from static generation
3. Prioritize routes for refactoring

### Phase 3: Long-term Migration (Future)
1. Gradually refactor high-traffic routes to use direct DB access
2. Implement caching strategies where appropriate
3. Document new patterns for future development

## Code Example

```typescript
// Before (causes build error)
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url) // ❌ Fails during build
  // ... rest of logic
}

// After (forces dynamic execution)
import { NextResponse } from 'next/server'

// This tells Next.js to always run this route dynamically
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url) // ✅ Works because route is dynamic
  // ... rest of logic
}
```

## Testing Strategy

1. Add the fix to one route first
2. Run `npm run build` locally
3. Verify that specific error disappears
4. Apply to all routes
5. Full build test
6. Deploy to staging/preview
7. Production deployment

## Monitoring

After deployment:
- Monitor API response times
- Check for any timeout issues
- Track build times
- Gather performance metrics for future optimization decisions

## Decision

**Proceeding with Option 1** as it provides the fastest path to fixing the production deployment issue while maintaining current functionality.

## Status

- [x] Implementation started
- [x] Local testing completed  
- [x] Deployed to production ✅ Both GitHub Actions and Vercel deployments successful!
- [ ] Performance monitoring in place
- [ ] Phase 2 analysis scheduled

## Implementation Results

### What was done:
1. Added `export const dynamic = 'force-dynamic'` to all 8 affected API routes
2. Fixed database schema issues (added missing columns: learning_objectives, practical_components)
3. Updated git hooks for better pre-push validation
4. Successfully deployed to production

### Deployment Success:
- GitHub Actions build: ✅ Passed
- Vercel deployment: ✅ Successful
- All API routes now working correctly in production
- No more "Dynamic server usage" errors during build

### Next Steps:
1. Monitor API performance in production
2. Add content for new database columns (learning objectives and practical components)
3. Consider Phase 3 refactoring for high-traffic routes in future sprints