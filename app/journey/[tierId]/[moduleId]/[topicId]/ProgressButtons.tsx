'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getJourneyProgress, markTopicComplete } from '@/lib/journey'

interface ProgressButtonsProps {
  tierId: string
  moduleId: string
  topicId: string
  nextTopicId?: string
  showMarkComplete?: boolean
}

export default function ProgressButtons({ 
  tierId, 
  moduleId, 
  topicId, 
  nextTopicId,
  showMarkComplete = false 
}: ProgressButtonsProps) {
  const router = useRouter()
  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    async function checkProgress() {
      const progress = await getJourneyProgress()
      if (progress) {
        const completedTopics = progress.topicsCompleted?.[tierId]?.[moduleId] || []
        setIsComplete(completedTopics.includes(topicId))
      }
    }
    checkProgress()
  }, [mounted, tierId, moduleId, topicId])

  const handleComplete = async () => {
    setLoading(true)
    try {
      await markTopicComplete(tierId, moduleId, topicId)
      setIsComplete(true)
      
      // Navigate to next topic if available
      if (nextTopicId) {
        router.push(`/journey/${tierId}/${moduleId}/${nextTopicId}`)
      } else {
        // Module complete, go back to module page
        router.push(`/journey/${tierId}/${moduleId}`)
      }
    } catch (error) {
      console.error('Failed to mark topic complete:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    // Return a placeholder with consistent dimensions
    if (showMarkComplete) {
      return (
        <div className="px-6 py-3 bg-gray-700 rounded-lg text-transparent font-medium w-[180px] h-[48px]">
          Loading...
        </div>
      )
    }
    return null
  }

  // Show completion status in header
  if (!showMarkComplete && isComplete) {
    return (
      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
        Completed
      </span>
    )
  }

  // Show mark complete button at bottom
  if (showMarkComplete && !isComplete) {
    return (
      <button
        onClick={handleComplete}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] rounded-lg text-white font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Marking...' : 'Mark as Complete'}
      </button>
    )
  }

  return null
}