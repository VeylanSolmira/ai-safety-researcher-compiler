'use client'

import { useState, useEffect } from 'react'
import type { Tier, Module, Topic } from '@/lib/journey'

interface JourneyData {
  tiers: Tier[]
  loading: boolean
  error: Error | null
}

export function useJourneyData() {
  const [data, setData] = useState<JourneyData>({
    tiers: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    async function loadData() {
      try {
        // Always use API endpoint - database is the only source
        const response = await fetch('/api/journey/tiers')
        if (!response.ok) throw new Error('Failed to fetch tiers')
        const tiers = await response.json()
        setData({
          tiers,
          loading: false,
          error: null
        })
      } catch (error) {
        setData({
          tiers: [],
          loading: false,
          error: error as Error
        })
      }
    }

    loadData()
  }, [])

  return {
    ...data,
    data: data.tiers // Also expose as 'data' for components expecting this format
  }
}

export function useTierData(tierId: string) {
  const [tier, setTier] = useState<Tier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTier() {
      try {
        setLoading(true)
        
        // Always use API endpoint - database is the only source
        const response = await fetch(`/api/journey/tiers/${tierId}`)
        if (!response.ok) throw new Error('Failed to fetch tier')
        const tier = await response.json()
        setTier(tier)
        
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (tierId) {
      loadTier()
    }
  }, [tierId])

  return { tier, loading, error }
}

export function useTopicData(topicId: string) {
  const [data, setData] = useState<{
    topic: Topic | null
    tier: Tier | null
    module: Module | null
  }>({
    topic: null,
    tier: null,
    module: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTopic() {
      try {
        setLoading(true)
        
        // Always use API endpoint - database is the only source
        const response = await fetch(`/api/journey/topics/${topicId}`)
        if (!response.ok) throw new Error('Failed to fetch topic')
        const data = await response.json()
        // API returns topic with nested tier and module
        setData({
          topic: data,
          tier: data.tier,
          module: data.module
        })
        
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (topicId) {
      loadTopic()
    }
  }, [topicId])

  return { 
    topic: data.topic, 
    tier: data.tier, 
    module: data.module, 
    loading, 
    error 
  }
}

// Hook for search functionality
export function useTopicSearch(query: string) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const searchTopics = async () => {
      setLoading(true)
      try {
        // Always use API endpoint - database is the only source
        const response = await fetch(`/api/journey/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Search failed')
        const results = await response.json()
        setResults(results)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchTopics, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return { results, loading }
}