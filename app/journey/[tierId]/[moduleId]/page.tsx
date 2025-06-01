'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTier, getModule, getJourneyProgress, getModuleProgress } from '@/lib/journey'
import ViewModeToggle from '@/components/ViewModeToggle'

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const tierId = params.tierId as string
  const moduleId = params.moduleId as string
  
  const [progress, setProgress] = useState<any>(null)
  const [moduleProgress, setModuleProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  
  const tier = getTier(tierId)
  const module = getModule(tierId, moduleId)
  
  useEffect(() => {
    async function loadProgress() {
      const p = await getJourneyProgress()
      setProgress(p)
      
      if (p && module) {
        const mp = getModuleProgress(tierId, moduleId, p)
        setModuleProgress(mp)
      }
    }
    loadProgress()
  }, [tierId, moduleId, module])
  
  if (!tier || !module) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Module not found</h1>
          <Link href="/journey" className="text-gray-400 hover:text-white">
            Return to Journey
          </Link>
        </div>
      </div>
    )
  }
  
  const isTopicComplete = (topicId: string) => {
    if (!progress) return false
    const completedTopics = progress.topicsCompleted?.[tierId]?.[moduleId] || []
    return completedTopics.includes(topicId)
  }
  
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-400">
            <li><Link href="/journey" className="hover:text-white">Journey</Link></li>
            <li className="text-gray-600">/</li>
            <li><Link href={`/journey/${tierId}`} className="hover:text-white">{tier.title}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{module.title}</li>
          </ol>
        </nav>
        
        {/* Module Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">{module.title}</h1>
            <ViewModeToggle />
          </div>
          <p className="text-xl text-gray-400 mb-6">{module.description}</p>
          
          {/* Module Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
              <p className="text-lg font-semibold text-white">{module.estimatedTime}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] rounded-full transition-all duration-500"
                    style={{ width: `${moduleProgress.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-white">
                  {moduleProgress.completed}/{moduleProgress.total}
                </span>
              </div>
            </div>
          </div>
          
          {/* Learning Objectives */}
          {module.learningObjectives.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {module.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-400">
                    <span className="text-[#FF3366] mt-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Practical Components */}
          {module.practicalComponents && module.practicalComponents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Hands-on Activities</h3>
              <div className="bg-gradient-to-r from-[#FF3366]/10 to-[#FF6B6B]/10 rounded-lg p-4 border border-[#FF3366]/20">
                <ul className="space-y-2">
                  {module.practicalComponents.map((component, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-[#FF6B6B] mt-1">🛠️</span>
                      <span>{component}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Topics List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Topics</h2>
          {module.topics.map((topic, index) => {
            const isComplete = isTopicComplete(topic.id)
            const isLocked = topic.prerequisites && topic.prerequisites.some(prereq => !isTopicComplete(prereq))
            
            return (
              <Link
                key={topic.id}
                href={isLocked ? '#' : `/journey/${tierId}/${moduleId}/${topic.id}`}
                className={`block ${isLocked ? 'cursor-not-allowed' : ''}`}
              >
                <div className={`bg-gray-900 rounded-lg p-6 border-2 transition-all ${
                  isLocked 
                    ? 'border-gray-800 opacity-50' 
                    : isComplete 
                    ? 'border-green-500/50 hover:border-green-500' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-gray-600">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl font-semibold text-white">{topic.title}</h3>
                        {isComplete && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                            ✓ Complete
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-sm">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-3">{topic.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⏱️ {topic.estimatedTime}</span>
                        <span className={`capitalize ${
                          topic.difficulty === 'beginner' ? 'text-green-400' :
                          topic.difficulty === 'intermediate' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {topic.difficulty}
                        </span>
                        {topic.tags && topic.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Deep Dive Indicators */}
                      <div className="flex items-center gap-3 mt-3">
                        {topic.relatedCaseStudies && topic.relatedCaseStudies.length > 0 && (
                          <span className="text-xs text-gray-500">
                            📚 {topic.relatedCaseStudies.length} case {topic.relatedCaseStudies.length === 1 ? 'study' : 'studies'}
                          </span>
                        )}
                        {topic.relatedExperiments && topic.relatedExperiments.length > 0 && (
                          <span className="text-xs text-gray-500">
                            🧪 {topic.relatedExperiments.length} {topic.relatedExperiments.length === 1 ? 'experiment' : 'experiments'}
                          </span>
                        )}
                        {topic.relatedExplorations && topic.relatedExplorations.length > 0 && (
                          <span className="text-xs text-gray-500">
                            🔍 {topic.relatedExplorations.length} {topic.relatedExplorations.length === 1 ? 'exploration' : 'explorations'}
                          </span>
                        )}
                      </div>
                    </div>
                    {!isLocked && (
                      <div className="ml-4">
                        <span className="text-gray-400">→</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* Assessment Info */}
        {module.assessmentType && (
          <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">Module Assessment</h3>
            <p className="text-gray-400">
              This module concludes with a{' '}
              <span className="text-purple-400 font-medium">
                {module.assessmentType === 'quiz' ? 'knowledge quiz' :
                 module.assessmentType === 'project' ? 'practical project' :
                 module.assessmentType === 'peer-review' ? 'peer-reviewed assignment' :
                 'self-assessment exercise'}
              </span>
              {' '}to reinforce your learning.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}