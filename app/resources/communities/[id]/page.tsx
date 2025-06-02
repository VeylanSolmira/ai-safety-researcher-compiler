'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, GlobeAltIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { profiles } from '@/lib/community-profiles'

export default function CommunityProfilePage() {
  const params = useParams()
  const profileId = params.id as string
  
  const profile = profiles[profileId]
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile not found
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
          {/* Profile Header */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {profile.role}
                </p>
              </div>
              {profile.website && (
                <a
                  href={profile.website}
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
              {profile.tags.map(tag => (
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
          {profile.personalNote && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 italic">
                💭 Personal Take: {profile.personalNote}
              </p>
            </div>
          )}

          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>{profile.overview}</p>
            </div>
          </section>

          {/* Key Contributions */}
          {profile.contributions && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Contributions
              </h2>
              <div className="space-y-6">
                {Object.entries(profile.contributions).map(([area, points]) => (
                  <div key={area}>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {area}
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                      {points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Personal Assessment */}
          {profile.assessment && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Assessment
              </h2>
              
              {profile.assessment.strengths && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(profile.assessment.strengths).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {key}:
                        </span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.assessment.concerns && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Areas of Concern
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(profile.assessment.concerns).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {key}:
                        </span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Critical Questions */}
          {profile.criticalQuestions && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Critical Questions
              </h2>
              <ol className="list-decimal list-inside space-y-2">
                {profile.criticalQuestions.map((question, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{question.question}</span>
                    {question.context && (
                      <span className="text-sm text-gray-500 dark:text-gray-500 ml-2">
                        {question.context}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Alternative Perspectives */}
          {profile.alternativePerspectives && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Alternative Perspectives
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Some researchers argue that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  {profile.alternativePerspectives.map((perspective, index) => (
                    <li key={index}>{perspective}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Resources */}
          {profile.resources && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {resource.type}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          {profile.disclaimer && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {profile.disclaimer}
              </p>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}