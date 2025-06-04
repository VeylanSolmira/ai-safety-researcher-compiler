'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  category: 'foundational' | 'alignment' | 'interpretability' | 'governance' | 'technical' | 'philosophy'
  tags: string[]
  abstract: string
  link: string
  importance: 'essential' | 'important' | 'useful'
  reading_time?: string | null
  created_at?: string
  updated_at?: string
}

const categories = [
  { id: 'all', label: 'All Papers', color: 'bg-gray-500' },
  { id: 'foundational', label: 'Foundational', color: 'bg-blue-500' },
  { id: 'alignment', label: 'Alignment', color: 'bg-green-500' },
  { id: 'interpretability', label: 'Interpretability', color: 'bg-purple-500' },
  { id: 'governance', label: 'Governance', color: 'bg-yellow-500' },
  { id: 'technical', label: 'Technical', color: 'bg-red-500' },
  { id: 'philosophy', label: 'Philosophy', color: 'bg-indigo-500' }
]

export default function ResearchPapersHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [papers, setPapers] = useState<Paper[]>([])
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch papers from API
  useEffect(() => {
    async function fetchPapers() {
      try {
        setLoading(true)
        const response = await fetch('/api/papers')
        if (!response.ok) {
          throw new Error('Failed to fetch papers')
        }
        const data = await response.json()
        setPapers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPapers()
  }, [])

  useEffect(() => {
    let filtered = papers

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(paper => paper.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(paper => 
        paper.title.toLowerCase().includes(query) ||
        paper.authors.some(author => author.toLowerCase().includes(query)) ||
        paper.tags.some(tag => tag.toLowerCase().includes(query)) ||
        paper.abstract.toLowerCase().includes(query)
      )
    }

    setFilteredPapers(filtered)
  }, [searchQuery, selectedCategory])

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'essential': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'important': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'useful': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'bg-gray-500'
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
                📚 Research Papers Hub
              </h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Essential AI Safety Papers</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Curated collection of papers every AI safety researcher should know
          </p>
        </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <input
              type="search"
              placeholder="Search papers by title, author, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
            />

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? `${category.color} text-white`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {category.label}
                  {category.id !== 'all' && (
                    <span className="ml-2 text-sm opacity-75">
                      ({papers?.filter(p => p.category === category.id).length || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Special callout for foundational papers */}
          {selectedCategory === 'foundational' && (
            <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-400 mb-3">
                Foundational Papers
              </h2>
              <p className="text-gray-300">
                These are the essential papers that every AI safety researcher should read. 
                They establish core concepts, define key problems, and provide the intellectual 
                foundation for the field.
              </p>
              <Link 
                href="/journey/foundation/foundational-papers"
                className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
              >
                View structured learning path →
              </Link>
            </div>
          )}

          {/* Results count */}
          <div className="mb-4 text-gray-400">
            {loading ? 'Loading...' : `Showing ${filteredPapers.length} of ${papers.length} papers`}
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              Error loading papers: {error}
            </div>
          )}

          {/* Papers list */}
          <div className="space-y-4">
            {filteredPapers.map(paper => (
              <div 
                key={paper.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      <a 
                        href={paper.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition"
                      >
                        {paper.title}
                      </a>
                    </h3>
                    <div className="text-gray-400 text-sm mb-3">
                      {paper.authors.join(', ')} • {paper.year}
                    </div>
                  </div>
                  <span 
                    className={`ml-4 px-3 py-1 rounded-full text-xs font-medium border ${getImportanceColor(paper.importance)}`}
                  >
                    {paper.importance}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {paper.abstract}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(paper.category)} bg-opacity-20 text-white`}
                    >
                      {paper.category}
                    </span>
                    {paper.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium text-gray-400 border border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {paper.reading_time && (
                    <span className="text-sm text-gray-500">
                      📖 {paper.reading_time}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No papers found matching your criteria.
              </p>
            </div>
          )}
      </main>
    </div>
  )
}