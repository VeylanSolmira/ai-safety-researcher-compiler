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
import { useState, useEffect } from 'react'

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
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Select content based on view mode
  const displayContent = viewMode === 'personal' && topic.contentPersonal 
    ? topic.contentPersonal 
    : topic.content

  // Initialize edit content when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditContent(displayContent || '')
    }
  }, [isEditing, displayContent])

  // Track unsaved changes
  useEffect(() => {
    if (isEditing && editContent !== displayContent) {
      setHasUnsavedChanges(true)
    } else {
      setHasUnsavedChanges(false)
    }
  }, [editContent, displayContent, isEditing])

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && e.metaKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if (isEditing && e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, editContent])

  const handleSave = async () => {
    // Warn if content is being significantly reduced
    const originalLength = displayContent?.length || 0
    const newLength = editContent.length
    const reductionPercent = originalLength > 0 ? ((originalLength - newLength) / originalLength) * 100 : 0
    
    if (reductionPercent > 50 && originalLength > 100) {
      const confirmSave = window.confirm(
        `Warning: You're reducing the content by ${Math.round(reductionPercent)}% ` +
        `(from ${originalLength} to ${newLength} characters). ` +
        `Are you sure you want to save?`
      )
      if (!confirmSave) return
    }
    
    setIsSaving(true)
    try {
      const updateData = viewMode === 'personal' 
        ? { contentPersonal: editContent }
        : { contentAcademic: editContent }

      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to save content')
      }

      // Update local state
      if (viewMode === 'personal') {
        topic.contentPersonal = editContent
      } else {
        topic.content = editContent
      }

      setIsEditing(false)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?')
      if (!confirmCancel) return
    }
    setIsEditing(false)
    setEditContent('')
    setHasUnsavedChanges(false)
  }

  // Check if we're in development mode - using a client-side approach
  const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost'

  return (
    <div className="space-y-8">
      {/* Database content is the primary source */}
      <div className="bg-gray-900 rounded-lg p-8 relative">
        {isDevelopment && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Edit Content
          </button>
        )}
        
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Editing {viewMode === 'personal' ? 'Personal' : 'Academic'} Content
              </h3>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <span className="text-yellow-400 text-sm">Unsaved changes</span>
                )}
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-[600px] p-4 bg-gray-800 text-gray-100 font-mono text-sm rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter markdown content..."
            />
            <p className="text-xs text-gray-500">
              Tip: Use Markdown syntax for formatting. Changes are saved to the database. 
              <span className="ml-2">⌘S to save, ESC to cancel</span>
            </p>
          </div>
        ) : displayContent ? (
          <ReactMarkdown components={markdownComponents}>
            {displayContent}
          </ReactMarkdown>
        ) : (
          <div className="text-center">
            <p className="text-gray-400">Content coming soon...</p>
            {isDevelopment && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add Content
              </button>
            )}
          </div>
        )}
      </div>
      
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