import { useState, useEffect } from 'react'
import { LearningPath } from '@/lib/journey'

const LEARNING_PATH_KEY = 'ai-safety-learning-path'

export function useLearningPath() {
  const [selectedPath, setSelectedPath] = useState<LearningPath>('all')
  const [loading, setLoading] = useState(true)

  // Load saved path from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LEARNING_PATH_KEY)
      if (saved && ['all', 'technical-safety', 'governance', 'engineering', 'research'].includes(saved)) {
        setSelectedPath(saved as LearningPath)
      }
      setLoading(false)
    }
  }, [])

  // Save path when it changes
  const updateSelectedPath = (path: LearningPath) => {
    setSelectedPath(path)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEARNING_PATH_KEY, path)
    }
  }

  return {
    selectedPath,
    setSelectedPath: updateSelectedPath,
    loading
  }
}