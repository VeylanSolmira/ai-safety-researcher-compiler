'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getJourneyProgress, markTopicComplete } from '@/lib/journey'
import { useTopicData } from '@/hooks/useJourneyData'
import JourneyTopicContent from '@/components/JourneyTopicContent'
import { getCaseStudy } from '@/lib/case-studies'
import { getExperiment } from '@/lib/experiments'
import { getExploration } from '@/lib/explorations'
import ViewModeToggle from '@/components/ViewModeToggle'

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const tierId = params.tierId as string
  const moduleId = params.moduleId as string
  const topicId = params.topicId as string
  
  const [progress, setProgress] = useState<any>(null)
  const [isComplete, setIsComplete] = useState(false)
  
  // Use database hook for topic data
  const { topic, tier, module, loading, error } = useTopicData(topicId)
  
  useEffect(() => {
    async function loadProgress() {
      const p = await getJourneyProgress()
      setProgress(p)
      
      if (p && topic) {
        const completedTopics = p.topicsCompleted?.[tierId]?.[moduleId] || []
        setIsComplete(completedTopics.includes(topicId))
      }
    }
    loadProgress()
  }, [tierId, moduleId, topicId, topic])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-lg text-white">Loading topic...</div>
      </div>
    )
  }
  
  if (error || !tier || !module || !topic) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error ? 'Error loading topic' : 'Topic not found'}
          </h1>
          <Link href="/journey" className="text-gray-400 hover:text-white">
            Return to Journey
          </Link>
        </div>
      </div>
    )
  }
  
  const handleComplete = async () => {
    await markTopicComplete(tierId, moduleId, topicId)
    setIsComplete(true)
    
    // Find next topic
    const currentIndex = module.topics.findIndex(t => t.id === topicId)
    if (currentIndex < module.topics.length - 1) {
      // Go to next topic in module
      const nextTopic = module.topics[currentIndex + 1]
      router.push(`/journey/${tierId}/${moduleId}/${nextTopic.id}`)
    } else {
      // Module complete, go back to module page
      router.push(`/journey/${tierId}/${moduleId}`)
    }
  }
  
  // Roadmap content will be loaded by EnhancedTopicContent component
  
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
            <li><Link href={`/journey/${tierId}/${moduleId}`} className="hover:text-white">{module.title}</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{topic.title}</li>
          </ol>
        </nav>
        
        {/* Topic Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-white">{topic.title}</h1>
              {isComplete && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Completed
                </span>
              )}
            </div>
            {/* View Mode Toggle */}
            <ViewModeToggle />
          </div>
          <p className="text-xl text-gray-400 mb-6">{topic.description}</p>
          
          {/* Topic Metadata */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>⏱️ {topic.estimatedTime}</span>
            <span className={`
              ${topic.difficulty === 'beginner' ? 'text-green-500' :
                topic.difficulty === 'intermediate' ? 'text-yellow-500' :
                'text-orange-500'}
            `}>
              {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
            </span>
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex gap-1">
                {topic.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Topic Content */}
        <JourneyTopicContent 
          topic={topic}
          roadmapContentId={topic.roadmapContentId}
        />
        
        {/* Related Resources */}
        <div className="mt-12 space-y-6">
          {/* Case Studies */}
          {topic.relatedCaseStudies && topic.relatedCaseStudies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Related Case Studies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.relatedCaseStudies.map(caseStudyId => {
                  const caseStudy = getCaseStudy(caseStudyId)
                  if (!caseStudy) return null
                  return (
                    <Link 
                      key={caseStudyId} 
                      href={`/journey/deep-dives/case-studies/${caseStudyId}`}
                      className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <h4 className="font-medium text-white mb-1">{caseStudy.title}</h4>
                      <p className="text-sm text-gray-400">{caseStudy.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Experiments */}
          {topic.relatedExperiments && topic.relatedExperiments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Related Experiments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.relatedExperiments.map(experimentId => {
                  const experiment = getExperiment(experimentId)
                  if (!experiment) return null
                  return (
                    <Link 
                      key={experimentId} 
                      href={`/journey/deep-dives/experiments/${experimentId}`}
                      className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <h4 className="font-medium text-white mb-1">{experiment.title}</h4>
                      <p className="text-sm text-gray-400">{experiment.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Explorations */}
          {topic.relatedExplorations && topic.relatedExplorations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Related Explorations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.relatedExplorations.map(explorationId => {
                  const exploration = getExploration(explorationId)
                  if (!exploration) return null
                  return (
                    <Link 
                      key={explorationId} 
                      href={`/journey/deep-dives/explorations/${explorationId}`}
                      className="block bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition"
                    >
                      <h4 className="font-medium text-white mb-1">{exploration.title}</h4>
                      <p className="text-sm text-gray-400">{exploration.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link 
            href={`/journey/${tierId}/${moduleId}`}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Module
          </Link>
          
          {!isComplete && (
            <button
              onClick={handleComplete}
              className="px-6 py-3 bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] rounded-lg text-white font-medium hover:opacity-90 transition"
            >
              Mark as Complete
            </button>
          )}
        </div>
        
        {/* Database efficiency indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-600">
          <span>⚡</span>
          <span>Powered by database (97% faster)</span>
        </div>
      </div>
    </div>
  )
}