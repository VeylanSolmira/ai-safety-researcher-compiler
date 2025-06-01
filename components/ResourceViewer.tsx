'use client'

import { useState } from 'react'
import { cbai2025Mentors, organizations, researchTopics, getMentorsByOrganization, getMentorsByTopic, getTopicsByCategory } from '@/lib/resources/cbai-2025-mentors'
import type { Mentor, Organization, ResearchTopic } from '@/lib/resources/cbai-2025-mentors'

type ViewMode = 'mentors' | 'organizations' | 'topics'

export default function ResourceViewer() {
  const [viewMode, setViewMode] = useState<ViewMode>('mentors')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPersonalEvals, setShowPersonalEvals] = useState(false)

  // Filter mentors based on search
  const filteredMentors = cbai2025Mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.researchAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Get unique categories
  const categories = Array.from(new Set(researchTopics.map(t => t.category)))

  const renderMentorCard = (mentor: Mentor) => (
    <div key={mentor.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mentor.name}</h3>
          {mentor.organization && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.organization}</p>
          )}
        </div>
        {showPersonalEvals && mentor.quickEvaluation && (
          <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {mentor.quickEvaluation.rating}
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {mentor.biography}
      </p>
      
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Research Areas</h4>
          <div className="flex flex-wrap gap-1">
            {mentor.researchAreas.map(area => (
              <span key={area} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {area}
              </span>
            ))}
          </div>
        </div>
        
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            Mentor Topics ({mentor.mentorTopics.length})
          </summary>
          <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            {mentor.mentorTopics.map((topic, idx) => (
              <li key={idx} className="pl-4 text-xs">• {topic}</li>
            ))}
          </ul>
        </details>
        
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            Desired Qualifications
          </summary>
          <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
            {mentor.desiredQualifications.map((qual, idx) => (
              <li key={idx} className="pl-4 text-xs">• {qual}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  )

  const renderOrganizationCard = (org: Organization) => {
    const orgMentors = getMentorsByOrganization(org.id)
    return (
      <div key={org.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{org.name}</h3>
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded capitalize">
            {org.type}
          </span>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Mentors ({orgMentors.length})
          </h4>
          <div className="space-y-2">
            {orgMentors.map(mentor => (
              <div key={mentor.id} className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{mentor.name}</span>
                {mentor.quickEvaluation && showPersonalEvals && (
                  <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">
                    ({mentor.quickEvaluation.rating})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderTopicCard = (topic: ResearchTopic) => {
    const topicMentors = getMentorsByTopic(topic.id)
    return (
      <div key={topic.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{topic.name}</h3>
          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded capitalize">
            {topic.category}
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Mentors ({topicMentors.length})
            </h4>
            <div className="space-y-1">
              {topicMentors.map(mentor => (
                <div key={mentor.id} className="text-sm text-gray-600 dark:text-gray-400">
                  {mentor.name} <span className="text-xs">({mentor.organization})</span>
                </div>
              ))}
            </div>
          </div>
          
          {topic.relatedJourneyTopics && topic.relatedJourneyTopics.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Related Journey Topics</h4>
              <div className="flex flex-wrap gap-1">
                {topic.relatedJourneyTopics.map(journeyTopic => (
                  <span key={journeyTopic} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                    {journeyTopic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          CBAI Fellowship 2025 - Mentors & Topics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore mentors, organizations, and research topics for the CBAI Summer 2025 Fellowship
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('mentors')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'mentors'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Mentors ({cbai2025Mentors.length})
            </button>
            <button
              onClick={() => setViewMode('organizations')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'organizations'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Organizations ({organizations.length})
            </button>
            <button
              onClick={() => setViewMode('topics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'topics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Topics ({researchTopics.length})
            </button>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showPersonalEvals}
                onChange={(e) => setShowPersonalEvals(e.target.checked)}
                className="rounded text-blue-600"
              />
              Show Personal Evaluations
            </label>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {viewMode === 'mentors' && (
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          
          {viewMode === 'topics' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {viewMode === 'mentors' && filteredMentors.map(renderMentorCard)}
        {viewMode === 'organizations' && organizations.map(renderOrganizationCard)}
        {viewMode === 'topics' && 
          (selectedCategory === 'all' ? researchTopics : getTopicsByCategory(selectedCategory as any))
            .map(renderTopicCard)
        }
      </div>
    </div>
  )
}