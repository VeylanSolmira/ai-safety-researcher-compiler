'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  UserGroupIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  DocumentTextIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

interface Entity {
  id: string
  name: string
  type: 'researcher' | 'organization' | 'platform'
  description: string
  tags: string[]
  properties: Record<string, any>
  personal_note?: string | null
  active: boolean
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  organization: BuildingLibraryIcon,
  researcher: AcademicCapIcon,
  platform: ChatBubbleLeftRightIcon
}

const typeColors: Record<string, string> = {
  organization: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  researcher: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  platform: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

export default function CommunitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch('/api/entities')
        if (!response.ok) throw new Error('Failed to fetch communities')
        const data = await response.json() as any as any
        setEntities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load communities')
      } finally {
        setLoading(false)
      }
    }
    fetchEntities()
  }, [])

  // Filter entities
  const filteredEntities = entities.filter(entity => {
    const matchesType = selectedType === 'all' || entity.type === selectedType
    const matchesSearch = searchTerm === '' || 
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  // Group by type
  const groupedEntities = filteredEntities.reduce((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = []
    acc[entity.type].push(entity)
    return acc
  }, {} as Record<string, Entity[]>)

  // Get unique types
  const entityTypes = ['all', ...new Set(entities.map(e => e.type))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Loading communities...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error loading communities</h2>
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
                AI Safety Community Directory
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Explore organizations, researchers, communities, and programs working on AI safety. 
            Find opportunities to collaborate, learn, and contribute.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, description, or tags..."
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
            {entityTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {Object.keys(groupedEntities).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No communities found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedEntities).map(([type, typeEntities]) => (
              <div key={type}>
                <div className="flex items-center gap-3 mb-6">
                  {React.createElement(typeIcons[type] || UserGroupIcon, { className: 'h-6 w-6 text-gray-600 dark:text-gray-400' })}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {type.charAt(0).toUpperCase() + type.slice(1)}s
                  </h2>
                  <span className="text-sm text-gray-500">({typeEntities.length})</span>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {typeEntities.map(entity => (
                    <div
                      key={entity.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {entity.name}
                          </h3>
                          {entity.properties?.affiliation && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {entity.properties.affiliation}
                            </p>
                          )}
                          {entity.properties?.location && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              📍 {entity.properties.location}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type]}`}>
                          {type}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {entity.description}
                      </p>

                      {/* Tags */}
                      {entity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {entity.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                              {tag}
                            </span>
                          ))}
                          {entity.tags.length > 4 && (
                            <span className="text-xs text-gray-500">+{entity.tags.length - 4} more</span>
                          )}
                        </div>
                      )}

                      {/* Properties as badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {entity.tags?.includes('mentor') && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                            Offers Mentorship
                          </span>
                        )}
                        {entity.properties?.hasOpenPositions && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                            Hiring
                          </span>
                        )}
                        {entity.properties?.acceptsVolunteers && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                            Accepts Volunteers
                          </span>
                        )}
                        {entity.properties?.acceptingStudents && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">
                            Accepting Students
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        {entity.properties?.website && (
                          <a
                            href={entity.properties.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Visit Website →
                          </a>
                        )}
                        {entity.type === 'researcher' && (
                          <Link
                            href={`/resources/communities/${entity.id}`}
                            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                          >
                            View Profile →
                          </Link>
                        )}
                      </div>

                      {/* Personal Note */}
                      {entity.personal_note && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            💭 {entity.personal_note}
                          </p>
                        </div>
                      )}
                    </div>
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