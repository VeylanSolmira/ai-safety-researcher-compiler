'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import type { NewsStory } from '@/lib/db/news-queries'
import { 
  NewspaperIcon,
  CalendarIcon,
  TagIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

// Helper function for date formatting
function formatNewsDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch {
    return dateString
  }
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<NewsStory['category'] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [allStories, setAllStories] = useState<NewsStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch news stories from API
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) throw new Error('Failed to fetch news')
        const data = await response.json()
        setAllStories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news')
      } finally {
        setLoading(false)
      }
    }
    
    fetchNews()
  }, [])
  
  // Get categories with counts
  const categories = useMemo(() => {
    const categoryCounts = new Map<NewsStory['category'], number>()
    allStories.forEach(story => {
      const count = categoryCounts.get(story.category) || 0
      categoryCounts.set(story.category, count + 1)
    })
    return Array.from(categoryCounts.entries()).map(([category, count]) => ({ category, count }))
  }, [allStories])
  
  // Filter stories based on category and search
  const filteredStories = useMemo(() => {
    let stories = allStories
    
    // Filter by category
    if (selectedCategory !== 'all') {
      stories = stories.filter(story => story.category === selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      stories = stories.filter(story => 
        story.title.toLowerCase().includes(query) ||
        story.summary.toLowerCase().includes(query) ||
        story.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    return stories
  }, [allStories, selectedCategory, searchQuery])
  
  const categoryLabels: Record<NewsStory['category'], string> = {
    research: 'Research',
    policy: 'Policy',
    community: 'Community',
    technical: 'Technical',
    opportunity: 'Opportunity',
    general: 'General'
  }
  
  const categoryColors: Record<NewsStory['category'], string> = {
    research: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    policy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    community: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    opportunity: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/resources" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Resources
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <NewspaperIcon className="h-5 w-5" />
                News & Updates
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Safety News & Updates
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Stay informed about the latest developments in AI safety research, policy, and community initiatives.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <NewspaperIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <FunnelIcon className="h-4 w-4" />
              Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All ({allStories.length})
            </button>
            {categories.map(({ category, count }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? categoryColors[category]
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {categoryLabels[category]} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading news...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <NewspaperIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <NewspaperIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No news stories found matching your criteria.
              </p>
            </div>
          ) : (
            filteredStories.map((story) => (
              <Link
                key={story.id}
                href={`/resources/news/${story.id}`}
                className="block group"
              >
                <article className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {story.title}
                    </h3>
                    {story.featured && (
                      <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {story.summary}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      {formatNewsDate(story.date)}
                    </span>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[story.category]}`}>
                      {categoryLabels[story.category]}
                    </span>
                    
                    {story.source && (
                      <span className="text-gray-500 dark:text-gray-500">
                        via {story.source.name}
                      </span>
                    )}
                  </div>
                  
                  {story.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      <div className="flex gap-2 flex-wrap">
                        {story.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}