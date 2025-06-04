'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface ExplorationPageProps {
  params: {
    explorationId: string
  }
}

interface Exploration {
  id: string
  metadata: {
    title: string
    description: string
    readingTime: string
    lastUpdated?: string
    relatedTopic?: string
    tags?: string[]
    keyQuestions?: string[]
    discussionPrompts?: string[]
    relatedResources?: Array<{
      title: string
      url: string
      external?: boolean
      description?: string
    }>
    nextExploration?: string
  }
  content: string
}

export default function ExplorationPage({ params }: ExplorationPageProps) {
  const router = useRouter()
  const [exploration, setExploration] = useState<Exploration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExploration = async () => {
      try {
        const response = await fetch(`/api/explorations/${params.explorationId}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/highlights')
            return
          }
          throw new Error('Failed to fetch exploration')
        }
        
        const data = await response.json()
        setExploration(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exploration')
      } finally {
        setLoading(false)
      }
    }

    loadExploration()
  }, [params.explorationId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading exploration...</div>
      </div>
    )
  }

  if (error || !exploration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Exploration not found'}
          </h1>
          <Link 
            href="/highlights" 
            className="text-blue-600 hover:underline"
          >
            ← Back to Highlights
          </Link>
        </div>
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
    strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    code: ({children, className}) => {
      const isInline = !className
      return isInline ? (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-purple-600 dark:text-purple-400">
          {children}
        </code>
      ) : (
        <code className={className}>{children}</code>
      )
    },
    a: ({children, href}) => (
      <a href={href} className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline">
        {children}
      </a>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader 
          backLink={{ 
            href: exploration.metadata?.relatedTopic ? `/journey/study-risks/${exploration.metadata.relatedTopic}` : '/highlights', 
            label: 'Back' 
          }}
          showViewModeToggle={false}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/journey" className="text-purple-600 hover:text-purple-800 dark:text-purple-400">
                Journey
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/highlights" className="text-purple-600 hover:text-purple-800 dark:text-purple-400">
                Highlights
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 dark:text-gray-300">
              Exploration
            </li>
          </ol>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                Philosophical Exploration
              </span>
              <span>📚 {exploration.metadata.readingTime}</span>
              {exploration.metadata.lastUpdated && (
                <span>📅 Updated: {new Date(exploration.metadata.lastUpdated).toLocaleDateString()}</span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{exploration.metadata.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {exploration.metadata.description}
            </p>
            
            {exploration.metadata.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {exploration.metadata.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Key Questions */}
          {exploration.metadata.keyQuestions && (
            <div className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-semibold mb-3">🤔 Key Questions Explored</h3>
              <ul className="space-y-2">
                {exploration.metadata.keyQuestions.map((question: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main content */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-gray-900 dark:prose-headings:text-gray-100
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-strong:text-gray-900 dark:prose-strong:text-gray-100
            prose-code:text-purple-600 dark:prose-code:text-purple-400
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-ul:list-disc prose-ol:list-decimal
            prose-a:text-purple-600 hover:prose-a:text-purple-800 dark:prose-a:text-purple-400 dark:hover:prose-a:text-purple-300"
          >
            <ReactMarkdown components={markdownComponents}>
              {exploration.content}
            </ReactMarkdown>
          </div>

          {/* Discussion Prompts */}
          {exploration.metadata.discussionPrompts && (
            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">💭 For Further Discussion</h3>
              <div className="space-y-3">
                {exploration.metadata.discussionPrompts.map((prompt: string, index: number) => (
                  <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Resources */}
          {exploration.metadata.relatedResources && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Related Resources</h3>
              <ul className="space-y-2">
                {exploration.metadata.relatedResources.map((resource: any, index: number) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline"
                      target={resource.external ? "_blank" : undefined}
                      rel={resource.external ? "noopener noreferrer" : undefined}
                    >
                      {resource.title}
                      {resource.external && " ↗"}
                    </a>
                    {resource.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/highlights"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back to Highlights
            </Link>

            {exploration.metadata.nextExploration && (
              <Link
                href={`/journey/deep-dives/explorations/${exploration.metadata.nextExploration}`}
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Next Exploration →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}