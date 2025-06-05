'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, GlobeAltIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface Entity {
  id: string
  name: string
  type: 'researcher' | 'organization' | 'platform'
  description: string
  tags: string[]
  properties: Record<string, any>
  personal_note?: string | null
  active: boolean
  relatedTopics?: Array<{
    topic_id: string
    topic_title: string
    relationship_type: string
  }>
  topicCounts?: Array<{
    count: number
    relationship_type: string
  }>
}

export default function Page() {
  const params = useParams()
  const profileId = params.id as string
  const [entity, setEntity] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/entities/${profileId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Entity not found')
            return
          }
          throw new Error('Failed to fetch entity')
        }
        
        const data = await response.json() as any
        setEntity(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [profileId])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    )
  }
  
  if (error || !entity) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Entity not found
          </h1>
          <Link 
            href="/resources/communities" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Community Directory
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/resources/communities" 
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Community Directory
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Entity Header */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {entity.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                  {entity.properties?.affiliation && ` • ${entity.properties.affiliation}`}
                  {entity.properties?.location && ` • ${entity.properties.location}`}
                </p>
              </div>
              {entity.properties?.website && (
                <a
                  href={entity.properties.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <GlobeAltIcon className="h-5 w-5" />
                  Website
                </a>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {entity.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Personal Note */}
          {entity.personal_note && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 italic">
                💭 Personal Take: {entity.personal_note}
              </p>
            </div>
          )}

          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{entity.description}</p>
            </div>
          </section>

          {/* Entity Properties */}
          {Object.keys(entity.properties).length > 1 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entity.properties.twitter && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">Twitter:</span>
                    <a href={`https://twitter.com/${entity.properties.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      {entity.properties.twitter}
                    </a>
                  </div>
                )}
                {entity.properties.github && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">GitHub:</span>
                    <a href={`https://github.com/${entity.properties.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      {entity.properties.github}
                    </a>
                  </div>
                )}
                {entity.properties.linkedin && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">LinkedIn:</span>
                    <a href={entity.properties.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
                {entity.properties.founded && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">Founded:</span>
                    <span className="text-gray-900 dark:text-white">{entity.properties.founded}</span>
                  </div>
                )}
                {entity.properties.focus && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 dark:text-gray-400">Focus:</span>
                    <span className="text-gray-900 dark:text-white">{entity.properties.focus}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Related Topics */}
          {entity.relatedTopics && entity.relatedTopics.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Related Topics
              </h2>
              <div className="space-y-2">
                {entity.relatedTopics.map((topic) => (
                  <div key={topic.topic_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {topic.topic_title}
                      </span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        ({topic.relationship_type})
                      </span>
                    </div>
                    <Link
                      href={`/journey/topics/${topic.topic_id}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Topic →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Topic Counts */}
          {entity.topicCounts && entity.topicCounts.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Topic Statistics
              </h3>
              <div className="flex flex-wrap gap-4">
                {entity.topicCounts.map((count) => (
                  <div key={count.relationship_type} className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{count.relationship_type}:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{count.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}