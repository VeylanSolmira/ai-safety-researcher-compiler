'use client'

import { useState, useEffect } from 'react'
import type { Tier, Module, Topic } from '@/lib/journey'

// Mock API calls for now - in production these would be actual API endpoints
// This demonstrates how components would use the database instead of importing files

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
    // In production, this would be an API call
    // For now, we'll import the file data as a fallback
    async function loadData() {
      try {
        // This would be: const response = await fetch('/api/journey/tiers')
        // const tiers = await response.json()
        
        // Temporary: import the file
        const { journeyTiers } = await import('@/lib/journey')
        setData({
          tiers: journeyTiers,
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
        // This would be: const response = await fetch(`/api/journey/tiers/${tierId}`)
        // const tier = await response.json()
        
        // Temporary: import and find
        const { journeyTiers } = await import('@/lib/journey')
        const foundTier = journeyTiers.find(t => t.id === tierId)
        
        setTier(foundTier || null)
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
        // This would be: const response = await fetch(`/api/journey/topics/${topicId}`)
        // const topic = await response.json()
        
        // Temporary: import and search
        const { journeyTiers } = await import('@/lib/journey')
        let foundTopic: Topic | null = null
        let foundTier: Tier | null = null
        let foundModule: Module | null = null
        
        for (const tier of journeyTiers) {
          for (const module of tier.modules) {
            const topic = module.topics.find(t => t.id === topicId)
            if (topic) {
              foundTopic = topic
              foundTier = tier
              foundModule = module
              break
            }
          }
          if (foundTopic) break
        }
        
        setData({
          topic: foundTopic,
          tier: foundTier,
          module: foundModule
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
        // This would be: const response = await fetch(`/api/journey/search?q=${query}`)
        // const results = await response.json()
        
        // Temporary: import and search
        const { journeyTiers } = await import('@/lib/journey')
        const searchResults: any[] = []
        
        for (const tier of journeyTiers) {
          for (const module of tier.modules) {
            for (const topic of module.topics) {
              if (
                topic.title.toLowerCase().includes(query.toLowerCase()) ||
                topic.description.toLowerCase().includes(query.toLowerCase())
              ) {
                searchResults.push({
                  id: topic.id,
                  title: topic.title,
                  description: topic.description,
                  moduleTitle: module.title,
                  tierTitle: tier.title
                })
              }
            }
          }
        }
        
        setResults(searchResults)
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