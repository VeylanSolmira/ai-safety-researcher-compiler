'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProgress, markTopicComplete, markTopicStarted, getProgressStats, UserProgress } from '@/lib/progress'

// Create a custom event for progress updates
const PROGRESS_UPDATE_EVENT = 'progressUpdate'

// Custom hook for progress tracking
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [stats, setStats] = useState({ total: 0, started: 0, completed: 0, percentage: 0 })

  // Update stats
  const updateStats = useCallback(() => {
    const newStats = getProgressStats()
    setStats(newStats)
  }, [])

  // Load progress on mount and listen for updates
  useEffect(() => {
    const loadProgress = () => {
      const userProgress = getProgress()
      setProgress(userProgress)
      updateStats()
    }
    
    // Initial load
    loadProgress()
    
    // Listen for progress updates from other components
    const handleProgressUpdate = () => {
      loadProgress()
    }
    
    window.addEventListener(PROGRESS_UPDATE_EVENT, handleProgressUpdate)
    
    return () => {
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleProgressUpdate)
    }
  }, [updateStats])

  // Mark topic as complete/incomplete
  const toggleComplete = useCallback((topicId: string) => {
    if (!progress) return
    
    const isCompleted = progress.progress[topicId]?.completed || false
    markTopicComplete(topicId, !isCompleted)
    
    // Reload progress
    const updatedProgress = getProgress()
    setProgress(updatedProgress)
    updateStats()
    
    // Notify other components
    window.dispatchEvent(new Event(PROGRESS_UPDATE_EVENT))
  }, [progress, updateStats])

  // Mark topic as started
  const markStarted = useCallback((topicId: string) => {
    markTopicStarted(topicId)
    const updatedProgress = getProgress()
    setProgress(updatedProgress)
    updateStats()
    
    // Notify other components
    window.dispatchEvent(new Event(PROGRESS_UPDATE_EVENT))
  }, [updateStats])

  // Check if topic is completed
  const isCompleted = useCallback((topicId: string): boolean => {
    return progress?.progress[topicId]?.completed || false
  }, [progress])

  // Check if topic is started
  const isStarted = useCallback((topicId: string): boolean => {
    return !!progress?.progress[topicId]
  }, [progress])

  return {
    progress,
    stats,
    toggleComplete,
    markStarted,
    isCompleted,
    isStarted
  }
}