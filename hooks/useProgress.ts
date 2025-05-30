'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProgress, markTopicComplete, markTopicStarted, getProgressStats, UserProgress } from '@/lib/progress'

// Custom hook for progress tracking
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [stats, setStats] = useState({ total: 0, completed: 0, percentage: 0 })

  // Update stats
  const updateStats = useCallback(() => {
    const newStats = getProgressStats()
    setStats(newStats)
  }, [])

  // Load progress on mount
  useEffect(() => {
    const userProgress = getProgress()
    setProgress(userProgress)
    updateStats()
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
  }, [progress, updateStats])

  // Mark topic as started
  const markStarted = useCallback((topicId: string) => {
    markTopicStarted(topicId)
    const updatedProgress = getProgress()
    setProgress(updatedProgress)
    updateStats()
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