// Feature flags for gradual database migration

export type FeatureFlag = 'USE_DATABASE_FOR_JOURNEY' | 'USE_DATABASE_FOR_PROGRESS' | 'USE_DATABASE_FOR_RESOURCES'

// Environment-based flags (can be set in .env)
const FLAGS: Record<FeatureFlag, boolean> = {
  USE_DATABASE_FOR_JOURNEY: process.env.NEXT_PUBLIC_USE_DATABASE_FOR_JOURNEY === 'true',
  USE_DATABASE_FOR_PROGRESS: process.env.NEXT_PUBLIC_USE_DATABASE_FOR_PROGRESS === 'true',
  USE_DATABASE_FOR_RESOURCES: process.env.NEXT_PUBLIC_USE_DATABASE_FOR_RESOURCES === 'true',
}

// Runtime flag checking
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  // Could also check user preferences, A/B test groups, etc.
  return FLAGS[flag] ?? false
}

// For development/testing
export function setFeatureFlag(flag: FeatureFlag, enabled: boolean): void {
  FLAGS[flag] = enabled
}

// Get all flags (useful for debugging)
export function getAllFlags(): Record<FeatureFlag, boolean> {
  return { ...FLAGS }
}