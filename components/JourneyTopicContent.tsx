'use client'

import { useState, useEffect } from 'react'
import { useViewMode } from '@/contexts/ViewModeContext'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { JourneyIntroductionExtras } from '@/components/JourneyContent'
import Assessment from '@/components/Assessment'
import InteractiveTransition from '@/components/InteractiveTransition'
import { sectionAssessments } from '@/components/JourneyAssessment'
import { Topic } from '@/lib/journey'

interface JourneyTopicContentProps {
  topic: Topic
  tierId: string
  moduleId: string
}

// Markdown components configuration
const markdownComponents: Partial<Components> = {
  h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white">{children}</h1>,
  h2: ({children}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">{children}</h2>,
  h3: ({children}) => <h3 className="text-xl font-semibold mt-4 mb-2 text-white">{children}</h3>,
  ul: ({children}) => <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>,
  ol: ({children}) => <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>,
  li: ({children}) => <li className="text-gray-300">{children}</li>,
  p: ({children}) => <p className="mb-4 leading-relaxed text-gray-300">{children}</p>,
  code: ({children, className}) => {
    const isInline = !className
    return isInline ? (
      <code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-blue-400">
        {children}
      </code>
    ) : (
      <code className={className}>{children}</code>
    )
  },
  pre: ({children}) => (
    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
      {children}
    </pre>
  ),
  blockquote: ({children}) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-400">
      {children}
    </blockquote>
  ),
  strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
  a: ({children, href}) => (
    <a href={href} className="text-blue-400 hover:text-blue-300 underline">
      {children}
    </a>
  ),
}

export default function JourneyTopicContent({ topic, tierId, moduleId }: JourneyTopicContentProps) {
  const { viewMode } = useViewMode()
  const [primaryContent, setPrimaryContent] = useState<string>('')
  const [additionalContent, setAdditionalContent] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      
      // Load primary content
      if (topic.roadmapContentId) {
        try {
          const response = await fetch(`/api/topic-content?roadmap=ai-safety-researcher&topic=${topic.roadmapContentId}&viewMode=${viewMode}`)
          if (response.ok) {
            const data = await response.json()
            setPrimaryContent(data.content)
          }
        } catch (error) {
          console.error(`Failed to load primary content:`, error)
        }
      }
      
      // Load additional content
      if (topic.additionalContentIds && topic.additionalContentIds.length > 0) {
        const contentMap: { [key: string]: string } = {}
        
        for (const contentId of topic.additionalContentIds) {
          try {
            const response = await fetch(`/api/topic-content?roadmap=ai-safety-researcher&topic=${contentId}&viewMode=${viewMode}`)
            if (response.ok) {
              const data = await response.json()
              contentMap[contentId] = data.content
            }
          } catch (error) {
            console.error(`Failed to load content for ${contentId}:`, error)
          }
        }
        
        setAdditionalContent(contentMap)
      }
      
      setLoading(false)
    }
    
    loadContent()
  }, [topic, viewMode])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading content...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Primary Content */}
      {primaryContent && (
        <div className="bg-gray-900 rounded-lg p-8">
          <ReactMarkdown components={markdownComponents}>
            {primaryContent.replace(/<!--[\s\S]*?-->/g, '')}
          </ReactMarkdown>
        </div>
      )}
      
      {/* Additional Content */}
      {Object.entries(additionalContent).map(([contentId, content]) => (
        <div key={contentId} className="bg-gray-900 rounded-lg p-8">
          <ReactMarkdown components={markdownComponents}>
            {content.replace(/<!--[\s\S]*?-->/g, '')}
          </ReactMarkdown>
        </div>
      ))}
      
      {/* Direct content if no roadmap content */}
      {!primaryContent && !Object.keys(additionalContent).length && topic.content && (
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: topic.content }} />
          </div>
        </div>
      )}
      
      {/* No content fallback */}
      {!primaryContent && !Object.keys(additionalContent).length && !topic.content && (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">Content coming soon...</p>
        </div>
      )}
      
      {/* Journey Extras (for introduction content) */}
      {topic.hasJourneyExtras && (
        <JourneyIntroductionExtras />
      )}
      
      {/* Assessment */}
      {topic.assessmentId && sectionAssessments[topic.assessmentId] && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-8">
          <Assessment
            title="Check Your Understanding"
            questions={sectionAssessments[topic.assessmentId]}
            onComplete={(score, total) => {
              console.log(`Assessment complete: ${score}/${total}`)
            }}
          />
        </div>
      )}
      
      {/* Interactive Transition (AI Teacher) */}
      {topic.hasInteractiveTransition && (
        <InteractiveTransition 
          fromSection={tierId}
          toSection={moduleId}
          sectionId={topic.id}
        />
      )}
    </div>
  )
}