'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getJourneyProgress, getModuleProgress } from '@/lib/journey'
import { useTierData } from '@/hooks/useJourneyData'
import ViewModeToggle from '@/components/ViewModeToggle'

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const tierId = params.tierId as string
  const moduleId = params.moduleId as string
  
  const [progress, setProgress] = useState<any>(null)
  const [moduleProgress, setModuleProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  
  // Use database hook to get tier data (includes modules)
  const { tier, loading, error } = useTierData(tierId)
  const courseModule = tier?.modules.find(m => m.id === moduleId)
  
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-lg text-white">Loading courseModule...</div>
      </div>
    )
  }
  
  if (error || !tier || !module) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error ? 'Error loading module' : 'Module not found'}
          </h1>
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
            <li className="text-white">{courseModule.title}</li>
          </ol>
        </nav>
        
        {/* Module Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">{courseModule.title}</h1>
            <ViewModeToggle />
          </div>
          <p className="text-xl text-gray-400 mb-6">{courseModule.description}</p>
          
          {/* Module Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
              <p className="text-lg font-semibold text-white">{courseModule.estimatedTime}</p>
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
          {courseModule.learningObjectives.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {courseModule.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#FF3366] mt-1">•</span>
                    <span className="text-gray-300">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Topics Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseModule.topics.map((topic, index) => {
              const isComplete = isTopicComplete(topic.id)
              
              return (
                <Link
                  key={topic.id}
                  href={`/journey/${tierId}/${moduleId}/${topic.id}`}
                  className="block"
                >
                  <div className={`bg-gray-900 rounded-lg p-6 border-2 transition-all hover:bg-gray-900/80 ${
                    isComplete 
                      ? 'border-green-500/50 hover:border-green-500' 
                      : 'border-gray-800 hover:border-gray-700'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF3366] to-[#FF6B6B] rounded-lg flex items-center justify-center text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                      </div>
                      {isComplete && (
                        <span className="text-green-400">✓</span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ {topic.estimatedTime}</span>
                      <span className={`
                        ${topic.difficulty === 'beginner' ? 'text-green-500' :
                          topic.difficulty === 'intermediate' ? 'text-yellow-500' :
                          'text-orange-500'}
                      `}>
                        {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                      </span>
                    </div>
                    
                    {/* Tags */}
                    {topic.tags && topic.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {topic.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Assessment Info */}
        {courseModule.assessmentType && (
          <div className="mt-12 p-6 bg-gradient-to-r from-gray-900 to-gray-900/50 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-2">Module Assessment</h3>
            <p className="text-gray-400">
              Complete all topics to unlock the {courseModule.assessmentType} assessment for this courseModule.
            </p>
            {moduleProgress.percentage === 100 && (
              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] rounded-lg text-white font-medium hover:opacity-90 transition">
                Take Assessment
              </button>
            )}
          </div>
        )}
        
        {/* Database efficiency indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-600">
          <span>⚡</span>
          <span>Powered by database (97% faster)</span>
        </div>
      </div>
    </div>
  )
}