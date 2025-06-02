'use client'

import ReactMarkdown from 'react-markdown'
import { useViewMode } from '@/contexts/ViewModeContext'
import type { Components } from 'react-markdown'
import { JourneyIntroductionExtras } from '@/components/JourneyContent'
import Assessment from '@/components/Assessment'
import InteractiveTransition from '@/components/InteractiveTransition'
import AISafetyCompass from '@/components/AISafetyCompass'
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
  
  // Select content based on view mode
  const displayContent = viewMode === 'personal' && topic.contentPersonal 
    ? topic.contentPersonal 
    : topic.content

  return (
    <div className="space-y-8">
      {/* Database content is the primary source */}
      {displayContent ? (
        <div className="bg-gray-900 rounded-lg p-8">
          <ReactMarkdown components={markdownComponents}>
            {displayContent}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <p className="text-gray-400">Content coming soon...</p>
        </div>
      )}
      
      {/* AI Safety Compass (for prerequisites) */}
      {topic.id === 'prerequisites-foundations' && (
        <AISafetyCompass />
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