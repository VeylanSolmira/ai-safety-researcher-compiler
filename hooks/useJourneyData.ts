'use client'

import { useState, useEffect } from 'react'
import type { Tier, Module, Topic } from '@/lib/journey'

// Check if we should use database
const USE_DATABASE = process.env.NEXT_PUBLIC_USE_DATABASE_FOR_JOURNEY === 'true'

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
        if (USE_DATABASE) {
          // Use API endpoint when database is enabled
          const response = await fetch('/api/journey/tiers')
          if (!response.ok) throw new Error('Failed to fetch tiers')
          const tiers = await response.json()
          setData({
            tiers,
            loading: false,
            error: null
          })
        } else {
          // Fallback to file import
          const { journeyTiers } = await import('@/lib/journey')
          setData({
            tiers: journeyTiers,
            loading: false,
            error: null
          })
        }
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
        
        if (USE_DATABASE) {
          const response = await fetch(`/api/journey/tiers/${tierId}`)
          if (!response.ok) throw new Error('Failed to fetch tier')
          const tier = await response.json()
          setTier(tier)
        } else {
          // Fallback to file import
          const { journeyTiers } = await import('@/lib/journey')
          const foundTier = journeyTiers.find(t => t.id === tierId)
          setTier(foundTier || null)
        }
        
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
        
        if (USE_DATABASE) {
          const response = await fetch(`/api/journey/topics/${topicId}`)
          if (!response.ok) throw new Error('Failed to fetch topic')
          const data = await response.json()
          setData({
            topic: data.topic,
            tier: data.tier,
            module: data.module
          })
        } else {
          // Fallback to file import
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
        }
        
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
        if (USE_DATABASE) {
          const response = await fetch(`/api/journey/search?q=${encodeURIComponent(query)}`)
          if (!response.ok) throw new Error('Search failed')
          const results = await response.json()
          setResults(results)
        } else {
          // Fallback to file import
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
        }
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