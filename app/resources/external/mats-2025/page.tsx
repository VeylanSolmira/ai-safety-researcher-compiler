'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  BuildingOfficeIcon, 
  UserIcon, 
  MapPinIcon, 
  GlobeAltIcon, 
  BookOpenIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline'

interface Entity {
  id: string
  name: string
  type: 'researcher' | 'organization' | 'platform'
  description: string
  tags: string[]
  properties: Record<string, any>
  personal_note?: string
}

interface EntityTopic {
  id: string
  title: string
  description: string
  entityDescription: string
  context?: any
  journey: {
    tierId: string
    tierTitle: string
    moduleId: string
    moduleTitle: string
    path: string
  }
}

interface GroupedEntityTopics {
  [relationshipType: string]: EntityTopic[]
}

export default function MATS2025Page() {
  const [matsOrg, setMatsOrg] = useState<Entity | null>(null)
  const [mentors, setMentors] = useState<Entity[]>([])
  const [entityTopics, setEntityTopics] = useState<Record<string, GroupedEntityTopics>>({})
  const [expandedMentors, setExpandedMentors] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMatsData()
  }, [])

  async function fetchMatsData() {
    try {
      // Fetch MATS organization
      const orgRes = await fetch('/api/entities/mats-program')
      if (orgRes.ok) {
        const orgData = await orgRes.json()
        setMatsOrg(orgData)
      }

      // Fetch all entities and filter for MATS mentors
      const entitiesRes = await fetch('/api/entities')
      if (entitiesRes.ok) {
        const allEntities = await entitiesRes.json()
        const matsMentors = allEntities.filter((e: Entity) => 
          e.type === 'researcher' && e.tags?.includes('mats-mentor-2025')
        )
        setMentors(matsMentors)

        // Fetch topics for all mentors in a single batch request
        if (matsMentors.length > 0) {
          const mentorIds = matsMentors.map(m => m.id)
          const batchRes = await fetch('/api/entities/batch-topics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entityIds: mentorIds })
          })
          
          if (batchRes.ok) {
            const batchTopics = await batchRes.json()
            setEntityTopics(batchTopics)
          }
        }
      }
    } catch (err) {
      setError('Failed to load MATS data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleMentor = (mentorId: string) => {
    setExpandedMentors(prev => {
      const next = new Set(prev)
      if (next.has(mentorId)) {
        next.delete(mentorId)
      } else {
        next.add(mentorId)
      }
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading MATS data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">{error}</div>
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
                href="/resources/external" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to External Resources
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                MATS Summer 2025
              </h1>
            </div>
            <Link
              href="/journey"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              Return to Journey →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Program Overview */}
        {matsOrg && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {matsOrg.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {matsOrg.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Program Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <GlobeAltIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <a href={matsOrg.properties.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 dark:text-blue-400 hover:underline">
                        {matsOrg.properties.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{matsOrg.properties.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpenIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {matsOrg.properties.programDuration} • {matsOrg.properties.summerDates}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <UsersIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {matsOrg.properties.alumniCount} alumni • {matsOrg.properties.mentorCount} total mentors
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Research Tracks</h3>
                <div className="flex flex-wrap gap-2">
                  {matsOrg.properties.tracks?.map((track: string) => (
                    <span key={track} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {track}
                    </span>
                  ))}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 mt-4">Funding Sources</h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {matsOrg.properties.fundingSources?.map((source: string) => (
                    <li key={source}>• {source}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mentors Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Summer 2025 Mentors ({mentors.length})
          </h2>
          
          <div className="space-y-4">
            {mentors.map(mentor => (
              <div key={mentor.id} className="border dark:border-gray-700 rounded-lg p-4">
                <button
                  onClick={() => toggleMentor(mentor.id)}
                  className="w-full flex items-start gap-3 text-left"
                >
                  <div className="mt-1">
                    {expandedMentors.has(mentor.id) ? (
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {mentor.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <BuildingOfficeIcon className="w-3 h-3" />
                        {mentor.properties.organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {mentor.properties.location}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {mentor.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                        {mentor.properties.track}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Research: {mentor.properties.researchFocus}
                      </span>
                    </div>
                  </div>
                </button>
                
                {expandedMentors.has(mentor.id) && entityTopics[mentor.id] && (
                  <div className="mt-4 ml-7 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Related Journey Topics
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(entityTopics[mentor.id]).map(([relationshipType, topics]) => (
                        <div key={relationshipType}>
                          <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 capitalize">
                            {relationshipType.replace(/_/g, ' ')}
                          </h5>
                          <div className="space-y-2">
                            {topics.map((topic, idx) => (
                              <div key={idx} className="text-sm">
                                <Link
                                  href={topic.journey.path}
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {topic.title}
                                </Link>
                                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                  {topic.entityDescription || topic.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This page shows confirmed mentors for MATS Summer 2025. 
            For the most up-to-date information and to apply, visit{' '}
            <a href="https://matsprogram.org" target="_blank" rel="noopener noreferrer" 
               className="underline hover:no-underline">
              matsprogram.org
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}