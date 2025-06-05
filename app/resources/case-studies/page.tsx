'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { 
  ExclamationTriangleIcon,
  CalendarIcon,
  TagIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

// Import the type from the query file instead
import type { CaseStudy } from '@/lib/db/case-studies-queries'

// Helper function for date formatting
function formatCaseStudyDate(dateString: string): string {
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

export default function CaseStudiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<CaseStudy['category'] | 'all'>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<CaseStudy['severity'] | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [allCaseStudies, setAllCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch case studies from API
  useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const response = await fetch('/api/case-studies')
        if (!response.ok) throw new Error('Failed to fetch case studies')
        const data = await response.json() as any as any
        setAllCaseStudies(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case studies')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCaseStudies()
  }, [])
  
  // Get unique categories and severities
  const categories = useMemo(() => {
    const categorySet = new Set(allCaseStudies.map(study => study.category))
    return Array.from(categorySet)
  }, [allCaseStudies])
  
  const severities: CaseStudy['severity'][] = ['critical', 'high', 'medium', 'low']
  
  // Filter case studies
  const filteredStudies = useMemo(() => {
    let studies = allCaseStudies
    
    // Filter by category
    if (selectedCategory !== 'all') {
      studies = studies.filter(study => study.category === selectedCategory)
    }
    
    // Filter by severity
    if (selectedSeverity !== 'all') {
      studies = studies.filter(study => study.severity === selectedSeverity)
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      studies = studies.filter(study => 
        study.title.toLowerCase().includes(query) ||
        study.summary.toLowerCase().includes(query) ||
        study.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    return studies
  }, [allCaseStudies, selectedCategory, selectedSeverity, searchQuery])
  
  const categoryLabels: Record<CaseStudy['category'], string> = {
    misinformation: 'Misinformation',
    security: 'Security',
    alignment: 'Alignment',
    policy: 'Policy',
    accident: 'Accident',
    adversarial: 'Adversarial'
  }
  
  const categoryColors: Record<CaseStudy['category'], string> = {
    misinformation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    alignment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    policy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    accident: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    adversarial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  
  const severityColors: Record<CaseStudy['severity'], string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700'
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
                <ExclamationTriangleIcon className="h-5 w-5" />
                Case Studies & Incidents
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Safety Case Studies
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn from documented incidents and near-misses in AI systems. Understanding past failures is crucial for preventing future ones.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ExclamationTriangleIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Filters */}
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Category:
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? categoryColors[category]
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
            
            {/* Severity Filter */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Severity:
              </span>
              <button
                onClick={() => setSelectedSeverity('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedSeverity === 'all'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {severities.map(severity => (
                <button
                  key={severity}
                  onClick={() => setSelectedSeverity(severity)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${
                    selectedSeverity === severity
                      ? severityColors[severity]
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 border-transparent'
                  }`}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Case Studies List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading case studies...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No case studies found matching your criteria.
              </p>
            </div>
          ) : (
            filteredStudies.map((study) => (
              <Link
                key={study.id}
                href={`/resources/case-studies/${study.id}`}
                className="block group"
              >
                <article className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {study.title}
                    </h3>
                    <span 
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold border ${severityColors[study.severity]}`}
                    >
                      {study.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {study.summary}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      {formatCaseStudyDate(study.date)}
                    </span>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[study.category]}`}>
                      {categoryLabels[study.category]}
                    </span>
                  </div>
                  
                  {study.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      <div className="flex gap-2 flex-wrap">
                        {study.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {study.tags.length > 4 && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            +{study.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Key Lessons Preview */}
                  {study.lessons.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Key Lessons:
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {study.lessons.slice(0, 2).map((lesson, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span className="line-clamp-1">{lesson}</span>
                          </li>
                        ))}
                      </ul>
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