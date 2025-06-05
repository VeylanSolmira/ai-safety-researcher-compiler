'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import type { CourseHighlight } from '@/lib/db/course-highlights-queries'

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Track when component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Fetch highlights from API
  useEffect(() => {
    if (!mounted) return
    
    async function fetchHighlights() {
      try {
        const response = await fetch('/api/course-highlights')
        if (!response.ok) throw new Error('Failed to fetch highlights')
        const data = await response.json() as any
        setHighlights(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load highlights')
      } finally {
        setLoading(false)
      }
    }
    
    fetchHighlights()
  }, [mounted])
  
  // For now, treat the first 2 highlights as featured
  const featuredHighlights = highlights.slice(0, 2)
  const otherHighlights = highlights.slice(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <PageHeader 
          backLink={{ href: '/', label: 'Back to Home' }}
          showViewModeToggle={false}
        />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Highlights & Original Work
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deep dives, case studies, and original analysis on critical AI safety topics. 
            These pieces showcase in-depth exploration beyond the standard curriculum.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading highlights...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
        {/* Featured Highlights */}
        {featuredHighlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Featured</h2>
            <div className="grid gap-6">
              {featuredHighlights.map(highlight => (
                <Link
                  key={highlight.id}
                  href={(() => {
                    // Map highlight types to correct resource paths
                    const typeMap: Record<string, string> = {
                      'case-study': 'case-studies',
                      'experiment': 'experiments', 
                      'exploration': 'explorations'
                    }
                    const resourceType = typeMap[highlight.type] || highlight.type + 's'
                    return `/resources/${resourceType}/${highlight.id}`
                  })()}
                  className="block group"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {highlight.title}
                          </h3>
                          <span className="inline-block mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {highlight.type ? highlight.type.replace('-', ' ').toUpperCase() : 'CONTENT'}
                          </span>
                        </div>
                        <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {highlight.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {highlight.tags.map((tag: string) => (
                          <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Highlights */}
        {otherHighlights.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">More Work</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherHighlights.map(highlight => (
                <Link
                  key={highlight.id}
                  href={(() => {
                    // Map highlight types to correct resource paths
                    const typeMap: Record<string, string> = {
                      'case-study': 'case-studies',
                      'experiment': 'experiments', 
                      'exploration': 'explorations'
                    }
                    const resourceType = typeMap[highlight.type] || highlight.type + 's'
                    return `/resources/${resourceType}/${highlight.id}`
                  })()}
                  className="block group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {highlight.title}
                      </h3>
                      <span className="inline-block mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {highlight.type ? highlight.type.replace('-', ' ').toUpperCase() : 'CONTENT'}
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {highlight.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {highlight.tags.map((tag: string) => (
                      <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

          </>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Want to explore more?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            These highlights are integrated throughout the AI Safety Research journey. 
            Start the full curriculum to see how these pieces fit into the broader learning path.
          </p>
          <Link
            href="/journey"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105"
          >
            Start the Journey
          </Link>
        </div>
      </div>
    </div>
  )
}