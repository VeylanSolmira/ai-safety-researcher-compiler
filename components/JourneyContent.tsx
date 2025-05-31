'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { useViewMode } from '@/contexts/ViewModeContext'

interface JourneyContentProps {
  sectionId: string
  roadmapContentIds?: string[]  // IDs of roadmap content to load
  additionalContent?: React.ReactNode  // Journey-specific content
}

// Map of content IDs to display titles
const contentTitles: { [key: string]: string } = {
  'prerequisites-topic': '📚 Core Prerequisites',
  'foundations-topic': '🏗️ AI Safety Foundations',
  // Add more mappings as needed
}

export default function JourneyContent({ sectionId, roadmapContentIds = [], additionalContent }: JourneyContentProps) {
  const [roadmapContent, setRoadmapContent] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const { viewMode } = useViewMode()

  useEffect(() => {
    const loadContent = async () => {
      const contentMap: { [key: string]: string } = {}
      
      for (const contentId of roadmapContentIds) {
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
      
      setRoadmapContent(contentMap)
      setLoading(false)
    }

    if (roadmapContentIds.length > 0) {
      loadContent()
    } else {
      setLoading(false)
    }
  }, [roadmapContentIds, viewMode])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }

  const markdownComponents: Partial<Components> = {
    h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
    ul: ({children}) => <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>,
    li: ({children}) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
    p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
    code: ({children, className}) => {
      const isInline = !className
      return isInline ? (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ) : (
        <code className={className}>{children}</code>
      )
    },
    pre: ({children}) => (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
        {children}
      </pre>
    ),
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  }

  return (
    <div className="space-y-8">
      {/* Roadmap Content */}
      {roadmapContentIds.map((contentId, index) => (
        <div key={contentId}>
          {roadmapContent[contentId] ? (
            <>
              {/* Section Title Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {contentTitles[contentId] || contentId}
                  </h2>
                  <span className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">
                    From Roadmap
                  </span>
                </div>
                <p className="text-sm mt-2 opacity-90">
                  This content corresponds to the &quot;{contentTitles[contentId]?.replace(/[📚🏗️🎯🔧]/g, '').trim() || contentId}&quot; node in the roadmap
                </p>
              </div>
              
              {/* Markdown Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                prose-code:text-blue-600 dark:prose-code:text-blue-400
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-ul:list-disc prose-ol:list-decimal
                prose-a:text-blue-600 hover:prose-a:text-blue-800 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300"
              >
                <ReactMarkdown 
                  components={markdownComponents}
                >
                  {roadmapContent[contentId].replace(/<!--[\s\S]*?-->/g, '')}
                </ReactMarkdown>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">Content not found for {contentId}</p>
          )}
          {index < roadmapContentIds.length - 1 && (
            <hr className="my-8 border-gray-300 dark:border-gray-600" />
          )}
        </div>
      ))}

      {/* Journey-Specific Additional Content */}
      {additionalContent && (
        <>
          {roadmapContentIds.length > 0 && (
            <hr className="my-8 border-gray-300 dark:border-gray-600" />
          )}
          <div className="mt-8">
            {additionalContent}
          </div>
        </>
      )}
    </div>
  )
}

// Journey-specific content components
export function JourneyIntroductionExtras() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
        🚀 Interactive Learning Resources
      </h2>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Hands-On Notebooks</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://colab.research.google.com/drive/your-intro-notebook-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                📓 Interactive Prerequisites Checker
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                Test your Python, ML, and math foundations with hands-on exercises
              </p>
            </li>
            <li>
              <a 
                href="https://colab.research.google.com/drive/your-safety-notebook-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                📓 Your First Safety Experiment
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                Build a toy model and explore alignment challenges firsthand
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Journey Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Take notes as you go - you&apos;ll reference them later</li>
            <li>Don&apos;t skip the exercises - they reinforce key concepts</li>
            <li>Join the Discord community for discussions</li>
            <li>Track your progress and celebrate milestones</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-2">What Makes This Journey Special</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Unlike the roadmap view which shows everything at once, this journey mode 
            guides you step-by-step with additional context, exercises, and community 
            resources tailored to your current learning stage.
          </p>
        </div>
      </div>
    </div>
  )
}