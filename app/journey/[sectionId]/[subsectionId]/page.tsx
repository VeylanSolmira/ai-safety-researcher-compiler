'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { getSection, getJourneyProgress, markSubsectionComplete, markSectionStarted } from '@/lib/journey'
import { useViewMode } from '@/contexts/ViewModeContext'
import ReactMarkdown from 'react-markdown'
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
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <ReactMarkdown>
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