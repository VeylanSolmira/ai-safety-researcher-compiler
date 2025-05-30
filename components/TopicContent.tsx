'use client'

import { useEffect, useState } from 'react'
import { remark } from 'remark'
import html from 'remark-html'

interface TopicContentProps {
  roadmapSlug: string
  topicId: string
  onClose: () => void
}

export default function TopicContent({ roadmapSlug, topicId, onClose }: TopicContentProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/topic-content?roadmap=${roadmapSlug}&topic=${topicId}`)
        
        if (!response.ok) {
          throw new Error('Content not found')
        }
        
        const { content: markdown } = await response.json()
        
        // Convert markdown to HTML
        const processedContent = await remark()
          .use(html)
          .process(markdown)
        
        setContent(processedContent.toString())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [roadmapSlug, topicId])

  return (
    <div className="absolute right-0 top-0 w-96 h-full bg-white shadow-lg overflow-hidden flex flex-col">
      <div className="p-6 border-b">
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
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