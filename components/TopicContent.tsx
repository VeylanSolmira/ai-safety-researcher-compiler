'use client'

import { useEffect, useState } from 'react'
import { remark } from 'remark'
import html from 'remark-html'
import { useProgress } from '@/hooks/useProgress'
import { useViewMode } from '@/contexts/ViewModeContext'

interface TopicContentProps {
  roadmapSlug: string
  topicId: string
  topicLabel?: string
  onClose: () => void
}

export default function TopicContent({ roadmapSlug, topicId, topicLabel, onClose }: TopicContentProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPersonalContent, setIsPersonalContent] = useState(false)
  const { isCompleted, toggleComplete, markStarted } = useProgress()
  const { viewMode, isPersonalMode } = useViewMode()

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/topic-content?roadmap=${roadmapSlug}&topic=${topicId}&viewMode=${viewMode}`)
        
        if (!response.ok) {
          throw new Error('Content not found')
        }
        
        const { content: markdown, isPersonalContent: isPersonal } = await response.json()
        setIsPersonalContent(isPersonal || false)
        
        // Process resource type indicators
        const processedMarkdown = markdown.replace(
          /\[@(\w+)@([^\]]+)\]\(([^)]+)\)/g,
          (_match: string, type: string, text: string, url: string) => {
            const icons: Record<string, string> = {
              article: '📄',
              video: '🎥',
              course: '🎓',
              official: '📚',
              opensource: '💻',
            }
            const icon = icons[type] || '🔗'
            return `[${icon} ${text}](${url})`
          }
        )
        
        // Convert markdown to HTML
        const processedContent = await remark()
          .use(html)
          .process(processedMarkdown)
        
        // Add target="_blank" to all links
        const htmlWithNewTabLinks = processedContent.toString().replace(
          /<a href=/g,
          '<a target="_blank" rel="noopener noreferrer" href='
        )
        
        setContent(htmlWithNewTabLinks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
    // Mark as started when viewing content
    markStarted(topicId)
  }, [roadmapSlug, topicId, viewMode]) // Remove markStarted from dependencies

  return (
    <div className="absolute right-0 top-0 w-96 h-full bg-white dark:bg-gray-800 shadow-lg overflow-hidden flex flex-col z-50">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back
          </button>
          <button
            onClick={() => toggleComplete(topicId)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isCompleted(topicId)
                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {isCompleted(topicId) ? '✓ Completed' : 'Mark Complete'}
          </button>
        </div>
        {topicLabel && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{topicLabel}</h2>
            {isPersonalContent && isPersonalMode && (
              <div className="mt-2 flex items-center text-sm text-amber-600">
                <span className="mr-1">💭</span>
                <span>Personal perspective</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-800">No content available for this topic yet.</p>
            <p className="text-sm text-yellow-600 mt-2">{error}</p>
          </div>
        )}
        
        {!loading && !error && content && (
          <div 
            className="topic-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  )
}