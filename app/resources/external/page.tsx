'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  GlobeAltIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BeakerIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface ExternalResource {
  id: string
  name: string
  type: string
  url: string
  description?: string
  metadata?: any
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  course: AcademicCapIcon,
  blog: DocumentTextIcon,
  podcast: PlayCircleIcon,
  tool: BeakerIcon,
  community: ChatBubbleLeftRightIcon,
  paper: BookOpenIcon,
  default: GlobeAltIcon
}

const typeColors: Record<string, string> = {
  course: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  blog: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  podcast: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  tool: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  community: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  paper: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

export default function ExternalResourcesPage() {
  const [resources, setResources] = useState<ExternalResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/external-resources')
        if (!response.ok) throw new Error('Failed to fetch resources')
        const data = await response.json()
        setResources(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resources')
      } finally {
        setLoading(false)
      }
    }
    fetchResources()
  }, [])

  // Get unique types
  const resourceTypes = ['all', ...new Set(resources.map(r => r.type || 'other'))]

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType
    const matchesSearch = searchTerm === '' || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  // Group resources by type
  const groupedResources = filteredResources.reduce((acc, resource) => {
    const type = resource.type || 'other'
    if (!acc[type]) acc[type] = []
    acc[type].push(resource)
    return acc
  }, {} as Record<string, ExternalResource[]>)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Loading external resources...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error loading resources</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                External Resources
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Curated collection of external AI safety resources including courses, blogs, tools, and communities.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {resourceTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Programs */}
        <div className="mb-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Programs</h2>
          
          {/* CBAI Fellowship */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    CBAI Fellowship 2025
                  </h3>
                  <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                    Applications Open
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Connect with 19+ AI safety mentors from leading organizations including Anthropic, 
                  Redwood Research, MIT, Harvard, and more. Get personalized research guidance and work 
                  on cutting-edge safety problems.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/resources/external/cbai-fellowship"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Explore Fellowship →
                  </Link>
                  <a
                    href="https://www.cbai.ai/fellowship"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Official Website ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* MATS Program */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <AcademicCapIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    MATS Summer 2025
                  </h3>
                  <span className="text-xs px-2 py-1 bg-purple-600 text-white rounded-full">
                    Jun 16 - Aug 22
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  10-week intensive program in Berkeley connecting scholars with top AI alignment mentors. 
                  Work on control, interpretability, governance, and more with mentors from Anthropic, 
                  Redwood Research, FAR AI, and AI Futures Project.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/resources/external/mats-2025"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Program →
                  </Link>
                  <a
                    href="https://matsprogram.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    Official Website ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {Object.keys(groupedResources).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No resources found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResources).map(([type, typeResources]) => (
              <div key={type}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  {React.createElement(typeIcons[type] || typeIcons.default, { className: 'h-5 w-5' })}
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                  <span className="text-sm font-normal text-gray-500">({typeResources.length})</span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {typeResources.map(resource => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {resource.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type] || typeColors.default}`}>
                          {type}
                        </span>
                      </div>
                      {resource.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.description}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}