# Feature Flags Migration Strategy

## Why Feature Flags?

Feature flags allow us to:
1. **Test in production** without risk
2. **Roll back instantly** if issues arise
3. **A/B test** database vs file performance
4. **Gradual rollout** to subsets of users

## Implementation Phases

### Phase 1: Development Testing
```env
# .env.local
NEXT_PUBLIC_USE_DATABASE_FOR_JOURNEY=false
NEXT_PUBLIC_USE_DATABASE_FOR_PROGRESS=false
NEXT_PUBLIC_USE_DATABASE_FOR_RESOURCES=false
```

### Phase 2: Internal Testing (10% rollout)
```typescript
// Advanced flag with percentage rollout
export function isFeatureEnabled(flag: FeatureFlag, userId?: string): boolean {
  // Use consistent hashing for user-based rollout
  if (userId) {
    const hash = simpleHash(userId + flag)
    const percentage = getFeatureRolloutPercentage(flag)
    return (hash % 100) < percentage
  }
  return FLAGS[flag] ?? false
}
```

### Phase 3: Canary Release (50% rollout)
- Monitor performance metrics
- Compare token usage
- Check error rates
- Gather user feedback

### Phase 4: Full Release (100%)
- Enable for all users
- Keep flags for emergency rollback

### Phase 5: Cleanup
- Remove file imports
- Delete feature flags
- Optimize database queries

## Usage Examples

### Component Level
```typescript
function JourneyPage() {
  const dbEnabled = isFeatureEnabled('USE_DATABASE_FOR_JOURNEY')
  
  return (
    <div>
      {dbEnabled && (
        <div className="text-xs text-green-600">
          ⚡ Using database
        </div>
      )}
      {/* Rest of component */}
    </div>
  )
}
```

### API Level
```typescript
export async function GET(request: Request) {
  if (isFeatureEnabled('USE_DATABASE_FOR_JOURNEY')) {
    // Database query
    const tiers = await getAllTiersFromDb()
    return Response.json(tiers)
  } else {
    // File import
    return Response.json(journeyTiers)
  }
}
```

### Debug Panel
```typescript
function DebugPanel() {
  const flags = getAllFlags()
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 p-4 rounded">
      <h3>Feature Flags</h3>
      {Object.entries(flags).map(([flag, enabled]) => (
        <div key={flag}>
          {flag}: {enabled ? '✅' : '❌'}
        </div>
      ))}
    </div>
  )
}
```

## Monitoring

Track these metrics during rollout:
1. **Performance**
   - Page load times
   - API response times
   - Database query times

2. **Reliability**
   - Error rates
   - Fallback activations
   - Database connection failures

3. **Usage**
   - Token consumption
   - Database queries/second
   - Cache hit rates

## Emergency Rollback

If issues arise:
1. Set all flags to `false` in environment
2. Redeploy (or use runtime flag service)
3. All users instantly revert to file-based system

## Benefits

1. **Zero downtime** migration
2. **Risk mitigation** - can test with real users
3. **Performance validation** - measure actual improvements
4. **User experience** - no disruption during migration
5. **Confidence** - gradual rollout builds confidence

## Next Steps

1. Add `.env.local` with flags set to `false`
2. Update components to check flags
3. Create monitoring dashboard
4. Plan rollout schedule
5. Document rollback procedures