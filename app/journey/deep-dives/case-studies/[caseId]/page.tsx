'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { getCaseStudy } from '@/lib/case-studies'
import InteractiveTransition from '@/components/InteractiveTransition'

interface CaseStudyPageProps {
  params: {
    caseId: string
  }
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  const [metadata, setMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCaseStudy = async () => {
      const caseStudy = await getCaseStudy(params.caseId)
      if (!caseStudy) {
        router.push('/highlights')
        return
      }
      
      setContent(caseStudy.content)
      setMetadata(caseStudy.metadata)
      setLoading(false)
    }

    loadCaseStudy()
  }, [params.caseId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading case study...</div>
      </div>
    )
  }

  // Markdown components configuration
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
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    code: ({children, className}) => {
      const isInline = !className
      return isInline ? (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-400">
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
    a: ({children, href}) => (
      <a href={href} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
        {children}
      </a>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader 
          backLink={{ 
            href: metadata?.relatedTopic ? `/journey/study-risks/${metadata.relatedTopic}` : '/highlights', 
            label: metadata?.relatedTopic ? 'Back to Topic' : 'Back to Highlights' 
          }}
          showViewModeToggle={false}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/journey" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Journey
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/highlights" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Highlights
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 dark:text-gray-300">
              Case Study
            </li>
          </ol>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Header with metadata */}
          {metadata && (
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                  Case Study
                </span>
                {metadata.readingTime && (
                  <span>⏱️ {metadata.readingTime}</span>
                )}
                {metadata.lastUpdated && (
                  <span>📅 Updated: {new Date(metadata.lastUpdated).toLocaleDateString()}</span>
                )}
              </div>
              
              {metadata.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {metadata.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main content */}
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
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>

          {/* Related resources */}
          {metadata?.relatedResources && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Related Resources</h3>
              <ul className="space-y-2">
                {metadata.relatedResources.map((resource: any, index: number) => (
                  <li key={index}>
                    <a 
                      href={resource.url} 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
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

          {/* Interactive notebook link if available */}
          {metadata?.notebookUrl && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🧪 Try It Yourself</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Explore this concept hands-on with our interactive notebook.
              </p>
              <a 
                href={metadata.notebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Open Interactive Notebook
              </a>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={metadata?.relatedTopic ? `/journey/study-risks/${metadata.relatedTopic}` : '/highlights'}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← {metadata?.relatedTopic ? 'Back to Topic' : 'Back to Highlights'}
            </Link>

            {metadata?.nextCaseStudy && (
              <Link
                href={`/journey/deep-dives/case-studies/${metadata.nextCaseStudy}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Next Case Study →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}