'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTier, getModule, getTopic, getJourneyProgress, markTopicComplete } from '@/lib/journey'
import TopicContent from '@/components/TopicContent'
import { getRoadmapContent } from '@/lib/roadmap'
import { getCaseStudy } from '@/lib/case-studies'
import { getExperiment } from '@/lib/experiments'
import { getExploration } from '@/lib/explorations'

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const tierId = params.tierId as string
  const moduleId = params.moduleId as string
  const topicId = params.topicId as string
  
  const [progress, setProgress] = useState<any>(null)
  const [isComplete, setIsComplete] = useState(false)
  
  const tier = getTier(tierId)
  const module = getModule(tierId, moduleId)
  const topic = getTopic(tierId, moduleId, topicId)
  
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
  
  if (!tier || !module || !topic) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Topic not found</h1>
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
  
  // Get roadmap content if linked
  const roadmapContent = topic.roadmapContentId ? getRoadmapContent(topic.roadmapContentId) : null
  
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
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-white">{topic.title}</h1>
            {isComplete && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Completed
              </span>
            )}
          </div>
          <p className="text-xl text-gray-400">{topic.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>⏱️ {topic.estimatedTime}</span>
            <span>•</span>
            <span className={`capitalize ${
              topic.difficulty === 'beginner' ? 'text-green-400' :
              topic.difficulty === 'intermediate' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {topic.difficulty}
            </span>
            {topic.tags && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {topic.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topic Content */}
          <div className="lg:col-span-2">
            {roadmapContent ? (
              <TopicContent
                topicId={topic.roadmapContentId!}
                title={roadmapContent.title}
                description={roadmapContent.description}
              />
            ) : topic.content ? (
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: topic.content }} />
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <p className="text-gray-400">Content coming soon...</p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {!isComplete && (
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Mark as Complete
                </button>
              )}
              
              {/* Navigation */}
              <div className="flex gap-2 ml-auto">
                {module.topics.findIndex(t => t.id === topicId) > 0 && (
                  <Link
                    href={`/journey/${tierId}/${moduleId}/${module.topics[module.topics.findIndex(t => t.id === topicId) - 1].id}`}
                    className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    ← Previous
                  </Link>
                )}
                {module.topics.findIndex(t => t.id === topicId) < module.topics.length - 1 && (
                  <Link
                    href={`/journey/${tierId}/${moduleId}/${module.topics[module.topics.findIndex(t => t.id === topicId) + 1].id}`}
                    className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Deep Dives Sidebar */}
          <div className="space-y-6">
            {/* Related Case Studies */}
            {topic.relatedCaseStudies && topic.relatedCaseStudies.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📚 Case Studies</h3>
                <div className="space-y-3">
                  {topic.relatedCaseStudies.map(caseId => {
                    const caseStudy = getCaseStudy(caseId)
                    return caseStudy ? (
                      <Link
                        key={caseId}
                        href={`/journey/deep-dives/case-studies/${caseId}`}
                        className="block p-3 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                      >
                        <h4 className="font-medium text-white">{caseStudy.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{caseStudy.description}</p>
                      </Link>
                    ) : null
                  })}
                </div>
              </div>
            )}
            
            {/* Related Experiments */}
            {topic.relatedExperiments && topic.relatedExperiments.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🧪 Experiments</h3>
                <div className="space-y-3">
                  {topic.relatedExperiments.map(expId => {
                    const experiment = getExperiment(expId)
                    return experiment ? (
                      <Link
                        key={expId}
                        href={`/journey/deep-dives/experiments/${expId}`}
                        className="block p-3 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                      >
                        <h4 className="font-medium text-white">{experiment.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{experiment.description}</p>
                      </Link>
                    ) : null
                  })}
                </div>
              </div>
            )}
            
            {/* Related Explorations */}
            {topic.relatedExplorations && topic.relatedExplorations.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔍 Explorations</h3>
                <div className="space-y-3">
                  {topic.relatedExplorations.map(exploreId => {
                    const exploration = getExploration(exploreId)
                    return exploration ? (
                      <Link
                        key={exploreId}
                        href={`/journey/deep-dives/explorations/${exploreId}`}
                        className="block p-3 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                      >
                        <h4 className="font-medium text-white">{exploration.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{exploration.description}</p>
                      </Link>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}