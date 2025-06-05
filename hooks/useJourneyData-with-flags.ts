// Example: Journey data hook with feature flags

import { useState, useEffect } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { journeyTiers, Tier } from '@/lib/journey' // File-based data

export function useJourneyData() {
  const [data, setData] = useState<{
    tiers: Tier[]
    loading: boolean
    error: Error | null
  }>({
    tiers: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    async function loadData() {
      try {
        if (isFeatureEnabled('USE_DATABASE_FOR_JOURNEY')) {
          // Use database
          const response = await fetch('/api/journey/tiers')
          if (!response.ok) throw new Error('Failed to fetch')
          const tiers = await response.json()
          setData({ tiers, loading: false, error: null })
        } else {
          // Use file import (immediate, no loading needed)
          setData({ tiers: journeyTiers, loading: false, error: null })
        }
      } catch (error) {
        setData({ tiers: [], loading: false, error: error as Error })
        
        // Fallback to file if database fails
        console.error('Database failed, falling back to file import:', error)
        setData({ tiers: journeyTiers, loading: false, error: null })
      }
    }

    loadData()
  }, [])

  return data
}