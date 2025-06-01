'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTier, getJourneyProgress, getTierProgress, LearningPath } from '@/lib/journey'
import { useLearningPath } from '@/hooks/useLearningPath'
import ViewModeToggle from '@/components/ViewModeToggle'

export default function TierPage() {
  const params = useParams()
  const router = useRouter()
  const tierId = params.tierId as string
  
  const [progress, setProgress] = useState<any>(null)
  const [tierProgress, setTierProgress] = useState({ 
    modulesCompleted: 0, 
    totalModules: 0, 
    topicsCompleted: 0, 
    totalTopics: 0, 
    percentage: 0 
  })
  
  const tier = getTier(tierId)
  const { selectedPath } = useLearningPath()
  
  useEffect(() => {
    async function loadProgress() {
      const p = await getJourneyProgress()
      setProgress(p)
      
      if (p && tier) {
        const tp = getTierProgress(tierId, p)
        setTierProgress(tp)
      }
    }
    loadProgress()
  }, [tierId, tier])
  
  if (!tier) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tier not found</h1>
          <Link href="/journey" className="text-gray-400 hover:text-white">
            Return to Journey
          </Link>
        </div>
      </div>
    )
  }
  
  const isModuleComplete = (moduleId: string) => {
    if (!progress) return false
    const completedModules = progress.modulesCompleted?.[tierId] || []
    return completedModules.includes(moduleId)
  }
  
  const getModuleProgress = (moduleId: string) => {
    if (!progress) return 0
    const module = tier.modules.find(m => m.id === moduleId)
    if (!module) return 0
    
    const completedTopics = progress.topicsCompleted?.[tierId]?.[moduleId] || []
    return Math.round((completedTopics.length / module.topics.length) * 100)
  }
  
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href="/journey" className="hover:text-white">Journey</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{tier.title}</li>
          </ol>
          {selectedPath !== 'all' && (
            <div className="mt-2 text-xs text-gray-500">
              Viewing: <span className="text-gray-300 capitalize">{selectedPath.replace('-', ' ')}</span> path
            </div>
          )}
        </nav>
        
        {/* Tier Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold text-white">{tier.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${
                tier.level === 'foundation' ? 'bg-green-500/20 text-green-400' :
                tier.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                tier.level === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {tier.level.charAt(0).toUpperCase() + tier.level.slice(1)}
              </span>
            </div>
            <ViewModeToggle />
          </div>
          <p className="text-xl text-gray-400 mb-6">{tier.description}</p>
          
          {/* Tier Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="text-lg font-semibold text-white">{tier.estimatedDuration}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] rounded-full transition-all duration-500"
                    style={{ width: `${tierProgress.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-white">
                  {tierProgress.percentage}%
                </span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Topics Completed</p>
              <p className="text-lg font-semibold text-white">
                {tierProgress.topicsCompleted} / {tierProgress.totalTopics}
              </p>
            </div>
          </div>
          
          {/* Skills & Career Relevance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Skills You'll Gain</h3>
              <div className="flex flex-wrap gap-2">
                {tier.skillsGained.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Career Relevance</h3>
              <ul className="space-y-1">
                {tier.careerRelevance.map((career, index) => (
                  <li key={index} className="text-gray-400 text-sm">
                    • {career}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Modules Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Modules</h2>
          <div className="grid grid-cols-1 gap-6">
            {tier.modules
              .filter(module => 
                selectedPath === 'all' || 
                module.paths?.includes('all' as LearningPath) || 
                module.paths?.includes(selectedPath)
              )
              .map((module, index) => {
              const isComplete = isModuleComplete(module.id)
              const moduleProgressPercent = getModuleProgress(module.id)
              
              return (
                <Link
                  key={module.id}
                  href={`/journey/${tierId}/${module.id}`}
                  className="block"
                >
                  <div className={`bg-gray-900 rounded-xl p-8 border-2 transition-all hover:bg-gray-900/80 ${
                    isComplete 
                      ? 'border-green-500/50 hover:border-green-500' 
                      : moduleProgressPercent > 0
                      ? 'border-yellow-500/30 hover:border-yellow-500/50'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#FF3366] to-[#FF6B6B] rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-white mb-1">{module.title}</h3>
                          <p className="text-gray-400">{module.description}</p>
                        </div>
                      </div>
                      {isComplete && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          ✓ Complete
                        </span>
                      )}
                    </div>
                    
                    {/* Module Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Duration</p>
                        <p className="text-sm font-medium text-gray-300">{module.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Topics</p>
                        <p className="text-sm font-medium text-gray-300">{module.topics.length} topics</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Type</p>
                        <p className="text-sm font-medium text-gray-300">
                          {module.assessmentType ? module.assessmentType : 'Mixed'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {moduleProgressPercent > 0 && (
                      <div className="mt-4">
                        <div className="bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] rounded-full transition-all duration-500"
                            style={{ width: `${moduleProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Learning Paths */}
                    {module.paths && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {module.paths.map(path => (
                          <span key={path} className={`text-xs px-2 py-1 rounded ${
                            path === 'all' ? 'bg-gray-700 text-gray-300' :
                            path === 'technical-safety' ? 'bg-blue-900/30 text-blue-400' :
                            path === 'governance' ? 'bg-purple-900/30 text-purple-400' :
                            path === 'engineering' ? 'bg-green-900/30 text-green-400' :
                            'bg-orange-900/30 text-orange-400'
                          }`}>
                            {path === 'all' ? 'All Paths' : path.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Quick Preview of Topics */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {module.topics.slice(0, 4).map(topic => (
                        <span key={topic.id} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">
                          {topic.title}
                        </span>
                      ))}
                      {module.topics.length > 4 && (
                        <span className="text-xs px-2 py-1 text-gray-500">
                          +{module.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Next Tier Preview */}
        {tier.unlocks.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-r from-gray-900 to-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-500 mb-1">Complete this tier to unlock:</p>
            <p className="text-lg font-semibold text-white">
              {tier.unlocks.map(id => getTier(id)?.title).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}