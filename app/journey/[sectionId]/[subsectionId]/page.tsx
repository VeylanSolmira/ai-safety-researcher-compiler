'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { getSection, getJourneyProgress, markSubsectionComplete, markSectionStarted } from '@/lib/journey'
import { useViewMode } from '@/contexts/ViewModeContext'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import InteractiveTransition from '@/components/InteractiveTransition'

interface SubsectionPageProps {
  params: {
    sectionId: string
    subsectionId: string
  }
}

export default function SubsectionPage({ params }: SubsectionPageProps) {
  const router = useRouter()
  const { viewMode } = useViewMode()
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState<any>(null)
  const [subsection, setSubsection] = useState<any>(null)
  const [nextSubsection, setNextSubsection] = useState<any>(null)

  useEffect(() => {
    const loadContent = async () => {
      // Get section and subsection info
      const sectionData = getSection(params.sectionId)
      if (!sectionData) {
        router.push('/journey')
        return
      }
      
      const subsectionData = sectionData.subsections?.find(s => s.id === params.subsectionId)
      if (!subsectionData) {
        router.push(`/journey/${params.sectionId}`)
        return
      }

      setSection(sectionData)
      setSubsection(subsectionData)

      // Find next subsection
      const currentIndex = sectionData.subsections?.findIndex(s => s.id === params.subsectionId) || 0
      if (sectionData.subsections && currentIndex < sectionData.subsections.length - 1) {
        setNextSubsection(sectionData.subsections[currentIndex + 1])
      }

      // Mark section as started
      await markSectionStarted(params.sectionId)

      // Load content from roadmap
      try {
        const response = await fetch(`/api/topic-content?roadmap=ai-safety-researcher&topic=${subsectionData.roadmapContentId}&viewMode=${viewMode}`)
        if (response.ok) {
          const data = await response.json()
          setContent(data.content)
        }
      } catch (error) {
        console.error('Failed to load subsection content:', error)
      }

      setLoading(false)
    }

    loadContent()
  }, [params.sectionId, params.subsectionId, viewMode, router])

  const handleComplete = async () => {
    await markSubsectionComplete(params.sectionId, params.subsectionId)
    
    // Navigate to next subsection or back to section
    if (nextSubsection) {
      router.push(`/journey/${params.sectionId}/${nextSubsection.id}`)
    } else {
      router.push(`/journey/${params.sectionId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading subsection...</div>
      </div>
    )
  }

  if (!section || !subsection) {
    return null
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
    strong: ({children}) => <strong className="font-bold">{children}</strong>,
    a: ({children, href}) => (
      <a href={href} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
        {children}
      </a>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          backLink={{ 
            href: `/journey/${params.sectionId}`, 
            label: `Back to ${section.title}` 
          }}
          showViewModeToggle={true}
        />

        <div className="max-w-4xl mx-auto">
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
                <Link href={`/journey/${params.sectionId}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                  {section.title}
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 dark:text-gray-300">
                {subsection.title}
              </li>
            </ol>
          </nav>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{subsection.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ {subsection.estimatedTime}</span>
                <span>📚 From: {section.title}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8
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
                {content.replace(/<!--[\s\S]*?-->/g, '')}
              </ReactMarkdown>
            </div>

            {/* Interactive Transition (if this is the last subsection) */}
            {!nextSubsection && (
              <InteractiveTransition 
                fromSection={params.sectionId}
                toSection="next"
                sectionId={params.sectionId}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={`/journey/${params.sectionId}`}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Back to {section.title}
              </Link>

              <button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-colors"
              >
                {nextSubsection ? 'Complete & Next →' : 'Complete Subsection ✓'}
              </button>
            </div>

            {/* Progress indicator */}
            {nextSubsection && (
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Next: {nextSubsection.title}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}